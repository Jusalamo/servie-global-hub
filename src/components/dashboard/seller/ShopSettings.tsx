import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, ExternalLink, Upload } from "lucide-react";
import { toast } from "sonner";

export default function ShopSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [shopData, setShopData] = useState({
    business_name: "",
    shop_description: "",
    shop_logo_url: "",
    seller_slug: ""
  });

  useEffect(() => {
    if (user?.id) {
      fetchShopData();
    }
  }, [user?.id]);

  const fetchShopData = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("business_name, shop_description, shop_logo_url, seller_slug, first_name, last_name")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      setShopData({
        business_name: data.business_name || `${data.first_name} ${data.last_name}`.trim() || "",
        shop_description: data.shop_description || "",
        shop_logo_url: data.shop_logo_url || "",
        seller_slug: data.seller_slug || ""
      });
    } catch (error) {
      console.error("Error fetching shop data:", error);
      toast.error("Failed to load shop settings");
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${user?.id}-shop-logo-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setShopData({ ...shopData, shop_logo_url: publicUrl });
      toast.success("Logo uploaded successfully");
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Generate slug if it doesn't exist
      let finalSlug = shopData.seller_slug;
      if (!finalSlug) {
        const { data: slugData, error: slugError } = await supabase
          .rpc("generate_seller_slug", { user_id: user?.id });

        if (slugError) throw slugError;
        finalSlug = slugData;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          business_name: shopData.business_name,
          shop_description: shopData.shop_description,
          shop_logo_url: shopData.shop_logo_url,
          seller_slug: finalSlug
        })
        .eq("id", user?.id);

      if (error) throw error;

      setShopData({ ...shopData, seller_slug: finalSlug });
      toast.success("Shop settings saved successfully");
    } catch (error) {
      console.error("Error saving shop data:", error);
      toast.error("Failed to save shop settings");
    } finally {
      setLoading(false);
    }
  };

  const copyShopLink = () => {
    if (shopData.seller_slug) {
      const shopUrl = `${window.location.origin}/shop/${shopData.seller_slug}`;
      navigator.clipboard.writeText(shopUrl);
      toast.success("Shop link copied to clipboard!");
    } else {
      toast.error("Please save your shop settings first to get your shop link");
    }
  };

  const openShop = () => {
    if (shopData.seller_slug) {
      window.open(`/shop/${shopData.seller_slug}`, "_blank");
    } else {
      toast.error("Please save your shop settings first");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">My Shop</h2>
        <p className="text-muted-foreground">
          Customize your public storefront and manage your shop profile
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shop Profile</CardTitle>
          <CardDescription>
            This information will be displayed on your public shop page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Shop Logo */}
          <div className="space-y-2">
            <Label>Shop Logo</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={shopData.shop_logo_url} alt="Shop logo" />
                <AvatarFallback>
                  {shopData.business_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                  className="hidden"
                  id="logo-upload"
                />
                <Label htmlFor="logo-upload">
                  <Button
                    variant="outline"
                    disabled={uploading}
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? "Uploading..." : "Upload Logo"}
                    </span>
                  </Button>
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: Square image, max 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="business_name">Shop Name *</Label>
            <Input
              id="business_name"
              value={shopData.business_name}
              onChange={(e) => setShopData({ ...shopData, business_name: e.target.value })}
              placeholder="Enter your shop or business name"
            />
          </div>

          {/* Shop Description */}
          <div className="space-y-2">
            <Label htmlFor="shop_description">Shop Description</Label>
            <Textarea
              id="shop_description"
              value={shopData.shop_description}
              onChange={(e) => setShopData({ ...shopData, shop_description: e.target.value })}
              placeholder="Tell customers about your shop..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              This will appear on your shop page. Tell customers what makes your shop unique.
            </p>
          </div>

          {/* Shop URL */}
          {shopData.seller_slug && (
            <div className="space-y-2">
              <Label>Your Shop URL</Label>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/shop/${shopData.seller_slug}`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button variant="outline" size="icon" onClick={copyShopLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button onClick={handleSave} disabled={loading || !shopData.business_name}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            {shopData.seller_slug && (
              <>
                <Button variant="outline" onClick={openShop}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View My Shop
                </Button>
                <Button variant="outline" onClick={copyShopLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Shop Link
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
