"use client";

import { format, addMonths } from "date-fns";
import { CalendarDays } from "lucide-react";

interface SessionDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function SessionDatePicker({
  value,
  onChange,
  error,
}: SessionDatePickerProps) {
  const today = new Date().toISOString().split("T")[0];

  const endDate = value
    ? addMonths(new Date(value), 1)
    : null;

  const formattedEnd = endDate
    ? format(endDate, "dd MMM yyyy")
    : "";

  const formattedStart = value
    ? format(new Date(value), "dd MMM yyyy")
    : "";

  return (
    <div className="space-y-2">
      <div className="relative">
        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="date"
          value={value}
          min={today}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent [font-size:16px] min-h-[48px]"
        />
      </div>
      {value && formattedStart && formattedEnd && (
        <p className="text-sm text-[#1B4332] font-medium bg-[#1B4332]/5 px-3 py-2 rounded-lg">
          Your session: {formattedStart} → {formattedEnd}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
