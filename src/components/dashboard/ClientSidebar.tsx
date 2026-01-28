import { memo, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, CalendarDays, Heart, MessageSquare, 
  CreditCard, Settings, LayoutDashboard, ShoppingBag,
  Star, HelpCircle, Shield
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ClientSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user?: any;
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

export const ClientSidebar = memo(({ activeTab, setActiveTab }: ClientSidebarProps) => {
  const { profile } = useAuth();

  const menuItems = useMemo(() => [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "bookings", label: "My Bookings", icon: <CalendarDays className="h-5 w-5" /> },
    { id: "orders", label: "My Orders", icon: <ShoppingBag className="h-5 w-5" /> },
    { id: "favorites", label: "Favorites", icon: <Heart className="h-5 w-5" /> },
    { id: "messages", label: "Messages", icon: <MessageSquare className="h-5 w-5" /> },
    { id: "payments", label: "Payments", icon: <CreditCard className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
    { id: "help", label: "Help", icon: <HelpCircle className="h-5 w-5" /> },
  ], []);

  const displayName = profile?.first_name 
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : 'Client';

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

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
            <p className="text-sm text-muted-foreground">Client Account</p>
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            size="sm"
            onClick={() => handleTabChange("settings")}
          >
            <User className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      <div className="mb-6 px-4">
        <h2 className="font-semibold text-xl">My Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage your account</p>
      </div>

      <div className="space-y-1">
        {menuItems.map((item) => (
          <SidebarLink
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeTab === item.id}
            onClick={() => handleTabChange(item.id)}
          />
        ))}
      </div>
    </div>
  );
});

ClientSidebar.displayName = 'ClientSidebar';
