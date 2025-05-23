
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

interface CategoryFilterProps {
  onFilterChange?: (filters: any) => void;
}

// Extended list of categories for when Supabase data isn't available
const fallbackCategories: Category[] = [
  { id: "cat1", name: "Home Services", description: "Cleaning, repairs, gardening" },
  { id: "cat2", name: "Professional Services", description: "Business, legal, consulting" },
  { id: "cat3", name: "Personal Care", description: "Beauty, wellness, styling" },
  { id: "cat4", name: "Events & Catering", description: "Event planning, catering" },
  { id: "cat5", name: "Transportation", description: "Delivery, moving, rides" },
  { id: "cat6", name: "Education & Tutoring", description: "Academic help, coaching" },
  { id: "cat7", name: "Health & Wellness", description: "Fitness, nutrition, counseling" },
  { id: "cat8", name: "Creative Services", description: "Design, writing, arts" },
  { id: "cat9", name: "Technical Support", description: "IT, computer repair" },
  { id: "cat10", name: "Craft & Artisanal", description: "Handcrafted goods, custom work" },
  { id: "cat11", name: "Digital Services", description: "Web, digital marketing, apps" },
  { id: "cat12", name: "Food & Culinary", description: "Cooking, baking, food prep" },
  { id: "cat13", name: "Shopping & Styling", description: "Personal shopping, fashion advice" },
  { id: "cat14", name: "Automotive Services", description: "Car repair, maintenance" },
  { id: "cat15", name: "Music & Entertainment", description: "Music lessons, DJ services" },
  { id: "cat16", name: "Photography & Video", description: "Professional visual services" },
  { id: "cat17", name: "Travel Services", description: "Travel planning, concierge" },
  { id: "cat18", name: "Business Consulting", description: "Strategy, marketing, finance" },
  { id: "cat19", name: "Legal & Professional", description: "Legal advice, professional services" },
  { id: "cat20", name: "Writing & Editing", description: "Content creation, editing" }
];

export default function CategoryFilter({ onFilterChange }: CategoryFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minPrice, maxPrice] = priceRange;
  const [ratings, setRatings] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Fetch categories from Supabase
  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('service_categories')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching categories:', error);
          setCategories(fallbackCategories);
        } else if (data && data.length > 0) {
          setCategories(data);
        } else {
          // Use fallback categories if no data from Supabase
          setCategories(fallbackCategories);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Handle URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rating = searchParams.get('rating');

    let newFilters: string[] = [];

    if (category) {
      setSelectedCategory(category);
      newFilters.push(`Category: ${category}`);
    }

    if (minPrice || maxPrice) {
      setPriceRange([
        minPrice ? parseInt(minPrice) : 0,
        maxPrice ? parseInt(maxPrice) : 1000
      ]);
      newFilters.push(`Price: $${minPrice || 0} - $${maxPrice || 1000}`);
    }

    if (rating) {
      const ratings = rating.split(',').map(r => parseInt(r));
      setRatings(ratings);
      newFilters.push(`Rating: ${rating.replace(',', ', ')}★`);
    }

    setActiveFilters(newFilters);
  }, [searchParams]);

  // Apply filters
  const applyFilters = () => {
    const newParams = new URLSearchParams();
    
    if (selectedCategory) {
      newParams.set('category', selectedCategory);
    }
    
    if (minPrice > 0) {
      newParams.set('minPrice', minPrice.toString());
    }
    
    if (maxPrice < 1000) {
      newParams.set('maxPrice', maxPrice.toString());
    }
    
    if (ratings.length > 0) {
      newParams.set('rating', ratings.join(','));
    }
    
    setSearchParams(newParams);
    
    // Build active filters display
    const newFilters: string[] = [];
    if (selectedCategory) {
      newFilters.push(`Category: ${selectedCategory}`);
    }
    if (minPrice > 0 || maxPrice < 1000) {
      newFilters.push(`Price: $${minPrice} - $${maxPrice}`);
    }
    if (ratings.length > 0) {
      newFilters.push(`Rating: ${ratings.join(', ')}★`);
    }
    
    setActiveFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange({
        category: selectedCategory,
        priceRange: [minPrice, maxPrice],
        ratings
      });
    }
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 1000]);
    setRatings([]);
    setSearchParams({});
    setActiveFilters([]);
    
    if (onFilterChange) {
      onFilterChange({
        category: '',
        priceRange: [0, 1000],
        ratings: []
      });
    }
  };

  const removeFilter = (filter: string) => {
    if (filter.startsWith('Category:')) {
      setSelectedCategory('');
      searchParams.delete('category');
    } else if (filter.startsWith('Price:')) {
      setPriceRange([0, 1000]);
      searchParams.delete('minPrice');
      searchParams.delete('maxPrice');
    } else if (filter.startsWith('Rating:')) {
      setRatings([]);
      searchParams.delete('rating');
    }
    
    setSearchParams(searchParams);
    setActiveFilters(activeFilters.filter(f => f !== filter));
    
    // Update parent component
    if (onFilterChange) {
      const updatedFilters = {
        category: filter.startsWith('Category:') ? '' : selectedCategory,
        priceRange: filter.startsWith('Price:') ? [0, 1000] : priceRange,
        ratings: filter.startsWith('Rating:') ? [] : ratings
      };
      onFilterChange(updatedFilters);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const handleRatingToggle = (rating: number) => {
    setRatings(prev => 
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating].sort()
    );
  };

  return (
    <div className="space-y-6">
      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="flex items-center gap-1 px-3 py-1.5"
              >
                {filter}
                <button 
                  onClick={() => removeFilter(filter)}
                  className="ml-1 hover:text-servie focus:outline-none"
                  aria-label={`Remove ${filter} filter`}
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="text-xs h-8 hover:text-servie"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Categories section */}
      <div className="space-y-3">
        <h3 className="font-medium text-lg">Categories</h3>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 bg-muted animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={category.id}
                  checked={selectedCategory === category.name}
                  onCheckedChange={() => handleCategorySelect(category.name)}
                  className="data-[state=checked]:bg-servie data-[state=checked]:border-servie"
                />
                <Label 
                  htmlFor={category.id}
                  className="text-sm cursor-pointer"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price range filter */}
      <div className="space-y-3">
        <h3 className="font-medium text-lg">Price Range</h3>
        <Slider
          defaultValue={[0, 1000]}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={(value: [number, number]) => setPriceRange(value)}
          className="my-6"
        />
        <div className="flex items-center justify-between">
          <span className="text-sm">${minPrice}</span>
          <span className="text-sm">${maxPrice}</span>
        </div>
      </div>

      {/* Rating filter */}
      <div className="space-y-3">
        <h3 className="font-medium text-lg">Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox 
                id={`rating-${rating}`}
                checked={ratings.includes(rating)}
                onCheckedChange={() => handleRatingToggle(rating)}
                className="data-[state=checked]:bg-servie data-[state=checked]:border-servie"
              />
              <Label 
                htmlFor={`rating-${rating}`}
                className="text-sm flex items-center cursor-pointer"
              >
                {rating} {rating === 1 ? 'Star' : 'Stars'} & Up
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Apply filters button */}
      <Button 
        className="w-full bg-servie hover:bg-servie-600 text-white"
        onClick={applyFilters}
      >
        Apply Filters
      </Button>
    </div>
  );
}
