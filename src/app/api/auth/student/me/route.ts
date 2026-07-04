import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobileNumber } = body;

    if (!mobileNumber) {
      return NextResponse.json(
        { success: false, data: null, error: "Mobile number is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const student = await Student.findOne({ mobileNumber }).lean();

    if (!student) {
      return NextResponse.json(
        { success: false, data: null, error: "Student not found" },
        { status: 404 }
      );
    }

    const { _id, __v, ...safeStudent } = student as unknown as Record<string, unknown>;

    return NextResponse.json({
      success: true,
      data: safeStudent,
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, data: null, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
