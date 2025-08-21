
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Star, ChevronLeft, Share, MessageSquare, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import ReviewForm from "@/components/ecommerce/ReviewForm";
import ReviewList from "@/components/ecommerce/ReviewList";
import { type Product } from "@/components/ecommerce/ProductCard";
import { useLocalization } from "@/components/LangCurrencySelector";

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { isAuthenticated } = useAuth();
  const { formatPrice, translate } = useLocalization();
  const navigate = useNavigate();

  // Simulate fetching product data
  useEffect(() => {
    const fetchProduct = async () => {
      // In a real app, this would be an API call
      setLoading(true);
      try {
        // Simulating API call with timeout
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Use mock product data but ensure it has the required fields
        const defaultProduct: Product = {
          id: productId || "1",
          name: "Premium Wireless Headphones",
          description: "Enjoy premium sound quality with these wireless headphones. Features active noise cancellation, 30-hour battery life, and comfortable ear cushions for all-day listening.",
          price: 249.99,
          compareAtPrice: 299.99,
          currency: "$",
          images: [
            "/products/headphones-1.jpg", 
            "/products/headphones-2.jpg",
            "/products/headphones-3.jpg",
            "/products/headphones-4.jpg"
          ].map(() => "/placeholder.svg"), // Using placeholder since real images might not exist
          category: "Electronics",
          providerId: "seller123",
          providerName: "AudioTech",
          providerAvatar: "/placeholder.svg",
          rating: 4.8,
          reviewCount: 124,
          featured: true,
          inStock: true,
          createdAt: "2023-01-15T08:30:00.000Z"
        };
        
        setProduct(defaultProduct);
        setActiveImage(defaultProduct.images[0]);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    // Check if product is in cart
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setIsInCart(cartItems.some((item: any) => item.id === productId));

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => {
      const newValue = prev + amount;
      return newValue < 1 ? 1 : newValue;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    // Simulate adding to cart
    setTimeout(() => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      
      // Check if product is already in cart
      const existingItemIndex = cartItems.findIndex((item: any) => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Increment quantity
        cartItems[existingItemIndex].quantity += quantity;
        toast.success(`Added ${quantity} ${quantity === 1 ? 'unit' : 'units'} of ${product.name} to cart`);
      } else {
        // Add new item
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] || '/placeholder.svg',
          quantity: quantity,
          providerId: product.providerId,
          providerName: product.providerName
        });
        toast.success(`Added ${product.name} to cart`);
      }
      
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      setIsInCart(true);
      setIsAddingToCart(false);
      
      // Update cart count in UI - dispatch custom event
      window.dispatchEvent(new CustomEvent('cart-updated'));
    }, 600);
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    // Add to cart first
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Check if product is already in cart
    const existingItemIndex = cartItems.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity
      cartItems[existingItemIndex].quantity = quantity;
    } else {
      // Add new item
      cartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '/placeholder.svg',
        quantity: quantity,
        providerId: product.providerId,
        providerName: product.providerName
      });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update cart count in UI - dispatch custom event
    window.dispatchEvent(new CustomEvent('cart-updated'));
    
    // Navigate to checkout
    navigate('/checkout');
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save favorites");
      return;
    }
    
    setIsFavorite(!isFavorite);
    if (isFavorite) {
      toast.info("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container px-4">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-2/5">
                <Skeleton className="w-full aspect-square rounded-lg" />
                <div className="flex gap-2 mt-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="w-20 h-20 rounded" />
                  ))}
                </div>
              </div>
              <div className="w-full md:w-3/5 space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-1/3" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-40" />
                  <Skeleton className="h-12 w-40" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/shop">Browse Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discountPercentage = product.compareAtPrice ? 
    Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="/shop" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4 mr-1" />
              {translate('back_to_products')}
            </Link>
          </div>

          {/* Product details */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product images */}
            <div className="w-full lg:w-2/5">
              <div className="aspect-square bg-muted/20 rounded-lg overflow-hidden">
                <img
                  src={activeImage || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                        activeImage === image ? "border-servie" : "border-muted"
                      }`}
                      onClick={() => setActiveImage(image)}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="w-full lg:w-3/5 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={handleToggleFavorite}
                  >
                    <Heart className={`h-6 w-6 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 font-medium">{product.rating}</span>
                  </div>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{product.reviewCount} reviews</span>
                </div>
                
                {product.category && (
                  <div className="mt-2">
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                )}
              </div>

              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="ml-2 text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                {discountPercentage && (
                  <Badge className="ml-2 bg-red-500">
                    {discountPercentage}% OFF
                  </Badge>
                )}
              </div>

              <p className="text-muted-foreground">{product.description}</p>

              <div>
                <div className="flex items-center mb-4">
                  <span className="font-medium mr-4">{translate('quantity')}:</span>
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none"
                      onClick={() => handleQuantityChange(1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {isInCart ? (
                    <Button 
                      className="flex-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                      variant="secondary"
                      onClick={() => navigate('/cart')}
                    >
                      <Check className="mr-2 h-5 w-5" />
                      {translate('view_cart')}
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleAddToCart} 
                      className="flex-1"
                      disabled={isAddingToCart || !product.inStock}
                    >
                      {isAddingToCart ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {translate('adding')}...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          {translate('add_to_cart')}
                        </>
                      )}
                    </Button>
                  )}
                  <Button 
                    onClick={handleBuyNow} 
                    className="flex-1 bg-servie hover:bg-servie-600"
                    disabled={!product.inStock}
                  >
                    {translate('buy_now')}
                  </Button>
                </div>
              </div>

              <div className="flex items-center pt-4 text-sm text-muted-foreground">
                <div className="flex items-center mr-4">
                  <img
                    src={product.providerAvatar}
                    alt={product.providerName}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span>{product.providerName}</span>
                </div>
                <div className="flex items-center">
                  <Share className="h-4 w-4 mr-1" />
                  <button className="hover:text-foreground">{translate('share')}</button>
                </div>
              </div>
            </div>
          </div>

          {/* Product tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">{translate('description')}</TabsTrigger>
                <TabsTrigger value="reviews">{translate('reviews')}</TabsTrigger>
                <TabsTrigger value="shipping">{translate('shipping_returns')}</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="py-6">
                <h3 className="text-lg font-semibold mb-4">{translate('product_description')}</h3>
                <div className="space-y-4">
                  <p>
                    {product.description}
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in metus euismod, efficitur nisi eget, 
                    volutpat nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
                    Vestibulum varius diam velit, ac suscipit enim euismod non.
                  </p>
                  <div>
                    <h4 className="font-medium mb-2">{translate('key_features')}:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>High-quality materials for durability</li>
                      <li>Ergonomic design for comfort</li>
                      <li>Premium sound quality with deep bass</li>
                      <li>Active noise cancellation</li>
                      <li>30-hour battery life</li>
                      <li>Fast charging: 5 minutes for 3 hours of playback</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="py-6">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{translate('customer_reviews')}</h3>
                    <Button variant="outline">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {translate('write_review')}
                    </Button>
                  </div>

                  <div className="bg-muted/30 p-6 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="text-center">
                        <span className="text-5xl font-bold">{product.rating}</span>
                        <div className="flex justify-center mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= Math.floor(product.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {translate('based_on')} {product.reviewCount} {translate('reviews')}
                        </p>
                      </div>
                      
                      <div className="flex-1">
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => {
                            // Calculate percentage for each rating (mock data)
                            const percentage = rating === 5 ? 60 : 
                                              rating === 4 ? 25 : 
                                              rating === 3 ? 10 : 
                                              rating === 2 ? 3 : 2;
                            return (
                              <div key={rating} className="flex items-center">
                                <div className="flex items-center w-24">
                                  <span className="mr-2">{rating}</span>
                                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                </div>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-yellow-400"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="ml-4 text-sm w-12">{percentage}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mock reviews */}
                  <div className="space-y-6">
                    {[
                      {
                        name: "Alex Johnson",
                        date: "2025-04-15",
                        rating: 5,
                        comment: "Absolutely love these headphones! The sound quality is amazing and the noise cancellation works perfectly.",
                        avatar: "/placeholder.svg"
                      },
                      {
                        name: "Maria García",
                        date: "2025-04-02",
                        rating: 4,
                        comment: "Great product, very comfortable for long listening sessions. Battery life is impressive, though the app could use some improvements.",
                        avatar: "/placeholder.svg"
                      },
                      {
                        name: "David Lee",
                        date: "2025-03-24",
                        rating: 5,
                        comment: "Best headphones I've ever owned. The sound is crystal clear and they're so comfortable I forget I'm wearing them.",
                        avatar: "/placeholder.svg"
                      }
                    ].map((review, idx) => (
                      <div key={idx} className="border-b pb-6 last:border-none">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <img
                              src={review.avatar}
                              alt={review.name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <p className="font-medium">{review.name}</p>
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-muted stroke-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </div>
                        </div>
                        <p className="mt-3">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="shipping" className="py-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{translate('shipping_information')}</h3>
                    <p className="text-muted-foreground">
                      We ship to all 50 US states as well as international destinations.
                      Standard shipping typically takes 3-7 business days. Express shipping
                      options are available at checkout.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{translate('returns_refunds')}</h3>
                    <p className="text-muted-foreground">
                      We want you to be completely satisfied with your purchase. If you're not
                      happy with your order, we accept returns within 30 days of delivery for a
                      full refund or exchange.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{translate('warranty')}</h3>
                    <p className="text-muted-foreground">
                      This product comes with a 1-year manufacturer's warranty that covers
                      defects in materials and workmanship.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Checkout preview panel */}
          <div className="mt-16">
            <Card className="p-6 max-w-lg mx-auto">
              <h3 className="text-xl font-semibold mb-4">{translate('complete_purchase')}</h3>
              <PaymentMethodSelector onSelect={(method) => console.log(`Selected payment method: ${method}`)} />
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
