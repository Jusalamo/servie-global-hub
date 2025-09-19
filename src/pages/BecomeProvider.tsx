
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Check, ArrowRight, Calendar, Star, Users, TrendingUp, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function BecomeProvider() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/signup?role=provider');
    } else {
      navigate('/signup?role=provider');
    }
  };

  const benefits = [
    { 
      title: "Showcase your expertise", 
      description: "Create a professional profile that highlights your skills and services",
      icon: <Briefcase className="h-6 w-6 text-servie" />
    },
    { 
      title: "Manage your schedule", 
      description: "Stay organized with our integrated booking and calendar system",
      icon: <Calendar className="h-6 w-6 text-servie" /> 
    },
    { 
      title: "Build your reputation", 
      description: "Collect reviews and ratings to stand out from the competition",
      icon: <Star className="h-6 w-6 text-servie" /> 
    },
    { 
      title: "Grow your client base", 
      description: "Connect with clients looking specifically for your services",
      icon: <Users className="h-6 w-6 text-servie" /> 
    },
    { 
      title: "Track your performance", 
      description: "Access detailed analytics to optimize your service offerings",
      icon: <TrendingUp className="h-6 w-6 text-servie" /> 
    },
  ];

  const serviceCategories = [
    "Home Services",
    "Professional Services",
    "Health & Wellness",
    "Beauty",
    "Education & Tutoring",
    "Events & Entertainment",
    "Tech & Digital",
    "Legal Services"
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Interior Designer",
      content: "Since becoming a service provider on Servie, I've doubled my client base and increased my revenue by 40%. The platform makes it easy to showcase my portfolio and connect with clients who are specifically looking for my expertise.",
      avatar: "https://randomuser.me/api/portraits/women/43.jpg"
    },
    {
      name: "Michael Chen",
      role: "Personal Trainer",
      content: "The scheduling system has transformed how I manage my business. I spend less time on admin work and more time with clients. Plus, the payment processing is seamless, which has eliminated cash flow issues I used to face.",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      name: "Priya Patel",
      role: "Business Consultant",
      content: "As a consultant, having a platform that handles the client acquisition part of my business has been invaluable. I can focus on delivering excellent service while Servie brings qualified leads directly to me.",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-servie-50 to-background py-20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block bg-servie/10 px-3 py-1 rounded-full text-sm font-medium text-servie">
                  Service Providers
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                  Share Your <span className="text-servie">Expertise</span> & Grow Your Business
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                  Connect with clients who need your skills. Our platform helps professionals like you manage bookings, payments, and client relationships all in one place.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-servie hover:bg-servie-600" onClick={handleGetStarted}>
                    <Briefcase className="mr-2 h-5 w-5" />
                    Become a Provider
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate('/categories')}>
                    Browse Services
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <img 
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Service provider with client" 
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
              <h2 className="text-3xl font-bold mb-4">Why Join As A Provider?</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Our platform is designed to help service professionals thrive and grow their business.
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

        {/* Service Categories */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Service Categories</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We connect providers across a wide range of services with clients who need their expertise
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
              {serviceCategories.map((category, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-gray-800 rounded-lg p-5 text-center shadow-sm transition hover:shadow-md border border-gray-100 dark:border-gray-700"
                >
                  <p className="font-medium">{category}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Hear From Our Providers</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Success stories from professionals who've grown their business with us
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      <div className="text-center space-y-2">
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-servie">{testimonial.role}</p>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 italic text-center">
                        "{testimonial.content}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-servie text-white">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold">Ready to grow your service business?</h2>
              <p className="text-xl opacity-90">
                Join our community of top-rated service providers today
              </p>
              <Button size="lg" variant="secondary" onClick={handleGetStarted} className="mt-6">
                Start Your Provider Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
      </section>
    </>
  );
}
