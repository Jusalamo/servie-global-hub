import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProviderSidebar from "@/components/dashboard/ProviderSidebar";
import { ProviderOverviewTab } from "@/components/dashboard/provider/OverviewTab";
import ServiceManagement from "@/components/dashboard/provider/ServiceManagement";
import BookingsTab from "@/components/dashboard/provider/BookingsTab";
import ClientsTab from "@/components/dashboard/provider/ClientsTab";
import ReviewsTab from "@/components/dashboard/provider/ReviewsTab";
import AvailabilityManager from "@/components/dashboard/provider/AvailabilityManager";
import MessagingSystem from "@/components/dashboard/MessagingSystem";
import PaymentMethods from "@/components/dashboard/PaymentMethods";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import NotificationsSettings from "@/components/dashboard/NotificationsSettings";
import FinancialDocumentsTab from "@/components/dashboard/provider/FinancialDocumentsTab";
import InventoryManagement from "@/components/dashboard/InventoryManagement";
import BookingsCalendarTab from "@/components/dashboard/provider/BookingsCalendarTab";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";

export default function ProviderDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('tab') || "overview";
  });

  useEffect(() => {
    // Update URL when tab changes
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('tab', activeTab);
    const newUrl = `${location.pathname}?${queryParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeTab, location.pathname, location.search]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Get breadcrumb label based on active tab
  const getBreadcrumbLabel = () => {
    switch (activeTab) {
      case "overview": return "Overview";
      case "services": return "Services";
      case "bookings": return "Bookings";
      case "documents": return "Financial Documents";
      case "availability": return "Availability";
      case "clients": return "Clients";
      case "reviews": return "Reviews";
      case "payments": return "Payments";
      case "messages": return "Messages";
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
        return <ServiceManagement />;
      case "bookings":
        return <BookingsTab />;
      case "documents":
        return <FinancialDocumentsTab />;
      case "availability":
        return <AvailabilityManager />;
      case "clients":
        return <ClientsTab />;
      case "reviews":
        return <ReviewsTab />;
      case "payments":
        return <PaymentMethods />;
      case "messages":
        return <MessagingSystem userRole="provider" />;
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
    <div className="space-y-4 sm:space-y-6">
      <DashboardBreadcrumb items={breadcrumbItems} userRole="provider" />
      <DashboardLayout sidebar={<ProviderSidebar activeTab={activeTab} onTabChange={handleTabChange} />}>
        {renderTabContent()}
      </DashboardLayout>
    </div>
  );
}

// Help & Support Tab component
const HelpSupportTab = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold whitespace-normal break-words">Help & Support</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="border rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 whitespace-normal break-words">Frequently Asked Questions</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-medium whitespace-normal break-words">How do I get paid for my services?</h4>
              <p className="text-xs sm:text-sm text-muted-foreground whitespace-normal">
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
