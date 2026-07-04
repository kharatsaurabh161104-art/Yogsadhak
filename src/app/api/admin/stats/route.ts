import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import { getAdminFromRequest } from "@/lib/auth";
import { BATCHES } from "@/lib/batches";

export async function GET(request: NextRequest) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalStudents, studentsThisMonth, revenueResult, batchCounts] =
      await Promise.all([
        Student.countDocuments(),
        Student.countDocuments({ registeredAt: { $gte: startOfMonth } }),
        Student.aggregate([
          { $match: { registeredAt: { $gte: startOfMonth } } },
          { $group: { _id: null, total: { $sum: "$fees" } } },
        ]),
        Student.aggregate([
          { $group: { _id: "$batch.id", count: { $sum: 1 } } },
        ]),
      ]);

    const revenueThisMonth = revenueResult[0]?.total ?? 0;

    const batchWiseCounts = BATCHES.map((batch) => {
      const found = batchCounts.find((b) => b._id === batch.id);
      return {
        id: batch.id,
        time: batch.time,
        location: batch.location,
        count: found?.count ?? 0,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        studentsThisMonth,
        revenueThisMonth,
        batchWiseCounts,
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
