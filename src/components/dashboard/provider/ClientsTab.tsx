import { useState, useEffect } from "react";
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
import { Search, Users, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface Client {
  id: string;
  name: string;
  email: string | null;
  avatar: string | null;
  bookingsCount: number;
  lastBooking: string | null;
}

export default function ClientsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchClients = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Fetch bookings with client info for provider's services
        const { data: bookings, error } = await supabase
          .from('bookings')
          .select(`
            id,
            client_id,
            created_at,
            services!inner (
              provider_id
            )
          `)
          .eq('services.provider_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Group by client and get unique clients
        const clientMap = new Map<string, { count: number; lastBooking: string }>();
        
        (bookings || []).forEach((booking: any) => {
          const clientId = booking.client_id;
          if (clientId) {
            const existing = clientMap.get(clientId);
            if (existing) {
              existing.count++;
            } else {
              clientMap.set(clientId, {
                count: 1,
                lastBooking: booking.created_at
              });
            }
          }
        });

        // Fetch client profiles using public_profiles
        const clientIds = Array.from(clientMap.keys());
        
        if (clientIds.length === 0) {
          setClients([]);
          return;
        }

        const { data: profiles, error: profileError } = await supabase
          .from('public_profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', clientIds);

        if (profileError) {
          console.error('Error fetching client profiles:', profileError);
        }

        const clientList: Client[] = clientIds.map(clientId => {
          const profile = profiles?.find(p => p.id === clientId);
          const bookingData = clientMap.get(clientId)!;
          
          return {
            id: clientId,
            name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown Client' : 'Unknown Client',
            email: null, // Not exposed in public_profiles for privacy
            avatar: profile?.avatar_url || null,
            bookingsCount: bookingData.count,
            lastBooking: bookingData.lastBooking
          };
        });

        setClients(clientList);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setClients([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [user?.id]);
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clients</h2>
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
      
      {clients.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No clients yet</h3>
          <p className="text-muted-foreground">
            Clients who book your services will appear here.
          </p>
        </div>
      ) : (
        <Table>
          <TableCaption>Your clients based on booking history</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Last Booking</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={client.avatar || undefined} />
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{client.name}</span>
                  </div>
                </TableCell>
                <TableCell>{client.bookingsCount}</TableCell>
                <TableCell>
                  {client.lastBooking 
                    ? formatDistanceToNow(new Date(client.lastBooking), { addSuffix: true })
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
