
import { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronsUpDown, Star, Sliders } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ProductCard, type Product } from "./ProductCard";
import { useLocalization } from "@/components/LangCurrencySelector";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Import supabase for fetching real data
import { supabase } from "@/integrations/supabase/client";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating: High to Low", value: "rating-desc" },
  { label: "Popularity", value: "popularity" }
];

interface ProductListingProps {
  initialCategory?: string;
  initialSearch?: string;
}

export default function ProductListing({
  initialCategory = "all",
  initialSearch = ""
}: ProductListingProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory !== "all" ? [initialCategory] : []
  );
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [showFiltersOnMobile, setShowFiltersOnMobile] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);

  const { translate, formatPrice } = useLocalization();
  
  // Fetch real products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch products with seller profile info
        const { data: productsData, error } = await supabase
          .from('products')
          .select(`
            *,
            profiles!products_seller_id_fkey (
              id,
              business_name,
              first_name,
              last_name,
              avatar_url,
              seller_slug
            )
          `)
          .eq('status', 'active')
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to match Product interface
        const transformedProducts: Product[] = (productsData || []).map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          compareAtPrice: undefined,
          rating: 4.5, // TODO: Calculate from reviews
          reviewCount: 0, // TODO: Count from reviews
          category: product.category || 'Uncategorized',
          images: product.images && product.images.length > 0 ? product.images : [product.image_url || '/placeholder.svg'],
          providerName: product.profiles?.business_name || 
                       `${product.profiles?.first_name || ''} ${product.profiles?.last_name || ''}`.trim() || 
                       'Seller',
          providerAvatar: product.profiles?.avatar_url || '/placeholder.svg',
          providerId: product.seller_id,
          providerSlug: product.profiles?.seller_slug,
          inStock: product.stock > 0,
          featured: product.featured || false,
          createdAt: product.created_at,
          currency: "$"
        }));

        setProducts(transformedProducts);
        
        // Calculate categories with counts
        const categoryMap = new Map<string, number>();
        transformedProducts.forEach(p => {
          const cat = p.category || 'Uncategorized';
          categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
        });
        
        const categoryList = Array.from(categoryMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        
        setCategories(categoryList);
        
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and sorting whenever filter criteria change
  useEffect(() => {
    let results = [...products];
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      results = results.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    // Apply price range filter
    results = results.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply rating filter
    if (ratingFilter !== undefined) {
      results = results.filter(product => product.rating >= ratingFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      results = results.filter(product =>
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "newest":
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price-asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "popularity":
        results.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        break;
    }
    
    setFilteredProducts(results);
  }, [selectedCategories, priceRange, ratingFilter, searchTerm, sortBy]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const handleRatingChange = (rating: number) => {
    setRatingFilter(prev => prev === rating ? undefined : rating);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setRatingFilter(undefined);
    setSearchTerm("");
  };

  // Calculate price range from available products
  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 1000;
  
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">{translate('shop')}</h1>
        
        {/* Search input */}
        <div className="w-full md:w-auto">
          <div className="relative">
            <Input
              type="search"
              placeholder={`${translate('search')}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-[300px]"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar for desktop */}
        <div className="w-full lg:w-64 hidden lg:block space-y-6">
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold mb-4">{translate('filters')}</h2>
            
            {/* Categories filter */}
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-medium">{translate('categories')}</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.name} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.name}`}
                      checked={selectedCategories.includes(category.name)}
                      onCheckedChange={() => handleCategoryToggle(category.name)}
                    />
                    <Label 
                      htmlFor={`category-${category.name}`}
                      className="flex justify-between w-full cursor-pointer text-sm"
                    >
                      <span>{category.name}</span>
                      <span className="text-muted-foreground">({category.count})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Price range filter */}
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-medium">{translate('price_range')}</h3>
              <Slider
                defaultValue={[0, maxPrice]}
                max={maxPrice}
                step={1}
                value={[priceRange[0], priceRange[1]]}
                onValueChange={handlePriceRangeChange}
                className="mb-6"
              />
              <div className="flex items-center justify-between">
                <div className="border rounded p-2 w-[80px]">
                  {formatPrice(priceRange[0])}
                </div>
                <span className="text-center">-</span>
                <div className="border rounded p-2 w-[80px]">
                  {formatPrice(priceRange[1])}
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Rating filter */}
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-medium">{translate('rating')}</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <div
                    key={rating}
                    className={`flex items-center space-x-2 p-1 rounded cursor-pointer ${
                      ratingFilter === rating ? "bg-muted" : ""
                    }`}
                    onClick={() => handleRatingChange(rating)}
                  >
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm">& Up</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Button onClick={resetFilters} variant="outline" size="sm" className="w-full">
              {translate('reset_filters')}
            </Button>
          </div>
        </div>
        
        {/* Mobile filters button and dropdown */}
        <div className="lg:hidden mb-4">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              onClick={() => setShowFiltersOnMobile(!showFiltersOnMobile)} 
              className="flex items-center gap-2"
            >
              <Sliders className="h-4 w-4" />
              {translate('filters')}
            </Button>
            
            {/* Sort dropdown for mobile */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {translate('sort')}
                  <ChevronsUpDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[200px] p-0">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {sortOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          onSelect={() => setSortBy(option.value)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          {sortBy === option.value && (
                            <Check className="h-4 w-4" />
                          )}
                          <span className={sortBy === option.value ? "font-medium" : ""}>
                            {translate(option.value.replace('-', '_'))}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          {showFiltersOnMobile && (
            <div className="border rounded-lg p-4 mb-4 bg-background">
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="categories">
                  <AccordionTrigger>{translate('categories')}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.name} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`mobile-category-${category.name}`}
                            checked={selectedCategories.includes(category.name)}
                            onCheckedChange={() => handleCategoryToggle(category.name)}
                          />
                          <Label 
                            htmlFor={`mobile-category-${category.name}`}
                            className="flex justify-between w-full cursor-pointer text-sm"
                          >
                            <span>{category.name}</span>
                            <span className="text-muted-foreground">({category.count})</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="price">
                  <AccordionTrigger>{translate('price_range')}</AccordionTrigger>
                  <AccordionContent>
                    <Slider
                      defaultValue={[0, maxPrice]}
                      max={maxPrice}
                      step={1}
                      value={[priceRange[0], priceRange[1]]}
                      onValueChange={handlePriceRangeChange}
                      className="mb-6"
                    />
                    <div className="flex items-center justify-between">
                      <div className="border rounded p-2 w-[80px]">
                        {formatPrice(priceRange[0])}
                      </div>
                      <span className="text-center">-</span>
                      <div className="border rounded p-2 w-[80px]">
                        {formatPrice(priceRange[1])}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="rating">
                  <AccordionTrigger>{translate('rating')}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <div
                          key={rating}
                          className={`flex items-center space-x-2 p-1 rounded cursor-pointer ${
                            ratingFilter === rating ? "bg-muted" : ""
                          }`}
                          onClick={() => handleRatingChange(rating)}
                        >
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm">& Up</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Button onClick={resetFilters} variant="outline" size="sm" className="w-full mt-4">
                {translate('reset_filters')}
              </Button>
            </div>
          )}
        </div>
        
        {/* Products grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            {/* Active filters */}
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <button
                    onClick={() => handleCategoryToggle(category)}
                    className="ml-1 rounded-full h-4 w-4 flex items-center justify-center hover:bg-muted-foreground/20"
                  >
                    ✕
                  </button>
                </Badge>
              ))}
              {ratingFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {ratingFilter}+ {translate('rating')}
                  <button
                    onClick={() => setRatingFilter(undefined)}
                    className="ml-1 rounded-full h-4 w-4 flex items-center justify-center hover:bg-muted-foreground/20"
                  >
                    ✕
                  </button>
                </Badge>
              )}
            </div>
            
            {/* Sort dropdown for desktop */}
            <div className="hidden lg:block">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    {translate('sort')}
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[200px] p-0">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {sortOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            onSelect={() => setSortBy(option.value)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            {sortBy === option.value && (
                              <Check className="h-4 w-4" />
                            )}
                            <span className={sortBy === option.value ? "font-medium" : ""}>
                              {translate(option.value.replace('-', '_'))}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Products grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4 h-96 animate-pulse">
                  <div className="w-full h-48 bg-muted rounded-md mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-6 bg-muted rounded w-1/3"></div>
                    <div className="h-6 bg-muted rounded w-1/4"></div>
                  </div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search criteria.</p>
              <Button onClick={resetFilters} variant="outline">
                {translate('reset_filters')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
