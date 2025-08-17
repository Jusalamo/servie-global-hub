
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Star } from "lucide-react";
import { productAPI, categoriesAPI } from "@/services/supabaseAPI";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { products as mockProducts } from "@/data/mockData";
import { productCategories } from "@/data/productCategories";
import { useNavigate } from "react-router-dom";

interface ProductListingProps {
  initialCategory?: string;
  initialSearch?: string;
}

export default function ProductListing({ initialCategory = 'all', initialSearch = '' }: ProductListingProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getCategories();
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        // Fallback to mock categories
        setCategories(productCategories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback to mock categories
      setCategories(productCategories);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (selectedCategory !== 'all') {
        filters.category_id = selectedCategory;
      }
      
      const data = await productAPI.getProducts(filters);
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        // Fallback to mock products
        console.log('No products from API, using mock data');
        let filteredMockProducts = mockProducts;
        if (selectedCategory !== 'all') {
          filteredMockProducts = mockProducts.filter(product => product.categoryId === selectedCategory);
        }
        setProducts(filteredMockProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback to mock products
      let filteredMockProducts = mockProducts;
      if (selectedCategory !== 'all') {
        filteredMockProducts = mockProducts.filter(product => product.categoryId === selectedCategory);
      }
      setProducts(filteredMockProducts);
      toast.success('Showing sample products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return b.featured ? 1 : -1;
      }
    });

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await addToCart(productId, 1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Shop Products</h1>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
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
          <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                  {(product.image_url || product.imageUrl || product.images?.[0]) ? (
                    <img
                      src={product.image_url || product.imageUrl || product.images?.[0]}
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
                    <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                    {product.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {product.rating && (
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm">{product.rating}</span>
                      <span className="ml-1 text-sm text-muted-foreground">({product.reviewCount})</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">${product.price}</span>
                      {(product.stock_quantity || product.stockCount) > 0 ? (
                        <p className="text-sm text-green-600">In Stock ({product.stock_quantity || product.stockCount})</p>
                      ) : product.inStock !== false ? (
                        <p className="text-sm text-green-600">In Stock</p>
                      ) : (
                        <p className="text-sm text-red-600">Out of Stock</p>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={(e) => handleAddToCart(product.id, e)}
                      disabled={(product.stock_quantity || product.stockCount) === 0 || product.inStock === false}
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
