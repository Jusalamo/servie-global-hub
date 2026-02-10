
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Github, Mail } from "lucide-react";
import ServieIcon from "./ServieIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
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
              {t('footer_description')}
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
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">{t('company')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  {t('about_us')}
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  {t('our_story')}
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  {t('team')}
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  {t('careers')}
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  {t('press')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">{t('support')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  {t('help_center')}
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  {t('faqs')}
                </Link>
              </li>
              <li>
                <Link to="/contact-support" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  {t('returns')}
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie text-sm">
                  {t('shipping')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">{t('stay_updated')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('newsletter_text')}
            </p>
            <form onSubmit={handleSubscribe} className="flex space-x-2">
              <Input 
                type="email" 
                placeholder={t('your_email')} 
                className="flex-1 focus-visible:ring-servie"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="bg-servie hover:bg-servie-600 text-servie-foreground">
                <Mail size={16} className="mr-2" />
                {t('subscribe')}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Servie. {t('all_rights')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie">
                {t('privacy_policy')}
              </Link>
              <Link to="/terms" className="text-sm text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie">
                {t('terms_of_service')}
              </Link>
              <Link to="/sitemap" className="text-sm text-gray-600 hover:text-servie dark:text-gray-400 dark:hover:text-servie">
                {t('sitemap')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
