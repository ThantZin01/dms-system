"use server";

import prisma from "@/lib/db";
import { dormitoryFeeSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/auth";

export async function createFee(data: any) {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { success: false, error: error.message };
  }

  const parsed = dormitoryFeeSchema.safeParse({
    ...data,
    paymentDate: new Date(data.paymentDate as string),
    periodStart: new Date(data.periodStart as string),
    periodEnd: new Date(data.periodEnd as string),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  
  try {
    const fee = await prisma.dormitoryFee.create({
      data: {
        ...parsed.data,
      },
    });
    revalidatePath("/fees");
    return { success: true, data: fee };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateFee(id: string, data: any) {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { success: false, error: error.message };
  }

  const parsed = dormitoryFeeSchema.safeParse({
    ...data,
    paymentDate: new Date(data.paymentDate as string),
    periodStart: new Date(data.periodStart as string),
    periodEnd: new Date(data.periodEnd as string),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const fee = await prisma.dormitoryFee.update({
      where: { id },
      data: {
        ...parsed.data,
      },
    });
    revalidatePath("/fees");
    return { success: true, data: fee };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteFee(id: string) {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { success: false, error: error.message };
  }

  try {
    await prisma.dormitoryFee.delete({
      where: { id },
    });
    revalidatePath("/fees");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getFees() {
  try {
    const fees = await prisma.dormitoryFee.findMany({
      include: { person: true },
      orderBy: { paymentDate: "desc" },
    });
    return { success: true, data: fees };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
