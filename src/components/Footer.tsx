
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Github, Mail } from "lucide-react";
import ServieIcon from "./ServieIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalization } from "./LangCurrencySelector";
import { useState } from "react";
import { toast } from "sonner";

const Footer = () => {
  const { translate } = useLocalization();
  const [email, setEmail] = useState("");
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Please enter your email address");
    }
    toast.success(`Thank you for subscribing with ${email}!`);
    setEmail("");
  };
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <ServieIcon className="h-8 w-8 text-servie" />
              <span className="ml-2 text-xl font-bold text-servie">Servie</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Connecting service providers with customers across Africa. The comprehensive marketplace for services and products.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-500 hover:text-servie dark:text-gray-400 dark:hover:text-servie"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-servie dark:text-gray-400 dark:hover:text-servie"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-servie dark:text-gray-400 dark:hover:text-servie"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-servie dark:text-gray-400 dark:hover:text-servie"
                aria-label="Github"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
          
          {/* Company info */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  Team
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  Press
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact-support" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  Shipping
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Stay Updated</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Subscribe to our newsletter for the latest services and offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 focus-visible:ring-servie"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="bg-servie hover:bg-servie-600 text-servie-foreground">
                <Mail size={16} className="mr-2" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Servie. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-sm text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
