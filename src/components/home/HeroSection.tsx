"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
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
      className="relative min-h-[90vh] bg-gradient-to-br from-[#1B4332] via-[#1B4332] to-[#0d2818] flex items-center justify-center overflow-hidden transition-all duration-700 opacity-0 translate-y-8"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
  <div className="relative w-[500px] h-[500px] opacity-10">
    <Image
      src="/yogsadhak.jpeg"
      alt="Yoga Logo"
      fill
      className="object-contain rounded-full"
      priority
    />
  </div>
</div>

      <div className="relative z-10 text-center px-4 max-w-2xl">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight">
          Yogsadhak
        </h1>
        <p className="text-[#F97316] text-lg sm:text-xl md:text-2xl font-medium mt-4">
          Pratyek Shwasat Arogya
        </p>
        <p className="text-white/60 text-sm sm:text-base mt-2 tracking-widest">
          Yog • Pranayam • Dhyan
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-10 justify-center">
          <Link
            href="/register"
            className="bg-[#F97316] hover:bg-[#F97316]/90 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all min-h-[48px] inline-flex items-center justify-center"
          >
            Register Now
          </Link>
          <Link
            href="/student/login"
            className="bg-[#F97316] hover:bg-[#F97316]/90 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all min-h-[48px] inline-flex items-center justify-center"
          >
            Student Login
          </Link>
          <Link
            href="/admin/login"
            className="bg-[#F97316] hover:bg-[#F97316]/90 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all min-h-[48px] inline-flex items-center justify-center"
          >
            Admin Login
          </Link>
          <a
            href="#batches"
            className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3.5 rounded-xl text-base backdrop-blur-sm border border-white/20 transition-all min-h-[48px] inline-flex items-center justify-center"
          >
            View Batches
          </a>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/60 transition-colors animate-bounce"
      >
        <ChevronDown className="w-8 h-8" />
      </a>
    </section>
  );
}
