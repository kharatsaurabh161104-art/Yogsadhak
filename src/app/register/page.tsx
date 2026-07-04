"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addMonths, differenceInYears, parseISO } from "date-fns";
import { Loader2, ChevronRight } from "lucide-react";
import { BATCHES } from "@/lib/batches";
import BatchCard from "@/components/BatchCard";
import { clearDraft } from "@/hooks/usePersistedForm";

const STORAGE_KEY = "yogsadhak_registration_draft";

const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date (YYYY-MM-DD)"),
  gender: z.enum(["Male", "Female", "Other"], { message: "Select your gender" }),
  occupation: z.string().optional(),
  weight: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Enter exactly 10 digits"),
  email: z.string().optional(),
  isVrindavanResident: z.string().min(1, "Select Yes or No"),
  batchId: z.string().min(1, "Please select a batch"),
  sessionStartDate: z.string().min(1, "Select a start date"),
});

type FormData = z.infer<typeof registerSchema>;

function loadDraft(): Partial<FormData> | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as Partial<FormData>;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return undefined;
  }
}

function saveDraft(values: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  } catch {
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema) as never,
    defaultValues: {
      fullName: "",
      dob: "",
      gender: undefined,
      occupation: undefined,
      weight: undefined,
      address: "",
      mobileNumber: "",
      email: "",
      isVrindavanResident: "",
      batchId: "",
      sessionStartDate: todayStr,
    },
  });

  useEffect(() => {
    const saved = loadDraft();
    if (saved) {
      reset({
        fullName: saved.fullName ?? "",
        dob: saved.dob ?? "",
        gender: saved.gender as FormData["gender"] ?? undefined,
        occupation: saved.occupation ?? undefined,
        weight: saved.weight ?? undefined,
        address: saved.address ?? "",
        mobileNumber: saved.mobileNumber ?? "",
        email: saved.email ?? "",
        isVrindavanResident: saved.isVrindavanResident ?? "",
        batchId: saved.batchId ?? "",
        sessionStartDate: saved.sessionStartDate ?? todayStr,
      });
    }
  }, []);

  const watchedDob = watch("dob");
  const watchedResident = watch("isVrindavanResident");
  const watchedBatchId = watch("batchId");
  const watchedStartDate = watch("sessionStartDate");
  const watchedGender = watch("gender");

  const [computedAge, setComputedAge] = useState<number | null>(null);

  useEffect(() => {
    if (watchedDob && /^\d{4}-\d{2}-\d{2}$/.test(watchedDob)) {
      try {
        const dobDate = parseISO(watchedDob);
        const age = differenceInYears(new Date(), dobDate);
        setComputedAge(age > 0 ? age : null);
      } catch {
        setComputedAge(null);
      }
    } else {
      setComputedAge(null);
    }
  }, [watchedDob]);

  const isChild = computedAge !== null && computedAge < 18;
  const fees = isChild ? 499 : 699;
  const categoryLabel = isChild ? "Children" : "Ladies & Gents";

  const filteredBatches = BATCHES.filter((b) => {
    if (watchedResident !== "true" && b.residentsOnly) {
      return false;
    }
    return true;
  });

  const sessionEndDate = watchedStartDate
    ? addMonths(new Date(watchedStartDate), 1)
    : null;

  const persistValues = useCallback(() => {
    const values = {
      fullName: watch("fullName"),
      dob: watch("dob"),
      gender: watch("gender"),
      occupation: watch("occupation"),
      weight: watch("weight"),
      address: watch("address"),
      mobileNumber: watch("mobileNumber"),
      email: watch("email"),
      isVrindavanResident: watch("isVrindavanResident"),
      batchId: watch("batchId"),
      sessionStartDate: watch("sessionStartDate"),
    };
    saveDraft(values as unknown as Record<string, unknown>);
  }, [watch]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setServerError("");

    if (computedAge === null) {
      setServerError("Please enter a valid date of birth.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          age: computedAge,
          isVrindavanResident: data.isVrindavanResident === "true",
          weight: data.weight ? Number(data.weight) : undefined,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        setServerError(result.error);
        setIsSubmitting(false);
        return;
      }

      clearDraft();
      reset();
      router.push(`/receipt/${result.data.receiptNumber}`);
    } catch {
      setServerError("Network error. Please check your connection.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <div className="bg-gradient-to-b from-[#1B4332] to-[#1B4332]/90 px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-white">Yogsadhak</h1>
        <p className="text-[#F97316] text-sm mt-1">Pratyek Shwasat Arogya</p>
        <p className="text-white/60 text-xs mt-0.5">Yog • Pranayam • Dhyan</p>
        <h2 className="text-white text-lg font-semibold mt-4">Student Registration</h2>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={persistValues}
        className="pb-32"
      >
        <div className="px-4 py-6 max-w-lg mx-auto space-y-8">
          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <section>
            <h3 className="text-base font-semibold text-[#1B4332] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#1B4332] rounded-full" />
              Personal Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("fullName")}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent [font-size:16px] min-h-[48px]"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("dob")}
                  max={yesterdayStr}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent [font-size:16px] min-h-[48px]"
                />
                {errors.dob && (
                  <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={computedAge ?? ""}
                  readOnly
                  placeholder="Auto-calculated from DOB"
                  className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl bg-gray-50 text-gray-500 [font-size:16px] min-h-[48px] cursor-not-allowed"
                />
                {watchedDob && computedAge === null && (
                  <p className="text-amber-600 text-sm mt-1">Could not calculate age. Check DOB.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  {["Male", "Female", "Other"].map((option) => (
                    <label
                      key={option}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-base font-medium cursor-pointer transition-all min-h-[48px] ${
                        watchedGender === option
                          ? "border-[#1B4332] bg-[#1B4332]/5 text-[#1B4332]"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        {...register("gender")}
                        value={option}
                        className="sr-only"
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Occupation
                </label>
                <input
                  {...register("occupation")}
                  placeholder="e.g., Teacher, Engineer, Homemaker"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent [font-size:16px] min-h-[48px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("weight")}
                  placeholder="Optional"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent [font-size:16px] min-h-[48px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("address")}
                  rows={3}
                  placeholder="Enter your full address"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent [font-size:16px] resize-none"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-[#1B4332] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#1B4332] rounded-full" />
              Contact
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register("mobileNumber")}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  inputMode="numeric"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent [font-size:16px] min-h-[48px]"
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobileNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email ID
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="optional@email.com"
                  inputMode="email"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent [font-size:16px] min-h-[48px]"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-[#1B4332] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#1B4332] rounded-full" />
              Residency
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Are you residing in Vrindavan Shrushti?
            </p>
            <div className="flex gap-3">
              {[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-base font-medium cursor-pointer transition-all min-h-[48px] ${
                    watchedResident === option.value
                      ? "border-[#1B4332] bg-[#1B4332]/5 text-[#1B4332]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    {...register("isVrindavanResident")}
                    value={option.value}
                    className="sr-only"
                    onChange={(e) => {
                      if (e.target.value === "false" && watchedBatchId) {
                        const selectedBatch = BATCHES.find((b) => b.id === watchedBatchId);
                        if (selectedBatch?.residentsOnly) {
                          setValue("batchId", "");
                        }
                      }
                      register("isVrindavanResident").onChange(e);
                    }}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {errors.isVrindavanResident && (
              <p className="text-red-500 text-sm mt-1">{errors.isVrindavanResident.message}</p>
            )}
          </section>

          <section>
            <h3 className="text-base font-semibold text-[#1B4332] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#1B4332] rounded-full" />
              Select Your Batch
            </h3>
            <div className="space-y-3">
              {filteredBatches.length === 0 && (
                <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 text-center">
                  No batches available for your selection.
                </p>
              )}
              {filteredBatches.map((batch) => (
                <BatchCard
                  key={batch.id}
                  batch={batch}
                  isSelected={watchedBatchId === batch.id}
                  isRecommended={isChild && batch.id === "VS-EVENING-CHILDREN"}
                  onSelect={(id) => setValue("batchId", id, { shouldValidate: true })}
                />
              ))}
            </div>
            {errors.batchId && (
              <p className="text-red-500 text-sm mt-1">{errors.batchId.message}</p>
            )}
          </section>

          <section>
            <h3 className="text-base font-semibold text-[#1B4332] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#1B4332] rounded-full" />
              Session Dates
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("sessionStartDate")}
                min={todayStr}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent [font-size:16px] min-h-[48px]"
              />
              {errors.sessionStartDate && (
                <p className="text-red-500 text-sm mt-1">{errors.sessionStartDate.message}</p>
              )}
              {watchedStartDate && sessionEndDate && (
                <p className="text-sm text-[#1B4332] font-medium bg-[#1B4332]/5 px-3 py-2 rounded-lg mt-2">
                  Your session: {format(new Date(watchedStartDate), "dd MMM yyyy")} → {format(sessionEndDate, "dd MMM yyyy")}
                </p>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-[#1B4332] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#1B4332] rounded-full" />
              Fees
            </h3>
            <div className="bg-[#1B4332]/5 border border-[#1B4332]/20 rounded-xl p-4">
              {computedAge !== null ? (
                <>
                  <p className="text-lg font-bold text-[#1B4332]">
                    ₹{fees} <span className="text-sm font-normal text-gray-600">({categoryLabel})</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Fees to be paid at the batch location on your first day.
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Enter your date of birth above to see fee details.
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-lg mx-auto">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F97316] hover:bg-[#F97316]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl text-base flex items-center justify-center gap-2 transition-colors min-h-[48px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  Complete Registration
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
