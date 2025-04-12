import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Star, ChevronRight, Bell, MessageSquare, User, Heart, CalendarDays, Settings, CreditCard, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { services, bookings, users } from "@/data/mockData";

// Use the first client for demo purposes
const clientUser = users.find(user => user.role === "client");

// Get client bookings
const clientBookings = bookings.filter(booking => booking.clientId === clientUser?.id);

// Get favorite services
const favoriteServices = clientUser?.favorites ? 
  services.filter(service => clientUser.favorites?.includes(service.id)) : 
  services.slice(0, 3); // Just show 3 random services if no favorites

const ClientDashboard = () => {
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
                    <AvatarImage src={clientUser?.avatar} alt={clientUser?.name} />
                    <AvatarFallback>{clientUser?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center space-y-1">
                    <h2 className="font-semibold text-lg">{clientUser?.name}</h2>
                    <p className="text-sm text-muted-foreground">{clientUser?.location}</p>
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
                <User className="w-4 h-4 mr-2" />
                Overview
              </Button>
              <Button 
                variant={activeTab === "bookings" ? "secondary" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => setActiveTab("bookings")}
              >
                <CalendarDays className="w-4 h-4 mr-2" />
                My Bookings
              </Button>
              <Button 
                variant={activeTab === "favorites" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("favorites")}
              >
                <Heart className="w-4 h-4 mr-2" />
                Favorites
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
                variant={activeTab === "payments" ? "secondary" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("payments")}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Payment Methods
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
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>
                <div className="flex justify-between mb-6">
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("messages")}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Messages
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("settings")}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
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
                      <CardDescription>Upcoming Bookings</CardDescription>
                      <CardTitle className="text-2xl">
                        {clientBookings.filter(b => b.status === "scheduled").length}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>In Progress</CardDescription>
                      <CardTitle className="text-2xl">
                        {clientBookings.filter(b => b.status === "in-progress").length}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Completed Services</CardDescription>
                      <CardTitle className="text-2xl">
                        {clientBookings.filter(b => b.status === "completed").length}
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
                    {clientBookings.filter(b => b.status === "scheduled" || b.status === "in-progress").length > 0 ? (
                      <div className="space-y-4">
                        {clientBookings
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
                        <Button className="mt-4" asChild>
                          <Link to="/categories">Find Services</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Favorite Services */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Favorite Services</CardTitle>
                      <Button variant="link" size="sm" asChild>
                        <Link to="#" onClick={() => setActiveTab("favorites")}>
                          View All
                          <ChevronRight className="ml-1 w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {favoriteServices.map((service) => (
                        <div key={service.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <img
                              src={service.imageUrl}
                              alt={service.title}
                              className="w-12 h-12 rounded-md object-cover"
                            />
                            <div>
                              <h4 className="font-medium">{service.title}</h4>
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{service.rating.toFixed(1)}</span>
                                <span className="text-muted-foreground">({service.reviewCount})</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/service/${service.id}`}>
                              View
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold">My Bookings</h1>
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
                    {clientBookings.filter(b => b.status === "scheduled" || b.status === "in-progress").length > 0 ? (
                      clientBookings
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
                                    <Button variant="outline" size="sm">View Details</Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-xl font-medium mb-2">No upcoming bookings</h3>
                        <p className="text-muted-foreground mb-6">You have no scheduled or in-progress services</p>
                        <Button className="mt-4" asChild>
                          <Link to="/categories">Find Services</Link>
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="completed" className="mt-6 space-y-4">
                    {clientBookings.filter(b => b.status === "completed").length > 0 ? (
                      clientBookings
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
                                    <div className="flex gap-2">
                                      {booking.clientReview ? (
                                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                          Reviewed
                                        </Button>
                                      ) : (
                                        <Button variant="outline" size="sm">Leave Review</Button>
                                      )}
                                      <Button variant="outline" size="sm">Book Again</Button>
                                    </div>
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
            
            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold">My Favorites</h1>
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Search favorites..." 
                      className="max-w-xs"
                      startIcon={<Search className="h-4 w-4" />}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteServices.map((service) => (
                    <Card key={service.id} className="overflow-hidden">
                      <div className="relative h-48">
                        <img 
                          src={service.imageUrl} 
                          alt={service.title} 
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-3 left-3 bg-background/80 text-foreground">
                          {service.category}
                        </Badge>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="absolute top-3 right-3 bg-background/80 hover:bg-background/90 rounded-full"
                          onClick={() => {}}
                        >
                          <Heart className="h-4 w-4 fill-servie text-servie" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <img
                            src={service.providerAvatar}
                            alt={service.providerName}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm text-muted-foreground">{service.providerName}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{service.rating.toFixed(1)}</span>
                          <span className="text-sm text-muted-foreground">({service.reviewCount})</span>
                        </div>
                      </CardContent>
                      <CardFooter className="px-4 py-3 bg-muted/30 flex justify-between items-center">
                        <span className="font-semibold">{service.currency}{service.price}</span>
                        <Button size="sm" asChild>
                          <Link to={`/service/${service.id}`}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {/* Other tabs would be implemented here */}
            {activeTab === "messages" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Messages</h1>
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Your message center will be implemented in a future update</p>
                  <Button onClick={() => setActiveTab("overview")}>Go Back to Dashboard</Button>
                </div>
              </div>
            )}
            
            {activeTab === "payments" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Payment Methods</h1>
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">The payment management system will be implemented in a future update</p>
                  <Button onClick={() => setActiveTab("overview")}>Go Back to Dashboard</Button>
                </div>
              </div>
            )}
            
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Account Settings</h1>
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Account settings and preferences will be implemented in a future update</p>
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

export default ClientDashboard;
