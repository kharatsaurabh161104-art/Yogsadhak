import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ receiptNumber: string }> }
) {
  try {
    const { receiptNumber } = await params;

    if (!receiptNumber) {
      return NextResponse.json(
        { success: false, data: null, error: "Receipt number is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const student = await Student.findOne({ receiptNumber }).lean();

    if (!student) {
      return NextResponse.json(
        { success: false, data: null, error: "Receipt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: student,
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, data: null, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
