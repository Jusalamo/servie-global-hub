
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  MessageSquare,
  CreditCard,
  Settings,
  User,
  HelpCircle,
  Wallet,
  Package
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

const SidebarLink = ({ icon, label, isActive, onClick }: SidebarLinkProps) => {
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
};

export default function SellerSidebar({ activeTab, onTabChange }: SellerSidebarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleTabClick = (tabName: string) => {
    onTabChange(tabName);
  };

  return (
    <div className="w-64 border-r h-full py-6 px-3 hidden md:block">
      {/* User Profile Card */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col items-center space-y-2">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt="Profile" />
            <AvatarFallback>{user?.user_metadata?.first_name?.charAt(0) || 'S'}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="font-semibold">
              {user?.user_metadata?.first_name} {user?.user_metadata?.last_name || 'Seller'}
            </h3>
            <p className="text-sm text-muted-foreground">Seller Account</p>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="font-semibold text-lg px-4">Seller Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1 px-4">Manage your seller account</p>
      </div>

      <div className="space-y-1">
        <SidebarLink
          icon={<BarChart2 className="h-5 w-5" />}
          label="Overview"
          isActive={activeTab === "overview"}
          onClick={() => handleTabClick("overview")}
        />
        
        <SidebarLink
          icon={<ShoppingBag className="h-5 w-5" />}
          label="Orders"
          isActive={activeTab === "orders"}
          onClick={() => handleTabClick("orders")}
        />
        
        <SidebarLink
          icon={<Package className="h-5 w-5" />}
          label="Products"
          isActive={activeTab === "products"}
          onClick={() => handleTabClick("products")}
        />
        
        <SidebarLink
          icon={<Tag className="h-5 w-5" />}
          label="Inventory"
          isActive={activeTab === "inventory"}
          onClick={() => handleTabClick("inventory")}
        />
        
        <SidebarLink
          icon={<TrendingUp className="h-5 w-5" />}
          label="Analytics"
          isActive={activeTab === "analytics"}
          onClick={() => handleTabClick("analytics")}
        />
        
        <SidebarLink
          icon={<Store className="h-5 w-5" />}
          label="Store Settings"
          isActive={activeTab === "store"}
          onClick={() => handleTabClick("store")}
        />
        
        <SidebarLink
          icon={<Users className="h-5 w-5" />}
          label="Customers"
          isActive={activeTab === "customers"}
          onClick={() => handleTabClick("customers")}
        />
        
        <SidebarLink
          icon={<MessageSquare className="h-5 w-5" />}
          label="Messages"
          isActive={activeTab === "messages"}
          onClick={() => handleTabClick("messages")}
        />
        
        <SidebarLink
          icon={<CreditCard className="h-5 w-5" />}
          label="Payments"
          isActive={activeTab === "payments"}
          onClick={() => handleTabClick("payments")}
        />
        
        <SidebarLink
          icon={<Wallet className="h-5 w-5" />}
          label="Wallet & Commission"
          isActive={activeTab === "wallet"}
          onClick={() => handleTabClick("wallet")}
        />
        
        <SidebarLink
          icon={<Shield className="h-5 w-5" />}
          label="Security & KYC"
          isActive={activeTab === "security"}
          onClick={() => handleTabClick("security")}
        />
        
        <SidebarLink
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          isActive={activeTab === "settings"}
          onClick={() => handleTabClick("settings")}
        />
        
        <SidebarLink
          icon={<HelpCircle className="h-5 w-5" />}
          label="Help"
          isActive={activeTab === "help"}
          onClick={() => handleTabClick("help")}
        />
      </div>
    </div>
  );
}
