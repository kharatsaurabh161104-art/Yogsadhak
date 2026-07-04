import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import BatchTimingsSection from "@/components/home/BatchTimingsSection";
import FeeSection from "@/components/home/FeeSection";
import CTASection from "@/components/home/CTASection";
import FooterSection from "@/components/home/FooterSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <HeroSection />
      <AboutSection />
      <BenefitsSection />
      <BatchTimingsSection />
      <FeeSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
