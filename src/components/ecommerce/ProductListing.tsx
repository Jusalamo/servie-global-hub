
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Grid, List } from "lucide-react";

// Mock product data (in a real app this would come from an API)
const mockProducts = [
  {
    id: "prod1",
    name: "Professional Cleaning Kit",
    description: "Complete kit with eco-friendly cleaning supplies for professionals.",
    price: 79.99,
    category: "cleaning-supplies",
    rating: 4.8,
    reviewCount: 45,
    images: ["https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: true,
    inStock: true,
    createdAt: "2025-05-01T10:00:00Z"
  },
  {
    id: "prod2",
    name: "Microfiber Cleaning Cloths (24-Pack)",
    description: "High-quality microfiber cloths for streak-free cleaning of all surfaces.",
    price: 19.99,
    category: "cleaning-supplies",
    rating: 4.9,
    reviewCount: 128,
    images: ["https://images.unsplash.com/photo-1583907659441-addbe699e921?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: false,
    inStock: true,
    createdAt: "2025-04-15T14:30:00Z"
  },
  {
    id: "prod3",
    name: "Professional Tool Set",
    description: "Complete toolkit for professional contractors and home DIY enthusiasts.",
    price: 149.99,
    category: "tools",
    rating: 4.7,
    reviewCount: 89,
    images: ["https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: true,
    inStock: true,
    createdAt: "2025-05-02T09:15:00Z"
  },
  {
    id: "prod4",
    name: "Premium Hair Styling Kit",
    description: "Professional-grade styling tools for salon-quality results at home.",
    price: 129.99,
    category: "beauty",
    rating: 4.6,
    reviewCount: 62,
    images: ["https://images.unsplash.com/photo-1522338242992-e1a54906a8da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: false,
    inStock: true,
    createdAt: "2025-04-28T16:45:00Z"
  },
  {
    id: "prod5",
    name: "Accounting Software License (1 Year)",
    description: "Professional accounting software for small businesses and freelancers.",
    price: 199.99,
    category: "software",
    rating: 4.5,
    reviewCount: 37,
    images: ["https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: true,
    inStock: true,
    createdAt: "2025-05-03T11:20:00Z"
  },
  {
    id: "prod6",
    name: "Tutoring Curriculum Bundle",
    description: "Comprehensive educational materials for tutors and educators.",
    price: 89.99,
    category: "education",
    rating: 4.8,
    reviewCount: 41,
    images: ["https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: false,
    inStock: true,
    createdAt: "2025-04-20T13:10:00Z"
  }
];

// Category definitions
const categories = [
  { id: "all", name: "All Categories" },
  { id: "cleaning-supplies", name: "Cleaning Supplies" },
  { id: "tools", name: "Tools & Equipment" },
  { id: "beauty", name: "Beauty & Personal Care" },
  { id: "software", name: "Software & Digital" },
  { id: "education", name: "Educational Materials" }
];

interface ProductListingProps {
  initialCategory?: string;
  initialSearch?: string;
}

export default function ProductListing({ initialCategory = "all", initialSearch = "" }: ProductListingProps) {
  // State
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState(mockProducts);
  
  // Filter products based on search query and category
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "rating":
        return b.rating - a.rating;
      default:
        return b.featured ? 1 : -1; // Featured items first
    }
  });

  // Simulate loading when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already handled by state updates
  };

  return (
    <div className="container px-4 py-10">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shop Products</h1>
        <p className="text-muted-foreground">
          Browse and purchase professional tools and materials from our marketplace
        </p>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-card border rounded-lg p-4 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="rating">Best Rating</SelectItem>
              </SelectContent>
            </Select>
            
            <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "list")} className="hidden md:block">
              <TabsList>
                <TabsTrigger value="grid" className="flex items-center gap-1">
                  <Grid className="w-4 h-4" /> Grid
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-1">
                  <List className="w-4 h-4" /> List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </form>
      </div>
      
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button 
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
      
      {/* Product Grid/List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
          <Button onClick={() => {
            setSelectedCategory("all");
            setSearchQuery("");
          }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className={
          view === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
            : "flex flex-col gap-4"
        }>
          {sortedProducts.map((product) => (
            <ProductCard 
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.images[0],
                rating: product.rating,
                reviewCount: product.reviewCount,
                category: categories.find(c => c.id === product.category)?.name || product.category
              }}
              layout={view}
            />
          ))}
        </div>
      )}
      
      {/* Load More Button */}
      {sortedProducts.length > 0 && (
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      )}
    </div>
  );
}
