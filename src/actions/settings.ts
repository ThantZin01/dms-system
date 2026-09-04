"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});

async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    throw new Error("Unauthorized: Not logged in");
  }
  return session.user;
}

export async function updateProfile(data: any) {
  try {
    const user = await getSessionUser();
    
    const parsed = profileSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors };
    }

    // Check if email is taken by someone else
    if (parsed.data.email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
      if (existing) {
        return { success: false, error: "Email is already taken" };
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        image: parsed.data.image || null,
      },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePassword(data: any) {
  try {
    const user = await getSessionUser();
    
    const parsed = passwordSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors };
    }

    const account = await prisma.account.findFirst({
      where: { userId: user.id, providerId: "credential" },
    });

    if (!account || !account.password) {
      return { success: false, error: "Account configuration error" };
    }

    const isValid = await verifyPassword({ hash: account.password, password: parsed.data.currentPassword });
    if (!isValid) {
      return { success: false, error: "Incorrect current password" };
    }

    const hashedPassword = await hashPassword(parsed.data.newPassword);

    await prisma.account.update({
      where: { id: account.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
