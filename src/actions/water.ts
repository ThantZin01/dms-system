"use server";

import prisma from "@/lib/db";
import { waterBottleSchema, waterPurchaseSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/auth";

export async function getBottles() {
  try {
    const bottles = await prisma.waterBottle.findMany({
      orderBy: { createdAt: "asc" }
    });
    return { success: true, data: bottles };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addBottle(data: any) {
  try {
    await checkAdmin();
    const parsed = waterBottleSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Validation failed" };
    }

    const bottle = await prisma.waterBottle.create({
      data: parsed.data
    });
    revalidatePath("/water");
    revalidatePath("/");
    return { success: true, data: bottle };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateBottleStatus(id: string, status: "FULL" | "EMPTY") {
  try {
    await checkAdmin();
    const bottle = await prisma.waterBottle.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/water");
    revalidatePath("/");
    return { success: true, data: bottle };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteBottle(id: string) {
  try {
    await checkAdmin();
    await prisma.waterBottle.delete({ where: { id } });
    revalidatePath("/water");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getWaterPurchases() {
  try {
    const purchases = await prisma.waterPurchase.findMany({
      include: { sharedBy: true },
      orderBy: { purchaseDate: "desc" }
    });
    return { success: true, data: purchases };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function logWaterPurchase(data: any) {
  try {
    await checkAdmin();
    const parsed = waterPurchaseSchema.safeParse({
      ...data,
      purchaseDate: new Date(data.purchaseDate as string),
    });

    if (!parsed.success) {
      return { success: false, error: "Validation failed" };
    }

    const costPerPerson = parsed.data.sharedByIds.length > 0 
      ? parsed.data.totalCost / parsed.data.sharedByIds.length 
      : parsed.data.totalCost;

    const purchase = await prisma.waterPurchase.create({
      data: {
        quantity: parsed.data.quantity,
        totalCost: parsed.data.totalCost,
        costPerPerson,
        purchaseDate: parsed.data.purchaseDate,
        sharedBy: {
          connect: parsed.data.sharedByIds.map((id: string) => ({ id }))
        }
      }
    });

    // Automatically fill empty bottles up to the quantity purchased
    const emptyBottles = await prisma.waterBottle.findMany({
      where: { status: "EMPTY" },
      orderBy: { updatedAt: "asc" },
      take: parsed.data.quantity
    });

    if (emptyBottles.length > 0) {
      await prisma.waterBottle.updateMany({
        where: { id: { in: emptyBottles.map((b: any) => b.id) } },
        data: { status: "FULL" }
      });
    }

    const remainingQuantity = parsed.data.quantity - emptyBottles.length;
    if (remainingQuantity > 0) {
      const totalBottles = await prisma.waterBottle.count();
      const newBottles = Array.from({ length: remainingQuantity }).map((_, i) => ({
        label: `Bottle ${totalBottles + i + 1}`,
        status: "FULL",
      }));
      await prisma.waterBottle.createMany({
        data: newBottles
      });
    }

    revalidatePath("/water");
    return { success: true, data: purchase };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteWaterPurchase(id: string) {
  try {
    await checkAdmin();
    await prisma.waterPurchase.delete({ where: { id } });
    revalidatePath("/water");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
