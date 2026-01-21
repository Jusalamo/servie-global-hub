import { memo, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  Users,
  MessageSquare,
  CreditCard,
  Settings,
  Star,
  FileText,
  Calendar,
  HelpCircle,
  Shield
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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

const ProviderSidebar = memo(({ activeTab, onTabChange }: ProviderSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

  const menuItems = useMemo(() => [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "services", label: "My Services", icon: <Briefcase className="h-5 w-5" /> },
    { id: "bookings", label: "Bookings", icon: <Calendar className="h-5 w-5" /> },
    { id: "calendar", label: "Calendar", icon: <CalendarDays className="h-5 w-5" /> },
    { id: "documents", label: "Financial Documents", icon: <FileText className="h-5 w-5" /> },
    { id: "clients", label: "Clients", icon: <Users className="h-5 w-5" /> },
    { id: "reviews", label: "Reviews", icon: <Star className="h-5 w-5" /> },
    { id: "payments", label: "Payments", icon: <CreditCard className="h-5 w-5" /> },
    { id: "messages", label: "Messages", icon: <MessageSquare className="h-5 w-5" /> },
    { id: "security", label: "Security & KYC", icon: <Shield className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
    { id: "help", label: "Help", icon: <HelpCircle className="h-5 w-5" /> },
  ], []);

  const handleTabClick = (tabName: string) => {
    onTabChange(tabName);
    
    // Update URL with tab parameter
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', tabName);
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  const displayName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : profile?.business_name || 'Provider';

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
            <p className="text-sm text-muted-foreground">Provider Account</p>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 px-4">
        <h2 className="font-semibold text-xl">Provider Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage your services</p>
      </div>

      <div className="space-y-1">
        {menuItems.map((item) => (
          <SidebarLink
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeTab === item.id}
            onClick={() => handleTabClick(item.id)}
          />
        ))}
      </div>
    </div>
  );
});

ProviderSidebar.displayName = 'ProviderSidebar';

export default ProviderSidebar;
