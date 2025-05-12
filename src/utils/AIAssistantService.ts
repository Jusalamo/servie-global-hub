
// AI Assistant Service - Handles AI response generation and history management

type AssistantMessage = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

// More robust response generation with context awareness
export const generateAIResponse = async (
  message: string, 
  conversationHistory: AssistantMessage[]
): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 700));
  
  // Extract common user intents
  const lowerMessage = message.toLowerCase();
  
  // Handle greetings
  if (lowerMessage.match(/\b(hello|hi|hey|greetings)\b/)) {
    if (conversationHistory.length > 2) {
      return "Hello again! How else can I help you with your Servie experience today?";
    } else {
      return "Hello! I'm your Servie AI assistant. How can I help you today?";
    }
  }
  
  // Handle booking-related queries
  if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
    return "To book a service, you can browse our service categories, select a provider, and click the 'Book Now' button on their profile. You can also check available time slots and choose one that works for you. Would you like me to guide you through the process?";
  }
  
  // Handle payment-related queries
  if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card') || lowerMessage.includes('billing')) {
    return "We accept multiple payment methods including credit cards, PayPal, and Apple Pay. All payments are securely processed with industry-standard encryption. Your payment information is never stored on our servers. Is there a specific payment question I can help with?";
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
  
  // Handle provider-related queries
  if (lowerMessage.includes('provider') || lowerMessage.includes('professional') || lowerMessage.includes('service provider')) {
    return "Our service providers are thoroughly vetted professionals. Each provider undergoes background checks and must maintain a minimum rating to remain on our platform. You can read reviews, check qualifications, and compare rates before making your selection.";
  }
  
  // Default response with follow-up options
  return "I'm here to help with any questions about services, bookings, payments, or your account. Could you provide more details about what you need assistance with?";
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
