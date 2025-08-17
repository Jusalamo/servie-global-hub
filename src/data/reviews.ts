export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export const productReviews: ProductReview[] = [
  {
    id: "review-1",
    productId: "prod-1",
    userName: "Amara Johnson",
    userAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    comment: "Absolutely love these hair extensions! The quality is amazing and they blend perfectly with my natural hair.",
    date: "2024-01-15",
    verified: true
  },
  {
    id: "review-2",
    productId: "prod-1",
    userName: "Kemi Adebayo",
    rating: 4,
    comment: "Good quality extensions, fast shipping. Will definitely order again!",
    date: "2024-01-10",
    verified: true
  },
  {
    id: "review-3",
    productId: "prod-2",
    userName: "John Smith",
    rating: 5,
    comment: "Best headphones I've ever owned. The sound quality is incredible and battery life is exactly as advertised.",
    date: "2024-01-12",
    verified: true
  },
  {
    id: "review-4",
    productId: "prod-2",
    userName: "Sarah Wilson",
    rating: 4,
    comment: "Great headphones for the price. Noise cancellation works well for commuting.",
    date: "2024-01-08",
    verified: true
  },
  {
    id: "review-5",
    productId: "prod-3",
    userName: "Fatima Hassan",
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b123?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    comment: "Beautiful dress! The Ankara print is vibrant and the fit is perfect. Received so many compliments.",
    date: "2024-01-14",
    verified: true
  },
  {
    id: "review-6",
    productId: "prod-7",
    userName: "Grace Okonkwo",
    rating: 5,
    comment: "This shea butter set is amazing! My skin has never felt softer. Highly recommend!",
    date: "2024-01-16",
    verified: true
  },
  {
    id: "review-7",
    productId: "prod-8",
    userName: "Michael Thompson",
    rating: 4,
    comment: "Great phone with excellent camera quality. Battery lasts all day with heavy use.",
    date: "2024-01-11",
    verified: true
  },
  {
    id: "review-8",
    productId: "prod-13",
    userName: "Alex Rodriguez",
    rating: 5,
    comment: "This MacBook Pro is a powerhouse! Perfect for all my development work. M3 chip is incredibly fast.",
    date: "2024-01-13",
    verified: true
  },
  {
    id: "review-9",
    productId: "prod-14",
    userName: "Ama Asante",
    rating: 5,
    comment: "Authentic Kente bag with beautiful craftsmanship. Perfect size for daily use and gets compliments everywhere!",
    date: "2024-01-17",
    verified: true
  },
  {
    id: "review-10",
    productId: "prod-10",
    userName: "David Ochieng",
    rating: 5,
    comment: "Beautiful wooden sculpture with incredible detail. Adds so much character to my living room.",
    date: "2024-01-09",
    verified: true
  }
];

export const getReviewsForProduct = (productId: string): ProductReview[] => {
  return productReviews.filter(review => review.productId === productId);
};

export const getAverageRating = (productId: string): number => {
  const reviews = getReviewsForProduct(productId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};