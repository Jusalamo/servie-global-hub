
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SellerSidebar from "@/components/dashboard/SellerSidebar";
import SellerOverviewTab from "@/components/dashboard/seller/OverviewTab";
import ProductManagement from "@/components/dashboard/seller/ProductManagement";
import OrdersTab from "@/components/dashboard/seller/OrdersTab";
import MessagingSystem from "@/components/dashboard/MessagingSystem";
import PaymentMethods from "@/components/dashboard/PaymentMethods";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import NotificationsSettings from "@/components/dashboard/NotificationsSettings";
import FinancesTab from "@/components/dashboard/FinancesTab";
import { useLocation } from "react-router-dom";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";

export default function SellerDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('tab') || "overview";
  });

  useEffect(() => {
    // Update URL when tab changes
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('tab', activeTab);
    const newUrl = `${location.pathname}?${queryParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeTab, location.pathname, location.search]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Get breadcrumb label based on active tab
  const getBreadcrumbLabel = () => {
    switch (activeTab) {
      case "overview": return "Overview";
      case "products": return "Products";
      case "orders": return "Orders";
      case "finances": return "Finances";
      case "payments": return "Payments";
      case "messages": return "Messages";
      case "settings": return "Account Settings";
      case "notifications": return "Notifications";
      case "help": return "Help & Support";
      default: return "Overview";
    }
  };

  // Render the appropriate tab content based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <SellerOverviewTab />;
      case "products":
        return <ProductManagement />;
      case "orders":
        return <OrdersTab />;
      case "finances":
        return <FinancesTab userRole="seller" />;
      case "payments":
        return <PaymentMethods />;
      case "messages":
        return <MessagingSystem userRole="seller" />;
      case "settings":
        return <ProfileSettings userRole="seller" />;
      case "notifications":
        return <NotificationsSettings />;
      case "help":
        return <HelpSupportTab />;
      default:
        return <SellerOverviewTab />;
    }
  };

  // Create breadcrumb items
  const breadcrumbItems = [
    { label: getBreadcrumbLabel() }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardBreadcrumb items={breadcrumbItems} userRole="seller" />
      <DashboardLayout sidebar={<SellerSidebar activeTab={activeTab} onTabChange={handleTabChange} />}>
        {renderTabContent()}
      </DashboardLayout>
    </div>
  );
}

// Help & Support Tab component
const HelpSupportTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Help & Support</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">How do I manage my product inventory?</h4>
              <p className="text-sm text-muted-foreground">
                Navigate to the Products tab where you can add, edit, and manage 
                your product listings including stock quantities and pricing.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">How do I process orders?</h4>
              <p className="text-sm text-muted-foreground">
                Check the Orders tab to view pending orders, update their status, 
                and manage fulfillment.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Contact Support</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Need help with your seller account? Our team is here to assist you.
          </p>
          <button className="text-servie text-sm font-medium">Contact Us</button>
        </div>
      </div>
    </div>
  );
};
