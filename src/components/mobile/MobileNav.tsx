import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Search, ShoppingBag, User, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import LangCurrencySelector from '@/components/LangCurrencySelector';

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, userRole } = useAuth();

  const getDashboardLink = () => {
    if (!userRole) return "/dashboard";
    switch (userRole) {
      case "provider": return "/dashboard/provider";
      case "seller": return "/dashboard/seller";
      default: return "/dashboard/client";
    }
  };

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Services', href: '/services', icon: Search },
    { label: 'Shop', href: '/shop', icon: ShoppingBag },
    ...(isAuthenticated ? [
      { label: 'Dashboard', href: getDashboardLink(), icon: User },
      { label: 'Notifications', href: '/notifications', icon: Bell }
    ] : [
      { label: 'Sign In', href: '/signin', icon: User }
    ])
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span className="text-servie font-bold text-xl">Servie</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </SheetTitle>
        </SheetHeader>
        
        <nav className="flex flex-col gap-4 mt-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          
          <div className="mt-4 pt-4 border-t">
            <div className="px-4 py-2">
              <p className="text-sm font-medium mb-2">Settings</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm">Theme</span>
                <ThemeToggle />
              </div>
              <div className="text-sm">
                <LangCurrencySelector showCurrencies={true} />
              </div>
            </div>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
