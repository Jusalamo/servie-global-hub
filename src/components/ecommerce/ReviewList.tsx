import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from 'lucide-react';
import ReviewForm from './ReviewForm';
import { Button } from '@/components/ui/button';

interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

interface ReviewListProps {
  productId: string;
}

const ReviewList = ({ productId }: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call to fetch reviews
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockReviews: Review[] = [
          {
            id: '1',
            user: {
              name: 'Alex Johnson',
              avatar: '/avatars/alex.jpg',
            },
            rating: 5,
            date: '2023-10-15',
            comment: 'This product exceeded my expectations. The quality is outstanding and it arrived earlier than expected.',
            helpful: 12,
          },
          {
            id: '2',
            user: {
              name: 'Sam Taylor',
            },
            rating: 4,
            date: '2023-09-28',
            comment: 'Great product for the price. Would recommend to others looking for something similar.',
            helpful: 8,
          },
          {
            id: '3',
            user: {
              name: 'Jordan Lee',
              avatar: '/avatars/jordan.jpg',
            },
            rating: 3,
            date: '2023-09-10',
            comment: 'Decent product but had some minor issues with the setup. Customer service was helpful though.',
            helpful: 3,
          },
        ];
        
        setReviews(mockReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReviews();
  }, [productId]);
  
  const handleHelpful = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 } 
        : review
    ));
  };
  
  const handleReviewSubmit = () => {
    setShowForm(false);
    // In a real app, we would refresh the reviews from the server
    // For now, we'll just simulate a new review being added
    const newReview: Review = {
      id: `new-${Date.now()}`,
      user: {
        name: 'You',
      },
      rating: 5,
      date: new Date().toISOString().split('T')[0],
      comment: 'Just added my review!',
      helpful: 0,
    };
    
    setReviews(prev => [...prev, newReview]);
  };
  
  const averageRating = reviews.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  
  const ratingCounts = reviews.reduce((counts, review) => {
    counts[review.rating - 1]++;
    return counts;
  }, [0, 0, 0, 0, 0]);
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Rating summary */}
        <div className="w-full md:w-1/3 space-y-4">
          <h3 className="text-lg font-medium">Customer Reviews</h3>
          
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">
              {averageRating.toFixed(1)} out of 5
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Based on {reviews.length} reviews
          </p>
          
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating, index) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm w-6">{rating} ★</span>
                <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ 
                      width: reviews.length 
                        ? `${(ratingCounts[5 - rating] / reviews.length) * 100}%` 
                        : '0%' 
                    }}
                  />
                </div>
                <span className="text-sm w-6 text-right">
                  {ratingCounts[5 - rating]}
                </span>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={() => setShowForm(!showForm)} 
            variant={showForm ? "outline" : "default"}
            className={showForm ? "" : "bg-servie hover:bg-servie-600"}
          >
            {showForm ? "Cancel" : "Write a Review"}
          </Button>
        </div>
        
        {/* Review form or list */}
        <div className="w-full md:w-2/3">
          {showForm ? (
            <ReviewForm productId={productId} onSubmitSuccess={handleReviewSubmit} />
          ) : (
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-servie" />
                </div>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        <Avatar>
                          <AvatarImage src={review.user.avatar} />
                          <AvatarFallback>
                            {review.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{review.user.name}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm">
                      <p>{review.comment}</p>
                    </div>
                    
                    <div className="mt-3 flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpful(review.id)}
                        className="text-sm h-auto py-1"
                      >
                        Helpful ({review.helpful})
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
