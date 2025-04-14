
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, BarChart2, Tag, Users, CreditCard, Settings, HelpCircle } from "lucide-react";

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
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

export default function SellerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "overview";

  const handleTabClick = (tabName: string) => {
    navigate(`/dashboard/seller?tab=${tabName}`);
  };

  return (
    <div className="w-64 border-r h-full py-6 px-3 hidden md:block">
      <div className="mb-8 px-4">
        <h2 className="font-semibold text-xl">Seller Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage your seller account</p>
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
          icon={<Users className="h-5 w-5" />}
          label="Customers"
          isActive={activeTab === "customers"}
          onClick={() => handleTabClick("customers")}
        />
        
        <SidebarLink
          icon={<CreditCard className="h-5 w-5" />}
          label="Payments"
          isActive={activeTab === "payments"}
          onClick={() => handleTabClick("payments")}
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
