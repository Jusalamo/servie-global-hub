
// AI Assistant Service - Handles AI response generation and history management
// Marketplace-focused with dynamic client/seller detection

type AssistantMessage = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

// Marketplace knowledge base
const MARKETPLACE_KNOWLEDGE = {
  commission: "We charge a 5% platform commission on all sales and bookings. This is automatically deducted from the seller's payout.",
  escrow: "All payments are securely held in escrow until the service is marked as completed by the buyer or the disbursement window expires. This protects both buyers and sellers.",
  subscriptionTiers: {
    free: "Free Tier: List up to 5 products/services at no monthly cost.",
    basic: "Basic Tier ($10/month): Unlimited listings and access to basic analytics.",
    premium: "Premium Tier ($30/month): Unlimited listings, advanced analytics, priority support, and promotional tools."
  },
  geoLocation: "Services are automatically sorted by proximity to your location. Providers closer to you appear first in search results.",
  clientFee: "A 3.5% + $0.50 payment processing fee is added to your total at checkout to cover secure transaction processing.",
};

// User type detection
const detectUserType = (message: string, history: AssistantMessage[]): 'client' | 'seller' | 'unknown' => {
  const sellerKeywords = ['sell', 'seller', 'provider', 'list', 'listing', 'subscription', 'payout', 'commission', 'my service', 'my product'];
  const clientKeywords = ['buy', 'purchase', 'book', 'booking', 'order', 'find service'];
  
  const msgLower = message.toLowerCase();
  const hasSellerKeyword = sellerKeywords.some(kw => msgLower.includes(kw));
  const hasClientKeyword = clientKeywords.some(kw => msgLower.includes(kw));
  
  if (hasSellerKeyword && !hasClientKeyword) return 'seller';
  if (hasClientKeyword && !hasSellerKeyword) return 'client';
  return 'unknown';
};

// Enhanced response generation with marketplace context
export const generateAIResponse = async (
  message: string, 
  conversationHistory: AssistantMessage[]
): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 700));
  
  // Extract common user intents
  const lowerMessage = message.toLowerCase();
  const userType = detectUserType(message, conversationHistory);
  
  // Handle greetings
  if (lowerMessage.match(/\b(hello|hi|hey|greetings)\b/)) {
    if (conversationHistory.length > 2) {
      return "Hello again! How else can I help you with your African marketplace experience today?";
    } else {
      return "Hello! I'm your Servie AI assistant for the African Services Marketplace. Are you looking to find a service (as a Client) or offer your services (as a Seller/Provider)? This helps me provide better assistance!";
    }
  }
  
  // Handle commission queries
  if (lowerMessage.includes('commission') || lowerMessage.includes('fee') && (lowerMessage.includes('seller') || lowerMessage.includes('provider'))) {
    return `${MARKETPLACE_KNOWLEDGE.commission} As a seller, you keep 95% of each sale. ${userType === 'seller' ? 'This helps us maintain the platform and support services for you.' : ''}`;
  }
  
  // Handle escrow queries
  if (lowerMessage.includes('escrow') || lowerMessage.includes('payment protection') || lowerMessage.includes('secure payment')) {
    return `${MARKETPLACE_KNOWLEDGE.escrow} Funds are released to sellers only after successful service delivery, ensuring fair transactions for everyone.`;
  }
  
  // Handle subscription queries
  if (lowerMessage.includes('subscription') || lowerMessage.includes('tier') || lowerMessage.includes('pricing plan')) {
    return `Our subscription tiers:\n\n• ${MARKETPLACE_KNOWLEDGE.subscriptionTiers.free}\n• ${MARKETPLACE_KNOWLEDGE.subscriptionTiers.basic}\n• ${MARKETPLACE_KNOWLEDGE.subscriptionTiers.premium}\n\n${userType === 'seller' ? 'Upgrade your plan to list more products and access advanced features!' : 'Sellers with premium subscriptions often provide enhanced services.'}`;
  }
  
  // Handle geo-location queries
  if (lowerMessage.includes('location') || lowerMessage.includes('nearby') || lowerMessage.includes('close') || lowerMessage.includes('distance')) {
    return `${MARKETPLACE_KNOWLEDGE.geoLocation} We prioritize local providers to reduce travel time and costs. Make sure your browser's location permissions are enabled for the best experience!`;
  }
  
  // Handle booking-related queries
  if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
    return `To book a service: Browse categories → Select a provider near you → Choose an available time slot → Confirm booking. ${MARKETPLACE_KNOWLEDGE.geoLocation} ${userType === 'client' ? 'Services closest to you appear first!' : ''}`;
  }
  
  // Handle payment-related queries
  if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card') || lowerMessage.includes('billing')) {
    if (userType === 'client') {
      return `We support local African payment gateways (Paystack, Flutterwave) and major cards. ${MARKETPLACE_KNOWLEDGE.clientFee} ${MARKETPLACE_KNOWLEDGE.escrow}`;
    } else if (userType === 'seller') {
      return `${MARKETPLACE_KNOWLEDGE.escrow} ${MARKETPLACE_KNOWLEDGE.commission} Payouts are processed after service completion confirmation.`;
    }
    return `Payments are processed through secure local African payment gateways. ${MARKETPLACE_KNOWLEDGE.escrow}`;
  }
  
  // Handle cancellation queries
  if (lowerMessage.includes('cancel') || lowerMessage.includes('reschedule')) {
    return "You can cancel or reschedule a booking from your dashboard under 'My Bookings' section. For cancellations, our policy allows free cancellation up to 24 hours before your appointment. After that, a cancellation fee may apply depending on the service provider's policy.";
  }
  
  // Handle account-related queries
  if (lowerMessage.includes('account') || lowerMessage.includes('profile') || lowerMessage.includes('sign') || lowerMessage.includes('log')) {
    return "You can manage your account settings, including profile information, notification preferences, and saved payment methods from your dashboard. Just click on your profile picture in the top right corner and select 'Account Settings'. Is there something specific about your account you need help with?";
  }
  
  // Handle product-related queries
  if (lowerMessage.includes('product') || lowerMessage.includes('shop') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
    return "Our marketplace offers a variety of products related to home services. You can browse products by category, read reviews, and purchase directly through our secure checkout. All products come with warranty information and return policies listed on their product pages.";
  }
  
  // Handle provider/seller onboarding queries
  if (lowerMessage.includes('become seller') || lowerMessage.includes('become provider') || lowerMessage.includes('start selling')) {
    return `To become a seller:\n1. Sign up and select 'Seller/Provider' role\n2. Complete your profile with business details\n3. Start with our Free Tier (up to 5 listings)\n4. Upgrade to Basic or Premium for unlimited listings\n\n${MARKETPLACE_KNOWLEDGE.commission} Your location is automatically added to help local clients find you!`;
  }
  
  // Handle provider-related queries
  if (lowerMessage.includes('provider') || lowerMessage.includes('professional') || lowerMessage.includes('service provider')) {
    return `Our service providers are vetted professionals across Africa. Each provider must maintain high ratings and service quality. ${MARKETPLACE_KNOWLEDGE.geoLocation} You can read reviews, check ratings, and compare providers before booking.`;
  }
  
  // Handle client-specific queries
  if (userType === 'client' && (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('looking for'))) {
    return `To find services: Use the search bar or browse categories → Services near you appear first → View provider profiles, ratings, and pricing → Book instantly! ${MARKETPLACE_KNOWLEDGE.clientFee}`;
  }
  
  // Default response with context awareness
  if (userType === 'seller') {
    return `I can help you with: Subscription tiers, listing products/services, understanding commission & payouts, managing bookings, and optimizing your profile. What would you like to know more about?`;
  } else if (userType === 'client') {
    return `I can help you with: Finding local services, booking providers, understanding fees, payment methods, and tracking orders. What can I assist you with?`;
  }
  
  return "I'm your African marketplace assistant! I can help with:\n• Finding/offering services\n• Payments & escrow\n• Subscription plans\n• Location-based search\n• Bookings & orders\n\nAre you a Client looking for services, or a Seller/Provider offering services?";
};

// Save conversation history to local storage
export const saveConversationHistory = (history: AssistantMessage[]): void => {
  try {
    localStorage.setItem('assistant_conversation', JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save conversation history:', error);
  }
};

// Load conversation history from local storage
export const loadConversationHistory = (): AssistantMessage[] => {
  try {
    const saved = localStorage.getItem('assistant_conversation');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load conversation history:', error);
  }
  return [];
};

export const clearConversationHistory = (): void => {
  localStorage.removeItem('assistant_conversation');
};
