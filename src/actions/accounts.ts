"use server";

import prisma from "@/lib/db";
import { accountSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { hashPassword } from "better-auth/crypto";
import { checkAdmin } from "@/lib/auth";

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

    const hashedPassword = await hashPassword(parsed.data.password);

    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        role: parsed.data.role,
      },
    });

    await prisma.account.create({
      data: {
        userId: user.id,
        accountId: user.id,
        providerId: "credential",
        password: hashedPassword,
        issuer: "local:credential",
      }
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
