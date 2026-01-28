import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ClientSidebar } from "@/components/dashboard/ClientSidebar";
import { OverviewTab } from "@/components/dashboard/client/OverviewTab";
import { BookingsTab } from "@/components/dashboard/client/BookingsTab";
import { FavoritesTab } from "@/components/dashboard/client/FavoritesTab";
import MessagingSystem from "@/components/dashboard/MessagingSystem";
import PaymentMethods from "@/components/dashboard/PaymentMethods";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import NotificationsSettings from "@/components/dashboard/NotificationsSettings";
import { useAuth } from "@/context/AuthContext";
import { HelpSupportTab } from "@/components/dashboard/shared/HelpSupportTab";

export default function ClientDashboard() {
  const location = useLocation();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('tab') || "overview";
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('tab', activeTab);
    const newUrl = `${location.pathname}?${queryParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeTab, location.pathname, location.search]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const renderTabContent = () => {
    switch(activeTab) {
      case "overview":
        return <OverviewTab />;
      case "bookings":
        return <BookingsTab />;
      case "favorites":
        return <FavoritesTab />;
      case "messages":
        return <MessagingSystem userRole="client" />;
      case "payments":
        return <PaymentMethods />;
      case "settings":
        return <ProfileSettings userRole="client" />;
      case "notifications":
        return <NotificationsSettings />;
      case "help":
        return <HelpSupportTab />;
      default:
        return <OverviewTab />;
    }
  };
  
  return (
    <DashboardLayout sidebar={<ClientSidebar activeTab={activeTab} setActiveTab={handleTabChange} user={profile} />}>
      {renderTabContent()}
    </DashboardLayout>
  );
}
