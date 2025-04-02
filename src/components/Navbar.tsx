
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isAdmin = profile?.role === 'Admin';

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

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    navigate("/");
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
            <Link to="/" className="text-2xl font-bold text-white">
              ONLYL<span className="text-onlyl34ks-accent">34</span>KS
            </Link>
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
            
            {user ? (
              <>
                <div className="flex items-center gap-2 text-onlyl34ks-text-light">
                  <User size={16} />
                  <span>{user.email}</span>
                  {profile && <span className="text-onlyl34ks-accent">({profile.role})</span>}
                </div>
                {isAdmin && (
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 text-onlyl34ks-text-light hover:text-onlyl34ks-accent"
                  >
                    <LayoutDashboard size={16} />
                    Admin
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-onlyl34ks-text-light hover:text-onlyl34ks-accent"
                >
                  <LogOut size={16} />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-onlyl34ks-text-light hover:text-onlyl34ks-accent transition-colors"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-onlyl34ks-accent hover:bg-onlyl34ks-accent-dark text-white"
                  onClick={() => {
                    navigate("/auth");
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
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
              
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-onlyl34ks-text-light py-2">
                    <User size={16} />
                    <span>{user.email}</span>
                    {profile && <span className="text-onlyl34ks-accent">({profile.role})</span>}
                  </div>
                  {isAdmin && (
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/admin');
                      }}
                      className="flex items-center gap-2 text-onlyl34ks-text-light hover:text-onlyl34ks-accent justify-start px-0"
                    >
                      <LayoutDashboard size={16} />
                      Admin Dashboard
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-onlyl34ks-text-light hover:text-onlyl34ks-accent justify-start px-0"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-onlyl34ks-text-light hover:text-onlyl34ks-accent transition-colors justify-start w-full"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/auth");
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full bg-onlyl34ks-accent hover:bg-onlyl34ks-accent-dark text-white"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/auth");
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
