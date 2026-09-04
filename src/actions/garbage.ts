"use server";

import prisma from "@/lib/db";
import { garbageRecordSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/auth";

export async function createGarbageRecord(data: any) {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { success: false, error: error.message };
  }

  const parsed = garbageRecordSchema.safeParse({
    ...data,
    dateThrown: new Date(data.dateThrown as string),
    isTurn: Boolean(data.isTurn),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const record = await prisma.garbageRecord.create({
      data: parsed.data,
    });

    // After creating the record, the rotation changes. 
    // Find who is 'Up Next' now and send them a notification if they have an account.
    const rotationRes = await getGarbageRotation();
    if (rotationRes.success && rotationRes.data && rotationRes.data.length > 0) {
      const nextPerson = rotationRes.data[0];
      if (nextPerson.userId) {
        await prisma.notification.create({ // Trigger TS reload
          data: {
            userId: nextPerson.userId,
            title: "Garbage Duty Alert! 🗑️",
            message: `Hey ${nextPerson.fullName}, it is now your turn to throw the garbage!`,
          }
        });
      }
    }

    revalidatePath("/garbage");
    return { success: true, data: record };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateGarbageRecord(id: string, data: any) {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { success: false, error: error.message };
  }

  const parsed = garbageRecordSchema.safeParse({
    ...data,
    dateThrown: new Date(data.dateThrown as string),
    isTurn: Boolean(data.isTurn),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const record = await prisma.garbageRecord.update({
      where: { id },
      data: parsed.data,
    });
    revalidatePath("/garbage");
    return { success: true, data: record };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteGarbageRecord(id: string) {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { success: false, error: error.message };
  }

  try {
    await prisma.garbageRecord.delete({
      where: { id },
    });
    revalidatePath("/garbage");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getGarbageRecords() {
  try {
    const records = await prisma.garbageRecord.findMany({
      include: { person: true },
      orderBy: { dateThrown: "desc" },
    });
    return { success: true, data: records };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getGarbageRotation() {
  try {
    const activePeople = await prisma.person.findMany({
      where: { isActive: true },
      select: {
        id: true,
        userId: true,
        fullName: true,
        createdAt: true,
        garbageRecords: {
          orderBy: { dateThrown: 'desc' },
          take: 1,
          select: { dateThrown: true }
        }
      }
    });

    const rotation = activePeople.map(person => ({
      id: person.id,
      userId: person.userId,
      fullName: person.fullName,
      createdAt: person.createdAt,
      lastThrown: person.garbageRecords[0]?.dateThrown || null
    })).sort((a, b) => {
      // Both never threw: respect insertion order (earlier createdAt = UP NEXT)
      if (!a.lastThrown && !b.lastThrown) return a.createdAt.getTime() - b.createdAt.getTime();
      // Never threw goes before someone who has thrown
      if (!a.lastThrown) return -1;
      if (!b.lastThrown) return 1;
      // Both threw: whoever threw longer ago goes first
      return a.lastThrown.getTime() - b.lastThrown.getTime();
    });

    return { success: true, data: rotation };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
