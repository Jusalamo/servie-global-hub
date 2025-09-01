import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, CalendarDays, Heart, MessageSquare, 
  CreditCard, Settings, LogOut, Bell 
} from "lucide-react";
import { toast } from "sonner";

interface ClientSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
}

export const ClientSidebar = ({ activeTab, setActiveTab, user }: ClientSidebarProps) => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(3);
  
  const handleTabChange = (tab: string) => {
    console.log("Changing tab to:", tab);
    setActiveTab(tab);
    toast.info(`Switched to ${tab} tab`);
  };

  const handleLogout = () => {
    toast.success("Successfully logged out", {
      description: "You have been logged out of your account"
    });
    navigate('/');
  };

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar_url || "/placeholder.svg"} alt={user?.first_name || "User"} />
              <AvatarFallback>
                {user?.first_name ? user.first_name.charAt(0) : 'U'}
                {user?.last_name ? user.last_name.charAt(0) : ''}
              </AvatarFallback>
            </Avatar>
            <div className="text-center space-y-1">
              <h2 className="font-semibold text-lg">
                {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User' : 'Loading...'}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.city || "No location set"}</p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => handleTabChange("settings")}>
              <User className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Navigation Menu */}
      <div className="hidden lg:block space-y-1">
        <Button 
          variant={activeTab === "overview" ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => handleTabChange("overview")}
        >
          <User className="w-4 h-4 mr-2" />
          Overview
        </Button>
        <Button 
          variant={activeTab === "bookings" ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => handleTabChange("bookings")}
        >
          <CalendarDays className="w-4 h-4 mr-2" />
          My Bookings
        </Button>
        <Button 
          variant={activeTab === "favorites" ? "secondary" : "ghost"} 
          className="w-full justify-start"
          onClick={() => handleTabChange("favorites")}
        >
          <Heart className="w-4 h-4 mr-2" />
          Favorites
        </Button>
        <Button 
          variant={activeTab === "messages" ? "secondary" : "ghost"} 
          className="w-full justify-start"
          onClick={() => handleTabChange("messages")}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Messages
          {notificationCount > 0 && (
            <span className="ml-auto bg-servie text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </Button>
        <Button 
          variant={activeTab === "notifications" ? "secondary" : "ghost"} 
          className="w-full justify-start"
          onClick={() => handleTabChange("notifications")}
        >
          <Bell className="w-4 h-4 mr-2" />
          Notifications
          {notificationCount > 0 && (
            <span className="ml-auto bg-servie text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </Button>
        <Button 
          variant={activeTab === "payments" ? "secondary" : "ghost"} 
          className="w-full justify-start"
          onClick={() => handleTabChange("payments")}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Payment Methods
        </Button>
        <Button 
          variant={activeTab === "settings" ? "secondary" : "ghost"} 
          className="w-full justify-start"
          onClick={() => handleTabChange("settings")}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 mt-4"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
      
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          <div className="flex justify-between mb-6">
            <Button variant="outline" size="sm" onClick={() => handleTabChange("messages")} className="relative">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-servie text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleTabChange("settings")}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </Tabs>
      </div>
    </div>
  );
};