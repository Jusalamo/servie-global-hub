
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { quotationAPI, CreateQuotationData } from '@/services/quotationAPI';
import { Plus, X, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface QuotationItem {
  item_name: string;
  description: string;
  quantity: number;
  unit_price: number;
}

interface CreateQuotationFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function CreateQuotationForm({ onBack, onSuccess }: CreateQuotationFormProps) {
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    title: '',
    description: '',
    due_date: '',
    valid_until: '',
    notes: '',
    terms_conditions: `Payment is due within 30 days of invoice date.
All work will be completed according to the specifications outlined above.
Any changes to the scope of work may result in additional charges.`,
    discount_percentage: 0,
    tax_percentage: 10,
  });

  const [items, setItems] = useState<QuotationItem[]>([
    { item_name: '', description: '', quantity: 1, unit_price: 0 }
  ]);

  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems([...items, { item_name: '', description: '', quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof QuotationItem, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const calculateDiscount = () => {
    return (calculateSubtotal() * formData.discount_percentage) / 100;
  };

  const calculateTax = () => {
    return ((calculateSubtotal() - calculateDiscount()) * formData.tax_percentage) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.client_name.trim()) {
      toast.error('Client name is required');
      return;
    }
    
    if (!formData.title.trim()) {
      toast.error('Quotation title is required');
      return;
    }

    const validItems = items.filter(item => item.item_name.trim() && item.unit_price > 0);
    if (validItems.length === 0) {
      toast.error('At least one item with name and price is required');
      return;
    }

    setLoading(true);

    try {
      const quotationData: CreateQuotationData = {
        ...formData,
        items: validItems,
      };

      await quotationAPI.createQuotation(quotationData);
      toast.success('Quotation created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error creating quotation:', error);
      toast.error('Failed to create quotation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Quotations
        </Button>
        <h2 className="text-2xl font-bold">Create New Quotation</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client_name">Client Name *</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="client_email">Client Email</Label>
              <Input
                id="client_email"
                type="email"
                value={formData.client_email}
                onChange={(e) => setFormData({...formData, client_email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="client_phone">Client Phone</Label>
              <Input
                id="client_phone"
                value={formData.client_phone}
                onChange={(e) => setFormData({...formData, client_phone: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quotation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Website Development Project"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of the work to be done..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="valid_until">Valid Until</Label>
                <Input
                  id="valid_until"
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Items & Services</CardTitle>
            <Button type="button" onClick={addItem} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Item Name *</Label>
                    <Input
                      value={item.item_name}
                      onChange={(e) => updateItem(index, 'item_name', e.target.value)}
                      placeholder="e.g., Website Design"
                      required
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Brief description..."
                    />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Unit Price ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="font-medium">
                    Line Total: ${(item.quantity * item.unit_price).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Totals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount_percentage">Discount (%)</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({...formData, discount_percentage: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="tax_percentage">Tax (%)</Label>
                <Input
                  id="tax_percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.tax_percentage}
                  onChange={(e) => setFormData({...formData, tax_percentage: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              {formData.discount_percentage > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount ({formData.discount_percentage}%):</span>
                  <span>-${calculateDiscount().toFixed(2)}</span>
                </div>
              )}
              {formData.tax_percentage > 0 && (
                <div className="flex justify-between">
                  <span>Tax ({formData.tax_percentage}%):</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Any additional notes or instructions..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="terms_conditions">Terms & Conditions</Label>
              <Textarea
                id="terms_conditions"
                value={formData.terms_conditions}
                onChange={(e) => setFormData({...formData, terms_conditions: e.target.value})}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Quotation'}
          </Button>
        </div>
      </form>
    </div>
  );
}
