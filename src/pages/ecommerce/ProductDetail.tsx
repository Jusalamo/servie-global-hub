import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Heart, 
  Share2,
  ShoppingCart,
  MinusIcon,
  PlusIcon
} from "lucide-react";
import { toast } from "sonner";
import { useProductData } from "@/hooks/useProductData";
import { Product } from "@/components/ecommerce/ProductCard";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById } = useProductData();
  
  // Create default product data structure that matches the Product type
  const defaultProduct: Product = {
    id: "default",
    name: "Product not found",
    description: "This product could not be found",
    price: 0,
    currency: "$",
    images: ["/placeholder.svg"],
    inStock: false,
    rating: 4.0,
    reviewCount: 0,
    providerName: "Unknown",
    providerAvatar: "/placeholder.svg",
    providerId: "unknown",
    category: "",
    createdAt: "",
    featured: false,
    compareAtPrice: undefined
  };
  
  const [product, setProduct] = useState<Product>(defaultProduct);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    // Try to get the product from real data
    const fetchedProduct = getProductById(id || "");
    if (fetchedProduct) {
      setProduct(fetchedProduct);
      setActiveImage(0); // Reset active image when product changes
    }
  }, [id, getProductById]);
  
  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(99, quantity + value));
    setQuantity(newQuantity);
  };
  
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    
    // Simulate adding to cart
    setTimeout(() => {
      setIsAddingToCart(false);
      toast.success(`${quantity} × ${product.name} added to your cart`, {
        action: {
          label: "View Cart",
          onClick: () => window.location.href = "/cart"
        }
      });
    }, 800);
  };
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (isFavorite) {
      toast.info("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };
  
  // Calculate discount using optional chaining to avoid errors
  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
    : 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="/shop" className="text-muted-foreground hover:text-foreground flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Shop
            </Link>
          </div>
          
          {/* Product Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                <img 
                  src={product.images[activeImage]} 
                  alt={product.name} 
                  className="object-cover w-full h-full"
                />
              </div>
              
              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`aspect-square cursor-pointer rounded-md overflow-hidden border-2 ${
                        activeImage === index ? 'border-purple-500' : 'border-transparent'
                      }`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img 
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                {product.featured && (
                  <Badge className="mb-2 bg-purple-500 hover:bg-purple-600">Featured</Badge>
                )}
                {discount > 0 && (
                  <Badge className="mb-2 ml-2 bg-purple-500 hover:bg-purple-600">{discount}% OFF</Badge>
                )}
                <h1 className="text-3xl font-bold">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(product.rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>
                
                {/* Provider */}
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-sm text-muted-foreground">Sold by:</span>
                  <div className="flex items-center">
                    <img 
                      src={product.providerAvatar} 
                      alt={product.providerName} 
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <Link to={`/provider/${product.providerId}`} className="text-sm font-medium hover:underline">
                      {product.providerName}
                    </Link>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">
                    {product.currency || "$"}{product.price.toFixed(2)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      {product.currency || "$"}{product.compareAtPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                
                {/* Stock Status */}
                <div>
                  {product.inStock ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Add to Cart */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center border rounded-md">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1 || !product.inStock}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 99 || !product.inStock}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAddingToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleToggleFavorite}
                  className={isFavorite ? "text-purple-500" : ""}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-purple-500 text-purple-500' : ''}`} />
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Free shipping over $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">2 year warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">30-day returns</span>
                </div>
              </div>
              
              {/* Product Info Tabs */}
              <div className="mt-8">
                <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="specifications">Specifications</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="mt-4">
                    <div className="prose max-w-none">
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <p className="text-sm text-muted-foreground mt-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, 
                        nisl vel ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl 
                        nisl nec nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl 
                        aliquam nisl, nec aliquam nisl nisl nec nisl.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="specifications" className="mt-4">
                    <div className="text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-semibold">Material</div>
                        <div>Premium quality</div>
                        <div className="font-semibold">Dimensions</div>
                        <div>10" x 8" x 2"</div>
                        <div className="font-semibold">Weight</div>
                        <div>0.5 kg</div>
                        <div className="font-semibold">Origin</div>
                        <div>Made in USA</div>
                        <div className="font-semibold">Warranty</div>
                        <div>2 years</div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="reviews" className="mt-4">
                    <div className="space-y-6">
                      {product.reviewCount > 0 ? (
                        <>
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                <span>JD</span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">John Doe</h4>
                                <span className="text-xs text-muted-foreground">2 months ago</span>
                              </div>
                              <div className="flex mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= 5 
                                        ? 'text-yellow-400 fill-yellow-400' 
                                        : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                              <p className="mt-2 text-sm">
                                Great product! Exactly what I was looking for.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                <span>MS</span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">Mary Smith</h4>
                                <span className="text-xs text-muted-foreground">3 weeks ago</span>
                              </div>
                              <div className="flex mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= 4 
                                        ? 'text-yellow-400 fill-yellow-400' 
                                        : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                              <p className="mt-2 text-sm">
                                Good quality but shipping took longer than expected.
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
                        </div>
                      )}
                      
                      <div className="text-center mt-6">
                        <Button variant="purple">Write a Review</Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
