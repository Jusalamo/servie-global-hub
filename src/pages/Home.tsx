
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Servie</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your one-stop platform for services and products
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              to="/services" 
              className="p-6 border rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">Services</h3>
              <p className="text-muted-foreground">Browse professional services</p>
            </Link>
            <Link 
              to="/shop" 
              className="p-6 border rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">Shop</h3>
              <p className="text-muted-foreground">Browse products</p>
            </Link>
            <Link 
              to="/about" 
              className="p-6 border rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">About Us</h3>
              <p className="text-muted-foreground">Learn more about Servie</p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
