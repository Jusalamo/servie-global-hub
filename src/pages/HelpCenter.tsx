
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, ShoppingBag, Briefcase, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const helpCategories = [
  {
    icon: <Users className="h-5 w-5" />,
    title: "Account & Profile",
    description: "Manage your account settings, profile, and security",
    link: "#account"
  },
  {
    icon: <ShoppingBag className="h-5 w-5" />,
    title: "Bookings & Orders",
    description: "Information about booking services and purchasing products",
    link: "#bookings"
  },
  {
    icon: <Briefcase className="h-5 w-5" />,
    title: "For Service Providers",
    description: "Help for service providers using the Servie platform",
    link: "#providers"
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Communication",
    description: "Messaging, notifications, and staying in touch",
    link: "#communication"
  }
];

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would trigger a search through help articles
    console.log("Searching for:", searchQuery);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-servie text-white py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">How Can We Help?</h1>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                Find answers to your questions and learn how to get the most out of Servie
              </p>
              
              <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  className="pl-10 h-12 bg-white text-foreground rounded-full"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full h-10 bg-servie hover:bg-servie-600"
                >
                  Search
                </Button>
              </form>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {helpCategories.map((category, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-servie/10 flex items-center justify-center mb-4">
                          {category.icon}
                        </div>
                        <h3 className="font-semibold mb-2">{category.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                        <Button variant="link" asChild className="p-0">
                          <a href={category.link}>View Articles</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                
                <Tabs defaultValue="general">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="clients">For Clients</TabsTrigger>
                    <TabsTrigger value="providers">For Providers</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>How does Servie work?</AccordionTrigger>
                        <AccordionContent>
                          Servie connects clients with verified service providers. Clients can browse services, read reviews, and book appointments directly through the platform. Service providers can showcase their skills, manage their schedule, and grow their business.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>How do I create an account?</AccordionTrigger>
                        <AccordionContent>
                          You can create an account by clicking "Sign Up" in the top right corner of the website. Follow the prompts to enter your information and choose whether you're signing up as a client, service provider, or seller.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>Is Servie available in my country?</AccordionTrigger>
                        <AccordionContent>
                          Servie is currently available in multiple countries across Africa, with ongoing expansion. Check our location settings or contact our support team to confirm availability in your specific location.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-4">
                        <AccordionTrigger>What payment methods are accepted?</AccordionTrigger>
                        <AccordionContent>
                          Servie accepts various payment methods including credit/debit cards, mobile money, and bank transfers. Available payment options may vary by location.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>
                  
                  <TabsContent value="clients">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="client-1">
                        <AccordionTrigger>How do I book a service?</AccordionTrigger>
                        <AccordionContent>
                          To book a service, browse or search for the service you need, select a provider, choose an available time slot, and complete the booking process. You'll receive a confirmation and can manage your bookings through your dashboard.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="client-2">
                        <AccordionTrigger>What if I need to cancel a booking?</AccordionTrigger>
                        <AccordionContent>
                          You can cancel a booking through your dashboard. Please note that cancellation policies vary by provider and may include fees if canceled within a certain timeframe before the appointment.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="client-3">
                        <AccordionTrigger>How do I leave a review?</AccordionTrigger>
                        <AccordionContent>
                          After your service is completed, you'll receive a notification to leave a review. You can also go to your booking history and select "Leave Review" for any completed service.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>
                  
                  <TabsContent value="providers">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="provider-1">
                        <AccordionTrigger>How do I become a service provider?</AccordionTrigger>
                        <AccordionContent>
                          Sign up as a provider, complete your profile with details about your services, pricing, and availability, and upload any required documentation for verification. Once approved, you can start accepting bookings.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="provider-2">
                        <AccordionTrigger>How and when do I get paid?</AccordionTrigger>
                        <AccordionContent>
                          Payments are processed after service completion and any review period. Funds are transferred to your linked payment account according to the payment schedule in your market (typically weekly or bi-weekly).
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="provider-3">
                        <AccordionTrigger>Can I set my own prices and availability?</AccordionTrigger>
                        <AccordionContent>
                          Yes, as a service provider you have full control over your pricing structure and availability calendar. You can update these at any time through your provider dashboard.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">Still need help?</h3>
                    <p className="text-muted-foreground mb-4">Get in touch with our support team for personalized assistance.</p>
                    <Button asChild>
                      <Link to="/contact-support">Contact Support</Link>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">Browse all help topics</h3>
                    <p className="text-muted-foreground mb-4">Explore our comprehensive knowledge base of articles and guides.</p>
                    <Button variant="outline">View Help Articles</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
