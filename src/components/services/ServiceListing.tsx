
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ServiceCard from "@/components/ServiceCard";
import { Search } from "lucide-react";

export default function ServiceListing({ initialCategory = 'all', initialSearch = '' }) {
  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Update category and search query based on URL parameters
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category') || 'all';
    const searchParam = params.get('search') || '';

    setCategory(categoryParam);
    setSearchQuery(searchParam);
  }, [location.search]);

  useEffect(() => {
    // Fetch services based on category and search query
    // Replace this with your actual data fetching logic
    const fetchServices = async () => {
      // Simulate fetching data from an API
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredServices = [
        { id: 1, name: "Home Cleaning", category: "home-services", description: "Professional home cleaning services", price: 50, image: '/placeholder.svg' },
        { id: 2, name: "Web Design", category: "tech", description: "Custom web design services", price: 500, image: '/placeholder.svg' },
        { id: 3, name: "Plumbing", category: "home-services", description: "Reliable plumbing services", price: 75, image: '/placeholder.svg' },
        { id: 4, name: "Personal Training", category: "health", description: "One-on-one personal training", price: 40, image: '/placeholder.svg' },
        { id: 5, name: "Tax Preparation", category: "professional", description: "Expert tax preparation services", price: 150, image: '/placeholder.svg' },
        { id: 6, name: "Tutoring", category: "education", description: "Personalized tutoring services", price: 30, image: '/placeholder.svg' },
      ];

      if (category !== 'all') {
        filteredServices = filteredServices.filter(service => service.category === category);
      }

      if (searchQuery) {
        filteredServices = filteredServices.filter(service =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setServices(filteredServices);
    };

    fetchServices();
  }, [category, searchQuery]);

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(location.search);
    params.set('category', value);
    navigate(`/categories?${params.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    params.set('search', searchQuery);
    navigate(`/categories?${params.toString()}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Find Services</h1>

      <div className="flex items-center justify-between mb-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for services..."
              className="pl-10 pr-4 py-2"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Button type="submit" className="ml-2">Search</Button>
        </form>

        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="home-services">Home Services</SelectItem>
            <SelectItem value="tech">Tech & Digital</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="health">Health & Wellness</SelectItem>
            <SelectItem value="personal-care">Personal Care</SelectItem>
            <SelectItem value="events">Events</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(service => (
          <ServiceCard 
            key={service.id}
            id={String(service.id)}
            title={service.name}
            category={service.category}
            imageUrl={service.image}
            providerName="Service Provider"
            providerAvatar="/placeholder.svg"
            rating={4.5}
            reviewCount={10}
            price={service.price}
            currency="$"
            featured={false}
          />
        ))}
      </div>
    </div>
  );
}
