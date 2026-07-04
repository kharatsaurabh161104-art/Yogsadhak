"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Download, Trash2, Edit, FileText, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { BATCHES } from "@/lib/batches";
import EditStudentDrawer from "@/components/admin/EditStudentDrawer";

interface StudentData {
  _id: string;
  receiptNumber: string;
  fullName: string;
  dob: string;
  age: number;
  gender: string;
  mobileNumber: string;
  email?: string;
  address: string;
  occupation?: string;
  weight?: number;
  isVrindavanResident: boolean;
  batch: {
    id: string;
    time: string;
    location: string;
    type: string;
  };
  category: string;
  fees: number;
  sessionStartDate: string;
  sessionEndDate: string;
  paymentStatus: string;
  registeredAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState<StudentData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (batchFilter) params.set("batch", batchFilter);
      if (statusFilter) params.set("status", statusFilter);
      params.set("page", pagination.page.toString());
      params.set("limit", pagination.limit.toString());

      const res = await fetch(`/api/admin/students?${params}`);
      const result = await res.json();
      if (result.success) {
        setStudents(result.data.students);
        setPagination((p) => ({ ...p, ...result.data.pagination }));
      }
    } catch (e) {
      console.error("Failed to fetch students", e);
    } finally {
      setIsLoading(false);
    }
  }, [search, batchFilter, statusFilter, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/students/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setStudents((prev) => prev.filter((s) => s._id !== id));
        setDeleteConfirm(null);
      }
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const handleExportExcel = () => {
    window.open("/api/admin/export/excel", "_blank");
  };

  const handleSaveEdit = async (data: Partial<StudentData>) => {
    if (!editingStudent) return;

    try {
      const res = await fetch(`/api/admin/students/${editingStudent._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setStudents((prev) =>
          prev.map((s) => (s._id === editingStudent._id ? result.data : s))
        );
        setEditingStudent(null);
      }
    } catch (e) {
      console.error("Update failed", e);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-gray-900">Students</h1>
        <button
          onClick={handleExportExcel}
          className="bg-[#1B4332] hover:bg-[#1B4332]/90 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Excel
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent"
          />
        </div>
        <select
          value={batchFilter}
          onChange={(e) => {
            setBatchFilter(e.target.value);
            setPagination((p) => ({ ...p, page: 1 }));
          }}
          className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
        >
          <option value="">All Batches</option>
          {BATCHES.map((b) => (
            <option key={b.id} value={b.id}>
              {b.time}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPagination((p) => ({ ...p, page: 1 }));
          }}
          className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No students found</p>
        </div>
      ) : (
        <>
          <div className="hidden lg:block">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Mobile</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Batch</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Session</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Fees</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{s.fullName}</p>
                          <p className="text-xs text-gray-500">{s.receiptNumber}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{s.mobileNumber}</td>
                      <td className="px-4 py-3">
                        <p className="text-gray-900">{s.batch.time}</p>
                        <p className="text-xs text-gray-500">{s.batch.location}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatDate(s.sessionStartDate)} → {formatDate(s.sessionEndDate)}
                      </td>
                      <td className="px-4 py-3 font-medium">₹{s.fees}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            s.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {s.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingStudent(s)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-[#1B4332]"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(s._id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <a
                            href={`/receipt/${s.receiptNumber}`}
                            target="_blank"
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-[#1B4332]"
                            title="Receipt"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:hidden space-y-3">
            {students.map((s) => (
              <div
                key={s._id}
                className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{s.fullName}</p>
                    <p className="text-xs text-gray-500">{s.receiptNumber}</p>
                  </div>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      s.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {s.paymentStatus}
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>📞 {s.mobileNumber}</p>
                  <p>⏰ {s.batch.time}</p>
                  <p>📍 {s.batch.location}</p>
                  <p>
                    📅 {formatDate(s.sessionStartDate)} → {formatDate(s.sessionEndDate)}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="font-bold text-[#1B4332]">₹{s.fees}</p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingStudent(s)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-[#1B4332]"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(s._id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <a
                      href={`/receipt/${s.receiptNumber}`}
                      target="_blank"
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-[#1B4332]"
                    >
                      <FileText className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() =>
                  setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))
                }
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    page: Math.min(p.totalPages, p.page + 1),
                  }))
                }
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Delete Student?</h3>
            <p className="text-sm text-gray-600 mt-2">
              This action cannot be undone. The student record will be permanently
              removed.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {editingStudent && (
        <EditStudentDrawer
          student={editingStudent}
          onSave={handleSaveEdit}
          onClose={() => setEditingStudent(null)}
        />
      )}
    </div>
  );
}
