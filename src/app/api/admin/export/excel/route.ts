import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import { getAdminFromRequest } from "@/lib/auth";
import * as XLSX from "xlsx";

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

    const students = await Student.find().sort({ registeredAt: -1 }).lean();

    const rows = students.map((s, i) => ({
      "#": i + 1,
      "Receipt No": s.receiptNumber,
      Name: s.fullName,
      DOB: new Date(s.dob).toLocaleDateString("en-IN"),
      Mobile: s.mobileNumber,
      Email: s.email || "",
      Gender: s.gender,
      Batch: s.batch.time,
      Location: s.batch.location,
      "Start Date": new Date(s.sessionStartDate).toLocaleDateString("en-IN"),
      "End Date": new Date(s.sessionEndDate).toLocaleDateString("en-IN"),
      Category: s.category,
      Fees: s.fees,
      Status: s.paymentStatus,
      "Registered At": new Date(s.registeredAt).toLocaleDateString("en-IN"),
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Students");

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=yogsadhak-students.xlsx",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, data: null, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
