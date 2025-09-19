
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const Returns = () => {
  return (
    <>
      <section className="bg-muted py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Returns & Refunds Policy</h1>
              <p className="text-muted-foreground">
                Last updated: May 1, 2024
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold mb-6">Product Returns</h2>
                <p className="mb-4">
                  At Servie, we want you to be completely satisfied with your purchase. If for any reason you're not happy with a product you've purchased through our platform, we offer a straightforward returns and refunds process.
                </p>
                
                <h3 className="text-xl font-bold mt-8 mb-4">Return Eligibility</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Products must be returned within 14 days of delivery.</li>
                  <li>Items must be unused, unworn, and in the original packaging.</li>
                  <li>Products must include all tags, labels, and accessories.</li>
                  <li>Proof of purchase (order number or receipt) is required.</li>
                </ul>
                
                <h3 className="text-xl font-bold mt-8 mb-4">Non-Returnable Items</h3>
                <p className="mb-4">For hygiene and safety reasons, the following items cannot be returned:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Personal care products that have been opened or used</li>
                  <li>Custom-made or personalized items</li>
                  <li>Digital products and downloadable items</li>
                  <li>Gift cards</li>
                  <li>Perishable goods</li>
                </ul>
                
                <h3 className="text-xl font-bold mt-8 mb-4">How to Return a Product</h3>
                <ol className="list-decimal pl-6 mb-6 space-y-2">
                  <li>Log in to your Servie account and navigate to "My Orders"</li>
                  <li>Find the order containing the item you wish to return</li>
                  <li>Select "Return Item" and follow the instructions</li>
                  <li>Print the return label (if provided) or note the return address</li>
                  <li>Pack the item securely in its original packaging if possible</li>
                  <li>Attach the return label and ship the package</li>
                  <li>Once we receive and inspect the item, we'll process your refund</li>
                </ol>
                
                <h3 className="text-xl font-bold mt-8 mb-4">Refund Process</h3>
                <p className="mb-4">
                  After we receive your returned item and verify its condition, we'll process your refund. The refund will typically be issued to the original payment method used for the purchase.
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Credit/debit card refunds: 5-10 business days</li>
                  <li>Mobile money refunds: 3-5 business days</li>
                  <li>Bank transfers: 5-7 business days</li>
                </ul>
                <p className="mb-4">
                  Please note that shipping costs for returns are the responsibility of the customer unless the return is due to our error (wrong item shipped, defective product, etc.).
                </p>
                
                <h2 className="text-2xl font-bold mt-10 mb-6">Service Cancellations & Refunds</h2>
                <p className="mb-4">
                  Our policy for service cancellations and refunds varies based on the type of service and when the cancellation occurs.
                </p>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Cancellation by Clients</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">When a client cancels a service booking:</p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li><strong>More than 24 hours before the scheduled time:</strong> Full refund</li>
                        <li><strong>12-24 hours before:</strong> 75% refund</li>
                        <li><strong>6-12 hours before:</strong> 50% refund</li>
                        <li><strong>Less than 6 hours before:</strong> No refund</li>
                      </ul>
                      <p>
                        Note that some service providers may have their own cancellation policies that differ from these standard terms. These will be clearly displayed at the time of booking.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Cancellation by Providers</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">If a service provider cancels a booking:</p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li>The client will receive a full refund regardless of timing</li>
                        <li>We may offer additional credit or discount on future bookings as compensation for inconvenience</li>
                        <li>Clients will have the option to rebook with the same provider or choose a different provider</li>
                      </ul>
                      <p>
                        Service providers who repeatedly cancel bookings may face penalties or removal from the platform.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Service Quality Issues</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">If you're not satisfied with the quality of a service:</p>
                      <ol className="list-decimal pl-6 mb-4 space-y-2">
                        <li>Contact the service provider directly through our messaging system first to resolve the issue</li>
                        <li>If you can't reach a resolution, file a complaint through your Servie account within 72 hours of service completion</li>
                        <li>Our customer support team will investigate the issue</li>
                        <li>Depending on the circumstances, we may offer a partial or full refund, or arrange for the service to be redone</li>
                      </ol>
                      <p>
                        We handle each case individually and aim to find fair resolutions for both clients and service providers.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <h2 className="text-2xl font-bold mt-10 mb-6">Contact Us</h2>
                <p className="mb-6">
                  If you have questions about returns, refunds, or need assistance with a specific case, please don't hesitate to contact our customer support team.
                </p>
                
                <Button asChild className="bg-servie hover:bg-servie-600 mb-10">
                  <Link to="/contact-support">Contact Support</Link>
                </Button>
                
                <div className="border-t pt-6 text-sm text-muted-foreground">
                  <p className="mb-2">
                    This returns and refunds policy is subject to change. We recommend checking back periodically for updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
      </section>
    </>
  );
};

export default Returns;
