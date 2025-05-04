
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProviderSidebar from "@/components/dashboard/ProviderSidebar";
import { ProviderOverviewTab } from "@/components/dashboard/provider/OverviewTab";
import AddServiceForm from "@/components/dashboard/provider/AddServiceForm";
import BookingsTab from "@/components/dashboard/provider/BookingsTab";
import BookingsCalendarTab from "@/components/dashboard/provider/BookingsCalendarTab";
import ClientsTab from "@/components/dashboard/provider/ClientsTab";
import ReviewsTab from "@/components/dashboard/provider/ReviewsTab";

// Mock data for calendar bookings
const mockBookings = [
  {
    id: "book-1",
    clientName: "Sarah Johnson",
    clientAvatar: "https://randomuser.me/api/portraits/women/32.jpg",
    service: "Home Cleaning",
    date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    status: "confirmed",
    address: "123 Main St, Cityville",
    amount: 85
  },
  {
    id: "book-2",
    clientName: "Michael Chen",
    clientAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
    service: "Carpet Cleaning",
    date: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
    status: "pending",
    address: "456 Oak Ave, Townsburg",
    amount: 120
  }
];

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Render the appropriate tab content based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProviderOverviewTab />;
      case "services":
        return <AddServiceForm />;
      case "bookings":
        return <BookingsTab />;
      case "schedule":
        return <BookingsCalendarTab bookings={mockBookings} />;
      case "clients":
        return <ClientsTab />;
      case "reviews":
        return <ReviewsTab />;
      case "payments":
        return <PlaceholderContent title="Payments" message="Track your earnings, payment history, and manage payout settings." />;
      case "messages":
        return <PlaceholderContent title="Messages" message="Communicate with clients about bookings and services." />;
      case "products":
        return <PlaceholderContent title="Products" message="Manage physical products that complement your services." />;
      case "settings":
        return <PlaceholderContent title="Settings" message="Configure your provider profile, notifications, and account settings." />;
      case "help":
        return <PlaceholderContent title="Help & Support" message="Get assistance with using the platform and growing your business." />;
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

// Add this PlaceholderContent component at the bottom of the file
const PlaceholderContent = ({ title, message }: { title: string; message: string }) => {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{message}</p>
      <p>This section is coming soon. Check back for updates!</p>
    </div>
  );
};
