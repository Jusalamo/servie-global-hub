import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProviderSidebar from "@/components/dashboard/ProviderSidebar";
import { ProviderOverviewTab } from "@/components/dashboard/provider/OverviewTab";
import ServiceManagement from "@/components/dashboard/provider/ServiceManagement";
import BookingsTab from "@/components/dashboard/provider/BookingsTab";
import ClientsTab from "@/components/dashboard/provider/ClientsTab";
import ReviewsTab from "@/components/dashboard/provider/ReviewsTab";
import AvailabilityManager from "@/components/dashboard/provider/AvailabilityManager";
import MessagingSystem from "@/components/dashboard/MessagingSystem";
import PaymentMethods from "@/components/dashboard/PaymentMethods";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import NotificationsSettings from "@/components/dashboard/NotificationsSettings";
import FinancialDocumentsTab from "@/components/dashboard/provider/FinancialDocumentsTab";
import InventoryManagement from "@/components/dashboard/InventoryManagement";
import { HelpSupportTab } from "@/components/dashboard/shared/HelpSupportTab";

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
      case "documents": return "Financial Documents";
      case "availability": return "Availability";
      case "clients": return "Clients";
      case "reviews": return "Reviews";
      case "payments": return "Payments";
      case "messages": return "Messages";
      case "settings": return "Account Settings";
      case "help": return "Help & Support";
      case "notifications": return "Notifications";
      default: return "Overview";
    }
  };

  // Render the appropriate tab content based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProviderOverviewTab />;
      case "services":
        return <ServiceManagement />;
      case "bookings":
        return <BookingsTab />;
      case "documents":
        return <FinancialDocumentsTab />;
      case "availability":
        return <AvailabilityManager />;
      case "clients":
        return <ClientsTab />;
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
      case "inventory":
        return <InventoryManagement userRole="provider" />;
      default:
        return <ProviderOverviewTab />;
    }
  };

  return (
    <DashboardLayout sidebar={<ProviderSidebar activeTab={activeTab} onTabChange={handleTabChange} />}>
      {renderTabContent()}
    </DashboardLayout>
  );
}

// Icon components
const MessageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
