
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CategoryDetails = () => {
  const { categoryId } = useParams();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Category Details</h1>
        <p>Details for category {categoryId}</p>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryDetails;
