
import React from 'react';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: '/placeholder.svg',
    role: 'Homeowner',
    rating: 5,
    text: 'Found an amazing plumber in my area within minutes! The service was prompt and professional. Will definitely use this platform for all my home service needs.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: '/placeholder.svg',
    role: 'Small Business Owner',
    rating: 5,
    text: 'As a business owner, finding reliable services is crucial. This platform connected me with top-notch professionals that helped my business thrive.',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    avatar: '/placeholder.svg',
    role: 'Event Planner',
    rating: 4,
    text: 'I regularly book services for events, and this platform has made my life so much easier. Great selection of vendors and seamless booking process.',
  },
  {
    id: 4,
    name: 'David Wilson',
    avatar: '/placeholder.svg',
    role: 'Property Manager',
    rating: 5,
    text: 'Managing multiple properties requires reliable service providers. Found excellent maintenance professionals that deliver consistent quality.',
  },
  {
    id: 5,
    name: 'Jessica Patel',
    avatar: '/placeholder.svg',
    role: 'Freelancer',
    rating: 5,
    text: 'The platform helped me connect with clients looking for my design services. The interface is intuitive, and the payment system is secure and reliable.',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from our community of service providers and customers about their experiences
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex animate-testimonials">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={`${testimonial.id}-${index}`} className="w-[350px] flex-shrink-0 px-4">
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm">{testimonial.text}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes testimonials {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-350px * ${testimonials.length}));
          }
        }
        
        .animate-testimonials {
          animation: testimonials 35s linear infinite; /* Slightly increased speed */
        }
      `}} />
    </section>
  );
}
