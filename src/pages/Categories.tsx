
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Categories = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Service Categories</h1>
        <p>Categories coming soon...</p>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
