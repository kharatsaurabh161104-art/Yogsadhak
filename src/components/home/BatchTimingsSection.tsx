"use client";

import { useEffect, useRef } from "react";
import { Sun, Moon, Users } from "lucide-react";
import { BATCHES } from "@/lib/batches";

export default function BatchTimingsSection() {
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

  const morningBatches = BATCHES.filter((b) => b.type === "morning");
  const eveningBatches = BATCHES.filter((b) => b.type === "evening");

  return (
    <section
      id="batches"
      ref={sectionRef}
      className="py-16 sm:py-20 px-4 transition-all duration-700 opacity-0 translate-y-8"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1B4332] text-center">
          Batch Timings
        </h2>
        <p className="text-gray-500 text-center text-sm mt-2 max-w-md mx-auto">
          Choose the time that fits your schedule best
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sun className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-gray-900">Morning Batches</h3>
            </div>
            <div className="space-y-3">
              {morningBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                >
                  <p className="font-semibold text-gray-900">{batch.time}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{batch.location}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {batch.residentsOnly && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Users className="w-3 h-3" />
                        Residents Only
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Moon className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-gray-900">Evening Batches</h3>
            </div>
            <div className="space-y-3">
              {eveningBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                >
                  <p className="font-semibold text-gray-900">{batch.time}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{batch.location}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {batch.childrenOnly && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                        Children Only
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
