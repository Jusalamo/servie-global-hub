
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  Users,
  MessageSquare,
  CreditCard,
  Settings,
  User,
  Star,
  Clock,
  FileText,
  Package
} from "lucide-react";

interface ProviderSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

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

export default function ProviderSidebar({ activeTab, onTabChange }: ProviderSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tabName: string) => {
    onTabChange(tabName);
    
    // Update URL with tab parameter
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', tabName);
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  return (
    <div className="w-64 border-r h-full py-6 px-3 hidden md:block">
      <div className="mb-8 px-4">
        <h2 className="font-semibold text-xl">Provider Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage your services</p>
      </div>

      <div className="space-y-1">
        <SidebarLink
          icon={<BarChart2 className="h-5 w-5" />}
          label="Overview"
          isActive={activeTab === "overview"}
          onClick={() => handleTabClick("overview")}
        />
        
        <SidebarLink
          icon={<Briefcase className="h-5 w-5" />}
          label="My Services"
          isActive={activeTab === "services"}
          onClick={() => handleTabClick("services")}
        />
        
        <SidebarLink
          icon={<ClipboardList className="h-5 w-5" />}
          label="Bookings"
          isActive={activeTab === "bookings"}
          onClick={() => handleTabClick("bookings")}
        />
        
        <SidebarLink
          icon={<FileText className="h-5 w-5" />}
          label="Financial Documents"
          isActive={activeTab === "documents"}
          onClick={() => handleTabClick("documents")}
        />
        
        <SidebarLink
          icon={<Users className="h-5 w-5" />}
          label="Clients"
          isActive={activeTab === "clients"}
          onClick={() => handleTabClick("clients")}
        />
        
        <SidebarLink
          icon={<Star className="h-5 w-5" />}
          label="Reviews"
          isActive={activeTab === "reviews"}
          onClick={() => handleTabClick("reviews")}
        />
        
        <SidebarLink
          icon={<CreditCard className="h-5 w-5" />}
          label="Payments"
          isActive={activeTab === "payments"}
          onClick={() => handleTabClick("payments")}
        />
        
        <SidebarLink
          icon={<MessageSquare className="h-5 w-5" />}
          label="Messages"
          isActive={activeTab === "messages"}
          onClick={() => handleTabClick("messages")}
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
