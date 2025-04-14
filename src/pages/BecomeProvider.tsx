
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Check, AlertCircle, ChevronRight, Star, Clock, Wallet, BarChart } from "lucide-react";
import { toast } from "sonner";

export default function BecomeProvider() {
  const { isAuthenticated, signUp } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    serviceCategories: [] as string[],
    description: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    hasInsurance: false
  });
  
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState("standard");
  
  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "Free",
      description: "Perfect for those just getting started",
      features: [
        "List up to 3 services",
        "Basic profile page",
        "10% commission on bookings",
        "Customer reviews",
        "24/7 support"
      ],
      limitations: [
        "Manual booking acceptance",
        "Standard search placement",
        "No background checks included",
        "Limited analytics"
      ]
    },
    {
      id: "standard",
      name: "Standard",
      price: "$29.99/mo",
      description: "Great for growing service providers",
      features: [
        "List up to 10 services",
        "Enhanced profile page",
        "8% commission on bookings",
        "Customer reviews",
        "Priority support",
        "Free background check",
        "Basic analytics dashboard",
        "Automated booking system"
      ],
      limitations: [
        "Limited marketing tools",
        "Standard search placement"
      ]
    },
    {
      id: "premium",
      name: "Premium",
      price: "$79.99/mo",
      description: "For established businesses seeking growth",
      features: [
        "Unlimited service listings",
        "Premium profile with portfolio",
        "5% commission on bookings",
        "Featured in search results",
        "Dedicated account manager",
        "Advanced analytics & reporting",
        "Marketing toolkit",
        "Automated booking & scheduling",
        "Customer management system"
      ],
      limitations: []
    }
  ];
  
  const serviceCategories = [
    "Home Cleaning",
    "Handyman Services",
    "Plumbing",
    "Electrical Work",
    "Lawn & Garden Care",
    "Moving Services",
    "Home Renovation",
    "Interior Design",
    "Pest Control",
    "HVAC",
    "Computer & IT Services",
    "Tutoring & Education",
    "Photography",
    "Event Planning",
    "Beauty & Personal Care",
    "Health & Wellness",
    "Legal Services",
    "Financial Services",
    "Marketing & Design",
    "Other"
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        serviceCategories: [...formData.serviceCategories, category]
      });
    } else {
      setFormData({
        ...formData,
        serviceCategories: formData.serviceCategories.filter(c => c !== category)
      });
    }
  };
  
  const goToStep = (newStep: number) => {
    // Simple validation before proceeding
    if (newStep > step) {
      if (step === 1) {
        if (!formData.firstName || !formData.lastName || !formData.email) {
          toast.error("Please fill in all required fields before continuing");
          return;
        }
      } else if (step === 2) {
        if (!formData.companyName || formData.serviceCategories.length === 0) {
          toast.error("Please provide your company name and select at least one service category");
          return;
        }
      }
    }
    
    setStep(newStep);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match");
        setIsSubmitting(false);
        return;
      }
      
      if (!formData.agreeToTerms) {
        toast.error("You must agree to the terms and conditions");
        setIsSubmitting(false);
        return;
      }
      
      if (isAuthenticated) {
        // If user is already logged in, just update their role
        toast.success("Your provider account is being set up!");
        navigate("/dashboard/provider");
      } else {
        // If user is not logged in, create a new account
        await signUp(
          formData.email,
          formData.password,
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: "provider"
          }
        );
        
        toast.success("Your provider account has been created! Please check your email to verify your account.");
      }
    } catch (error) {
      console.error("Error creating provider account:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-servie/10 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
                    Grow Your Business With Servie
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Join thousands of service providers who have expanded their client base and increased revenue by listing on Servie.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="bg-servie hover:bg-servie-600 text-white"
                    size="lg"
                    onClick={() => goToStep(2)}
                  >
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                  >
                    Learn More
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>No upfront fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Access to thousands of clients</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Easy-to-use platform</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
                  alt="Service provider with client"
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-6 -left-6 bg-background rounded-lg shadow-lg p-4 max-w-xs hidden md:block">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <p className="text-sm italic">
                    "Since joining Servie, my business has grown by 60% and I've been able to hire two more employees!"
                  </p>
                  <div className="mt-2 text-sm font-medium">- Sarah, Home Cleaning Pro</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        {step === 1 && (
          <section className="py-16 bg-muted/50">
            <div className="container px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter mb-2">
                  Why Join Servie as a Provider?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Discover how we help service professionals grow their business
                </p>
              </div>
              
              <div className="grid gap-8 md:grid-cols-3">
                <Card>
                  <CardContent className="p-6">
                    <div className="rounded-full bg-servie/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <Star className="h-6 w-6 text-servie" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      Increase Your Visibility
                    </h3>
                    <p className="text-muted-foreground">
                      Get discovered by thousands of potential clients in your area looking for your specific services.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="rounded-full bg-servie/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <Clock className="h-6 w-6 text-servie" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      Save Time with Smart Tools
                    </h3>
                    <p className="text-muted-foreground">
                      Our automated booking system, payment processing, and scheduling tools help you focus on what matters most.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="rounded-full bg-servie/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <Wallet className="h-6 w-6 text-servie" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      Grow Your Income
                    </h3>
                    <p className="text-muted-foreground">
                      Providers on Servie report an average 40% increase in revenue within the first six months.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="rounded-full bg-servie/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <BarChart className="h-6 w-6 text-servie" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      Powerful Analytics
                    </h3>
                    <p className="text-muted-foreground">
                      Track your performance, understand your customers, and make data-driven decisions to grow your business.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="rounded-full bg-servie/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <Check className="h-6 w-6 text-servie" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      Build Trust
                    </h3>
                    <p className="text-muted-foreground">
                      Our verified reviews system helps you build credibility and attract more high-quality clients.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="rounded-full bg-servie/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <AlertCircle className="h-6 w-6 text-servie" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      Dedicated Support
                    </h3>
                    <p className="text-muted-foreground">
                      Our provider success team is available 7 days a week to help you maximize your potential on the platform.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-12 text-center">
                <Button 
                  className="bg-servie hover:bg-servie-600 text-white"
                  size="lg"
                  onClick={() => goToStep(2)}
                >
                  Start Your Registration
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        )}
        
        {/* Pricing Plans */}
        {step === 1 && (
          <section className="py-16" id="pricing">
            <div className="container px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter mb-2">
                  Choose the Right Plan For Your Business
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Flexible options to suit providers of all sizes
                </p>
              </div>
              
              <div className="grid gap-8 md:grid-cols-3">
                {plans.map(plan => (
                  <Card key={plan.id} className={`flex flex-col ${plan.id === 'standard' ? 'border-servie shadow-lg relative' : ''}`}>
                    {plan.id === 'standard' && (
                      <div className="absolute -top-4 left-0 right-0 text-center">
                        <span className="bg-servie text-white text-sm px-3 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <CardContent className="p-6 flex-1">
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <div className="mt-2 mb-4">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        {plan.id !== 'basic' && <span className="text-muted-foreground">/month</span>}
                      </div>
                      <p className="text-muted-foreground mb-6">{plan.description}</p>
                      
                      <div className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-center text-muted-foreground">
                            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                            <span>{limitation}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <div className="p-6 pt-0 mt-auto">
                      <Button 
                        className={plan.id === 'standard' ? "w-full bg-servie hover:bg-servie-600 text-white" : "w-full"}
                        variant={plan.id === 'standard' ? "default" : "outline"}
                        onClick={() => {
                          setSelectedPlan(plan.id);
                          goToStep(2);
                        }}
                      >
                        Choose {plan.name}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* Provider Success Stories */}
        {step === 1 && (
          <section className="py-16 bg-muted/50">
            <div className="container px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter mb-2">
                  Success Stories
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Hear from service providers who have transformed their businesses with Servie
                </p>
              </div>
              
              <div className="grid gap-8 md:grid-cols-3">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <img 
                          src="https://randomuser.me/api/portraits/men/32.jpg" 
                          alt="David Chen"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold">David Chen</h4>
                        <p className="text-sm text-muted-foreground">Electrical Services</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="italic">
                      "After 15 years as an electrician, I was looking to expand my client base. Within 3 months of joining Servie, I was fully booked weeks in advance and had to hire two additional electricians to keep up with demand."
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <img 
                          src="https://randomuser.me/api/portraits/women/44.jpg" 
                          alt="Maria Rodriguez"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold">Maria Rodriguez</h4>
                        <p className="text-sm text-muted-foreground">House Cleaning</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="italic">
                      "Starting my cleaning business was challenging until I found Servie. The platform handles all my scheduling, payments, and client communications. My revenue has doubled, and I now have a team of six cleaners!"
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <img 
                          src="https://randomuser.me/api/portraits/men/67.jpg" 
                          alt="James Wilson"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold">James Wilson</h4>
                        <p className="text-sm text-muted-foreground">Landscaping</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="italic">
                      "Servie's analytics tools helped me identify which services were most profitable and where to focus my marketing efforts. In just one year, I've increased my business valuation and opened a second location."
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-12 text-center">
                <Button 
                  className="bg-servie hover:bg-servie-600 text-white"
                  size="lg"
                  onClick={() => goToStep(2)}
                >
                  Join Servie Today
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        )}
        
        {/* FAQ Section */}
        {step === 1 && (
          <section className="py-16">
            <div className="container px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter mb-2">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Everything you need to know about becoming a service provider
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How much does it cost to join Servie?</AccordionTrigger>
                    <AccordionContent>
                      We offer multiple membership tiers starting with our Basic plan which is free to join. We charge a small commission on each completed booking (ranging from 5-10% depending on your plan). Premium plans with advanced features start at $29.99/month.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>What information do I need to register?</AccordionTrigger>
                    <AccordionContent>
                      You'll need basic personal and business information, including contact details, service categories, business registration details (if applicable), and insurance information. Depending on your service type, you may also need to provide professional certifications and licenses.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>How quickly can I start receiving booking requests?</AccordionTrigger>
                    <AccordionContent>
                      After completing your profile and passing our verification process (typically 1-2 business days), your profile will be visible to potential clients. Many providers receive their first booking request within 48 hours of approval.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger>How do I get paid for my services?</AccordionTrigger>
                    <AccordionContent>
                      Clients pay for services through the Servie platform. We hold the payment until the service is completed, then release the funds to your preferred payment method (minus our commission). Payments typically process within 1-3 business days.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger>Do I need insurance to join?</AccordionTrigger>
                    <AccordionContent>
                      While not mandatory for all service categories, we strongly recommend having appropriate business insurance. For certain categories like home services, electrical work, or childcare, proof of insurance is required.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-6">
                    <AccordionTrigger>Can I offer multiple service categories?</AccordionTrigger>
                    <AccordionContent>
                      Yes! Many providers offer multiple related services. You can select all categories that apply to your business when creating your profile.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <div className="mt-12 text-center">
                <Button 
                  className="bg-servie hover:bg-servie-600 text-white"
                  size="lg"
                  onClick={() => goToStep(2)}
                >
                  Ready to Get Started?
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        )}
        
        {/* Registration Form */}
        {step >= 2 && (
          <section className="py-16">
            <div className="container px-4 md:px-6">
              <div className="max-w-3xl mx-auto">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold tracking-tighter mb-2">
                    Provider Registration
                  </h2>
                  <p className="text-muted-foreground">
                    Complete the form below to join Servie as a service provider.
                  </p>
                </div>
                
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className={`flex items-center ${step >= 2 ? 'text-servie' : 'text-muted-foreground'}`}
                      onClick={() => step > 2 && goToStep(2)}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-2 ${step >= 2 ? 'bg-servie text-white' : 'bg-muted'}`}>
                        1
                      </div>
                      <span className={step > 2 ? 'cursor-pointer hover:underline' : ''}>Personal Details</span>
                    </div>
                    <div 
                      className={`flex items-center ${step >= 3 ? 'text-servie' : 'text-muted-foreground'}`}
                      onClick={() => step > 3 && goToStep(3)}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-2 ${step >= 3 ? 'bg-servie text-white' : 'bg-muted'}`}>
                        2
                      </div>
                      <span className={step > 3 ? 'cursor-pointer hover:underline' : ''}>Business Info</span>
                    </div>
                    <div 
                      className={`flex items-center ${step >= 4 ? 'text-servie' : 'text-muted-foreground'}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-2 ${step >= 4 ? 'bg-servie text-white' : 'bg-muted'}`}>
                        3
                      </div>
                      <span>Account Setup</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div 
                      className="h-2 bg-servie rounded-full transition-all duration-300"
                      style={{ width: `${(step - 1) * 50}%` }}
                    ></div>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Step 2: Personal Details */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input 
                            id="firstName" 
                            name="firstName" 
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input 
                            id="lastName" 
                            name="lastName" 
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <div className="space-x-2">
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={() => goToStep(1)}
                          >
                            Back
                          </Button>
                          <Button 
                            type="button"
                            className="bg-servie hover:bg-servie-600"
                            onClick={() => goToStep(3)}
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 3: Business Information */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Business/Company Name *</Label>
                        <Input 
                          id="companyName" 
                          name="companyName" 
                          value={formData.companyName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Service Categories (select all that apply) *</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {serviceCategories.map(category => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`category-${category}`}
                                checked={formData.serviceCategories.includes(category)}
                                onCheckedChange={(checked) => 
                                  handleCategoryChange(category, checked === true)
                                }
                              />
                              <Label 
                                htmlFor={`category-${category}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {category}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Business Description *</Label>
                        <Textarea 
                          id="description" 
                          name="description" 
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Tell us about your business, experience, and the services you offer..."
                          rows={4}
                          required
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="hasInsurance"
                          checked={formData.hasInsurance}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("hasInsurance", checked === true)
                          }
                        />
                        <Label 
                          htmlFor="hasInsurance"
                          className="text-sm font-normal"
                        >
                          I have business/liability insurance
                        </Label>
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <div className="space-x-2">
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={() => goToStep(2)}
                          >
                            Back
                          </Button>
                          <Button 
                            type="button"
                            className="bg-servie hover:bg-servie-600"
                            onClick={() => goToStep(4)}
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 4: Account Setup */}
                  {step === 4 && (
                    <div className="space-y-6">
                      {!isAuthenticated && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="password">Create Password *</Label>
                              <Input 
                                id="password" 
                                name="password" 
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required={!isAuthenticated}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm Password *</Label>
                              <Input 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required={!isAuthenticated}
                              />
                            </div>
                          </div>
                          
                          <Separator className="my-6" />
                        </>
                      )}
                      
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Selected Plan: {plans.find(p => p.id === selectedPlan)?.name}</h3>
                        <p className="text-muted-foreground">
                          {plans.find(p => p.id === selectedPlan)?.description}
                        </p>
                        <p className="font-semibold">
                          Price: {plans.find(p => p.id === selectedPlan)?.price}
                        </p>
                        
                        <div className="pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => goToStep(1)}
                          >
                            Change Plan
                          </Button>
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("agreeToTerms", checked === true)
                          }
                          required
                        />
                        <Label 
                          htmlFor="agreeToTerms"
                          className="text-sm font-normal"
                        >
                          I agree to the <Link to="/terms" className="text-servie hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-servie hover:underline">Privacy Policy</Link>
                        </Label>
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <div className="space-x-2">
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={() => goToStep(3)}
                          >
                            Back
                          </Button>
                          <Button 
                            type="submit"
                            className="bg-servie hover:bg-servie-600"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Submitting..." : "Complete Registration"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
