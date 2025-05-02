
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SellerSidebar from "@/components/dashboard/SellerSidebar";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";
import AIAssistant from "@/components/dashboard/AIAssistant";
import { PlaceholderTab } from "@/components/dashboard/client/PlaceholderTab";
import Breadcrumb from "@/components/Breadcrumb";

const SellerDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Extract active tab from URL if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);
  
  const getBreadcrumbItems = () => {
    switch(activeTab) {
      case "orders":
        return [{ label: "Orders" }];
      case "products":
        return [{ label: "Products" }];
      case "inventory":
        return [{ label: "Inventory" }];
      case "analytics":
        return [{ label: "Analytics" }];
      case "store":
        return [{ label: "Store Settings" }];
      case "customers":
        return [{ label: "Customers" }];
      case "messages":
        return [{ label: "Messages" }];
      case "payments":
        return [{ label: "Payments" }];
      case "settings":
        return [{ label: "Settings" }];
      case "help":
        return [{ label: "Help" }];
      default:
        return [{ label: "Overview" }];
    }
  };
  
  const renderTabContent = () => {
    // Just show placeholder for now
    return (
      <PlaceholderTab
        title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
        message={`The ${activeTab} section for sellers will be implemented in a future update`}
        setActiveTab={setActiveTab}
      />
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumb 
        additionalCrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Seller", href: "/dashboard/seller" },
          { label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }
        ]} 
      />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:block">
            <SellerSidebar />
          </div>
          
          {/* Main Content Area */}
          <div className="space-y-6">
            <DashboardBreadcrumb 
              items={getBreadcrumbItems()}
              userRole="seller"
            />
            {renderTabContent()}
          </div>
        </div>
      </main>
      <Footer />
      
      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default SellerDashboard;
