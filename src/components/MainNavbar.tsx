
import React, { useState, useEffect } from "react";
import { 
  NavigationMenu, 
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const MainNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut, profile } = useAuth();
  const { itemsCount } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

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
          <Link to="/" className="text-2xl font-bold text-white">
            ONLYL<span className="text-onlyl34ks-accent">34</span>KS
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/creators">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Creators
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/cart">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <ShoppingCart className="mr-1 h-4 w-4" />
                    Cart
                    {itemsCount > 0 && (
                      <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                        {itemsCount}
                      </Badge>
                    )}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              {user ? (
                <NavigationMenuItem>
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2" 
                      onClick={() => navigate("/account")}
                    >
                      <User size={16} />
                      Account
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-2" 
                      onClick={handleSignOut}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </Button>
                  </div>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem>
                  <Button 
                    className="bg-onlyl34ks-accent hover:bg-onlyl34ks-accent-dark text-white"
                    onClick={() => navigate("/auth")}
                  >
                    Sign In
                  </Button>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};

export default MainNavbar;
