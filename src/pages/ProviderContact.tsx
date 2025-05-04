
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { SendIcon, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

const ProviderContact = () => {
  const { providerId } = useParams();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  // Mock provider data - in a real app, you would fetch this from an API
  const provider = {
    id: providerId,
    name: "Jane Smith",
    profession: "Professional House Cleaner",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.8,
    responseTime: "Usually responds within 2 hours",
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, this would send a message to the provider
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Your message has been sent successfully!");
      setFormData({
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Message sending error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-8">
        <Link to={`/service/${providerId}`} className="flex items-center mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Service
        </Link>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Contact Service Provider</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={provider.avatar} alt={provider.name} />
                  <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{provider.name}</CardTitle>
                  <p className="text-muted-foreground">{provider.profession}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(provider.rating) ? "text-yellow-400" : "text-gray-300"}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M10 15.585l-6.327 3.308 1.209-7.014L.293 7.36l7.03-1.022L10 0l2.677 6.34 7.03 1.022-4.588 4.518 1.209 7.014L10 15.585z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm">{provider.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{provider.responseTime}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What is your inquiry about?"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Describe your needs, questions, or request details..."
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-servie hover:bg-servie-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <SendIcon className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="mb-4">You need to be signed in to contact a service provider.</p>
                  <Button asChild className="bg-servie hover:bg-servie-600">
                    <Link to="/sign-in">Sign In</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProviderContact;
