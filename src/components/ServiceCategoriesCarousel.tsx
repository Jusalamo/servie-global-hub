
import React from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, ShoppingBag } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const featuredCategories = [
  {
    icon: Users,
    name: "Professional Services",
    description: "Business consulting, legal, accounting",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    path: "/categories?category=Professional Services"
  },
  {
    icon: ShoppingBag,
    name: "Home & Garden",
    description: "Furniture, decor, gardening supplies",
    color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    path: "/shop?category=Home & Garden"
  },
  {
    icon: Users,
    name: "Technology",
    description: "Web development, IT support, software",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    path: "/categories?category=Technology"
  },
  {
    icon: ShoppingBag,
    name: "Fashion & Beauty",
    description: "Clothing, accessories, cosmetics",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
    path: "/shop?category=Fashion"
  },
  {
    icon: Users,
    name: "Health & Wellness",
    description: "Fitness, healthcare, therapy",
    color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    path: "/categories?category=Health & Wellness"
  },
  {
    icon: ShoppingBag,
    name: "Electronics",
    description: "Gadgets, devices, accessories",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
    path: "/shop?category=Electronics"
  }
];

export default function ServiceCategoriesCarousel() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              What Are You Looking For?
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose your marketplace experience - find services or shop products
            </p>
          </div>
        </div>
        
        {/* Main action cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          <div className="flex flex-col items-center p-8 bg-gradient-to-br from-servie/10 to-servie/5 rounded-2xl border hover:shadow-lg transition-all">
            <div className="p-4 rounded-full bg-servie/20 mb-6">
              <Users className="h-8 w-8 text-servie" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Browse Services</h3>
            <p className="text-muted-foreground text-center mb-6">
              Find professional services from home maintenance to business consulting
            </p>
            <Button asChild className="bg-servie hover:bg-servie-600 w-full">
              <Link to="/categories" className="flex items-center justify-center gap-2">
                Explore Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-col items-center p-8 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl border hover:shadow-lg transition-all">
            <div className="p-4 rounded-full bg-purple-500/20 mb-6">
              <ShoppingBag className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Shop Products</h3>
            <p className="text-muted-foreground text-center mb-6">
              Discover amazing products from trusted sellers worldwide
            </p>
            <Button asChild className="bg-purple-600 hover:bg-purple-700 w-full">
              <Link to="/shop" className="flex items-center justify-center gap-2">
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Featured categories carousel */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center">Featured Categories</h3>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {featuredCategories.map((category, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Link to={category.path}>
                    <div className="flex flex-col items-center p-6 bg-background rounded-xl border hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer h-full">
                      <div className={`p-3 rounded-full mb-4 ${category.color}`}>
                        <category.icon className="h-6 w-6" />
                      </div>
                      <h4 className="font-bold text-lg mb-2 text-center">{category.name}</h4>
                      <p className="text-sm text-center text-muted-foreground">{category.description}</p>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
