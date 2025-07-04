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
    location: "New York, NY",
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
    location: "Los Angeles, CA",
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
    location: "Miami, FL",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1495147466023-ac5ca7140Main?w=600&h=400&fit=crop"
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
    location: "San Francisco, CA",
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
    location: "Chicago, IL",
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
  }
];

// Mock products data
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
    name: "Premium Hair Extensions",
    description: "100% human hair extensions, various lengths and colors available",
    price: 89.99,
    category: "Beauty & Personal Care",
    categoryId: "1",
    images: [
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=300&fit=crop"
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
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
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
    name: "Stylish Women's Dress",
    description: "Elegant dress for all occasions, various sizes and colors",
    price: 59.99,
    category: "Fashion & Clothing",
    categoryId: "3",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop"
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
    name: "Modern Home Decor Set",
    description: "Set of decorative items to enhance your home",
    price: 79.99,
    category: "Home & Garden",
    categoryId: "4",
    images: [
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop"
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
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"
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
    name: "Classic Novel Collection",
    description: "Set of classic novels for literature enthusiasts",
    price: 49.99,
    category: "Books & Education",
    categoryId: "6",
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    rating: 4.2,
    reviewCount: 42,
    featured: false,
    inStock: true,
    stockCount: 10
  }
];
