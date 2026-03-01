import BuilderHeader from "@/components/builder-landing/BuilderHeader";
import BuilderHero from "@/components/builder-landing/BuilderHero";
import BuilderHowItWorks from "@/components/builder-landing/BuilderHowItWorks";
import BuilderFeatures from "@/components/builder-landing/BuilderFeatures";
import BuilderPricing from "@/components/builder-landing/BuilderPricing";
import BuilderFooter from "@/components/builder-landing/BuilderFooter";

const BuilderLanding = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <BuilderHeader />
      <BuilderHero />
      <BuilderHowItWorks />
      <BuilderFeatures />
      <BuilderPricing />
      <BuilderFooter />
    </div>
  );
};

export default BuilderLanding;
