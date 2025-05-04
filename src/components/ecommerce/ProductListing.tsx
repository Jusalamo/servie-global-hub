import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/ecommerce/ProductCard";
import { Search } from "lucide-react";

export default function ProductListing({ initialCategory = 'all', initialSearch = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Mock categories
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

  // Mock products data
  const mockProducts = [
    {
      id: 1,
      title: "Wireless Bluetooth Earbuds",
      price: 49.99,
      rating: 4.5,
      reviewCount: 128,
      category: "electronics",
      image: "/products/earbuds.jpg",
      seller: "AudioTech",
      description: "High-quality wireless earbuds with noise cancellation."
    },
    {
      id: 2,
      title: "Smart Home Security Camera",
      price: 89.99,
      rating: 4.2,
      reviewCount: 75,
      category: "electronics",
      image: "/products/camera.jpg",
      seller: "SecureView",
      description: "HD security camera with motion detection and night vision."
    },
    {
      id: 3,
      title: "Ergonomic Office Chair",
      price: 199.99,
      rating: 4.7,
      reviewCount: 42,
      category: "home",
      image: "/products/chair.jpg",
      seller: "ComfortPlus",
      description: "Adjustable office chair with lumbar support."
    },
    {
      id: 4,
      title: "Non-Stick Cookware Set",
      price: 129.99,
      rating: 4.4,
      reviewCount: 89,
      category: "home",
      image: "/products/cookware.jpg",
      seller: "KitchenPro",
      description: "10-piece non-stick cookware set for all cooking needs."
    },
    {
      id: 5,
      title: "Organic Face Serum",
      price: 34.99,
      rating: 4.8,
      reviewCount: 156,
      category: "beauty",
      image: "/products/serum.jpg",
      seller: "NaturalGlow",
      description: "Hydrating face serum with vitamin C and hyaluronic acid."
    },
    {
      id: 6,
      title: "Men's Running Shoes",
      price: 79.99,
      rating: 4.3,
      reviewCount: 67,
      category: "clothing",
      image: "/products/shoes.jpg",
      seller: "ActiveStep",
      description: "Lightweight running shoes with cushioned soles."
    },
    {
      id: 7,
      title: "Cordless Drill Set",
      price: 149.99,
      rating: 4.6,
      reviewCount: 93,
      category: "tools",
      image: "/products/drill.jpg",
      seller: "PowerTools",
      description: "20V cordless drill with multiple attachments and carrying case."
    },
    {
      id: 8,
      title: "Yoga Mat",
      price: 29.99,
      rating: 4.5,
      reviewCount: 112,
      category: "sports",
      image: "/products/yoga-mat.jpg",
      seller: "ZenFitness",
      description: "Non-slip yoga mat with alignment markings."
    },
    {
      id: 9,
      title: "Building Blocks Set",
      price: 39.99,
      rating: 4.7,
      reviewCount: 78,
      category: "toys",
      image: "/products/blocks.jpg",
      seller: "CreativeKids",
      description: "Educational building blocks set with 100+ pieces."
    },
    {
      id: 10,
      title: "Smart Watch",
      price: 159.99,
      rating: 4.4,
      reviewCount: 203,
      category: "electronics",
      image: "/products/smartwatch.jpg",
      seller: "TechWear",
      description: "Fitness tracker and smartwatch with heart rate monitoring."
    },
    {
      id: 11,
      title: "Blender",
      price: 69.99,
      rating: 4.3,
      reviewCount: 87,
      category: "home",
      image: "/products/blender.jpg",
      seller: "KitchenPro",
      description: "High-speed blender for smoothies and food processing."
    },
    {
      id: 12,
      title: "Moisturizing Cream",
      price: 24.99,
      rating: 4.6,
      reviewCount: 134,
      category: "beauty",
      image: "/products/cream.jpg",
      seller: "NaturalGlow",
      description: "24-hour hydrating face and body cream."
    }
  ];

  // Filter and sort products
  useEffect(() => {
    setLoading(true);
    
    // Update URL with current filters
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (searchQuery) params.set('search', searchQuery);
    
    const newUrl = `${location.pathname}?${params.toString()}`;
    navigate(newUrl, { replace: true });
    
    // Filter products based on category and search query
    let filteredProducts = [...mockProducts];
    
    if (category !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.title.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.seller.toLowerCase().includes(query)
      );
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        // Keep original order for featured
        break;
    }
    
    // Simulate API delay
    setTimeout(() => {
      setProducts(filteredProducts);
      setLoading(false);
    }, 500);
  }, [category, searchQuery, sortBy, navigate, location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
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
