
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-onlyl34ks-bg-darker via-onlyl34ks-bg-dark to-onlyl34ks-bg-light opacity-70 z-0"></div>
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzMzMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptMCAxMmgxdjFoLTF2LTF6bS01LTEwaDFWNDZoLTFWMzZ6bTktNWgxdjFoLTF2LTF6TTQyIDM0aDR2MWgtNHYtMXptLTItM2gxdjJoLTF2LTJ6bTAtM2gxdjJoLTF2LTJ6bTEzLTE1di00aDFWMTNIinAvPjwvZz48L2c+PC9zdmc+')]"></div>
      
      <div className="container-section relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="animate-fade-in-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Stop Renting Content. <br className="hidden sm:block" />
            <span className="text-onlyl34ks-accent">Start Owning Exclusives.</span>
          </h1>
          <p className="animate-fade-in-up animation-delay-100 text-xl md:text-2xl text-onlyl34ks-text-light/90 mb-10 max-w-3xl mx-auto">
            Discover and purchase unique digital content directly from creators. 
            Secure, private, and permanently yours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-200">
            <button 
              className="btn-primary text-lg"
              onClick={() => scrollToSection("explore")}
            >
              Explore Exclusive Content
            </button>
            <button 
              className="btn-secondary text-lg"
              onClick={() => scrollToSection("how-it-works")}
            >
              How It Works
            </button>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => scrollToSection("problem")}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-onlyl34ks-text-light/50 hover:text-onlyl34ks-accent transition-colors duration-300 animate-bounce"
        aria-label="Scroll down"
      >
        <ArrowDown size={32} />
      </button>
    </section>
  );
};

export default HeroSection;
