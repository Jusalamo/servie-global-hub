
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  ShoppingBag, 
  BarChart2, 
  Tag, 
  Users, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  MessageSquare, 
  TrendingUp, 
  Store 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import OverviewTab from "@/components/dashboard/seller/OverviewTab";
import AddProductForm from "@/components/dashboard/seller/AddProductForm";
import OrdersTab from "@/components/dashboard/seller/OrdersTab";
import SellerSidebar from "@/components/dashboard/SellerSidebar";

// Define the PlaceholderContent component
const PlaceholderContent = ({ title, message }: { title: string; message: string }) => {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{message}</p>
      <p>This section is coming soon. Check back for updates!</p>
    </div>
  );
};

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Render the appropriate tab content based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "products":
        // Only pass onSuccess if the component supports it
        return <AddProductForm />;
      case "orders":
        return <OrdersTab />;
      case "inventory":
        return <PlaceholderContent title="Inventory Management" message="Track stock levels, set alerts, and manage product inventory." />;
      case "analytics":
        return <PlaceholderContent title="Analytics & Reports" message="Get insights on sales performance, customer behavior, and growth trends." />;
      case "store":
        return <PlaceholderContent title="Store Settings" message="Configure your online store appearance, policies, and shipping options." />;
      case "customers":
        return <PlaceholderContent title="Customers" message="Manage customer relationships, view purchase history, and create loyalty programs." />;
      case "messages":
        return <PlaceholderContent title="Messages" message="Communicate with customers about orders and products." />;
      case "payments":
        return <PlaceholderContent title="Payments" message="Track your revenue, payment history, and manage payout settings." />;
      case "settings":
        return <PlaceholderContent title="Settings" message="Configure your seller profile, notifications, and account settings." />;
      case "help":
        return <PlaceholderContent title="Help & Support" message="Get assistance with using the platform and growing your business." />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="flex h-screen">
      <SellerSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="flex-1 overflow-y-auto p-6">
        {renderTabContent()}
      </main>
    </div>
  );
}
