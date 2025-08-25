import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { 
  Plus, 
  FileText, 
  Download, 
  Send, 
  Edit, 
  Trash2, 
  Calendar,
  DollarSign,
  Eye
} from "lucide-react";

interface QuotationItem {
  id: string;
  item_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Quotation {
  id: string;
  quote_number: string;
  title: string;
  description: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  status: string;
  subtotal: number;
  discount_amount: number;
  discount_percentage: number;
  tax_amount: number;
  tax_percentage: number;
  total: number;
  due_date: string;
  valid_until: string;
  notes: string;
  terms_conditions: string;
  created_at: string;
  quotation_items?: QuotationItem[];
}

export function QuotationsTab() {
  const { user } = useAuth();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state for creating/editing quotations
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    due_date: "",
    valid_until: "",
    notes: "",
    terms_conditions: "Payment is due within 30 days of acceptance. All work subject to terms and conditions.",
    discount_percentage: 0,
    tax_percentage: 8.5
  });

  const [items, setItems] = useState<Omit<QuotationItem, 'id'>[]>([
    { item_name: "", description: "", quantity: 1, unit_price: 0, total_price: 0 }
  ]);

  useEffect(() => {
    if (user) {
      fetchQuotations();
    }
  }, [user]);

  const fetchQuotations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('quotations')
        .select(`
          *,
          quotation_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotations(data || []);
    } catch (error) {
      console.error('Error fetching quotations:', error);
      toast.error('Failed to load quotations');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateItemTotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total_price, 0);
  };

  const calculateDiscountAmount = (subtotal: number, discountPercentage: number) => {
    return (subtotal * discountPercentage) / 100;
  };

  const calculateTaxAmount = (subtotal: number, discountAmount: number, taxPercentage: number) => {
    return ((subtotal - discountAmount) * taxPercentage) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount(subtotal, formData.discount_percentage);
    const taxAmount = calculateTaxAmount(subtotal, discountAmount, formData.tax_percentage);
    return subtotal - discountAmount + taxAmount;
  };

  const handleItemChange = (index: number, field: keyof Omit<QuotationItem, 'id'>, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate total price for this item
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total_price = calculateItemTotal(
        newItems[index].quantity, 
        newItems[index].unit_price
      );
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { item_name: "", description: "", quantity: 1, unit_price: 0, total_price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      client_name: "",
      client_email: "",
      client_phone: "",
      due_date: "",
      valid_until: "",
      notes: "",
      terms_conditions: "Payment is due within 30 days of acceptance. All work subject to terms and conditions.",
      discount_percentage: 0,
      tax_percentage: 8.5
    });
    setItems([{ item_name: "", description: "", quantity: 1, unit_price: 0, total_price: 0 }]);
  };

  const handleCreateQuotation = async () => {
    try {
      if (!user) return;

      const subtotal = calculateSubtotal();
      const discountAmount = calculateDiscountAmount(subtotal, formData.discount_percentage);
      const taxAmount = calculateTaxAmount(subtotal, discountAmount, formData.tax_percentage);
      const total = calculateTotal();

      // For now, we'll use a simple approach - note: full quotation system needs database function
      toast.info('Quotation system partially implemented. Database functions needed for full functionality.');
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating quotation:', error);
      toast.error('Failed to create quotation');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      draft: "secondary",
      sent: "default",
      accepted: "default",
      declined: "destructive"
    };
    
    return <Badge variant={variants[status] || "default"}>{status.toUpperCase()}</Badge>;
  };

  const generatePDF = (quotation: Quotation) => {
    // This would integrate with a PDF generation library
    toast.info('PDF generation functionality would be implemented here');
  };

  const sendQuotation = async (quotationId: string) => {
    try {
      const { error } = await supabase
        .from('quotations')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', quotationId);

      if (error) throw error;

      toast.success('Quotation sent successfully!');
      fetchQuotations();
    } catch (error) {
      console.error('Error sending quotation:', error);
      toast.error('Failed to send quotation');
    }
  };

  const deleteQuotation = async (quotationId: string) => {
    try {
      const { error } = await supabase
        .from('quotations')
        .delete()
        .eq('id', quotationId);

      if (error) throw error;

      toast.success('Quotation deleted successfully!');
      fetchQuotations();
    } catch (error) {
      console.error('Error deleting quotation:', error);
      toast.error('Failed to delete quotation');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading quotations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Financial Quotations</h2>
          <p className="text-muted-foreground">Create, manage, and track your quotations</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-servie hover:bg-servie-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Quotation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Quotation</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Client Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Client Information</CardTitle>
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
                    <Label htmlFor="client_email">Email</Label>
                    <Input
                      id="client_email"
                      type="email"
                      value={formData.client_email}
                      onChange={(e) => setFormData({...formData, client_email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="client_phone">Phone</Label>
                    <Input
                      id="client_phone"
                      value={formData.client_phone}
                      onChange={(e) => setFormData({...formData, client_phone: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quotation Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quotation Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
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

              {/* Line Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between items-center">
                    Line Items
                    <Button type="button" onClick={addItem} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                        <div>
                          <Label>Item Name *</Label>
                          <Input
                            value={item.item_name}
                            onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div>
                          <Label>Unit Price</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unit_price}
                            onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Total</Label>
                          <Input
                            value={`$${item.total_price.toFixed(2)}`}
                            disabled
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(index)}
                            disabled={items.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pricing Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="discount_percentage">Discount %</Label>
                      <Input
                        id="discount_percentage"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={formData.discount_percentage}
                        onChange={(e) => setFormData({...formData, discount_percentage: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tax_percentage">Tax %</Label>
                      <Input
                        id="tax_percentage"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
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
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span>-${calculateDiscountAmount(calculateSubtotal(), formData.discount_percentage).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${calculateTaxAmount(calculateSubtotal(), calculateDiscountAmount(calculateSubtotal(), formData.discount_percentage), formData.tax_percentage).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
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

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateQuotation} className="bg-servie hover:bg-servie-600">
                  Create Quotation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quotations List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Quotations</CardTitle>
        </CardHeader>
        <CardContent>
          {quotations.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No quotations yet</h3>
              <p className="text-muted-foreground mb-4">Create your first quotation to get started</p>
              <Button onClick={() => setIsCreateModalOpen(true)} className="bg-servie hover:bg-servie-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Quotation
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">{quotation.quote_number}</TableCell>
                    <TableCell>{quotation.client_name}</TableCell>
                    <TableCell>{quotation.title}</TableCell>
                    <TableCell>${quotation.total.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(quotation.status)}</TableCell>
                    <TableCell>{new Date(quotation.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedQuotation(quotation);
                            setIsViewModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generatePDF(quotation)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {quotation.status === 'draft' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendQuotation(quotation.id)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteQuotation(quotation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Quotation Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quotation Details</DialogTitle>
          </DialogHeader>
          
          {selectedQuotation && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Quote #: {selectedQuotation.quote_number}</h3>
                  <p className="text-sm text-muted-foreground">Status: <span className="inline-block ml-1">{getStatusBadge(selectedQuotation.status)}</span></p>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold">Total: ${selectedQuotation.total.toFixed(2)}</h3>
                  <p className="text-sm text-muted-foreground">Created: {new Date(selectedQuotation.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Client Information</h4>
                <p><strong>Name:</strong> {selectedQuotation.client_name}</p>
                {selectedQuotation.client_email && <p><strong>Email:</strong> {selectedQuotation.client_email}</p>}
                {selectedQuotation.client_phone && <p><strong>Phone:</strong> {selectedQuotation.client_phone}</p>}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Project Details</h4>
                <p><strong>Title:</strong> {selectedQuotation.title}</p>
                {selectedQuotation.description && <p><strong>Description:</strong> {selectedQuotation.description}</p>}
              </div>

              {selectedQuotation.quotation_items && selectedQuotation.quotation_items.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Line Items</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedQuotation.quotation_items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.item_name}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                          <TableCell>${item.total_price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="space-y-2 max-w-sm ml-auto">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${selectedQuotation.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedQuotation.discount_amount > 0 && (
                    <div className="flex justify-between">
                      <span>Discount ({selectedQuotation.discount_percentage}%):</span>
                      <span>-${selectedQuotation.discount_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax ({selectedQuotation.tax_percentage}%):</span>
                    <span>${selectedQuotation.tax_amount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${selectedQuotation.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {selectedQuotation.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Notes</h4>
                  <p className="text-sm">{selectedQuotation.notes}</p>
                </div>
              )}

              {selectedQuotation.terms_conditions && (
                <div>
                  <h4 className="font-semibold mb-2">Terms & Conditions</h4>
                  <p className="text-sm">{selectedQuotation.terms_conditions}</p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => generatePDF(selectedQuotation)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                {selectedQuotation.status === 'draft' && (
                  <Button onClick={() => sendQuotation(selectedQuotation.id)} className="bg-servie hover:bg-servie-600">
                    <Send className="h-4 w-4 mr-2" />
                    Send to Client
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}