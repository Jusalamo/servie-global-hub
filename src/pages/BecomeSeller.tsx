
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Check, ArrowRight, Package, CreditCard, TrendingUp, Store, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function BecomeSeller() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // If already signed in, redirect to signup page with seller role pre-selected
      navigate('/signup?role=seller');
    } else {
      // If not authenticated, redirect to signup page with seller role pre-selected
      navigate('/signup?role=seller');
    }
  };

  const benefits = [
    { 
      title: "Set up your store", 
      description: "Create your storefront in minutes and start selling immediately",
      icon: <Store className="h-6 w-6 text-servie" />
    },
    { 
      title: "Manage inventory easily", 
      description: "Track products, orders, and shipments from one dashboard",
      icon: <Package className="h-6 w-6 text-servie" /> 
    },
    { 
      title: "Get paid securely", 
      description: "Receive payments directly to your account with low transaction fees",
      icon: <CreditCard className="h-6 w-6 text-servie" /> 
    },
    { 
      title: "Grow your business", 
      description: "Access analytics and tools to help expand your customer base",
      icon: <TrendingUp className="h-6 w-6 text-servie" /> 
    },
    { 
      title: "Connect with customers", 
      description: "Build relationships through our integrated messaging system",
      icon: <Users className="h-6 w-6 text-servie" /> 
    },
  ];

  const pricingTiers = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for starting sellers",
      features: [
        "List up to 10 products",
        "Basic analytics",
        "Standard processing fee (5%)",
        "Community support"
      ],
      buttonText: "Start Free",
      popular: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "Best for growing businesses",
      features: [
        "Unlimited products",
        "Advanced analytics",
        "Reduced processing fee (3.5%)",
        "Priority support",
        "Custom storefront"
      ],
      buttonText: "Try Pro",
      popular: true
    },
    {
      name: "Business",
      price: "$79",
      period: "/month",
      description: "For established businesses",
      features: [
        "Everything in Pro",
        "Lowest processing fee (2.5%)",
        "Dedicated account manager",
        "API access",
        "Bulk upload tools"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-servie-50 to-background py-20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block bg-servie/10 px-3 py-1 rounded-full text-sm font-medium text-servie">
                  Sell on Servie
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                  Turn Your Products Into <span className="text-servie">Profit</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                  Join thousands of sellers on our platform and reach customers looking for quality products like yours. Start selling in minutes with our easy-to-use platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-servie hover:bg-servie-600" onClick={handleGetStarted}>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Start Selling
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate('/shop')}>
                    Explore Marketplace
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <img 
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Seller dashboard" 
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Sell With Us?</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Our platform provides everything you need to build and grow your online business.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-0 shadow-md">
                  <CardHeader>
                    <div className="mb-3">
                      {benefit.icon}
                    </div>
                    <CardTitle>{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Choose the plan that works best for your business needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {pricingTiers.map((tier, index) => (
                <Card key={index} className={`flex flex-col border ${tier.popular ? 'border-servie shadow-lg ring-2 ring-servie' : ''}`}>
                  <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      {tier.period && <span className="text-gray-600 dark:text-gray-400">{tier.period}</span>}
                    </div>
                    <CardDescription className="mt-1.5">{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <Check className="h-4 w-4 text-servie mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant={tier.popular ? "default" : "outline"} className={`w-full ${tier.popular ? 'bg-servie hover:bg-servie-600' : ''}`} onClick={handleGetStarted}>
                      {tier.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-servie text-white">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold">Ready to start selling?</h2>
              <p className="text-xl opacity-90">
                Join thousands of successful sellers on our platform today
              </p>
              <Button size="lg" variant="secondary" onClick={handleGetStarted} className="mt-6">
                Create Your Seller Account <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
