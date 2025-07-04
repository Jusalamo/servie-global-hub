
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Servie</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6">
              Servie is a comprehensive platform that connects service providers, sellers, and clients 
              in one convenient marketplace. Our mission is to make it easy for people to find quality 
              services and products while providing opportunities for entrepreneurs to grow their businesses.
            </p>
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="mb-6">
              To create a thriving ecosystem where service providers and sellers can connect with clients 
              seamlessly, fostering economic growth and community development.
            </p>
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Professional service bookings</li>
              <li>E-commerce marketplace</li>
              <li>Secure payment processing</li>
              <li>User-friendly dashboards</li>
              <li>Customer support</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
