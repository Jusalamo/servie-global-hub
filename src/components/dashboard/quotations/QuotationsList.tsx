
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { quotationAPI, Quotation } from '@/services/quotationAPI';
import { Plus, Search, Eye, Edit, Copy, Trash2, Send, Download } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface QuotationsListProps {
  onCreateNew: () => void;
  onEdit: (quotation: Quotation) => void;
  onView: (quotation: Quotation) => void;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  expired: 'bg-orange-100 text-orange-800',
};

export default function QuotationsList({ onCreateNew, onEdit, onView }: QuotationsListProps) {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadQuotations = async () => {
    try {
      const data = await quotationAPI.getMyQuotations();
      setQuotations(data);
    } catch (error) {
      console.error('Error loading quotations:', error);
      toast.error('Failed to load quotations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotations();
  }, []);

  const handleStatusUpdate = async (id: string, status: Quotation['status']) => {
    try {
      await quotationAPI.updateQuotationStatus(id, status);
      await loadQuotations();
      toast.success(`Quotation ${status} successfully`);
    } catch (error) {
      console.error('Error updating quotation status:', error);
      toast.error('Failed to update quotation status');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await quotationAPI.duplicateQuotation(id);
      await loadQuotations();
      toast.success('Quotation duplicated successfully');
    } catch (error) {
      console.error('Error duplicating quotation:', error);
      toast.error('Failed to duplicate quotation');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      try {
        await quotationAPI.deleteQuotation(id);
        await loadQuotations();
        toast.success('Quotation deleted successfully');
      } catch (error) {
        console.error('Error deleting quotation:', error);
        toast.error('Failed to delete quotation');
      }
    }
  };

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-32">Loading quotations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quotations</h2>
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Quote
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search quotations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredQuotations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">No quotations found</p>
              <Button onClick={onCreateNew}>Create Your First Quote</Button>
            </CardContent>
          </Card>
        ) : (
          filteredQuotations.map((quotation) => (
            <Card key={quotation.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{quotation.quote_number}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{quotation.title}</p>
                  </div>
                  <Badge className={statusColors[quotation.status]}>
                    {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Client</p>
                    <p className="text-sm">{quotation.client_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Total</p>
                    <p className="text-sm font-bold">${quotation.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Created</p>
                    <p className="text-sm">{format(new Date(quotation.created_at), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Due Date</p>
                    <p className="text-sm">
                      {quotation.due_date ? format(new Date(quotation.due_date), 'MMM dd, yyyy') : 'Not set'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(quotation)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                  
                  {quotation.status === 'draft' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(quotation)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(quotation.id, 'sent')}
                        className="flex items-center gap-1"
                      >
                        <Send className="h-3 w-3" />
                        Send
                      </Button>
                    </>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(quotation.id)}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Duplicate
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    PDF
                  </Button>

                  {quotation.status === 'draft' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(quotation.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
