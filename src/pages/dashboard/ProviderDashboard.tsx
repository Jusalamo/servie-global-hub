import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Star, ChevronRight, Bell, MessageSquare, User, CalendarDays, Settings, Plus, DollarSign, PieChart, BarChart2, ListPlus, Calendar as CalendarIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { services, bookings, users } from "@/data/mockData";

// Use the first provider for demo purposes
const providerUser = users.find(user => user.role === "provider");

// Get provider services
const providerServices = services.filter(service => 
  providerUser?.services?.includes(service.id)
);

// Get provider bookings
const providerBookings = bookings.filter(booking => 
  providerUser?.services?.includes(booking.serviceId)
);

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar Navigation */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={providerUser?.avatar} alt={providerUser?.name} />
                    <AvatarFallback>{providerUser?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center space-y-1">
                    <h2 className="font-semibold text-lg">{providerUser?.name}</h2>
                    <p className="text-sm text-muted-foreground">{providerUser?.location}</p>
                    <div className="flex items-center justify-center mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-medium">{providerUser?.rating?.toFixed(1)}</span>
                      <span className="text-muted-foreground text-xs ml-1">({providerUser?.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Navigation Menu */}
            <div className="hidden lg:block space-y-1">
              <Button 
                variant={activeTab === "overview" ? "secondary" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => setActiveTab("overview")}
              >
                <PieChart className="w-4 h-4 mr-2" />
                Overview
              </Button>
              <Button 
                variant={activeTab === "services" ? "secondary" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => setActiveTab("services")}
              >
                <ListPlus className="w-4 h-4 mr-2" />
                My Services
              </Button>
              <Button 
                variant={activeTab === "bookings" ? "secondary" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => setActiveTab("bookings")}
              >
                <CalendarDays className="w-4 h-4 mr-2" />
                Bookings
              </Button>
              <Button 
                variant={activeTab === "calendar" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("calendar")}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Calendar
              </Button>
              <Button 
                variant={activeTab === "earnings" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("earnings")}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Earnings
              </Button>
              <Button 
                variant={activeTab === "analytics" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("analytics")}
              >
                <BarChart2 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button 
                variant={activeTab === "messages" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("messages")}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </Button>
              <Button 
                variant={activeTab === "settings" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
            
            {/* Mobile Navigation */}
            <div className="lg:hidden">
              <Tabs defaultValue="overview" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                </TabsList>
                <div className="flex justify-between mb-6">
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("earnings")}>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Earnings
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("messages")}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Messages
                  </Button>
                </div>
              </Tabs>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="space-y-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold">Dashboard</h1>
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Active Bookings</CardDescription>
                      <CardTitle className="text-2xl">
                        {providerBookings.filter(b => b.status === "scheduled" || b.status === "in-progress").length}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Completed Services</CardDescription>
                      <CardTitle className="text-2xl">
                        {providerBookings.filter(b => b.status === "completed").length}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Services</CardDescription>
                      <CardTitle className="text-2xl">
                        {providerServices.length}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </div>
                
                {/* Upcoming Bookings */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Upcoming Bookings</CardTitle>
                      <Button variant="link" size="sm" asChild>
                        <Link to="#" onClick={() => setActiveTab("bookings")}>
                          View All
                          <ChevronRight className="ml-1 w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {providerBookings.filter(b => b.status === "scheduled" || b.status === "in-progress").length > 0 ? (
                      <div className="space-y-4">
                        {providerBookings
                          .filter(b => b.status === "scheduled" || b.status === "in-progress")
                          .map((booking) => {
                            const service = services.find(s => s.id === booking.serviceId);
                            return (
                              <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={service?.imageUrl}
                                    alt={service?.title}
                                    className="w-12 h-12 rounded-md object-cover"
                                  />
                                  <div>
                                    <h4 className="font-medium">{service?.title}</h4>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Calendar className="w-3 h-3" />
                                      {booking.date}
                                      <Clock className="w-3 h-3 ml-2" />
                                      {booking.time}
                                    </div>
                                  </div>
                                </div>
                                <Badge variant={booking.status === "in-progress" ? "default" : "outline"}>
                                  {booking.status === "scheduled" ? "Upcoming" : "In Progress"}
                                </Badge>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No upcoming bookings</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Recent Earnings */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Earnings</CardTitle>
                      <Button variant="link" size="sm" asChild>
                        <Link to="#" onClick={() => setActiveTab("earnings")}>
                          View All
                          <ChevronRight className="ml-1 w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* This would connect to actual earning data in a real app */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium">Website Development</p>
                            <p className="text-sm text-muted-foreground">Nov 15, 2023</p>
                          </div>
                        </div>
                        <span className="font-bold text-green-600 dark:text-green-400">+$350.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium">Service Commission</p>
                            <p className="text-sm text-muted-foreground">Nov 15, 2023</p>
                          </div>
                        </div>
                        <span className="font-bold text-red-600 dark:text-red-400">-$24.50</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Services Tab */}
            {activeTab === "services" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold">My Services</h1>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Service
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {providerServices.map((service) => (
                    <Card key={service.id} className="overflow-hidden">
                      <div className="relative h-40">
                        <img 
                          src={service.imageUrl} 
                          alt={service.title} 
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-3 left-3 bg-background/80 text-foreground">
                          {service.category}
                        </Badge>
                        {service.featured && (
                          <Badge className="absolute top-3 right-3 bg-servie">Featured</Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{service.rating.toFixed(1)}</span>
                          <span className="text-sm text-muted-foreground">({service.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            From {service.currency}{Math.min(...service.packages.map(p => p.price))}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {service.packages.length} packages
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Button variant="outline" className="flex-1" asChild>
                          <Link to={`/service/${service.id}`}>Preview</Link>
                        </Button>
                        <Button className="flex-1">Edit</Button>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  {/* Add New Service Card */}
                  <Card className="border-dashed border-2 flex flex-col justify-center items-center h-[330px]">
                    <CardContent className="flex flex-col items-center justify-center text-center p-6">
                      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium text-lg mb-2">Add a New Service</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create a new service listing to reach more clients
                      </p>
                      <Button>Create Service</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold">Bookings</h1>
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Search bookings..." 
                      className="max-w-xs"
                      startIcon={<Search className="h-4 w-4" />}
                    />
                  </div>
                </div>
                
                <Tabs defaultValue="upcoming">
                  <TabsList className="w-full max-w-md">
                    <TabsTrigger value="upcoming" className="flex-1">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled" className="flex-1">Cancelled</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upcoming" className="mt-6 space-y-4">
                    {providerBookings.filter(b => b.status === "scheduled" || b.status === "in-progress").length > 0 ? (
                      providerBookings
                        .filter(b => b.status === "scheduled" || b.status === "in-progress")
                        .map((booking) => {
                          const service = services.find(s => s.id === booking.serviceId);
                          const packageInfo = service?.packages.find(p => p.id === booking.packageId);
                          
                          return (
                            <Card key={booking.id}>
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <img
                                      src={service?.imageUrl}
                                      alt={service?.title}
                                      className="w-16 h-16 rounded-md object-cover"
                                    />
                                    <div>
                                      <h3 className="font-medium">{service?.title}</h3>
                                      <p className="text-sm text-muted-foreground">{packageInfo?.name} Package</p>
                                      <div className="flex items-center mt-1 text-sm">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        <span>{booking.date}</span>
                                        <Clock className="w-3 h-3 ml-3 mr-1" />
                                        <span>{booking.time}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <Badge variant={booking.status === "in-progress" ? "default" : "outline"}>
                                      {booking.status === "scheduled" ? "Upcoming" : "In Progress"}
                                    </Badge>
                                    <span className="font-bold">{booking.currency}{booking.price}</span>
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm">Message Client</Button>
                                      <Button size="sm">
                                        {booking.status === "scheduled" ? "Start Service" : "Complete"}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-xl font-medium mb-2">No upcoming bookings</h3>
                        <p className="text-muted-foreground">You have no scheduled or in-progress services</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="completed" className="mt-6 space-y-4">
                    {providerBookings.filter(b => b.status === "completed").length > 0 ? (
                      providerBookings
                        .filter(b => b.status === "completed")
                        .map((booking) => {
                          const service = services.find(s => s.id === booking.serviceId);
                          const packageInfo = service?.packages.find(p => p.id === booking.packageId);
                          
                          return (
                            <Card key={booking.id}>
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <img
                                      src={service?.imageUrl}
                                      alt={service?.title}
                                      className="w-16 h-16 rounded-md object-cover"
                                    />
                                    <div>
                                      <h3 className="font-medium">{service?.title}</h3>
                                      <p className="text-sm text-muted-foreground">{packageInfo?.name} Package</p>
                                      <div className="flex items-center mt-1 text-sm">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        <span>{booking.date}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <Badge variant="outline">Completed</Badge>
                                    <span className="font-bold">{booking.currency}{booking.price}</span>
                                    {booking.clientReview && (
                                      <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm">{booking.clientReview.rating}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-xl font-medium mb-2">No completed services</h3>
                        <p className="text-muted-foreground">You have no completed services yet</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="cancelled" className="mt-6 space-y-4">
                    <div className="text-center py-12">
                      <h3 className="text-xl font-medium mb-2">No cancelled bookings</h3>
                      <p className="text-muted-foreground">You have no cancelled bookings</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            {/* Other tabs would be implemented here */}
            {activeTab === "calendar" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Calendar</h1>
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">The calendar feature will be implemented in a future update</p>
                  <Button onClick={() => setActiveTab("overview")}>Go Back to Dashboard</Button>
                </div>
              </div>
            )}
            
            {activeTab === "earnings" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Earnings</h1>
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">The earnings dashboard will be implemented in a future update</p>
                  <Button onClick={() => setActiveTab("overview")}>Go Back to Dashboard</Button>
                </div>
              </div>
            )}
            
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Analytics</h1>
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Service performance analytics will be implemented in a future update</p>
                  <Button onClick={() => setActiveTab("overview")}>Go Back to Dashboard</Button>
                </div>
              </div>
            )}
            
            {activeTab === "messages" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Messages</h1>
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">The messaging system will be implemented in a future update</p>
                  <Button onClick={() => setActiveTab("overview")}>Go Back to Dashboard</Button>
                </div>
              </div>
            )}
            
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Settings</h1>
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Account settings will be implemented in a future update</p>
                  <Button onClick={() => setActiveTab("overview")}>Go Back to Dashboard</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProviderDashboard;
