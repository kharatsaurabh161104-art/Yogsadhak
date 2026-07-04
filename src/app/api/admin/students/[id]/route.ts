import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import { getAdminFromRequest } from "@/lib/auth";
import { z } from "zod";
import { addMonths } from "date-fns";

const updateSchema = z.object({
  fullName: z.string().min(1).optional(),
  dob: z.string().optional(),
  age: z.number().int().positive().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  occupation: z.string().optional(),
  weight: z.number().positive().optional(),
  address: z.string().min(1).optional(),
  mobileNumber: z.string().regex(/^\d{10}$/).optional(),
  email: z.string().email().optional().or(z.literal("")),
  isVrindavanResident: z.boolean().optional(),
  batch: z
    .object({
      id: z.string(),
      time: z.string(),
      location: z.string(),
      type: z.enum(["morning", "evening"]),
    })
    .optional(),
  sessionStartDate: z.string().optional(),
  paymentStatus: z.enum(["pending", "paid"]).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, data: null,         error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await dbConnect();

    const updateData: Record<string, unknown> = { ...parsed.data };

    if (updateData.sessionStartDate) {
      const startDate = new Date(updateData.sessionStartDate as string);
      updateData.sessionStartDate = startDate;
      updateData.sessionEndDate = addMonths(startDate, 1);
    }

    if (updateData.dob) {
      updateData.dob = new Date(updateData.dob as string);
    }

    const student = await Student.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return NextResponse.json(
        { success: false, data: null, error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: student,
      error: null,
    });
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, data: null, error: "Mobile number already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, data: null, error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await dbConnect();

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return NextResponse.json(
        { success: false, data: null, error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: "Student deleted successfully" },
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, data: null, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
