import { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SellerSidebar from "@/components/dashboard/SellerSidebar";
import OverviewTab from "@/components/dashboard/seller/OverviewTab";
import OrdersTab from "@/components/dashboard/seller/OrdersTab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu, Package, ShoppingBag, Users, DollarSign, Truck, BarChart4, Settings, MessageSquare, Mail } from "lucide-react";

// Mock data for seller dashboard
const mockProducts = [
  { id: '1', name: 'Handcrafted Pottery Set', inventory: 12, price: 89.99, sales: 24 },
  { id: '2', name: 'Natural Soap Collection', inventory: 45, price: 24.99, sales: 78 },
  { id: '3', name: 'Wooden Kitchen Utensils', inventory: 8, price: 34.99, sales: 16 },
  { id: '4', name: 'Hand-woven Basket', inventory: 3, price: 49.99, sales: 5 },
  { id: '5', name: 'Organic Cotton Pillowcase', inventory: 26, price: 19.99, sales: 42 },
];

const mockCustomers = [
  { id: '1', name: 'John Smith', email: 'john@example.com', orders: 3, totalSpent: 149.97 },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', orders: 5, totalSpent: 287.45 },
  { id: '3', name: 'Michael Brown', email: 'michael@example.com', orders: 1, totalSpent: 89.99 },
  { id: '4', name: 'Emily Wilson', email: 'emily@example.com', orders: 2, totalSpent: 74.98 },
];

export default function SellerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "overview";

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "orders":
        return <OrdersTab />;
      case "products":
        return <ProductsTab />;
      case "inventory":
        return <InventoryTab />;
      case "customers":
        return <CustomersTab />;
      case "payments":
        return <PaymentsTab />;
      case "settings":
        return <SettingsTab />;
      case "help":
        return <HelpTab />;
      default:
        return <OverviewTab />;
    }
  };

  // Products Tab Component
  const ProductsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Products</h2>
        <Button className="bg-servie hover:bg-servie-600">
          <Package className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader className="px-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <CardTitle>Product Inventory</CardTitle>
                <div className="flex gap-2">
                  <input 
                    type="search" 
                    placeholder="Search products..." 
                    className="px-3 py-1 border rounded-md text-sm"
                  />
                  <Button variant="outline" size="sm">Filter</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left">Product Name</th>
                      <th className="py-3 px-4 text-right">Inventory</th>
                      <th className="py-3 px-4 text-right">Price</th>
                      <th className="py-3 px-4 text-right">Sales</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockProducts.map(product => (
                      <tr key={product.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{product.name}</div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`${product.inventory < 10 ? 'text-red-500 font-medium' : ''}`}>
                            {product.inventory}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">${product.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">{product.sales}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active">
          <Card className="p-6">
            <p>Active products will be shown here.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="draft">
          <Card className="p-6">
            <p>Draft products will be shown here.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="archived">
          <Card className="p-6">
            <p>Archived products will be shown here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Inventory Tab Component
  const InventoryTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Inventory Management</h2>
        <Button className="bg-servie hover:bg-servie-600">Update Inventory</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-sm text-muted-foreground mt-2">
              Products that need restocking soon
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-sm text-muted-foreground mt-2">
              Products that are currently unavailable
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProducts.length}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Across all product categories
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Inventory Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-amber-50 border-amber-200 text-amber-800">
              <div className="font-medium">Low Stock: Wooden Kitchen Utensils</div>
              <p className="text-sm mt-1">Only 8 items remaining. Consider restocking soon.</p>
            </div>
            
            <div className="p-4 border rounded-md bg-red-50 border-red-200 text-red-800">
              <div className="font-medium">Critical Stock: Hand-woven Basket</div>
              <p className="text-sm mt-1">Only 3 items remaining. Restock immediately.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Bulk Inventory Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Update multiple product inventory levels at once
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Button variant="outline">Import Inventory CSV</Button>
              <Button variant="outline">Export Inventory Data</Button>
              <Button variant="outline">Bulk Price Update</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Customers Tab Component
  const CustomersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Customers</h2>
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Search customers..."
            className="px-3 py-1 border rounded-md text-sm"
          />
          <Button variant="outline">Export</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCustomers.length}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Increase of 12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Repeat Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-sm text-muted-foreground mt-2">
              50% of total customer base
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Customer Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$75.60</div>
            <p className="text-sm text-muted-foreground mt-2">
              Per customer over lifetime
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-right">Orders</th>
                  <th className="py-3 px-4 text-right">Total Spent</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockCustomers.map(customer => (
                  <tr key={customer.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{customer.name}</div>
                    </td>
                    <td className="py-3 px-4">{customer.email}</td>
                    <td className="py-3 px-4 text-right">{customer.orders}</td>
                    <td className="py-3 px-4 text-right">${customer.totalSpent.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <Button variant="outline" size="sm">View Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Payments Tab Component
  const PaymentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Payments & Revenue</h2>
        <Button variant="outline">Download Reports</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,285.32</div>
            <p className="text-sm text-muted-foreground mt-2">
              Lifetime sales revenue
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$756.19</div>
            <p className="text-sm text-muted-foreground mt-2">
              To be received on May 3, 2025
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Servie Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$299.97</div>
            <p className="text-sm text-muted-foreground mt-2">
              7% of total revenue
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">Revenue chart will be displayed here</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Order ID</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Commission</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">Apr 12, 2025</td>
                  <td className="py-3 px-4">#ORD-7291</td>
                  <td className="py-3 px-4">Sarah Johnson</td>
                  <td className="py-3 px-4 text-right">$129.99</td>
                  <td className="py-3 px-4 text-right">$9.10</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">Apr 10, 2025</td>
                  <td className="py-3 px-4">#ORD-7290</td>
                  <td className="py-3 px-4">John Smith</td>
                  <td className="py-3 px-4 text-right">$54.99</td>
                  <td className="py-3 px-4 text-right">$3.85</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">Apr 8, 2025</td>
                  <td className="py-3 px-4">#ORD-7289</td>
                  <td className="py-3 px-4">Emily Wilson</td>
                  <td className="py-3 px-4 text-right">$89.99</td>
                  <td className="py-3 px-4 text-right">$6.30</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Processing</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Payout Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Your earnings are automatically paid out on the 1st and 15th of each month.
          </p>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-md">
              <div>
                <div className="font-medium">Next Payout</div>
                <div className="text-sm text-muted-foreground">May 1, 2025</div>
              </div>
              <div className="text-xl font-bold">$456.20</div>
            </div>
            
            <div className="flex justify-between items-center p-4 border rounded-md">
              <div>
                <div className="font-medium">Future Payout</div>
                <div className="text-sm text-muted-foreground">May 15, 2025</div>
              </div>
              <div className="text-xl font-bold">$299.99</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Settings Tab Component
  const SettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Account Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Store Name</label>
                <input 
                  type="text" 
                  defaultValue="Artisan Creations"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Store URL</label>
                <div className="flex">
                  <span className="bg-muted px-2 py-2 border border-r-0 rounded-l-md text-muted-foreground">
                    servie.com/shop/
                  </span>
                  <input 
                    type="text" 
                    defaultValue="artisan-creations"
                    className="flex-1 p-2 border rounded-r-md"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Store Description</label>
                <textarea 
                  defaultValue="Handcrafted artisanal products made with love and attention to detail."
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Contact Email</label>
                <input 
                  type="email" 
                  defaultValue="contact@artisancreations.com"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Contact Phone</label>
                <input 
                  type="tel" 
                  defaultValue="555-123-4567"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            
            <Button className="bg-servie hover:bg-servie-600 mt-4">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Payout Method</h4>
              <div className="p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-6 mr-3">
                      <img src="https://via.placeholder.com/60x40?text=Bank" alt="Bank Account" className="h-full w-auto" />
                    </div>
                    <div>
                      <div className="font-medium">Bank Account</div>
                      <div className="text-sm text-muted-foreground">Ending in 4567</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Tax Information</h4>
              <div className="p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Tax ID: XXXXXXX123</div>
                    <div className="text-sm text-muted-foreground">Submitted on Jan 15, 2025</div>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Commission Settings</h4>
              <div className="p-4 border rounded-md">
                <p className="text-sm mb-2">
                  Your current commission rate is <span className="font-semibold">7%</span> per transaction.
                </p>
                <div className="text-sm text-muted-foreground">
                  Commission rates are determined by your seller plan and sales volume.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // Help & Support Tab
  const HelpTab = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Help & Support</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Our seller support team is available Monday-Friday, 9am-6pm EST.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Open Support Ticket
                </Button>
              </div>
              <div className="flex items-center">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Seller Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <a href="#" className="block p-4 border rounded-md hover:bg-muted/50">
                <div className="font-medium">Seller Handbook</div>
                <p className="text-sm text-muted-foreground">
                  Complete guide to selling on Servie
                </p>
              </a>
              <a href="#" className="block p-4 border rounded-md hover:bg-muted/50">
                <div className="font-medium">Photography Tips</div>
                <p className="text-sm text-muted-foreground">
                  How to showcase your products effectively
                </p>
              </a>
              <a href="#" className="block p-4 border rounded-md hover:bg-muted/50">
                <div className="font-medium">Shipping Best Practices</div>
                <p className="text-sm text-muted-foreground">
                  Optimizing your shipping process
                </p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <h4 className="font-medium">How do I add a new product?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Navigate to the Products tab and click on "Add New Product". Fill in the product details, upload images, set pricing and inventory, then publish your listing.
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <h4 className="font-medium">When will I receive my payments?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Payments are processed on the 1st and 15th of each month for all orders that were completed at least 3 days prior to the payout date.
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <h4 className="font-medium">How do I handle returns?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                When a customer requests a return, you'll receive a notification. You have 48 hours to approve or deny the request based on your return policy. If approved, the customer will ship the item back to you.
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <h4 className="font-medium">Can I offer discounts or run sales?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Yes! You can create discount codes and run limited-time sales through the Marketing section in your dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        {/* Mobile sidebar toggle */}
        <div className="md:hidden p-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Mobile sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
            <div className="fixed inset-y-0 left-0 z-50 w-64 bg-background shadow-lg">
              <div className="flex justify-end p-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
              <SellerSidebar />
            </div>
          </div>
        )}
        
        {/* Desktop sidebar */}
        <SellerSidebar />
        
        {/* Main content */}
        <div className="flex-1 p-6 md:p-10 bg-muted/20">
          {renderTabContent()}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
