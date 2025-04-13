
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ui/ThemeToggle";
import { Menu, X, User, Bell, MessageSquare, Briefcase } from "lucide-react";
import { toast } from "sonner";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
            onClick={() => scrollToSection('become-provider')} 
            className="text-sm font-medium transition-colors hover:text-servie"
          >
            Become a Provider
          </button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="rounded-full" onClick={() => handleNavigation('/signin')}>
              Sign In
            </Button>
            <Button className="rounded-full bg-servie hover:bg-servie-600" onClick={() => handleNavigation('/signup')}>
              Sign Up
            </Button>
            {/* Dashboard access buttons with tooltips */}
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full relative group" 
                onClick={() => handleNavigation('/dashboard/client')}
                title="Client Dashboard"
              >
                <User size={20} />
                <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Client Dashboard
                </span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full relative group" 
                onClick={() => handleNavigation('/dashboard/provider')}
                title="Provider Dashboard"
              >
                <Briefcase size={20} />
                <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Provider Dashboard
                </span>
              </Button>
            </div>
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
                onClick={() => scrollToSection('become-provider')}
                className="text-lg font-medium"
              >
                Become a Provider
              </button>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" className="w-full rounded-full" onClick={() => handleNavigation('/signin')}>
                  Sign In
                </Button>
                <Button className="w-full rounded-full bg-servie hover:bg-servie-600" onClick={() => handleNavigation('/signup')}>
                  Sign Up
                </Button>
                <Button variant="outline" className="w-full rounded-full" onClick={() => handleNavigation('/dashboard/client')}>
                  Client Dashboard
                </Button>
                <Button variant="outline" className="w-full rounded-full" onClick={() => handleNavigation('/dashboard/provider')}>
                  Provider Dashboard
                </Button>
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
