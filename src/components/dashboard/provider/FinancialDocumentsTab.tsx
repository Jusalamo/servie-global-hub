import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Send,
  Eye,
  Edit,
  Trash2,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  FinancialDocument,
  DocumentType,
  DocumentStatus,
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_STATUS_LABELS,
} from '@/types/financialDocuments';
import { format } from 'date-fns';
import CreateDocumentDialog from './CreateDocumentDialog';

export default function FinancialDocumentsTab() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<FinancialDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<FinancialDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<DocumentType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<DocumentStatus | 'all'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchQuery, filterType, filterStatus]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = (await (supabase as any)
        .from('financial_documents')
        .select('*')
        .eq('provider_id', user?.id)
        .order('created_at', { ascending: false })) as any;

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      toast.error('Failed to load documents');
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = [...documents];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (doc) =>
          doc.document_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by document type
    if (filterType !== 'all') {
      filtered = filtered.filter((doc) => doc.document_type === filterType);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((doc) => doc.status === filterStatus);
    }

    setFilteredDocuments(filtered);
  };

  const getStatusColor = (status: DocumentStatus): string => {
    const colors: Record<DocumentStatus, string> = {
      draft: 'bg-muted text-muted-foreground',
      sent: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      viewed: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      paid: 'bg-green-500/10 text-green-600 dark:text-green-400',
      overdue: 'bg-red-500/10 text-red-600 dark:text-red-400',
      cancelled: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
      archived: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
    };
    return colors[status] || 'bg-muted';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const { error } = (await (supabase as any)
        .from('financial_documents')
        .delete()
        .eq('id', id)) as any;

      if (error) throw error;
      toast.success('Document deleted successfully');
      fetchDocuments();
    } catch (error: any) {
      toast.error('Failed to delete document');
      console.error('Error deleting document:', error);
    }
  };

  const handleDuplicate = async (doc: FinancialDocument) => {
    try {
      const { document_number, id, created_at, updated_at, ...docData } = doc;
      const { error } = (await (supabase as any)
        .from('financial_documents')
        .insert({
          ...docData,
          title: `${doc.title} (Copy)`,
          status: 'draft' as DocumentStatus,
        })) as any;

      if (error) throw error;
      toast.success('Document duplicated successfully');
      fetchDocuments();
    } catch (error: any) {
      toast.error('Failed to duplicate document');
      console.error('Error duplicating document:', error);
    }
  };

  const handleDownload = async (doc: FinancialDocument) => {
    try {
      toast.loading('Generating document...');
      const { data, error } = await supabase.functions.invoke('generate-document', {
        body: { documentId: doc.id, format: 'html' }
      });

      if (error) throw error;

      // Create a blob and download
      const blob = new Blob([data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.document_number}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.dismiss();
      toast.success('Document downloaded successfully');
    } catch (error: any) {
      toast.dismiss();
      toast.error('Failed to download document');
      console.error('Error downloading document:', error);
    }
  };

  const handleView = async (doc: FinancialDocument) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-document', {
        body: { documentId: doc.id, format: 'html' }
      });

      if (error) throw error;

      // Open in new window
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(data);
        win.document.close();
      }
    } catch (error: any) {
      toast.error('Failed to view document');
      console.error('Error viewing document:', error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold whitespace-normal break-words">
            Financial Documents
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all your business documents in one place
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-xl sm:text-2xl font-bold mt-1">
                {documents.filter((d) => d.document_type === 'invoice').length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-primary opacity-20" />
          </div>
        </Card>
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Outstanding</p>
              <p className="text-xl sm:text-2xl font-bold mt-1">
                $
                {documents
                  .filter((d) => d.status === 'sent' || d.status === 'viewed')
                  .reduce((sum, d) => sum + Number(d.balance_due), 0)
                  .toFixed(2)}
              </p>
            </div>
            <FileText className="h-8 w-8 text-orange-500 opacity-20" />
          </div>
        </Card>
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Paid This Month</p>
              <p className="text-xl sm:text-2xl font-bold mt-1">
                $
                {documents
                  .filter((d) => d.status === 'paid')
                  .reduce((sum, d) => sum + Number(d.total_amount), 0)
                  .toFixed(2)}
              </p>
            </div>
            <FileText className="h-8 w-8 text-green-500 opacity-20" />
          </div>
        </Card>
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Overdue</p>
              <p className="text-xl sm:text-2xl font-bold mt-1">
                {documents.filter((d) => d.status === 'overdue').length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-red-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by number, client, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={(v) => setFilterType(v as DocumentType | 'all')}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as DocumentStatus | 'all')}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(DOCUMENT_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Documents List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first financial document to get started'}
            </p>
            {!searchQuery && filterType === 'all' && filterStatus === 'all' && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Document
              </Button>
            )}
          </Card>
        ) : (
          filteredDocuments.map((doc) => (
            <Card key={doc.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="outline" className="whitespace-nowrap">
                      {DOCUMENT_TYPE_LABELS[doc.document_type]}
                    </Badge>
                    <Badge className={getStatusColor(doc.status)}>
                      {DOCUMENT_STATUS_LABELS[doc.status]}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg mb-1 whitespace-normal break-words">
                    {doc.document_number} - {doc.title}
                  </h3>
                  <p className="text-sm text-muted-foreground whitespace-normal break-words">
                    Client: {doc.client_name} • Issue Date:{' '}
                    {format(new Date(doc.issue_date), 'MMM dd, yyyy')}
                  </p>
                  <p className="text-sm font-medium mt-2">
                    Total: {doc.currency} {Number(doc.total_amount).toFixed(2)}
                    {doc.balance_due > 0 && (
                      <span className="text-orange-600 ml-2">
                        (Balance: {doc.currency} {Number(doc.balance_due).toFixed(2)})
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    title="View"
                    onClick={() => handleView(doc)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" title="Edit">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    title="Download"
                    onClick={() => handleDownload(doc)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" title="Send">
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(doc)}
                    title="Duplicate"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <CreateDocumentDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={fetchDocuments}
      />
    </div>
  );
}
