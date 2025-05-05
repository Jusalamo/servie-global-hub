
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown, Globe } from 'lucide-react';
import { Button } from './ui/button';
import ServieIcon from './ServieIcon';
import { useAuth } from '@/context/AuthContext';
import { LangCurrencySelector } from './LangCurrencySelector';
import CartIndicator from './CartIndicator';
import NotificationBell from './NotificationBell';
import { ThemeToggle } from './ui/ThemeToggle';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const location = useLocation();
  const { pathname } = location;

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
              Services
            </Link>
            <Link to="/shop" className={`px-3 py-2 rounded-md text-sm ${pathname === '/shop' ? 'font-medium text-servie' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}`}>
              Shop
            </Link>
            <div className="relative">
              <button 
                className={`px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 flex items-center`}
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              >
                <Globe className="h-4 w-4 mr-1" />
                <span>Language</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </button>
              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden">
                  <LangCurrencySelector />
                  <div className="p-2 border-t dark:border-gray-700">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-right text-muted-foreground"
                      onClick={() => setShowLanguageMenu(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <CartIndicator />
            
            {isAuthenticated && <NotificationBell />}

            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="h-8 w-8 rounded-full bg-servie/10 text-servie flex items-center justify-center mr-1">
                    <User size={16} />
                  </div>
                  <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                </button>
                
                {/* User menu dropdown */}
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Dashboard
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Profile
                    </Link>
                    <button
                      onClick={signOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild size="sm">
                  <Link to="/sign-in">Sign in</Link>
                </Button>
                <Button className="bg-servie hover:bg-servie-600" asChild size="sm">
                  <Link to="/sign-up">Sign up</Link>
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
              Services
            </Link>
            <Link to="/shop" className="block px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
              Shop
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
                  Sign in
                </Link>
                <Link to="/sign-up" className="block px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                  Sign up
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
