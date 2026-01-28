import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, User } from 'lucide-react';
import { Button } from './ui/button';
import ServieIcon from './ServieIcon';
import { useAuth } from '@/context/AuthContext';
import { useLocalization } from './LangCurrencySelector';
import CartIndicator from './CartIndicator';
import NotificationBell from './NotificationBell';
import { ThemeToggle } from './ui/ThemeToggle';
import { MobileNav } from './mobile/MobileNav';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, signOut, userRole } = useAuth();
  const { translate } = useLocalization();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const getDashboardLink = () => {
    if (!userRole) return "/dashboard";
    
    switch (userRole) {
      case "provider":
        return "/dashboard/provider";
      case "seller":
        return "/dashboard/seller";
      default:
        return "/dashboard/client";
    }
  };

  return (
    <header className={`sticky top-0 z-50 w-full h-[60px] ${isScrolled ? 'bg-background shadow-md' : 'bg-background/80 backdrop-blur-md'}`}>
      <div className="container mx-auto px-4 h-full max-w-[1200px]">
        <div className="flex h-full items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <ServieIcon className="h-7 w-7 text-servie" />
            <span className="ml-2 text-lg font-bold text-servie">Servie</span>
          </Link>
          
          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Only show these when authenticated */}
            {isAuthenticated && (
              <>
                <CartIndicator />
                <NotificationBell />
              </>
            )}

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/categories">Services</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/shop">Shop</Link>
              </Button>
            </nav>

            {/* For desktop view */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 p-1">
                      <div className="h-8 w-8 rounded-full bg-servie/10 text-servie flex items-center justify-center flex-shrink-0">
                        <User size={16} />
                      </div>
                      <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()} className="w-full cursor-pointer">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" asChild size="sm">
                    <Link to="/sign-in">{translate('signIn')}</Link>
                  </Button>
                  <Button className="bg-servie hover:bg-servie-600" asChild size="sm">
                    <Link to="/sign-up">{translate('signUp')}</Link>
                  </Button>
                </div>
              )}
            </div>
            
            {/* Mobile Navigation - shown on mobile only */}
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
