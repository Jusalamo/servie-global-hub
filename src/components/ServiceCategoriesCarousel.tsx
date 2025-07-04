
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { serviceCategories, getFeaturedCategories } from "@/data/serviceCategories";

export default function ServiceCategoriesCarousel() {
  const categories = getFeaturedCategories().slice(0, 12); // Show first 12 featured categories

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60">
      <div className="container px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
            Explore Service Categories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through our featured service categories including specialized African market solutions
          </p>
        </div>
        
        {/* Enhanced Carousel */}
        <div className="relative overflow-hidden">
          <div className="flex animate-carousel">
            {[...categories, ...categories].map((category, index) => {
              return (
                <div key={`${category.id}-${index}`} className="w-[320px] flex-shrink-0 px-4">
                  <Link to={`/categories?category=${category.id}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 service-card group">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className={`rounded-full p-4 mb-4 transition-transform group-hover:scale-110 ${category.color}`}>
                          <span className="text-2xl">{category.icon}</span>
                        </div>
                        <h3 className="text-xl font-medium mb-2">{category.name}</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {category.description}
                        </p>
                        {category.region === 'Africa' && (
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full mb-2">
                            🌍 Africa Focus
                          </span>
                        )}
                        {category.featured && (
                          <span className="inline-flex items-center px-2 py-1 bg-servie text-white text-xs rounded-full">
                            ⭐ Popular
                          </span>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="text-center mt-10">
          <Link 
            to="/categories" 
            className="bg-servie hover:bg-servie-600 text-white px-8 py-3 rounded-lg inline-flex items-center shadow-lg hover:shadow-xl transition-all duration-300 btn-gradient"
          >
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
            transform: translateX(calc(-320px * ${categories.length}));
          }
        }
        
        .animate-carousel {
          animation: carousel 80s linear infinite;
        }
      `}} />
    </section>
  );
}
