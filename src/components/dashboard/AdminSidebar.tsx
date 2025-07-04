
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Settings,
  Shield,
  BarChart3
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const sidebarItems = [
    {
      key: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      badge: null
    },
    {
      key: "users",
      label: "User Management",
      icon: Users,
      badge: "2,451"
    },
    {
      key: "services",
      label: "Services",
      icon: Package,
      badge: "189"
    },
    {
      key: "products",
      label: "Products",
      icon: ShoppingCart,
      badge: "1,024"
    },
    {
      key: "finances",
      label: "Financial Reports",
      icon: DollarSign,
      badge: null
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: BarChart3,
      badge: null
    },
    {
      key: "settings",
      label: "System Settings",
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="space-y-6">
      {/* Admin Profile Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Admin Panel</h3>
              <p className="text-sm text-muted-foreground">System Administrator</p>
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
              onClick={() => setActiveTab(item.key)}
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

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h4 className="font-semibold text-sm">Quick Actions</h4>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Add New User
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Package className="h-4 w-4 mr-2" />
              Review Services
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};

export default AdminSidebar;
