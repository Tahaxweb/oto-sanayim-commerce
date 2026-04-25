import { PrismaClient } from "../prisma/generated-client/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const PRISMA_GLOBAL_KEY = "__oto_sanayim_prisma_v3__" as const;

const globalForPrisma = globalThis as typeof globalThis & {
  [PRISMA_GLOBAL_KEY]?: PrismaClient;
};

export const prisma =
  globalForPrisma[PRISMA_GLOBAL_KEY] ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma[PRISMA_GLOBAL_KEY] = prisma;
}
