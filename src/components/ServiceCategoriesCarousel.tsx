
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const categories = [
  {
    id: 'home-services',
    name: 'Home Services',
    icon: '🏠',
    description: 'Cleaning, repairs, gardening and more',
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: '💼',
    description: 'Legal, financial, consulting services',
  },
  {
    id: 'tech',
    name: 'Tech & Digital',
    icon: '💻',
    description: 'Web development, IT support, digital marketing',
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: '🩺',
    description: 'Fitness, nutrition, therapy services',
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    icon: '💇',
    description: 'Hair, beauty, spa and wellness',
  },
  {
    id: 'events',
    name: 'Events',
    icon: '🎉',
    description: 'Planning, catering, entertainment',
  },
  {
    id: 'education',
    name: 'Education',
    icon: '📚',
    description: 'Tutoring, courses, skill development',
  },
  {
    id: 'creative',
    name: 'Creative',
    icon: '🎨',
    description: 'Design, photography, writing services',
  }
];

export default function ServiceCategoriesCarousel() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Explore Service Categories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through our wide range of service categories to find exactly what you need
          </p>
        </div>
        
        {/* Carousel */}
        <div className="relative overflow-hidden">
          {/* Duplicated for continuous scrolling */}
          <div className="flex animate-carousel">
            {[...categories, ...categories].map((category, index) => (
              <div key={`${category.id}-${index}`} className="w-[300px] flex-shrink-0 px-4">
                <Link to={`/categories?category=${category.id}`}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="text-4xl mb-4">{category.icon}</div>
                      <h3 className="text-xl font-medium mb-2">{category.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {category.description}
                      </p>
                      <Button variant="outline" size="sm">
                        Explore
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-10">
          <Button asChild size="lg" className="bg-servie hover:bg-servie-600">
            <Link to="/categories">View All Categories</Link>
          </Button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes carousel {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-300px * ${categories.length}));
          }
        }
        
        .animate-carousel {
          animation: carousel 40s linear infinite; /* Slowed down from the default */
        }
      `}</style>
    </section>
  );
}
