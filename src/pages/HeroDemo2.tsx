import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/landing/HeroSection";

const HeroDemo2 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Back button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate("/hero-options")}
          className="flex items-center gap-2 text-cream/60 hover:text-cream transition-colors text-sm bg-charcoal/50 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
      </div>

      {/* Badge */}
      <div className="fixed top-6 right-6 z-50">
        <span className="text-[10px] font-body font-semibold tracking-wider uppercase bg-terracotta text-cream px-3 py-1.5 rounded-full">
          Option 2: Split Screen (Hiện tại)
        </span>
      </div>

      <HeroSection />
    </div>
  );
};

export default HeroDemo2;
