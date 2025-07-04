
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductListing from '@/components/ecommerce/ProductListing';

const Shop = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProductListing />
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
