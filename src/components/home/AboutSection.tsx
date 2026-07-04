"use client";

import { useEffect, useRef } from "react";

export default function AboutSection() {
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
      id="about"
      ref={sectionRef}
      className="py-16 sm:py-20 px-4 transition-all duration-700 opacity-0 translate-y-8"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1B4332] text-center">
          About Yogsadhak
        </h2>
        <p className="text-gray-500 text-center text-sm mt-2 max-w-md mx-auto">
          Bringing the ancient wisdom of yoga to your daily life
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#1B4332]/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#1B4332]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Who We Are</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Yogsadhak is a community-driven yoga initiative based in Pune. We
              believe that yoga is not just exercise — it is a way of life. Our
              experienced instructors guide students of all ages toward physical
              and mental well-being.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#F97316]/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Our Approach</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              We blend traditional Hatha Yoga with modern wellness science. Each
              session includes asanas, pranayam (breathing exercises), and dhyan
              (meditation). We focus on proper alignment, mindful breathing, and
              gradual progress.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Our Mission</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              To make yoga accessible to every home. We aim to build a healthier
              Pune, one breath at a time. Whether you are a beginner or a
              seasoned practitioner, Yogsadhak has a place for you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
