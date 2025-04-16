
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "./ui/ThemeProvider";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const popularSearches = [
    "Home Cleaning", 
    "Web Development", 
    "Electrical Repairs", 
    "Tutoring", 
    "Graphic Design"
  ];
  
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (searchQuery.trim()) {
      toast.info("Searching for services", {
        description: `Looking for "${searchQuery}" services`
      });
      navigate(`/categories?search=${encodeURIComponent(searchQuery)}${location ? `&location=${encodeURIComponent(location)}` : ''}`);
    } else {
      toast.warning("Please enter a search term");
    }
  };

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    toast.info(`Searching for ${term}`, {
      description: "Finding the best service providers"
    });
    navigate(`/categories?search=${encodeURIComponent(term)}`);
  };

  const handleScrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerOffset = 100; // Adjust for header height
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative py-20 md:py-24 overflow-hidden" id="hero-section">
      {/* Video Background - contained within this section only */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="h-full w-full object-cover absolute"
        >
          <source src="https://player.vimeo.com/external/370331493.hd.mp4?s=fbf419fc059d21e0e8f53a3f6e538121805df2f1&profile_id=175" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
              Find Expert Services for Any Task
            </h1>
            <p className="text-white/90 md:text-xl">
              Connect with skilled professionals across Africa and globally. Get quotes, book services, and get things done - all in one platform.
            </p>
          </div>
          <form onSubmit={handleSearch} className="space-y-4 mt-8">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="What service are you looking for?"
                  className="pl-10 rounded-full w-full bg-white/95"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative flex-1 md:max-w-[220px]">
                <MapPin className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Location (optional)"
                  className="pl-10 rounded-full w-full bg-white/95"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="rounded-full bg-servie hover:bg-servie-600">
                Search
              </Button>
            </div>
          </form>
          <div className="flex flex-wrap gap-2 text-sm text-white/80 justify-center mt-4">
            <span>Popular:</span>
            {popularSearches.map((term) => (
              <button 
                key={term} 
                className="underline hover:text-white transition-colors"
                onClick={() => handlePopularSearch(term)}
              >
                {term}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-6 justify-center">
            <div className="flex items-center text-sm text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white mr-2">10K+</span>
              <span>Verified Providers</span>
            </div>
            <div className="flex items-center text-sm text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white mr-2">4.8</span>
              <span>Average Rating</span>
            </div>
            <div className="flex items-center text-sm text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white mr-2">50+</span>
              <span>Countries Served</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-6 justify-center">
            <Button 
              variant="outline" 
              className="rounded-full border-white text-white hover:bg-white/20 bg-transparent" 
              onClick={() => handleScrollToSection('how-it-works')}
            >
              How It Works
            </Button>
            <Button 
              className="rounded-full bg-servie hover:bg-servie-600" 
              onClick={() => handleScrollToSection('become-provider')}
            >
              Become a Provider
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
