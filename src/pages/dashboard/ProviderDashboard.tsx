import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProviderSidebar from "@/components/dashboard/ProviderSidebar";
import { ProviderOverviewTab } from "@/components/dashboard/provider/OverviewTab";
import AddServiceForm from "@/components/dashboard/provider/AddServiceForm";
import BookingsTab from "@/components/dashboard/provider/BookingsTab";
import BookingsCalendarTab from "@/components/dashboard/provider/BookingsCalendarTab";
import ClientsTab from "@/components/dashboard/provider/ClientsTab";
import ReviewsTab from "@/components/dashboard/provider/ReviewsTab";
import MessagingSystem from "@/components/dashboard/MessagingSystem";
import PaymentMethods from "@/components/dashboard/PaymentMethods";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import NotificationsSettings from "@/components/dashboard/NotificationsSettings";
import { useLocation } from "react-router-dom";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";

// Mock data for calendar bookings
const mockBookings = [
  {
    id: "book-1",
    clientName: "Sarah Johnson",
    clientAvatar: "https://randomuser.me/api/portraits/women/32.jpg",
    service: "Home Cleaning",
    date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    status: "confirmed",
    address: "123 Main St, Cityville",
    amount: 85
  },
  {
    id: "book-2",
    clientName: "Michael Chen",
    clientAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
    service: "Carpet Cleaning",
    date: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
    status: "pending",
    address: "456 Oak Ave, Townsburg",
    amount: 120
  }
];

export default function ProviderDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('tab') || "overview";
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Get breadcrumb label based on active tab
  const getBreadcrumbLabel = () => {
    switch (activeTab) {
      case "overview": return "Overview";
      case "services": return "Services";
      case "bookings": return "Bookings";
      case "schedule": return "Schedule";
      case "clients": return "Clients";
      case "reviews": return "Reviews";
      case "payments": return "Payments";
      case "messages": return "Messages";
      case "products": return "Products";
      case "settings": return "Account Settings";
      case "help": return "Help & Support";
      case "notifications": return "Notifications";
      default: return "Overview";
    }
  };

  // Render the appropriate tab content based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProviderOverviewTab />;
      case "services":
        return <AddServiceForm />;
      case "bookings":
        return <BookingsTab />;
      case "schedule":
        return <BookingsCalendarTab bookings={mockBookings} />;
      case "clients":
        return <ClientsTab />;
      case "reviews":
        return <ReviewsTab />;
      case "payments":
        return <PaymentMethods />;
      case "messages":
        return <MessagingSystem userRole="provider" />;
      case "products":
        return <ProductsTab />;
      case "settings":
        return <ProfileSettings userRole="provider" />;
      case "notifications":
        return <NotificationsSettings />;
      case "help":
        return <HelpSupportTab />;
      default:
        return <ProviderOverviewTab />;
    }
  };

  // Create breadcrumb items
  const breadcrumbItems = [
    { label: getBreadcrumbLabel() }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardBreadcrumb items={breadcrumbItems} userRole="provider" />
      <DashboardLayout sidebar={<ProviderSidebar activeTab={activeTab} onTabChange={handleTabChange} />}>
        {renderTabContent()}
      </DashboardLayout>
    </div>
  );
}

// Products Tab component
const ProductsTab = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Products</h2>
      <p className="mb-4">Manage physical products that complement your services.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <div className="h-48 bg-muted"></div>
            <div className="p-4">
              <h3 className="font-medium">Sample Product {index + 1}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Product description text goes here. This is a placeholder.
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-bold">${(19.99 + index * 5).toFixed(2)}</span>
                <div className="space-x-2">
                  <button className="px-3 py-1 text-xs bg-muted rounded">Edit</button>
                  <button className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Help & Support Tab component
const HelpSupportTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Help & Support</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">How do I get paid for my services?</h4>
              <p className="text-sm text-muted-foreground">
                Payments are processed through our secure platform and deposited 
                to your connected bank account within 2-3 business days.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">How do I handle cancellations?</h4>
              <p className="text-sm text-muted-foreground">
                You can set your own cancellation policy. Navigate to Settings {'=>'} 
                Services {'=>'} Policies to configure cancellation terms.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">How do I promote my services?</h4>
              <p className="text-sm text-muted-foreground">
                Use our built-in promotion tools, share your service links on social
                media, and maintain high ratings to increase visibility.
              </p>
            </div>
            <button className="text-servie text-sm font-medium mt-2">View all FAQs</button>
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Contact Support</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our support team is available 24/7 to help you with any issues or questions.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <MessageIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Live Chat</h4>
                <p className="text-sm text-muted-foreground">
                  Available 24/7 for immediate assistance
                </p>
                <button className="text-servie text-sm font-medium mt-1">Start Chat</button>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <MailIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Email Support</h4>
                <p className="text-sm text-muted-foreground">
                  Send us a message and we'll respond within 24 hours
                </p>
                <button className="text-servie text-sm font-medium mt-1">Email Us</button>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <PhoneIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Phone Support</h4>
                <p className="text-sm text-muted-foreground">
                  Call us at (555) 123-4567, Mon-Fri 9am-5pm
                </p>
                <button className="text-servie text-sm font-medium mt-1">Call Now</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-3">Provider Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Provider Handbook</h4>
              <p className="text-sm text-muted-foreground mb-3">
                A comprehensive guide to successfully running your business on our platform.
              </p>
              <button className="text-servie text-sm font-medium">Download PDF</button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Video Tutorials</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Step-by-step video guides on how to use all platform features.
              </p>
              <button className="text-servie text-sm font-medium">Watch Videos</button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Provider Community</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Connect with other providers to share tips and experiences.
              </p>
              <button className="text-servie text-sm font-medium">Join Community</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icon components
const MessageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
