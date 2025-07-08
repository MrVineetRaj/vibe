import { z } from "zod";

import { MessageRole, MessageType } from "@/generated/prisma";
import { db } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { inngest } from "@/inngest/client";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";

export const messageRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project Id Required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const messages = await db.message.findMany({
          where: {
            projectId: input.projectId,
            userId: ctx.auth.userId,
          },
          orderBy: {
            updatedAt: "asc",
          },
          include: {
            fragment: true,
          },
        });

        return messages;
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
          .min(1, { message: "Message is required" })
          .max(10000, { message: "Value is too long" }),
        projectId: z.string().min(1, { message: "Project Id Required" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const existingProject = await db.project.findUnique({
          where: {
            id: input.projectId,
            userId: ctx.auth.userId,
          },
        });

        if (!existingProject) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }

        await consumeCredits();

        await db.message.create({
          data: {
            content: input.value,
            role: MessageRole.USER,
            type: MessageType.RESULT,
            projectId: existingProject.id,
            userId: ctx.auth.userId,
          },
        });

        await inngest.send({
          name: "app/code.agent",
          data: {
            value: input.value,
            projectId: input.projectId,
            userId: ctx.auth.userId,
          },
        });

        return "Message created";
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
        }

        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong try again later",
          });
        } else {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "You ran out of credits",
          });
        }
      }
    }),
});
