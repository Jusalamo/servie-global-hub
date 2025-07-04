import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const { userRole } = useAuth();
  
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
      case "users":
        return [{ label: "User Management" }];
      case "services":
        return [{ label: "Service Management" }];
      case "products":
        return [{ label: "Product Management" }];
      case "finances":
        return [{ label: "Financial Reports" }];
      case "settings":
        return [{ label: "System Settings" }];
      default:
        return [{ label: "Overview" }];
    }
  };
  
  const renderTabContent = () => {
    switch(activeTab) {
      case "overview":
        return <AdminOverviewTab />;
      case "users":
        return <UserManagementTab />;
      case "services":
        return <ServiceManagementTab />;
      case "products":
        return <ProductManagementTab />;
      case "finances":
        return <FinancialReportsTab />;
      case "settings":
        return <SystemSettingsTab />;
      default:
        return <AdminOverviewTab />;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <DashboardBreadcrumb 
        items={getBreadcrumbItems()}
        userRole="admin"
      />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar Navigation */}
          <AdminSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
          {/* Main Content Area */}
          <div className="space-y-6">
            {renderTabContent()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Admin Overview Tab
const AdminOverviewTab = () => {
  const stats = [
    { title: "Total Users", value: "2,451", icon: Users, change: "+12%" },
    { title: "Active Services", value: "189", icon: Package, change: "+8%" },
    { title: "Total Orders", value: "1,024", icon: ShoppingCart, change: "+23%" },
    { title: "Revenue", value: "$45,231", icon: DollarSign, change: "+15%" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Platform Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm">New service provider registered: Kwame Asante</p>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm">Order completed: Traditional African Print Dress</p>
              <span className="text-xs text-muted-foreground">4 hours ago</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <p className="text-sm">Service booking confirmed: Wedding Photography</p>
              <span className="text-xs text-muted-foreground">6 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Placeholder tabs for other admin functions
const UserManagementTab = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">User Management</h2>
    <Card>
      <CardContent className="p-6">
        <p className="text-muted-foreground">User management features coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

const ServiceManagementTab = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Service Management</h2>
    <Card>
      <CardContent className="p-6">
        <p className="text-muted-foreground">Service management features coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

const ProductManagementTab = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Product Management</h2>
    <Card>
      <CardContent className="p-6">
        <p className="text-muted-foreground">Product management features coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

const FinancialReportsTab = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Financial Reports</h2>
    <Card>
      <CardContent className="p-6">
        <p className="text-muted-foreground">Financial reporting features coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

const SystemSettingsTab = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">System Settings</h2>
    <Card>
      <CardContent className="p-6">
        <p className="text-muted-foreground">System settings features coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

export default AdminDashboard;
