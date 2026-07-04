import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Student, { IStudent } from "@/models/Student";
import ReceiptClient from "./ReceiptClient";

interface PageProps {
  params: Promise<{ receiptNumber: string }>;
}

export default async function ReceiptPage({ params }: PageProps) {
  const { receiptNumber } = await params;

  await dbConnect();

  const student = (await Student.findOne({ receiptNumber }).lean()) as IStudent | null;

  if (!student) {
    notFound();
  }

  const data = {
    receiptNumber: student.receiptNumber,
    fullName: student.fullName,
    dob: student.dob.toISOString().split("T")[0],
    mobileNumber: student.mobileNumber,
    batchTime: student.batch.time,
    batchLocation: student.batch.location,
    sessionStartDate: student.sessionStartDate.toISOString().split("T")[0],
    sessionEndDate: student.sessionEndDate.toISOString().split("T")[0],
    category: student.category,
    fees: student.fees,
    paymentStatus: student.paymentStatus,
    registeredAt: student.registeredAt.toISOString().split("T")[0],
  };

  return <ReceiptClient data={data} />;
}
