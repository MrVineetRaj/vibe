import { z } from "zod";

import { MessageRole, MessageType } from "@/generated/prisma";
import { db } from "@/lib/prisma";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { inngest } from "@/inngest/client";
import { generateSlug } from "random-word-slugs";

export const projectsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const projects = await db.project.findMany({
      orderBy: {
        updatedAt: "asc",
      },
    });

    return projects;
  }),
  create: baseProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Prompt is required" })
          .max(10000, { message: "Prompt is too long" }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        console.log(db);
        const createdProject = await db.project.create({
          data: {
            name: generateSlug(2, {
              format: "kebab",
            }),
            messages: {
              create: {
                content: input.value,
                role: MessageRole.USER,
                type: MessageType.RESULT,
              },
            },
          },
        });

        console.log("Hello 2");

        await inngest.send({
          name: "app/code.agent",
          data: { value: input.value, projectId: createdProject.id },
        });

        return { id: createdProject.id };
      } catch (error) {
        console.error(error);
      }
    }),
});
