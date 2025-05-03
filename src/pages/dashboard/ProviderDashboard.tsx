
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProviderSidebar from "@/components/dashboard/ProviderSidebar";
import AIAssistant from "@/components/dashboard/AIAssistant";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProviderOverviewTab } from "@/components/dashboard/provider/OverviewTab";
import AddServiceForm from "@/components/dashboard/provider/AddServiceForm";
import { Calendar, ClipboardList, MessageSquare, Star, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data
const services = [
  {
    id: "serv_1",
    title: "House Cleaning",
    description: "Professional house cleaning services including dusting, vacuuming, and bathroom sanitizing.",
    price: 75,
    rating: 4.9,
    reviewCount: 124,
    bookings: 56,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    category: "Home Cleaning"
  },
  {
    id: "serv_2",
    title: "Deep Cleaning",
    description: "Comprehensive deep cleaning service for homes that need extra attention.",
    price: 150,
    rating: 4.8,
    reviewCount: 89,
    bookings: 42,
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    category: "Home Cleaning"
  },
  {
    id: "serv_3",
    title: "Move-In/Out Cleaning",
    description: "Specialized cleaning service for moving in or out of a property.",
    price: 200,
    rating: 4.7,
    reviewCount: 56,
    bookings: 28,
    image: "https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    category: "Home Cleaning"
  }
];

const bookings = [
  {
    id: "book123",
    clientName: "Alice Johnson",
    clientAvatar: "https://randomuser.me/api/portraits/women/11.jpg",
    service: "House Cleaning",
    date: "2023-06-10T14:00:00",
    status: "confirmed",
    address: "123 Main St, Apt 4B, Boston MA",
    amount: 75
  },
  {
    id: "book124",
    clientName: "Bob Smith",
    clientAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
    service: "Deep Cleaning",
    date: "2023-06-12T10:00:00",
    status: "pending",
    address: "456 Oak Ave, Cambridge MA",
    amount: 150
  },
  {
    id: "book125",
    clientName: "Carol Davis",
    clientAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
    service: "House Cleaning",
    date: "2023-06-08T09:00:00",
    status: "completed",
    address: "789 Pine St, Brookline MA",
    amount: 75
  }
];

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);
  
  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
    navigate(`/dashboard/provider?tab=${tab}`);
  };
  
  const renderTabContent = () => {
    switch(activeTab) {
      case "overview":
        return <ProviderOverviewTab />;
      case "services":
        return <ServicesTab />;
      case "bookings":
        return <BookingsTab />;
      case "add-service":
        return <AddServiceForm />;
      default:
        return <PlaceholderTab name={activeTab} />;
    }
  };
  
  const breadcrumbItems = [
    { label: "Overview", path: activeTab === "overview" ? undefined : `/dashboard/provider?tab=overview` },
    ...(activeTab !== "overview" ? [{ label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }] : [])
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <ProviderSidebar activeTab={activeTab} onTabChange={navigateToTab} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <DashboardBreadcrumb 
              items={breadcrumbItems}
              userRole="provider"
            />
            
            {renderTabContent()}
          </div>
        </main>
        <AIAssistant />
      </div>
      <Footer />
    </div>
  );
}

// Tab Components
const ServicesTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Your Services</h2>
        <Button onClick={() => window.location.href = '/dashboard/provider?tab=add-service'}>
          Add New Service
        </Button>
      </div>
      
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <div className="aspect-video w-full">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{service.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{service.category}</p>
                  </div>
                  <p className="text-lg font-bold">${service.price}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm line-clamp-2">{service.description}</p>
                
                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span>{service.rating} ({service.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{service.bookings} bookings</span>
                  </div>
                </div>
                
                <div className="pt-2 flex space-x-2">
                  <Button variant="default" className="flex-1">Edit</Button>
                  <Button variant="outline" className="flex-1">Preview</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No services yet</h3>
          <p className="text-muted-foreground mb-6">Start by adding your first service to attract clients</p>
          <Button onClick={() => window.location.href = '/dashboard/provider?tab=add-service'}>
            Add Your First Service
          </Button>
        </div>
      )}
    </div>
  );
};

const BookingsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Your Bookings</h2>
        <Tabs defaultValue="all" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={booking.clientAvatar} alt={booking.clientName} />
                  <AvatarFallback>{booking.clientName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{booking.clientName}</h3>
                  <p className="text-sm text-muted-foreground">{booking.service}</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 md:items-center w-full md:w-auto">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {new Date(booking.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {new Date(booking.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                
                <div>
                  <Badge 
                    className={`
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                      ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                      ${booking.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                    `}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                  <p className="mt-1 text-sm font-medium">${booking.amount}</p>
                </div>
              </div>
              
              <div className="flex space-x-2 self-end md:self-center">
                <Button variant="outline" size="sm">View Details</Button>
                <Button size="sm">Send Message</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Placeholder Tab for other menu items
const PlaceholderTab = ({ name }: { name: string }) => {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold mb-4">{name.charAt(0).toUpperCase() + name.slice(1)} Content</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        This content is under development. Check back soon for updates to this section.
      </p>
    </div>
  );
};
