import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const res = await auth.api.signInEmail({
      body: {
        email: 'test@dorm.com',
        password: 'password123'
      },
      headers: req.headers
    });
    return NextResponse.json({ success: true, res });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message, stack: e.stack });
  }
}
