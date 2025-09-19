
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <>
      <section className="bg-gradient-to-r from-servie to-servie-600 text-servie-foreground py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">About Servie</h1>
              <p className="text-lg md:text-xl opacity-90">
                Connecting service providers with clients across Africa and beyond
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
              <p className="mb-6">
                At Servie, our mission is to bridge the gap between skilled service providers and clients in need of their expertise. We believe everyone deserves access to quality services, and every skilled professional deserves the opportunity to grow their business.
              </p>
              <p className="mb-6">
                Founded in 2023, Servie has grown from a small idea to a platform connecting thousands of service providers with clients across multiple countries. Our focus on the African market helps highlight local talent and provides economic opportunities in communities that have traditionally been underserved by digital platforms.
              </p>
              
              <h2 className="text-2xl font-bold mt-10 mb-6">Why Choose Servie?</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">For Clients</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Access to verified, skilled professionals</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Transparent pricing with no hidden fees</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Secure payment protection</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Verified reviews from real customers</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">For Service Providers</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Free profile creation and management</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Access to a growing customer base</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Tools to manage bookings and payments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Marketing support to grow your business</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center mt-12">
                <h2 className="text-2xl font-bold mb-6">Join Our Community Today</h2>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button asChild className="bg-servie hover:bg-servie-600">
                    <Link to="/sign-up">Sign Up as a Client</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/become-provider">Become a Provider</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/become-seller">Become a Seller</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
      </section>
    </>
  );
};

export default AboutUs;
