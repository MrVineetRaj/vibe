import { z } from "zod";

import { MessageRole, MessageType } from "@/generated/prisma";
import { db } from "@/lib/prisma";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { inngest } from "@/inngest/client";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";
import { OpenAI } from "openai";

export const projectsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, "Project Id is required"),
      })
    )
    .query(async ({ input, ctx }) => {
      // try {
      const project = await db.project.findUnique({
        where: {
          id: input.projectId,
          userId: ctx.auth.userId,
        },
      });

      if (!project) {
        return null;
      }

      return project;
      // } catch (error) {
      //   if (process.env.NODE_ENV === "development") {
      //     console.log(error);
      //   }
      //   throw new TRPCError({
      //     code: "INTERNAL_SERVER_ERROR",
      //     message: "Something went wrong try again later",
      //   });
      // }
    }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    try {
      const projects = await db.project.findMany({
        where: {
          userId: ctx.auth.userId,
        },
        orderBy: {
          updatedAt: "asc",
        },
      });

      return projects;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log(error);
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong try again later",
      });
    }
  }),
  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Prompt is required" })
          .max(10000, { message: "Prompt is too long" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await consumeCredits();
        const { has } = ctx.auth;
        const isOneProPlan = has?.({ plan: "pro" });
        const client = new OpenAI();
        const projectName = await client.chat.completions.create({
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content:
                "Based on user input generate a project title if user gave a title then just return that title, title could be of max 2 words so just give me the generated title no other text please ",
            },
            {
              role: "user",
              content: `user wants to generate a project with description ${input.value}`,
            },
          ],
        });

        const createdProject = await db.project.create({
          data: {
            name:
              (projectName.choices[0].message.content as string) ??
              generateSlug(2, {
                format: "kebab",
              }),
            userId: ctx.auth.userId,
            messages: {
              create: {
                content: input.value,
                role: MessageRole.USER,
                type: MessageType.RESULT,
                userId: ctx.auth.userId,
              },
            },
          },
        });

        await inngest.send({
          name: "app/code.agent",
          data: {
            value: input.value,
            projectId: createdProject.id,
            userId: ctx.auth.userId,
            plan: isOneProPlan ? "pro" : "free_user",
          },
        });

        return { id: createdProject.id };
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong try again later",
        });
      }
    }),
});
