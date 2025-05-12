
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Package, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { useProductData } from '@/hooks/useProductData';

export default function SearchSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<{
    services: string[];
    products: string[];
  }>({
    services: [],
    products: []
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { products } = useProductData();
  
  const popularSearches = [
    "Home Cleaning",
    "Plumbing",
    "Tutoring",
    "Tax Preparation",
    "Web Design",
    "Personal Training"
  ];
  
  const popularProducts = [
    "Professional Tool Kit",
    "Premium Gardening Set",
    "Advanced Home Cleaning Kit",
    "Smart Home Starter Kit",
    "Modern Wall Art Collection"
  ];
  
  useEffect(() => {
    // Filter services and products based on search query
    if (searchQuery.trim().length > 1) {
      const filteredServices = popularSearches.filter(service => 
        service.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      const filteredProducts = products
        .filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(product => product.name);
      
      setSearchSuggestions({
        services: filteredServices.slice(0, 5),
        products: filteredProducts.slice(0, 5)
      });
      
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, products]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    
    // Navigate to search results
    navigate(`/categories?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
    setShowSuggestions(false);
  };
  
  const handleSuggestionClick = (term: string, type: 'service' | 'product') => {
    setSearchQuery(term);
    setShowSuggestions(false);
    
    if (type === 'service') {
      navigate(`/categories?search=${encodeURIComponent(term)}&location=${encodeURIComponent(location)}`);
    } else {
      navigate(`/shop?search=${encodeURIComponent(term)}`);
    }
  };

  return (
    <section id="search" className="py-16 bg-white dark:bg-gray-950">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Find The Perfect Service</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Search from thousands of professional service providers and products in your area
          </p>
        </div>
        
        <Card className="max-w-4xl mx-auto border-0 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="What service or product are you looking for?"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  
                  {/* Search suggestions dropdown */}
                  {showSuggestions && (searchSuggestions.services.length > 0 || searchSuggestions.products.length > 0) && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 shadow-lg rounded-md border border-gray-200 dark:border-gray-800 max-h-64 overflow-y-auto">
                      {searchSuggestions.services.length > 0 && (
                        <div className="p-2">
                          <h3 className="text-xs text-muted-foreground flex items-center">
                            <Wrench className="h-3 w-3 mr-1" /> Services
                          </h3>
                          <ul className="mt-1">
                            {searchSuggestions.services.map((service, idx) => (
                              <li 
                                key={`service-${idx}`} 
                                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm cursor-pointer text-sm"
                                onMouseDown={() => handleSuggestionClick(service, 'service')}
                              >
                                {service}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {searchSuggestions.products.length > 0 && (
                        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                          <h3 className="text-xs text-muted-foreground flex items-center">
                            <Package className="h-3 w-3 mr-1" /> Products
                          </h3>
                          <ul className="mt-1">
                            {searchSuggestions.products.map((product, idx) => (
                              <li 
                                key={`product-${idx}`} 
                                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm cursor-pointer text-sm"
                                onMouseDown={() => handleSuggestionClick(product, 'product')}
                              >
                                {product}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Location"
                    className="pl-10"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button type="submit" className="bg-servie hover:bg-servie-600 w-full md:w-auto">
                  Find Services & Products
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, index) => (
                  <button
                    key={`service-${index}`}
                    onClick={() => handleSuggestionClick(term, 'service')}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-servie/10 transition-colors"
                  >
                    <Wrench className="h-3 w-3 inline mr-1" /> {term}
                  </button>
                )).slice(0, 3)}
                
                {popularProducts.map((term, index) => (
                  <button
                    key={`product-${index}`}
                    onClick={() => handleSuggestionClick(term, 'product')}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-servie/10 transition-colors"
                  >
                    <Package className="h-3 w-3 inline mr-1" /> {term}
                  </button>
                )).slice(0, 3)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
