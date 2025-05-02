
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ServiceIcon from '@/components/ServiceIcon';

const categories = [
  {
    id: 'home-cleaning',
    name: 'Home Cleaning',
    icon: 'cleaning',
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
    icon: 'gardening',
    color: 'bg-emerald-100 dark:bg-emerald-950',
  },
  {
    id: 'home-repair',
    name: 'Home Repair',
    icon: 'repair',
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
    icon: 'education',
    color: 'bg-red-100 dark:bg-red-950',
  },
  {
    id: 'pet-care',
    name: 'Pet Services',
    icon: 'pet',
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
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const handleScroll = () => {
    if (carouselRef.current) {
      setScrollPosition(carouselRef.current.scrollLeft);
    }
  };
  
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  const showLeftButton = scrollPosition > 20;
  const showRightButton = carouselRef.current 
    ? scrollPosition < carouselRef.current.scrollWidth - carouselRef.current.clientWidth - 20
    : true;

  return (
    <section className="py-16 relative bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Popular Service Categories</h2>
          <Link to="/categories" className="text-servie hover:underline">
            View All Categories
          </Link>
        </div>
        
        <div className="relative">
          {/* Shadow overlays for scroll indication */}
          <div className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 transition-opacity duration-300 ${showLeftButton ? 'opacity-100' : 'opacity-0'}`}></div>
          <div className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 transition-opacity duration-300 ${showRightButton ? 'opacity-100' : 'opacity-0'}`}></div>
          
          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm shadow-md transition-opacity duration-300 ${showLeftButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm shadow-md transition-opacity duration-300 ${showRightButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {/* Categories carousel */}
          <div 
            ref={carouselRef}
            className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto pb-6 pt-2 px-2 scrollbar-none scroll-smooth"
            onScroll={handleScroll}
          >
            {categories.map((category) => (
              <Card 
                key={category.id}
                className="w-[200px] sm:w-[220px] hover:shadow-lg transition-transform hover:scale-105 transform"
              >
                <Link to={`/categories/${category.id}`}>
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${category.color}`}>
                      <ServiceIcon name={category.icon} className="w-8 h-8" />
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
