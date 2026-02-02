
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin, Heart, Star, ChevronLeft, CheckCircle, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { PopoverDateTimePicker } from "@/components/booking/PopoverDateTimePicker";

interface Service {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  priceType: "hourly" | "fixed" | "starting";
  duration: string;  // e.g., "2 hours" or "1-2 hours"
  category: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerRating: number;
  providerReviewCount: number;
  providerDescription: string;
  featured: boolean;
  images: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export default function ServiceDetail() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Fetch real service data from Supabase
  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;
      
      setLoading(true);
      try {
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select(`
            *,
            profiles:provider_id (
              first_name,
              last_name,
              business_name,
              avatar_url,
              bio
            ),
            service_images (
              url,
              is_primary
            )
          `)
          .eq('id', serviceId)
          .single();

        if (serviceError) throw serviceError;
        
        if (serviceData) {
          const profile = serviceData.profiles as any;
          const providerName = profile?.business_name || 
            `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 
            'Unknown Provider';
          
          const images = (serviceData.service_images as any[])
            ?.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
            .map(img => img.url) || ['/placeholder.svg'];

          const mappedService: Service = {
            id: serviceData.id,
            title: serviceData.title,
            description: serviceData.description,
            longDescription: serviceData.description,
            price: serviceData.price,
            priceType: 'fixed',
            duration: serviceData.response_time || '1-2 hours',
            category: serviceData.category || 'General Services',
            providerId: serviceData.provider_id,
            providerName,
            providerAvatar: profile?.avatar_url || '/placeholder.svg',
            providerRating: 4.5,
            providerReviewCount: 0,
            providerDescription: profile?.bio || '',
            featured: serviceData.featured || false,
            images,
            rating: 4.5,
            reviewCount: 0,
            createdAt: serviceData.created_at
          };
          
          setService(mappedService);
          setActiveImage(images[0]);
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        toast.error("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const handleBookNow = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time");
      return;
    }
    
    toast.success(`Booking scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}`);
    navigate("/booking-confirmation");
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save favorites");
      return;
    }
    
    setIsFavorite(!isFavorite);
    if (isFavorite) {
      toast.info("Removed from favorites");
    } else {
      toast.success("Added to favorites");
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="container px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <Skeleton className="w-full aspect-video rounded-lg" />
              <div className="flex gap-2 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded" />
                ))}
              </div>
            </div>
            <div className="w-full lg:w-1/3 space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-16">
        <div className="container px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The service you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/categories">Browse Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container max-w-[1200px] mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="/categories" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to services
            </Link>
          </div>

          {/* Service details */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Service info */}
            <div className="w-full lg:w-2/3 space-y-6">
              {/* Main image */}
              <div className="aspect-video bg-muted/20 rounded-lg overflow-hidden">
                <img
                  src={activeImage || service.images[0]}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Thumbnail images */}
              {service.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {service.images.map((image, index) => (
                    <button
                      key={index}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                        activeImage === image ? "border-servie" : "border-muted"
                      }`}
                      onClick={() => setActiveImage(image)}
                    >
                      <img src={image} alt={`${service.title} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Title and rating */}
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{service.title}</h1>
                    <div className="flex items-center mt-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 font-medium">{service.rating}</span>
                      <span className="mx-1 text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{service.reviewCount} reviews</span>
                      <span className="mx-1 text-muted-foreground">•</span>
                      <Badge variant="outline" className="text-xs">
                        {service.category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={handleToggleFavorite}
                  >
                    <Heart className={`h-6 w-6 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>
              </div>

              {/* Service tabs */}
              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="provider">Provider</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="py-4">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-servie mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-medium">{service.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-servie mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium">At your home</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-servie mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">Availability</p>
                          <p className="font-medium">Mon-Sat, 9AM-5PM</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h3 className="text-lg font-semibold mb-3">About this service</h3>
                      <div className="space-y-4 text-muted-foreground">
                        <p>{service.longDescription}</p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h3 className="text-lg font-semibold mb-3">What's included</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {[
                          "Dusting all accessible surfaces",
                          "Vacuuming floors and carpets",
                          "Mopping all hard floors",
                          "Kitchen cleaning",
                          "Bathroom cleaning and disinfecting",
                          "Trash removal"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="py-4">
                  <div className="space-y-8">
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="text-center">
                          <span className="text-5xl font-bold">{service.rating}</span>
                          <div className="flex justify-center mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= Math.floor(service.rating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Based on {service.reviewCount} reviews
                          </p>
                        </div>
                        
                        <div className="flex-1">
                          <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => {
                              // Calculate percentage for each rating (mock data)
                              const percentage = rating === 5 ? 75 : 
                                                rating === 4 ? 15 : 
                                                rating === 3 ? 5 : 
                                                rating === 2 ? 3 : 2;
                              return (
                                <div key={rating} className="flex items-center">
                                  <div className="flex items-center w-24">
                                    <span className="mr-2">{rating}</span>
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  </div>
                                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-yellow-400"
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="ml-4 text-sm w-12">{percentage}%</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mock reviews */}
                    <div className="space-y-6">
                      {[
                        {
                          name: "Sarah Miller",
                          date: "2025-04-18",
                          rating: 5,
                          comment: "The cleaning team was extremely thorough and professional. My home has never looked better! They paid attention to every detail and used eco-friendly products as promised.",
                          avatar: "/placeholder.svg"
                        },
                        {
                          name: "Mike Thompson",
                          date: "2025-04-05",
                          rating: 4,
                          comment: "Great service overall. They did an excellent job with the bathrooms and kitchen. The only reason for 4 stars is they were about 15 minutes late, but they did call to let me know.",
                          avatar: "/placeholder.svg"
                        },
                        {
                          name: "Jennifer Adams",
                          date: "2025-03-22",
                          rating: 5,
                          comment: "I've tried several cleaning services, and this is by far the best. The cleaners were friendly, efficient, and left my home spotless. Will definitely use them again!",
                          avatar: "/placeholder.svg"
                        }
                      ].map((review, idx) => (
                        <div key={idx} className="border-b pb-6 last:border-none">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <img
                                src={review.avatar}
                                alt={review.name}
                                className="w-10 h-10 rounded-full mr-3"
                              />
                              <div>
                                <p className="font-medium">{review.name}</p>
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= review.rating
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-muted stroke-muted-foreground"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                              })}
                            </div>
                          </div>
                          <p className="mt-3">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="provider" className="py-4">
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <Avatar className="h-16 w-16 mr-4">
                        <AvatarImage src={service.providerAvatar} alt={service.providerName} />
                        <AvatarFallback>{service.providerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{service.providerName}</h3>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 font-medium">{service.providerRating}</span>
                          <span className="ml-1 text-muted-foreground">
                            ({service.providerReviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground">{service.providerDescription}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <Button variant="outline">
                        <Link to={`/provider/${service.providerId}`}>View Profile</Link>
                      </Button>
                      <Button>
                        <Link to={`/provider/${service.providerId}/contact`}>Contact Provider</Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Booking card */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-24">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span>
                        ${service.price}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                          {service.priceType === "hourly" 
                            ? "/ hour" 
                            : service.priceType === "starting" 
                            ? "starting price" 
                            : "fixed price"}
                        </span>
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Select Date & Time</h3>
                      <PopoverDateTimePicker
                        selectedDate={selectedDate || undefined}
                        selectedTime={selectedTime || ''}
                        onDateChange={(date) => setSelectedDate(date || null)}
                        onTimeChange={setSelectedTime}
                        minDate={new Date()}
                      />
                    </div>
                    
                    <Button 
                      className="w-full bg-servie hover:bg-servie-600" 
                      size="lg"
                      onClick={handleBookNow}
                    >
                      Book Now
                    </Button>

                    <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Service fee</span>
                        <span>${service.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Booking fee</span>
                        <span>$5.00</span>
                      </div>
                      <div className="flex justify-between font-semibold text-foreground pt-2 border-t">
                        <span>Total</span>
                        <span>${(service.price + 5).toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
