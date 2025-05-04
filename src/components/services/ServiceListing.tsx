
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Star, Filter, Grid, List, Clock } from "lucide-react";
import { ServiceCard } from "@/components/ServiceCard";

// Mock service data (in a real app this would come from an API)
const mockServices = [
  {
    id: "serv1",
    title: "Professional Home Cleaning",
    description: "Comprehensive cleaning service for homes and apartments. Our professional cleaners ensure every corner of your home is spotless.",
    price: 50,
    price_type: "hourly",
    category: "home-cleaning",
    location: "New York, NY",
    provider: {
      id: "prov1",
      name: "CleanPro Services",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      rating: 4.9,
      reviewCount: 124
    },
    rating: 4.9,
    reviewCount: 124,
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: true,
    responseTime: "Under 1 hour",
    createdAt: "2025-05-01T10:00:00Z"
  },
  {
    id: "serv2",
    title: "Professional Plumbing Services",
    description: "Expert plumbing services for residential and commercial properties. Fixing leaks, installations, and emergency repairs.",
    price: 75,
    price_type: "hourly",
    category: "plumbing",
    location: "Los Angeles, CA",
    provider: {
      id: "prov2",
      name: "Fast Fix Plumbing",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      rating: 4.7,
      reviewCount: 98
    },
    rating: 4.7,
    reviewCount: 98,
    images: ["https://images.unsplash.com/photo-1606274741559-d3a3b00ad0bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: false,
    responseTime: "Under 30 minutes",
    createdAt: "2025-04-28T14:30:00Z"
  },
  {
    id: "serv3",
    title: "Math and Science Tutoring",
    description: "Personalized tutoring for students of all levels in mathematics and sciences. Improve grades and build confidence.",
    price: 40,
    price_type: "hourly",
    category: "education",
    location: "Chicago, IL",
    provider: {
      id: "prov3",
      name: "Academic Excellence",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      rating: 4.8,
      reviewCount: 87
    },
    rating: 4.8,
    reviewCount: 87,
    images: ["https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: true,
    responseTime: "Within 2 hours",
    createdAt: "2025-05-02T11:15:00Z"
  },
  {
    id: "serv4",
    title: "Tax Preparation and Advisory",
    description: "Professional tax preparation services for individuals and small businesses. Maximize refunds and ensure compliance.",
    price: 150,
    price_type: "fixed",
    category: "financial",
    location: "Remote",
    provider: {
      id: "prov4",
      name: "TaxPro Advisors",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      rating: 4.9,
      reviewCount: 156
    },
    rating: 4.9,
    reviewCount: 156,
    images: ["https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: true,
    responseTime: "Same day",
    createdAt: "2025-04-15T09:00:00Z"
  },
  {
    id: "serv5",
    title: "Website Design and Development",
    description: "Custom website design and development services. Modern, responsive websites for businesses and personal brands.",
    price: 500,
    price_type: "fixed",
    category: "tech",
    location: "Remote",
    provider: {
      id: "prov5",
      name: "Creative Digital Solutions",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      rating: 4.6,
      reviewCount: 92
    },
    rating: 4.6,
    reviewCount: 92,
    images: ["https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: false,
    responseTime: "Within 24 hours",
    createdAt: "2025-04-20T13:45:00Z"
  },
  {
    id: "serv6",
    title: "Personal Training Sessions",
    description: "Personalized fitness training sessions tailored to your health goals. In-person or virtual sessions available.",
    price: 60,
    price_type: "hourly",
    category: "fitness",
    location: "Miami, FL",
    provider: {
      id: "prov6",
      name: "FitLife Trainers",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      rating: 4.8,
      reviewCount: 115
    },
    rating: 4.8,
    reviewCount: 115,
    images: ["https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    featured: true,
    responseTime: "Under 1 hour",
    createdAt: "2025-05-03T15:30:00Z"
  }
];

// Category definitions
const categories = [
  { id: "all", name: "All Categories" },
  { id: "home-cleaning", name: "Home Cleaning" },
  { id: "plumbing", name: "Plumbing" },
  { id: "education", name: "Education" },
  { id: "financial", name: "Financial Services" },
  { id: "tech", name: "Tech Services" },
  { id: "fitness", name: "Health & Fitness" }
];

interface ServiceListingProps {
  initialCategory?: string;
  initialSearch?: string;
}

export default function ServiceListing({ initialCategory = "all", initialSearch = "" }: ServiceListingProps) {
  // State
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState(mockServices);
  
  // Filter services based on search query, category, and location
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !location || service.location.toLowerCase().includes(location.toLowerCase());
    
    return matchesCategory && matchesSearch && matchesLocation;
  });
  
  // Sort services based on selected sort option
  const sortedServices = [...filteredServices].sort((a, b) => {
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
  }, [selectedCategory, searchQuery, location, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already handled by state updates
  };

  return (
    <div className="container px-4 py-10">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Services</h1>
        <p className="text-muted-foreground">
          Discover and book top-rated service providers in your area
        </p>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-card border rounded-lg p-4 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="What service are you looking for?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Location" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="flex-grow">
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
                    <Grid className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center gap-1">
                    <List className="w-4 h-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-servie hover:bg-servie-600">
              Find Services
            </Button>
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
      
      {/* Service Grid/List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : sortedServices.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium mb-2">No services found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
          <Button onClick={() => {
            setSelectedCategory("all");
            setSearchQuery("");
            setLocation("");
          }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className={
          view === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "flex flex-col gap-4"
        }>
          {sortedServices.map((service) => (
            <Link key={service.id} to={`/services/${service.id}`}>
              <Card className={`overflow-hidden h-full transition-all hover:shadow-md ${view === 'list' ? 'flex flex-row' : ''}`}>
                <div className={`${view === 'list' ? 'w-1/3' : ''}`}>
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="object-cover w-full h-full"
                    />
                    {service.featured && (
                      <Badge className="absolute top-2 right-2 bg-servie">Featured</Badge>
                    )}
                  </div>
                </div>
                
                <div className={`${view === 'list' ? 'w-2/3' : ''}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="line-clamp-1">{service.title}</CardTitle>
                        <CardDescription>{service.location}</CardDescription>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{service.rating}</span>
                        <span className="text-muted-foreground ml-1">({service.reviewCount})</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2">{service.description}</p>
                    
                    <div className="flex items-center mt-4">
                      <img
                        src={service.provider.avatar}
                        alt={service.provider.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="font-medium">{service.provider.name}</span>
                    </div>
                    
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Response time: {service.responseTime}</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between items-center">
                    <div className="font-bold text-lg">
                      ${service.price}{service.price_type === 'hourly' ? '/hr' : ''}
                    </div>
                    <Button size="sm">View Details</Button>
                  </CardFooter>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
      
      {/* Load More Button */}
      {sortedServices.length > 0 && (
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More Services
          </Button>
        </div>
      )}
    </div>
  );
}
