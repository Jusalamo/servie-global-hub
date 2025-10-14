
import React from 'react';
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import ServiceCategoriesCarousel from './ServiceCategoriesCarousel';
import Testimonials from './Testimonials';
import ProviderCTA from './ProviderCTA';
import AdCarousel from './ads/AdCarousel';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Dynamic background effect */}
      <div className="home-background"></div>
      
      <main className="flex-1">
        <Hero />
        <ServiceCategoriesCarousel />
        <AdCarousel />
        <HowItWorks />
        <Testimonials />
        <ProviderCTA />
      </main>
    </div>
  );
}
