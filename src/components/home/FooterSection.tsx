"use client";

import { Phone, Mail, MapPin } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="bg-[#1B4332] text-white/80 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white">Yogsadhak</h3>
            <p className="text-sm mt-2 leading-relaxed">
              Pratyek Shwasat Arogya
            </p>
            <p className="text-xs text-white/50 mt-1">
              Yog • Pranayam • Dhyan
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Locations</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#F97316]" />
                <span>Vrindavan Shrushti Club House, Pune</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#F97316]" />
                <span>GURUKUL IIT ACADEMY Narhe, Pune</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F97316] shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F97316] shrink-0" />
                <span>info@yogsadhak.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Yogsadhak. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
