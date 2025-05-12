
// Database Types for Application

// User-related types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'client' | 'provider' | 'seller' | 'admin';
  createdAt: string;
  lastLoginAt?: string;
}

// Provider-related types
export interface Provider {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  categories: string[]; // Array of category IDs
  rating: number;
  reviewCount: number;
  verified: boolean;
  featured: boolean;
}

// Service-related types
export interface Service {
  id: string;
  providerId: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string; // category ID
  images: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  availableOnline: boolean;
}

// Booking-related types
export interface Booking {
  id: string;
  clientId: string;
  providerId: string;
  serviceId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  dateTime: string; // ISO string
  duration: number; // in minutes
  price: number;
  address: string;
  notes?: string;
  createdAt: string;
}

// Product-related types
export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  inventory: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  inStock: boolean;
  createdAt: string;
}

// Order-related types
export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

// Review-related types
export interface Review {
  id: string;
  userId: string;
  targetId: string; // Either serviceId, providerId, or productId
  targetType: 'service' | 'provider' | 'product';
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

// Message-related types
export interface Message {
  id: string;
  conversationId: string;
  sender: string; // userId
  recipient: string; // userId
  content: string;
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: string[]; // userIds
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

// Category-related types
export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  parentId?: string; // For subcategories
  featured: boolean;
}

// Notification-related types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'message' | 'review' | 'payment' | 'system';
  read: boolean;
  relatedId?: string; // ID of related entity (booking, conversation, etc.)
  createdAt: string;
}
