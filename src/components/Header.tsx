
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
  UserCog,
  Home,
  Heart,
  Calendar,
  Search,
  HelpCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
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

  // Group navigation items for better organization
  const mainNavItems = [
    { label: "Home", onClick: () => handleNavigation('/') },
    { label: "Browse Services", onClick: () => handleNavigation('/categories') },
    { label: "How It Works", onClick: () => scrollToSection('how-it-works') },
    { label: "Shop", onClick: () => handleNavigation('/shop') },
  ];
  
  const secondaryNavItems = [
    { label: "Testimonials", onClick: () => scrollToSection('testimonials') },
    { label: "Become a Provider", onClick: () => handleNavigation('/become-provider') },
    { label: "Become a Seller", onClick: () => handleNavigation('/become-seller') },
  ];

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

        {/* Desktop navigation using Navigation Menu for better organization */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-2">
            {/* Home Link */}
            <NavigationMenuItem>
              <Link to="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            {/* Services Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[400px] grid-cols-2">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex flex-col justify-end w-full h-full p-6 no-underline rounded-md outline-none focus:shadow-md bg-gradient-to-b from-muted/50 to-muted"
                        href="/categories"
                      >
                        <div className="mt-4 mb-2 text-lg font-medium">
                          Browse All Services
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Find professional services for any task you need done
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="/categories?category=home-services"
                        className="block p-3 space-y-1 leading-none no-underline rounded-md outline-none hover:bg-muted focus:shadow-md"
                      >
                        <div className="text-sm font-medium">Home Services</div>
                        <p className="text-xs text-muted-foreground">
                          Cleaning, repairs, and maintenance
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="/categories?category=professional"
                        className="block p-3 space-y-1 leading-none no-underline rounded-md outline-none hover:bg-muted focus:shadow-md"
                      >
                        <div className="text-sm font-medium">Professional</div>
                        <p className="text-xs text-muted-foreground">
                          Design, accounting, and legal services
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="/categories?category=wellness"
                        className="block p-3 space-y-1 leading-none no-underline rounded-md outline-none hover:bg-muted focus:shadow-md"
                      >
                        <div className="text-sm font-medium">Wellness</div>
                        <p className="text-xs text-muted-foreground">
                          Fitness, health, and self-care
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="/categories?category=beauty"
                        className="block p-3 space-y-1 leading-none no-underline rounded-md outline-none hover:bg-muted focus:shadow-md"
                      >
                        <div className="text-sm font-medium">Beauty</div>
                        <p className="text-xs text-muted-foreground">
                          Hair, makeup, and nail services
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Shop Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Store className="w-4 h-4 mr-1" />
                Shop
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[350px]">
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="/shop"
                        className="block p-3 space-y-1 leading-none no-underline rounded-md outline-none hover:bg-muted focus:shadow-md"
                      >
                        <div className="text-sm font-medium">All Products</div>
                        <p className="text-xs text-muted-foreground">
                          Browse our full catalog of products
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="/shop?category=tools"
                        className="block p-3 space-y-1 leading-none no-underline rounded-md outline-none hover:bg-muted focus:shadow-md"
                      >
                        <div className="text-sm font-medium">Tools & Equipment</div>
                        <p className="text-xs text-muted-foreground">
                          High-quality tools for any project
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="/shop?category=home"
                        className="block p-3 space-y-1 leading-none no-underline rounded-md outline-none hover:bg-muted focus:shadow-md"
                      >
                        <div className="text-sm font-medium">Home & Living</div>
                        <p className="text-xs text-muted-foreground">
                          Products to enhance your living space
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="/cart"
                        className="flex items-center p-3 space-y-1 leading-none no-underline rounded-md outline-none hover:bg-muted focus:shadow-md"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        <span>View Shopping Cart</span>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            {/* About Links */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>About</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[350px]">
                  <li>
                    <button 
                      onClick={() => scrollToSection('how-it-works')}
                      className="block w-full text-left p-3 space-y-1 leading-none no-underline rounded-md outline-none hover:bg-muted focus:shadow-md"
                    >
                      <div className="text-sm font-medium">How It Works</div>
                      <p className="text-xs text-muted-foreground">
                        Learn about our platform and process
                      </p>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection('testimonials')}
                      className="block w-full text-left p-3 space-y-1 leading-none no-underline rounded-md outline-none hover:bg-muted focus:shadow-md"
                    >
                      <div className="text-sm font-medium">Testimonials</div>
                      <p className="text-xs text-muted-foreground">
                        See what our users are saying
                      </p>
                    </button>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="/contact"
                        className="block p-3 space-y-1 leading-none no-underline rounded-md outline-none hover:bg-muted focus:shadow-md"
                      >
                        <div className="text-sm font-medium">Contact Us</div>
                        <p className="text-xs text-muted-foreground">
                          Get in touch with our support team
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            {/* Join Us Links */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Join Us</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] md:grid-cols-2">
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="/become-provider"
                        className="block p-3 space-y-1 leading-none no-underline rounded-md outline-none hover:bg-muted focus:shadow-md"
                      >
                        <div className="flex items-center mb-2">
                          <Briefcase className="w-4 h-4 mr-2 text-servie" />
                          <span className="text-sm font-medium">Service Provider</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Offer your professional services and grow your business
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="/become-seller"
                        className="block p-3 space-y-1 leading-none no-underline rounded-md outline-none hover:bg-muted focus:shadow-md"
                      >
                        <div className="flex items-center mb-2">
                          <ShoppingBag className="w-4 h-4 mr-2 text-servie" />
                          <span className="text-sm font-medium">Seller</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Sell your products on our marketplace
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden lg:flex items-center space-x-2">
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
                <DropdownMenuContent align="end" className="w-56">
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

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto bg-background p-6 pb-32 shadow-lg animate-in slide-in-from-top lg:hidden">
            <div className="flex flex-col space-y-4">
              {/* Mobile Navigation Items */}
              <button onClick={() => handleNavigation('/')} className="text-lg font-medium flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Home
              </button>
              
              <button onClick={() => handleNavigation('/categories')} className="text-lg font-medium flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Browse Services
              </button>
              
              <button onClick={() => handleNavigation('/shop')} className="text-lg font-medium flex items-center">
                <Store className="w-5 h-5 mr-2" />
                Shop
              </button>
              
              <button onClick={() => handleNavigation('/cart')} className="text-lg font-medium flex items-center ml-4">
                <ShoppingCart className="w-5 h-5 mr-2" />
                View Cart
              </button>
              
              <button onClick={() => scrollToSection('how-it-works')} className="text-lg font-medium flex items-center">
                <HelpCircle className="w-5 h-5 mr-2" />
                How It Works
              </button>
              
              <button onClick={() => scrollToSection('testimonials')} className="text-lg font-medium flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Testimonials
              </button>
              
              <button onClick={() => handleNavigation('/become-provider')} className="text-lg font-medium flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Become a Provider
              </button>
              
              <button onClick={() => handleNavigation('/become-seller')} className="text-lg font-medium flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Become a Seller
              </button>
              
              {userRole === "provider" && (
                <button onClick={() => handleNavigation('/dashboard/provider?tab=products')} className="text-lg font-medium flex items-center ml-4">
                  <Package className="w-5 h-5 mr-2" />
                  Manage Products
                </button>
              )}
              
              {userRole === "seller" && (
                <button onClick={() => handleNavigation('/dashboard/seller?tab=products')} className="text-lg font-medium flex items-center ml-4">
                  <Package className="w-5 h-5 mr-2" />
                  Manage Products
                </button>
              )}
              
              {isAuthenticated && (
                <>
                  <button onClick={() => handleNavigation('/profile/edit')} className="text-lg font-medium flex items-center">
                    <UserCog className="w-5 h-5 mr-2" />
                    Edit Profile
                  </button>
                  
                  <button onClick={handleSignOut} className="text-lg font-medium flex items-center">
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
