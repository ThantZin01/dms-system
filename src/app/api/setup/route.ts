import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    // Delete existing account and user
    await prisma.account.deleteMany({ where: { user: { email: 'admin@dorm.com' } } });
    await prisma.user.deleteMany({ where: { email: 'admin@dorm.com' } });

    // Use better auth to create the user
    const response = await auth.api.signUpEmail({
      body: {
        email: "admin@dorm.com",
        password: "password123",
        name: "System Admin",
      },
      headers: req.headers,
    });

    if (response?.user?.id) {
      await prisma.user.update({
        where: { id: response.user.id },
        data: { role: "ADMIN" }
      });
    }

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack });
  }
}
