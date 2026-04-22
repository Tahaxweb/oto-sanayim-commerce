import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Prisma + pg adapter’ın route bundle içinde bozulmasını önler */
  serverExternalPackages: ["@prisma/adapter-pg", "pg"],
};

export default nextConfig;
