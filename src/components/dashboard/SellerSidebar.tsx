import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  CreditCard,
  Settings,
  HelpCircle,
  Wallet,
  Package,
  BarChart2,
  Tag,
  TrendingUp,
  Store,
  Users,
  Shield,
  ExternalLink
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface SellerSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SidebarLink = memo(({ icon, label, isActive, onClick }: SidebarLinkProps) => {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start ${isActive ? "bg-muted" : ""}`}
      onClick={onClick}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Button>
  );
});

SidebarLink.displayName = 'SidebarLink';

const SellerSidebar = memo(({ activeTab, onTabChange }: SellerSidebarProps) => {
  const { profile } = useAuth();

  const menuItems = useMemo(() => [
    { id: "overview", label: "Overview", icon: <BarChart2 className="h-5 w-5" /> },
    { id: "orders", label: "Orders", icon: <ShoppingBag className="h-5 w-5" /> },
    { id: "products", label: "Products", icon: <Package className="h-5 w-5" /> },
    { id: "inventory", label: "Inventory", icon: <Tag className="h-5 w-5" /> },
    { id: "analytics", label: "Analytics", icon: <TrendingUp className="h-5 w-5" /> },
    { id: "shop", label: "My Shop", icon: <Store className="h-5 w-5" /> },
    { id: "customers", label: "Customers", icon: <Users className="h-5 w-5" /> },
    { id: "messages", label: "Messages", icon: <MessageSquare className="h-5 w-5" /> },
    { id: "payments", label: "Payments", icon: <CreditCard className="h-5 w-5" /> },
    { id: "wallet", label: "Wallet & Commission", icon: <Wallet className="h-5 w-5" /> },
    { id: "security", label: "Security & KYC", icon: <Shield className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
    { id: "help", label: "Help", icon: <HelpCircle className="h-5 w-5" /> },
  ], []);
  
  const displayName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : profile?.business_name || 'Seller';

  const shopUrl = profile?.seller_slug ? `/shop/${profile.seller_slug}` : null;

  return (
    <div className="w-full py-6 px-3">
      {/* User Profile Card */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col items-center space-y-2">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile?.avatar_url || ''} alt="Profile" />
            <AvatarFallback className="bg-servie text-white">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="font-semibold">{displayName}</h3>
            <p className="text-sm text-muted-foreground">Seller Account</p>
          </div>
          
          {/* View My Shop Link */}
          {shopUrl && (
            <Link to={shopUrl} className="w-full">
              <Button variant="outline" size="sm" className="w-full mt-2">
                <ExternalLink className="h-4 w-4 mr-2" />
                View My Shop
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="font-semibold text-lg px-4">Seller Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1 px-4">Manage your seller account</p>
      </div>

      <div className="space-y-1">
        {menuItems.map((item) => (
          <SidebarLink
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeTab === item.id}
            onClick={() => onTabChange(item.id)}
          />
        ))}
      </div>
    </div>
  );
});

SellerSidebar.displayName = 'SellerSidebar';

export default SellerSidebar;
