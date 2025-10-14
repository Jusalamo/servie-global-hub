
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ServiceListing from "@/components/services/ServiceListing";
import AdCarousel from "@/components/ads/AdCarousel";

export default function ServiceCategoriesPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'all';
  const initialSearch = queryParams.get('search') || '';
  
  return (
    <>
      <AdCarousel />
      <ServiceListing 
        initialCategory={initialCategory} 
        initialSearch={initialSearch} 
      />
    </>
  );
}
