
import { Link } from "react-router-dom";
import ServieIcon from "@/components/ServieIcon";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import AnimatedSearchInput from "./AnimatedSearchInput";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  
  const popularSearches = [
    "Home Cleaning",
    "Plumbing",
    "Tutoring",
    "Tax Preparation",
    "Web Design",
    "Personal Training"
  ];
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail) {
      return toast.error("Please enter your email address");
    }
    toast.success(`Thank you for subscribing with ${subscribeEmail}!`);
    setSubscribeEmail("");
  };
  
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
    navigate(`/categories?search=${encodeURIComponent(term)}`);
  };

  return (
    <section id="hero" className="relative py-16 md:py-24 overflow-hidden">
      {/* Animated gradient background with red tones */}
      <div 
        className="absolute inset-0 -z-10 bg-gradient-to-br from-servie/30 via-servie/10 to-background/50 animate-gradient"
        style={{
          backgroundSize: "400% 400%",
          animation: "gradientAnimation 15s ease infinite"
        }}
      />
      
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="dotted-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotted-pattern)" />
        </svg>
      </div>

      <div className="container px-4 md:px-6 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative">
          {/* App logo/icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-servie/10 flex items-center justify-center mb-6">
            <ServieIcon className="w-8 h-8 text-servie" />
          </div>

          {/* Main hero text */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in">
              Find The Perfect Service Provider For Your Needs
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl animate-fade-in">
              Connect with top professionals and skilled service providers in your area
            </p>
          </div>

          {/* Enhanced Search Section */}
          <div className="w-full max-w-2xl mx-auto bg-white/90 dark:bg-gray-800/90 p-4 rounded-xl shadow-lg animate-fade-in">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
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
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularSearch(term)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm hover:bg-servie/10 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button asChild size="lg" className="bg-servie text-white hover:bg-servie-600">
              <Link to="/categories">Browse Services</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/shop">Shop Products</Link>
            </Button>
          </div>

          {/* Trusted by section */}
          <div className="mt-16 animate-fade-in">
            <p className="text-sm text-muted-foreground mb-6">Trusted by over 10,000+ customers</p>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              {[
                { name: "Alpha", icon: "🏢" },
                { name: "Bravo", icon: "🚀" },
                { name: "Charlie", icon: "⚡" },
                { name: "Delta", icon: "🛠️" },
                { name: "Echo", icon: "🔍" }
              ].map((company) => (
                <div key={company.name} className="flex items-center text-xl font-semibold tracking-tight">
                  <span className="mr-2 text-2xl">{company.icon}</span>
                  {company.name} <span className="text-servie ml-1">Co.</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
