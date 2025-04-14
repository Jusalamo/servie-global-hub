
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/context/AuthContext";

// Form validation schema
const sellerFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  businessName: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a valid address"),
  businessDescription: z.string().min(20, "Description must be at least 20 characters"),
  categories: z.string().min(1, "Please select at least one category"),
  taxNumber: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Product Categories
const productCategories = [
  "Electronics & Accessories",
  "Home & Garden",
  "Fashion & Apparel",
  "Health & Beauty",
  "Books & Entertainment",
  "Sports & Outdoor",
  "Toys & Games",
  "Automotive",
  "Handmade Crafts",
  "Food & Beverages",
];

// Seller benefits
const sellerBenefits = [
  "Access to millions of customers on our global marketplace",
  "User-friendly platform for easy product listing and management",
  "Secure payment processing and fraud protection",
  "Detailed analytics and reporting on sales performance",
  "Seller success team to help you optimize your business",
  "Marketing tools to help you promote your products",
  "Only 7% commission on all sales - lower than industry average",
  "Fast payouts - get paid within 7 days of a completed order",
];

// FAQ questions
const faqQuestions = [
  {
    question: "What is the commission structure?",
    answer: "We charge a competitive 7% commission on all sales. This is significantly lower than industry standards, which typically range from 15% to 30%. This commission covers payment processing, platform maintenance, customer service, and marketing efforts."
  },
  {
    question: "How long does it take to get approved?",
    answer: "Most seller applications are reviewed within 2-3 business days. Once approved, you can immediately start listing products and making sales."
  },
  {
    question: "What information do I need to provide?",
    answer: "You'll need to provide basic business information, including contact details, product categories, and tax information if applicable. For certain product categories, additional verification may be required."
  },
  {
    question: "When and how do I get paid?",
    answer: "Payments are processed every 7 days for completed orders. You can receive payments via direct bank transfer, PayPal, or other supported payment methods in your region."
  },
  {
    question: "Can I sell internationally?",
    answer: "Yes, you can sell to customers globally. Our platform handles currency conversion and provides shipping options for international deliveries."
  },
  {
    question: "What kind of support do sellers receive?",
    answer: "Sellers have access to our dedicated seller support team, comprehensive documentation, seller community forums, and regular webinars on best practices and platform updates."
  },
];

type FormValues = z.infer<typeof sellerFormSchema>;

export default function BecomeSeller() {
  const [currentTab, setCurrentTab] = useState<string>("benefits");
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();

  // Set up the form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(sellerFormSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      email: "",
      phone: "",
      address: "",
      businessDescription: "",
      categories: "",
      taxNumber: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Form submitted:", values);
    toast.success("Registration submitted successfully!", {
      description: "We'll review your application and get back to you soon."
    });
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero Section */}
        <section className="bg-servie/5 dark:bg-servie/10 py-16 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Start Selling on Servie
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Join thousands of successful sellers on our platform and grow your business with our global marketplace.
                  </p>
                </div>
                
                <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-4 mt-6">
                  <Button 
                    size="lg" 
                    className="bg-servie hover:bg-servie-600"
                    onClick={() => setCurrentTab("registration")}
                  >
                    Register Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setCurrentTab("faq")}
                  >
                    Learn More
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-3 pt-4">
                  <div className="flex items-center text-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-servie/10 text-servie mr-2">7%</span>
                    <span>Commission Only</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-servie/10 text-servie mr-2">7d</span>
                    <span>Fast Payouts</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-servie/10 text-servie mr-2">24/7</span>
                    <span>Seller Support</span>
                  </div>
                </div>
              </div>
              
              <div className="mx-auto flex items-center justify-center">
                <div className="aspect-video overflow-hidden rounded-2xl border bg-muted p-2">
                  <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                    width={600}
                    height={400}
                    alt="Successful online seller managing their business"
                    className="aspect-video object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Tabs */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue={currentTab} value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-12">
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                <TabsTrigger value="registration">Registration</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>
              
              {/* Benefits Tab */}
              <TabsContent value="benefits" className="space-y-12">
                {/* Benefits Section */}
                <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold">Why Sell with Us?</h2>
                    <p className="text-muted-foreground text-lg">
                      Our platform provides everything you need to start, manage, and grow your online business with minimal hassle and maximum profit.
                    </p>
                    
                    <ul className="space-y-3 mt-6">
                      {sellerBenefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 flex-shrink-0 text-servie mt-1" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="mt-4 bg-servie hover:bg-servie-600"
                      onClick={() => setCurrentTab("registration")}
                    >
                      Start Selling Today
                    </Button>
                  </div>
                  
                  {/* Commission Structure */}
                  <div className="space-y-4 bg-muted/50 p-6 rounded-lg border">
                    <h3 className="text-2xl font-bold">Commission Structure</h3>
                    <p className="text-muted-foreground">
                      We believe in transparent and fair pricing that helps your business thrive.
                    </p>
                    
                    <div className="mt-6 space-y-6">
                      <div className="bg-background p-6 rounded-lg border">
                        <div className="text-4xl font-bold text-servie">7%</div>
                        <p className="mt-2 font-medium">Commission on All Sales</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Industry average: 15-30%
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">What's included:</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-servie" />
                            <span>Payment processing</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-servie" />
                            <span>Fraud protection</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-servie" />
                            <span>Platform maintenance</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-servie" />
                            <span>Customer service</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-servie" />
                            <span>Marketing exposure</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Testimonials */}
                <div className="mt-16 space-y-6">
                  <h2 className="text-3xl font-bold text-center mb-8">What Our Sellers Say</h2>
                  
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="bg-muted/50 p-6 rounded-lg border">
                      <div className="flex items-center text-servie mb-2">
                        <Star className="fill-servie h-4 w-4" />
                        <Star className="fill-servie h-4 w-4" />
                        <Star className="fill-servie h-4 w-4" />
                        <Star className="fill-servie h-4 w-4" />
                        <Star className="fill-servie h-4 w-4" />
                      </div>
                      <p className="italic">
                        "I've been selling on multiple platforms for years, and Servie offers the lowest commission rates while providing excellent support. My sales have doubled in just 6 months!"
                      </p>
                      <div className="mt-4 font-semibold">
                        Sarah K. - Handmade Crafts Seller
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-6 rounded-lg border">
                      <div className="flex items-center text-servie mb-2">
                        <Star className="fill-servie h-4 w-4" />
                        <Star className="fill-servie h-4 w-4" />
                        <Star className="fill-servie h-4 w-4" />
                        <Star className="fill-servie h-4 w-4" />
                        <Star className="fill-servie h-4 w-4" />
                      </div>
                      <p className="italic">
                        "The seller dashboard is so intuitive and provides all the analytics I need to grow my business. The weekly payouts are reliable and fast."
                      </p>
                      <div className="mt-4 font-semibold">
                        Michael T. - Electronics Seller
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-6 rounded-lg border">
                      <div className="flex items-center text-servie mb-2">
                        <Star className="fill-servie h-4 w-4" />
                        <Star className="fill-servie h-4 w-4" />
                        <Star className="fill-servie h-4 w-4" />
                        <Star className="fill-servie h-4 w-4" />
                        <Star className="fill-servie h-4 w-4" />
                      </div>
                      <p className="italic">
                        "As a small business owner, the 7% commission rate makes a huge difference to my bottom line. The seller support team is always there when I need help."
                      </p>
                      <div className="mt-4 font-semibold">
                        Aisha B. - Home Decor Seller
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Steps to Get Started */}
                <div className="mt-16 space-y-6">
                  <h2 className="text-3xl font-bold text-center mb-8">Steps to Get Started</h2>
                  
                  <div className="grid gap-6 md:grid-cols-4">
                    <div className="text-center space-y-3">
                      <div className="h-16 w-16 bg-servie/10 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-2xl font-bold text-servie">1</span>
                      </div>
                      <h3 className="font-semibold text-lg">Complete Registration</h3>
                      <p className="text-sm text-muted-foreground">
                        Fill out the seller application form with your business details
                      </p>
                    </div>
                    
                    <div className="text-center space-y-3">
                      <div className="h-16 w-16 bg-servie/10 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-2xl font-bold text-servie">2</span>
                      </div>
                      <h3 className="font-semibold text-lg">Verification</h3>
                      <p className="text-sm text-muted-foreground">
                        We'll verify your information within 2-3 business days
                      </p>
                    </div>
                    
                    <div className="text-center space-y-3">
                      <div className="h-16 w-16 bg-servie/10 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-2xl font-bold text-servie">3</span>
                      </div>
                      <h3 className="font-semibold text-lg">List Products</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload your products with descriptions, images and pricing
                      </p>
                    </div>
                    
                    <div className="text-center space-y-3">
                      <div className="h-16 w-16 bg-servie/10 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-2xl font-bold text-servie">4</span>
                      </div>
                      <h3 className="font-semibold text-lg">Start Selling</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive orders, ship products, and get paid within 7 days
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center mt-10">
                    <Button
                      className="bg-servie hover:bg-servie-600"
                      size="lg"
                      onClick={() => setCurrentTab("registration")}
                    >
                      Register as a Seller Now
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Registration Tab */}
              <TabsContent value="registration">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl font-bold mb-6">Seller Registration Form</h2>
                  <p className="text-muted-foreground mb-8">
                    Complete this form to apply as a seller on our platform. We'll review your application and get back to you within 2-3 business days.
                  </p>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Name (if applicable)</FormLabel>
                              <FormControl>
                                <Input placeholder="Your business name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="Your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Physical Address *</FormLabel>
                            <FormControl>
                              <Input placeholder="Your address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="businessDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Description *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about your business and products..." 
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Categories *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {productCategories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="taxNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tax/Business Registration Number (if applicable)</FormLabel>
                            <FormControl>
                              <Input placeholder="Your tax/registration number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password *</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Create a password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password *</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Confirm your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="termsAccepted"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I accept the <a href="#" className="text-servie underline">Terms and Conditions</a> and <a href="#" className="text-servie underline">Seller Agreement</a> *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full bg-servie hover:bg-servie-600">
                        Submit Registration
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="mt-8 text-sm text-muted-foreground">
                    <p>* Required fields</p>
                    <p className="mt-2">
                      By submitting this form, you agree to allow us to process your information for the purpose of seller verification.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              {/* FAQ Tab */}
              <TabsContent value="faq">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {faqQuestions.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  
                  <div className="mt-12 p-6 bg-muted/50 rounded-lg border">
                    <h3 className="text-xl font-semibold mb-3">Still have questions?</h3>
                    <p className="text-muted-foreground mb-4">
                      Our seller support team is here to help you with any questions about becoming a seller on our platform.
                    </p>
                    <Button className="bg-servie hover:bg-servie-600">
                      Contact Seller Support
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
