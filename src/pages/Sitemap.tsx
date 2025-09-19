
import React from "react";
import { Link } from "react-router-dom";

const Sitemap = () => {
  return (
    <>
      <section className="bg-muted py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Sitemap</h1>
              <p className="text-muted-foreground">
                Navigate through all pages and sections of Servie
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div>
                  <h2 className="text-xl font-bold mb-4 pb-2 border-b">Main Pages</h2>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/" className="text-servie hover:underline">Home</Link>
                    </li>
                    <li>
                      <Link to="/categories" className="text-servie hover:underline">Service Categories</Link>
                    </li>
                    <li>
                      <Link to="/shop" className="text-servie hover:underline">Shop</Link>
                    </li>
                    <li>
                      <Link to="/about" className="text-servie hover:underline">About Us</Link>
                    </li>
                    <li>
                      <Link to="/contact-support" className="text-servie hover:underline">Contact Support</Link>
                    </li>
                    <li>
                      <Link to="/sign-in" className="text-servie hover:underline">Sign In</Link>
                    </li>
                    <li>
                      <Link to="/sign-up" className="text-servie hover:underline">Sign Up</Link>
                    </li>
                  </ul>
                  
                  <h2 className="text-xl font-bold mb-4 pb-2 border-b mt-8">Company</h2>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/our-story" className="text-servie hover:underline">Our Story</Link>
                    </li>
                    <li>
                      <Link to="/team" className="text-servie hover:underline">Team</Link>
                    </li>
                    <li>
                      <Link to="/careers" className="text-servie hover:underline">Careers</Link>
                    </li>
                    <li>
                      <Link to="/press" className="text-servie hover:underline">Press</Link>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4 pb-2 border-b">Services</h2>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/categories?category=home-services" className="text-servie hover:underline">Home Services</Link>
                    </li>
                    <li>
                      <Link to="/categories?category=professional" className="text-servie hover:underline">Professional Services</Link>
                    </li>
                    <li>
                      <Link to="/categories?category=personal-care" className="text-servie hover:underline">Personal Care</Link>
                    </li>
                    <li>
                      <Link to="/categories?category=events" className="text-servie hover:underline">Events & Catering</Link>
                    </li>
                    <li>
                      <Link to="/categories?category=transportation" className="text-servie hover:underline">Transportation</Link>
                    </li>
                    <li>
                      <Link to="/categories?category=education" className="text-servie hover:underline">Education</Link>
                    </li>
                    <li>
                      <Link to="/categories?category=health" className="text-servie hover:underline">Health & Wellness</Link>
                    </li>
                    <li>
                      <Link to="/categories?category=creative" className="text-servie hover:underline">Creative Services</Link>
                    </li>
                  </ul>
                  
                  <h2 className="text-xl font-bold mb-4 pb-2 border-b mt-8">For Service Providers</h2>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/become-provider" className="text-servie hover:underline">Become a Provider</Link>
                    </li>
                    <li>
                      <Link to="/dashboard/provider" className="text-servie hover:underline">Provider Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/help" className="text-servie hover:underline">Provider Help Center</Link>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4 pb-2 border-b">For Sellers</h2>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/become-seller" className="text-servie hover:underline">Become a Seller</Link>
                    </li>
                    <li>
                      <Link to="/dashboard/seller" className="text-servie hover:underline">Seller Dashboard</Link>
                    </li>
                  </ul>
                  
                  <h2 className="text-xl font-bold mb-4 pb-2 border-b mt-8">For Clients</h2>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/dashboard/client" className="text-servie hover:underline">Client Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/cart" className="text-servie hover:underline">Shopping Cart</Link>
                    </li>
                    <li>
                      <Link to="/checkout" className="text-servie hover:underline">Checkout</Link>
                    </li>
                  </ul>
                  
                  <h2 className="text-xl font-bold mb-4 pb-2 border-b mt-8">Support</h2>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/help" className="text-servie hover:underline">Help Center</Link>
                    </li>
                    <li>
                      <Link to="/faqs" className="text-servie hover:underline">FAQs</Link>
                    </li>
                    <li>
                      <Link to="/returns" className="text-servie hover:underline">Returns & Refunds</Link>
                    </li>
                    <li>
                      <Link to="/shipping" className="text-servie hover:underline">Shipping Information</Link>
                    </li>
                  </ul>
                  
                  <h2 className="text-xl font-bold mb-4 pb-2 border-b mt-8">Legal</h2>
                  <ul className="space-y-2">
                    <li>
                      <Link to="/terms" className="text-servie hover:underline">Terms of Service</Link>
                    </li>
                    <li>
                      <Link to="/privacy" className="text-servie hover:underline">Privacy Policy</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
      </section>
    </>
  );
};

export default Sitemap;
