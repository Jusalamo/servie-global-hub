
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AnimatedSearchPlaceholder from "./AnimatedSearchPlaceholder";

interface AnimatedSearchInputProps {
  className?: string;
  onSearch?: (query: string) => void;
}

export default function AnimatedSearchInput({ className, onSearch }: AnimatedSearchInputProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const searchPlaceholders = [
    "Find a plumber near you...",
    "Search for web designers...",
    "Looking for home cleaning services?",
    "Need a personal trainer?",
    "Find the best photographers...",
    "Search for handmade crafts...",
    "Need an interior designer?",
    "Looking for delivery services?"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`w-full max-w-2xl mx-auto ${className || ""}`}>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-6 w-full"
          placeholder={" "} // Empty placeholder, will be replaced by animated one
        />
        {!searchQuery && (
          <div className="absolute left-10 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground">
            <AnimatedSearchPlaceholder placeholders={searchPlaceholders} interval={3000} />
          </div>
        )}
      </div>
    </form>
  );
}
