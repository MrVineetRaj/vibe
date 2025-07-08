import { z } from "zod";

import { MessageRole, MessageType } from "@/generated/prisma";
import { db } from "@/lib/prisma";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { inngest } from "@/inngest/client";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";

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
        const createdProject = await db.project.create({
          data: {
            name: generateSlug(2, {
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
