"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, differenceInDays } from "date-fns";
import { Download, LogOut, CalendarDays, MapPin, Clock, IndianRupee } from "lucide-react";
import { useAuth, AuthProvider } from "@/context/AuthContext";
import { generateReceiptPDF } from "@/lib/generateReceipt";

interface StudentData {
  receiptNumber: string;
  fullName: string;
  dob: string;
  mobileNumber: string;
  batch: {
    id: string;
    time: string;
    location: string;
    type: string;
  };
  sessionStartDate: string;
  sessionEndDate: string;
  category: string;
  fees: number;
  paymentStatus: string;
  registeredAt: string;
}

function StudentDashboardContent() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/student/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!user?.mobileNumber) return;
      try {
        const res = await fetch(`/api/auth/student/me`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobileNumber: user.mobileNumber }),
        });
        const result = await res.json();
        if (result.success) {
          setStudent(result.data);
        }
      } catch (e) {
        console.error("Failed to fetch student", e);
      } finally {
        setIsFetching(false);
      }
    };

    if (!isLoading && user) {
      fetchStudent();
    }
  }, [isLoading, user]);

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  const daysLeft = student
    ? differenceInDays(parseISO(student.sessionEndDate), new Date())
    : 0;

  const handleDownloadReceipt = () => {
    if (!student) return;
    const pdf = generateReceiptPDF({
      receiptNumber: student.receiptNumber,
      fullName: student.fullName,
      dob: formatDate(student.dob),
      mobileNumber: student.mobileNumber,
      batchTime: student.batch.time,
      batchLocation: student.batch.location,
      sessionStartDate: formatDate(student.sessionStartDate),
      sessionEndDate: formatDate(student.sessionEndDate),
      category: student.category,
      fees: student.fees,
      paymentStatus: student.paymentStatus,
      registeredAt: formatDate(student.registeredAt),
    });
    pdf.save(`${student.receiptNumber}.pdf`);
  };

  const handleLogout = () => {
    logout();
    router.push("/student/login");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <div className="bg-gradient-to-b from-[#1B4332] to-[#1B4332]/90 px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Yogsadhak</h1>
            <p className="text-[#F97316] text-xs">Pratyek Shwasat Arogya</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-lg font-semibold text-[#1B4332]">
            Namaste, {student?.fullName?.split(" ")[0]} 🙏
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome to your dashboard
          </p>
        </div>

        {student && (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">
                Current Registration
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#1B4332] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {student.batch.time}
                    </p>
                    <p className="text-xs text-gray-500">{student.batch.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays className="w-5 h-5 text-[#1B4332] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900">
                      {formatDate(student.sessionStartDate)} →{" "}
                      {formatDate(student.sessionEndDate)}
                    </p>
                    {daysLeft > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 mt-1">
                        {daysLeft} days remaining
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IndianRupee className="w-5 h-5 text-[#1B4332] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">₹{student.fees}</p>
                    <p className="text-xs text-gray-500">
                      {student.paymentStatus === "paid"
                        ? "Paid"
                        : "Pending — Pay at venue"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Receipt</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Receipt Number</p>
                  <p className="font-semibold text-gray-900">
                    {student.receiptNumber}
                  </p>
                </div>
                <button
                  onClick={handleDownloadReceipt}
                  className="bg-[#1B4332] hover:bg-[#1B4332]/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                Profile Summary
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-900">
                    {student.fullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mobile</span>
                  <span className="font-medium text-gray-900">
                    {student.mobileNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {student.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Registered</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(student.registeredAt)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <AuthProvider>
      <StudentDashboardContent />
    </AuthProvider>
  );
}
