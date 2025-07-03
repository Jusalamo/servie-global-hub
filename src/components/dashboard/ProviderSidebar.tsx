
import { Button } from "@/components/ui/button";
import { Calendar, FileText, MessageSquare, Settings, Star, Users, DollarSign, Clock, Home, HelpCircle, Bell, Receipt } from "lucide-react";

interface ProviderSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ProviderSidebar({ activeTab, onTabChange }: ProviderSidebarProps) {
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "services", label: "Services", icon: FileText },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "availability", label: "Availability", icon: Clock },
    { id: "quotations", label: "Quotations", icon: Receipt },
    { id: "clients", label: "Clients", icon: Users },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "payments", label: "Payments", icon: DollarSign },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "help", label: "Help & Support", icon: HelpCircle },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full p-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Provider Dashboard</h2>
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
