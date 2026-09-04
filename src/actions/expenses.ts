"use server";

import prisma from "@/lib/db";
import { expenseSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/auth";

export async function createExpense(data: any) {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { success: false, error: error.message };
  }

  const parsed = expenseSchema.safeParse({
    ...data,
    expenseDate: new Date(data.expenseDate as string),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const costPerPerson = parsed.data.sharedByIds.length > 0 ? parsed.data.amount / parsed.data.sharedByIds.length : parsed.data.amount;

    const expense = await prisma.expense.create({
      data: {
        type: parsed.data.type,
        amount: parsed.data.amount,
        expenseDate: parsed.data.expenseDate,
        description: parsed.data.description,
        costPerPerson,
        sharedBy: {
          connect: parsed.data.sharedByIds.map(id => ({ id }))
        }
      },
    });
    revalidatePath("/expenses");
    return { success: true, data: expense };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateExpense(id: string, data: any) {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { success: false, error: error.message };
  }

  const parsed = expenseSchema.safeParse({
    ...data,
    expenseDate: new Date(data.expenseDate as string),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const costPerPerson = parsed.data.sharedByIds.length > 0 ? parsed.data.amount / parsed.data.sharedByIds.length : parsed.data.amount;

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        type: parsed.data.type,
        amount: parsed.data.amount,
        expenseDate: parsed.data.expenseDate,
        description: parsed.data.description,
        costPerPerson,
        sharedBy: {
          set: parsed.data.sharedByIds.map(id => ({ id }))
        }
      },
    });
    revalidatePath("/expenses");
    return { success: true, data: expense };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteExpense(id: string) {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { success: false, error: error.message };
  }

  try {
    await prisma.expense.delete({
      where: { id },
    });
    revalidatePath("/expenses");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getExpenses() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { expenseDate: "desc" },
    });
    return { success: true, data: expenses };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
