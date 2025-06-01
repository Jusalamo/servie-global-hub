
// Mock data service for dashboard functionality
// This will be replaced with real API calls when backend is connected

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageRating: number;
  pendingOrders: number;
  completedOrders: number;
  monthlyGrowth: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  status: 'active' | 'inactive';
  sales: number;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
  description: string;
  status: 'active' | 'inactive';
  bookings: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

export interface Booking {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
}

// Mock data generators
const generateMockStats = (role: string): DashboardStats => {
  const baseStats = {
    totalRevenue: Math.floor(Math.random() * 50000) + 10000,
    totalOrders: Math.floor(Math.random() * 500) + 50,
    totalCustomers: Math.floor(Math.random() * 200) + 25,
    averageRating: Number((Math.random() * 2 + 3).toFixed(1)),
    pendingOrders: Math.floor(Math.random() * 20) + 5,
    completedOrders: Math.floor(Math.random() * 300) + 100,
    monthlyGrowth: Number((Math.random() * 30 + 5).toFixed(1)),
  };

  if (role === 'client') {
    return {
      ...baseStats,
      totalOrders: Math.floor(Math.random() * 50) + 5,
      totalRevenue: Math.floor(Math.random() * 5000) + 500,
      totalCustomers: 0, // Clients don't have customers
      pendingOrders: Math.floor(Math.random() * 5) + 1,
    };
  }

  return baseStats;
};

const generateMockProducts = (): Product[] => {
  const products = [
    "Wireless Headphones", "Smart Watch", "Laptop Stand", "Coffee Mug",
    "Desk Organizer", "Phone Case", "Bluetooth Speaker", "Tablet Holder",
    "Gaming Mouse", "Keyboard", "Monitor", "Webcam", "Microphone",
    "Power Bank", "Charging Cable", "Screen Protector", "Car Mount"
  ];

  return products.slice(0, 8).map((name, index) => ({
    id: `prod_${index + 1}`,
    name,
    price: Math.floor(Math.random() * 200) + 20,
    stock: Math.floor(Math.random() * 100) + 10,
    category: ['Electronics', 'Accessories', 'Home & Office'][Math.floor(Math.random() * 3)],
    image: `/placeholder.svg`,
    status: Math.random() > 0.2 ? 'active' : 'inactive' as const,
    sales: Math.floor(Math.random() * 500) + 10,
  }));
};

const generateMockServices = (): Service[] => {
  const services = [
    "Haircut & Styling", "Deep House Cleaning", "Personal Training",
    "Massage Therapy", "Pet Grooming", "Tutoring", "Photography Session",
    "Car Detailing", "Home Repair", "Meal Prep", "Yoga Class", "Music Lessons"
  ];

  return services.slice(0, 8).map((name, index) => ({
    id: `serv_${index + 1}`,
    name,
    price: Math.floor(Math.random() * 150) + 25,
    duration: [30, 60, 90, 120][Math.floor(Math.random() * 4)],
    category: ['Beauty', 'Home', 'Health', 'Education'][Math.floor(Math.random() * 4)],
    description: `Professional ${name.toLowerCase()} service with high quality standards.`,
    status: Math.random() > 0.2 ? 'active' : 'inactive' as const,
    bookings: Math.floor(Math.random() * 100) + 5,
  }));
};

const generateMockOrders = (): Order[] => {
  const customers = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "Tom Brown"];
  const items = ["Product A", "Product B", "Service X", "Product C"];

  return Array.from({ length: 10 }, (_, index) => ({
    id: `order_${index + 1}`,
    customerName: customers[Math.floor(Math.random() * customers.length)],
    items: [items[Math.floor(Math.random() * items.length)]],
    total: Math.floor(Math.random() * 300) + 50,
    status: ['pending', 'processing', 'completed', 'cancelled'][Math.floor(Math.random() * 4)] as const,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }));
};

const generateMockBookings = (): Booking[] => {
  const clients = ["Alice Johnson", "Bob Smith", "Carol Davis", "David Wilson", "Eva Brown"];
  const services = ["Haircut", "Massage", "Training", "Cleaning", "Tutoring"];

  return Array.from({ length: 15 }, (_, index) => ({
    id: `booking_${index + 1}`,
    clientName: clients[Math.floor(Math.random() * clients.length)],
    service: services[Math.floor(Math.random() * services.length)],
    date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: ['09:00', '10:30', '14:00', '15:30', '17:00'][Math.floor(Math.random() * 5)],
    status: ['pending', 'confirmed', 'completed', 'cancelled'][Math.floor(Math.random() * 4)] as const,
    price: Math.floor(Math.random() * 200) + 30,
  }));
};

// API functions
export const dashboardAPI = {
  getStats: async (userRole: string): Promise<DashboardStats> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateMockStats(userRole);
  },

  getProducts: async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockProducts();
  },

  getServices: async (): Promise<Service[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockServices();
  },

  getOrders: async (): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockOrders();
  },

  getBookings: async (): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockBookings();
  },

  createProduct: async (product: Omit<Product, 'id' | 'sales'>): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...product,
      id: `prod_${Date.now()}`,
      sales: 0,
    };
  },

  createService: async (service: Omit<Service, 'id' | 'bookings'>): Promise<Service> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...service,
      id: `serv_${Date.now()}`,
      bookings: 0,
    };
  },

  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Order ${orderId} status updated to ${status}`);
  },

  updateBookingStatus: async (bookingId: string, status: Booking['status']): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Booking ${bookingId} status updated to ${status}`);
  },
};
