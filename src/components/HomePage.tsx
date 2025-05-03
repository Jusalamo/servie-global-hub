
import React from 'react';
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import ServiceCategoriesCarousel from './ServiceCategoriesCarousel';
import Testimonials from './Testimonials';
import ProviderCTA from './ProviderCTA';
import Footer from './Footer';
import Header from './Header';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Dynamic background effect */}
      <div className="home-background"></div>
      
      <Header />
      <main className="flex-1">
        <Hero />
        <ServiceCategoriesCarousel />
        <HowItWorks />
        <Testimonials />
        <ProviderCTA />
      </main>
      <Footer />
    </div>
  );
}
