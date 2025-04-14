
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SellerSidebar from "@/components/dashboard/SellerSidebar";
import OverviewTab from "@/components/dashboard/seller/OverviewTab";
import OrdersTab from "@/components/dashboard/seller/OrdersTab";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function SellerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "overview";

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "orders":
        return <OrdersTab />;
      case "products":
        return <div className="p-6">Product management functionality will be implemented here.</div>;
      case "inventory":
        return <div className="p-6">Inventory management functionality will be implemented here.</div>;
      case "customers":
        return <div className="p-6">Customer management functionality will be implemented here.</div>;
      case "payments":
        return <div className="p-6">Payment history and upcoming payments will be shown here.</div>;
      case "settings":
        return <div className="p-6">Seller account settings will be shown here.</div>;
      case "help":
        return <div className="p-6">Help and support resources will be available here.</div>;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        {/* Mobile sidebar toggle */}
        <div className="md:hidden p-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Mobile sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
            <div className="fixed inset-y-0 left-0 z-50 w-64 bg-background shadow-lg">
              <div className="flex justify-end p-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
              <SellerSidebar />
            </div>
          </div>
        )}
        
        {/* Desktop sidebar */}
        <SellerSidebar />
        
        {/* Main content */}
        <div className="flex-1 p-6 md:p-10 bg-muted/20">
          {renderTabContent()}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
