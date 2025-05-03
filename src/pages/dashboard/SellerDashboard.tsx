
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SellerSidebar from "@/components/dashboard/SellerSidebar";
import AIAssistant from "@/components/dashboard/AIAssistant";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";
import { SellerOverviewTab } from "@/components/dashboard/seller/OverviewTab";
import { OrdersTab } from "@/components/dashboard/seller/OrdersTab";
import AddProductForm from "@/components/dashboard/seller/AddProductForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

// Mock products data
const products = [
  {
    id: "prod_1",
    name: "Professional Cleaning Kit",
    description: "Complete kit with eco-friendly cleaning supplies for professionals.",
    price: 79.99,
    stock: 24,
    sold: 156,
    rating: 4.8,
    reviewCount: 45,
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    category: "Cleaning Supplies"
  },
  {
    id: "prod_2",
    name: "Microfiber Cleaning Cloths (24-Pack)",
    description: "High-quality microfiber cloths for streak-free cleaning of all surfaces.",
    price: 19.99,
    stock: 120,
    sold: 342,
    rating: 4.9,
    reviewCount: 128,
    image: "https://images.unsplash.com/photo-1583907659441-addbe699e921?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    category: "Cleaning Supplies"
  },
  {
    id: "prod_3",
    name: "All-Purpose Cleaner (Organic)",
    description: "Plant-based, biodegradable all-purpose cleaner for any surface.",
    price: 12.99,
    stock: 0,
    sold: 89,
    rating: 4.7,
    reviewCount: 34,
    image: "https://images.unsplash.com/photo-1622668211424-c1e7d91445f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    category: "Cleaning Supplies"
  }
];

export default function SellerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);
  
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    navigate(`/dashboard/seller?tab=${tabName}`);
  };
  
  const renderTabContent = () => {
    switch(activeTab) {
      case "overview":
        return <SellerOverviewTab />;
      case "orders":
        return <OrdersTab />;
      case "products":
        return <ProductsTab products={products} />;
      case "add-product":
        return <AddProductForm />;
      default:
        return <PlaceholderTab name={activeTab} />;
    }
  };
  
  const breadcrumbItems = [
    { label: "Overview", path: activeTab === "overview" ? undefined : `/dashboard/seller?tab=overview` },
    ...(activeTab !== "overview" ? [{ label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }] : [])
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex">
        <SellerSidebar />
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <DashboardBreadcrumb 
              items={breadcrumbItems}
              userRole="seller"
            />
            
            {renderTabContent()}
          </div>
        </div>
        <AIAssistant />
      </main>
      <Footer />
    </div>
  );
}

// Tab Components
const ProductsTab = ({ products }: { products: any[] }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Your Products</h2>
        <Button onClick={() => navigate('/dashboard/seller?tab=add-product')}>
          Add New Product
        </Button>
      </div>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-video w-full relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                {product.stock === 0 && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-purple-500 text-white">Out of Stock</Badge>
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between text-sm">
                  <div className="flex items-center text-purple-600">
                    <span>Stock: {product.stock > 0 ? product.stock : "Out of stock"}</span>
                  </div>
                  <div className="flex items-center">
                    <span>Sold: {product.sold}</span>
                  </div>
                </div>
                
                <div className="pt-2 flex space-x-2">
                  <Button variant="default" className="flex-1">Edit</Button>
                  <Button variant="outline" className="flex-1">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No products yet</h3>
          <p className="text-muted-foreground mb-6">Start by adding your first product to your store</p>
          <Button onClick={() => navigate('/dashboard/seller?tab=add-product')}>
            Add Your First Product
          </Button>
        </div>
      )}
    </div>
  );
};

// Placeholder Tab for other menu items
const PlaceholderTab = ({ name }: { name: string }) => {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold mb-4">{name.charAt(0).toUpperCase() + name.slice(1)} Content</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        This section is under development. Check back soon for updates.
      </p>
    </div>
  );
};
