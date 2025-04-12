
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, User, Clock, Check, Heart, Share2, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { services } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState("1b");
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Find the service based on the id from URL
  const service = services.find(s => s.id === id);
  
  // Find related services (same category)
  const relatedServices = services
    .filter(s => s.id !== id && s.category === service?.category)
    .slice(0, 3);
  
  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-16 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
          <p className="mb-8">The service you are looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/categories">Browse Services</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "This service has been removed from your favorites" : "This service has been added to your favorites",
    });
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "The link to this service has been copied to your clipboard",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Breadcrumb */}
            <div className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-servie">Home</Link> / 
              <Link to="/categories" className="mx-1 hover:text-servie">Categories</Link> / 
              <Link to={`/categories?category=${service.category}`} className="mx-1 hover:text-servie">{service.category}</Link> /
              <span className="ml-1 text-foreground">{service.title}</span>
            </div>
            
            {/* Service Title and Badges */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{service.title}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{service.category}</Badge>
                {service.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
            
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="rounded-lg overflow-hidden mb-2">
                <img
                  src={service.gallery[currentImage]}
                  alt={service.title}
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {service.gallery.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                      currentImage === index ? "border-servie" : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${service.title} ${index + 1}`}
                      className="w-20 h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Service Tabs */}
            <Tabs defaultValue="description" className="mb-10">
              <TabsList className="w-full">
                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                <TabsTrigger value="packages" className="flex-1">Packages</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
              </TabsList>
              
              {/* Description Tab */}
              <TabsContent value="description" className="pt-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">About This Service</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {/* Packages Tab */}
              <TabsContent value="packages" className="pt-6 space-y-6">
                <h3 className="text-xl font-semibold mb-4">Available Packages</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {service.packages.map((pkg) => (
                    <Card 
                      key={pkg.id} 
                      className={`cursor-pointer ${selectedPackage === pkg.id ? 'border-servie ring-1 ring-servie' : ''}`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <CardContent className="p-4 space-y-4">
                        <div>
                          <h4 className="font-semibold text-lg">{pkg.name}</h4>
                          <p className="text-sm text-muted-foreground">{pkg.description}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xl">{service.currency}{pkg.price}</span>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-4 w-4" />
                            {pkg.delivery}
                          </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <p className="text-sm font-medium">What's Included:</p>
                          <ul className="space-y-1">
                            {pkg.features.map((feature, index) => (
                              <li key={index} className="flex items-center text-sm">
                                <Check className="mr-2 h-4 w-4 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Reviews Tab */}
              <TabsContent value="reviews" className="pt-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">
                    {service.reviewCount} Reviews
                  </h3>
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(service.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-bold">{service.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-6">
                  {service.reviews.map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={review.userAvatar}
                            alt={review.userName}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium">{review.userName}</p>
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= Math.round(review.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                      <Separator />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Related Services */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Similar Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedServices.map((relatedService) => (
                  <ServiceCard
                    key={relatedService.id}
                    id={relatedService.id}
                    title={relatedService.title}
                    category={relatedService.category}
                    imageUrl={relatedService.imageUrl}
                    providerName={relatedService.providerName}
                    providerAvatar={relatedService.providerAvatar}
                    rating={relatedService.rating}
                    reviewCount={relatedService.reviewCount}
                    price={relatedService.price}
                    currency={relatedService.currency}
                    featured={relatedService.featured}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <div className="sticky top-24 space-y-6">
              {/* Book Service Card */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-xl">
                      {service.currency}
                      {service.packages.find(pkg => pkg.id === selectedPackage)?.price || service.price}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{service.rating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">
                        ({service.reviewCount})
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Selected Package:</p>
                    <p>{service.packages.find(pkg => pkg.id === selectedPackage)?.name || "Standard"}</p>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    Delivery in {service.packages.find(pkg => pkg.id === selectedPackage)?.delivery || service.delivery}
                  </div>
                  
                  <Button className="w-full bg-servie hover:bg-servie-600" asChild>
                    <Link to={`/booking/${service.id}?package=${selectedPackage}`}>
                      Book Service
                    </Link>
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={handleFavorite}>
                      <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-servie text-servie" : ""}`} />
                      {isFavorite ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Provider Info Card */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={service.providerAvatar}
                      alt={service.providerName}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{service.providerName}</h3>
                      <p className="text-sm text-muted-foreground">Service Provider</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span className="text-sm">{service.providerLocation}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span className="text-sm">Member since {new Date(service.providerJoined).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span className="text-sm">Usually responds within a few hours</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm">{service.providerDescription}</p>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Contact Provider
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
