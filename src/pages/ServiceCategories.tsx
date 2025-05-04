
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceListing from "@/components/services/ServiceListing";

export default function ServiceCategoriesPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'all';
  const initialSearch = queryParams.get('search') || '';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ServiceListing 
          initialCategory={initialCategory} 
          initialSearch={initialSearch} 
        />
      </main>
      <Footer />
    </div>
  );
}
