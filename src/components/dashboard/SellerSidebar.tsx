
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign,
  CreditCard, 
  MessageSquare, 
  Settings, 
  Bell, 
  HelpCircle,
  ShoppingBag
} from "lucide-react";

interface SellerSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SellerSidebar = ({ activeTab, onTabChange }: SellerSidebarProps) => {
  const sidebarItems = [
    {
      key: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      badge: null
    },
    {
      key: "products",
      label: "My Products",
      icon: Package,
      badge: "12"
    },
    {
      key: "orders",
      label: "Orders",
      icon: ShoppingCart,
      badge: "8"
    },
    {
      key: "finances",
      label: "Finances",
      icon: DollarSign,
      badge: "5"
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
      badge: "3"
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
      badge: "4"
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
      {/* Seller Profile Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Seller Dashboard</h3>
              <p className="text-sm text-muted-foreground">E-commerce Hub</p>
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
              <span className="font-medium">$1,890</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Orders</span>
              <span className="font-medium">25 pending</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Products</span>
              <span className="font-medium">45 active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};

export default SellerSidebar;
