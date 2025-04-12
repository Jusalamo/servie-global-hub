
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchIcon, FilterIcon } from "lucide-react";
import { services, categories } from "@/data/mockData";

const ServiceCategories = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter services based on selected category and search query
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = service.price >= priceRange[0] && service.price <= priceRange[1];
    
    return matchesCategory && matchesSearch && matchesPrice;
  });
  
  // Sort services based on selected sort option
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        // Default to relevance (featured first)
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {selectedCategory === "all" ? "All Services" : selectedCategory}
          </h1>
          <p className="text-muted-foreground">
            Find the perfect service for your needs
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Section - Desktop */}
          <div className="hidden lg:block w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="all" 
                    checked={selectedCategory === "all"} 
                    onCheckedChange={() => setSelectedCategory("all")}
                  />
                  <Label htmlFor="all">All Categories</Label>
                </div>
                {categories.map(category => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={category.id} 
                      checked={selectedCategory === category.name} 
                      onCheckedChange={() => setSelectedCategory(category.name)}
                    />
                    <Label htmlFor={category.id}>{category.name}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Price Range</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Slider
                  defaultValue={[0, 1000]}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={(value: [number, number]) => setPriceRange(value)}
                  className="my-6"
                />
                <div className="flex justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  placeholder="Search services..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                className="lg:hidden flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterIcon size={18} />
                Filters
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mb-6 p-4 border rounded-lg bg-background">
                <h3 className="text-lg font-medium mb-4">Filters</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Categories</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="mobile-all" 
                          checked={selectedCategory === "all"} 
                          onCheckedChange={() => setSelectedCategory("all")}
                        />
                        <Label htmlFor="mobile-all">All Categories</Label>
                      </div>
                      {categories.map(category => (
                        <div key={`mobile-${category.id}`} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`mobile-${category.id}`}
                            checked={selectedCategory === category.name} 
                            onCheckedChange={() => setSelectedCategory(category.name)}
                          />
                          <Label htmlFor={`mobile-${category.id}`}>{category.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Price Range</h4>
                    <Slider
                      defaultValue={[0, 1000]}
                      max={1000}
                      step={10}
                      value={priceRange}
                      onValueChange={(value: [number, number]) => setPriceRange(value)}
                      className="my-6"
                    />
                    <div className="flex justify-between">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            )}
            
            {/* Service Grid */}
            {sortedServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedServices.map(service => (
                  <ServiceCard
                    key={service.id}
                    id={service.id}
                    title={service.title}
                    category={service.category}
                    imageUrl={service.imageUrl}
                    providerName={service.providerName}
                    providerAvatar={service.providerAvatar}
                    rating={service.rating}
                    reviewCount={service.reviewCount}
                    price={service.price}
                    currency={service.currency}
                    featured={service.featured}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No services found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceCategories;
