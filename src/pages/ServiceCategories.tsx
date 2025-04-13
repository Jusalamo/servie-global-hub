
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CategoryFilter from "@/components/CategoryFilter";
import { Card, CardContent } from "@/components/ui/card";
import { SearchIcon, FilterIcon, LayoutGrid, List, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category?: {
    name: string;
  };
  provider?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  location?: string;
  response_time?: string;
  featured?: boolean;
  reviews?: {
    rating: number;
    count: number;
  };
  primary_image?: string;
}

const ServiceCategories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Extract filters from URL
  const categoryParam = searchParams.get("category");
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const ratingParam = searchParams.get("rating");
  
  useEffect(() => {
    async function fetchServices() {
      setIsLoading(true);
      setError(null);
      
      try {
        let query = supabase
          .from('services')
          .select(`
            id,
            title,
            description,
            price,
            location,
            response_time,
            featured,
            provider_id,
            category_id,
            category:service_categories(name),
            provider:profiles(first_name, last_name, avatar_url)
          `);
        
        // Apply category filter if present
        if (categoryParam) {
          query = query.eq('category.name', categoryParam);
        }
        
        // Apply price range filter if present
        if (minPriceParam) {
          query = query.gte('price', minPriceParam);
        }
        
        if (maxPriceParam) {
          query = query.lte('price', maxPriceParam);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching services:", error);
          setError("Failed to load services. Please try again later.");
          toast.error("Failed to load services");
        } else if (data) {
          // For each service, fetch its primary image and average rating
          const servicesWithMetadata = await Promise.all(
            data.map(async (service) => {
              // Get primary image
              const { data: imageData } = await supabase
                .from('service_images')
                .select('url')
                .eq('service_id', service.id)
                .eq('is_primary', true)
                .single();
              
              // Get average rating and count
              const { data: reviewData, error: reviewError } = await supabase
                .from('reviews')
                .select('rating')
                .eq('service_id', service.id);
              
              let avgRating = 0;
              let reviewCount = 0;
              
              if (!reviewError && reviewData && reviewData.length > 0) {
                avgRating = reviewData.reduce((sum, review) => sum + review.rating, 0) / reviewData.length;
                reviewCount = reviewData.length;
              }
              
              return {
                ...service,
                primary_image: imageData?.url || '/placeholder.svg',
                reviews: {
                  rating: avgRating,
                  count: reviewCount
                }
              };
            })
          );
          
          setServices(servicesWithMetadata);
          setFilteredServices(servicesWithMetadata);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred. Please try again later.");
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchServices();
  }, [categoryParam, minPriceParam, maxPriceParam]);
  
  // Apply sorting and text search
  useEffect(() => {
    let filtered = [...services];
    
    // Apply text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        service => 
          service.title.toLowerCase().includes(query) || 
          service.description.toLowerCase().includes(query)
      );
    }
    
    // Apply rating filter
    if (ratingParam) {
      const ratings = ratingParam.split(',').map(r => parseInt(r));
      const minRating = Math.min(...ratings);
      filtered = filtered.filter(
        service => service.reviews?.rating >= minRating
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => 
          (b.reviews?.rating || 0) - (a.reviews?.rating || 0)
        );
        break;
      case "newest":
        // Would need created_at field for proper implementation
        // For now, just shuffle a bit
        filtered.sort(() => Math.random() - 0.5);
        break;
      default:
        // Default to relevance (featured first)
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }
    
    setFilteredServices(filtered);
  }, [services, searchQuery, sortBy, ratingParam]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchParams.set("query", searchQuery);
    setSearchParams(searchParams);
  };
  
  const handleFilterChange = (filters: any) => {
    // This will be called when CategoryFilter component updates filters
    console.log("Filter changed:", filters);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {categoryParam || "All Services"}
          </h1>
          <p className="text-muted-foreground">
            Find the perfect service for your needs
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Section - Desktop */}
          <div className="hidden lg:block w-64 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <CategoryFilter onFilterChange={handleFilterChange} />
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <form onSubmit={handleSearch} className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  placeholder="Search services..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Button type="submit" className="sr-only">Search</Button>
              </form>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="lg:hidden flex items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FilterIcon size={18} />
                  Filters
                </Button>
                
                <div className="flex border rounded-md overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setViewMode("grid")}
                    title="Grid view"
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={18} />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setViewMode("list")}
                    title="List view"
                    aria-label="List view"
                  >
                    <List size={18} />
                  </Button>
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mb-6 p-4 border rounded-lg bg-background">
                <CategoryFilter onFilterChange={handleFilterChange} />
              </div>
            )}
            
            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-10 w-10 text-servie animate-spin" />
                <p className="text-muted-foreground">Loading services...</p>
              </div>
            )}
            
            {/* Error state */}
            {error && (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            )}
            
            {/* Empty state */}
            {!isLoading && !error && filteredServices.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No services found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button 
                  onClick={() => {
                    setSearchParams({});
                    setSearchQuery("");
                  }} 
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
            
            {/* Service Grid */}
            {!isLoading && !error && filteredServices.length > 0 && (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Showing {filteredServices.length} services
                </p>
                
                <div 
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredServices.map(service => (
                    <ServiceCard
                      key={service.id}
                      id={service.id}
                      title={service.title}
                      category={service.category?.name || ""}
                      imageUrl={service.primary_image || "/placeholder.svg"}
                      providerName={`${service.provider?.first_name || ""} ${service.provider?.last_name || ""}`}
                      providerAvatar={service.provider?.avatar_url || "/placeholder.svg"}
                      rating={service.reviews?.rating || 0}
                      reviewCount={service.reviews?.count || 0}
                      price={service.price}
                      featured={service.featured}
                      location={service.location || "Remote"}
                      responseTime={service.response_time || "Usually responds in 1 hour"}
                      layout={viewMode}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceCategories;
