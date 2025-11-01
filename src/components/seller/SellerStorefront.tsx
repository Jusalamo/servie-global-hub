import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Shield, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface SellerProfile {
  id: string;
  business_name: string;
  bio: string;
  avatar_url: string;
  city: string;
  country: string;
  kyc_status: string;
  two_fa_enabled: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
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
      // Fetch seller profile (slug format: seller-name-uuid)
      const sellerId = sellerSlug.split('-').pop();
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sellerId)
        .single();

      if (profileError) throw profileError;
      setSeller(profile);

      // Fetch seller's products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerId)
        .eq('status', 'active');

      if (productsError) throw productsError;
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching storefront:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!seller) {
    return <div className="container mx-auto px-4 py-8">Seller not found</div>;
  }

  const storeName = seller.business_name || 'Seller Store';
  const storeDescription = seller.bio || 'Quality products from a verified seller';

  return (
    <>
      <Helmet>
        <title>{storeName} - Servie</title>
        <meta name="description" content={storeDescription} />
        <meta property="og:title" content={storeName} />
        <meta property="og:description" content={storeDescription} />
        <meta property="og:image" content={seller.avatar_url || '/placeholder.svg'} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Seller Header */}
        <div className="bg-gradient-to-r from-servie/10 to-servie/5 border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={seller.avatar_url} />
                <AvatarFallback>{storeName[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h1 className="text-3xl font-bold">{storeName}</h1>
                  {seller.kyc_status === 'verified' && (
                    <Badge className="bg-green-100 text-green-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {seller.two_fa_enabled && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Secured
                    </Badge>
                  )}
                </div>
                
                <p className="text-muted-foreground mb-2">{seller.bio}</p>
                
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {seller.city}, {seller.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    4.8 (124 reviews)
                  </span>
                </div>
              </div>
              
              <Button className="bg-servie hover:bg-servie-600">
                Contact Seller
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Products</h2>
          
          {products.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No products available at the moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-muted">
                    <img
                      src={product.image_url || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1 truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                      <Badge variant={product.stock > 0 ? 'default' : 'secondary'}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
