
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const FAQs = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would filter the FAQs based on the search query
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="">
      <section className="bg-servie/10 py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Find answers to common questions about using Servie
              </p>
              
              <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  className="pl-10 h-12"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-lg h-10 bg-servie hover:bg-servie-600"
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
              <Tabs defaultValue="general" className="mb-12">
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="booking">Booking</TabsTrigger>
                  <TabsTrigger value="payment">Payments</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                  <h2 className="text-2xl font-bold mb-6">General Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="general-1">
                      <AccordionTrigger>What is Servie?</AccordionTrigger>
                      <AccordionContent>
                        Servie is a platform that connects service providers with clients. Whether you need home services, professional consulting, personal care, or other services, Servie helps you find verified professionals in your area. Our platform also includes a marketplace for service-related products.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="general-2">
                      <AccordionTrigger>How does Servie vet service providers?</AccordionTrigger>
                      <AccordionContent>
                        We have a comprehensive verification process for all service providers on our platform. This includes identity verification, skill assessment, and background checks where applicable. We also collect and monitor client reviews to ensure continued quality of service.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="general-3">
                      <AccordionTrigger>Is Servie available in my area?</AccordionTrigger>
                      <AccordionContent>
                        Servie is currently available in several countries across Africa, with more being added regularly. You can check specific coverage in your area by entering your location in the search bar on our homepage or contacting our support team.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="general-4">
                      <AccordionTrigger>What happens if I'm not satisfied with a service?</AccordionTrigger>
                      <AccordionContent>
                        Customer satisfaction is our priority. If you're not satisfied with a service, you can contact the provider directly through our messaging system to resolve the issue. If that doesn't work, you can open a dispute through our resolution center, and our team will assist in finding a fair solution.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="general-5">
                      <AccordionTrigger>How do I contact customer support?</AccordionTrigger>
                      <AccordionContent>
                        You can contact our customer support team through the "Contact Support" option in your account menu, by emailing support@servie.com, or by using the live chat feature on our website and mobile app. Our support team is available 24/7 to assist you.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="booking">
                  <h2 className="text-2xl font-bold mb-6">Booking Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="booking-1">
                      <AccordionTrigger>How do I book a service?</AccordionTrigger>
                      <AccordionContent>
                        To book a service, search for the type of service you need, browse through available providers, and select one that meets your requirements. You can then choose from their available time slots and complete the booking by providing necessary details and making payment if required.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="booking-2">
                      <AccordionTrigger>Can I reschedule or cancel a booking?</AccordionTrigger>
                      <AccordionContent>
                        Yes, you can reschedule or cancel a booking through your account dashboard. Navigate to "My Bookings," find the relevant booking, and select "Reschedule" or "Cancel." Please note that cancellation policies vary by provider and may include fees if canceled within a certain timeframe before the appointment.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="booking-3">
                      <AccordionTrigger>What information do I need to provide when booking?</AccordionTrigger>
                      <AccordionContent>
                        When booking a service, you'll typically need to provide your location, preferred date and time, specific requirements for the service, and contact details. Some services may require additional information depending on their nature.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="booking-4">
                      <AccordionTrigger>Can I book services for someone else?</AccordionTrigger>
                      <AccordionContent>
                        Yes, you can book services for someone else. During the booking process, you'll have the option to specify that the service is for another person and provide their contact information.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="payment">
                  <h2 className="text-2xl font-bold mb-6">Payment Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="payment-1">
                      <AccordionTrigger>What payment methods are accepted?</AccordionTrigger>
                      <AccordionContent>
                        Servie accepts various payment methods including major credit/debit cards (Visa, Mastercard), mobile money services (like M-Pesa), and bank transfers. The available payment options may vary by location.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="payment-2">
                      <AccordionTrigger>When am I charged for a service?</AccordionTrigger>
                      <AccordionContent>
                        Payment timing varies by service type. For some services, you'll be charged at the time of booking to secure your appointment. For others, especially larger projects, you might pay a deposit upfront with the balance due upon completion. The payment terms are always clearly displayed during the booking process.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="payment-3">
                      <AccordionTrigger>Is my payment information secure?</AccordionTrigger>
                      <AccordionContent>
                        Yes, Servie uses industry-standard encryption and security measures to protect your payment information. We never store complete credit card details on our servers and work with trusted payment processors that comply with the highest security standards.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="payment-4">
                      <AccordionTrigger>How do refunds work?</AccordionTrigger>
                      <AccordionContent>
                        Refund policies vary depending on the service provider and the circumstances. If you cancel before the cancellation deadline specified by the provider, you'll typically receive a full refund. For disputes or special circumstances, contact our customer support team who can assist with the refund process.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="account">
                  <h2 className="text-2xl font-bold mb-6">Account Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="account-1">
                      <AccordionTrigger>How do I create an account?</AccordionTrigger>
                      <AccordionContent>
                        To create an account, click on the "Sign Up" button in the top right corner of the website or app. Fill in your personal details, choose whether you're signing up as a client or service provider, verify your email address, and complete any additional verification steps if required.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="account-2">
                      <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                      <AccordionContent>
                        If you've forgotten your password, click on "Sign In," then "Forgot Password." Enter the email address associated with your account, and we'll send you a link to reset your password. Follow the instructions in the email to create a new password.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="account-3">
                      <AccordionTrigger>How do I update my profile information?</AccordionTrigger>
                      <AccordionContent>
                        To update your profile information, sign in to your account, navigate to your profile settings (usually accessible by clicking on your profile picture or name), and select "Edit Profile." Here you can update your personal details, contact information, and preferences.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="account-4">
                      <AccordionTrigger>Can I have both a client and provider account?</AccordionTrigger>
                      <AccordionContent>
                        Yes, you can have both types of accounts. If you initially signed up as a client and want to become a provider as well, go to your account settings and select "Become a Provider." You'll need to complete the provider onboarding process, including any verification steps.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
              </Tabs>
              
              <div className="text-center border-t pt-8">
                <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  If you couldn't find the answer you were looking for, our support team is here to help you.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild className="bg-servie hover:bg-servie-600">
                    <Link to="/contact-support">Contact Support</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/help">Browse Help Center</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
};

export default FAQs;
