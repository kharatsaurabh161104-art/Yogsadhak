import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import { getBatchById } from "@/lib/batches";

const registerSchema = z.object({
  fullName: z.string().min(1),

  dob: z.string(),

  age: z.number(),

  gender: z.enum(["Male", "Female", "Other"]),

  occupation: z.string().optional(),

  weight: z.number().optional(),

  address: z.string(),

  mobileNumber: z.string(),

  email: z.string().optional(),

  isVrindavanResident: z.boolean(),

  batchId: z.string(),

  sessionStartDate: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0].message,
        },
        {
          status: 400,
        }
      );
    }

    const {
      fullName,
      dob,
      age,
      gender,
      occupation,
      weight,
      address,
      mobileNumber,
      email,
      isVrindavanResident,
      batchId,
      sessionStartDate,
    } = parsed.data;

    const batch = getBatchById(batchId);

    if (!batch) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid batch selected",
        },
        {
          status: 400,
        }
      );
    }

    await dbConnect();

    const existingStudent = await Student.findOne({
      mobileNumber,
    });

    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          error: "Mobile number already registered",
        },
        {
          status: 409,
        }
      );
    }

    const startDate = new Date(sessionStartDate);

    const student = await Student.create({
      fullName,

      dob: new Date(dob),

      age,

      gender,

      occupation,

      weight,

      address,

      mobileNumber,

      email,

      isVrindavanResident,

      batch: {
        id: batch.id,
        time: batch.time,
        location: batch.location,
        type: batch.type,
      },

      sessionStartDate: startDate,

      paymentStatus: "pending",
    });

    return NextResponse.json(
      {
        success: true,

        studentId: student._id,

        receiptNumber: student.receiptNumber,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}