
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { productAPI } from "@/services/productAPI";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";
import AddProductForm from "./AddProductForm";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productAPI.getProducts();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription for orders
  useRealtimeSubscription([
    {
      table: 'orders',
      event: 'INSERT',
      onReceive: (payload) => {
        toast.success(`New order received!`);
        // You could also reload products to update stock if needed
      }
    }
  ]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await productAPI.deleteProduct(id);
      toast.success("Product deleted successfully");
      loadProducts();
    } catch (error) {
      toast.error("Failed to delete product");
      console.error(error);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await productAPI.updateProduct(id, { status: newStatus });
      toast.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      loadProducts();
    } catch (error) {
      toast.error("Failed to update product status");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading products...</div>;
  }

  if (showAddForm || editingProduct) {
    return (
      <AddProductForm
        product={editingProduct}
        onSuccess={() => {
          setShowAddForm(false);
          setEditingProduct(null);
          loadProducts();
        }}
        onCancel={() => {
          setShowAddForm(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <Button onClick={() => setShowAddForm(true)} className="bg-servie hover:bg-servie-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't created any products yet.</p>
            <Button onClick={() => setShowAddForm(true)} className="bg-servie hover:bg-servie-600">
              Create Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {products.map((product: any) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {product.name}
                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                          {product.status}
                        </Badge>
                        {product.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                      </CardTitle>
                      <p className="text-muted-foreground mt-2">{product.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(product.id, product.status)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Price:</span> ${product.price}
                  </div>
                  <div>
                    <span className="font-medium">Stock:</span> {product.stock_quantity}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {product.status}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(product.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
