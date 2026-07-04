"use client";

import { useEffect, useRef } from "react";
import { IndianRupee, Check } from "lucide-react";

export default function FeeSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-8");
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 px-4 bg-white transition-all duration-700 opacity-0 translate-y-8"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1B4332] text-center">
          Fee Structure
        </h2>
        <p className="text-gray-500 text-center text-sm mt-2">
          Affordable pricing for everyone
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[#FAFAF7] rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#1B4332]/10 rounded-xl flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-[#1B4332]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Ladies & Gents</p>
                <p className="text-xs text-gray-500">Ages 18 and above</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-[#1B4332]">₹699</p>
            <p className="text-sm text-gray-500 mt-1">per month</p>
            <div className="mt-4 space-y-2">
              {[
                "Daily 60-minute sessions",
                "All asanas & pranayam",
                "Personalized attention",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#FAFAF7] rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#F97316]/10 rounded-xl flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-[#F97316]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Children</p>
                <p className="text-xs text-gray-500">Ages 5 to 17</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-[#F97316]">₹499</p>
            <p className="text-sm text-gray-500 mt-1">per month</p>
            <div className="mt-4 space-y-2">
              {[
                "Daily 60-minute sessions",
                "Fun, age-appropriate yoga",
                "Focus on flexibility & focus",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Includes one full month of daily sessions. Fees to be paid at the
          batch location on your first day.
        </p>
      </div>
    </section>
  );
}
