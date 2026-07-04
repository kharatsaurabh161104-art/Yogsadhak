import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import { signToken } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  mobileNumber: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "DOB must be in YYYY-MM-DD format"),
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

    const { mobileNumber, dob } = parsed.data;

    await dbConnect();

    const student = await Student.findOne({ mobileNumber });

    if (!student) {
      return NextResponse.json(
        { success: false, data: null, error: "No student found with this mobile number" },
        { status: 401 }
      );
    }

    const studentDob = new Date(student.dob);
    const inputDob = new Date(dob);

    if (
      studentDob.getFullYear() !== inputDob.getFullYear() ||
      studentDob.getMonth() !== inputDob.getMonth() ||
      studentDob.getDate() !== inputDob.getDate()
    ) {
      return NextResponse.json(
        { success: false, data: null, error: "Date of birth does not match our records" },
        { status: 401 }
      );
    }

    const token = signToken({
      id: student._id.toString(),
      name: student.fullName,
      mobileNumber: student.mobileNumber,
      role: "student",
    });

    const response = NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: student._id.toString(),
          name: student.fullName,
          mobileNumber: student.mobileNumber,
          role: "student" as const,
        },
      },
      error: null,
    });

    response.cookies.set("yogsadhak_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, data: null, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
