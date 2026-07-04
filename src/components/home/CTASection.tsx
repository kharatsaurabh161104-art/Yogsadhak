"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
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
      className="py-16 sm:py-20 px-4 bg-gradient-to-r from-[#F97316] to-[#ea580c] transition-all duration-700 opacity-0 translate-y-8"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Join Yogsadhak Today
        </h2>
        <p className="text-white/80 mt-3 text-base sm:text-lg">
          Your health is one step away. Start your journey toward a fitter,
          calmer, and healthier you.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-white text-[#F97316] hover:bg-white/90 font-semibold px-8 py-3.5 rounded-xl text-base mt-8 transition-all min-h-[48px]"
        >
          Register Now
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
