
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { quotationAPI, Quotation, QuotationItem } from '@/services/quotationAPI';
import { ArrowLeft, Download, Send, Edit, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface QuotationViewProps {
  quotationId: string;
  onBack: () => void;
  onEdit?: (quotation: Quotation) => void;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  expired: 'bg-orange-100 text-orange-800',
};

export default function QuotationView({ quotationId, onBack, onEdit }: QuotationViewProps) {
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotation();
  }, [quotationId]);

  const loadQuotation = async () => {
    try {
      const [quotationData, itemsData] = await Promise.all([
        quotationAPI.getQuotationById(quotationId),
        quotationAPI.getQuotationItems(quotationId)
      ]);
      
      setQuotation(quotationData);
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading quotation:', error);
      toast.error('Failed to load quotation');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: Quotation['status']) => {
    if (!quotation) return;
    
    try {
      await quotationAPI.updateQuotationStatus(quotation.id, status);
      await loadQuotation();
      toast.success(`Quotation ${status} successfully`);
    } catch (error) {
      console.error('Error updating quotation status:', error);
      toast.error('Failed to update quotation status');
    }
  };

  const handleDuplicate = async () => {
    if (!quotation) return;
    
    try {
      await quotationAPI.duplicateQuotation(quotation.id);
      toast.success('Quotation duplicated successfully');
      onBack();
    } catch (error) {
      console.error('Error duplicating quotation:', error);
      toast.error('Failed to duplicate quotation');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-32">Loading quotation...</div>;
  }

  if (!quotation) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Quotation not found</p>
        <Button onClick={onBack}>Back to Quotations</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Quotations
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{quotation.quote_number}</h1>
            <p className="text-gray-600">{quotation.title}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={statusColors[quotation.status]}>
            {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {quotation.status === 'draft' && (
          <>
            {onEdit && (
              <Button
                variant="outline"
                onClick={() => onEdit(quotation)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
            <Button
              onClick={() => handleStatusUpdate('sent')}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send to Client
            </Button>
          </>
        )}
        
        <Button
          variant="outline"
          onClick={handleDuplicate}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Duplicate
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-gray-700">Name</p>
                <p>{quotation.client_name}</p>
              </div>
              {quotation.client_email && (
                <div>
                  <p className="font-medium text-gray-700">Email</p>
                  <p>{quotation.client_email}</p>
                </div>
              )}
              {quotation.client_phone && (
                <div>
                  <p className="font-medium text-gray-700">Phone</p>
                  <p>{quotation.client_phone}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {quotation.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{quotation.description}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Items & Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Item</th>
                      <th className="text-left py-2">Description</th>
                      <th className="text-right py-2">Qty</th>
                      <th className="text-right py-2">Unit Price</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-3 font-medium">{item.item_name}</td>
                        <td className="py-3 text-gray-600">{item.description || '-'}</td>
                        <td className="py-3 text-right">{item.quantity}</td>
                        <td className="py-3 text-right">${item.unit_price.toFixed(2)}</td>
                        <td className="py-3 text-right font-medium">${item.total_price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${quotation.subtotal.toFixed(2)}</span>
                </div>
                {quotation.discount_amount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount ({quotation.discount_percentage}%):</span>
                    <span>-${quotation.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                {quotation.tax_amount > 0 && (
                  <div className="flex justify-between">
                    <span>Tax ({quotation.tax_percentage}%):</span>
                    <span>${quotation.tax_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>${quotation.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {quotation.terms_conditions && (
            <Card>
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{quotation.terms_conditions}</p>
              </CardContent>
            </Card>
          )}

          {quotation.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{quotation.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quotation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-gray-700">Quote Number</p>
                <p className="font-mono">{quotation.quote_number}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Status</p>
                <Badge className={statusColors[quotation.status]}>
                  {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="font-medium text-gray-700">Created</p>
                <p>{format(new Date(quotation.created_at), 'PPP')}</p>
              </div>
              {quotation.due_date && (
                <div>
                  <p className="font-medium text-gray-700">Due Date</p>
                  <p>{format(new Date(quotation.due_date), 'PPP')}</p>
                </div>
              )}
              {quotation.valid_until && (
                <div>
                  <p className="font-medium text-gray-700">Valid Until</p>
                  <p>{format(new Date(quotation.valid_until), 'PPP')}</p>
                </div>
              )}
              {quotation.sent_at && (
                <div>
                  <p className="font-medium text-gray-700">Sent</p>
                  <p>{format(new Date(quotation.sent_at), 'PPP')}</p>
                </div>
              )}
              {quotation.accepted_at && (
                <div>
                  <p className="font-medium text-gray-700">Accepted</p>
                  <p>{format(new Date(quotation.accepted_at), 'PPP')}</p>
                </div>
              )}
              {quotation.declined_at && (
                <div>
                  <p className="font-medium text-gray-700">Declined</p>
                  <p>{format(new Date(quotation.declined_at), 'PPP')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
