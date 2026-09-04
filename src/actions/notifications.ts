"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getUserNotifications() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return { error: "Unauthorized" };

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return { data: notifications };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { error: "Failed to fetch notifications" };
  }
}

export async function markAsRead(notificationId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return { error: "Unauthorized" };

    await prisma.notification.update({
      where: { 
        id: notificationId,
        userId: session.user.id 
      },
      data: { isRead: true },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { error: "Failed to update notification" };
  }
}

export async function markAllAsRead() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return { error: "Unauthorized" };

    await prisma.notification.updateMany({
      where: { 
        userId: session.user.id,
        isRead: false 
      },
      data: { isRead: true },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error marking all as read:", error);
    return { error: "Failed to update notifications" };
  }
}

export async function createNotification(userId: string, title: string, message: string) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
      },
    });
    
    // Attempt to revalidate path to reflect the new notification
    // It's possible the user is currently on the app
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { error: "Failed to create notification" };
  }
}
