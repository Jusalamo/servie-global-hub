
import { useEffect, useRef, useState } from 'react';
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
  {
    name: "Jessica Liu",
    role: "Marketing Director",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    quote: "Hiring freelance graphic designers was always hit or miss until I found Servie. The review system and portfolio showcase make it easy to find talented professionals who deliver exceptional work.",
    rating: 5,
  },
  {
    name: "Robert Wilson",
    role: "Restaurant Owner",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    quote: "When our refrigeration system broke down, we needed urgent help. Servie connected us with a technician who arrived the same day and saved thousands in potential food spoilage. A business lifesaver!",
    rating: 5,
  },
];

export default function Testimonials() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // Duplicate testimonials for infinite scrolling effect
  const allTestimonials = [...testimonials, ...testimonials, ...testimonials];
  
  // Continuous auto-scrolling with animation frame
  useEffect(() => {
    let animationId: number;
    let lastTimestamp = 0;
    const speed = 0.8; // Faster speed for testimonials (was 0.5)
    
    const scroll = (timestamp: number) => {
      if (!carouselRef.current || isPaused) {
        animationId = requestAnimationFrame(scroll);
        return;
      }
      
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      
      carouselRef.current.scrollLeft += speed * elapsed;
      
      // Reset to start when we reach the end of the first set
      if (carouselRef.current.scrollLeft >= carouselRef.current.scrollWidth / 3) {
        carouselRef.current.scrollLeft = 0;
      }
      
      animationId = requestAnimationFrame(scroll);
    };
    
    animationId = requestAnimationFrame(scroll);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPaused]);

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-muted/30 scroll-mt-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from people who have found the perfect service providers through our platform
            </p>
          </div>
        </div>
        
        <div className="relative mt-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Gradient overlays for infinite scroll effect */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-muted/30 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-muted/30 to-transparent z-10"></div>
          
          {/* Testimonial carousel with continuous scrolling */}
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-none scroll-smooth py-4 px-8 transition-all duration-300"
          >
            {allTestimonials.map((testimonial, i) => (
              <Card 
                key={`${testimonial.name}-${i}`} 
                className="testimonial-card flex-shrink-0 w-[300px] md:w-[400px] mx-3 bg-background border transform transition-transform duration-300 hover:scale-105"
              >
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
                  <blockquote className="mt-4 border-l-2 border-servie pl-4 italic text-sm">
                    "{testimonial.quote}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
