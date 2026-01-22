import { useEffect, useState, memo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Store, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';

interface SellerProfile {
  id: string;
  business_name: string | null;
  first_name: string | null;
  last_name: string | null;
  shop_description: string | null;
  shop_logo_url: string | null;
  avatar_url: string | null;
  seller_slug: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  images: string[] | null;
  stock: number | null;
  status: string;
  category: string | null;
}

export const SellerStorefront = memo(() => {
  const { sellerSlug } = useParams<{ sellerSlug: string }>();
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStorefront = useCallback(async () => {
    if (!sellerSlug) return;

    try {
      setLoading(true);

      // Query sanitized public profiles table (prevents exposing sensitive profile fields)
      const { data: sellerData, error: sellerError } = await supabase
        .from('public_profiles')
        .select('id, business_name, first_name, last_name, shop_description, shop_logo_url, avatar_url, seller_slug')
        .eq('seller_slug', sellerSlug)
        .eq('role', 'seller')
        .maybeSingle();

      if (sellerError) {
        console.error('Error fetching seller:', sellerError);
        setLoading(false);
        return;
      }

      if (!sellerData) {
        console.error('Seller not found for slug:', sellerSlug);
        setLoading(false);
        return;
      }

      setSeller(sellerData as SellerProfile);

      // Fetch seller's products with minimal columns for performance
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, description, price, image_url, images, stock, status, category')
        .eq('seller_id', sellerData.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error fetching products:', productsError);
      } else {
        setProducts((productsData || []) as Product[]);
      }
    } catch (error) {
      console.error('Error in fetchStorefront:', error);
      toast.error('Failed to load seller shop');
    } finally {
      setLoading(false);
    }
  }, [sellerSlug]);

  useEffect(() => {
    fetchStorefront();
  }, [fetchStorefront]);

  const getDisplayName = useCallback(() => {
    if (seller?.business_name) return seller.business_name;
    if (seller?.first_name && seller?.last_name) {
      return `${seller.first_name} ${seller.last_name}`;
    }
    return 'Seller';
  }, [seller]);

  const getProductImage = useCallback((product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return product.image_url || '/placeholder.svg';
  }, []);

  const handleShareShop = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Shop link copied!");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-servie" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Store className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Shop Not Found</h1>
        <p className="text-muted-foreground mb-6">This shop does not exist or is no longer available.</p>
        <Link to="/shop">
          <Button>Browse All Products</Button>
        </Link>
      </div>
    );
  }

  const displayName = getDisplayName();

  return (
    <>
      <Helmet>
        <title>{displayName} - Shop on Servie</title>
        <meta name="description" content={seller.shop_description || `Shop products from ${displayName}`} />
        <meta property="og:title" content={`${displayName} - Shop on Servie`} />
        <meta property="og:description" content={seller.shop_description || `Shop products from ${displayName}`} />
        <meta property="og:image" content={seller.shop_logo_url || seller.avatar_url || '/placeholder.svg'} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Seller Header */}
        <div className="bg-card border-b">
          <div className="container max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage 
                  src={seller.shop_logo_url || seller.avatar_url || ""} 
                  alt={displayName}
                  loading="lazy"
                />
                <AvatarFallback className="text-2xl bg-servie text-white">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold">{displayName}</h1>
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                </div>

                {seller.shop_description && (
                  <p className="text-muted-foreground mb-3 max-w-2xl">
                    {seller.shop_description}
                  </p>
                )}
              </div>

              <Button variant="outline" onClick={handleShareShop}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Share Shop
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Products ({products.length})</h2>

          {products.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Store className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No Products Yet</p>
                <p className="text-sm text-muted-foreground">
                  This seller hasn't listed any products yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-square mb-3 overflow-hidden rounded-md bg-muted">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <h3 className="font-semibold mb-1 line-clamp-2">{product.name}</h3>

                      {product.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-servie">
                          ${product.price.toFixed(2)}
                        </span>

                        {product.stock !== null && (
                          <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
});

SellerStorefront.displayName = 'SellerStorefront';
