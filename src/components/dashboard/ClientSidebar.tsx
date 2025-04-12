
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CalendarDays, Heart, MessageSquare, CreditCard, Settings } from "lucide-react";

interface ClientSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  clientUser: any;
}

export const ClientSidebar = ({ activeTab, setActiveTab, clientUser }: ClientSidebarProps) => {
  const navigate = useNavigate();
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={clientUser?.avatar} alt={clientUser?.name} />
              <AvatarFallback>{clientUser?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="text-center space-y-1">
              <h2 className="font-semibold text-lg">{clientUser?.name}</h2>
              <p className="text-sm text-muted-foreground">{clientUser?.location}</p>
            </div>
            <Button variant="outline" className="w-full">
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
            <Button variant="outline" size="sm" onClick={() => handleTabChange("messages")}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleTabChange("settings")}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
