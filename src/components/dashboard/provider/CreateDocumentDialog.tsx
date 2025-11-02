import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DocumentType, DOCUMENT_TYPE_LABELS, CURRENCY_OPTIONS } from '@/types/financialDocuments';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface LineItem {
  item_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface CreateDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateDocumentDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateDocumentDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [documentType, setDocumentType] = useState<DocumentType>('invoice');
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    title: '',
    description: '',
    currency: 'USD',
    tax_percentage: 0,
    discount_percentage: 0,
    notes: '',
    terms_conditions: '',
  });
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { item_name: '', description: '', quantity: 1, unit_price: 0, total_price: 0 },
  ]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { item_name: '', description: '', quantity: 1, unit_price: 0, total_price: 0 },
    ]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    
    // Recalculate total price for this line item
    if (field === 'quantity' || field === 'unit_price') {
      updated[index].total_price = updated[index].quantity * updated[index].unit_price;
    }
    
    setLineItems(updated);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.total_price, 0);
  };

  const calculateTaxAmount = () => {
    return (calculateSubtotal() * formData.tax_percentage) / 100;
  };

  const calculateDiscountAmount = () => {
    return (calculateSubtotal() * formData.discount_percentage) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscountAmount() + calculateTaxAmount();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create documents');
      return;
    }

    if (!formData.client_name.trim()) {
      toast.error('Please enter client name');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter document title');
      return;
    }

    if (lineItems.some(item => !item.item_name.trim())) {
      toast.error('Please fill in all line items');
      return;
    }

    setLoading(true);

    try {
      const subtotal = calculateSubtotal();
      const taxAmount = calculateTaxAmount();
      const discountAmount = calculateDiscountAmount();
      const totalAmount = calculateTotal();

      const { error } = await (supabase as any).from('financial_documents').insert({
        provider_id: user.id,
        client_name: formData.client_name,
        client_email: formData.client_email || null,
        client_phone: formData.client_phone || null,
        document_type: documentType,
        title: formData.title,
        description: formData.description || null,
        currency: formData.currency,
        subtotal,
        tax_percentage: formData.tax_percentage,
        tax_amount: taxAmount,
        discount_percentage: formData.discount_percentage,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        amount_paid: 0,
        balance_due: totalAmount,
        line_items: lineItems,
        notes: formData.notes || null,
        terms_conditions: formData.terms_conditions || null,
        status: 'draft',
      });

      if (error) {
        console.error('Database error:', error);
        throw new Error(error.message || 'Failed to create document');
      }

      toast.success(`${DOCUMENT_TYPE_LABELS[documentType]} created successfully`);
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        client_name: '',
        client_email: '',
        client_phone: '',
        title: '',
        description: '',
        currency: 'USD',
        tax_percentage: 0,
        discount_percentage: 0,
        notes: '',
        terms_conditions: '',
      });
      setLineItems([
        { item_name: '', description: '', quantity: 1, unit_price: 0, total_price: 0 },
      ]);
    } catch (error: any) {
      console.error('Error creating document:', error);
      toast.error(error.message || 'Failed to create document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Financial Document</DialogTitle>
          <DialogDescription>
            Create invoices, receipts, quotations, and other financial documents
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Type */}
          <div className="space-y-2">
            <Label>Document Type</Label>
            <Select value={documentType} onValueChange={(v) => setDocumentType(v as DocumentType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_name">Client Name *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_email">Client Email</Label>
                <Input
                  id="client_email"
                  type="email"
                  value={formData.client_email}
                  onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_phone">Client Phone</Label>
                <Input
                  id="client_phone"
                  value={formData.client_phone}
                  onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Document Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Document Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Line Items</h3>
              <Button type="button" onClick={addLineItem} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            <div className="space-y-4">
              {lineItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-start p-4 border rounded-lg">
                  <div className="col-span-12 md:col-span-3">
                    <Label className="text-xs">Item Name *</Label>
                    <Input
                      value={item.item_name}
                      onChange={(e) => updateLineItem(index, 'item_name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <Label className="text-xs">Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <Label className="text-xs">Unit Price</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => updateLineItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <Label className="text-xs">Total</Label>
                    <Input
                      type="number"
                      value={item.total_price.toFixed(2)}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="col-span-1 flex items-end justify-center">
                    {lineItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLineItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculations */}
          <div className="space-y-4">
            <h3 className="font-semibold">Calculations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax">Tax (%)</Label>
                <Input
                  id="tax"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.tax_percentage}
                  onChange={(e) => setFormData({ ...formData, tax_percentage: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">{formData.currency} {calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax ({formData.tax_percentage}%):</span>
                <span>{formData.currency} {calculateTaxAmount().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount ({formData.discount_percentage}%):</span>
                <span>-{formData.currency} {calculateDiscountAmount().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span>{formData.currency} {calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="terms">Terms & Conditions</Label>
              <Textarea
                id="terms"
                value={formData.terms_conditions}
                onChange={(e) => setFormData({ ...formData, terms_conditions: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
