export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "client" | "provider" | "seller" | "admin";
  location?: string;
  favorites?: string[];
  avatar?: string;
}

export interface Service {
  id: string;
  providerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  categoryId: string;
  location: string;
  images: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  responseTime: string;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  categoryId: string;
  images: string[];
  inventory: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  inStock: boolean;
}

export interface Booking {
  id: string;
  clientId: string;
  serviceId: string;
  bookingDate: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

export interface Review {
  id: string;
  userId: string;
  targetId: string;
  targetType: "service" | "product" | "provider";
  rating: number;
  comment: string;
  createdAt: string;
}

// Initial mock data
export const users = [
  {
    id: "client-1",
    firstName: "Alice",
    lastName: "Smith",
    email: "alice.smith@example.com",
    role: "client",
    location: "Los Angeles, CA",
    favorites: ["1", "3", "5"],
    avatar: "https://api.dicebear.com/7.x/ лица/svg?seed=Alice"
  },
  {
    id: "provider-1",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@example.com",
    role: "provider",
    location: "Los Angeles, CA",
    avatar: "https://api.dicebear.com/7.x/ лица/svg?seed=Bob"
  },
  {
    id: "provider-2",
    firstName: "Charlie",
    lastName: "Brown",
    email: "charlie.brown@example.com",
    role: "provider",
    location: "New York, NY",
    avatar: "https://api.dicebear.com/7.x/ лица/svg?seed=Charlie"
  },
  {
    id: "provider-3",
    firstName: "Diana",
    lastName: "Miller",
    email: "diana.miller@example.com",
    role: "provider",
    location: "San Francisco, CA",
    avatar: "https://api.dicebear.com/7.x/ лица/svg?seed=Diana"
  },
  {
    id: "provider-4",
    firstName: "Ethan",
    lastName: "Davis",
    email: "ethan.davis@example.com",
    role: "provider",
    location: "Miami, FL",
    avatar: "https://api.dicebear.com/7.x/ лица/svg?seed=Ethan"
  },
  {
    id: "provider-5",
    firstName: "Fiona",
    lastName: "Wilson",
    email: "fiona.wilson@example.com",
    role: "provider",
    location: "Chicago, IL",
    avatar: "https://api.dicebear.com/7.x/ лица/svg?seed=Fiona"
  },
  {
    id: "provider-6",
    firstName: "George",
    lastName: "Moore",
    email: "george.moore@example.com",
    role: "provider",
    location: "Austin, TX",
    avatar: "https://api.dicebear.com/7.x/ лица/svg?seed=George"
  },
  {
    id: "seller-1",
    firstName: "Hannah",
    lastName: "Taylor",
    email: "hannah.taylor@example.com",
    role: "seller",
    location: "Los Angeles, CA",
    avatar: "https://api.dicebear.com/7.x/ лица/svg?seed=Hannah"
  },
  {
    id: "seller-2",
    firstName: "Ian",
    lastName: "Clark",
    email: "ian.clark@example.com",
    role: "seller",
    location: "New York, NY",
    avatar: "https://api.dicebear.com/7.x/ лица/svg?seed=Ian"
  },
  {
    id: "seller-3",
    firstName: "Julia",
    lastName: "White",
    email: "julia.white@example.com",
    role: "seller",
    location: "San Francisco, CA",
    avatar: "https://api.dicebear.com/7.x/ лица/svg?seed=Julia"
  },
  {
    id: "seller-4",
    firstName: "Kevin",
    lastName: "Hall",
    email: "kevin.hall@example.com",
    role: "seller",
    location: "Miami, FL",
    avatar: "https://api.dicebear.com/7.x/ лица/svg?seed=Kevin"
  },
  {
    id: "seller-5",
    firstName: "Linda",
    lastName: "Young",
    email: "linda.young@example.com",
    role: "seller",
    location: "Chicago, IL",
    avatar: "https://api.dicebear.com/7.x/ лица/svg?seed=Linda"
  },
  {
    id: "seller-6",
    firstName: "Michael",
    lastName: "King",
    email: "michael.king@example.com",
    role: "seller",
    location: "Austin, TX",
    avatar: "https://api.dicebear.com/7.x/ лица/svg?seed=Michael"
  }
];

// Enhanced services with images
export const services = [
  {
    id: "1",
    providerId: "provider-1",
    title: "Professional House Cleaning",
    description: "Complete home cleaning service including all rooms, kitchen, and bathrooms. Eco-friendly products used.",
    price: 120,
    category: "Cleaning",
    categoryId: "1-3",
    location: "Los Angeles, CA",
    images: [
      "https://images.unsplash.com/photo-1558618047-b00de36e47d7?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?w=500&h=400&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 156,
    featured: true,
    responseTime: "Within 2 hours"
  },
  {
    id: "2",
    providerId: "provider-2", 
    title: "Emergency Plumbing Repair",
    description: "24/7 emergency plumbing services. Pipe repairs, leak fixes, and drain cleaning.",
    price: 95,
    category: "Plumbing",
    categoryId: "1-1",
    location: "New York, NY",
    images: [
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618047-b00de36e47d7?w=500&h=400&fit=crop"
    ],
    rating: 4.6,
    reviewCount: 89,
    featured: false,
    responseTime: "Within 1 hour"
  },
  {
    id: "3",
    providerId: "provider-3",
    title: "Wedding Photography Package",
    description: "Complete wedding photography with engagement shoot, ceremony, and reception coverage.",
    price: 2500,
    category: "Photography",
    categoryId: "3-1", 
    location: "San Francisco, CA",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=400&fit=crop"
    ],
    rating: 4.9,
    reviewCount: 234,
    featured: true,
    responseTime: "Within 4 hours"
  },
  {
    id: "4",
    providerId: "provider-4",
    title: "Personal Training Sessions",
    description: "One-on-one fitness training tailored to your goals. Nutrition planning included.",
    price: 80,
    category: "Fitness",
    categoryId: "5-1",
    location: "Miami, FL", 
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=500&h=400&fit=crop"
    ],
    rating: 4.7,
    reviewCount: 145,
    featured: false,
    responseTime: "Within 3 hours"
  },
  {
    id: "5",
    providerId: "provider-5",
    title: "Hair Styling & Coloring",
    description: "Professional hair styling, cutting, and coloring services. Latest trends and techniques.",
    price: 150,
    category: "Beauty",
    categoryId: "2-1",
    location: "Chicago, IL",
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&h=400&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 198,
    featured: true,
    responseTime: "Within 2 hours"
  },
  {
    id: "6",
    providerId: "provider-6",
    title: "Website Development",
    description: "Custom website development using modern technologies. Mobile-responsive design included.",
    price: 1200,
    category: "Web Development", 
    categoryId: "4-2",
    location: "Austin, TX",
    images: [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=400&fit=crop"
    ],
    rating: 4.9,
    reviewCount: 87,
    featured: false,
    responseTime: "Within 6 hours"
  }
];

// Enhanced products with images
export const products = [
  {
    id: "1",
    sellerId: "seller-1",
    name: "Premium Hair Extensions - Remy Human Hair",
    description: "100% Remy human hair extensions. Available in 16-24 inches. Multiple colors available.",
    price: 299.99,
    compareAtPrice: 399.99,
    category: "Hair Extensions",
    categoryId: "1-1",
    images: [
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&h=400&fit=crop"
    ],
    inventory: 25,
    rating: 4.7,
    reviewCount: 89,
    featured: true,
    inStock: true
  },
  {
    id: "2", 
    sellerId: "seller-2",
    name: "Professional Makeup Brush Set",
    description: "15-piece professional makeup brush set with premium synthetic bristles and leather case.",
    price: 89.99,
    compareAtPrice: 129.99,
    category: "Makeup",
    categoryId: "1-2",
    images: [
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=400&fit=crop"
    ],
    inventory: 45,
    rating: 4.8,
    reviewCount: 156,
    featured: false,
    inStock: true
  },
  {
    id: "3",
    sellerId: "seller-3", 
    name: "iPhone 15 Pro - Latest Model",
    description: "Latest iPhone 15 Pro with 128GB storage. Titanium finish with advanced camera system.",
    price: 999.99,
    compareAtPrice: 1099.99,
    category: "Smartphones",
    categoryId: "2-1",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500&h=400&fit=crop"
    ],
    inventory: 12,
    rating: 4.9,
    reviewCount: 234,
    featured: true,
    inStock: true
  },
  {
    id: "4",
    sellerId: "seller-4",
    name: "Gaming Laptop - High Performance",
    description: "High-performance gaming laptop with RTX 4070, 32GB RAM, and 1TB SSD. Perfect for gaming and work.",
    price: 1899.99,
    compareAtPrice: 2199.99,
    category: "Laptops", 
    categoryId: "2-2",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=400&fit=crop"
    ],
    inventory: 8,
    rating: 4.6,
    reviewCount: 67,
    featured: false,
    inStock: true
  },
  {
    id: "5",
    sellerId: "seller-5",
    name: "Designer Women's Dress Collection",
    description: "Elegant designer dress perfect for special occasions. Available in multiple sizes and colors.",
    price: 199.99,
    compareAtPrice: 279.99,
    category: "Women's Clothing",
    categoryId: "3-1",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=400&fit=crop"
    ],
    inventory: 35,
    rating: 4.5,
    reviewCount: 123,
    featured: true,
    inStock: true
  },
  {
    id: "6",
    sellerId: "seller-6",
    name: "Home Fitness Equipment Set",
    description: "Complete home fitness set including dumbbells, resistance bands, and yoga mat.",
    price: 149.99,
    compareAtPrice: 199.99,
    category: "Fitness Equipment",
    categoryId: "5-1", 
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=500&h=400&fit=crop"
    ],
    inventory: 22,
    rating: 4.4,
    reviewCount: 78,
    featured: false,
    inStock: true
  }
];

export const bookings = [
  {
    id: "booking-1",
    clientId: "client-1",
    serviceId: "1",
    bookingDate: "2024-08-15T10:00:00",
    status: "confirmed",
    notes: "Please bring your own cleaning supplies."
  },
  {
    id: "booking-2",
    clientId: "client-1",
    serviceId: "2",
    bookingDate: "2024-08-22T14:00:00",
    status: "pending"
  },
  {
    id: "booking-3",
    clientId: "client-1",
    serviceId: "3",
    bookingDate: "2024-09-05T16:00:00",
    status: "completed"
  }
];

export const reviews = [
  {
    id: "review-1",
    userId: "client-1",
    targetId: "1",
    targetType: "service",
    rating: 5,
    comment: "Great cleaning service! Very thorough and professional.",
    createdAt: "2024-08-18T12:00:00"
  },
  {
    id: "review-2",
    userId: "client-1",
    targetId: "3",
    targetType: "service",
    rating: 4,
    comment: "The photos turned out beautifully! Thank you!",
    createdAt: "2024-09-08T18:00:00"
  }
];
