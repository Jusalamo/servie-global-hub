
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, BarChart, FileText, MessageSquare, 
  Settings, LogOut, Bell, Calendar, 
  Users, Briefcase, CreditCard
} from "lucide-react";
import { toast } from "sonner";

interface ProviderSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  providerUser: any;
}

export const ProviderSidebar = ({ activeTab, setActiveTab, providerUser }: ProviderSidebarProps) => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(5);
  
  const handleTabChange = (tab: string) => {
    console.log("Changing provider tab to:", tab);
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
      {/* Provider Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={providerUser?.avatar || "/placeholder.svg"} alt={providerUser?.name || "Provider"} />
                <AvatarFallback>{providerUser?.name?.charAt(0) || "P"}</AvatarFallback>
              </Avatar>
              <Badge className="absolute -top-2 -right-2 bg-servie">Premium</Badge>
            </div>
            <div className="text-center space-y-1">
              <h2 className="font-semibold text-lg">{providerUser?.name || "Provider Name"}</h2>
              <p className="text-sm text-muted-foreground">{providerUser?.title || "Service Provider"}</p>
              <div className="flex items-center justify-center mt-1">
                <span className="flex items-center text-yellow-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-sm font-medium">{providerUser?.rating || "4.9"}</span>
                </span>
                <span className="mx-1 text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{providerUser?.reviewCount || "47"} reviews</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => handleTabChange("profile")}>
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
          <BarChart className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
        <Button 
          variant={activeTab === "services" ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => handleTabChange("services")}
        >
          <Briefcase className="w-4 h-4 mr-2" />
          My Services
        </Button>
        <Button 
          variant={activeTab === "bookings" ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => handleTabChange("bookings")}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Bookings
        </Button>
        <Button 
          variant={activeTab === "clients" ? "secondary" : "ghost"} 
          className="w-full justify-start"
          onClick={() => handleTabChange("clients")}
        >
          <Users className="w-4 h-4 mr-2" />
          Clients
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
          variant={activeTab === "earnings" ? "secondary" : "ghost"} 
          className="w-full justify-start"
          onClick={() => handleTabChange("earnings")}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Earnings
        </Button>
        <Button 
          variant={activeTab === "analytics" ? "secondary" : "ghost"} 
          className="w-full justify-start"
          onClick={() => handleTabChange("analytics")}
        >
          <FileText className="w-4 h-4 mr-2" />
          Analytics
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
            <TabsTrigger value="overview">Dashboard</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
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
            <Button variant="outline" size="sm" onClick={() => handleTabChange("earnings")}>
              <CreditCard className="w-4 h-4 mr-2" />
              Earnings
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
