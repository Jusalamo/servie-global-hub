
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Homeowner",
    avatar: "https://randomuser.me/api/portraits/women/42.jpg",
    quote: "Finding a reliable plumber used to be a nightmare until I discovered Servie. Within an hour of posting my request, I had three qualified plumbers reaching out with quotes. The service was exceptional!",
    rating: 5,
  },
  {
    name: "Michael Thomas",
    role: "Small Business Owner",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    quote: "As a small business owner, I needed to update my website quickly. Through Servie, I connected with a skilled web developer who delivered a stunning website on time and within budget. Highly recommend!",
    rating: 5,
  },
  {
    name: "Aisha Kwame",
    role: "Event Planner",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    quote: "Servie has transformed how I find vendors for events. The platform makes it easy to compare service providers, check reviews, and communicate directly. It's now my go-to for all professional services.",
    rating: 4,
  },
  {
    name: "David Chen",
    role: "Homeowner",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "I needed emergency electrical work done on a Sunday. Using Servie, I found a licensed electrician who came within the hour. The quality of service providers on this platform is outstanding.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-muted/50 scroll-mt-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              What Our Users Say
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from people who have found the perfect service providers through our platform
            </p>
          </div>
        </div>
        
        <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="bg-background border">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex space-x-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? "text-servie fill-servie" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <blockquote className="mt-4 border-l-2 border-servie pl-4 italic">
                  "{testimonial.quote}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-10">
          <div className="flex space-x-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === 0 ? "bg-servie" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
