
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProviderSidebar from "@/components/dashboard/ProviderSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Calendar, CheckCircle2, Clock, DollarSign, Edit, ExternalLink, FileText, MoreHorizontal, Plus, Star, Trash2, TrendingUp, User2, Users } from "lucide-react";
import { format } from "date-fns";

// Mock data for provider dashboard
const providerData = {
  name: "John Provider",
  avatar: "https://via.placeholder.com/150",
  rating: 4.8,
  reviewCount: 124,
  completedServices: 152,
  earnings: {
    total: 12580,
    pending: 1240,
    thisMonth: 2450,
    lastMonth: 2120
  },
  services: [
    {
      id: 1,
      title: "Professional Plumbing Service",
      description: "Full plumbing services for residential and commercial properties",
      price: 80,
      unit: "hour",
      bookings: 48,
      rating: 4.9,
      category: "Home Services",
      image: "https://via.placeholder.com/300?text=Plumbing",
      isActive: true
    },
    {
      id: 2,
      title: "Electrical Installations",
      description: "Indoor and outdoor electrical installation services",
      price: 90,
      unit: "hour",
      bookings: 36,
      rating: 4.7,
      category: "Home Services",
      image: "https://via.placeholder.com/300?text=Electrical",
      isActive: true
    },
    {
      id: 3,
      title: "House Painting",
      description: "Interior and exterior painting services",
      price: 35,
      unit: "sqm",
      bookings: 29,
      rating: 4.5,
      category: "Home Services",
      image: "https://via.placeholder.com/300?text=Painting",
      isActive: false
    },
    {
      id: 4,
      title: "Lawn Maintenance",
      description: "Regular lawn mowing and garden maintenance",
      price: 45,
      unit: "visit",
      bookings: 39,
      rating: 4.8,
      category: "Gardening",
      image: "https://via.placeholder.com/300?text=Lawn",
      isActive: true
    }
  ],
  products: [
    {
      id: 101,
      name: "Premium Tools Set",
      price: 129.99,
      inventory: 15,
      sold: 42,
      image: "https://via.placeholder.com/300?text=Tools"
    },
    {
      id: 102,
      name: "Safety Equipment Kit",
      price: 89.99,
      inventory: 8,
      sold: 27,
      image: "https://via.placeholder.com/300?text=Safety"
    },
    {
      id: 103,
      name: "Professional Work Gloves",
      price: 24.99,
      inventory: 32,
      sold: 56,
      image: "https://via.placeholder.com/300?text=Gloves"
    }
  ],
  bookings: [
    {
      id: 1001,
      service: "Professional Plumbing Service",
      client: "Emma Wilson",
      date: new Date("2025-05-12T14:30:00"),
      status: "confirmed",
      price: 160
    },
    {
      id: 1002,
      service: "Electrical Installations",
      client: "James Miller",
      date: new Date("2025-05-14T10:00:00"),
      status: "confirmed",
      price: 270
    },
    {
      id: 1003,
      service: "Lawn Maintenance",
      client: "Sophia Brown",
      date: new Date("2025-05-15T09:00:00"),
      status: "pending",
      price: 45
    },
    {
      id: 1004,
      service: "Professional Plumbing Service",
      client: "Michael Johnson",
      date: new Date("2025-05-10T13:00:00"),
      status: "completed",
      price: 240
    },
    {
      id: 1005,
      service: "House Painting",
      client: "Olivia Davis",
      date: new Date("2025-05-08T11:00:00"),
      status: "cancelled",
      price: 525
    }
  ],
  clients: [
    {
      id: 2001,
      name: "Emma Wilson",
      email: "emma.wilson@example.com",
      bookings: 3,
      totalSpent: 480,
      lastBooking: new Date("2025-05-12T14:30:00")
    },
    {
      id: 2002,
      name: "James Miller",
      email: "james.miller@example.com",
      bookings: 2,
      totalSpent: 390,
      lastBooking: new Date("2025-05-14T10:00:00")
    },
    {
      id: 2003,
      name: "Sophia Brown",
      email: "sophia.brown@example.com",
      bookings: 1,
      totalSpent: 45,
      lastBooking: new Date("2025-05-15T09:00:00")
    },
    {
      id: 2004,
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      bookings: 4,
      totalSpent: 720,
      lastBooking: new Date("2025-05-10T13:00:00")
    },
    {
      id: 2005,
      name: "Olivia Davis",
      email: "olivia.davis@example.com",
      bookings: 2,
      totalSpent: 825,
      lastBooking: new Date("2025-05-08T11:00:00")
    }
  ],
  reviews: [
    {
      id: 3001,
      service: "Professional Plumbing Service",
      client: "Michael Johnson",
      date: new Date("2025-05-10"),
      rating: 5,
      comment: "Excellent service, fixed my leaking pipes quickly and professionally."
    },
    {
      id: 3002,
      service: "Electrical Installations",
      client: "James Miller",
      date: new Date("2025-05-02"),
      rating: 4,
      comment: "Good work installing new light fixtures, but arrived a bit late."
    },
    {
      id: 3003,
      service: "Lawn Maintenance",
      client: "Emma Wilson",
      date: new Date("2025-04-28"),
      rating: 5,
      comment: "My lawn has never looked better! Very thorough service."
    },
    {
      id: 3004,
      service: "House Painting",
      client: "Olivia Davis",
      date: new Date("2025-04-23"),
      rating: 4,
      comment: "Great attention to detail with the painting. Just took longer than expected."
    }
  ],
  schedule: [
    {
      id: 4001,
      title: "Plumbing Service - Emma Wilson",
      date: new Date("2025-05-12T14:30:00"),
      duration: 2,
      location: "123 Main St, Cityville"
    },
    {
      id: 4002,
      title: "Electrical Work - James Miller",
      date: new Date("2025-05-14T10:00:00"),
      duration: 3,
      location: "456 Oak Ave, Townsburg"
    },
    {
      id: 4003,
      title: "Lawn Maintenance - Sophia Brown",
      date: new Date("2025-05-15T09:00:00"),
      duration: 1,
      location: "789 Pine Rd, Villagetown"
    }
  ],
  analytics: {
    weeklyBookings: [12, 8, 15, 10, 9, 14, 11],
    monthlyEarnings: [2100, 1890, 2340, 2450, 2120, 2580, 2300, 2450, 2680, 2890, 3020, 2780],
    servicePopularity: {
      "Professional Plumbing Service": 48,
      "Electrical Installations": 36,
      "House Painting": 29,
      "Lawn Maintenance": 39
    },
    customerSatisfaction: 92
  }
};

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/dashboard/provider?tab=${value}`);
  };

  // Function to format date with appropriate formatting options
  const formatDate = (date: Date) => {
    return format(date, "MMM d, yyyy");
  };
  
  // Function to format date and time
  const formatDateTime = (date: Date) => {
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };
  
  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "confirmed": return "bg-blue-500";
      case "pending": return "bg-yellow-500";
      case "completed": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="flex h-full">
          {/* Sidebar */}
          <ProviderSidebar />
          
          {/* Main content */}
          <div className="flex-1 p-6 overflow-auto">
            <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">Provider Dashboard</h1>
                <p className="text-muted-foreground">Manage your services and bookings</p>
              </div>
              
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="services">My Services</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="clients">Clients</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Earnings
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${providerData.earnings.total.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        +${(providerData.earnings.thisMonth - providerData.earnings.lastMonth).toLocaleString()} from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Services Completed
                      </CardTitle>
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{providerData.completedServices}</div>
                      <p className="text-xs text-muted-foreground">
                        {providerData.bookings.filter(b => b.status === "confirmed").length} pending bookings
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Client Rating
                      </CardTitle>
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{providerData.rating} / 5</div>
                      <p className="text-xs text-muted-foreground">
                        From {providerData.reviewCount} reviews
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Client Satisfaction
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{providerData.analytics.customerSatisfaction}%</div>
                      <Progress value={providerData.analytics.customerSatisfaction} className="h-2" />
                    </CardContent>
                  </Card>
                </div>
                
                {/* Recent Bookings and Charts */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  {/* Left Charts Column */}
                  <Card className="md:col-span-2 lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Monthly Earnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px] w-full bg-muted rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Earnings Chart Visualization</p>
                        <p className="text-xs text-muted-foreground">(Would display real chart with data from providerData.analytics.monthlyEarnings)</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Right Recent Bookings Column */}
                  <Card className="md:col-span-2 lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Upcoming Bookings</CardTitle>
                      <CardDescription>
                        You have {providerData.bookings.filter(b => b.status === "confirmed").length} upcoming bookings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {providerData.bookings
                          .filter(booking => booking.status === "confirmed")
                          .slice(0, 3)
                          .map(booking => (
                            <div key={booking.id} className="flex items-center">
                              <div className="space-y-1">
                                <p className="text-sm font-medium">{booking.service}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDateTime(booking.date)} • ${booking.price}
                                </p>
                              </div>
                              <div className="ml-auto font-medium">
                                Client: {booking.client}
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Service popularity and Recent reviews */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  {/* Service Popularity */}
                  <Card className="md:col-span-2 lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Service Popularity</CardTitle>
                      <CardDescription>
                        Number of bookings per service
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(providerData.analytics.servicePopularity).map(([service, count]) => (
                          <div key={service} className="flex items-center">
                            <div className="space-y-1 flex-1">
                              <p className="text-sm font-medium">{service}</p>
                              <Progress 
                                value={(count / Math.max(...Object.values(providerData.analytics.servicePopularity))) * 100} 
                                className="h-2" 
                              />
                            </div>
                            <div className="ml-auto font-medium">{count}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Recent Reviews */}
                  <Card className="md:col-span-2 lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Recent Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {providerData.reviews.slice(0, 3).map(review => (
                          <div key={review.id} className="space-y-1">
                            <div className="flex items-center">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-sm font-medium">{review.client}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(review.date)} • {review.service}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Services Tab */}
              <TabsContent value="services" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>My Services</CardTitle>
                      <CardDescription>Manage and update your service offerings</CardDescription>
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Service
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 p-4 font-medium border-b">
                        <div className="col-span-5">Service</div>
                        <div className="col-span-2 text-center">Price</div>
                        <div className="col-span-2 text-center">Bookings</div>
                        <div className="col-span-2 text-center">Rating</div>
                        <div className="col-span-1 text-right">Actions</div>
                      </div>
                      {providerData.services.map(service => (
                        <div key={service.id} className="grid grid-cols-12 p-4 items-center border-b hover:bg-muted/50">
                          <div className="col-span-5 flex items-center">
                            <img
                              src={service.image}
                              alt={service.title}
                              className="h-10 w-10 rounded mr-4 object-cover"
                            />
                            <div>
                              <p className="font-medium">{service.title}</p>
                              <p className="text-sm text-muted-foreground">{service.category}</p>
                            </div>
                            {!service.isActive && (
                              <Badge variant="outline" className="ml-2">
                                Inactive
                              </Badge>
                            )}
                          </div>
                          <div className="col-span-2 text-center">
                            ${service.price}/{service.unit}
                          </div>
                          <div className="col-span-2 text-center">{service.bookings}</div>
                          <div className="col-span-2 text-center flex items-center justify-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                            {service.rating}
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Bookings Tab */}
              <TabsContent value="bookings" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>All Bookings</CardTitle>
                      <CardDescription>Manage your bookings and appointments</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Calendar View
                      </Button>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Booking
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 p-4 font-medium border-b">
                        <div className="col-span-3">Service</div>
                        <div className="col-span-2">Client</div>
                        <div className="col-span-3">Date & Time</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1 text-center">Price</div>
                        <div className="col-span-1 text-right">Actions</div>
                      </div>
                      {providerData.bookings.map(booking => (
                        <div key={booking.id} className="grid grid-cols-12 p-4 items-center border-b hover:bg-muted/50">
                          <div className="col-span-3">{booking.service}</div>
                          <div className="col-span-2">{booking.client}</div>
                          <div className="col-span-3">{formatDateTime(booking.date)}</div>
                          <div className="col-span-2">
                            <Badge className={`${getStatusColor(booking.status)} text-white`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="col-span-1 text-center">${booking.price}</div>
                          <div className="col-span-1 flex justify-end">
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Schedule Tab */}
              <TabsContent value="schedule" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>My Schedule</CardTitle>
                    <CardDescription>View and manage your upcoming appointments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border p-4">
                      <div className="h-[400px] bg-muted rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Calendar View Would Appear Here</p>
                        <p className="text-xs text-muted-foreground">(Would display full calendar with bookings)</p>
                      </div>
                      <div className="mt-6">
                        <h3 className="font-medium mb-4">Upcoming Appointments</h3>
                        <div className="space-y-4">
                          {providerData.schedule.map(event => (
                            <div key={event.id} className="p-3 border rounded-md flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{event.title}</h4>
                                <div className="text-sm text-muted-foreground flex items-center mt-1">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {formatDateTime(event.date)} ({event.duration} {event.duration === 1 ? 'hour' : 'hours'})
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center mt-1">
                                  <User2 className="h-4 w-4 mr-1" />
                                  {event.location}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">Reschedule</Button>
                                <Button size="sm">View Details</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Clients Tab */}
              <TabsContent value="clients" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Clients</CardTitle>
                    <CardDescription>View and manage your client relationships</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 p-4 font-medium border-b">
                        <div className="col-span-3">Name</div>
                        <div className="col-span-3">Email</div>
                        <div className="col-span-2 text-center">Bookings</div>
                        <div className="col-span-2 text-center">Total Spent</div>
                        <div className="col-span-2">Last Booking</div>
                      </div>
                      {providerData.clients.map(client => (
                        <div key={client.id} className="grid grid-cols-12 p-4 items-center border-b hover:bg-muted/50">
                          <div className="col-span-3 font-medium">{client.name}</div>
                          <div className="col-span-3">{client.email}</div>
                          <div className="col-span-2 text-center">{client.bookings}</div>
                          <div className="col-span-2 text-center">${client.totalSpent}</div>
                          <div className="col-span-2">{formatDate(client.lastBooking)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Reviews</CardTitle>
                    <CardDescription>See what your clients are saying about your services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {providerData.reviews.map(review => (
                        <div key={review.id} className="border rounded-lg p-4 hover:bg-muted/50">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">{review.service}</h4>
                              <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-muted-foreground">
                                  {formatDate(review.date)}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm font-medium">{review.client}</div>
                          </div>
                          <p className="mt-3 text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Payments Tab */}
              <TabsContent value="payments" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Payments & Earnings</CardTitle>
                      <CardDescription>Track your earnings and payment history</CardDescription>
                    </div>
                    <Button>Download Statement</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Total Earnings
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">${providerData.earnings.total.toLocaleString()}</div>
                          <p className="text-xs text-muted-foreground">
                            Lifetime earnings from all services
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            This Month
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">${providerData.earnings.thisMonth.toLocaleString()}</div>
                          <div className="flex items-center text-xs text-green-500">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            +{Math.round((providerData.earnings.thisMonth - providerData.earnings.lastMonth) / providerData.earnings.lastMonth * 100)}% from last month
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Pending Payments
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">${providerData.earnings.pending.toLocaleString()}</div>
                          <p className="text-xs text-muted-foreground">
                            Will be processed within 7 days
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 p-4 font-medium border-b">
                        <div className="col-span-3">Service</div>
                        <div className="col-span-3">Client</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2 text-center">Amount</div>
                        <div className="col-span-2 text-right">Status</div>
                      </div>
                      {/* Generate payment history from bookings */}
                      {providerData.bookings
                        .filter(booking => booking.status === "completed" || booking.status === "confirmed")
                        .map(booking => (
                          <div key={booking.id} className="grid grid-cols-12 p-4 items-center border-b hover:bg-muted/50">
                            <div className="col-span-3">{booking.service}</div>
                            <div className="col-span-3">{booking.client}</div>
                            <div className="col-span-2">{formatDate(booking.date)}</div>
                            <div className="col-span-2 text-center">${booking.price}</div>
                            <div className="col-span-2 text-right">
                              <Badge className={`${booking.status === "completed" ? "bg-green-500" : "bg-blue-500"} text-white`}>
                                {booking.status === "completed" ? "Paid" : "Pending"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Products Tab */}
              <TabsContent value="products" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>My Products</CardTitle>
                      <CardDescription>Manage the products you sell alongside your services</CardDescription>
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Product
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 p-4 font-medium border-b">
                        <div className="col-span-4">Product</div>
                        <div className="col-span-2 text-center">Price</div>
                        <div className="col-span-2 text-center">Inventory</div>
                        <div className="col-span-2 text-center">Sold</div>
                        <div className="col-span-2 text-right">Actions</div>
                      </div>
                      {providerData.products.map(product => (
                        <div key={product.id} className="grid grid-cols-12 p-4 items-center border-b hover:bg-muted/50">
                          <div className="col-span-4 flex items-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-10 w-10 rounded mr-4 object-cover"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                            </div>
                          </div>
                          <div className="col-span-2 text-center">
                            ${product.price}
                          </div>
                          <div className="col-span-2 text-center">
                            {product.inventory} units
                          </div>
                          <div className="col-span-2 text-center">
                            {product.sold} units
                          </div>
                          <div className="col-span-2 flex justify-end">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Provider Settings</CardTitle>
                    <CardDescription>Manage your profile and account settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Profile Section */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Profile Information</h3>
                        <div className="flex items-center gap-4 mb-6">
                          <Avatar className="h-20 w-20">
                            <img src={providerData.avatar} alt={providerData.name} />
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{providerData.name}</h4>
                            <p className="text-sm text-muted-foreground">Provider since January 2025</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              Update Photo
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="text-sm font-medium">Full Name</label>
                            <input 
                              type="text" 
                              className="w-full mt-1 px-3 py-2 border rounded-md"
                              defaultValue={providerData.name} 
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Email Address</label>
                            <input 
                              type="email" 
                              className="w-full mt-1 px-3 py-2 border rounded-md"
                              defaultValue="john.provider@example.com" 
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Phone Number</label>
                            <input 
                              type="tel" 
                              className="w-full mt-1 px-3 py-2 border rounded-md"
                              defaultValue="+1 (555) 123-4567" 
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Service Area</label>
                            <input 
                              type="text" 
                              className="w-full mt-1 px-3 py-2 border rounded-md"
                              defaultValue="New York City, NY" 
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <label className="text-sm font-medium">Bio</label>
                          <textarea 
                            className="w-full mt-1 px-3 py-2 border rounded-md"
                            rows={4}
                            defaultValue="Professional service provider with over 10 years of experience in home services including plumbing, electrical work, and general maintenance." 
                          />
                        </div>
                        
                        <Button className="mt-4">Save Profile Information</Button>
                      </div>
                      
                      {/* Business Information */}
                      <div className="pt-6 border-t">
                        <h3 className="text-lg font-medium mb-4">Business Information</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="text-sm font-medium">Business Name</label>
                            <input 
                              type="text" 
                              className="w-full mt-1 px-3 py-2 border rounded-md"
                              defaultValue="JP Home Services" 
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Business Registration Number</label>
                            <input 
                              type="text" 
                              className="w-full mt-1 px-3 py-2 border rounded-md"
                              defaultValue="BRN-12345678" 
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Tax ID</label>
                            <input 
                              type="text" 
                              className="w-full mt-1 px-3 py-2 border rounded-md"
                              defaultValue="123-45-6789" 
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Years in Business</label>
                            <input 
                              type="number" 
                              className="w-full mt-1 px-3 py-2 border rounded-md"
                              defaultValue="10" 
                            />
                          </div>
                        </div>
                        
                        <Button className="mt-4">Update Business Information</Button>
                      </div>
                      
                      {/* Account Settings */}
                      <div className="pt-6 border-t">
                        <h3 className="text-lg font-medium mb-4">Account Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Email Notifications</h4>
                              <p className="text-sm text-muted-foreground">Receive email notifications for new bookings and messages</p>
                            </div>
                            <div className="flex items-center h-6">
                              <input type="checkbox" defaultChecked className="h-4 w-4" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">SMS Notifications</h4>
                              <p className="text-sm text-muted-foreground">Receive text messages for urgent updates</p>
                            </div>
                            <div className="flex items-center h-6">
                              <input type="checkbox" className="h-4 w-4" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Automatic Booking Confirmation</h4>
                              <p className="text-sm text-muted-foreground">Automatically confirm new bookings</p>
                            </div>
                            <div className="flex items-center h-6">
                              <input type="checkbox" defaultChecked className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                        
                        <Button className="mt-4">Save Settings</Button>
                      </div>
                      
                      {/* Password Changes */}
                      <div className="pt-6 border-t">
                        <h3 className="text-lg font-medium mb-4">Change Password</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Current Password</label>
                            <input 
                              type="password" 
                              className="w-full mt-1 px-3 py-2 border rounded-md" 
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">New Password</label>
                            <input 
                              type="password" 
                              className="w-full mt-1 px-3 py-2 border rounded-md" 
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Confirm New Password</label>
                            <input 
                              type="password" 
                              className="w-full mt-1 px-3 py-2 border rounded-md" 
                            />
                          </div>
                        </div>
                        
                        <Button className="mt-4">Change Password</Button>
                      </div>
                      
                      {/* Danger Zone */}
                      <div className="pt-6 border-t">
                        <h3 className="text-lg font-medium mb-4 text-red-500">Danger Zone</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Deactivate Account</h4>
                              <p className="text-sm text-muted-foreground">Temporarily hide your services and profile</p>
                            </div>
                            <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-500/10">
                              Deactivate
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Delete Account</h4>
                              <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                            </div>
                            <Button variant="destructive">
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProviderDashboard;
