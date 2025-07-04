
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceListing from '@/components/services/ServiceListing';

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ServiceListing />
      </main>
      <Footer />
    </div>
  );
};

export default Services;
