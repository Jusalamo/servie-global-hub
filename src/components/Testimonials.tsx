
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Homeowner",
    avatar: "https://i.pravatar.cc/150?img=1",
    content: "I've been using Servie for all my home maintenance needs. The platform is so easy to use, and I've found reliable professionals every time. Highly recommend!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Small Business Owner",
    avatar: "https://i.pravatar.cc/150?img=8",
    content: "As a business owner, I need reliable service providers for various tasks. Servie has been a game changer - from IT support to office cleaning, I can find and book professionals quickly.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Freelance Designer",
    avatar: "https://i.pravatar.cc/150?img=5",
    content: "I joined Servie as a service provider last year, and my client base has grown tremendously. The platform makes it easy to showcase my work and connect with clients.",
    rating: 5,
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Property Manager",
    avatar: "https://i.pravatar.cc/150?img=3",
    content: "Managing multiple properties became so much easier with Servie. I can quickly find reliable plumbers, electricians, and cleaners all in one place. The service history tracking is invaluable.",
    rating: 4,
  },
  {
    id: 5,
    name: "Olivia Taylor",
    role: "Event Planner",
    avatar: "https://i.pravatar.cc/150?img=9",
    content: "I rely on Servie to find specialty services for my clients' events. From caterers to photographers, the quality of professionals on this platform is outstanding.",
    rating: 5,
  },
  {
    id: 6,
    name: "David Okafor",
    role: "Home Remodeler",
    avatar: "https://i.pravatar.cc/150?img=12",
    content: "As a service provider on Servie, I've been able to grow my business and reach a wider audience. The booking and payment system makes everything streamlined.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-muted/30 overflow-hidden">
      <div className="container px-4 text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join thousands of satisfied customers and service providers who use our platform every day
        </p>
      </div>
      
      <div className="relative">
        {/* First row - moves left to right */}
        <div className="flex animate-marquee-left mb-6">
          {[...testimonials, ...testimonials.slice(0,3)].map((testimonial, i) => (
            <div key={`left-${testimonial.id}-${i}`} className="w-[350px] flex-shrink-0 px-4">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
        
        {/* Second row - moves right to left */}
        <div className="flex animate-marquee-right">
          {[...testimonials.reverse(), ...testimonials.slice(0,3).reverse()].map((testimonial, i) => (
            <div key={`right-${testimonial.id}-${i}`} className="w-[350px] flex-shrink-0 px-4">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-350px * ${testimonials.length}));
          }
        }
        
        @keyframes marquee-right {
          0% {
            transform: translateX(calc(-350px * ${testimonials.length}));
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-marquee-left {
          animation: marquee-left 35s linear infinite; /* Faster animation */
        }
        
        .animate-marquee-right {
          animation: marquee-right 30s linear infinite; /* Faster animation */
        }
      `}</style>
    </section>
  );
}

// Testimonial Card Component
const TestimonialCard = ({ testimonial }: { testimonial: any }) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-10 w-10 mr-4">
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold">{testimonial.name}</h4>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
        <div className="mb-4">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-lg ${i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
              ★
            </span>
          ))}
        </div>
        <p className="text-muted-foreground">&ldquo;{testimonial.content}&rdquo;</p>
      </CardContent>
    </Card>
  );
};
