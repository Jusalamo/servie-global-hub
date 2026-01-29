import { ReactNode, useState, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Home, Store, Briefcase, ShoppingCart, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import AIAssistant from "@/components/dashboard/AIAssistant";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

const DashboardLayout = memo(({ children, sidebar }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      <div className="flex flex-1 w-full">
        {/* Consolidated Mobile Sidebar Toggle - Single hamburger menu */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed left-4 top-20 z-40 lg:hidden bg-background shadow-md border min-w-[44px] min-h-[44px]"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="text-left text-servie">Dashboard Menu</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-80px)]">
              <div className="h-full flex flex-col">
                {/* Dashboard Sidebar Content */}
                <div className="flex-1" onClick={() => setSidebarOpen(false)}>
                  {sidebar}
                </div>
                
                {/* Sign Out at Bottom */}
                <div className="border-t p-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[44px]"
                    onClick={async () => {
                      setSidebarOpen(false);
                      await signOut();
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-[260px] flex-shrink-0 border-r bg-card">
          <div className="sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto">
            {sidebar}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 md:p-6 overflow-auto">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>

        <AIAssistant />
      </div>
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;
