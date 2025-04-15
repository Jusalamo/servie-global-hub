
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProviderSidebar from "@/components/dashboard/ProviderSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu, Calendar, Users, Star, DollarSign, BarChart2, Briefcase, ClipboardList } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Mock data for provider dashboard
const mockBookings = [
  { 
    id: '1', 
    service: 'Home Cleaning', 
    client: 'Sarah Johnson', 
    date: '2025-04-20T14:00:00', 
    duration: 3, 
    status: 'confirmed',
    price: 120.00
  },
  { 
    id: '2', 
    service: 'Home Cleaning', 
    client: 'Michael Brown', 
    date: '2025-04-21T10:00:00', 
    duration: 2, 
    status: 'confirmed',
    price: 80.00
  },
  { 
    id: '3', 
    service: 'Deep Cleaning', 
    client: 'Emily Wilson', 
    date: '2025-04-22T13:00:00', 
    duration: 4, 
    status: 'pending',
    price: 180.00
  },
  { 
    id: '4', 
    service: 'Window Cleaning', 
    client: 'David Chen', 
    date: '2025-04-23T15:30:00', 
    duration: 1.5, 
    status: 'confirmed',
    price: 60.00
  },
  { 
    id: '5', 
    service: 'Home Cleaning', 
    client: 'Lisa Walker', 
    date: '2025-04-24T09:00:00', 
    duration: 3, 
    status: 'canceled',
    price: 120.00
  }
];

const mockServices = [
  {
    id: '1',
    name: 'Home Cleaning',
    description: 'Standard home cleaning service including dusting, vacuuming, and mopping.',
    price: 40.00,
    duration: 1,
    bookings: 42,
    rating: 4.8,
    active: true
  },
  {
    id: '2',
    name: 'Deep Cleaning',
    description: 'Comprehensive deep cleaning for all areas of your home.',
    price: 45.00,
    duration: 1,
    bookings: 24,
    rating: 4.9,
    active: true
  },
  {
    id: '3',
    name: 'Window Cleaning',
    description: 'Professional window cleaning for interior and exterior windows.',
    price: 40.00,
    duration: 1,
    bookings: 13,
    rating: 4.7,
    active: true
  },
  {
    id: '4',
    name: 'Move Out Cleaning',
    description: 'Detailed cleaning service when moving out of a property.',
    price: 50.00,
    duration: 1,
    bookings: 8,
    rating: 5.0,
    active: false
  }
];

const mockReviews = [
  {
    id: '1',
    client: 'Sarah Johnson',
    service: 'Home Cleaning',
    rating: 5,
    comment: 'Excellent service! My house has never been this clean. Will definitely book again.',
    date: '2025-04-10T09:23:00'
  },
  {
    id: '2',
    client: 'Michael Brown',
    service: 'Deep Cleaning',
    rating: 4,
    comment: 'Very thorough cleaning. Took a bit longer than expected but the results were great.',
    date: '2025-04-08T14:15:00'
  },
  {
    id: '3',
    client: 'Emily Wilson',
    service: 'Window Cleaning',
    rating: 5,
    comment: 'Amazing job on the windows! They look brand new.',
    date: '2025-04-05T16:45:00'
  },
  {
    id: '4',
    client: 'David Chen',
    service: 'Home Cleaning',
    rating: 5,
    comment: 'Punctual, professional, and detailed. Highly recommended!',
    date: '2025-04-01T11:30:00'
  }
];

const mockEarnings = {
  today: 120,
  thisWeek: 580,
  thisMonth: 2340,
  lastMonth: 2120,
  totalEarnings: 12480,
  pendingPayout: 780
};

export default function ProviderDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "overview";

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "services":
        return <ServicesTab />;
      case "bookings":
        return <BookingsTab />;
      case "schedule":
        return <ScheduleTab />;
      case "clients":
        return <ClientsTab />;
      case "reviews":
        return <ReviewsTab />;
      case "payments":
        return <PaymentsTab />;
      case "settings":
        return <SettingsTab />;
      case "help":
        return <HelpTab />;
      default:
        return <OverviewTab />;
    }
  };

  // Overview Tab Component
  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Dashboard Overview</h2>
          <p className="text-muted-foreground">Welcome back, {user?.user_metadata?.first_name || "Provider"}</p>
        </div>
        <Button className="bg-servie hover:bg-servie-600">
          <Briefcase className="mr-2 h-4 w-4" />
          Add New Service
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockEarnings.today.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">3 bookings today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground mt-1">Next: Today at 2:00 PM</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9</div>
            <div className="flex mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground mt-1">42/43 bookings completed</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Bookings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Service</th>
                  <th className="py-3 px-4 text-left">Client</th>
                  <th className="py-3 px-4 text-left">Date & Time</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockBookings.map(booking => (
                  <tr key={booking.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{booking.service}</td>
                    <td className="py-3 px-4">{booking.client}</td>
                    <td className="py-3 px-4">{formatDate(booking.date)}</td>
                    <td className="py-3 px-4 text-right">${booking.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'pending' 
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button variant="outline" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="outline">View All Bookings</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Earnings Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
            <p className="text-muted-foreground">Earnings chart will be displayed here</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <div className="text-sm font-medium text-muted-foreground">This Week</div>
              <div className="text-2xl font-bold">${mockEarnings.thisWeek.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">This Month</div>
              <div className="text-2xl font-bold">${mockEarnings.thisMonth.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Last Month</div>
              <div className="text-2xl font-bold">${mockEarnings.lastMonth.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">All Time</div>
              <div className="text-2xl font-bold">${mockEarnings.totalEarnings.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Latest Reviews */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Latest Reviews</CardTitle>
            <CardDescription>What your clients are saying</CardDescription>
          </div>
          <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReviews.slice(0, 3).map(review => (
              <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{review.client}</div>
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{review.service}</div>
                <div className="mt-2">{review.comment}</div>
                <div className="text-xs text-muted-foreground mt-1">{formatDate(review.date)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Services Tab Component
  const ServicesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">My Services</h2>
        <Button className="bg-servie hover:bg-servie-600">
          <Briefcase className="mr-2 h-4 w-4" />
          Add New Service
        </Button>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Services</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Services</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockServices.filter(s => s.active).map(service => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>${service.price.toFixed(2)} per hour</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="font-medium">Duration</div>
                      <div className="text-muted-foreground">{service.duration} hour(s)</div>
                    </div>
                    <div>
                      <div className="font-medium">Bookings</div>
                      <div className="text-muted-foreground">{service.bookings} total</div>
                    </div>
                    <div>
                      <div className="font-medium">Rating</div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        <span>{service.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                    <Button variant="outline" size="sm" className="flex-1">Deactivate</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="inactive" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockServices.filter(s => !s.active).map(service => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>${service.price.toFixed(2)} per hour</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="font-medium">Duration</div>
                      <div className="text-muted-foreground">{service.duration} hour(s)</div>
                    </div>
                    <div>
                      <div className="font-medium">Bookings</div>
                      <div className="text-muted-foreground">{service.bookings} total</div>
                    </div>
                    <div>
                      <div className="font-medium">Rating</div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        <span>{service.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                    <Button variant="outline" size="sm" className="flex-1 text-green-600 hover:text-green-700">Activate</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="draft" className="mt-6">
          <div className="text-center py-10">
            <p className="text-muted-foreground">You don't have any draft services yet.</p>
            <Button className="mt-4 bg-servie hover:bg-servie-600">Create New Service</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Bookings Tab Component
  const BookingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Bookings</h2>
      
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left">Service</th>
                      <th className="py-3 px-4 text-left">Client</th>
                      <th className="py-3 px-4 text-left">Date & Time</th>
                      <th className="py-3 px-4 text-left">Duration</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockBookings.filter(b => b.status !== 'canceled').map(booking => (
                      <tr key={booking.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{booking.service}</td>
                        <td className="py-3 px-4">{booking.client}</td>
                        <td className="py-3 px-4">{formatDate(booking.date)}</td>
                        <td className="py-3 px-4">{booking.duration} hour(s)</td>
                        <td className="py-3 px-4 text-right">${booking.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <Button variant="outline" size="sm">Details</Button>
                            {booking.status === 'pending' && (
                              <Button size="sm" className="bg-servie hover:bg-servie-600">Accept</Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="past" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <p className="text-muted-foreground">Your past bookings will appear here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="canceled" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left">Service</th>
                      <th className="py-3 px-4 text-left">Client</th>
                      <th className="py-3 px-4 text-left">Date & Time</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockBookings.filter(b => b.status === 'canceled').map(booking => (
                      <tr key={booking.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{booking.service}</td>
                        <td className="py-3 px-4">{booking.client}</td>
                        <td className="py-3 px-4">{formatDate(booking.date)}</td>
                        <td className="py-3 px-4 text-right">${booking.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">
                          <Button variant="outline" size="sm">Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Schedule Tab Component
  const ScheduleTab = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">My Schedule</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {/* Side panel with date navigation */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/20 h-[300px] rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Calendar widget will be displayed here</p>
              </div>
              
              <div className="mt-6 space-y-2">
                <h4 className="font-medium">Upcoming Events</h4>
                <div className="space-y-2">
                  <div className="border rounded-md p-3">
                    <div className="font-medium">Home Cleaning</div>
                    <div className="text-sm text-muted-foreground">Today, 2:00 PM - 5:00 PM</div>
                    <div className="text-sm">Sarah Johnson</div>
                  </div>
                  
                  <div className="border rounded-md p-3">
                    <div className="font-medium">Home Cleaning</div>
                    <div className="text-sm text-muted-foreground">Tomorrow, 10:00 AM - 12:00 PM</div>
                    <div className="text-sm">Michael Brown</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main schedule view */}
        <div className="md:col-span-5">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>April 2025</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Day</Button>
                  <Button variant="outline" size="sm">Week</Button>
                  <Button size="sm" className="bg-servie hover:bg-servie-600">Month</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/20 h-[500px] rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Full calendar view will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Availability Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h4 className="font-medium">Working Hours</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="font-medium mb-1">Monday</div>
                <div className="flex space-x-2">
                  <select className="p-2 border rounded-md flex-1">
                    <option>9:00 AM</option>
                  </select>
                  <span className="flex items-center">to</span>
                  <select className="p-2 border rounded-md flex-1">
                    <option>5:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Tuesday</div>
                <div className="flex space-x-2">
                  <select className="p-2 border rounded-md flex-1">
                    <option>9:00 AM</option>
                  </select>
                  <span className="flex items-center">to</span>
                  <select className="p-2 border rounded-md flex-1">
                    <option>5:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Wednesday</div>
                <div className="flex space-x-2">
                  <select className="p-2 border rounded-md flex-1">
                    <option>9:00 AM</option>
                  </select>
                  <span className="flex items-center">to</span>
                  <select className="p-2 border rounded-md flex-1">
                    <option>5:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Thursday</div>
                <div className="flex space-x-2">
                  <select className="p-2 border rounded-md flex-1">
                    <option>9:00 AM</option>
                  </select>
                  <span className="flex items-center">to</span>
                  <select className="p-2 border rounded-md flex-1">
                    <option>5:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Friday</div>
                <div className="flex space-x-2">
                  <select className="p-2 border rounded-md flex-1">
                    <option>9:00 AM</option>
                  </select>
                  <span className="flex items-center">to</span>
                  <select className="p-2 border rounded-md flex-1">
                    <option>5:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Saturday</div>
                <div className="flex space-x-2">
                  <select className="p-2 border rounded-md flex-1">
                    <option>10:00 AM</option>
                  </select>
                  <span className="flex items-center">to</span>
                  <select className="p-2 border rounded-md flex-1">
                    <option>3:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div className="font-medium mb-1">Sunday</div>
                <div className="flex items-center h-[40px]">
                  <span className="text-muted-foreground">Not Available</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <h4 className="font-medium mb-4">Time Off & Holidays</h4>
              <Button variant="outline">Schedule Time Off</Button>
            </div>
            
            <div className="pt-4">
              <Button className="bg-servie hover:bg-servie-600">Save Availability Settings</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Clients Tab Component
  const ClientsTab = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">My Clients</h2>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Client List</CardTitle>
            <div className="flex space-x-2">
              <input
                type="search"
                placeholder="Search clients..."
                className="px-3 py-1 border rounded-md text-sm"
              />
              <Button variant="outline" size="sm">Filter</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Client Name</th>
                  <th className="py-3 px-4 text-left">Contact</th>
                  <th className="py-3 px-4 text-right">Bookings</th>
                  <th className="py-3 px-4 text-right">Revenue</th>
                  <th className="py-3 px-4 text-center">Last Service</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Sarah Johnson</td>
                  <td className="py-3 px-4">sarah@example.com</td>
                  <td className="py-3 px-4 text-right">8</td>
                  <td className="py-3 px-4 text-right">$960.00</td>
                  <td className="py-3 px-4 text-center">Apr 10, 2025</td>
                  <td className="py-3 px-4 text-center">
                    <Button variant="outline" size="sm">View Details</Button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Michael Brown</td>
                  <td className="py-3 px-4">michael@example.com</td>
                  <td className="py-3 px-4 text-right">5</td>
                  <td className="py-3 px-4 text-right">$400.00</td>
                  <td className="py-3 px-4 text-center">Apr 8, 2025</td>
                  <td className="py-3 px-4 text-center">
                    <Button variant="outline" size="sm">View Details</Button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Emily Wilson</td>
                  <td className="py-3 px-4">emily@example.com</td>
                  <td className="py-3 px-4 text-right">3</td>
                  <td className="py-3 px-4 text-right">$360.00</td>
                  <td className="py-3 px-4 text-center">Apr 5, 2025</td>
                  <td className="py-3 px-4 text-center">
                    <Button variant="outline" size="sm">View Details</Button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">David Chen</td>
                  <td className="py-3 px-4">david@example.com</td>
                  <td className="py-3 px-4 text-right">2</td>
                  <td className="py-3 px-4 text-right">$120.00</td>
                  <td className="py-3 px-4 text-center">Apr 1, 2025</td>
                  <td className="py-3 px-4 text-center">
                    <Button variant="outline" size="sm">View Details</Button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Lisa Walker</td>
                  <td className="py-3 px-4">lisa@example.com</td>
                  <td className="py-3 px-4 text-right">1</td>
                  <td className="py-3 px-4 text-right">$120.00</td>
                  <td className="py-3 px-4 text-center">Mar 25, 2025</td>
                  <td className="py-3 px-4 text-center">
                    <Button variant="outline" size="sm">View Details</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Client Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Repeat Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76%</div>
                <p className="text-xs text-muted-foreground mt-1">Clients who have booked more than once</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Client Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$392.00</div>
                <p className="text-xs text-muted-foreground mt-1">Average revenue per client</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">New Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground mt-1">New clients this month</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Reviews Tab Component
  const ReviewsTab = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">My Reviews</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">4.9</div>
            <div className="flex mt-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">Based on 28 reviews</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rating Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center">
              <div className="w-12">5 stars</div>
              <div className="flex-1 h-2 bg-muted mx-2 rounded-full overflow-hidden">
                <div className="bg-yellow-400 h-full rounded-full" style={{width: '90%'}}></div>
              </div>
              <div className="w-8 text-right">90%</div>
            </div>
            <div className="flex items-center">
              <div className="w-12">4 stars</div>
              <div className="flex-1 h-2 bg-muted mx-2 rounded-full overflow-hidden">
                <div className="bg-yellow-400 h-full rounded-full" style={{width: '7%'}}></div>
              </div>
              <div className="w-8 text-right">7%</div>
            </div>
            <div className="flex items-center">
              <div className="w-12">3 stars</div>
              <div className="flex-1 h-2 bg-muted mx-2 rounded-full overflow-hidden">
                <div className="bg-yellow-400 h-full rounded-full" style={{width: '3%'}}></div>
              </div>
              <div className="w-8 text-right">3%</div>
            </div>
            <div className="flex items-center">
              <div className="w-12">2 stars</div>
              <div className="flex-1 h-2 bg-muted mx-2 rounded-full overflow-hidden">
                <div className="bg-yellow-400 h-full rounded-full" style={{width: '0%'}}></div>
              </div>
              <div className="w-8 text-right">0%</div>
            </div>
            <div className="flex items-center">
              <div className="w-12">1 star</div>
              <div className="flex-1 h-2 bg-muted mx-2 rounded-full overflow-hidden">
                <div className="bg-yellow-400 h-full rounded-full" style={{width: '0%'}}></div>
              </div>
              <div className="w-8 text-right">0%</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Service Ratings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div>Home Cleaning</div>
              <div className="flex">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm">5.0</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>Deep Cleaning</div>
              <div className="flex">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm">4.9</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>Window Cleaning</div>
              <div className="flex">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 text-gray-300" />
                <span className="ml-1 text-sm">4.7</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockReviews.map(review => (
              <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-2 md:mb-0">
                    <div className="flex items-center">
                      <div className="font-medium">{review.client}</div>
                      <div className="mx-2 text-muted-foreground">·</div>
                      <div className="text-sm text-muted-foreground">{formatDate(review.date)}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{review.service}</div>
                  </div>
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-3">{review.comment}</div>
                
                {/* Response section */}
                <div className="mt-4 bg-muted/20 p-3 rounded-md">
                  <div className="font-medium mb-1">Your Response</div>
                  <div className="text-sm text-muted-foreground italic mb-3">
                    {review.id === '1' 
                      ? 'Thank you so much for your kind words! It was a pleasure working with you, and I look forward to serving you again in the future.'
                      : review.id === '2'
                      ? 'Thank you for your honest feedback. I apologize for the delay and will work on improving my time management for future services.'
                      : 'No response yet'}
                  </div>
                  {(review.id === '3' || review.id === '4') && (
                    <div className="flex space-x-2">
                      <input 
                        type="text" 
                        placeholder="Write a response..." 
                        className="flex-1 px-3 py-1 border rounded-md text-sm"
                      />
                      <Button size="sm" className="bg-servie hover:bg-servie-600">Respond</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Payments Tab Component
  const PaymentsTab = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Payments</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockEarnings.pendingPayout.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Next payout on April 30, 2025</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockEarnings.thisMonth.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockEarnings.thisMonth > mockEarnings.lastMonth 
                ? `↑ ${((mockEarnings.thisMonth - mockEarnings.lastMonth) / mockEarnings.lastMonth * 100).toFixed(1)}% from last month`
                : `↓ ${((mockEarnings.lastMonth - mockEarnings.thisMonth) / mockEarnings.lastMonth * 100).toFixed(1)}% from last month`
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockEarnings.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <CardTitle>Payment History</CardTitle>
            <div className="flex space-x-2 mt-2 md:mt-0">
              <input 
                type="month" 
                defaultValue="2025-04"
                className="px-3 py-1 border rounded-md text-sm"
              />
              <Button variant="outline" size="sm">Filter</Button>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">Apr 15, 2025</td>
                  <td className="py-3 px-4">Payout</td>
                  <td className="py-3 px-4 text-right">$1,120.00</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Completed</span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">Apr 14, 2025</td>
                  <td className="py-3 px-4">Home Cleaning - Sarah Johnson</td>
                  <td className="py-3 px-4 text-right">$120.00</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">Apr 12, 2025</td>
                  <td className="py-3 px-4">Deep Cleaning - Michael Brown</td>
                  <td className="py-3 px-4 text-right">$180.00</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">Apr 10, 2025</td>
                  <td className="py-3 px-4">Window Cleaning - Emily Wilson</td>
                  <td className="py-3 px-4 text-right">$60.00</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">Apr 1, 2025</td>
                  <td className="py-3 px-4">Payout</td>
                  <td className="py-3 px-4 text-right">$980.00</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Completed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center">
                <div className="w-10 h-6 mr-3">
                  <img src="https://via.placeholder.com/60x40?text=Bank" alt="Bank Account" className="h-full w-auto" />
                </div>
                <div>
                  <div className="font-medium">Bank Account</div>
                  <div className="text-sm text-muted-foreground">Ending in 4567</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-3">Default</span>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </div>
            
            <Button variant="outline">Add Payment Method</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Tax Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Tax ID</h4>
                <div className="p-3 border rounded-md">XXXXXXX123</div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tax Form</h4>
                <div className="p-3 border rounded-md">W-9 (submitted on Jan 15, 2025)</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Annual Tax Report</h4>
              <Button variant="outline">Download 2024 Tax Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Settings Tab Component
  const SettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Settings</h2>
      
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="profile">Public Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                    <input 
                      id="email" 
                      type="email" 
                      defaultValue={user?.email}
                      className="w-full px-3 py-2 border rounded-md"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Contact support to change your email address
                    </p>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                    <input 
                      id="phone" 
                      type="tel" 
                      defaultValue={user?.user_metadata?.phone || ""}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                    <input 
                      id="firstName" 
                      type="text" 
                      defaultValue={user?.user_metadata?.first_name || ""}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                    <input 
                      id="lastName" 
                      type="text" 
                      defaultValue={user?.user_metadata?.last_name || ""}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
                  <input 
                    id="address" 
                    type="text"
                    defaultValue={user?.user_metadata?.address || ""}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                    <input 
                      id="city" 
                      type="text"
                      defaultValue={user?.user_metadata?.city || ""}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium mb-1">State</label>
                    <input 
                      id="state" 
                      type="text"
                      defaultValue={user?.user_metadata?.state || ""}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="zip" className="block text-sm font-medium mb-1">Zip Code</label>
                    <input 
                      id="zip" 
                      type="text"
                      defaultValue={user?.user_metadata?.zip || ""}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="mt-4 bg-servie hover:bg-servie-600">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Public Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label htmlFor="profilePicture" className="block text-sm font-medium mb-3">Profile Picture</label>
                  <div className="flex items-center">
                    <div className="w-24 h-24 rounded-full bg-muted overflow-hidden mr-4">
                      <img 
                        src="https://randomuser.me/api/portraits/women/23.jpg" 
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button variant="outline" type="button">
                      Change Picture
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium mb-1">Business Name</label>
                  <input 
                    id="businessName" 
                    type="text"
                    defaultValue="Clean & Tidy Home Services"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="tagline" className="block text-sm font-medium mb-1">Tagline</label>
                  <input 
                    id="tagline" 
                    type="text"
                    defaultValue="Professional cleaning services for your home"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    A short description that appears under your name
                  </p>
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium mb-1">About Me</label>
                  <textarea 
                    id="bio" 
                    rows={4}
                    defaultValue="With over 5 years of experience in home cleaning, I provide professional and thorough cleaning services for homes of all sizes. I use eco-friendly cleaning products and pay attention to every detail to ensure your complete satisfaction."
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Specializations</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="spec1" defaultChecked />
                      <label htmlFor="spec1">Deep Cleaning</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="spec2" defaultChecked />
                      <label htmlFor="spec2">Regular Cleaning</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="spec3" defaultChecked />
                      <label htmlFor="spec3">Window Cleaning</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="spec4" />
                      <label htmlFor="spec4">Carpet Cleaning</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="spec5" />
                      <label htmlFor="spec5">Move In/Out Cleaning</label>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="mt-4 bg-servie hover:bg-servie-600">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="email-bookings">New booking notifications</label>
                      <input type="checkbox" id="email-bookings" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="email-reminders">Booking reminders</label>
                      <input type="checkbox" id="email-reminders" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="email-messages">New messages</label>
                      <input type="checkbox" id="email-messages" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="email-reviews">New reviews</label>
                      <input type="checkbox" id="email-reviews" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="email-payments">Payment notifications</label>
                      <input type="checkbox" id="email-payments" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="email-marketing">Marketing and newsletters</label>
                      <input type="checkbox" id="email-marketing" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">SMS Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="sms-bookings">New booking notifications</label>
                      <input type="checkbox" id="sms-bookings" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="sms-reminders">Booking reminders (24 hours before)</label>
                      <input type="checkbox" id="sms-reminders" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="sms-messages">New urgent messages</label>
                      <input type="checkbox" id="sms-messages" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="sms-payments">Payment notifications</label>
                      <input type="checkbox" id="sms-payments" />
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="mt-4 bg-servie hover:bg-servie-600">
                  Save Preferences
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Change Password</h3>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium mb-1">Current Password</label>
                      <input 
                        id="current-password" 
                        type="password"
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium mb-1">New Password</label>
                      <input 
                        id="new-password" 
                        type="password"
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">Confirm New Password</label>
                      <input 
                        id="confirm-password" 
                        type="password"
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <Button type="submit" className="bg-servie hover:bg-servie-600">
                      Update Password
                    </Button>
                  </form>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Two-Factor Authentication</h3>
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-muted-foreground">Add an extra layer of security to your account</div>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Login Sessions</h3>
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-medium">Current Session</div>
                        <div className="text-sm text-muted-foreground">Chrome on Windows • New York, USA • April 15, 2025</div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Current</span>
                    </div>
                    <Button variant="outline" className="text-red-500">Sign Out of All Other Sessions</Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Delete Account</h3>
                  <div className="p-4 border rounded-md border-red-200 bg-red-50">
                    <div className="mb-2 font-medium text-red-700">Delete Your Account</div>
                    <p className="text-sm text-red-600 mb-4">
                      Warning: This action is permanent and cannot be undone. All your data will be permanently removed.
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
  
  // Help Tab
  const HelpTab = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Help & Support</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Our provider support team is available Monday-Friday, 9am-6pm EST.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Open Support Ticket
                </Button>
              </div>
              <div className="flex items-center">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Provider Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <a href="#" className="block p-4 border rounded-md hover:bg-muted/50">
                <div className="font-medium">Provider Handbook</div>
                <p className="text-sm text-muted-foreground">
                  Complete guide to providing services on Servie
                </p>
              </a>
              <a href="#" className="block p-4 border rounded-md hover:bg-muted/50">
                <div className="font-medium">Service Quality Guidelines</div>
                <p className="text-sm text-muted-foreground">
                  How to deliver exceptional service quality
                </p>
              </a>
              <a href="#" className="block p-4 border rounded-md hover:bg-muted/50">
                <div className="font-medium">Handling Client Interactions</div>
                <p className="text-sm text-muted-foreground">
                  Best practices for client communication
                </p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <h4 className="font-medium">How do I modify a booking?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                To modify a booking, go to the Bookings tab and select the booking you want to change. Click on "Details" and then use the "Modify Booking" button. You can change the date, time, or duration, and the client will be notified of the requested changes.
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <h4 className="font-medium">When will I receive my payments?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Payments are processed on the 1st and 15th of each month for all services that were completed at least 3 days prior to the payout date. Funds typically arrive in your bank account within 2-3 business days after processing.
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <h4 className="font-medium">How do I respond to a client review?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Navigate to the Reviews tab to see all your client reviews. For any review without a response, you'll see a text input field. Type your response and click "Respond" to publish your reply to the client's review.
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <h4 className="font-medium">What happens if I need to cancel a booking?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                If you need to cancel a booking, go to the booking details and use the cancellation option. Please note that frequent cancellations may affect your provider status. It's always better to reschedule if possible rather than cancel entirely.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        {/* Mobile sidebar toggle */}
        <div className="md:hidden p-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Mobile sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
            <div className="fixed inset-y-0 left-0 z-50 w-64 bg-background shadow-lg">
              <div className="flex justify-end p-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
              <ProviderSidebar />
            </div>
          </div>
        )}
        
        {/* Desktop sidebar */}
        <ProviderSidebar />
        
        {/* Main content */}
        <div className="flex-1 p-6 md:p-10 bg-muted/20">
          {renderTabContent()}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
