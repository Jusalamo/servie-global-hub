
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProviderSidebar from "@/components/dashboard/ProviderSidebar";
import ProviderOverviewTab from "@/components/dashboard/provider/OverviewTab";
import ServicesTab from "@/components/dashboard/provider/ServicesTab";
import BookingsTab from "@/components/dashboard/provider/BookingsTab";
import ReviewsTab from "@/components/dashboard/provider/ReviewsTab";
import MessagingSystem from "@/components/dashboard/MessagingSystem";
import PaymentMethods from "@/components/dashboard/PaymentMethods";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import NotificationsSettings from "@/components/dashboard/NotificationsSettings";
import FinancesTab from "@/components/dashboard/FinancesTab";
import { useLocation } from "react-router-dom";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";

export default function ProviderDashboard() {
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
      case "services": return "Services";
      case "bookings": return "Bookings";
      case "finances": return "Finances";
      case "reviews": return "Reviews";
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
        return <ProviderOverviewTab />;
      case "services":
        return <ServicesTab />;
      case "bookings":
        return <BookingsTab />;
      case "finances":
        return <FinancesTab userRole="provider" />;
      case "reviews":
        return <ReviewsTab />;
      case "payments":
        return <PaymentMethods />;
      case "messages":
        return <MessagingSystem userRole="provider" />;
      case "settings":
        return <ProfileSettings userRole="provider" />;
      case "notifications":
        return <NotificationsSettings />;
      case "help":
        return <HelpSupportTab />;
      default:
        return <ProviderOverviewTab />;
    }
  };

  // Create breadcrumb items
  const breadcrumbItems = [
    { label: getBreadcrumbLabel() }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardBreadcrumb items={breadcrumbItems} userRole="provider" />
      <DashboardLayout sidebar={<ProviderSidebar activeTab={activeTab} onTabChange={handleTabChange} />}>
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
              <h4 className="font-medium">How do I manage my service listings?</h4>
              <p className="text-sm text-muted-foreground">
                Navigate to the Services tab where you can add, edit, and manage 
                your service offerings including pricing and availability.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">How do I handle bookings?</h4>
              <p className="text-sm text-muted-foreground">
                Check the Bookings tab to view pending bookings, confirm appointments, 
                and manage your schedule.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Contact Support</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Need help with your provider account? Our team is here to assist you.
          </p>
          <button className="text-servie text-sm font-medium">Contact Us</button>
        </div>
      </div>
    </div>
  );
};
