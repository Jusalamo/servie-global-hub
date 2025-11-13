import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Package, AlertTriangle } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  title?: string;
  stock: number;
  stock_quantity?: number;
  stock_status: string;
  price: number;
  category: string;
  created_at: string;
  type: 'product' | 'service';
}

interface InventoryManagementProps {
  userRole: 'provider' | 'seller';
}

export default function InventoryManagement({ userRole }: InventoryManagementProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadInventory();
  }, [userRole]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (userRole === 'seller') {
        const { data: products, error } = await supabase
          .from('products')
          .select('id, name, stock, stock_status, price, category, created_at')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setItems(products?.map(p => ({ ...p, type: 'product' as const })) || []);
      } else {
        const { data: services, error } = await supabase
          .from('services')
          .select('id, title, stock_quantity, stock_status, price, category, created_at')
          .eq('provider_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setItems(services?.map(s => ({ 
          ...s, 
          name: s.title,
          stock: s.stock_quantity || 0,
          type: 'service' as const 
        })) || []);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load inventory');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (itemId: string, newStock: number) => {
    setUpdatingId(itemId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const table = userRole === 'seller' ? 'products' : 'services';
      const column = userRole === 'seller' ? 'stock' : 'stock_quantity';

      const { error } = await supabase
        .from(table)
        .update({ [column]: newStock })
        .eq('id', itemId);

      if (error) throw error;

      toast.success('Stock quantity updated');
      loadInventory();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update stock');
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const updateStatus = async (itemId: string, newStatus: string) => {
    setUpdatingId(itemId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const table = userRole === 'seller' ? 'products' : 'services';

      const { error } = await supabase
        .from(table)
        .update({ stock_status: newStatus })
        .eq('id', itemId);

      if (error) throw error;

      toast.success('Status updated');
      loadInventory();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
      case 'available':
        return 'bg-success text-success-foreground';
      case 'low-stock':
        return 'bg-warning text-warning-foreground';
      case 'out-of-stock':
      case 'unavailable':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <Badge variant="outline" className="text-base">
          <Package className="mr-2 h-4 w-4" />
          {items.length} Items
        </Badge>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No inventory items found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{item.category || 'Uncategorized'}</span>
                      <span>•</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(item.stock_status)}>
                    {getStatusLabel(item.stock_status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`stock-${item.id}`}>
                      {userRole === 'seller' ? 'Stock Quantity' : 'Available Slots'}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`stock-${item.id}`}
                        type="number"
                        min="0"
                        defaultValue={item.stock}
                        className="w-32"
                        onBlur={(e) => {
                          const newValue = parseInt(e.target.value);
                          if (!isNaN(newValue) && newValue !== item.stock) {
                            updateStock(item.id, newValue);
                          }
                        }}
                      />
                      {item.stock <= 5 && item.stock > 0 && (
                        <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`status-${item.id}`}>Status</Label>
                    <Select
                      value={item.stock_status}
                      onValueChange={(value) => updateStatus(item.id, value)}
                      disabled={updatingId === item.id}
                    >
                      <SelectTrigger id={`status-${item.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {userRole === 'seller' ? (
                          <>
                            <SelectItem value="in-stock">In Stock</SelectItem>
                            <SelectItem value="low-stock">Low Stock</SelectItem>
                            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                            <SelectItem value="unavailable">Unavailable</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="low-stock">Low Availability</SelectItem>
                            <SelectItem value="out-of-stock">Fully Booked</SelectItem>
                            <SelectItem value="unavailable">Unavailable</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {updatingId === item.id && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
