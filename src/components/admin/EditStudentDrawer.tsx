"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { BATCHES } from "@/lib/batches";

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

interface Props {
  student: StudentData;
  onSave: (data: Partial<StudentData>) => Promise<void>;
  onClose: () => void;
}

export default function EditStudentDrawer({ student, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    fullName: student.fullName,
    mobileNumber: student.mobileNumber,
    email: student.email || "",
    address: student.address,
    occupation: student.occupation || "",
    weight: student.weight?.toString() || "",
    gender: student.gender,
    isVrindavanResident: student.isVrindavanResident,
    batchId: student.batch.id,
    sessionStartDate: student.sessionStartDate.split("T")[0],
    paymentStatus: student.paymentStatus,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const selectedBatch = BATCHES.find((b) => b.id === form.batchId);

    await onSave({
      fullName: form.fullName,
      mobileNumber: form.mobileNumber,
      email: form.email || undefined,
      address: form.address,
      occupation: form.occupation || undefined,
      weight: form.weight ? Number(form.weight) : undefined,
      gender: form.gender as "Male" | "Female" | "Other",
      isVrindavanResident: form.isVrindavanResident,
      batch: selectedBatch
        ? {
            id: selectedBatch.id,
            time: selectedBatch.time,
            location: selectedBatch.location,
            type: selectedBatch.type,
          }
        : undefined,
      sessionStartDate: form.sessionStartDate,
      paymentStatus: form.paymentStatus as "pending" | "paid",
    });

    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
      <div className="w-full max-w-lg bg-white h-full overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
          <h2 className="font-semibold text-gray-900">Edit Student</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
            Receipt: {student.receiptNumber}
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              value={form.mobileNumber}
              onChange={(e) => setForm((f) => ({ ...f, mobileNumber: e.target.value }))}
              required
              maxLength={10}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              rows={2}
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                value={form.gender}
                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Occupation
            </label>
            <input
              type="text"
              value={form.occupation}
              onChange={(e) => setForm((f) => ({ ...f, occupation: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vrindavan Resident?
            </label>
            <div className="flex gap-2">
              {[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, isVrindavanResident: opt.value }))}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg border-2 ${
                    form.isVrindavanResident === opt.value
                      ? "border-[#1B4332] bg-[#1B4332]/5 text-[#1B4332]"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
            <select
              value={form.batchId}
              onChange={(e) => setForm((f) => ({ ...f, batchId: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            >
              {BATCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.time} - {b.location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Start Date
            </label>
            <input
              type="date"
              value={form.sessionStartDate}
              onChange={(e) => setForm((f) => ({ ...f, sessionStartDate: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <div className="flex gap-2">
              {[
                { value: "pending", label: "Pending" },
                { value: "paid", label: "Paid" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      paymentStatus: opt.value as "pending" | "paid",
                    }))
                  }
                  className={`flex-1 py-2 text-sm font-medium rounded-lg border-2 ${
                    form.paymentStatus === opt.value
                      ? opt.value === "paid"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-[#1B4332] hover:bg-[#1B4332]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
