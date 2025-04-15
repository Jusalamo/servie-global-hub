
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import EnhancedFooter from "@/components/EnhancedFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BriefcaseIcon, CheckCircle2, Clock, DollarSign, Globe, Star as StarIcon, User2 } from "lucide-react";
import { toast } from "sonner";

const BecomeProvider = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [activeStep, setActiveStep] = useState("info");

  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || "",
    lastName: user?.user_metadata?.last_name || "",
    email: user?.email || "",
    phone: "",
    businessName: "",
    serviceCategory: "",
    serviceDescription: "",
    serviceArea: "",
    experience: "",
    licenseNumber: "",
    hasEquipment: true,
    termsAccepted: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    // This would typically connect to your Supabase backend
    toast.success("Your provider application has been submitted!", {
      description: "We'll review your information and get back to you shortly."
    });
    
    // Redirect to the dashboard or confirmation page
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const renderInfoStep = () => (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Your first name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Your last name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email address"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your phone number"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name (if applicable)</Label>
          <Input 
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Your business name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serviceCategory">Service Category</Label>
          <select
            id="serviceCategory"
            name="serviceCategory"
            value={formData.serviceCategory}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select a category</option>
            <option value="home-services">Home Services</option>
            <option value="professional">Professional Services</option>
            <option value="health-wellness">Health & Wellness</option>
            <option value="beauty">Beauty & Personal Care</option>
            <option value="events">Events & Entertainment</option>
            <option value="tech">Tech & Digital Services</option>
            <option value="education">Education & Tutoring</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceDescription">Describe Your Services</Label>
        <Textarea 
          id="serviceDescription"
          name="serviceDescription"
          value={formData.serviceDescription}
          onChange={handleChange}
          placeholder="Provide a detailed description of the services you offer"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="serviceArea">Service Area</Label>
          <Input 
            id="serviceArea"
            name="serviceArea"
            value={formData.serviceArea}
            onChange={handleChange}
            placeholder="Cities or areas you serve"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience</Label>
          <Input 
            id="experience"
            name="experience"
            type="number"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Number of years"
            min="0"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="licenseNumber">Professional License/Certification (if applicable)</Label>
        <Input 
          id="licenseNumber"
          name="licenseNumber"
          value={formData.licenseNumber}
          onChange={handleChange}
          placeholder="License or certification number"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="hasEquipment" 
          checked={formData.hasEquipment} 
          onCheckedChange={(checked) => handleCheckboxChange("hasEquipment", checked === true)}
        />
        <Label htmlFor="hasEquipment" className="text-sm font-normal">
          I have all the necessary equipment and tools for my services
        </Label>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="termsAccepted" 
            checked={formData.termsAccepted} 
            onCheckedChange={(checked) => handleCheckboxChange("termsAccepted", checked === true)}
            required
          />
          <Label htmlFor="termsAccepted" className="text-sm font-normal">
            I agree to Servie's <a href="/terms" className="text-servie">Terms of Service</a>, <a href="/privacy" className="text-servie">Privacy Policy</a>, and <a href="/provider-terms" className="text-servie">Provider Agreement</a>
          </Label>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={() => setActiveStep("payment")} className="bg-servie hover:bg-servie-600">
          Continue to Payment Information
        </Button>
      </div>
    </form>
  );

  const renderPaymentStep = () => (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Payment Information</h3>
        <p className="text-muted-foreground">
          To receive payments for your services, please provide your banking information.
          All payment information is securely stored and processed.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Holder Name</Label>
            <Input 
              id="accountName"
              placeholder="Name as it appears on your bank account"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountType">Account Type</Label>
            <select
              id="accountType"
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select account type</option>
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="business">Business</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="routingNumber">Routing Number</Label>
            <Input 
              id="routingNumber"
              placeholder="9-digit routing number"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input 
              id="accountNumber"
              placeholder="Your account number"
              required
            />
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-medium mb-2">Commission Information</h3>
          <p className="text-muted-foreground mb-4">
            Servie charges a 15% commission fee on all service bookings processed through our platform. 
            This fee covers payment processing, marketing, and platform maintenance.
          </p>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Payment Example</CardTitle>
              <CardDescription>For a $100 service booking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Service Fee:</span>
                  <span className="font-medium">$100.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Commission (15%):</span>
                  <span className="font-medium text-red-500">-$15.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Processing Fee (2.9% + $0.30):</span>
                  <span className="font-medium text-red-500">-$3.20</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold">Your Payout:</span>
                  <span className="font-bold">$81.80</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center space-x-2 pt-4">
          <Checkbox id="paymentTerms" required />
          <Label htmlFor="paymentTerms" className="text-sm font-normal">
            I understand and agree to the payment terms and commission structure
          </Label>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setActiveStep("info")}
        >
          Back to Information
        </Button>
        <Button type="submit" className="bg-servie hover:bg-servie-600">
          Complete Registration
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-servie/10 to-purple-100 dark:from-servie/10 dark:to-purple-900/20 py-12 md:py-20">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Become a Service Provider</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Join our network of professionals and grow your business by reaching more clients.
              </p>
              {!isAuthenticated && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => navigate('/signin')} variant="outline" size="lg">
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/signup')} className="bg-servie hover:bg-servie-600" size="lg">
                    Create Account
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 md:py-16">
          <div className="container px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Become a Service Provider?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="bg-servie/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Globe className="text-servie h-6 w-6" />
                  </div>
                  <CardTitle>Expand Your Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Connect with clients across your service area and beyond through our growing platform.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="bg-servie/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <DollarSign className="text-servie h-6 w-6" />
                  </div>
                  <CardTitle>Boost Your Income</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Increase your earnings through consistent bookings and competitive service pricing.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="bg-servie/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Clock className="text-servie h-6 w-6" />
                  </div>
                  <CardTitle>Flexible Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Set your own hours and availability while maintaining complete control over your services.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 md:py-16 bg-muted/50">
          <div className="container px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-servie/30"></div>
                
                {/* Step 1 */}
                <div className="relative flex md:flex-row flex-col-reverse md:even:flex-row-reverse mb-8 md:mb-16">
                  <div className="md:w-1/2 md:pr-12 md:even:pr-0 md:even:pl-12 mt-4 md:mt-0">
                    <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                    <p className="text-muted-foreground">
                      Sign up and build your professional profile showcasing your skills, experience, and service offerings.
                    </p>
                  </div>
                  <div className="md:w-1/2 flex justify-start md:justify-center">
                    <div className="bg-white dark:bg-gray-800 border-servie border-2 rounded-full h-10 w-10 flex items-center justify-center shadow-lg z-10">
                      <p className="font-semibold text-servie">1</p>
                    </div>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="relative flex md:flex-row flex-col-reverse md:even:flex-row-reverse mb-8 md:mb-16">
                  <div className="md:w-1/2 md:pr-12 md:even:pr-0 md:even:pl-12 mt-4 md:mt-0">
                    <h3 className="text-xl font-semibold mb-2">Set Your Services & Rates</h3>
                    <p className="text-muted-foreground">
                      Define your service offerings, set your competitive rates, and specify your availability.
                    </p>
                  </div>
                  <div className="md:w-1/2 flex justify-start md:justify-center">
                    <div className="bg-white dark:bg-gray-800 border-servie border-2 rounded-full h-10 w-10 flex items-center justify-center shadow-lg z-10">
                      <p className="font-semibold text-servie">2</p>
                    </div>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="relative flex md:flex-row flex-col-reverse md:even:flex-row-reverse mb-8 md:mb-16">
                  <div className="md:w-1/2 md:pr-12 md:even:pr-0 md:even:pl-12 mt-4 md:mt-0">
                    <h3 className="text-xl font-semibold mb-2">Receive Booking Requests</h3>
                    <p className="text-muted-foreground">
                      Clients will discover your services and send booking requests based on your availability.
                    </p>
                  </div>
                  <div className="md:w-1/2 flex justify-start md:justify-center">
                    <div className="bg-white dark:bg-gray-800 border-servie border-2 rounded-full h-10 w-10 flex items-center justify-center shadow-lg z-10">
                      <p className="font-semibold text-servie">3</p>
                    </div>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="relative flex md:flex-row flex-col-reverse md:even:flex-row-reverse">
                  <div className="md:w-1/2 md:pr-12 md:even:pr-0 md:even:pl-12 mt-4 md:mt-0">
                    <h3 className="text-xl font-semibold mb-2">Complete Services & Get Paid</h3>
                    <p className="text-muted-foreground">
                      Deliver exceptional service, build your reputation through reviews, and receive secure payments.
                    </p>
                  </div>
                  <div className="md:w-1/2 flex justify-start md:justify-center">
                    <div className="bg-white dark:bg-gray-800 border-servie border-2 rounded-full h-10 w-10 flex items-center justify-center shadow-lg z-10">
                      <p className="font-semibold text-servie">4</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Provider Stories */}
        <section className="py-12 md:py-16">
          <div className="container px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Success Stories</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Hear from professionals who have grown their business with Servie
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <img 
                      src="https://via.placeholder.com/80?text=J" 
                      alt="James" 
                      className="rounded-full h-16 w-16 object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">James T.</CardTitle>
                      <p className="text-sm text-muted-foreground">Electrician</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="italic text-muted-foreground">
                    "Since joining Servie, my client base has grown by 40%. The platform makes it easy to manage bookings and payments, allowing me to focus on what I do best."
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <img 
                      src="https://via.placeholder.com/80?text=M" 
                      alt="Maria" 
                      className="rounded-full h-16 w-16 object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">Maria S.</CardTitle>
                      <p className="text-sm text-muted-foreground">Home Cleaner</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="italic text-muted-foreground">
                    "I was struggling to find consistent clients until I discovered Servie. Now I have a full schedule and have been able to increase my rates due to high demand."
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <img 
                      src="https://via.placeholder.com/80?text=D" 
                      alt="David" 
                      className="rounded-full h-16 w-16 object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">David K.</CardTitle>
                      <p className="text-sm text-muted-foreground">Personal Trainer</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="italic text-muted-foreground">
                    "The platform's tools have helped me streamline my business operations. The calendar management and automated reminders have reduced no-shows by 90%."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Registration Form Section */}
        {isAuthenticated && (
          <section className="py-12 md:py-16 bg-muted/50">
            <div className="container px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Register as a Provider</h2>
                
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="info">
                          <div className="flex items-center">
                            <CheckCircle2 className={`mr-2 h-4 w-4 ${activeStep === "info" ? "text-servie" : ""}`} />
                            Information
                          </div>
                        </TabsTrigger>
                        <TabsTrigger value="payment">
                          <div className="flex items-center">
                            <DollarSign className={`mr-2 h-4 w-4 ${activeStep === "payment" ? "text-servie" : ""}`} />
                            Payment Details
                          </div>
                        </TabsTrigger>
                      </TabsList>
                      <div className="mt-6">
                        <TabsContent value="info">
                          {renderInfoStep()}
                        </TabsContent>
                        <TabsContent value="payment">
                          {renderPaymentStep()}
                        </TabsContent>
                      </div>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="py-12 md:py-16">
          <div className="container px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How much does it cost to join as a provider?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    It's free to create a provider account. We only charge a 15% commission on completed bookings, which covers payment processing, marketing, and platform maintenance.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How and when do I get paid?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Payments are deposited directly to your linked bank account. Funds are typically processed within 2-3 business days after a service is marked as completed.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What documentation do I need to provide?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Requirements vary by service type and location. Some services may require professional licenses, insurance certificates, or background checks. You'll be guided through the specific requirements during registration.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I set my own schedule and prices?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, you have full control over your availability, service areas, and pricing. You can adjust these at any time through your provider dashboard.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How do I handle cancellations?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You can set your own cancellation policy (flexible, moderate, or strict). Our system automatically enforces your chosen policy and handles any applicable fees.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-servie/10">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of service providers who are expanding their client base and increasing their income with Servie.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <Button 
                    onClick={() => window.scrollTo({top: document.getElementById("registration-form")?.offsetTop || 0, behavior: "smooth"})} 
                    className="bg-servie hover:bg-servie-600" size="lg"
                  >
                    Complete Your Registration
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={() => navigate('/signin')} 
                      variant="outline" 
                      size="lg"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => navigate('/signup')} 
                      className="bg-servie hover:bg-servie-600" 
                      size="lg"
                    >
                      Register Now
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <EnhancedFooter />
    </div>
  );
};

export default BecomeProvider;
