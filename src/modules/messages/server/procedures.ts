import { z } from "zod";

import { MessageRole, MessageType } from "@/generated/prisma";
import { db } from "@/lib/prisma";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { inngest } from "@/inngest/client";

export const messageRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const messages = await db.message.findMany({
      orderBy: {
        updatedAt: "asc",
      },
      include: {
        fragment: true,
      },
    });

    return messages;
  }),
  create: baseProcedure
    .input(
      z.object({
        value: z.string().min(1, { message: "Message is required" }),
        projectId: z.string().min(1, { message: "Project Id Required" }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        console.log("Hello");
        await db.message.create({
          data: {
            content: input.value,
            role: MessageRole.USER,
            type: MessageType.RESULT,
            projectId: input.projectId,
          },
        });
        console.log("Hello 2");

        await inngest.send({
          name: "app/code.agent",
          data: { value: input.value, projectId: input.projectId },
        });

        return "Message created";
      } catch (error) {
        console.error(error);
      }
    }),
});
