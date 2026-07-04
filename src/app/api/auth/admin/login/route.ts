import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import { signToken } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, data: null,         error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    await dbConnect();

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return NextResponse.json(
        { success: false, data: null, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, data: null, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken({
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: "admin",
    });

    const response = NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          role: "admin" as const,
        },
      },
      error: null,
    });

    response.cookies.set("yogsadhak_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}
