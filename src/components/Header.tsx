import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown, Globe } from 'lucide-react';
import { Button } from './ui/button';
import ServieIcon from './ServieIcon';
import { useAuth } from '@/context/AuthContext';
import LangCurrencySelector from './LangCurrencySelector';
import CartIndicator from './CartIndicator';
import NotificationBell from './NotificationBell';

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
    <header className={`sticky top-0 z-50 w-full ${isScrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-md'}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <ServieIcon className="h-8 w-8 text-servie" />
            <span className="ml-2 text-xl font-bold">Servie</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/categories" className={`px-3 py-2 rounded-md text-sm ${pathname === '/categories' ? 'font-medium text-servie' : 'text-gray-700 hover:bg-gray-100'}`}>
              Services
            </Link>
            <Link to="/shop" className={`px-3 py-2 rounded-md text-sm ${pathname === '/shop' ? 'font-medium text-servie' : 'text-gray-700 hover:bg-gray-100'}`}>
              Shop
            </Link>
            <div className="relative">
              <button 
                className={`px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 flex items-center`}
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              >
                <Globe className="h-4 w-4 mr-1" />
                <span>Language</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </button>
              {showLanguageMenu && (
                <LangCurrencySelector 
                  onClose={() => setShowLanguageMenu(false)} 
                />
              )}
            </div>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            <CartIndicator />
            
            {isAuthenticated && <NotificationBell />}

            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <div className="h-8 w-8 rounded-full bg-servie/10 text-servie flex items-center justify-center mr-1">
                    <User size={16} />
                  </div>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>
                
                {/* User menu dropdown */}
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <button
                      onClick={signOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
              className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-2 pb-3 space-y-1">
            <Link to="/categories" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">
              Services
            </Link>
            <Link to="/shop" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">
              Shop
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">
                  Dashboard
                </Link>
                <Link to="/profile" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <button
                  onClick={signOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/sign-in" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">
                  Sign in
                </Link>
                <Link to="/sign-up" className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
