
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LangCurrencySelector } from "@/components/LangCurrencySelector";
import ServieIcon from "@/components/ServieIcon";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, X, User, Bell, MessageSquare, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Check if it's a landing page or other specific page
  const isLanding = location.pathname === "/";
  const isDashboard = location.pathname.startsWith("/dashboard");
  
  // Function to navigate to role-specific dashboards
  const navigateToUserFeature = (feature: string) => {
    if (!isAuthenticated) {
      navigate("/sign-in");
      return;
    }
    
    switch (userRole) {
      case "provider":
        navigate(`/dashboard/provider?tab=${feature}`);
        break;
      case "seller":
        navigate(`/dashboard/seller?tab=${feature}`);
        break;
      default:
        navigate(`/dashboard/client?tab=${feature}`);
        break;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled || !isLanding || isDashboard
          ? "bg-background/95 backdrop-blur border-b"
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
          <ServieIcon className="w-8 h-8 text-servie" />
          <span className="font-bold text-xl">Servie</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className={navigationMenuTriggerStyle()}>
                Home
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li className="col-span-2">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/categories"
                        className="flex items-center justify-between w-full rounded-md border p-4 hover:bg-muted"
                      >
                        <div>
                          <h3 className="text-sm font-medium">Browse All Services</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Explore and book from thousands of service providers
                          </p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/categories?category=home-services"
                        className="block select-none rounded-md border p-3 text-sm hover:bg-muted"
                      >
                        Home Services
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/categories?category=professional"
                        className="block select-none rounded-md border p-3 text-sm hover:bg-muted"
                      >
                        Professional Services
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/categories?category=personal-care"
                        className="block select-none rounded-md border p-3 text-sm hover:bg-muted"
                      >
                        Personal Care
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/categories?category=tech"
                        className="block select-none rounded-md border p-3 text-sm hover:bg-muted"
                      >
                        Tech & Digital Services
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/shop" className={navigationMenuTriggerStyle()}>
                Shop
              </Link>
            </NavigationMenuItem>
            {!isAuthenticated && (
              <NavigationMenuItem>
                <NavigationMenuTrigger>Join As</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/become-provider"
                          className="flex items-center justify-between w-full rounded-md border p-4 hover:bg-muted"
                        >
                          <div>
                            <h3 className="text-sm font-medium">Service Provider</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Offer your skills and services
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/become-seller"
                          className="flex items-center justify-between w-full rounded-md border p-4 hover:bg-muted"
                        >
                          <div>
                            <h3 className="text-sm font-medium">Seller</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Sell your products in our marketplace
                            </p>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          {/* Action Icons */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigateToUserFeature("messages")}
                aria-label="Messages"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigateToUserFeature("notifications")}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Link to="/cart">
                <Button variant="ghost" size="icon" aria-label="Shopping Cart">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/dashboard")} 
                aria-label="User Profile"
              >
                <User className="h-5 w-5" />
              </Button>
            </div>
          ) : null}

          <div className="hidden md:flex items-center gap-2">
            <LangCurrencySelector />
            <ThemeToggle />
          </div>

          {isAuthenticated ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="hidden md:inline-flex"
            >
              Sign Out
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" className="hidden md:inline-flex" asChild>
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" className="hidden md:inline-flex bg-servie hover:bg-servie-600" asChild>
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex-1 py-6">
                  <div className="mb-6 space-y-1">
                    <Link
                      to="/"
                      className="block px-3 py-2 rounded-md hover:bg-muted"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link
                      to="/categories"
                      className="block px-3 py-2 rounded-md hover:bg-muted"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Services
                    </Link>
                    <Link
                      to="/shop"
                      className="block px-3 py-2 rounded-md hover:bg-muted"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Shop
                    </Link>
                    {!isAuthenticated && (
                      <>
                        <Link
                          to="/become-provider"
                          className="block px-3 py-2 rounded-md hover:bg-muted"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Become a Provider
                        </Link>
                        <Link
                          to="/become-seller"
                          className="block px-3 py-2 rounded-md hover:bg-muted"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Become a Seller
                        </Link>
                      </>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="px-3 text-xs font-semibold text-muted-foreground">
                      Account
                    </div>
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User size={16} />
                          Dashboard
                        </Link>
                        <Link
                          to="/cart"
                          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <ShoppingCart size={16} />
                          Cart
                        </Link>
                        <button
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-left"
                          onClick={() => {
                            handleSignOut();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/sign-in"
                          className="block px-3 py-2 rounded-md hover:bg-muted"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/sign-up"
                          className="block px-3 py-2 rounded-md hover:bg-muted"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between px-3">
                    <LangCurrencySelector />
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
