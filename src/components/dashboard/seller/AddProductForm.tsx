import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { productAPI } from "@/services/productAPI";
import { ArrowLeft, Upload } from "lucide-react";

interface AddProductFormProps {
  product?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const AddProductForm = ({ product, onSuccess, onCancel }: AddProductFormProps) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock_quantity: product?.stock_quantity || '',
    category_id: product?.category_id || '',
    featured: product?.featured || false,
    shipping_type: product?.shipping_type || 'fixed',
    shipping_cost: product?.shipping_cost || '',
    shipping_policy: product?.shipping_policy || '',
    return_policy: product?.return_policy || '',
    delivery_time: product?.delivery_time || ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      toast.success("Image selected successfully");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        stock: parseInt(formData.stock_quantity) || 0,
        category_id: formData.category_id || null,
        category: formData.category_id || null,
        featured: formData.featured,
        status: 'active',
        shipping_type: formData.shipping_type,
        shipping_cost: formData.shipping_type === 'fixed' ? parseFloat(formData.shipping_cost) || 0 : 0,
        shipping_policy: formData.shipping_policy,
        return_policy: formData.return_policy,
        delivery_time: formData.delivery_time
      };

      if (product?.id) {
        await productAPI.updateProduct(product.id, productData, imageFile || undefined);
        toast.success("Product updated successfully!");
      } else {
        await productAPI.createProduct(productData, imageFile || undefined);
        toast.success("Product created successfully!");
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  placeholder="Enter product name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  required
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                  placeholder="Enter stock quantity"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => handleInputChange('category_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="sports">Sports & Outdoors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your product..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <div className="mt-4">
                    <label htmlFor="image" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-foreground">
                        {imageFile ? imageFile.name : 'Choose an image'}
                      </span>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">Shipping & Logistics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipping_type">Shipping Type</Label>
                  <Select
                    value={formData.shipping_type || 'fixed'}
                    onValueChange={(value) => handleInputChange('shipping_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shipping type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free Shipping</SelectItem>
                      <SelectItem value="fixed">Fixed Shipping Cost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.shipping_type === 'fixed' && (
                  <div className="space-y-2">
                    <Label htmlFor="shipping_cost">Shipping Cost</Label>
                    <Input
                      id="shipping_cost"
                      type="number"
                      step="0.01"
                      value={formData.shipping_cost || ''}
                      onChange={(e) => handleInputChange('shipping_cost', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="delivery_time">Estimated Delivery Time</Label>
                  <Input
                    id="delivery_time"
                    value={formData.delivery_time || ''}
                    onChange={(e) => handleInputChange('delivery_time', e.target.value)}
                    placeholder="e.g., 3-5 business days"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipping_policy">Shipping Policy</Label>
                <Textarea
                  id="shipping_policy"
                  value={formData.shipping_policy || ''}
                  onChange={(e) => handleInputChange('shipping_policy', e.target.value)}
                  placeholder="Describe your shipping policy..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="return_policy">Return Policy</Label>
                <Textarea
                  id="return_policy"
                  value={formData.return_policy || ''}
                  onChange={(e) => handleInputChange('return_policy', e.target.value)}
                  placeholder="Describe your return and refund policy..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
              />
              <Label htmlFor="featured">Feature this product</Label>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-servie hover:bg-servie-600">
                {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductForm;
