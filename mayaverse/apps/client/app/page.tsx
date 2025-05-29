import { Header } from "@/components/ui/header";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { PreviewSection } from "@/components/sections/preview-section";
import { TechStackSection } from "@/components/sections/tech-stack-section";
import { DevNotesSection } from "@/components/sections/dev-notes-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0F0F0F] text-white overflow-x-hidden">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <PreviewSection />
      <TechStackSection />
      <DevNotesSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
