
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin } from "lucide-react";

const Shipping = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-muted py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Shipping Information</h1>
              <p className="text-muted-foreground">
                Details about shipping options, delivery times, and tracking for orders on Servie
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="shipping-options" className="mb-12">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="shipping-options">Shipping Options</TabsTrigger>
                  <TabsTrigger value="delivery-times">Delivery Times</TabsTrigger>
                  <TabsTrigger value="tracking">Order Tracking</TabsTrigger>
                </TabsList>
                
                <TabsContent value="shipping-options" className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">Available Shipping Options</h2>
                  
                  <div className="space-y-6 mb-8">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-2">Standard Shipping</h3>
                        <p className="text-muted-foreground mb-4">
                          Our most economical shipping option, delivering within 5-7 business days.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Starting from</span>
                          <span className="font-semibold">$4.99</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold mb-2">Express Shipping</h3>
                          <span className="bg-servie/20 text-servie text-xs px-2 py-1 rounded-full">Recommended</span>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Expedited delivery within 2-3 business days to most locations.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Starting from</span>
                          <span className="font-semibold">$14.99</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-2">Next-Day Delivery</h3>
                        <p className="text-muted-foreground mb-4">
                          Fastest option available for orders placed before 12pm local time. Delivery by end of next business day.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Starting from</span>
                          <span className="font-semibold">$24.99</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Important Notes:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Actual shipping costs are calculated based on weight, dimensions, and delivery location</li>
                      <li>Final shipping cost will be displayed at checkout before payment</li>
                      <li>Free shipping may be available for orders above a certain value (varies by seller)</li>
                      <li>Some remote locations may have limited shipping options or additional fees</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="delivery-times" className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">Estimated Delivery Times</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Major Urban Centers</h3>
                      <table className="w-full border-collapse">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-3">Shipping Method</th>
                            <th className="text-left p-3">Delivery Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-3">Standard</td>
                            <td className="p-3">3-5 business days</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3">Express</td>
                            <td className="p-3">1-2 business days</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3">Next-Day</td>
                            <td className="p-3">Next business day</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Other Locations</h3>
                      <table className="w-full border-collapse">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-3">Shipping Method</th>
                            <th className="text-left p-3">Delivery Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-3">Standard</td>
                            <td className="p-3">5-7 business days</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3">Express</td>
                            <td className="p-3">2-3 business days</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3">Next-Day</td>
                            <td className="p-3">1-2 business days</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Delivery by Country</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="nigeria">
                        <AccordionTrigger>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            Nigeria
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-6">
                            <p className="mb-2 font-medium">Major Cities (Lagos, Abuja, Port Harcourt):</p>
                            <ul className="list-disc pl-6 mb-4 space-y-1">
                              <li>Standard: 2-4 business days</li>
                              <li>Express: 1-2 business days</li>
                              <li>Next-Day: Next business day (order by 12pm)</li>
                            </ul>
                            
                            <p className="mb-2 font-medium">Other Locations:</p>
                            <ul className="list-disc pl-6 space-y-1">
                              <li>Standard: 4-6 business days</li>
                              <li>Express: 2-3 business days</li>
                              <li>Next-Day: Not available in all areas</li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="kenya">
                        <AccordionTrigger>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            Kenya
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-6">
                            <p className="mb-2 font-medium">Major Cities (Nairobi, Mombasa):</p>
                            <ul className="list-disc pl-6 mb-4 space-y-1">
                              <li>Standard: 2-4 business days</li>
                              <li>Express: 1-2 business days</li>
                              <li>Next-Day: Next business day (order by 12pm)</li>
                            </ul>
                            
                            <p className="mb-2 font-medium">Other Locations:</p>
                            <ul className="list-disc pl-6 space-y-1">
                              <li>Standard: 4-7 business days</li>
                              <li>Express: 2-3 business days</li>
                              <li>Next-Day: Not available in all areas</li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="southafrica">
                        <AccordionTrigger>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            South Africa
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-6">
                            <p className="mb-2 font-medium">Major Cities (Johannesburg, Cape Town, Durban):</p>
                            <ul className="list-disc pl-6 mb-4 space-y-1">
                              <li>Standard: 2-4 business days</li>
                              <li>Express: 1-2 business days</li>
                              <li>Next-Day: Next business day (order by 12pm)</li>
                            </ul>
                            
                            <p className="mb-2 font-medium">Other Locations:</p>
                            <ul className="list-disc pl-6 space-y-1">
                              <li>Standard: 3-6 business days</li>
                              <li>Express: 2-3 business days</li>
                              <li>Next-Day: Limited availability</li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="ghana">
                        <AccordionTrigger>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            Ghana
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-6">
                            <p className="mb-2 font-medium">Major Cities (Accra, Kumasi):</p>
                            <ul className="list-disc pl-6 mb-4 space-y-1">
                              <li>Standard: 3-5 business days</li>
                              <li>Express: 1-3 business days</li>
                              <li>Next-Day: Next business day in Accra only (order by 12pm)</li>
                            </ul>
                            
                            <p className="mb-2 font-medium">Other Locations:</p>
                            <ul className="list-disc pl-6 space-y-1">
                              <li>Standard: 5-8 business days</li>
                              <li>Express: 3-5 business days</li>
                              <li>Next-Day: Not available</li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="other">
                        <AccordionTrigger>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            Other Countries
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-6">
                            <p className="mb-4">
                              For countries not listed above, delivery times will vary based on location and available shipping carriers. Estimated delivery timeframes will be provided at checkout.
                            </p>
                            <p>
                              For specific inquiries about shipping to your location, please contact our customer support team.
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Please Note:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Business days do not include weekends or public holidays</li>
                      <li>Delivery times are estimates and not guaranteed</li>
                      <li>Weather conditions, customs clearance, and other factors may cause delays</li>
                      <li>During peak seasons (e.g., holidays), delivery may take longer than usual</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="tracking" className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">Track Your Order</h2>
                  
                  <div className="space-y-6 mb-8">
                    <h3 className="text-lg font-semibold">How to Track Your Order</h3>
                    <ol className="list-decimal pl-6 space-y-3">
                      <li>
                        <span className="font-medium">Through Your Servie Account:</span>
                        <ul className="list-disc pl-6 mt-2">
                          <li>Log in to your account</li>
                          <li>Navigate to "My Orders"</li>
                          <li>Find your order and click on "Track Order"</li>
                          <li>You'll see the current status and tracking information</li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-medium">Via Email:</span>
                        <ul className="list-disc pl-6 mt-2">
                          <li>You'll receive an email with tracking information when your order ships</li>
                          <li>Click the tracking link in the email to view the status</li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-medium">Using the Tracking Number:</span>
                        <ul className="list-disc pl-6 mt-2">
                          <li>If you have the tracking number, you can enter it on the carrier's website</li>
                          <li>Common carriers include DHL, FedEx, UPS, and local postal services</li>
                        </ul>
                      </li>
                    </ol>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Understanding Order Status</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full border-collapse">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-3">Status</th>
                            <th className="text-left p-3">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Order Placed</td>
                            <td className="p-3">Your order has been received and payment confirmed</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Processing</td>
                            <td className="p-3">Your order is being prepared for shipping</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Shipped</td>
                            <td className="p-3">Your order has been handed over to the delivery carrier</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Out for Delivery</td>
                            <td className="p-3">Your order is on a delivery vehicle heading to your address</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Delivered</td>
                            <td className="p-3">Your order has been delivered successfully</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Delayed</td>
                            <td className="p-3">Your delivery is experiencing unexpected delays</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-medium">Failed Attempt</td>
                            <td className="p-3">Delivery was attempted but couldn't be completed</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Having Issues with Tracking?</h3>
                    <p className="mb-4">
                      If you're experiencing problems tracking your order or if your tracking information hasn't updated in 48 hours, please contact our customer support team for assistance.
                    </p>
                    <p>
                      You can reach us through the "Contact Support" option in your account or by emailing support@servie.com with your order number.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Shipping;
