import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Home, User, Bell, LayoutDashboard, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    ...(isAuthenticated ? [
      { label: 'Dashboard', href: getDashboardLink(), icon: LayoutDashboard },
      { label: 'Notifications', href: '/notifications', icon: Bell },
      { label: 'Profile', href: '/profile', icon: User }
    ] : [
      { label: 'Sign In', href: '/sign-in', icon: LogIn }
    ])
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden min-w-[44px] min-h-[44px]">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
        <ScrollArea className="h-full">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <h2 className="text-servie font-bold text-xl">Menu</h2>
            </div>
            
            <nav className="flex flex-col gap-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors min-h-[44px]"
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
            
            <div className="mt-auto border-t p-4">
              <p className="text-sm font-medium mb-3 px-4">Settings</p>
              <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-muted min-h-[44px]">
                <span className="text-sm">Theme</span>
                <ThemeToggle />
              </div>
              <div className="px-4 py-3">
                <p className="text-sm font-medium mb-2">Language & Currency</p>
                <LangCurrencySelector showCurrencies={true} />
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
