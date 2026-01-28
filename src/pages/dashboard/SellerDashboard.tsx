import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SellerSidebar from "@/components/dashboard/SellerSidebar";
import SellerOverviewTab from "@/components/dashboard/seller/OverviewTab";
import ProductManagement from "@/components/dashboard/seller/ProductManagement";
import OrdersTab from "@/components/dashboard/seller/OrdersTab";
import ShopSettings from "@/components/dashboard/seller/ShopSettings";
import MessagingSystem from "@/components/dashboard/MessagingSystem";
import PaymentMethods from "@/components/dashboard/PaymentMethods";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import NotificationsSettings from "@/components/dashboard/NotificationsSettings";
import { SellerWallet } from "@/components/dashboard/SellerWallet";
import InventoryManagement from "@/components/dashboard/InventoryManagement";
import { useLocation } from "react-router-dom";
import { HelpSupportTab } from "@/components/dashboard/shared/HelpSupportTab";

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
      case "shop": return "My Shop";
      case "orders": return "Orders";
      case "payments": return "Payments";
      case "wallet": return "Wallet & Commission";
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
      case "shop":
        return <ShopSettings />;
      case "orders":
        return <OrdersTab />;
      case "payments":
        return <PaymentMethods />;
      case "wallet":
        return <SellerWallet />;
      case "messages":
        return <MessagingSystem userRole="seller" />;
      case "settings":
        return <ProfileSettings userRole="seller" />;
      case "notifications":
        return <NotificationsSettings />;
      case "help":
        return <HelpSupportTab />;
      case "inventory":
        return <InventoryManagement userRole="seller" />;
      default:
        return <SellerOverviewTab />;
    }
  };

  return (
    <DashboardLayout sidebar={<SellerSidebar activeTab={activeTab} onTabChange={handleTabChange} />}>
      {renderTabContent()}
    </DashboardLayout>
  );
}
