
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProviderSidebar from "@/components/dashboard/ProviderSidebar";
import { ProviderOverviewTab } from "@/components/dashboard/provider/OverviewTab";
import ServiceManagement from "@/components/dashboard/provider/ServiceManagement";
import BookingsTab from "@/components/dashboard/provider/BookingsTab";
import BookingsCalendarTab from "@/components/dashboard/provider/BookingsCalendarTab";
import ClientsTab from "@/components/dashboard/provider/ClientsTab";
import ReviewsTab from "@/components/dashboard/provider/ReviewsTab";
import AvailabilityManager from "@/components/dashboard/provider/AvailabilityManager";
import MessagingSystem from "@/components/dashboard/MessagingSystem";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSettingsSave = () => {
    toast.success("Settings saved successfully!");
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
      case "schedule":
        return <BookingsCalendarTab bookings={mockBookings} />;
      case "availability":
        return <AvailabilityManager />;
      case "clients":
        return <ClientsTab />;
      case "reviews":
        return <ReviewsTab />;
      case "messages":
        return <MessagingSystem userRole="provider" />;
      case "payments":
        return <PaymentsContent />;
      case "products":
        return <ProductsContent />;
      case "settings":
        return <SettingsContent onSave={handleSettingsSave} />;
      case "help":
        return <HelpContent />;
      default:
        return <ProviderOverviewTab />;
    }
  };

  return (
    <DashboardLayout sidebar={<ProviderSidebar activeTab={activeTab} onTabChange={handleTabChange} />}>
      {renderTabContent()}
    </DashboardLayout>
  );
}

// Payments Content Component
const PaymentsContent = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payments & Earnings</h2>
        <Button className="bg-servie hover:bg-servie-600">Withdraw Funds</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Available Balance</h3>
          </div>
          <p className="text-3xl font-bold mt-2">$1,245.00</p>
          <p className="text-sm text-muted-foreground">Available for withdrawal</p>
        </div>
        
        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Pending</h3>
          </div>
          <p className="text-3xl font-bold mt-2">$350.00</p>
          <p className="text-sm text-muted-foreground">Clearing in 2-3 business days</p>
        </div>
        
        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Lifetime Earnings</h3>
          </div>
          <p className="text-3xl font-bold mt-2">$15,762.50</p>
          <p className="text-sm text-muted-foreground">Total earnings to date</p>
        </div>
      </div>
      
      <div className="dashboard-card">
        <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {[
            { id: 'tx1', client: 'Sarah Johnson', service: 'Home Cleaning', amount: 85, date: '2023-05-14', status: 'completed' },
            { id: 'tx2', client: 'Michael Chen', service: 'Carpet Cleaning', amount: 120, date: '2023-05-13', status: 'completed' },
            { id: 'tx3', client: 'Emma Rodriguez', service: 'Window Cleaning', amount: 65, date: '2023-05-10', status: 'completed' },
            { id: 'tx4', client: 'David Kim', service: 'Deep Cleaning', amount: 200, date: '2023-05-08', status: 'completed' },
          ].map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">{tx.service}</p>
                <p className="text-sm text-muted-foreground">Client: {tx.client}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${tx.amount}.00</p>
                <p className="text-sm text-muted-foreground">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline">View All Transactions</Button>
        </div>
      </div>
      
      <div className="dashboard-card">
        <h3 className="text-lg font-medium mb-4">Payout Methods</h3>
        <div className="space-y-4">
          <div className="p-3 border rounded-lg flex items-center justify-between bg-muted/50">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mr-3">
                <span className="text-lg font-bold">B</span>
              </div>
              <div>
                <p className="font-medium">Bank Account</p>
                <p className="text-sm text-muted-foreground">****6789 • Default</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
          <Button className="w-full">Add Payout Method</Button>
        </div>
      </div>
    </div>
  );
};

// Products Content Component
const ProductsContent = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button className="bg-servie hover:bg-servie-600">Add New Product</Button>
      </div>
      
      <div className="dashboard-card">
        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active (4)</TabsTrigger>
            <TabsTrigger value="draft">Draft (2)</TabsTrigger>
            <TabsTrigger value="out-of-stock">Out of Stock (1)</TabsTrigger>
          </TabsList>
          
          <div className="space-y-4">
            {[
              { id: 'p1', name: 'Premium Cleaning Kit', price: 39.99, inventory: 15, image: 'https://placehold.co/100x100', sold: 28 },
              { id: 'p2', name: 'Eco-Friendly Surface Cleaner', price: 12.99, inventory: 32, image: 'https://placehold.co/100x100', sold: 47 },
              { id: 'p3', name: 'Microfiber Cleaning Cloths (10 Pack)', price: 18.99, inventory: 25, image: 'https://placehold.co/100x100', sold: 53 },
              { id: 'p4', name: 'Professional Glass Cleaner', price: 9.99, inventory: 18, image: 'https://placehold.co/100x100', sold: 34 },
            ].map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg border">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-muted rounded mr-3 flex items-center justify-center overflow-hidden">
                    <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">In stock: {product.inventory} • Sold: {product.sold}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${product.price}</p>
                  <div className="flex space-x-2 mt-1">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Tabs>
      </div>
      
      <div className="dashboard-card">
        <h3 className="text-lg font-medium mb-4">Product Performance</h3>
        <div className="h-64 bg-muted/40 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Sales chart will appear here</p>
        </div>
      </div>
    </div>
  );
};

// Settings Content Component
const SettingsContent = ({ onSave }: { onSave: () => void }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <div className="dashboard-card">
        <h3 className="text-lg font-medium mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <Input defaultValue="CleanPro Services" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <Input defaultValue="contact@cleanpro.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <Input defaultValue="(555) 123-4567" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Business Address</label>
              <Input defaultValue="123 Main Street, Suite 200" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Business Description</label>
            <Textarea className="min-h-[100px]" defaultValue="Professional cleaning services for homes and offices with over 15 years of experience." />
          </div>
          
          <Button onClick={onSave} className="bg-servie hover:bg-servie-600">Save Changes</Button>
        </div>
      </div>
      
      <div className="dashboard-card">
        <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Booking Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified when you receive a new booking</p>
            </div>
            <div>
              <input type="checkbox" defaultChecked className="form-checkbox" />
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Messages</p>
              <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
            </div>
            <div>
              <input type="checkbox" defaultChecked className="form-checkbox" />
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Reviews & Ratings</p>
              <p className="text-sm text-muted-foreground">Get notified when you receive a new review</p>
            </div>
            <div>
              <input type="checkbox" defaultChecked className="form-checkbox" />
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Payment Receipts</p>
              <p className="text-sm text-muted-foreground">Get notified when you receive a payment</p>
            </div>
            <div>
              <input type="checkbox" defaultChecked className="form-checkbox" />
            </div>
          </div>
          
          <Button onClick={onSave} className="bg-servie hover:bg-servie-600">Save Preferences</Button>
        </div>
      </div>
    </div>
  );
};

// Help Content Component
const HelpContent = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Help & Support</h2>
      
      <div className="dashboard-card">
        <h3 className="text-lg font-medium mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <p className="font-medium">How do I update my service availability?</p>
            <p className="text-sm text-muted-foreground mt-1">
              Go to the "Schedule" tab and use the calendar to mark your available times. You can set recurring availability or make one-time adjustments.
            </p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">How are payments processed?</p>
            <p className="text-sm text-muted-foreground mt-1">
              Payments are processed through our secure payment system. Funds are typically available in your account within 2-3 business days after service completion.
            </p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">How can I respond to a client review?</p>
            <p className="text-sm text-muted-foreground mt-1">
              Go to the "Reviews" tab, find the review you want to respond to, and click the "Reply" button. Your response will be visible to the client and other users.
            </p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">Can I offer multiple services?</p>
            <p className="text-sm text-muted-foreground mt-1">
              Yes! You can add multiple services by going to the "Services" tab and clicking "Add New Service" for each service you want to offer.
            </p>
          </div>
        </div>
        <Button variant="outline" className="mt-4 w-full">View All FAQs</Button>
      </div>
      
      <div className="dashboard-card">
        <h3 className="text-lg font-medium mb-4">Contact Support</h3>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Need additional help? Our support team is available to assist you with any questions or concerns.
          </p>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <Input placeholder="What do you need help with?" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <Textarea className="min-h-[100px]" placeholder="Describe your issue in detail..." />
          </div>
          <Button className="bg-servie hover:bg-servie-600">Send Message</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <h3 className="text-lg font-medium mb-4">Help Resources</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-servie hover:underline">Provider Guide PDF</a>
            </li>
            <li>
              <a href="#" className="text-servie hover:underline">Video Tutorials</a>
            </li>
            <li>
              <a href="#" className="text-servie hover:underline">Service Tips & Best Practices</a>
            </li>
            <li>
              <a href="#" className="text-servie hover:underline">Community Forums</a>
            </li>
          </ul>
        </div>
        
        <div className="dashboard-card">
          <h3 className="text-lg font-medium mb-4">Support Hours</h3>
          <p className="text-sm mb-2">Monday - Friday: 9AM - 8PM</p>
          <p className="text-sm mb-2">Saturday: 10AM - 6PM</p>
          <p className="text-sm mb-4">Sunday: Closed</p>
          <p className="text-sm text-muted-foreground">All times are in Eastern Time (ET)</p>
        </div>
      </div>
    </div>
  );
};
