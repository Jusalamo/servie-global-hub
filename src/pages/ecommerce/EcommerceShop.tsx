
import { useLocation } from "react-router-dom";
import ProductListing from "@/components/ecommerce/ProductListing";

export default function EcommerceShop() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'all';
  const initialSearch = queryParams.get('search') || '';
  
  return (
    <ProductListing 
      initialCategory={initialCategory} 
      initialSearch={initialSearch} 
    />
  );
}
