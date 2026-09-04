import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";

// Safely strip trailing slashes that Vercel or browsers sometimes append automatically
const cleanUrl = (url: string | undefined) => url ? url.replace(/\/$/, "") : "";

export const auth = betterAuth({
    baseURL: cleanUrl(process.env.BETTER_AUTH_URL) || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
    trustedOrigins: [
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
        process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "",
        process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : ""
    ].map(cleanUrl).filter(Boolean),
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    // Custom logic to prevent public signup can be added via hooks,
    // but the simplest approach is simply NOT exposing a signup page
    // to the public, and only allowing admins to access the creation form.
});

import { headers } from "next/headers";

export async function checkAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized: Not logged in");
  }

  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  
  if (dbUser?.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin role required");
  }
  return dbUser;
}
