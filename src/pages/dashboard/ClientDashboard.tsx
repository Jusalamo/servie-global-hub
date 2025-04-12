
import { useState } from "react";
import { services, bookings, users } from "@/data/mockData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClientSidebar } from "@/components/dashboard/ClientSidebar";
import { OverviewTab } from "@/components/dashboard/client/OverviewTab";
import { BookingsTab } from "@/components/dashboard/client/BookingsTab";
import { FavoritesTab } from "@/components/dashboard/client/FavoritesTab";
import { PlaceholderTab } from "@/components/dashboard/client/PlaceholderTab";

// Use the first client for demo purposes
const clientUser = users.find(user => user.role === "client");

// Get client bookings
const clientBookings = bookings.filter(booking => booking.clientId === clientUser?.id);

// Get favorite services
const favoriteServices = clientUser?.favorites ? 
  services.filter(service => clientUser.favorites?.includes(service.id)) : 
  services.slice(0, 3); // Just show 3 random services if no favorites

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const renderTabContent = () => {
    switch(activeTab) {
      case "overview":
        return (
          <OverviewTab 
            clientUser={clientUser} 
            clientBookings={clientBookings} 
            services={services} 
            favoriteServices={favoriteServices}
            setActiveTab={setActiveTab}
          />
        );
      case "bookings":
        return <BookingsTab clientBookings={clientBookings} services={services} />;
      case "favorites":
        return <FavoritesTab favoriteServices={favoriteServices} />;
      case "messages":
        return (
          <PlaceholderTab
            title="Messages"
            message="Your message center will be implemented in a future update"
            setActiveTab={setActiveTab}
          />
        );
      case "payments":
        return (
          <PlaceholderTab
            title="Payment Methods"
            message="The payment management system will be implemented in a future update"
            setActiveTab={setActiveTab}
          />
        );
      case "settings":
        return (
          <PlaceholderTab
            title="Account Settings"
            message="Account settings and preferences will be implemented in a future update"
            setActiveTab={setActiveTab}
          />
        );
      default:
        return <div>Tab not found</div>;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar Navigation */}
          <ClientSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            clientUser={clientUser} 
          />
          
          {/* Main Content Area */}
          <div className="space-y-6">
            {renderTabContent()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientDashboard;
