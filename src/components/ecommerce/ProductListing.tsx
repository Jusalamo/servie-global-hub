import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard, type Product } from "@/components/ecommerce/ProductCard";
import { Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function ProductListing({ initialCategory = 'all', initialSearch = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Mock categories - in production, these would come from the database
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'home', name: 'Home & Kitchen' },
    { id: 'beauty', name: 'Beauty & Personal Care' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'tools', name: 'Tools & Home Improvement' },
    { id: 'sports', name: 'Sports & Outdoors' },
    { id: 'toys', name: 'Toys & Games' },
  ];

  // Set up Supabase realtime subscription
  useEffect(() => {
    const setupRealtime = async () => {
      try {
        const channel = supabase.channel('public:products')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'products' 
          }, (payload) => {
            console.log('Real-time update received:', payload);
            if (payload.eventType === 'INSERT') {
              // Add new product to the list if it matches current filters
              const newProduct = payload.new as Product;
              if (category === 'all' || newProduct.category === category) {
                setProducts(prev => [newProduct, ...prev]);
                toast.success(`New product added: ${newProduct.name}`);
              }
            } else if (payload.eventType === 'UPDATE') {
              // Update existing product in the list
              const updatedProduct = payload.new as Product;
              setProducts(prev => 
                prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
              );
            } else if (payload.eventType === 'DELETE') {
              // Remove deleted product from the list
              const deletedId = payload.old.id;
              setProducts(prev => prev.filter(p => p.id !== deletedId));
            }
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              setRealtimeEnabled(true);
              console.log('Realtime subscription active for products');
            }
          });

        return () => {
          channel.unsubscribe();
        };
      } catch (error) {
        console.error("Error setting up realtime:", error);
      }
    };

    setupRealtime();
  }, [category]);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Update URL with current filters
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      if (searchQuery) params.set('search', searchQuery);
      
      const newUrl = `${location.pathname}?${params.toString()}`;
      navigate(newUrl, { replace: true });
      
      let query = supabase.from('products').select('*');
      
      // Apply category filter if not 'all'
      if (category !== 'all') {
        query = query.eq('category', category);
      }
      
      // Apply search query if provided
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'featured':
        default:
          query = query.order('featured', { ascending: false }).order('created_at', { ascending: false });
          break;
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // If no products in database yet, use mock data
      if (!data || data.length === 0) {
        // Use mock data as fallback
        setProducts(mockProducts);
      } else {
        setProducts(data as Product[]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products. Using sample data instead.");
      // Use mock data as fallback on error
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  // Load products when filters change
  useEffect(() => {
    fetchProducts();
  }, [category, searchQuery, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  // Mock products data transformed to match Product interface (fallback data)
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Wireless Bluetooth Earbuds",
      price: 49.99,
      rating: 4.5,
      reviewCount: 128,
      category: "electronics",
      images: ["/products/earbuds.jpg"],
      providerName: "AudioTech",
      providerAvatar: "/placeholder.svg",
      providerId: "provider1",
      description: "High-quality wireless earbuds with noise cancellation.",
      featured: false,
      inStock: true,
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      name: "Smart Home Security Camera",
      price: 89.99,
      rating: 4.2,
      reviewCount: 75,
      category: "electronics",
      images: ["/products/camera.jpg"],
      providerName: "SecureView",
      providerAvatar: "/placeholder.svg",
      providerId: "provider2",
      description: "HD security camera with motion detection and night vision.",
      featured: true,
      inStock: true,
      createdAt: new Date().toISOString()
    },
    {
      id: "3",
      name: "Ergonomic Office Chair",
      price: 199.99,
      rating: 4.7,
      reviewCount: 42,
      category: "home",
      images: ["/products/chair.jpg"],
      providerName: "ComfortPlus",
      providerAvatar: "/placeholder.svg",
      providerId: "provider3",
      description: "Adjustable office chair with lumbar support.",
      featured: false,
      inStock: true,
      createdAt: new Date().toISOString()
    },
    {
      id: "4",
      name: "Non-Stick Cookware Set",
      price: 129.99,
      rating: 4.4,
      reviewCount: 89,
      category: "home",
      images: ["/products/cookware.jpg"],
      providerName: "KitchenPro",
      providerAvatar: "/placeholder.svg",
      providerId: "provider4",
      description: "10-piece non-stick cookware set for all cooking needs.",
      featured: false,
      inStock: true,
      createdAt: new Date().toISOString()
    },
    {
      id: "5",
      name: "Organic Face Serum",
      price: 34.99,
      rating: 4.8,
      reviewCount: 156,
      category: "beauty",
      images: ["/products/serum.jpg"],
      providerName: "NaturalGlow",
      providerAvatar: "/placeholder.svg",
      providerId: "provider5",
      description: "Hydrating face serum with vitamin C and hyaluronic acid.",
      featured: true,
      inStock: true,
      createdAt: new Date().toISOString()
    },
    {
      id: "6",
      name: "Men's Running Shoes",
      price: 79.99,
      rating: 4.3,
      reviewCount: 67,
      category: "clothing",
      images: ["/products/shoes.jpg"],
      providerName: "ActiveStep",
      providerAvatar: "/placeholder.svg",
      providerId: "provider6",
      description: "Lightweight running shoes with cushioned soles.",
      featured: false,
      inStock: true,
      createdAt: new Date().toISOString()
    }
  ];

  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        {/* Left sidebar - Categories */}
        <div className="w-full md:w-64 space-y-6">
          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                    category === cat.id
                      ? "bg-servie/10 text-servie font-medium"
                      : "hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            {/* Price range filter would go here */}
            <div className="text-sm text-muted-foreground">
              Price filtering coming soon
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Rating</h3>
            {/* Rating filter would go here */}
            <div className="text-sm text-muted-foreground">
              Rating filtering coming soon
            </div>
          </div>

          {isAuthenticated && (
            <div className="mt-8">
              <Button 
                onClick={() => navigate("/dashboard/seller")} 
                variant="outline" 
                className="w-full"
              >
                Sell Your Products
              </Button>
            </div>
          )}

          {realtimeEnabled && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-2">
              <p className="text-xs text-green-700">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Real-time updates active
              </p>
            </div>
          )}
        </div>
        
        {/* Main content - Product grid */}
        <div className="flex-1">
          {/* Search and sort controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            
            <div className="w-full md:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Results count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading products..." : `Showing ${products.length} products`}
              {!loading && (
                <Button variant="ghost" size="sm" className="ml-2" onClick={fetchProducts}>
                  <Loader2 className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
            </p>
          </div>
          
          {/* Product grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Button onClick={() => {
                setCategory('all');
                setSearchQuery('');
              }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
