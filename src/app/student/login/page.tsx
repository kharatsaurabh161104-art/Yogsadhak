"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function StudentLoginPage() {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber, dob }),
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      localStorage.setItem("yogsadhak_user", JSON.stringify(result.data.user));
      router.push("/student/dashboard");
    } catch {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1B4332]">Yogsadhak</h1>
          <p className="text-[#F97316] text-sm">Pratyek Shwasat Arogya</p>
          <p className="text-gray-500 text-xs mt-1">Student Login</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile number"
              required
              maxLength={10}
              inputMode="numeric"
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent [font-size:16px] min-h-[48px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent [font-size:16px] min-h-[48px]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1B4332] hover:bg-[#1B4332]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl text-base flex items-center justify-center gap-2 min-h-[48px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>

          <p className="text-center text-sm text-gray-500">
            Not registered?{" "}
            <a href="/register" className="text-[#F97316] font-medium hover:underline">
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
