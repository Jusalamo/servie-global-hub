
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  FileText, 
  Receipt, 
  DollarSign, 
  Download,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import CreateFinancialDocumentModal from "./CreateFinancialDocumentModal";

interface FinancesTabProps {
  userRole: "provider" | "seller";
}

const FinancesTab = ({ userRole }: FinancesTabProps) => {
  const [activeDocumentTab, setActiveDocumentTab] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);

  // Mock financial documents data
  const financialDocuments = [
    {
      id: "inv-001",
      type: "invoice",
      number: "INV-2024-001",
      title: "Professional Photography Services",
      client: "Amara Johnson",
      amount: 1200,
      status: "paid",
      date: "2024-07-15",
      dueDate: "2024-08-15"
    },
    {
      id: "quo-001",
      type: "quotation",
      number: "QUO-2024-001",
      title: "Wedding Photography Package",
      client: "Sipho Mthembu",
      amount: 2500,
      status: "pending",
      date: "2024-07-10",
      dueDate: "2024-07-25"
    },
    {
      id: "bil-001",
      type: "bill",
      number: "BIL-2024-001",
      title: "Equipment Purchase",
      client: "Camera Store Ltd",
      amount: 850,
      status: "overdue",
      date: "2024-06-20",
      dueDate: "2024-07-20"
    },
    {
      id: "rec-001",
      type: "receipt",
      number: "REC-2024-001",
      title: "Payment Received",
      client: "Thabo Molefe",
      amount: 600,
      status: "completed",
      date: "2024-07-12",
      dueDate: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "overdue":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "invoice":
        return <FileText className="h-4 w-4" />;
      case "quotation":
        return <FileText className="h-4 w-4" />;
      case "bill":
        return <Receipt className="h-4 w-4" />;
      case "receipt":
        return <Receipt className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredDocuments = financialDocuments.filter(doc => 
    activeDocumentTab === "all" || doc.type === activeDocumentTab
  );

  const handleCreateDocument = (type: string) => {
    setSelectedDocumentType(type);
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Management</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => handleCreateDocument("invoice")}
            className="bg-servie hover:bg-servie-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
          <Button 
            onClick={() => handleCreateDocument("quotation")}
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Quote
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,150</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,500</div>
            <p className="text-xs text-muted-foreground">
              3 pending quotations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$850</div>
            <p className="text-xs text-muted-foreground">
              1 overdue bill
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,800</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Document Management */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeDocumentTab} onValueChange={setActiveDocumentTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="invoice">Invoices</TabsTrigger>
              <TabsTrigger value="quotation">Quotations</TabsTrigger>
              <TabsTrigger value="bill">Bills</TabsTrigger>
              <TabsTrigger value="receipt">Receipts</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeDocumentTab} className="mt-6">
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getDocumentIcon(doc.type)}
                        <span className="font-medium">{doc.number}</span>
                      </div>
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-sm text-muted-foreground">{doc.client}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold">${doc.amount}</p>
                        <p className="text-sm text-muted-foreground">{doc.date}</p>
                      </div>
                      
                      <Badge className={`${getStatusColor(doc.status)} text-white`}>
                        {doc.status}
                      </Badge>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-24 flex flex-col space-y-2"
              onClick={() => handleCreateDocument("invoice")}
            >
              <FileText className="h-6 w-6" />
              <span>New Invoice</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col space-y-2"
              onClick={() => handleCreateDocument("quotation")}
            >
              <FileText className="h-6 w-6" />
              <span>New Quote</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col space-y-2"
              onClick={() => handleCreateDocument("bill")}
            >
              <Receipt className="h-6 w-6" />
              <span>New Bill</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col space-y-2"
              onClick={() => handleCreateDocument("receipt")}
            >
              <Receipt className="h-6 w-6" />
              <span>New Receipt</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Document Modal */}
      {showCreateModal && (
        <CreateFinancialDocumentModal
          documentType={selectedDocumentType || "invoice"}
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedDocumentType(null);
          }}
          userRole={userRole}
        />
      )}
    </div>
  );
};

export default FinancesTab;
