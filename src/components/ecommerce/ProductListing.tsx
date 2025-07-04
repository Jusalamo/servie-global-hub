
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Star } from "lucide-react";
import { products } from "@/data/mockData";
import { toast } from "sonner";

interface ProductListingProps {
  initialCategory?: string;
  initialSearch?: string;
}

export default function ProductListing({ initialCategory = 'all', initialSearch = '' }: ProductListingProps) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.categoryId === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return b.featured ? 1 : -1;
        default:
          return b.featured ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, sortBy]);

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Product added to cart!");
    console.log("Adding product to cart:", productId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">Shop Products</h1>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px] dark:bg-gray-800 dark:text-white dark:border-gray-600">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-white dark:border-gray-600">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="1">Beauty & Personal Care</SelectItem>
              <SelectItem value="2">Electronics</SelectItem>
              <SelectItem value="3">Fashion & Clothing</SelectItem>
              <SelectItem value="4">Home & Garden</SelectItem>
              <SelectItem value="5">Sports & Fitness</SelectItem>
              <SelectItem value="6">Books & Education</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px] dark:bg-gray-800 dark:text-white dark:border-gray-600">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-white dark:border-gray-600">
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground dark:text-gray-400">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-2 dark:text-white">{product.name}</h3>
                    {product.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                  
                  <p className="text-muted-foreground dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground dark:text-gray-400">
                        ({product.reviewCount})
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold dark:text-white">${product.price}</span>
                      {product.stock_quantity > 0 ? (
                        <p className="text-sm text-green-600 dark:text-green-400">In Stock ({product.stock_quantity})</p>
                      ) : (
                        <p className="text-sm text-red-600 dark:text-red-400">Out of Stock</p>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={(e) => handleAddToCart(product.id, e)}
                      disabled={product.stock_quantity === 0}
                      className="bg-servie hover:bg-servie-600"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
