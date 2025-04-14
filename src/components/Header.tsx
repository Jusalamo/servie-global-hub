
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ui/ThemeToggle";
import { LangCurrencySelector } from "./LangCurrencySelector";
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
  ShoppingBag,
  Settings,
  LogOut,
  UserCog
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userRole, signOut, user } = useAuth();

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
        const headerOffset = 100; // Adjust based on header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
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
            const headerOffset = 100; // Adjust based on header height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 300); // Slightly longer timeout to ensure the page is fully rendered
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
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
            onClick={() => handleNavigation('/become-provider')} 
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
                
                {/* Notifications Button */}
                <Button variant="ghost" size="icon" className="rounded-full relative group" title="Notifications">
                  <Bell size={20} />
                  <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Notifications
                  </span>
                </Button>
                
                {/* Messages Button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full relative group"
                  title="Messages"
                >
                  <MessageSquare size={20} />
                  <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Messages
                  </span>
                </Button>
                
                {/* User Menu Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full relative">
                      <User size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</span>
                        <span className="text-xs text-muted-foreground">{user?.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleNavigation('/dashboard')}>
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
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation('/profile/edit')}>
                      <UserCog className="mr-2 h-4 w-4" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation('/dashboard?tab=settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <LangCurrencySelector />
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
                onClick={() => handleNavigation('/become-provider')}
                className="text-lg font-medium"
              >
                Become a Provider
              </button>
              
              {isAuthenticated && (
                <>
                  <button 
                    onClick={() => handleNavigation('/profile/edit')}
                    className="text-lg font-medium flex items-center"
                  >
                    <UserCog className="w-5 h-5 mr-2" />
                    Edit Profile
                  </button>
                  
                  <button 
                    onClick={handleSignOut}
                    className="text-lg font-medium flex items-center"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign Out
                  </button>
                </>
              )}
              
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
                  <LangCurrencySelector />
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
