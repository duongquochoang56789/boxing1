import { useState, useCallback } from "react";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import ServicesSection from "@/components/landing/ServicesSection";
import VirtualTrainingSection from "@/components/landing/VirtualTrainingSection";
import PricingSection from "@/components/landing/PricingSection";
import TrainersSection from "@/components/landing/TrainersSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import GallerySection from "@/components/landing/GallerySection";
import ContactSection from "@/components/landing/ContactSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { useLenis } from "@/hooks/useLenis";
import SplashScreen from "@/components/ui/splash-screen";

const Index = () => {
  useLenis();

  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("flyfit-splash-shown");
  });

  const handleSplashComplete = useCallback(() => {
    sessionStorage.setItem("flyfit-splash-shown", "1");
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <GallerySection />
        <ServicesSection />
        <VirtualTrainingSection />
        <PricingSection />
        <TrainersSection />
        <TestimonialsSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
