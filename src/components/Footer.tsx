
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

// Service Categories
const categories = [
  { name: "Home Services", path: "/categories?category=home-services" },
  { name: "Professional Services", path: "/categories?category=professional" },
  { name: "Personal Care", path: "/categories?category=personal-care" },
  { name: "Events & Catering", path: "/categories?category=events" },
  { name: "Transportation", path: "/categories?category=transportation" },
  { name: "Education", path: "/categories?category=education" },
  { name: "Health & Wellness", path: "/categories?category=health" },
  { name: "Creative Services", path: "/categories?category=creative" },
];

// Company Information
const company = [
  { name: "About Us", path: "/about" },
  { name: "Our Story", path: "/our-story" },
  { name: "Team", path: "/team" },
  { name: "Careers", path: "/careers" },
  { name: "Press", path: "/press" },
  { name: "Contact Us", path: "/contact-support" },
];

// Support Links
const support = [
  { name: "Help Center", path: "/help" },
  { name: "FAQs", path: "/faqs" },
  { name: "Returns & Refunds", path: "/returns" },
  { name: "Shipping Information", path: "/shipping" },
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Terms of Service", path: "/terms" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    toast.success(`Thank you for subscribing with ${email}!`);
    setEmail("");
  };
  
  const navigateToDashboard = () => {
    switch(userRole) {
      case "provider":
        navigate("/dashboard/provider?tab=overview");
        break;
      case "seller":
        navigate("/dashboard/seller?tab=overview");
        break;
      default:
        navigate("/dashboard/client");
    }
  };

  return (
    <footer className="bg-muted dark:bg-muted/50 border-t">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-servie">Servie</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Connecting service providers with clients across Africa and globally. Find expert services for any task or become a provider to showcase your skills.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Subscribe to our newsletter</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="rounded-full flex-1"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" className="rounded-full bg-servie hover:bg-servie-600">
                  Subscribe
                </Button>
              </form>
            </div>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-servie p-2 rounded-full bg-background">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-servie p-2 rounded-full bg-background">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-servie p-2 rounded-full bg-background">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-servie p-2 rounded-full bg-background">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          
          {/* Categories Section */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Categories</h3>
            <ul className="space-y-2">
              {categories.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-muted-foreground hover:text-servie">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company Section */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Company</h3>
            <ul className="space-y-2">
              {company.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-muted-foreground hover:text-servie">
                    {item.name}
                  </Link>
                </li>
              ))}
              {!isAuthenticated && (
                <>
                  <li>
                    <Link to="/become-seller" className="text-servie font-medium hover:underline">
                      Become a Seller
                    </Link>
                  </li>
                  <li>
                    <Link to="/become-provider" className="text-servie font-medium hover:underline">
                      Become a Provider
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          {/* Support Section */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Support</h3>
            <ul className="space-y-2">
              {support.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-muted-foreground hover:text-servie">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Payment Methods */}
            <h3 className="font-semibold mt-6 mb-3 text-lg">We Accept</h3>
            <div className="flex flex-wrap gap-2">
              {["Visa", "MasterCard", "PayPal", "Apple Pay", "Google Pay"].map((method) => (
                <span key={method} className="px-3 py-1 bg-background rounded-md text-sm">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Footer Section */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Servie. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-servie">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-servie">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-sm text-muted-foreground hover:text-servie">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
