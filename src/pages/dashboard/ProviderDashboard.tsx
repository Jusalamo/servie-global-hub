
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProviderSidebar from "@/components/dashboard/ProviderSidebar";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";
import AIAssistant from "@/components/dashboard/AIAssistant";
import { ProviderOverviewTab } from "@/components/dashboard/provider/OverviewTab";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Users, Briefcase, Star, MessageSquare, CreditCard } from "lucide-react";

const ProviderDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Extract active tab from URL if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);
  
  const getBreadcrumbItems = () => {
    switch(activeTab) {
      case "services":
        return [{ label: "My Services" }];
      case "bookings":
        return [{ label: "Bookings" }];
      case "schedule":
        return [{ label: "Schedule" }];
      case "clients":
        return [{ label: "Clients" }];
      case "reviews":
        return [{ label: "Reviews" }];
      case "products":
        return [{ label: "Products" }];
      case "payments":
        return [{ label: "Payments" }];
      case "messages":
        return [{ label: "Messages" }];
      case "settings":
        return [{ label: "Settings" }];
      case "help":
        return [{ label: "Help" }];
      default:
        return [{ label: "Overview" }];
    }
  };
  
  const renderTabContent = () => {
    switch(activeTab) {
      case "overview":
        return <ProviderOverviewTab />;
      case "services":
        return <ServicesTab />;
      case "bookings":
        return <BookingsTab />;
      case "schedule":
        return <ScheduleTab />;
      case "clients":
        return <ClientsTab />;
      case "reviews":
        return <ReviewsTab />;
      case "messages":
        return <MessagesTab />;
      default:
        return <ComingSoonTab title={activeTab} />;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumb 
        additionalCrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Provider", href: "/dashboard/provider" },
          { label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }
        ]} 
      />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:block">
            <ProviderSidebar />
          </div>
          
          {/* Main Content Area */}
          <div className="space-y-6">
            <DashboardBreadcrumb 
              items={getBreadcrumbItems()}
              userRole="provider"
            />
            {renderTabContent()}
          </div>
        </div>
      </main>
      <Footer />
      
      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

// Content for Services tab
const ServicesTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-40 bg-gray-100 dark:bg-gray-800 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Briefcase className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-1">Service #{i}</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Professional service description. Click to manage this service.
              </p>
              <div className="flex justify-between items-center text-xs">
                <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded-full">
                  Active
                </span>
                <span className="text-muted-foreground">
                  From $99/hour
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Content for Bookings tab
const BookingsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Bookings</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {[
              { client: "Emma Wilson", service: "Web Development", date: "Jun 15, 2025", time: "10:00 AM", status: "confirmed" },
              { client: "James Brown", service: "Logo Design", date: "Jun 17, 2025", time: "2:30 PM", status: "pending" },
              { client: "Sophia Martinez", service: "App Development", date: "Jun 20, 2025", time: "9:00 AM", status: "completed" }
            ].map((booking, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {booking.client}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {booking.service}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {booking.date} at {booking.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' : 
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a href="#" className="text-servie hover:text-servie-600">View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Content for Schedule tab
const ScheduleTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Schedule</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden p-6">
        <div className="flex items-center justify-center mb-6">
          <CalendarDays className="h-24 w-24 text-servie" />
        </div>
        <h3 className="text-xl font-medium text-center mb-2">Scheduling Calendar</h3>
        <p className="text-center text-muted-foreground mb-4">
          Here you can manage your availability and view upcoming appointments
        </p>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="text-lg font-medium mb-2">Today's Schedule</h4>
          <div className="space-y-2">
            {[
              { time: "10:00 AM - 11:30 AM", client: "Emma Wilson", service: "Web Development" },
              { time: "2:00 PM - 3:30 PM", client: "James Brown", service: "Logo Design" }
            ].map((slot, i) => (
              <div key={i} className="flex justify-between border-b pb-2 last:border-0">
                <span className="font-medium">{slot.time}</span>
                <span>{slot.client} - {slot.service}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Content for Clients tab
const ClientsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Clients</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: "Emma Wilson", services: 3, since: "Jan 2025" },
          { name: "James Brown", services: 1, since: "Mar 2025" },
          { name: "Sophia Martinez", services: 2, since: "Feb 2025" },
          { name: "Michael Johnson", services: 1, since: "Apr 2025" },
          { name: "Emily Davis", services: 4, since: "Jan 2025" },
          { name: "Thomas Wilson", services: 2, since: "Feb 2025" },
        ].map((client, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Users className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-medium">{client.name}</h3>
                  <p className="text-sm text-muted-foreground">Client since {client.since}</p>
                  <p className="text-sm text-servie">{client.services} booked services</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Content for Reviews tab
const ReviewsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Reviews</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-3xl font-bold">4.8</h3>
            <div className="flex items-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`h-5 w-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Based on 42 reviews</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end space-x-1 text-sm">
              <span className="font-medium">5</span>
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-servie rounded-full" style={{ width: '70%' }}></div>
              </div>
              <span className="text-gray-500">70%</span>
            </div>
            <div className="flex items-center justify-end space-x-1 text-sm mt-1">
              <span className="font-medium">4</span>
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-servie rounded-full" style={{ width: '20%' }}></div>
              </div>
              <span className="text-gray-500">20%</span>
            </div>
            {[3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center justify-end space-x-1 text-sm mt-1">
                <span className="font-medium">{rating}</span>
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-servie rounded-full" style={{ width: rating === 3 ? '8%' : '1%' }}></div>
                </div>
                <span className="text-gray-500">{rating === 3 ? '8%' : '1%'}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          {[
            { name: "Thomas Anderson", rating: 5, date: "Apr 10, 2025", comment: "Excellent work! Delivered the project ahead of schedule and exceeded my expectations." },
            { name: "Lisa Johnson", rating: 4, date: "Apr 5, 2025", comment: "Very professional and responsive. Would hire again." },
            { name: "Michael Chen", rating: 5, date: "Mar 28, 2025", comment: "Amazing attention to detail and great communication throughout the project." },
          ].map((review, i) => (
            <div key={i} className="border-b pb-4 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">{review.name}</div>
                  <div className="text-xs text-muted-foreground">{review.date}</div>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Content for Messages tab
const MessagesTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Messages</h2>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="flex h-[500px]">
          <div className="w-1/3 border-r">
            <div className="p-4 border-b">
              <h3 className="font-medium">Conversations</h3>
            </div>
            <div className="overflow-y-auto">
              {[
                { name: "Emma Wilson", preview: "About the website project", time: "10:24 AM", unread: true },
                { name: "James Brown", preview: "Logo design feedback", time: "Yesterday", unread: false },
                { name: "Sophia Martinez", preview: "App development question", time: "Yesterday", unread: false },
                { name: "Michael Johnson", preview: "Thanks for the help!", time: "Apr 30", unread: false },
              ].map((convo, i) => (
                <div key={i} className={`p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${convo.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                  <div className="flex justify-between items-start">
                    <h4 className={`font-medium ${convo.unread ? 'text-servie' : ''}`}>{convo.name}</h4>
                    <span className="text-xs text-muted-foreground">{convo.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{convo.preview}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-2/3 flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-medium">Emma Wilson</h3>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm">Hi there! I wanted to discuss the website project timeline.</p>
                  <p className="text-xs text-muted-foreground mt-1">10:20 AM</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-servie text-white rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm">Sure! I'm available to chat about it now.</p>
                  <p className="text-xs text-servie-300 mt-1">10:22 AM</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm">Great! I was wondering if we could move up the delivery date by a week?</p>
                  <p className="text-xs text-muted-foreground mt-1">10:24 AM</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <div className="flex">
                <input type="text" className="flex-1 border rounded-l-lg px-4 py-2" placeholder="Type a message..." />
                <button className="bg-servie text-white px-4 py-2 rounded-r-lg">Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Generic "Coming Soon" component for tabs still in development
const ComingSoonTab = ({ title }: { title: string }) => {
  const formatTitle = title.charAt(0).toUpperCase() + title.slice(1);
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-servie mb-4">
        <CreditCard className="h-16 w-16" />
      </div>
      <h2 className="text-2xl font-bold mb-2">{formatTitle}</h2>
      <p className="text-muted-foreground text-center max-w-md">
        We're working hard to bring you the best {formatTitle.toLowerCase()} management tools.
        This section will be available in the next update.
      </p>
    </div>
  );
};

export default ProviderDashboard;
