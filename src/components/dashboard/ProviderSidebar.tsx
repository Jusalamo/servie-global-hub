
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Package, 
  Calendar, 
  DollarSign,
  Star, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  Bell, 
  HelpCircle,
  User,
  Briefcase
} from "lucide-react";

interface ProviderSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProviderSidebar = ({ activeTab, onTabChange }: ProviderSidebarProps) => {
  const sidebarItems = [
    {
      key: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      badge: null
    },
    {
      key: "services",
      label: "My Services",
      icon: Package,
      badge: "5"
    },
    {
      key: "bookings",
      label: "Bookings",
      icon: Calendar,
      badge: "12"
    },
    {
      key: "finances",
      label: "Finances",
      icon: DollarSign,
      badge: "3"
    },
    {
      key: "reviews",
      label: "Reviews",
      icon: Star,
      badge: "24"
    },
    {
      key: "payments",
      label: "Payments",
      icon: CreditCard,
      badge: null
    },
    {
      key: "messages",
      label: "Messages",
      icon: MessageSquare,
      badge: "2"
    },
    {
      key: "settings",
      label: "Settings",
      icon: Settings,
      badge: null
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: Bell,
      badge: "5"
    },
    {
      key: "help",
      label: "Help & Support",
      icon: HelpCircle,
      badge: null
    }
  ];

  return (
    <aside className="space-y-6">
      {/* Provider Profile Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Service Provider</h3>
              <p className="text-sm text-muted-foreground">Professional Dashboard</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <nav className="space-y-2">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Button
              key={item.key}
              variant={activeTab === item.key ? "default" : "ghost"}
              className={`w-full justify-between h-12 ${
                activeTab === item.key 
                  ? "bg-servie hover:bg-servie-600 text-white" 
                  : "hover:bg-gray-100"
              }`}
              onClick={() => onTabChange(item.key)}
            >
              <div className="flex items-center space-x-3">
                <IconComponent className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h4 className="font-semibold text-sm">Quick Stats</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">This Month</span>
              <span className="font-medium">$2,340</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-medium">3 bookings</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rating</span>
              <span className="font-medium">4.8 ⭐</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};

export default ProviderSidebar;
