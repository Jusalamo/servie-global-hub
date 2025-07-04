
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">About Servie</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Servie is Africa's premier platform connecting service providers with clients and showcasing amazing products from local sellers.
          </p>
          <p className="mb-6">
            Founded with the vision of empowering African entrepreneurs and service providers, Servie creates opportunities for growth and connection across the continent.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
