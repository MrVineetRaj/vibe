import { PrismaClient } from "@/generated/prisma";
import { env } from "./envConf";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const db = globalForPrisma.prisma || new PrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export { db };
