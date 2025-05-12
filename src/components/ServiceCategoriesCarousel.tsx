
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, Briefcase, Scissors, CalendarClock, Truck, GraduationCap, 
  Heart, Palette, Wrench, Baby, Car, Camera, Globe
} from "lucide-react";

const categories = [
  {
    id: 'home-services',
    name: 'Home Services',
    icon: Home,
    description: 'Cleaning, repairs, gardening and more',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: Briefcase,
    description: 'Legal, financial, consulting services',
    color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    icon: Scissors,
    description: 'Hair, beauty, spa and wellness',
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
  },
  {
    id: 'events',
    name: 'Events',
    icon: CalendarClock,
    description: 'Planning, catering, entertainment',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: Truck,
    description: 'Delivery, moving, ride services',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  },
  {
    id: 'education',
    name: 'Education',
    icon: GraduationCap,
    description: 'Tutoring, courses, skill development',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: Heart,
    description: 'Fitness, nutrition, therapy services',
    color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  },
  {
    id: 'creative',
    name: 'Creative',
    icon: Palette,
    description: 'Design, photography, writing services',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  },
  {
    id: 'technical',
    name: 'Technical',
    icon: Wrench,
    description: 'IT support, repairs, technical services',
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
  },
  {
    id: 'childcare',
    name: 'Child Care',
    icon: Baby,
    description: 'Babysitting, nannying, daycare',
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: Car,
    description: 'Car repair, detailing, driving lessons',
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: Camera,
    description: 'Professional photography and video services',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: Globe,
    description: 'Travel planning, guides, tourism',
    color: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
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
            {[...categories, ...categories].map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={`${category.id}-${index}`} className="w-[300px] flex-shrink-0 px-4">
                  <Link to={`/categories?category=${category.id}`}>
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className={`rounded-full p-4 mb-4 ${category.color}`}>
                          <IconComponent className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">{category.name}</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {category.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="text-center mt-10">
          <Link to="/categories" className="bg-servie hover:bg-servie-600 text-white px-6 py-2 rounded-md inline-flex items-center">
            View All Categories
          </Link>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes carousel {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-300px * ${categories.length}));
          }
        }
        
        .animate-carousel {
          animation: carousel 60s linear infinite; /* Slowed down more than before */
        }
      `}} />
    </section>
  );
}
