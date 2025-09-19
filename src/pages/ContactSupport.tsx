
import { useState } from 'react';
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MessageSquare, Clock, SendHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

const ContactSupport = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(t("Your message has been sent. We'll get back to you soon!"));
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <>
      <Breadcrumb additionalCrumbs={[{ label: t('Contact Support') }]} />
      
      <div className="bg-background">
        <div className="responsive-container py-12">
          <h1 className="text-3xl font-bold text-center mb-2">{t('Contact Support')}</h1>
          <p className="text-muted-foreground text-center mb-10">
            {t('Our team is ready to assist you with any questions or issues')}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center enhanced-card">
              <div className="mx-auto bg-servie/10 text-servie w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t('Phone Support')}</h3>
              <p className="text-muted-foreground mb-4">{t('Available 24/7 for urgent issues')}</p>
              <p className="font-medium">+1 (800) 123-4567</p>
            </Card>
            
            <Card className="p-6 text-center enhanced-card">
              <div className="mx-auto bg-servie/10 text-servie w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t('Email Support')}</h3>
              <p className="text-muted-foreground mb-4">{t('Response within 24 hours')}</p>
              <p className="font-medium">support@servie.com</p>
            </Card>
            
            <Card className="p-6 text-center enhanced-card">
              <div className="mx-auto bg-servie/10 text-servie w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t('Live Chat')}</h3>
              <p className="text-muted-foreground mb-4">{t('Available during business hours')}</p>
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" />
                <p className="font-medium">9AM - 6PM EST</p>
              </div>
            </Card>
          </div>
          
          <Card className="max-w-2xl mx-auto p-8 enhanced-card">
            <h2 className="text-2xl font-bold mb-6">{t('Send us a message')}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    {t('Name')}
                  </label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t('Your name')}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    {t('Email')}
                  </label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t('Your email address')}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  {t('Subject')}
                </label>
                <Input 
                  id="subject" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder={t('What is your inquiry about?')}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  {t('Message')}
                </label>
                <Textarea 
                  id="message" 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t('How can we help you?')}
                  rows={5}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-servie hover:bg-servie-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('Sending...')}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <SendHorizontal className="mr-2 h-4 w-4" />
                    {t('Send Message')}
                  </span>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ContactSupport;
