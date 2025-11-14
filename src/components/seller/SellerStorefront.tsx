import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Store, CheckCircle, ExternalLink } from 'lucide-react';
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
  city: string | null;
  country: string | null;
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

export const SellerStorefront = () => {
  const { sellerSlug } = useParams<{ sellerSlug: string }>();
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStorefront();
  }, [sellerSlug]);

  const fetchStorefront = async () => {
    if (!sellerSlug) return;

    try {
      setLoading(true);

      // Fetch seller profile by seller_slug
      const { data: sellerData, error: sellerError } = await supabase
        .from('profiles')
        .select('id, business_name, first_name, last_name, shop_description, shop_logo_url, avatar_url, city, country, seller_slug')
        .eq('seller_slug', sellerSlug)
        .eq('role', 'seller')
        .single();

      if (sellerError) {
        console.error('Error fetching seller:', sellerError);
        toast.error('Seller not found');
        setLoading(false);
        return;
      }

      setSeller(sellerData);

      // Fetch seller's products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerData.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error fetching products:', productsError);
      } else {
        setProducts(productsData || []);
      }
    } catch (error) {
      console.error('Error in fetchStorefront:', error);
      toast.error('Failed to load seller shop');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = () => {
    if (seller?.business_name) return seller.business_name;
    if (seller?.first_name && seller?.last_name) {
      return `${seller.first_name} ${seller.last_name}`;
    }
    return 'Seller';
  };

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return product.image_url || '/placeholder.svg';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Store className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Seller Not Found</h1>
        <p className="text-muted-foreground mb-6">This shop does not exist or is no longer available.</p>
        <Link to="/ecommerce">
          <Button>Browse All Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{getDisplayName()} - Shop on Servie</title>
        <meta name="description" content={seller.shop_description || `Shop products from ${getDisplayName()}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Seller Header */}
        <div className="bg-card border-b">
          <div className="container max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={seller.shop_logo_url || seller.avatar_url || ""} alt={getDisplayName()} />
                <AvatarFallback className="text-2xl">
                  {getDisplayName().charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold">{getDisplayName()}</h1>
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

                {(seller.city || seller.country) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {[seller.city, seller.country].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
              </div>

              <Button variant="outline" onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Shop link copied!");
              }}>
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
                <Link key={product.id} to={`/ecommerce/product/${product.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-square mb-3 overflow-hidden rounded-md bg-muted">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <h3 className="font-semibold mb-1 line-clamp-2">{product.name}</h3>

                      {product.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
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
};
