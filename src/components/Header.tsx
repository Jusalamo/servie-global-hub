
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown, Globe, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import ServieIcon from './ServieIcon';
import { useAuth } from '@/context/AuthContext';
import { useLocalization } from './LangCurrencySelector';
import CartIndicator from './CartIndicator';
import NotificationBell from './NotificationBell';
import { ThemeToggle } from './ui/ThemeToggle';
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
import { LangCurrencySelector } from './LangCurrencySelector';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const location = useLocation();
  const { pathname } = location;
  const { currentLanguage, currentCurrency, translate } = useLocalization();

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

  return (
    <header className={`sticky top-0 z-50 w-full ${isScrolled ? 'bg-white shadow-md dark:bg-gray-900' : 'bg-white/80 backdrop-blur-md dark:bg-gray-900/90'}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <ServieIcon className="h-8 w-8 text-servie" />
            <span className="ml-2 text-xl font-bold">Servie</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/categories" className={`px-3 py-2 rounded-md text-sm ${pathname === '/categories' ? 'font-medium text-servie' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}`}>
              {translate('services')}
            </Link>
            <Link to="/shop" className={`px-3 py-2 rounded-md text-sm ${pathname === '/shop' ? 'font-medium text-servie' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}`}>
              {translate('shop')}
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Language selector */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">{currentLanguage.name}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="end">
                <LangCurrencySelector />
              </PopoverContent>
            </Popover>
            
            {/* Currency selector */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <span className="text-base font-medium">{currentCurrency.symbol}</span>
                  <span className="hidden sm:inline">{currentCurrency.code}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="end">
                <div className="py-4 px-2 max-h-[300px] overflow-y-auto">
                  <p className="text-sm font-medium mb-3 px-2">Select Currency</p>
                  <div className="grid grid-cols-1 gap-1">
                    {/* Render currencies from LangCurrencySelector */}
                    <LangCurrencySelector showLanguages={false} />
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <ThemeToggle />
            
            <CartIndicator />
            
            {isAuthenticated && <NotificationBell />}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 p-1">
                    <div className="h-8 w-8 rounded-full bg-servie/10 text-servie flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="w-full cursor-pointer">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">Profile</Link>
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
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-2 pb-3 space-y-1">
            <Link to="/categories" className="block px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
              {translate('services')}
            </Link>
            <Link to="/shop" className="block px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
              {translate('shop')}
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                  Dashboard
                </Link>
                <Link to="/profile" className="block px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                  Profile
                </Link>
                <button
                  onClick={signOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/sign-in" className="block px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                  {translate('signIn')}
                </Link>
                <Link to="/sign-up" className="block px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                  {translate('signUp')}
                </Link>
              </>
            )}
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-200">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
