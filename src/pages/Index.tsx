import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import ServicesSection from "@/components/landing/ServicesSection";
import TrainersSection from "@/components/landing/TrainersSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import GallerySection from "@/components/landing/GallerySection";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { useLenis } from "@/hooks/useLenis";

const Index = () => {
  useLenis();

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <GallerySection />
        <ServicesSection />
        <TrainersSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
