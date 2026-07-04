"use client";

import { Sun, Moon, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BatchCardData {
  id: string;
  time: string;
  location: string;
  type: "morning" | "evening";
  residentsOnly?: boolean;
  childrenOnly?: boolean;
}

interface BatchCardProps {
  batch: BatchCardData;
  isSelected: boolean;
  isRecommended?: boolean;
  isDisabled?: boolean;
  onSelect: (id: string) => void;
}

export default function BatchCard({
  batch,
  isSelected,
  isRecommended,
  isDisabled,
  onSelect,
}: BatchCardProps) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => !isDisabled && onSelect(batch.id)}
      className={cn(
        "relative w-full text-left p-4 rounded-xl border-2 transition-all duration-200 min-h-[80px]",
        "focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:ring-offset-2",
        isSelected
          ? "border-[#1B4332] bg-[#1B4332]/5 shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300",
        isDisabled && "opacity-50 cursor-not-allowed",
        "flex flex-col gap-1"
      )}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-[#1B4332] rounded-full flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}

      <div className="flex items-center gap-2">
        {batch.type === "morning" ? (
          <Sun className="w-5 h-5 text-amber-500 shrink-0" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-500 shrink-0" />
        )}
        <span className="font-semibold text-sm text-gray-900">{batch.time}</span>
      </div>

      <span className="text-sm text-gray-600">{batch.location}</span>

      <div className="flex flex-wrap gap-1.5 mt-1">
        {batch.type === "morning" && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            Morning
          </span>
        )}
        {batch.type === "evening" && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            Evening
          </span>
        )}
        {batch.residentsOnly && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Residents Only
          </span>
        )}
        {batch.childrenOnly && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
            Children Only
          </span>
        )}
        {isRecommended && (
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <Star className="w-3 h-3" />
            Recommended
          </span>
        )}
      </div>
    </button>
  );
}
