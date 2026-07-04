"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, IndianRupee, Sun, Moon } from "lucide-react";
import { BATCHES } from "@/lib/batches";

interface Stats {
  totalStudents: number;
  studentsThisMonth: number;
  revenueThisMonth: number;
  batchWiseCounts: {
    id: string;
    time: string;
    location: string;
    count: number;
  }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const result = await res.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (e) {
      console.error("Failed to fetch stats", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.totalStudents ?? 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-[#1B4332]/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-[#1B4332]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.studentsThisMonth ?? 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#F97316]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenue (Month)</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{stats?.revenueThisMonth?.toLocaleString() ?? 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-base font-semibold text-gray-900">Batch-wise Count</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BATCHES.map((batch) => {
          const batchStat = stats?.batchWiseCounts?.find((b) => b.id === batch.id);
          const count = batchStat?.count ?? 0;
          return (
            <div
              key={batch.id}
              className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  batch.type === "morning"
                    ? "bg-amber-50"
                    : "bg-indigo-50"
                }`}
              >
                {batch.type === "morning" ? (
                  <Sun className="w-5 h-5 text-amber-500" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{batch.time}</p>
                <p className="text-xs text-gray-500 truncate">{batch.location}</p>
              </div>
              <div className="text-lg font-bold text-[#1B4332]">{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
