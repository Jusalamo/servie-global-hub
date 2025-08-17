
// Mock data for services with packages structure
export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  delivery: string;
  description: string;
  features: string[];
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
  imageUrl: string; // Main image for compatibility
  rating: number;
  reviewCount: number;
  featured: boolean;
  responseTime: string;
  packages: ServicePackage[];
}

export const services: Service[] = [
  {
    id: "1",
    providerId: "provider-1",
    title: "Professional Home Cleaning",
    description: "Complete home cleaning service with eco-friendly products",
    price: 75,
    category: "Home Services",
    categoryId: "1",
    location: "Lagos, Nigeria",
    images: [
      "https://images.unsplash.com/photo-1558618047-b00de36e47d7?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1558618047-b00de36e47d7?w=600&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 127,
    featured: true,
    responseTime: "Within 2 hours",
    packages: [
      {
        id: "pkg-1-basic",
        name: "Basic Clean",
        price: 75,
        delivery: "3-4 hours",
        description: "Standard cleaning for small homes",
        features: ["Dusting", "Vacuuming", "Kitchen cleaning", "Bathroom cleaning"]
      },
      {
        id: "pkg-1-standard",
        name: "Standard Clean",
        price: 120,
        delivery: "4-5 hours",
        description: "Comprehensive cleaning for medium homes",
        features: ["Everything in Basic", "Window cleaning", "Appliance cleaning", "Detailed dusting"]
      },
      {
        id: "pkg-1-premium",
        name: "Premium Clean",
        price: 180,
        delivery: "5-6 hours",
        description: "Deep cleaning for large homes",
        features: ["Everything in Standard", "Deep carpet cleaning", "Cabinet interiors", "Baseboards"]
      }
    ]
  },
  {
    id: "2",
    providerId: "provider-2",
    title: "Expert Plumbing Services",
    description: "Reliable plumbing repairs and installations",
    price: 60,
    category: "Home Services",
    categoryId: "1",
    location: "Cape Town, South Africa",
    images: [
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1592496431128-4b30e8c53f01?w=600&h=400&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 95,
    featured: false,
    responseTime: "Within 1 hour",
    packages: [
      {
        id: "pkg-2-basic",
        name: "Basic Plumbing",
        price: 60,
        delivery: "1-2 hours",
        description: "Simple repairs and leak fixes",
        features: ["Leak detection", "Faucet repair", "Toilet repair"]
      },
      {
        id: "pkg-2-standard",
        name: "Standard Plumbing",
        price: 110,
        delivery: "2-3 hours",
        description: "Comprehensive plumbing solutions",
        features: ["Everything in Basic", "Pipe replacement", "Drain cleaning"]
      },
      {
        id: "pkg-2-premium",
        name: "Premium Plumbing",
        price: 160,
        delivery: "3-4 hours",
        description: "Extensive plumbing services",
        features: ["Everything in Standard", "Water heater repair", "Sewer line inspection"]
      }
    ]
  },
  {
    id: "3",
    providerId: "provider-3",
    title: "Stunning Wedding Photography",
    description: "Capture your special day with beautiful, timeless photos",
    price: 500,
    category: "Photography",
    categoryId: "3",
    location: "Windhoek, Namibia",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1495147466023-ac5ca7140344?w=600&h=400&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 212,
    featured: true,
    responseTime: "Within 30 minutes",
    packages: [
      {
        id: "pkg-3-basic",
        name: "Basic Wedding",
        price: 500,
        delivery: "4 hours",
        description: "Ceremony and posed photos",
        features: ["Ceremony coverage", "Posed portraits", "Basic editing"]
      },
      {
        id: "pkg-3-standard",
        name: "Standard Wedding",
        price: 800,
        delivery: "6 hours",
        description: "Ceremony, reception, and candid photos",
        features: ["Everything in Basic", "Reception coverage", "Candid shots", "Advanced editing"]
      },
      {
        id: "pkg-3-premium",
        name: "Premium Wedding",
        price: 1200,
        delivery: "8 hours",
        description: "Full-day coverage with extra services",
        features: ["Everything in Standard", "Full-day coverage", "Engagement shoot", "Photo album"]
      }
    ]
  },
  {
    id: "4",
    providerId: "provider-4",
    title: "Mobile App Development",
    description: "Custom mobile app development for iOS and Android",
    price: 2000,
    category: "Technology",
    categoryId: "4",
    location: "Abuja, Nigeria",
    images: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1567426182914-ca995999ca09?w=600&h=400&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 155,
    featured: false,
    responseTime: "Within 6 hours",
    packages: [
      {
        id: "pkg-4-basic",
        name: "Basic App",
        price: 2000,
        delivery: "4 weeks",
        description: "Simple app with basic features",
        features: ["UI design", "Basic functionality", "Testing"]
      },
      {
        id: "pkg-4-standard",
        name: "Standard App",
        price: 3500,
        delivery: "6 weeks",
        description: "App with advanced features",
        features: ["Everything in Basic", "User authentication", "Database integration"]
      },
      {
        id: "pkg-4-premium",
        name: "Premium App",
        price: 5000,
        delivery: "8 weeks",
        description: "Full-featured app with custom design",
        features: ["Everything in Standard", "Custom UI/UX", "API integration", "Ongoing support"]
      }
    ]
  },
  {
    id: "5",
    providerId: "provider-5",
    title: "Personal Training Sessions",
    description: "One-on-one fitness training to achieve your goals",
    price: 40,
    category: "Fitness & Health",
    categoryId: "5",
    location: "Johannesburg, South Africa",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583454110551-4585c69b3c2d?w=600&h=400&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 88,
    featured: true,
    responseTime: "Within 12 hours",
    packages: [
      {
        id: "pkg-5-basic",
        name: "Single Session",
        price: 40,
        delivery: "1 hour",
        description: "One personal training session",
        features: ["Workout plan", "Exercise guidance", "Nutrition tips"]
      },
      {
        id: "pkg-5-standard",
        name: "5 Sessions",
        price: 180,
        delivery: "5 hours",
        description: "Five personal training sessions",
        features: ["Everything in Basic", "Progress tracking", "Customized plan"]
      },
      {
        id: "pkg-5-premium",
        name: "10 Sessions",
        price: 350,
        delivery: "10 hours",
        description: "Ten personal training sessions",
        features: ["Everything in Standard", "Detailed assessment", "Ongoing support", "Diet plan"]
      }
    ]
  },
  // Additional services
  {
    id: "6",
    providerId: "provider-6",
    title: "African Hair Braiding & Styling",
    description: "Traditional and contemporary African hair styles",
    price: 80,
    category: "Beauty & Wellness",
    categoryId: "2",
    location: "Accra, Ghana",
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&h=400&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 156,
    featured: true,
    responseTime: "Within 4 hours",
    packages: [
      {
        id: "pkg-6-basic",
        name: "Basic Styling",
        price: 80,
        delivery: "2-3 hours",
        description: "Simple braids and natural styling",
        features: ["Basic braids", "Hair wash", "Conditioning"]
      },
      {
        id: "pkg-6-standard",
        name: "Premium Styling",
        price: 150,
        delivery: "4-5 hours",
        description: "Complex braids and styling",
        features: ["Everything in Basic", "Complex patterns", "Hair treatment", "Styling consultation"]
      }
    ]
  },
  {
    id: "7",
    providerId: "provider-7",
    title: "Traditional African Catering",
    description: "Authentic African cuisine for your events",
    price: 25,
    category: "African Traditional Services",
    categoryId: "7",
    location: "Nairobi, Kenya",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 203,
    featured: true,
    responseTime: "Within 24 hours",
    packages: [
      {
        id: "pkg-7-basic",
        name: "Basic Catering",
        price: 25,
        delivery: "Per person",
        description: "Traditional meal service",
        features: ["Main dish", "Side dish", "Traditional drink"]
      },
      {
        id: "pkg-7-premium",
        name: "Full Feast",
        price: 45,
        delivery: "Per person",
        description: "Complete traditional feast",
        features: ["Multiple main dishes", "Various sides", "Desserts", "Traditional beverages", "Table service"]
      }
    ]
  },
  {
    id: "8",
    providerId: "provider-8",
    title: "Electrical Installation & Repair",
    description: "Safe and reliable electrical services",
    price: 70,
    category: "Home Services",
    categoryId: "1",
    location: "Durban, South Africa",
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 134,
    featured: false,
    responseTime: "Within 2 hours",
    packages: [
      {
        id: "pkg-8-basic",
        name: "Basic Electrical",
        price: 70,
        delivery: "1-2 hours",
        description: "Simple electrical repairs",
        features: ["Switch installation", "Outlet repair", "Basic wiring"]
      },
      {
        id: "pkg-8-premium",
        name: "Full Installation",
        price: 200,
        delivery: "4-6 hours",
        description: "Complete electrical installation",
        features: ["Circuit installation", "Panel upgrades", "Safety inspection", "Warranty included"]
      }
    ]
  }
];

// Mock products data with African themes
export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  categoryId: string;
  images: string[];
  imageUrl: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  inStock: boolean;
  stockCount: number;
}

export const products: Product[] = [
  {
    id: "prod-1",
    sellerId: "seller-1",
    name: "Premium Afro Hair Extensions",
    description: "100% natural African hair extensions, various textures and lengths available",
    price: 89.99,
    category: "Beauty & Personal Care",
    categoryId: "1",
    images: [
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 89,
    featured: true,
    inStock: true,
    stockCount: 25
  },
  {
    id: "prod-2",
    sellerId: "seller-2",
    name: "Wireless Bluetooth Headphones",
    description: "High-quality sound, noise-canceling, comfortable fit",
    price: 129.99,
    category: "Electronics",
    categoryId: "2",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 112,
    featured: true,
    inStock: true,
    stockCount: 40
  },
  {
    id: "prod-3",
    sellerId: "seller-3",
    name: "Traditional African Print Dress",
    description: "Elegant Ankara dress for all occasions, various sizes and vibrant patterns",
    price: 59.99,
    category: "Fashion & Clothing",
    categoryId: "3",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=300&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop",
    rating: 4.5,
    reviewCount: 76,
    featured: false,
    inStock: true,
    stockCount: 30
  },
  {
    id: "prod-4",
    sellerId: "seller-4",
    name: "African Art Home Decor Set",
    description: "Set of handcrafted African art pieces to enhance your home",
    price: 79.99,
    category: "Home & Garden",
    categoryId: "4",
    images: [
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
    rating: 4.4,
    reviewCount: 63,
    featured: false,
    inStock: true,
    stockCount: 20
  },
  {
    id: "prod-5",
    sellerId: "seller-5",
    name: "Professional Yoga Mat",
    description: "High-quality yoga mat for all fitness levels",
    price: 39.99,
    category: "Sports & Fitness",
    categoryId: "5",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    rating: 4.3,
    reviewCount: 51,
    featured: false,
    inStock: true,
    stockCount: 15
  },
  {
    id: "prod-6",
    sellerId: "seller-6",
    name: "African Literature Collection",
    description: "Set of classic African novels and contemporary works",
    price: 49.99,
    category: "Books & Education",
    categoryId: "6",
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    rating: 4.2,
    reviewCount: 42,
    featured: false,
    inStock: true,
    stockCount: 10
  },
  // Additional products for better marketplace feel
  {
    id: "prod-7",
    sellerId: "seller-7",
    name: "Shea Butter Skincare Set",
    description: "Organic African shea butter skincare products for natural beauty",
    price: 34.99,
    category: "Beauty & Personal Care",
    categoryId: "1",
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 156,
    featured: true,
    inStock: true,
    stockCount: 50
  },
  {
    id: "prod-8",
    sellerId: "seller-8",
    name: "Smartphone Samsung Galaxy",
    description: "Latest Samsung smartphone with advanced camera and long battery life",
    price: 699.99,
    category: "Electronics",
    categoryId: "2",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    rating: 4.5,
    reviewCount: 89,
    featured: true,
    inStock: true,
    stockCount: 15
  },
  {
    id: "prod-9",
    sellerId: "seller-9",
    name: "Ankara Men's Shirt",
    description: "Stylish African print shirt for men, perfect for any occasion",
    price: 45.99,
    category: "Fashion & Clothing",
    categoryId: "3",
    images: [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 67,
    featured: false,
    inStock: true,
    stockCount: 22
  },
  {
    id: "prod-10",
    sellerId: "seller-10",
    name: "Wooden African Sculpture",
    description: "Handcrafted wooden sculpture representing African heritage",
    price: 89.99,
    category: "Home & Garden",
    categoryId: "4",
    images: [
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 34,
    featured: true,
    inStock: true,
    stockCount: 8
  },
  {
    id: "prod-11",
    sellerId: "seller-11",
    name: "Resistance Band Set",
    description: "Complete resistance band workout set for home fitness",
    price: 24.99,
    category: "Sports & Fitness",
    categoryId: "5",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1506629905607-683389167ddb?w=400&h=300&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    rating: 4.4,
    reviewCount: 95,
    featured: false,
    inStock: true,
    stockCount: 35
  },
  {
    id: "prod-12",
    sellerId: "seller-12",
    name: "African History Textbook",
    description: "Comprehensive guide to African history and culture",
    price: 29.99,
    category: "Books & Education",
    categoryId: "6",
    images: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 78,
    featured: false,
    inStock: true,
    stockCount: 18
  },
  // More products to make it feel like a real marketplace
  {
    id: "prod-13",
    sellerId: "seller-13",
    name: "MacBook Pro M3",
    description: "Apple MacBook Pro with M3 chip, perfect for professionals",
    price: 1999.99,
    category: "Electronics",
    categoryId: "2",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 245,
    featured: true,
    inStock: true,
    stockCount: 5
  },
  {
    id: "prod-14",
    sellerId: "seller-14",
    name: "Kente Cloth Bag",
    description: "Authentic Ghanaian Kente cloth handbag",
    price: 65.99,
    category: "Fashion & Clothing",
    categoryId: "3",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 123,
    featured: true,
    inStock: true,
    stockCount: 12
  },
  {
    id: "prod-15",
    sellerId: "seller-15",
    name: "Dumbbells Set (20kg)",
    description: "Adjustable dumbbells for strength training",
    price: 149.99,
    category: "Sports & Fitness",
    categoryId: "5",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1583454110551-4585c69b3c2d?w=400&h=300&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    rating: 4.7,
    reviewCount: 167,
    featured: false,
    inStock: true,
    stockCount: 20
  }
];

// Mock users data with African names and images
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "client" | "provider" | "seller" | "admin";
  avatar?: string;
  phone?: string;
  location?: string;
  joinDate: string;
  favorites?: string[]; // service IDs for clients
}

export const users: User[] = [
  {
    id: "user-1",
    firstName: "Amara",
    lastName: "Johnson",
    email: "amara.johnson@example.com",
    role: "client",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
    phone: "+234 (555) 123-4567",
    location: "Lagos, Nigeria",
    joinDate: "2024-01-15",
    favorites: ["1", "3", "5"]
  },
  {
    id: "provider-1",
    firstName: "Kwame",
    lastName: "Asante",
    email: "kwame.asante@example.com",
    role: "provider",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    phone: "+234 (555) 234-5678",
    location: "Lagos, Nigeria",
    joinDate: "2023-11-20"
  },
  {
    id: "provider-2",
    firstName: "Sipho",
    lastName: "Mthembu",
    email: "sipho.mthembu@example.com",
    role: "provider",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    phone: "+27 (555) 345-6789",
    location: "Cape Town, South Africa",
    joinDate: "2024-02-10"
  },
  {
    id: "provider-3",
    firstName: "Nalani",
    lastName: "Kamati",
    email: "nalani.kamati@example.com",
    role: "provider",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    phone: "+264 (555) 456-7890",
    location: "Windhoek, Namibia",
    joinDate: "2023-08-05"
  },
  {
    id: "provider-4",
    firstName: "Chidi",
    lastName: "Okafor",
    email: "chidi.okafor@example.com",
    role: "provider",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    phone: "+234 (555) 567-8901",
    location: "Abuja, Nigeria",
    joinDate: "2023-12-01"
  },
  {
    id: "provider-5",
    firstName: "Thabo",
    lastName: "Molefe",
    email: "thabo.molefe@example.com",
    role: "provider",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    phone: "+27 (555) 678-9012",
    location: "Johannesburg, South Africa",
    joinDate: "2023-09-15"
  },
  {
    id: "seller-1",
    firstName: "Fatima",
    lastName: "Adebayo",
    email: "fatima.adebayo@example.com",
    role: "seller",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b123?w=150&h=150&fit=crop&crop=face",
    phone: "+234 (555) 789-0123",
    location: "Lagos, Nigeria",
    joinDate: "2024-01-20"
  },
  {
    id: "seller-2",
    firstName: "Mandla",
    lastName: "Ndlovu",
    email: "mandla.ndlovu@example.com",
    role: "seller",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
    phone: "+27 (555) 890-1234",
    location: "Cape Town, South Africa",
    joinDate: "2023-10-10"
  },
  {
    id: "seller-3",
    firstName: "Kesi",
    lastName: "Shipanga",
    email: "kesi.shipanga@example.com",
    role: "seller",
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop&crop=face",
    phone: "+264 (555) 901-2345",
    location: "Windhoek, Namibia",
    joinDate: "2024-03-05"
  },
  {
    id: "user-4",
    firstName: "Adunni",
    lastName: "Oni",
    email: "adunni.oni@example.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&crop=face",
    phone: "+234 (555) 012-3456",
    location: "Abuja, Nigeria",
    joinDate: "2023-08-05"
  }
];

// Mock bookings data
export interface Booking {
  id: string;
  serviceId: string;
  clientId: string;
  providerId: string;
  packageId: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  totalPrice: number;
  notes?: string;
  createdAt: string;
  paymentStatus: "unpaid" | "paid" | "refunded";
}

export const bookings: Booking[] = [
  {
    id: "booking-1",
    serviceId: "1",
    clientId: "user-1",
    providerId: "provider-1",
    packageId: "pkg-1-standard",
    date: "2024-07-15",
    time: "10:00",
    status: "confirmed",
    totalPrice: 120,
    notes: "Please use eco-friendly products",
    createdAt: "2024-07-05T09:00:00Z",
    paymentStatus: "paid"
  },
  {
    id: "booking-2",
    serviceId: "3",
    clientId: "user-1",
    providerId: "provider-3",
    packageId: "pkg-3-premium",
    date: "2024-08-20",
    time: "14:00",
    status: "pending",
    totalPrice: 1200,
    notes: "Wedding photography for outdoor ceremony",
    createdAt: "2024-07-02T14:30:00Z",
    paymentStatus: "unpaid"
  },
  {
    id: "booking-3",
    serviceId: "5",
    clientId: "user-1",
    providerId: "provider-5",
    packageId: "pkg-5-standard",
    date: "2024-07-10",
    time: "08:00",
    status: "completed",
    totalPrice: 180,
    notes: "Focus on cardio and strength training",
    createdAt: "2024-06-25T16:20:00Z",
    paymentStatus: "paid"
  }
];
