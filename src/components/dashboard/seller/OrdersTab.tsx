import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowDownUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample order data
const orders = [
  {
    id: "#3845",
    customer: "John Smith",
    email: "john.smith@example.com",
    products: ["Product A", "Product C"],
    total: 196,
    status: "Processing",
    date: "Jul 12, 2023",
  },
  {
    id: "#3844",
    customer: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    products: ["Product B"],
    total: 85,
    status: "Delivered",
    date: "Jul 11, 2023",
  },
  {
    id: "#3843",
    customer: "Michael Brown",
    email: "michael.brown@example.com",
    products: ["Product D"],
    total: 120,
    status: "Shipped",
    date: "Jul 10, 2023",
  },
  {
    id: "#3842",
    customer: "Emily Davis",
    email: "emily.davis@example.com",
    products: ["Product A", "Product E"],
    total: 210,
    status: "Delivered",
    date: "Jul 9, 2023",
  },
  {
    id: "#3841",
    customer: "Robert Wilson",
    email: "robert.wilson@example.com",
    products: ["Product B", "Product C"],
    total: 155,
    status: "New",
    date: "Jul 9, 2023",
  },
  {
    id: "#3840",
    customer: "Jennifer Lee",
    email: "jennifer.lee@example.com",
    products: ["Product A", "Product B", "Product D"],
    total: 345,
    status: "Processing",
    date: "Jul 8, 2023",
  },
  {
    id: "#3839",
    customer: "David Garcia",
    email: "david.garcia@example.com",
    products: ["Product E"],
    total: 75,
    status: "Cancelled",
    date: "Jul 7, 2023",
  },
  {
    id: "#3838",
    customer: "Linda Martinez",
    email: "linda.martinez@example.com",
    products: ["Product C"],
    total: 110,
    status: "Delivered",
    date: "Jul 6, 2023",
  },
];

// Status color mappings
const statusColors: Record<string, string> = {
  New: "bg-purple-100 text-purple-800",
  Processing: "bg-yellow-100 text-yellow-800",
  Shipped: "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function OrdersTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  // Filter orders by search term and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === "date") {
      comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortField === "total") {
      comparison = a.total - b.total;
    } else if (sortField === "id") {
      comparison = a.id.localeCompare(b.id);
    } else if (sortField === "customer") {
      comparison = a.customer.localeCompare(b.customer);
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Order Management</h2>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            Manage and track all your customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <TabsContent value="all">
              {/* Orders table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium p-2">
                        <button 
                          className="flex items-center"
                          onClick={() => toggleSort("id")}
                        >
                          Order ID
                          <ArrowDownUp className="h-4 w-4 ml-1" />
                        </button>
                      </th>
                      <th className="text-left font-medium p-2">
                        <button 
                          className="flex items-center"
                          onClick={() => toggleSort("customer")}
                        >
                          Customer
                          <ArrowDownUp className="h-4 w-4 ml-1" />
                        </button>
                      </th>
                      <th className="text-left font-medium p-2">Products</th>
                      <th className="text-left font-medium p-2">
                        <button 
                          className="flex items-center"
                          onClick={() => toggleSort("total")}
                        >
                          Total
                          <ArrowDownUp className="h-4 w-4 ml-1" />
                        </button>
                      </th>
                      <th className="text-left font-medium p-2">Status</th>
                      <th className="text-left font-medium p-2">
                        <button 
                          className="flex items-center"
                          onClick={() => toggleSort("date")}
                        >
                          Date
                          <ArrowDownUp className="h-4 w-4 ml-1" />
                        </button>
                      </th>
                      <th className="text-left font-medium p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOrders.length > 0 ? (
                      sortedOrders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="p-2">{order.id}</td>
                          <td className="p-2">
                            <div>{order.customer}</div>
                            <div className="text-xs text-muted-foreground">{order.email}</div>
                          </td>
                          <td className="p-2">
                            {order.products.join(", ")}
                          </td>
                          <td className="p-2">${order.total}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status]}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-2">{order.date}</td>
                          <td className="p-2">
                            <Button variant="outline" size="sm">View</Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-muted-foreground">
                          No orders found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            {/* Other tabs would show filtered results by status */}
            <TabsContent value="new">
              {/* New orders tab content */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  {/* Table header - same as all orders */}
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium p-2">Order ID</th>
                      <th className="text-left font-medium p-2">Customer</th>
                      <th className="text-left font-medium p-2">Products</th>
                      <th className="text-left font-medium p-2">Total</th>
                      <th className="text-left font-medium p-2">Status</th>
                      <th className="text-left font-medium p-2">Date</th>
                      <th className="text-left font-medium p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(order => order.status === "New")
                      .map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="p-2">{order.id}</td>
                          <td className="p-2">
                            <div>{order.customer}</div>
                            <div className="text-xs text-muted-foreground">{order.email}</div>
                          </td>
                          <td className="p-2">
                            {order.products.join(", ")}
                          </td>
                          <td className="p-2">${order.total}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status]}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-2">{order.date}</td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button size="sm">Process</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            {/* Similar structure for other tabs */}
            <TabsContent value="processing">
              {/* Processing orders content */}
              <div className="p-4 text-center text-muted-foreground">
                Processing orders will be displayed here.
              </div>
            </TabsContent>
            
            <TabsContent value="shipped">
              {/* Shipped orders content */}
              <div className="p-4 text-center text-muted-foreground">
                Shipped orders will be displayed here.
              </div>
            </TabsContent>
            
            <TabsContent value="delivered">
              {/* Delivered orders content */}
              <div className="p-4 text-center text-muted-foreground">
                Delivered orders will be displayed here.
              </div>
            </TabsContent>
            
            <TabsContent value="cancelled">
              {/* Cancelled orders content */}
              <div className="p-4 text-center text-muted-foreground">
                Cancelled orders will be displayed here.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Order summary card */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>
            Overview of orders by status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-3xl font-bold">{orders.length}</div>
              <div className="text-sm">Total Orders</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-800">
                {orders.filter(order => order.status === "New").length}
              </div>
              <div className="text-sm">New</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-yellow-800">
                {orders.filter(order => order.status === "Processing").length}
              </div>
              <div className="text-sm">Processing</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-800">
                {orders.filter(order => order.status === "Shipped").length}
              </div>
              <div className="text-sm">Shipped</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-800">
                {orders.filter(order => order.status === "Delivered").length}
              </div>
              <div className="text-sm">Delivered</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
