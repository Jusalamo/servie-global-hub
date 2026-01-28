import React from 'react';
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import ServiceCategoriesCarousel from './ServiceCategoriesCarousel';
import Testimonials from './Testimonials';
import ProviderCTA from './ProviderCTA';
import AdCarousel from './ads/AdCarousel';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Hero />
        <div className="max-w-[1200px] mx-auto px-4">
          <ServiceCategoriesCarousel />
        </div>
        <AdCarousel />
        <div className="max-w-[1200px] mx-auto px-4">
          <HowItWorks />
        </div>
        <Testimonials />
        <ProviderCTA />
      </main>
    </div>
  );
}