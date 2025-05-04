
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";

// Mock client data
const mockClients = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", services: 3, lastBooking: "2023-04-15", status: "Active" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", services: 1, lastBooking: "2023-04-10", status: "Active" },
  { id: 3, name: "Carol Williams", email: "carol@example.com", services: 2, lastBooking: "2023-04-05", status: "Inactive" },
  { id: 4, name: "Dave Brown", email: "dave@example.com", services: 4, lastBooking: "2023-04-01", status: "Active" },
  { id: 5, name: "Eve Davis", email: "eve@example.com", services: 1, lastBooking: "2023-03-25", status: "Active" },
];

export default function ClientsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState(mockClients);
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Clients</h2>
        <Button className="bg-servie hover:bg-servie-600">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Client
        </Button>
      </div>
      
      <div className="flex items-center border rounded-md px-3 py-1">
        <Search className="h-4 w-4 text-muted-foreground mr-2" />
        <Input
          className="border-0 focus-visible:ring-0"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Table>
        <TableCaption>A list of your clients.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Services Booked</TableHead>
            <TableHead>Last Booking</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.services}</TableCell>
              <TableCell>{client.lastBooking}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  client.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}>
                  {client.status}
                </span>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">View</Button>
                <Button variant="ghost" size="sm" className="text-blue-600">Message</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
