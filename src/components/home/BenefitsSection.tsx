"use client";

import { useEffect, useRef } from "react";

const benefits = [
  {
    title: "Flexibility",
    desc: "Improve your range of motion and prevent injuries with regular asana practice.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
        <path d="M8 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Breathing",
    desc: "Master pranayam techniques to boost lung capacity and oxygen flow.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h3l2-3 3 3 3-3 2 3h3" />
      </svg>
    ),
  },
  {
    title: "Mental Peace",
    desc: "Reduce stress and anxiety through dhyan and guided meditation sessions.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
  {
    title: "Weight Management",
    desc: "Burn calories and build lean muscle with dynamic yoga flows.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10" />
        <path d="M18 20V4" />
        <path d="M6 20v-4" />
      </svg>
    ),
  },
  {
    title: "Immunity",
    desc: "Strengthen your immune system with consistent yoga and breathwork.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Discipline",
    desc: "Cultivate consistency, focus, and self-awareness through daily practice.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

export default function BenefitsSection() {
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
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1B4332] text-center">
          Benefits of Yoga
        </h2>
        <p className="text-gray-500 text-center text-sm mt-2 max-w-md mx-auto">
          Discover what regular yoga practice can do for you
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-[#FAFAF7] rounded-xl p-4 sm:p-5 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="text-[#1B4332] mb-3">{benefit.icon}</div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                {benefit.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
