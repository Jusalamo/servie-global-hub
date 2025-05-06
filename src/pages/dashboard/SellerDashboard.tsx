
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SellerSidebar from "@/components/dashboard/SellerSidebar";
import OverviewTab from "@/components/dashboard/seller/OverviewTab";
import AddProductForm from "@/components/dashboard/seller/AddProductForm";
import OrdersTab from "@/components/dashboard/seller/OrdersTab";
import MessagingSystem from "@/components/dashboard/MessagingSystem";
import PaymentMethods from "@/components/dashboard/PaymentMethods";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import NotificationsSettings from "@/components/dashboard/NotificationsSettings";
import { useLocation } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";

// Define the PlaceholderContent component
const PlaceholderContent = ({ title, message }: { title: string; message: string }) => {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{message}</p>
      <p>This section is coming soon. Check back for updates!</p>
    </div>
  );
};

// Define SellerDashboardProps interface
interface SellerDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function SellerDashboard({ activeTab: initialTab, onTabChange: externalTabChange }: SellerDashboardProps) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Get tab from URL params if available, fallback to props or default
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('tab') || initialTab || "overview";
  });
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (externalTabChange) {
      externalTabChange(tab);
    }
  };

  // Get breadcrumb label based on active tab
  const getBreadcrumbLabel = () => {
    switch (activeTab) {
      case "overview": return "Overview";
      case "products": return "Products";
      case "orders": return "Orders";
      case "inventory": return "Inventory";
      case "analytics": return "Analytics";
      case "store": return "Store Settings";
      case "customers": return "Customers";
      case "messages": return "Messages";
      case "payments": return "Payments";
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
        return <OverviewTab />;
      case "products":
        return <AddProductForm />;
      case "orders":
        return <OrdersTab />;
      case "inventory":
        return <InventoryManagementTab />;
      case "analytics":
        return <AnalyticsTab />;
      case "store":
        return <StoreSettingsTab />;
      case "customers":
        return <CustomersTab />;
      case "messages":
        return <MessagingSystem userRole="seller" />;
      case "payments":
        return <PaymentMethods />;
      case "settings":
        return <ProfileSettings userRole="seller" />;
      case "help":
        return <HelpSupportTab />;
      case "notifications":
        return <NotificationsSettings />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Breadcrumb 
        additionalCrumbs={[
          { label: "Seller Dashboard", href: "/dashboard/seller" },
          { label: getBreadcrumbLabel() }
        ]} 
      />
      <div className="flex flex-1 h-[calc(100vh-104px)]">
        <SellerSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}

// Inventory Management Tab
const InventoryManagementTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Inventory Management</h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 bg-amber-50 rounded-lg p-4 border border-amber-200 flex items-center">
          <div className="mr-4 h-10 w-10 rounded-full bg-amber-200 flex items-center justify-center">
            <AlertIcon className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-medium">Low Stock Alert</h3>
            <p className="text-sm">3 products are running low on inventory</p>
          </div>
          <Button variant="link" className="ml-auto text-amber-600">View Items</Button>
        </div>
        
        <div className="flex-1 bg-blue-50 rounded-lg p-4 border border-blue-200 flex items-center">
          <div className="mr-4 h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
            <BoxIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium">Total Products</h3>
            <p className="text-sm">You have 24 products in your inventory</p>
          </div>
          <Button variant="link" className="ml-auto text-blue-600">Manage All</Button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Product</th>
              <th className="text-left p-3 font-medium">SKU</th>
              <th className="text-left p-3 font-medium">Price</th>
              <th className="text-left p-3 font-medium">Stock</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-right p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[
              { name: "Wireless Headphones", sku: "WH-001", price: 149.99, stock: 23, status: "In Stock" },
              { name: "Bluetooth Speaker", sku: "BS-002", price: 89.99, stock: 5, status: "Low Stock" },
              { name: "Smart Watch", sku: "SW-003", price: 199.99, stock: 0, status: "Out of Stock" },
              { name: "USB-C Cable", sku: "UC-004", price: 19.99, stock: 42, status: "In Stock" },
              { name: "Power Bank", sku: "PB-005", price: 59.99, stock: 3, status: "Low Stock" },
            ].map((product, i) => (
              <tr key={i} className="hover:bg-muted/30">
                <td className="p-3">
                  <div className="font-medium">{product.name}</div>
                </td>
                <td className="p-3 text-muted-foreground">{product.sku}</td>
                <td className="p-3">${product.price}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                    product.status === 'Low Stock' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-1">
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <BoxPlusIcon className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Stock Replenishment</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Schedule automatic reorders for your products when stock gets low
          </p>
          <Button className="bg-servie hover:bg-servie-600 w-full">Set Up Auto-Reorder</Button>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Inventory Adjustment</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Make manual adjustments to your inventory levels
          </p>
          <Button className="bg-servie hover:bg-servie-600 w-full">Adjust Inventory</Button>
        </div>
      </div>
    </div>
  );
};

// Analytics Tab
const AnalyticsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics & Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="text-sm text-muted-foreground">Total Revenue</h3>
          <p className="text-2xl font-bold mt-1">$12,450.80</p>
          <div className="flex items-center mt-1 text-sm">
            <TrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+12.5%</span>
            <span className="text-muted-foreground ml-1">vs last month</span>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-sm text-muted-foreground">Orders Completed</h3>
          <p className="text-2xl font-bold mt-1">142</p>
          <div className="flex items-center mt-1 text-sm">
            <TrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">+8.2%</span>
            <span className="text-muted-foreground ml-1">vs last month</span>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-sm text-muted-foreground">Average Order Value</h3>
          <p className="text-2xl font-bold mt-1">$87.68</p>
          <div className="flex items-center mt-1 text-sm">
            <TrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
            <span className="text-red-600 font-medium">-2.3%</span>
            <span className="text-muted-foreground ml-1">vs last month</span>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-6 h-72 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-2">📊</div>
          <h3 className="text-lg font-medium">Revenue Chart</h3>
          <p className="text-sm text-muted-foreground">
            A chart showing sales and revenue trends would be displayed here
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="font-medium mb-4">Top Products</h3>
          <div className="space-y-4">
            {[
              { name: "Wireless Headphones", sales: 45, revenue: 6749.55 },
              { name: "Bluetooth Speaker", sales: 32, revenue: 2879.68 },
              { name: "Smart Watch", sales: 28, revenue: 5599.72 },
              { name: "USB-C Cable", sales: 24, revenue: 479.76 },
              { name: "Power Bank", sales: 13, revenue: 779.87 },
            ].map((product, i) => (
              <div key={i} className="flex items-center">
                <span className="font-medium w-6">{i +1}.</span>
                <span className="flex-1">{product.name}</span>
                <span className="text-muted-foreground mr-4">{product.sales} units</span>
                <span className="font-medium">${product.revenue.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="font-medium mb-4">Customer Demographics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Age Group: 25-34</span>
                <span>42%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-servie w-[42%]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Age Group: 35-44</span>
                <span>27%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-servie w-[27%]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Age Group: 18-24</span>
                <span>15%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-servie w-[15%]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Age Group: 45-54</span>
                <span>10%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-servie w-[10%]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Age Group: 55+</span>
                <span>6%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-servie w-[6%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Store Settings Tab
const StoreSettingsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Store Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg overflow-hidden col-span-1 md:col-span-2">
          <div className="h-40 bg-muted flex items-center justify-center border-b">
            <div className="text-center">
              <StoreIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Store Banner Image</p>
              <Button variant="outline" size="sm" className="mt-2">Upload Image</Button>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Store Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  defaultValue="My Awesome Store"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Store Description</label>
                <textarea
                  className="w-full p-2 border rounded min-h-[100px]"
                  defaultValue="We offer high-quality products at competitive prices. Satisfaction guaranteed!"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded"
                    defaultValue="contact@mystore.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Phone</label>
                  <input
                    type="tel"
                    className="w-full p-2 border rounded"
                    defaultValue="(555) 123-4567"
                  />
                </div>
              </div>
              
              <Button className="bg-servie hover:bg-servie-600">Save Store Information</Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3">Store URL</h3>
            <div className="flex">
              <input
                type="text"
                className="flex-1 p-2 border rounded-l"
                defaultValue="mystore"
                readOnly
              />
              <span className="bg-muted p-2 border border-l-0 rounded-r text-muted-foreground">
                .servie.com
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This is your unique store URL where customers can find your products.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3">Store Status</h3>
            <div className="flex items-center justify-between">
              <span>Store is online</span>
              <div>
                <Switch defaultChecked={true} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Toggle to take your store offline for maintenance.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3">Store Theme</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="radio" id="theme-default" name="theme" defaultChecked />
                <label htmlFor="theme-default">Default</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="theme-modern" name="theme" />
                <label htmlFor="theme-modern">Modern</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="theme-classic" name="theme" />
                <label htmlFor="theme-classic">Classic</label>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-3">Preview Themes</Button>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-6">
        <h3 className="font-medium mb-4">Shipping Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">Free Shipping</h4>
              <p className="text-sm text-muted-foreground">
                Offer free shipping for orders above a certain amount
              </p>
            </div>
            <Switch defaultChecked={true} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Minimum Order Amount for Free Shipping</label>
            <div className="flex">
              <span className="bg-muted p-2 border border-r-0 rounded-l">$</span>
              <input
                type="number"
                className="flex-1 p-2 border rounded-r"
                defaultValue="50"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Shipping Rate</label>
              <div className="flex">
                <span className="bg-muted p-2 border border-r-0 rounded-l">$</span>
                <input
                  type="number"
                  className="flex-1 p-2 border rounded-r"
                  defaultValue="5.99"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Express Shipping Rate</label>
              <div className="flex">
                <span className="bg-muted p-2 border border-r-0 rounded-l">$</span>
                <input
                  type="number"
                  className="flex-1 p-2 border rounded-r"
                  defaultValue="15.99"
                />
              </div>
            </div>
          </div>
          
          <Button className="bg-servie hover:bg-servie-600">Save Shipping Settings</Button>
        </div>
      </div>
    </div>
  );
};

// Customers Tab
const CustomersTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Customers</h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 border rounded-lg p-4 flex items-center">
          <div className="mr-4 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <UsersIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium">Total Customers</h3>
            <p className="text-2xl font-bold">246</p>
          </div>
        </div>
        
        <div className="flex-1 border rounded-lg p-4 flex items-center">
          <div className="mr-4 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <RepeatIcon className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium">Repeat Customers</h3>
            <p className="text-2xl font-bold">68</p>
          </div>
        </div>
        
        <div className="flex-1 border rounded-lg p-4 flex items-center">
          <div className="mr-4 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
            <TrendingUpIcon className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium">New Customers</h3>
            <p className="text-2xl font-bold">12 <span className="text-sm font-normal text-muted-foreground">this week</span></p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search customers..."
            className="p-2 border rounded"
          />
          <Button variant="outline">Search</Button>
        </div>
        
        <Button className="bg-servie hover:bg-servie-600">
          <DownloadIcon className="h-4 w-4 mr-2" />
          Export Customers
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Customer</th>
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Orders</th>
              <th className="text-left p-3 font-medium">Total Spent</th>
              <th className="text-left p-3 font-medium">Last Order</th>
              <th className="text-right p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[
              { name: "Sarah Johnson", email: "sarah@example.com", orders: 8, spent: 842.50, lastOrder: "2023-05-10" },
              { name: "Michael Chen", email: "michael@example.com", orders: 5, spent: 523.75, lastOrder: "2023-04-28" },
              { name: "Emma Rodriguez", email: "emma@example.com", orders: 3, spent: 245.00, lastOrder: "2023-05-05" },
              { name: "David Kim", email: "david@example.com", orders: 12, spent: 1290.25, lastOrder: "2023-05-12" },
              { name: "Lisa Thompson", email: "lisa@example.com", orders: 2, spent: 178.50, lastOrder: "2023-04-15" },
            ].map((customer, i) => (
              <tr key={i} className="hover:bg-muted/30">
                <td className="p-3">
                  <div className="font-medium">{customer.name}</div>
                </td>
                <td className="p-3 text-muted-foreground">{customer.email}</td>
                <td className="p-3">{customer.orders}</td>
                <td className="p-3">${customer.spent.toFixed(2)}</td>
                <td className="p-3 text-muted-foreground">{new Date(customer.lastOrder).toLocaleDateString()}</td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-1">
                    <UserIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-1">
                    <SendIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-muted-foreground">Showing 1-5 of 246 customers</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 mt-8">
        <h3 className="font-medium mb-3">Customer Groups</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Create and manage customer groups for targeted marketing campaigns and special offers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded p-3">
            <h4 className="font-medium">VIP Customers</h4>
            <p className="text-sm text-muted-foreground">27 members</p>
          </div>
          <div className="border rounded p-3">
            <h4 className="font-medium">New Customers</h4>
            <p className="text-sm text-muted-foreground">48 members</p>
          </div>
          <div className="border rounded p-3">
            <h4 className="font-medium">High Spenders</h4>
            <p className="text-sm text-muted-foreground">15 members</p>
          </div>
        </div>
        <Button className="mt-4 bg-servie hover:bg-servie-600">Create New Group</Button>
      </div>
    </div>
  );
};

// Help & Support Tab
const HelpSupportTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Help & Support</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">How do I process refunds?</h4>
              <p className="text-sm text-muted-foreground">
                Navigate to Orders, find the order you want to refund, click the refund
                button, and follow the prompts to process a full or partial refund.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">How do I add product variations?</h4>
              <p className="text-sm text-muted-foreground">
                When creating or editing a product, look for the "Add Variations" section.
                You can add attributes like size, color, and material along with their options.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">How do I connect my payment processor?</h4>
              <p className="text-sm text-muted-foreground">
                Go to Payments in your dashboard, click on "Add Payment Method", and
                follow the integration steps for your preferred payment processor.
              </p>
            </div>
            <button className="text-servie text-sm font-medium mt-2">View all FAQs</button>
          </div>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Contact Support</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our dedicated seller support team is here to help you succeed.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <MessageIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Live Chat</h4>
                <p className="text-sm text-muted-foreground">
                  Available weekdays 9am-6pm
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
                  We'll respond within 24 hours
                </p>
                <button className="text-servie text-sm font-medium mt-1">Send Email</button>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <BookIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Knowledge Base</h4>
                <p className="text-sm text-muted-foreground">
                  Browse our help articles and tutorials
                </p>
                <button className="text-servie text-sm font-medium mt-1">Visit KB</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-3">Seller Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Seller Handbook</h4>
              <p className="text-sm text-muted-foreground mb-3">
                A comprehensive guide to selling on our platform.
              </p>
              <button className="text-servie text-sm font-medium">Download PDF</button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Marketing Tips</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Learn how to promote your products effectively.
              </p>
              <button className="text-servie text-sm font-medium">Read Guide</button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Seller Community</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Connect with other sellers and share insights.
              </p>
              <button className="text-servie text-sm font-medium">Join Forum</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Switch component for toggle buttons
const Switch = ({ defaultChecked = false, ...props }) => {
  const [checked, setChecked] = useState(defaultChecked);
  
  return (
    <button
      role="switch"
      aria-checked={checked}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-servie focus:ring-offset-2 ${
        checked ? 'bg-servie' : 'bg-gray-200'
      }`}
      onClick={() => setChecked(!checked)}
      {...props}
    >
      <span className="sr-only">Toggle</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
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

const BookIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const AlertIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" x2="12" y1="9" y2="13" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
);

const BoxIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const BoxPlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
    <path d="M15 10h-6" />
    <path d="M12 13v-6" />
  </svg>
);

const TrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const TrendingDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
    <polyline points="16 17 22 17 22 11" />
  </svg>
);

const StoreIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
    <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.8 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.61-.63.7.7 0 0 0-.8 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.61-.63.7.7 0 0 0-.8 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.61-.63.7.7 0 0 0-.8 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
  </svg>
);

const RepeatIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="m7 22-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

const MoreVerticalIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);
