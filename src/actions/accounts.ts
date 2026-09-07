"use server";

import prisma from "@/lib/db";
import { accountSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { hashPassword } from "better-auth/crypto";
import { checkAdmin, auth } from "@/lib/auth";

export async function createAccountAction(data: any) {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { success: false, error: error.message };
  }

  const parsed = accountSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) {
        throw new Error("User with this email already exists");
    }

    // Use better-auth directly so it creates the exact Account structure it expects
    // Note: We intentionally don't pass headers so it doesn't log the admin out
    const response = await auth.api.signUpEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
        name: parsed.data.name || "",
      }
    });

    if (!response || !response.user) {
      throw new Error("Failed to create user with better-auth");
    }

    // Update the role after creation
    const user = await prisma.user.update({
      where: { id: response.user.id },
      data: { role: parsed.data.role },
    });

    revalidatePath("/accounts");
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAccounts() {
  try {
    const accounts = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: accounts };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function editAccountAction(id: string, data: any) {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { success: false, error: error.message };
  }

  const parsed = accountSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    // Check if email is already taken by another user
    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing && existing.id !== id) {
      throw new Error("User with this email already exists");
    }

    const updateData: any = {
      email: parsed.data.email,
      name: parsed.data.name,
      role: parsed.data.role,
    };

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    if (parsed.data.password) {
      const hashedPassword = await hashPassword(parsed.data.password);
      await prisma.account.updateMany({
        where: { userId: id, providerId: "credential" },
        data: { password: hashedPassword },
      });
    }

    revalidatePath("/accounts");
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAccountAction(id: string) {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { success: false, error: error.message };
  }

  try {
    // Better Auth uses Prisma cascading deletes typically, but we will explicitly delete Account and Session first if needed, 
    // or just rely on Prisma's cascade if configured. Let's delete user directly.
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/accounts");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
