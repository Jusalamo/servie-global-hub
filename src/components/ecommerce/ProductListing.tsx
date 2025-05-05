
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard, type Product } from "@/components/ecommerce/ProductCard";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useProductData } from "@/hooks/useProductData";

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
  const { mockProducts } = useProductData();
  
  // Mock categories - in production, these would come from the database
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'cat1', name: 'Tools' },
    { id: 'cat2', name: 'Gardening' },
    { id: 'cat3', name: 'Cleaning' },
    { id: 'cat4', name: 'Home Decor' },
    { id: 'cat5', name: 'Electronics' },
  ];

  // Enable mock realtime updates
  useEffect(() => {
    // Simulate real-time setup
    const timeout = setTimeout(() => {
      setRealtimeEnabled(true);
      console.log('Mock realtime subscription active for products');
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  // Fetch products using mock data
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Update URL with current filters
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      if (searchQuery) params.set('search', searchQuery);
      
      const newUrl = `${location.pathname}?${params.toString()}`;
      navigate(newUrl, { replace: true });
      
      // Use mock data as our source
      setProducts(filterMockProducts());
      
      // Simulate network delay
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      setProducts([]);
      setLoading(false);
    }
  };
  
  // Filter mock products based on current filters
  const filterMockProducts = () => {
    let filtered = [...(mockProducts || [])];
    
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        });
        break;
    }
    
    return filtered;
  };

  // Load products when filters change
  useEffect(() => {
    fetchProducts();
  }, [category, sortBy]);
  
  // Only trigger search when explicitly submitted
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

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
