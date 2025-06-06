
import React from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, ShoppingBag } from 'lucide-react';

export default function ServiceCategoriesCarousel() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              What Are You Looking For?
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose your marketplace experience - find services or shop products
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
          {/* Services Section */}
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

          {/* Products Section */}
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
      </div>
    </section>
  );
}
