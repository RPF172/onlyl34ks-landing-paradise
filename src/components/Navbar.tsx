
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-onlyl34ks-bg-darker/95 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-white">
              ONLYL<span className="text-onlyl34ks-accent">34</span>KS
            </a>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-onlyl34ks-text-light hover:text-onlyl34ks-accent transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("benefits")}
              className="text-onlyl34ks-text-light hover:text-onlyl34ks-accent transition-colors"
            >
              Benefits
            </button>
            <button
              onClick={() => scrollToSection("explore")}
              className="text-onlyl34ks-text-light hover:text-onlyl34ks-accent transition-colors"
            >
              Explore
            </button>
            <button className="btn-secondary">For Creators</button>
            <button className="btn-primary">Sign In</button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-onlyl34ks-bg-darker border-t border-onlyl34ks-bg-light/10">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-onlyl34ks-text-light hover:text-onlyl34ks-accent transition-colors py-2"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("benefits")}
                className="text-onlyl34ks-text-light hover:text-onlyl34ks-accent transition-colors py-2"
              >
                Benefits
              </button>
              <button
                onClick={() => scrollToSection("explore")}
                className="text-onlyl34ks-text-light hover:text-onlyl34ks-accent transition-colors py-2"
              >
                Explore
              </button>
              <button className="btn-secondary w-full">For Creators</button>
              <button className="btn-primary w-full">Sign In</button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
