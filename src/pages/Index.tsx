
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ProblemSolutionSection from "../components/ProblemSolutionSection";
import HowItWorksSection from "../components/HowItWorksSection";
import BenefitsSection from "../components/BenefitsSection";
import FeaturedContentSection from "../components/FeaturedContentSection";
import TestimonialsSection from "../components/TestimonialsSection";
import CtaSection from "../components/CtaSection";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-onlyl34ks-bg-dark">
      <Navbar />
      <HeroSection />
      <ProblemSolutionSection />
      <HowItWorksSection />
      <BenefitsSection />
      <FeaturedContentSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
