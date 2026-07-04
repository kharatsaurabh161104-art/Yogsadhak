import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const batch = searchParams.get("batch") || "";
    const status = searchParams.get("status") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    await dbConnect();

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (batch) {
      filter["batch.id"] = batch;
    }

    if (status) {
      filter.paymentStatus = status;
    }

    const [students, total] = await Promise.all([
      Student.find(filter).sort({ registeredAt: -1 }).skip(skip).limit(limit).lean(),
      Student.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        students,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, data: null, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
