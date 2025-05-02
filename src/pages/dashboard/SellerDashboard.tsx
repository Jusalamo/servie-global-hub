
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SellerSidebar from "@/components/dashboard/SellerSidebar";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";
import AIAssistant from "@/components/dashboard/AIAssistant";
import Breadcrumb from "@/components/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OverviewTab from "@/components/dashboard/seller/OverviewTab";
import { Package, ShoppingBag, Tag, Users, CreditCard, TrendingUp, Store } from "lucide-react";

const SellerDashboard = () => {
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
      case "orders":
        return [{ label: "Orders" }];
      case "products":
        return [{ label: "Products" }];
      case "inventory":
        return [{ label: "Inventory" }];
      case "analytics":
        return [{ label: "Analytics" }];
      case "store":
        return [{ label: "Store Settings" }];
      case "customers":
        return [{ label: "Customers" }];
      case "messages":
        return [{ label: "Messages" }];
      case "payments":
        return [{ label: "Payments" }];
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
        return <OverviewTab />;
      case "orders":
        return <OrdersTab />;
      case "products":
        return <ProductsTab />;
      case "inventory":
        return <InventoryTab />;
      case "customers":
        return <CustomersTab />;
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
          { label: "Seller", href: "/dashboard/seller" },
          { label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }
        ]} 
      />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:block">
            <SellerSidebar />
          </div>
          
          {/* Main Content Area */}
          <div className="space-y-6">
            <DashboardBreadcrumb 
              items={getBreadcrumbItems()}
              userRole="seller"
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

// Content for Orders tab
const OrdersTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Orders</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">New Orders</CardTitle>
            <div className="text-2xl font-bold">12</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Processing</CardTitle>
            <div className="text-2xl font-bold">8</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Delivered</CardTitle>
            <div className="text-2xl font-bold">136</div>
          </CardHeader>
        </Card>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {[
              { id: "#3845", customer: "John Smith", products: "Product A, Product C", total: "$196", status: "processing", date: "Jun 12, 2025" },
              { id: "#3844", customer: "Sarah Johnson", products: "Product B", total: "$85", status: "delivered", date: "Jun 11, 2025" },
              { id: "#3843", customer: "Michael Brown", products: "Product D", total: "$120", status: "shipped", date: "Jun 10, 2025" },
              { id: "#3842", customer: "Emily Davis", products: "Product A, Product E", total: "$210", status: "delivered", date: "Jun 9, 2025" },
              { id: "#3841", customer: "Robert Wilson", products: "Product B, Product C", total: "$155", status: "new", date: "Jun 9, 2025" }
            ].map((order, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order.products}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order.total}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order.date}</td>
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

// Content for Products tab
const ProductsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <button className="bg-servie text-white px-4 py-2 rounded-md hover:bg-servie-600 transition">
          Add New Product
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: "Product A", price: "$129.99", stock: 24, category: "Electronics", status: "active" },
          { name: "Product B", price: "$85.00", stock: 12, category: "Home Decor", status: "active" },
          { name: "Product C", price: "$67.50", stock: 8, category: "Accessories", status: "active" },
          { name: "Product D", price: "$120.00", stock: 0, category: "Electronics", status: "out-of-stock" },
          { name: "Product E", price: "$93.25", stock: 5, category: "Fashion", status: "low-stock" },
          { name: "Product F", price: "$49.99", stock: 30, category: "Accessories", status: "active" }
        ].map((product, i) => (
          <Card key={i}>
            <div className="h-40 bg-gray-100 dark:bg-gray-800 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              {product.status === 'out-of-stock' && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1">
                  Out of Stock
                </div>
              )}
              {product.status === 'low-stock' && (
                <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-2 py-1">
                  Low Stock
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg">{product.name}</h3>
              <p className="text-servie font-medium">{product.price}</p>
              <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                <span>{product.category}</span>
                <span>Stock: {product.stock}</span>
              </div>
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                  Edit
                </button>
                <button className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                  View
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Content for Inventory tab
const InventoryTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Inventory Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Products</CardTitle>
            <div className="text-2xl font-bold">42</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Low Stock Items</CardTitle>
            <div className="text-2xl font-bold">5</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Out of Stock</CardTitle>
            <div className="text-2xl font-bold">3</div>
          </CardHeader>
        </Card>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">In Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reorder Point</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {[
              { sku: "SKU001", name: "Product A", category: "Electronics", stock: 24, reorderPoint: 10, status: "In Stock" },
              { sku: "SKU002", name: "Product B", category: "Home Decor", stock: 12, reorderPoint: 10, status: "In Stock" },
              { sku: "SKU003", name: "Product C", category: "Accessories", stock: 8, reorderPoint: 10, status: "Low Stock" },
              { sku: "SKU004", name: "Product D", category: "Electronics", stock: 0, reorderPoint: 10, status: "Out of Stock" },
              { sku: "SKU005", name: "Product E", category: "Fashion", stock: 5, reorderPoint: 10, status: "Low Stock" }
            ].map((product, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{product.sku}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{product.reorderPoint}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${product.status === 'In Stock' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                      product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' : 
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-servie hover:text-servie-600">Update Stock</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Content for Customers tab
const CustomersTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Customers</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Orders</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Spent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {[
              { name: "John Smith", email: "john.smith@example.com", orders: 3, spent: "$526", lastOrder: "Jun 12, 2025" },
              { name: "Sarah Johnson", email: "sarah.j@example.com", orders: 1, spent: "$85", lastOrder: "Jun 11, 2025" },
              { name: "Michael Brown", email: "m.brown@example.com", orders: 2, spent: "$240", lastOrder: "Jun 10, 2025" },
              { name: "Emily Davis", email: "emily.davis@example.com", orders: 4, spent: "$780", lastOrder: "Jun 9, 2025" },
              { name: "Robert Wilson", email: "rwilson@example.com", orders: 2, spent: "$155", lastOrder: "Jun 9, 2025" }
            ].map((customer, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xl font-medium">{customer.name.charAt(0)}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">{customer.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {customer.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {customer.orders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {customer.spent}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {customer.lastOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <a href="#" className="text-servie hover:text-servie-600">View</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Email</a>
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

// Generic "Coming Soon" component for tabs still in development
const ComingSoonTab = ({ title }: { title: string }) => {
  const formatTitle = title.charAt(0).toUpperCase() + title.slice(1);
  
  const getIcon = () => {
    switch(title) {
      case "analytics": return <TrendingUp className="h-16 w-16" />;
      case "store": return <Store className="h-16 w-16" />;
      case "messages": return <MessageSquare className="h-16 w-16" />;
      case "payments": return <CreditCard className="h-16 w-16" />;
      case "settings": return <CreditCard className="h-16 w-16" />;
      default: return <Package className="h-16 w-16" />;
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-servie mb-4">
        {getIcon()}
      </div>
      <h2 className="text-2xl font-bold mb-2">{formatTitle}</h2>
      <p className="text-muted-foreground text-center max-w-md">
        We're working hard to bring you the best {formatTitle.toLowerCase()} tools for your seller account.
        This section will be available in the next update.
      </p>
    </div>
  );
};

export default SellerDashboard;
