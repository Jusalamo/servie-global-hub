
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { services, bookings } from "@/data/mockData";
import { ClientSidebar } from "@/components/dashboard/ClientSidebar";
import { OverviewTab } from "@/components/dashboard/client/OverviewTab";
import { BookingsTab } from "@/components/dashboard/client/BookingsTab";
import { FavoritesTab } from "@/components/dashboard/client/FavoritesTab";
import { PlaceholderTab } from "@/components/dashboard/client/PlaceholderTab";
import AIAssistant from "@/components/dashboard/AIAssistant";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import Breadcrumb from "@/components/Breadcrumb";
import MessagingSystem from "@/components/dashboard/MessagingSystem";
import PaymentMethods from "@/components/dashboard/PaymentMethods";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import NotificationsSettings from "@/components/dashboard/NotificationsSettings";

// Get client bookings based on authenticated user
const getClientBookings = (userId: string | undefined) => {
  return userId ? bookings.filter(booking => booking.clientId === userId) : [];
};

// Get favorite services - for now using first 3 services as default
const getFavoriteServices = () => {
  return services.slice(0, 3);
};

const ClientDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const { user, userRole } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();
  
  // Get user-specific data
  const clientBookings = getClientBookings(user?.id);
  const favoriteServices = getFavoriteServices();
  
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
      case "bookings":
        return [{ label: "Bookings" }];
      case "favorites":
        return [{ label: "Favorites" }];
      case "messages":
        return [{ label: "Messages" }];
      case "payments":
        return [{ label: "Payment Methods" }];
      case "settings":
        return [{ label: "Account Settings" }];
      case "notifications":
        return [{ label: "Notifications" }];
      default:
        return [{ label: "Overview" }];
    }
  };
  
  const renderTabContent = () => {
    switch(activeTab) {
      case "overview":
        return <OverviewTab 
          user={profile} 
          bookings={clientBookings} 
          favoriteServices={favoriteServices} 
          isLoading={profileLoading}
        />;
      case "bookings":
        return <BookingsTab bookings={clientBookings} />;
      case "favorites":
        return <FavoritesTab services={favoriteServices} />;
      case "messages":
        return <MessagingSystem userRole="client" />;
      case "payments":
        return <PaymentMethods />;
      case "settings":
        return <ProfileSettings userRole="client" />;
      case "notifications":
        return <NotificationsSettings />;
      default:
        return <div>Tab not found</div>;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-roboto">
      <Breadcrumb 
        additionalCrumbs={[
          { label: "Client Dashboard", href: "/dashboard/client" },
          { label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }
        ]} 
      />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar Navigation */}
          <ClientSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            user={profile} 
          />
          
          {/* Main Content Area */}
          <div className="space-y-6">
            <DashboardBreadcrumb 
              items={getBreadcrumbItems()}
              userRole="client"
            />
            {renderTabContent()}
          </div>
        </div>
      </main>
      
      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default ClientDashboard;
