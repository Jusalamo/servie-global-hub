
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ServiceListing from "@/components/services/ServiceListing";

export default function ServiceCategoriesPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'all';
  const initialSearch = queryParams.get('search') || '';
  
  return (
    <ServiceListing 
      initialCategory={initialCategory} 
      initialSearch={initialSearch} 
    />
  );
}
