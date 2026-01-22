import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ServiceCard from "@/components/ServiceCard";
import { Search } from "lucide-react";
import { serviceAPI } from "@/services/serviceAPI";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function ServiceListing({ initialCategory = 'all', initialSearch = '' }) {
  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category') || 'all';
    const searchParam = params.get('search') || '';

    setCategory(categoryParam);
    setSearchQuery(searchParam);
  }, [location.search]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const data = await serviceAPI.getServices();

        let filteredData = data || [];
        if (searchQuery) {
          filteredData = filteredData.filter((service: any) =>
            service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        const servicesWithDetails = await Promise.all(
          filteredData.map(async (service: any) => {
            const profileRes: any = await supabase
              // Use sanitized public profiles table to avoid exposing sensitive fields
              .from('public_profiles')
              .select('first_name, last_name, business_name, avatar_url')
              .eq('id', service.provider_id)
              .maybeSingle();
            
            const imagesRes: any = await supabase
              .from('service_images')
              .select('url, is_primary')
              .eq('service_id', service.id);

            return {
              ...service,
              profiles: profileRes.data,
              service_images: imagesRes.data || []
            };
          })
        );

        setServices(servicesWithDetails);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
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

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for services..."
              className="pl-10 pr-4 py-2 w-full"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Button type="submit" className="ml-2 whitespace-nowrap">Search</Button>
        </form>

        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No services found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search or browse all services
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service: any) => {
            const primaryImage = service.service_images?.find((img: any) => img.is_primary)?.url 
              || service.service_images?.[0]?.url 
              || '/placeholder.svg';
            const providerName = service.profiles?.business_name 
              || `${service.profiles?.first_name || ''} ${service.profiles?.last_name || ''}`.trim()
              || 'Service Provider';

            return (
              <ServiceCard 
                key={service.id}
                id={service.id}
                title={service.title}
                category={service.category_id || 'general'}
                imageUrl={primaryImage}
                providerName={providerName}
                providerAvatar={service.profiles?.avatar_url || '/placeholder.svg'}
                rating={4.5}
                reviewCount={0}
                price={service.price}
                currency="$"
                featured={service.featured}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
