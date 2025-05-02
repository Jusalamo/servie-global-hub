import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProviderSidebar from "@/components/dashboard/ProviderSidebar";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";
import AIAssistant from "@/components/dashboard/AIAssistant";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProviderOverviewTab } from "@/components/dashboard/provider/OverviewTab";
import AddServiceForm from "@/components/dashboard/provider/AddServiceForm";
import { Calendar, ClipboardList, MessageSquare, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProviderDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
      case "messages":
        return [{ label: "Messages" }];
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

// My Services Tab
const ServicesTab = () => {
  const [addingService, setAddingService] = useState(false);
  const navigate = useNavigate();
  
  // Mock services data
  const services = [
    {
      id: 1,
      title: "Web Development Service",
      description: "Professional web development services with responsive design and modern technologies.",
      category: "Technology",
      price: 75,
      bookings: 12,
      rating: 4.8,
      active: true,
    },
    {
      id: 2,
      title: "Logo Design & Branding",
      description: "Creative logo design and complete branding packages for businesses of all sizes.",
      category: "Design & Creative",
      price: 120,
      bookings: 8,
      rating: 5.0,
      active: true,
    },
    {
      id: 3,
      title: "SEO Optimization",
      description: "Improve your website's search engine ranking with our comprehensive SEO services.",
      category: "Marketing",
      price: 90,
      bookings: 5,
      rating: 4.6,
      active: false,
    }
  ];
  
  if (addingService) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Add New Service</h2>
          <Button 
            variant="outline"
            onClick={() => setAddingService(false)}
          >
            Cancel
          </Button>
        </div>
        <AddServiceForm />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Services</h2>
        <Button 
          onClick={() => setAddingService(true)}
          className="bg-servie text-white hover:bg-servie-600"
        >
          Add New Service
        </Button>
      </div>
      
      {services.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <h3 className="text-xl font-medium mb-2">No services yet</h3>
          <p className="text-muted-foreground mb-6">Add your first service to start getting bookings</p>
          <Button 
            onClick={() => setAddingService(true)}
            className="bg-servie text-white hover:bg-servie-600"
          >
            Add Your First Service
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map(service => (
            <Card key={service.id} className={`overflow-hidden ${!service.active ? 'border-muted' : ''}`}>
              <div className="h-40 bg-muted relative">
                {/* Placeholder for service image */}
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground">Service Image</span>
                </div>
                
                {!service.active && (
                  <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-2 py-1">
                    Inactive
                  </div>
                )}
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{service.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-servie font-medium">${service.price}/hr</span>
                  <span className="text-sm text-muted-foreground">{service.category}</span>
                </div>
                
                <div className="flex justify-between items-center mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    <span>{service.bookings} bookings</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-servie fill-servie" />
                    <span>{service.rating}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">Edit</Button>
                  <Button variant="outline" className="flex-1">Preview</Button>
                  {service.active ? (
                    <Button variant="outline" className="flex-1">Deactivate</Button>
                  ) : (
                    <Button className="flex-1 bg-servie text-white hover:bg-servie-600">Activate</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Bookings Tab
const BookingsTab = () => {
  const bookings = [
    {
      id: "BK-2023-001",
      client: { name: "John Smith", avatar: null },
      service: "Web Development Service",
      date: "Jun 15, 2025",
      time: "10:00 AM - 12:00 PM",
      status: "confirmed",
      amount: "$150.00"
    },
    {
      id: "BK-2023-002",
      client: { name: "Emily Parker", avatar: null },
      service: "Logo Design & Branding",
      date: "Jun 17, 2025",
      time: "2:00 PM - 4:00 PM",
      status: "pending",
      amount: "$240.00"
    },
    {
      id: "BK-2023-003",
      client: { name: "Michael Johnson", avatar: null },
      service: "SEO Optimization",
      date: "Jun 20, 2025",
      time: "1:00 PM - 3:00 PM",
      status: "completed",
      amount: "$180.00"
    },
    {
      id: "BK-2023-004",
      client: { name: "Sarah Williams", avatar: null },
      service: "Web Development Service",
      date: "Jun 22, 2025",
      time: "9:00 AM - 11:00 AM",
      status: "canceled",
      amount: "$150.00"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bookings</h2>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button className="bg-servie text-white hover:bg-servie-600">Calendar View</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Confirmed</CardTitle>
            <div className="text-2xl font-bold">12</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pending</CardTitle>
            <div className="text-2xl font-bold">5</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
            <div className="text-2xl font-bold">28</div>
          </CardHeader>
        </Card>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Booking ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{booking.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-servie/10 rounded-full flex items-center justify-center text-servie">
                      {booking.client.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">{booking.client.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.service}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div>{booking.date}</div>
                  <div className="text-muted-foreground">{booking.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Button variant="ghost" className="text-servie hover:text-servie-600 p-0">View Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Clients Tab
const ClientsTab = () => {
  const clients = [
    {
      name: "John Smith",
      email: "john.smith@example.com",
      bookings: 3,
      spent: "$450",
      lastBooking: "Jun 15, 2025",
      status: "active"
    },
    {
      name: "Emily Parker",
      email: "emily.p@example.com",
      bookings: 1,
      spent: "$240",
      lastBooking: "Jun 17, 2025",
      status: "active"
    },
    {
      name: "Michael Johnson",
      email: "m.johnson@example.com",
      bookings: 2,
      spent: "$360",
      lastBooking: "Jun 20, 2025",
      status: "active"
    },
    {
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      bookings: 1,
      spent: "$150",
      lastBooking: "Jun 22, 2025",
      status: "inactive"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clients</h2>
        <Button variant="outline">Export Client List</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Clients</CardTitle>
            <div className="text-2xl font-bold">24</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">New This Month</CardTitle>
            <div className="text-2xl font-bold">8</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Repeat Clients</CardTitle>
            <div className="text-2xl font-bold">14</div>
          </CardHeader>
        </Card>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bookings</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Spent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Booking</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {clients.map((client, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-servie/10 text-servie rounded-full flex items-center justify-center">
                      {client.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">{client.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{client.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{client.bookings}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{client.spent}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{client.lastBooking}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${client.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'}`}>
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-3">
                    <button className="text-servie hover:text-servie-600">View</button>
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Message</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Reviews Tab
const ReviewsTab = () => {
  const reviews = [
    {
      id: 1,
      client: { name: "John Smith", avatar: null },
      service: "Web Development Service",
      rating: 5,
      review: "Exceptional work! The website exceeded my expectations. Very professional and responsive throughout the project.",
      date: "Jun 12, 2025",
      replied: true
    },
    {
      id: 2,
      client: { name: "Emily Parker", avatar: null },
      service: "Logo Design & Branding",
      rating: 4,
      review: "Great design work for our company logo. Creative and understood our brand vision well. Would have appreciated a bit more revision options.",
      date: "Jun 10, 2025",
      replied: false
    },
    {
      id: 3,
      client: { name: "Michael Johnson", avatar: null },
      service: "SEO Optimization",
      rating: 5,
      review: "Incredible results! Our website traffic has increased by 200% since implementing the SEO recommendations. Very knowledgeable and professional service.",
      date: "Jun 5, 2025",
      replied: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Average Rating</CardTitle>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">4.8</div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-4 w-4 ${star <= 4 ? "text-servie fill-servie" : "text-gray-300"}`} 
                  />
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Reviews</CardTitle>
            <div className="text-2xl font-bold">42</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Response Rate</CardTitle>
            <div className="text-2xl font-bold">95%</div>
          </CardHeader>
        </Card>
      </div>
      
      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-10 w-10 bg-servie/10 text-servie rounded-full flex items-center justify-center">
                    {review.client.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{review.client.name}</div>
                    <div className="text-sm text-muted-foreground">{review.service}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{review.date}</div>
              </div>
              
              <div className="flex mt-4 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-4 w-4 ${star <= review.rating ? "text-servie fill-servie" : "text-gray-300"}`} 
                  />
                ))}
              </div>
              
              <p className="mt-2">{review.review}</p>
              
              {review.replied ? (
                <div className="mt-4 bg-muted/50 p-4 rounded-md">
                  <div className="font-medium">Your Response</div>
                  <p className="text-sm mt-1">Thank you for your kind review! It was a pleasure working with you, and I'm glad you're happy with the results. Looking forward to helping you again in the future.</p>
                </div>
              ) : (
                <div className="mt-4">
                  <Button className="bg-servie text-white hover:bg-servie-600">Reply to Review</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Messages Tab
const MessagesTab = () => {
  const messages = [
    {
      id: 1,
      sender: { name: "John Smith", avatar: null },
      subject: "Website Project Inquiry",
      preview: "Hi there, I'm interested in your web development services. I need a new e-commerce website for my small business...",
      date: "Today, 10:30 AM",
      unread: true
    },
    {
      id: 2,
      sender: { name: "Emily Parker", avatar: null },
      subject: "Logo Revision Request",
      preview: "Thank you for the initial designs. They look great, but I was wondering if we could try a different color scheme...",
      date: "Yesterday, 3:45 PM",
      unread: false
    },
    {
      id: 3,
      sender: { name: "Michael Johnson", avatar: null },
      subject: "Follow-up on SEO Results",
      preview: "Just wanted to check in on the latest SEO performance metrics. Have you seen any significant improvements since...",
      date: "Jun 10, 2025",
      unread: false
    },
    {
      id: 4,
      sender: { name: "Sarah Williams", avatar: null },
      subject: "Schedule Consultation",
      preview: "I'd like to schedule a consultation to discuss a potential project. Are you available sometime next week to...",
      date: "Jun 8, 2025",
      unread: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Messages</h2>
        <Button className="bg-servie text-white hover:bg-servie-600">Compose</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Unread</CardTitle>
            <div className="text-2xl font-bold">2</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total</CardTitle>
            <div className="text-2xl font-bold">16</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Response Time</CardTitle>
            <div className="text-2xl font-bold">2.4h</div>
          </CardHeader>
        </Card>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
              message.unread ? "bg-servie/5" : ""
            }`}
          >
            <div className="px-6 py-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-servie/10 text-servie rounded-full flex items-center justify-center">
                    {message.sender.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className={`font-medium ${message.unread ? "text-servie" : ""}`}>
                      {message.sender.name}
                      {message.unread && (
                        <span className="ml-2 inline-block w-2 h-2 bg-servie rounded-full"></span>
                      )}
                    </div>
                    <div className="text-sm font-medium">{message.subject}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{message.date}</div>
              </div>
              <div className="mt-2 ml-14 text-sm text-muted-foreground line-clamp-1">
                {message.preview}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Generic "Coming Soon" component for tabs still in development
const ComingSoonTab = ({ title }: { title: string }) => {
  const formatTitle = title.charAt(0).toUpperCase() + title.slice(1);
  
  const getIcon = () => {
    switch(title) {
      case "schedule": return <Calendar className="h-16 w-16" />;
      case "clients": return <Users className="h-16 w-16" />;
      case "reviews": return <Star className="h-16 w-16" />;
      case "messages": return <MessageSquare className="h-16 w-16" />;
      default: return <Calendar className="h-16 w-16" />;
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-servie mb-4">
        {getIcon()}
      </div>
      <h2 className="text-2xl font-bold mb-2">{formatTitle}</h2>
      <p className="text-muted-foreground text-center max-w-md">
        We're working hard to bring you the best {formatTitle.toLowerCase()} tools for your provider account.
        This section will be available in the next update.
      </p>
    </div>
  );
};

export default ProviderDashboard;
