
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ui/ThemeToggle";
import { 
  Menu, 
  X, 
  User, 
  Bell, 
  MessageSquare, 
  Briefcase, 
  LogIn,
  ShoppingCart,
  Store,
  Package,
  ShoppingBag
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userRole } = useAuth();

  // Add scroll effect for the header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // Close the mobile menu if it's open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }

    // If we're on the home page, scroll to the section
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're not on the home page, navigate to the home page with the section as a hash
      navigate(`/?scrollTo=${sectionId}`);
      toast.info(`Navigating to ${sectionId.replace('-', ' ')} section`);
    }
  };

  // Effect to handle scrolling to section when navigating from another page
  useEffect(() => {
    if (location.pathname === '/') {
      const urlParams = new URLSearchParams(location.search);
      const scrollToParam = urlParams.get('scrollTo');
      
      if (scrollToParam) {
        setTimeout(() => {
          const element = document.getElementById(scrollToParam);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, [location]);

  const handleNavigation = (path: string) => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    console.log("Navigating to:", path);
    navigate(path);
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-servie">Servie</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <button 
            onClick={() => handleNavigation('/categories')}
            className="text-sm font-medium transition-colors hover:text-servie"
          >
            Browse Services
          </button>
          
          {/* E-commerce Navigation */}
          <div className="relative group">
            <button 
              onClick={() => handleNavigation('/shop')}
              className="text-sm font-medium transition-colors hover:text-servie flex items-center"
            >
              <Store className="w-4 h-4 mr-1" />
              Shop
            </button>
            {/* E-commerce dropdown */}
            <div className="absolute left-0 top-full mt-1 w-48 bg-background rounded-md shadow-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button 
                onClick={() => handleNavigation('/shop')}
                className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted"
              >
                All Products
              </button>
              {userRole === "provider" && (
                <button 
                  onClick={() => handleNavigation('/dashboard/provider?tab=products')}
                  className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted"
                >
                  Manage Products
                </button>
              )}
              {userRole === "seller" && (
                <button 
                  onClick={() => handleNavigation('/dashboard/seller?tab=products')}
                  className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted"
                >
                  Manage Products
                </button>
              )}
              <button 
                onClick={() => handleNavigation('/cart')}
                className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted flex items-center"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                View Cart
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => scrollToSection('how-it-works')} 
            className="text-sm font-medium transition-colors hover:text-servie"
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollToSection('testimonials')} 
            className="text-sm font-medium transition-colors hover:text-servie"
          >
            Testimonials
          </button>
          <button 
            onClick={() => handleNavigation('/become-seller')}
            className="text-sm font-medium transition-colors hover:text-servie"
          >
            Become a Seller
          </button>
          <button 
            onClick={() => scrollToSection('become-provider')} 
            className="text-sm font-medium transition-colors hover:text-servie"
          >
            Become a Provider
          </button>
          
          <div className="flex items-center space-x-2">
            {!isAuthenticated ? (
              <>
                <Button variant="outline" className="rounded-full" onClick={() => handleNavigation('/signin')}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
                <Button className="rounded-full bg-servie hover:bg-servie-600" onClick={() => handleNavigation('/signup')}>
                  <User className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                {/* Shopping Cart Button */}
                <Button variant="ghost" size="icon" className="rounded-full relative group" 
                  onClick={() => handleNavigation('/cart')} title="Shopping Cart">
                  <ShoppingCart size={20} />
                  <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Shopping Cart
                  </span>
                </Button>
                
                {/* User Dashboard Button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full relative group" 
                  onClick={() => handleNavigation('/dashboard')}
                  title="My Dashboard"
                >
                  {userRole === "provider" ? <Briefcase size={20} /> : 
                   userRole === "seller" ? <ShoppingBag size={20} /> : <User size={20} />}
                  <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {userRole === "provider" ? "Provider Dashboard" : 
                     userRole === "seller" ? "Seller Dashboard" : "My Dashboard"}
                  </span>
                </Button>
              </>
            )}
            
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto bg-background p-6 pb-32 shadow-lg animate-in slide-in-from-top lg:hidden">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => handleNavigation('/categories')}
                className="text-lg font-medium"
              >
                Browse Services
              </button>
              
              {/* Mobile E-commerce Navigation */}
              <button 
                onClick={() => handleNavigation('/shop')}
                className="text-lg font-medium flex items-center"
              >
                <Store className="w-5 h-5 mr-2" />
                Shop
              </button>
              <button 
                onClick={() => handleNavigation('/cart')}
                className="text-lg font-medium flex items-center ml-4"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                View Cart
              </button>
              
              {userRole === "provider" && (
                <button 
                  onClick={() => handleNavigation('/dashboard/provider?tab=products')}
                  className="text-lg font-medium flex items-center ml-4"
                >
                  <Package className="w-5 h-5 mr-2" />
                  Manage Products
                </button>
              )}
              
              {userRole === "seller" && (
                <button 
                  onClick={() => handleNavigation('/dashboard/seller?tab=products')}
                  className="text-lg font-medium flex items-center ml-4"
                >
                  <Package className="w-5 h-5 mr-2" />
                  Manage Products
                </button>
              )}
              
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-lg font-medium"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-lg font-medium"
              >
                Testimonials
              </button>
              <button 
                onClick={() => handleNavigation('/become-seller')}
                className="text-lg font-medium"
              >
                Become a Seller
              </button>
              <button 
                onClick={() => scrollToSection('become-provider')}
                className="text-lg font-medium"
              >
                Become a Provider
              </button>
              
              <div className="flex flex-col space-y-2 pt-4">
                {!isAuthenticated ? (
                  <>
                    <Button variant="outline" className="w-full rounded-full" onClick={() => handleNavigation('/signin')}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                    <Button className="w-full rounded-full bg-servie hover:bg-servie-600" onClick={() => handleNavigation('/signup')}>
                      <User className="mr-2 h-4 w-4" />
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" className="w-full rounded-full" onClick={() => handleNavigation('/dashboard')}>
                    {userRole === "provider" ? (
                      <>
                        <Briefcase className="mr-2 h-4 w-4" />
                        Provider Dashboard
                      </>
                    ) : userRole === "seller" ? (
                      <>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Seller Dashboard
                      </>
                    ) : (
                      <>
                        <User className="mr-2 h-4 w-4" />
                        Client Dashboard
                      </>
                    )}
                  </Button>
                )}
                
                <div className="flex justify-center py-2">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
