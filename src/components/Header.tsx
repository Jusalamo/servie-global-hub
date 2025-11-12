import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, ChevronDown, User } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LangCurrencySelector from './LangCurrencySelector';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, signOut, userRole } = useAuth();
  const { currentLanguage, translate } = useLocalization();
  const location = useLocation();

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
    <header className={`sticky top-0 z-50 w-full ${isScrolled ? 'bg-white shadow-md dark:bg-gray-900' : 'bg-white/80 backdrop-blur-md dark:bg-gray-900/90'}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <ServieIcon className="h-8 w-8 text-servie" />
              <span className="ml-2 text-xl font-bold text-servie">Servie</span>
            </Link>
          </div>
          
          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Mobile Navigation - shown on mobile only */}
            <MobileNav />
            {/* Only show these when authenticated */}
            {isAuthenticated && (
              <>
                <CartIndicator />
                <NotificationBell />
              </>
            )}

            {/* For desktop view */}
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2 min-w-0">
                    <Globe className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden xl:inline truncate max-w-[60px] text-xs">{currentLanguage.name}</span>
                    <ChevronDown className="h-3 w-3 opacity-50 flex-shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0 max-h-[400px] overflow-hidden" align="end">
                  <LangCurrencySelector showCurrencies={true} />
                </PopoverContent>
              </Popover>
              
              <ThemeToggle />
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 p-1">
                      <div className="h-8 w-8 rounded-full bg-servie/10 text-servie flex items-center justify-center flex-shrink-0">
                        <User size={16} />
                      </div>
                      <ChevronDown size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()} className="w-full cursor-pointer whitespace-normal">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full cursor-pointer whitespace-normal">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer whitespace-normal">
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" asChild size="sm" className="whitespace-nowrap">
                    <Link to="/sign-in">{translate('signIn')}</Link>
                  </Button>
                  <Button className="bg-servie hover:bg-servie-600 whitespace-nowrap" asChild size="sm">
                    <Link to="/sign-up">{translate('signUp')}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
