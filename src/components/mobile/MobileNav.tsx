import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Home, LayoutDashboard, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Separator } from '@/components/ui/separator';

export const MobileNav = memo(() => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, userRole, signOut } = useAuth();
  const { t } = useTranslation();

  const getDashboardLink = () => {
    if (!userRole) return "/dashboard";
    switch (userRole) {
      case "provider": return "/dashboard/provider";
      case "seller": return "/dashboard/seller";
      default: return "/dashboard/client";
    }
  };

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden min-w-[44px] min-h-[44px]">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] p-0">
        <ScrollArea className="h-full">
          <div className="flex flex-col h-full">
            <div className="p-5 border-b">
              <h2 className="text-servie font-bold text-lg">{t('menu', 'Menu')}</h2>
            </div>
            
            <nav className="flex flex-col p-3 space-y-1">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors min-h-[44px]"
              >
                <Home className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{t('Home', 'Home')}</span>
              </Link>
              
              {isAuthenticated && (
                <>
                  <Separator className="my-2" />
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors min-h-[44px]"
                  >
                    <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{t('dashboard', 'Dashboard')}</span>
                  </Link>
                </>
              )}
            </nav>
            
            <div className="mt-auto border-t p-4 space-y-2">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-muted min-h-[44px]">
                <span className="text-sm font-medium">{t('theme', 'Theme')}</span>
                <ThemeToggle />
              </div>

              {/* Auth Actions */}
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 px-4 py-3 h-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">{t('sign_out', 'Sign Out')}</span>
                </Button>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/sign-in"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors min-h-[44px]"
                  >
                    <LogIn className="h-5 w-5" />
                    <span className="font-medium">{t('signIn', 'Sign In')}</span>
                  </Link>
                  <Link
                    to="/sign-up"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-servie text-white hover:bg-servie-600 transition-colors min-h-[44px]"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span className="font-medium">{t('signUp', 'Sign Up')}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
});

MobileNav.displayName = 'MobileNav';