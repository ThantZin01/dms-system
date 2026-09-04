"use server";

import prisma from "@/lib/db";
import { personSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { auth, checkAdmin } from "@/lib/auth";
import { headers } from "next/headers";

export async function createPerson(data: any) {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { success: false, error: error.message };
  }

  const parsed = personSchema.safeParse({
    ...data,
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const person = await prisma.person.create({
      data: parsed.data,
    });
    revalidatePath("/people");
    return { success: true, data: person };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPeople() {
  try {
    const people = await prisma.person.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: people };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePerson(id: string, data: any) {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { success: false, error: error.message };
  }

  const parsed = personSchema.safeParse({
    ...data,
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const person = await prisma.person.update({
      where: { id },
      data: parsed.data,
    });
    revalidatePath("/people");
    return { success: true, data: person };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePerson(id: string) {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { success: false, error: error.message };
  }

  try {
    await prisma.person.delete({
      where: { id },
    });
    revalidatePath("/people");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
