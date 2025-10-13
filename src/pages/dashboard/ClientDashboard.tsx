
import { useState, useEffect, memo, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { ClientSidebar } from "@/components/dashboard/ClientSidebar";
import { OverviewTab } from "@/components/dashboard/client/OverviewTab";
import { BookingsTab } from "@/components/dashboard/client/BookingsTab";
import { FavoritesTab } from "@/components/dashboard/client/FavoritesTab";
import { PlaceholderTab } from "@/components/dashboard/client/PlaceholderTab";
import AIAssistant from "@/components/dashboard/AIAssistant";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";
import { useAuth } from "@/context/AuthContext";
import MessagingSystem from "@/components/dashboard/MessagingSystem";
import PaymentMethods from "@/components/dashboard/PaymentMethods";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import NotificationsSettings from "@/components/dashboard/NotificationsSettings";
import { Skeleton } from "@/components/ui/skeleton";

const ClientDashboard = memo(() => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const { profile, isLoading: profileLoading } = useAuth();
  
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
    const LoadingFallback = () => <Skeleton className="h-64" />;
    
    switch(activeTab) {
      case "overview":
        return <Suspense fallback={<LoadingFallback />}><OverviewTab /></Suspense>;
      case "bookings":
        return <Suspense fallback={<LoadingFallback />}><BookingsTab /></Suspense>;
      case "favorites":
        return <Suspense fallback={<LoadingFallback />}><FavoritesTab /></Suspense>;
      case "messages":
        return <Suspense fallback={<LoadingFallback />}><MessagingSystem userRole="client" /></Suspense>;
      case "payments":
        return <Suspense fallback={<LoadingFallback />}><PaymentMethods /></Suspense>;
      case "settings":
        return <Suspense fallback={<LoadingFallback />}><ProfileSettings userRole="client" /></Suspense>;
      case "notifications":
        return <Suspense fallback={<LoadingFallback />}><NotificationsSettings /></Suspense>;
      default:
        return <div>Tab not found</div>;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-roboto">
      <main className="flex-1 container mx-auto py-4 px-3 sm:py-6 sm:px-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <ClientSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            user={profile} 
          />
          
          {/* Main Content Area */}
          <div className="space-y-4 sm:space-y-6">
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
});

export default ClientDashboard;
