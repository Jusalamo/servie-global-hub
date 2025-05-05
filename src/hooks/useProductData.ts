
import { useState, useEffect } from "react";
import { Product } from "@/components/ecommerce/ProductCard";

// Mock product categories
const mockCategories = [
  { id: "cat1", name: "Tools", icon: "tool" },
  { id: "cat2", name: "Gardening", icon: "flower" },
  { id: "cat3", name: "Cleaning", icon: "spray" },
  { id: "cat4", name: "Home Decor", icon: "home" },
  { id: "cat5", name: "Electronics", icon: "zap" }
];

// Mock products
const mockProducts: Product[] = [
  {
    id: "prod1",
    name: "Professional Tool Kit",
    description: "Complete set of high-quality tools for all your home improvement needs.",
    price: 149.99,
    compareAtPrice: 199.99,
    images: [
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1608291424139-a98b815c68b9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1617950952412-f6489d6ca013?auto=format&fit=crop&q=80&w=800"
    ],
    category: "cat1",
    providerId: "prov1",
    providerName: "Quality Tools Inc.",
    providerAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.8,
    reviewCount: 124,
    featured: true,
    inStock: true,
    createdAt: "2023-06-15T10:30:00Z",
    currency: "$"
  },
  {
    id: "prod2",
    name: "Premium Gardening Set",
    description: "Professional gardening tools with ergonomic handles and durable construction.",
    price: 89.99,
    images: [
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800"
    ],
    category: "cat2",
    providerId: "prov2",
    providerName: "Green Thumb Gardens",
    providerAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.6,
    reviewCount: 86,
    featured: false,
    inStock: true,
    createdAt: "2023-07-22T14:15:00Z",
    currency: "$"
  },
  {
    id: "prod3",
    name: "Advanced Home Cleaning Kit",
    description: "Complete cleaning solution for your home with eco-friendly products.",
    price: 65.99,
    compareAtPrice: 79.99,
    images: [
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800"
    ],
    category: "cat3",
    providerId: "prov3",
    providerName: "Clean & Clear Services",
    providerAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4.3,
    reviewCount: 57,
    featured: true,
    inStock: true,
    createdAt: "2023-08-05T09:45:00Z",
    currency: "$"
  },
  {
    id: "prod4",
    name: "Modern Wall Art Collection",
    description: "Beautiful wall art pieces to enhance your home decor.",
    price: 129.99,
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800"
    ],
    category: "cat4",
    providerId: "prov4",
    providerName: "Art & Home Designs",
    providerAvatar: "https://randomuser.me/api/portraits/men/78.jpg",
    rating: 4.9,
    reviewCount: 42,
    featured: false,
    inStock: false,
    createdAt: "2023-09-12T11:20:00Z",
    currency: "$"
  },
  {
    id: "prod5",
    name: "Smart Home Starter Kit",
    description: "Begin your smart home journey with this comprehensive starter package.",
    price: 199.99,
    compareAtPrice: 249.99,
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&q=80&w=800"
    ],
    category: "cat5",
    providerId: "prov5",
    providerName: "Smart Living Solutions",
    providerAvatar: "https://randomuser.me/api/portraits/women/22.jpg",
    rating: 4.7,
    reviewCount: 98,
    featured: true,
    inStock: true,
    createdAt: "2023-10-01T16:30:00Z",
    currency: "$"
  },
  {
    id: "prod6",
    name: "Precision Power Drill",
    description: "High-performance cordless drill with multiple speed settings and accessories.",
    price: 79.99,
    compareAtPrice: 99.99,
    images: [
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=800"
    ],
    category: "cat1",
    providerId: "prov1",
    providerName: "Quality Tools Inc.",
    providerAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.5,
    reviewCount: 64,
    featured: false,
    inStock: true,
    createdAt: "2023-07-18T08:50:00Z",
    currency: "$"
  }
];

// Sample product for detail page (same as first mock product)
export const mockProduct = mockProducts[0];

export const useProductData = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState(mockCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Function to fetch products - currently just returns mock data
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be a Supabase/API call
      // For now, just use our mock data
      setProducts(mockProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Helper function to get a product by ID
  const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };
  
  return {
    products,
    categories,
    isLoading,
    error,
    fetchProducts,
    getProductById,
    mockProducts // Export the mock products for use elsewhere
  };
};
