
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function SearchSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  
  const popularSearches = [
    "Home Cleaning",
    "Plumbing",
    "Tutoring",
    "Tax Preparation",
    "Web Design",
    "Personal Training"
  ];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    
    // Navigate to search results
    navigate(`/categories?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
  };
  
  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    navigate(`/categories?search=${encodeURIComponent(term)}`);
  };

  return (
    <section id="search" className="py-16 bg-white dark:bg-gray-950">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Find The Perfect Service</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Search from thousands of professional service providers in your area
          </p>
        </div>
        
        <Card className="max-w-4xl mx-auto border-0 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="What service are you looking for?"
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
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
                  Find Services
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularSearch(term)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-servie/10 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
