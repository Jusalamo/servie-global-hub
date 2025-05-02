
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home, Briefcase, Scissors, CalendarClock, Truck, GraduationCap, Heart, Palette, Wrench, Hammer, Package, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Map category IDs to their corresponding Lucide icons
const categoryIcons = {
  'home-cleaning': Home,
  'plumbing': Wrench,
  'electrical': Palette,
  'landscaping': Palette,
  'home-repair': Hammer,
  'moving': Truck,
  'beauty': Heart,
  'tech': Wrench,
  'tutoring': GraduationCap,
  'pet-care': Heart,
  'design': Palette,
  'business': Briefcase
};

const categories = [
  {
    id: 'home-cleaning',
    name: 'Home Cleaning',
    icon: 'home-cleaning',
    color: 'bg-blue-100 dark:bg-blue-950',
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: 'plumbing',
    color: 'bg-green-100 dark:bg-green-950',
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: 'electrical',
    color: 'bg-yellow-100 dark:bg-yellow-950',
  },
  {
    id: 'landscaping',
    name: 'Landscaping',
    icon: 'landscaping',
    color: 'bg-emerald-100 dark:bg-emerald-950',
  },
  {
    id: 'home-repair',
    name: 'Home Repair',
    icon: 'home-repair',
    color: 'bg-orange-100 dark:bg-orange-950',
  },
  {
    id: 'moving',
    name: 'Moving',
    icon: 'moving',
    color: 'bg-purple-100 dark:bg-purple-950',
  },
  {
    id: 'beauty',
    name: 'Beauty & Wellness',
    icon: 'beauty',
    color: 'bg-pink-100 dark:bg-pink-950',
  },
  {
    id: 'tech',
    name: 'Tech Support',
    icon: 'tech',
    color: 'bg-cyan-100 dark:bg-cyan-950',
  },
  {
    id: 'tutoring',
    name: 'Tutoring',
    icon: 'tutoring',
    color: 'bg-red-100 dark:bg-red-950',
  },
  {
    id: 'pet-care',
    name: 'Pet Services',
    icon: 'pet-care',
    color: 'bg-teal-100 dark:bg-teal-950',
  },
  {
    id: 'design',
    name: 'Design & Creative',
    icon: 'design',
    color: 'bg-indigo-100 dark:bg-indigo-950',
  },
  {
    id: 'business',
    name: 'Business Services',
    icon: 'business',
    color: 'bg-gray-100 dark:bg-gray-800',
  }
];

export default function ServiceCategoriesCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // Duplicate categories for infinite scrolling effect
  const allCategories = [...categories, ...categories];
  
  // Continuous auto-scrolling
  useEffect(() => {
    let animationId: number;
    let lastTimestamp = 0;
    const speed = 0.5; // pixels per millisecond (adjust for speed)
    
    const scroll = (timestamp: number) => {
      if (!carouselRef.current || isPaused) {
        animationId = requestAnimationFrame(scroll);
        return;
      }
      
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      
      const currentScroll = carouselRef.current.scrollLeft;
      carouselRef.current.scrollLeft += speed * elapsed;
      
      // Reset to start when we reach the end of the first set
      if (carouselRef.current.scrollLeft >= carouselRef.current.scrollWidth / 2) {
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
  
  // Get the appropriate icon component for a category
  const getCategoryIcon = (iconName: string) => {
    const IconComponent = categoryIcons[iconName as keyof typeof categoryIcons] || Package;
    return <IconComponent className="w-8 h-8" />;
  };

  return (
    <section className="py-16 relative bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Popular Service Categories</h2>
          <Link to="/categories" className="text-servie hover:underline">
            View All Categories
          </Link>
        </div>
        
        <div className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Remove scrollbar and navigation buttons for continuous flow */}
          <div 
            ref={carouselRef}
            className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto pb-6 pt-2 px-2 scrollbar-none"
          >
            {allCategories.map((category, index) => (
              <Card 
                key={`${category.id}-${index}`}
                className="w-[200px] sm:w-[220px] hover:shadow-lg transition-transform hover:scale-105 transform"
              >
                <Link to={`/categories/${category.id}`}>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${category.color}`}>
                      {getCategoryIcon(category.id)}
                    </div>
                    <h3 className="font-medium">{category.name}</h3>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
