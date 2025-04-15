
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import EnhancedFooter from "@/components/EnhancedFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";

// Mock service categories for provider registration
const serviceCategories = [
  "Home Maintenance",
  "Cleaning",
  "Electrical",
  "Plumbing",
  "Landscaping",
  "Interior Design",
  "Personal Training",
  "Beauty & Wellness",
  "Event Planning",
  "Technical Support",
  "Education & Tutoring",
  "Health Services",
  "Transportation"
];

// Mock pricing plans
const pricingPlans = [
  {
    title: "Basic",
    price: "$9.99/month",
    features: [
      "List up to 5 services",
      "Basic profile customization",
      "Access to messaging system",
      "15% service fee",
      "Weekly payouts"
    ],
    recommended: false
  },
  {
    title: "Professional",
    price: "$24.99/month",
    features: [
      "List up to 15 services",
      "Advanced profile customization",
      "Priority in search results",
      "10% service fee",
      "Bi-weekly payouts",
      "Customer analytics"
    ],
    recommended: true
  },
  {
    title: "Premium",
    price: "$49.99/month",
    features: [
      "Unlimited service listings",
      "Featured provider status",
      "Top placement in search results",
      "7.5% service fee",
      "Daily payouts",
      "Advanced analytics dashboard",
      "Dedicated support"
    ],
    recommended: false
  }
];

export default function BecomeProvider() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: user?.user_metadata?.business_name || "",
    firstName: user?.user_metadata?.first_name || "",
    lastName: user?.user_metadata?.last_name || "",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || "",
    address: user?.user_metadata?.address || "",
    city: user?.user_metadata?.city || "",
    state: user?.user_metadata?.state || "",
    zip: user?.user_metadata?.zip || "",
    businessDescription: "",
    categories: [],
    businessRegistrationNumber: "",
    yearsExperience: "",
    websiteUrl: "",
    selectedPlan: "Professional",
    agreeTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => {
      if (prev.categories.includes(category)) {
        return {
          ...prev,
          categories: prev.categories.filter(cat => cat !== category)
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, category]
        };
      }
    });
  };

  const handlePlanSelection = (plan) => {
    setFormData({
      ...formData,
      selectedPlan: plan
    });
  };

  const nextStep = () => {
    window.scrollTo(0, 0);
    setStep(step + 1);
  };

  const prevStep = () => {
    window.scrollTo(0, 0);
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call to register provider
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Your application has been submitted successfully! We'll review your information and get back to you soon.");
      
      // In a real application, you would redirect the user after successful submission
      // and potentially update their role in the database
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      toast.error("There was an error submitting your application. Please try again.");
      console.error("Provider registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8 max-w-3xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold">Business Information</h2>
              <p className="text-muted-foreground">Tell us about your business</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessRegistrationNumber">Business Registration Number (Optional)</Label>
                  <Input
                    id="businessRegistrationNumber"
                    name="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessDescription">Business Description</Label>
                <Textarea
                  id="businessDescription"
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  placeholder="Describe your business, services, and expertise..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">Years of Experience</Label>
                  <Input
                    id="yearsExperience"
                    name="yearsExperience"
                    type="number"
                    min="0"
                    value={formData.yearsExperience}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL (Optional)</Label>
                  <Input
                    id="websiteUrl"
                    name="websiteUrl"
                    type="url"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    placeholder="https://yourbusiness.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Service Categories (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {serviceCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={category} 
                        checked={formData.categories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <label
                        htmlFor={category}
                        className="text-sm cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={nextStep} 
                className="bg-servie hover:bg-servie-600"
              >
                Next Step
              </Button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-8 max-w-3xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold">Personal Information</h2>
              <p className="text-muted-foreground">Your contact details</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zip">Zip/Postal Code</Label>
                  <Input
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                onClick={prevStep}
                variant="outline"
              >
                Previous Step
              </Button>
              <Button 
                onClick={nextStep}
                className="bg-servie hover:bg-servie-600"
              >
                Next Step
              </Button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold">Select a Plan</h2>
              <p className="text-muted-foreground">Choose the plan that works best for your business</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingPlans.map((plan) => (
                <div 
                  key={plan.title}
                  className={`border rounded-lg overflow-hidden transition-all ${
                    formData.selectedPlan === plan.title 
                      ? 'border-servie ring-2 ring-servie ring-opacity-50' 
                      : 'border-border hover:border-servie'
                  }`}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold">{plan.title}</h3>
                    <div className="mt-2 text-2xl font-bold">{plan.price}</div>
                    
                    {plan.recommended && (
                      <div className="mt-2">
                        <span className="bg-servie text-white text-xs px-2 py-1 rounded-full">
                          Recommended
                        </span>
                      </div>
                    )}
                    
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={() => handlePlanSelection(plan.title)}
                      className={`w-full mt-6 ${
                        formData.selectedPlan === plan.title 
                          ? 'bg-servie hover:bg-servie-600' 
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {formData.selectedPlan === plan.title ? 'Selected' : 'Select Plan'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <Button 
                onClick={prevStep}
                variant="outline"
              >
                Previous Step
              </Button>
              <Button 
                onClick={nextStep}
                className="bg-servie hover:bg-servie-600"
              >
                Next Step
              </Button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-8 max-w-3xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold">Complete Your Registration</h2>
              <p className="text-muted-foreground">Review your information and submit</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Business Name</div>
                    <div>{formData.businessName}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Registration Number</div>
                    <div>{formData.businessRegistrationNumber || 'Not provided'}</div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="text-sm text-muted-foreground">Business Description</div>
                    <div className="whitespace-pre-wrap">{formData.businessDescription}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Years of Experience</div>
                    <div>{formData.yearsExperience} years</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Website</div>
                    <div>{formData.websiteUrl || 'Not provided'}</div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="text-sm text-muted-foreground">Service Categories</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.categories.map(category => (
                        <span key={category} className="bg-background border px-2 py-1 rounded-full text-xs">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div>{formData.firstName} {formData.lastName}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div>{formData.email}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div>{formData.phone}</div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="text-sm text-muted-foreground">Address</div>
                    <div>{formData.address}, {formData.city}, {formData.state} {formData.zip}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Selected Plan</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="font-medium text-lg">{formData.selectedPlan} Plan</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {pricingPlans.find(p => p.title === formData.selectedPlan)?.price}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="agreeTerms" 
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => setFormData({...formData, agreeTerms: !!checked})}
                  required
                />
                <label htmlFor="agreeTerms" className="text-sm">
                  I agree to the <a href="/terms" className="text-servie hover:underline">Terms of Service</a> and <a href="/privacy" className="text-servie hover:underline">Privacy Policy</a>. I understand and agree that my submitted information will be reviewed by Servie's team before my provider account is activated.
                </label>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                onClick={prevStep}
                variant="outline"
              >
                Previous Step
              </Button>
              <Button 
                onClick={handleSubmit}
                className="bg-servie hover:bg-servie-600"
                disabled={!formData.agreeTerms || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Complete Registration"}
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Benefits data
  const benefits = [
    {
      title: "Expand Your Business",
      description: "Reach thousands of potential customers actively looking for your services.",
      icon: "📈"
    },
    {
      title: "Flexible Scheduling",
      description: "Work on your own schedule. Accept only the jobs that fit your availability.",
      icon: "🗓️"
    },
    {
      title: "Secure Payments",
      description: "Get paid securely through our platform with protection for both you and your clients.",
      icon: "💳"
    },
    {
      title: "Build Your Reputation",
      description: "Collect reviews and ratings to build your online reputation and credibility.",
      icon: "⭐"
    },
    {
      title: "Marketing Support",
      description: "We help promote your services through our marketing channels and search engine optimization.",
      icon: "📱"
    },
    {
      title: "Professional Tools",
      description: "Access our suite of business tools to manage appointments, track earnings, and grow your client base.",
      icon: "🛠️"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-servie to-blue-600 text-white py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold">Become a Service Provider</h1>
                <p className="text-xl">Join our network of professional service providers and grow your business.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => document.getElementById('registration-form').scrollIntoView({ behavior: 'smooth' })}
                    size="lg"
                    className="bg-white text-servie hover:bg-gray-100"
                  >
                    Get Started
                  </Button>
                  <Button 
                    onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/20"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                  alt="Service Provider" 
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Why Join Our Platform?</h2>
              <p className="text-xl text-muted-foreground mt-4">Discover the advantages of becoming a service provider on Servie</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold">{benefit.title}</h3>
                  <p className="text-muted-foreground mt-2">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="text-xl text-muted-foreground mt-4">Simple steps to become a service provider</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-servie rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-bold">Sign Up</h3>
                <p className="text-muted-foreground mt-2">Complete the registration form with your business details</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-servie rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-bold">Get Verified</h3>
                <p className="text-muted-foreground mt-2">Our team reviews your application and verifies your credentials</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-servie rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-bold">Set Up Profile</h3>
                <p className="text-muted-foreground mt-2">Create your profile, add services, and set your availability</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-servie rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">4</div>
                <h3 className="text-xl font-bold">Start Earning</h3>
                <p className="text-muted-foreground mt-2">Receive booking requests and grow your business</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Provider Success Stories</h2>
              <p className="text-xl text-muted-foreground mt-4">Hear from service providers who've grown their business with us</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Provider" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold">Michael Rodriguez</div>
                    <div className="text-sm text-muted-foreground">Home Maintenance Specialist</div>
                  </div>
                </div>
                <p className="italic">"Since joining Servie as a provider, my client base has grown by 40%. The platform makes it easy to manage bookings and get paid promptly."</p>
                <div className="flex mt-4">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                    <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="Provider" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold">Sarah Johnson</div>
                    <div className="text-sm text-muted-foreground">Interior Designer</div>
                  </div>
                </div>
                <p className="italic">"The exposure I've received through Servie has been incredible. The platform's marketing tools have helped me reach clients I never would have found otherwise."</p>
                <div className="flex mt-4">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                    <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="Provider" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold">David Chen</div>
                    <div className="text-sm text-muted-foreground">Technical Support Specialist</div>
                  </div>
                </div>
                <p className="italic">"As a freelance tech specialist, Servie has given me the stability I needed. The steady stream of clients and secure payment system have transformed my business."</p>
                <div className="flex mt-4">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Registration Form */}
        <section id="registration-form" className="py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Register as a Provider</h2>
              <p className="text-xl text-muted-foreground mt-4">Fill out the form below to get started</p>
            </div>
            
            {/* Progress indicator */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="flex justify-between">
                <div className={`text-center ${step >= 1 ? 'text-servie' : 'text-muted-foreground'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${step >= 1 ? 'bg-servie text-white' : 'bg-muted'}`}>1</div>
                  <div className="text-sm">Business Info</div>
                </div>
                <div className={`text-center ${step >= 2 ? 'text-servie' : 'text-muted-foreground'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${step >= 2 ? 'bg-servie text-white' : 'bg-muted'}`}>2</div>
                  <div className="text-sm">Personal Info</div>
                </div>
                <div className={`text-center ${step >= 3 ? 'text-servie' : 'text-muted-foreground'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${step >= 3 ? 'bg-servie text-white' : 'bg-muted'}`}>3</div>
                  <div className="text-sm">Select Plan</div>
                </div>
                <div className={`text-center ${step >= 4 ? 'text-servie' : 'text-muted-foreground'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${step >= 4 ? 'bg-servie text-white' : 'bg-muted'}`}>4</div>
                  <div className="text-sm">Complete</div>
                </div>
              </div>
              <div className="relative mt-2">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-muted"></div>
                <div 
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-servie transition-all" 
                  style={{ width: `${(step - 1) * 33.33}%` }}
                ></div>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto bg-background p-8 rounded-lg shadow">
              {renderStep()}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground mt-4">Find answers to common questions about becoming a service provider</p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold">What are the requirements to become a service provider?</h3>
                <p className="text-muted-foreground mt-2">To become a service provider on Servie, you need to have relevant experience or qualifications in your service area, a valid ID, proof of business registration (if applicable), and pass our verification process.</p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold">How much does it cost to join as a provider?</h3>
                <p className="text-muted-foreground mt-2">We offer different subscription plans starting from $9.99 per month. Each plan includes different features and service fee rates. You can choose the plan that best fits your business needs.</p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold">How do I get paid for my services?</h3>
                <p className="text-muted-foreground mt-2">Payments are processed through our secure payment system. Clients pay through the platform, and we transfer the funds to your preferred payment method (minus the service fee) according to your plan's payout schedule.</p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold">Can I set my own prices and availability?</h3>
                <p className="text-muted-foreground mt-2">Yes, you have full control over your pricing and availability. You can set your rates for each service you offer and specify which days and times you're available to work.</p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold">How long does the verification process take?</h3>
                <p className="text-muted-foreground mt-2">The verification process typically takes 2-3 business days. Once your application is submitted, our team reviews your information and credentials to ensure quality standards.</p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold">What happens if a client cancels a booking?</h3>
                <p className="text-muted-foreground mt-2">We have a cancellation policy that protects both providers and clients. If a client cancels within a certain timeframe, you may be entitled to a cancellation fee based on our policy.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <EnhancedFooter />
    </div>
  );
}
