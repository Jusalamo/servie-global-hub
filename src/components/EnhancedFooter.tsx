
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LangCurrencySelector } from "@/components/LangCurrencySelector";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from "lucide-react";

export default function EnhancedFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted/50">
      <div className="container px-4 py-12 md:py-16">
        {/* Newsletter Subscription */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 bg-background p-6 rounded-lg shadow-sm">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Join Our Newsletter</h3>
            <p className="text-muted-foreground">Get the latest updates and offers</p>
          </div>
          <div className="flex w-full md:w-auto space-x-2">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="max-w-xs" 
            />
            <Button className="bg-servie hover:bg-servie-600">Subscribe</Button>
          </div>
        </div>
        
        {/* Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-servie">About Us</Link>
              </li>
              <li>
                <Link to="/our-story" className="hover:text-servie">Our Story</Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-servie">Team</Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-servie">Careers</Link>
              </li>
              <li>
                <Link to="/press" className="hover:text-servie">Press & Media</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-servie">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          {/* Support Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="hover:text-servie">Help Center</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-servie">FAQs</Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-servie">Returns & Refunds</Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-servie">Shipping Information</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-servie">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-servie">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/categories/home-services" className="hover:text-servie">Home Services</Link>
              </li>
              <li>
                <Link to="/categories/professional" className="hover:text-servie">Professional Services</Link>
              </li>
              <li>
                <Link to="/categories/health" className="hover:text-servie">Health & Wellness</Link>
              </li>
              <li>
                <Link to="/categories/beauty" className="hover:text-servie">Beauty & Personal Care</Link>
              </li>
              <li>
                <Link to="/categories/events" className="hover:text-servie">Events & Entertainment</Link>
              </li>
              <li>
                <Link to="/categories/tech" className="hover:text-servie">Tech & Digital</Link>
              </li>
            </ul>
          </div>
          
          {/* For Providers & Sellers */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Join As</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/become-provider" className="hover:text-servie">Service Provider</Link>
              </li>
              <li>
                <Link to="/become-seller" className="hover:text-servie">Seller</Link>
              </li>
              <li>
                <Link to="/provider-resources" className="hover:text-servie">Provider Resources</Link>
              </li>
              <li>
                <Link to="/seller-resources" className="hover:text-servie">Seller Resources</Link>
              </li>
              <li>
                <Link to="/success-stories" className="hover:text-servie">Success Stories</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="mb-8" />
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-servie mr-2">Servie</span>
            </Link>
            <span className="text-sm text-muted-foreground ml-2">
              © {currentYear} Servie. All rights reserved.
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex items-center space-x-4">
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-servie">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-servie">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-servie">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-servie">
                <Linkedin size={20} />
              </a>
              <a href="#" aria-label="YouTube" className="text-muted-foreground hover:text-servie">
                <Youtube size={20} />
              </a>
            </div>
            
            <LangCurrencySelector />
          </div>
        </div>
        
        {/* Payment Methods & Trust Badges */}
        <div className="mt-8 flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <img src="https://via.placeholder.com/60x30?text=Visa" alt="Visa" className="h-8" />
            <img src="https://via.placeholder.com/60x30?text=Mastercard" alt="Mastercard" className="h-8" />
            <img src="https://via.placeholder.com/60x30?text=Amex" alt="American Express" className="h-8" />
            <img src="https://via.placeholder.com/60x30?text=PayPal" alt="PayPal" className="h-8" />
            <img src="https://via.placeholder.com/60x30?text=ApplePay" alt="Apple Pay" className="h-8" />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <img src="https://via.placeholder.com/80x40?text=SSL" alt="SSL Secure" className="h-10" />
            <img src="https://via.placeholder.com/80x40?text=TrustPilot" alt="TrustPilot" className="h-10" />
            <img src="https://via.placeholder.com/80x40?text=BBB" alt="BBB Accredited" className="h-10" />
          </div>
        </div>
      </div>
    </footer>
  );
}
