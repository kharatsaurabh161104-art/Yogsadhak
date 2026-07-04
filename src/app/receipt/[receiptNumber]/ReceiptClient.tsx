"use client";

import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { generateReceiptPDF } from "@/lib/generateReceipt";
import { Download, LogIn, Printer } from "lucide-react";

interface ReceiptData {
  receiptNumber: string;
  fullName: string;
  dob: string;
  mobileNumber: string;
  batchTime: string;
  batchLocation: string;
  sessionStartDate: string;
  sessionEndDate: string;
  category: string;
  fees: number;
  paymentStatus: string;
  registeredAt: string;
}

export default function ReceiptClient({ data }: { data: ReceiptData }) {
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  const handleDownloadPDF = () => {
    const pdf = generateReceiptPDF({
      ...data,
      dob: formatDate(data.dob),
      sessionStartDate: formatDate(data.sessionStartDate),
      sessionEndDate: formatDate(data.sessionEndDate),
      registeredAt: formatDate(data.registeredAt),
    });
    pdf.save(`${data.receiptNumber}.pdf`);
  };

  const handlePrint = () => {
    const pdf = generateReceiptPDF({
      ...data,
      dob: formatDate(data.dob),
      sessionStartDate: formatDate(data.sessionStartDate),
      sessionEndDate: formatDate(data.sessionEndDate),
      registeredAt: formatDate(data.registeredAt),
    });
    pdf.autoPrint();
    pdf.output("dataurlnewwindow");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <div className="bg-gradient-to-b from-[#1B4332] to-[#1B4332]/90 px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-white">Yogsadhak</h1>
        <p className="text-[#F97316] text-sm mt-1">Pratyek Shwasat Arogya</p>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center mb-6">
          <div className="text-4xl mb-3">🙏</div>
          <h2 className="text-xl font-bold text-[#1B4332]">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mt-1">
            Welcome to Yogsadhak.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Receipt No.</span>
              <p className="font-semibold text-gray-900 mt-0.5">{data.receiptNumber}</p>
            </div>
            <div>
              <span className="text-gray-500">Status</span>
              <p className="text-amber-600 font-semibold mt-0.5">
                {data.paymentStatus === "paid" ? "PAID ✓" : "Pending — Pay at batch location"}
              </p>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Student</span>
              <span className="font-medium text-gray-900">{data.fullName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date of Birth</span>
              <span className="font-medium text-gray-900">{formatDate(data.dob)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Mobile</span>
              <span className="font-medium text-gray-900">{data.mobileNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Batch</span>
              <span className="font-medium text-gray-900 text-right">{data.batchTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Location</span>
              <span className="font-medium text-gray-900 text-right max-w-[200px]">
                {data.batchLocation}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Session</span>
              <span className="font-medium text-gray-900">
                {formatDate(data.sessionStartDate)} → {formatDate(data.sessionEndDate)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Category</span>
              <span className="font-medium text-gray-900 capitalize">{data.category}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-100 pt-3">
              <span className="font-medium text-gray-700">Fees</span>
              <span className="font-bold text-[#1B4332]">₹{data.fees}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleDownloadPDF}
            className="w-full bg-[#1B4332] hover:bg-[#1B4332]/90 text-white font-semibold py-3 px-6 rounded-xl text-base flex items-center justify-center gap-2 transition-colors min-h-[48px]"
          >
            <Download className="w-5 h-5" />
            Download Receipt (PDF)
          </button>
          <button
            onClick={handlePrint}
            className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl text-base flex items-center justify-center gap-2 transition-colors min-h-[48px]"
          >
            <Printer className="w-5 h-5" />
            Print
          </button>
          <button
            onClick={() => router.push("/student/login")}
            className="w-full bg-[#F97316] hover:bg-[#F97316]/90 text-white font-semibold py-3 px-6 rounded-xl text-base flex items-center justify-center gap-2 transition-colors min-h-[48px]"
          >
            <LogIn className="w-5 h-5" />
            Login to My Account →
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          Please carry this receipt on your first day. Fees to be paid at the venue.
        </p>
      </div>
    </div>
  );
}
