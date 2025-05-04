
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  productId: string;
  sellerResponse?: string;
  isVerified?: boolean;
}

interface ReviewListProps {
  productId: string;
  initialLoad?: number;
}

const ReviewList = ({ productId, initialLoad = 3 }: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedAll, setLoadedAll] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async (loadMore = false) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock reviews data
      const mockReviews: Review[] = [
        {
          id: "rev1",
          userId: "user1",
          userName: "Alex Johnson",
          userAvatar: "/placeholder.svg",
          rating: 5,
          comment: "Absolutely love this product! The quality is outstanding, and it works exactly as described. I've already recommended it to several friends.",
          createdAt: "2025-04-15T08:30:00.000Z",
          productId,
          isVerified: true
        },
        {
          id: "rev2",
          userId: "user2",
          userName: "Maria García",
          userAvatar: "/placeholder.svg",
          rating: 4,
          comment: "Great product, very satisfied with my purchase. The only reason for 4 stars instead of 5 is that delivery took a bit longer than expected.",
          createdAt: "2025-04-02T14:45:00.000Z",
          productId,
          isVerified: true
        },
        {
          id: "rev3",
          userId: "user3",
          userName: "David Lee",
          userAvatar: "/placeholder.svg",
          rating: 5,
          comment: "Best purchase I've made this year! The product exceeded my expectations in every way possible.",
          createdAt: "2025-03-24T11:20:00.000Z",
          productId,
          isVerified: true
        },
        {
          id: "rev4",
          userId: "user4",
          userName: "Sarah Miller",
          userAvatar: "/placeholder.svg",
          rating: 4,
          comment: "Very good quality and exactly as described. Fast delivery and excellent customer service.",
          createdAt: "2025-03-18T09:15:00.000Z",
          productId,
          isVerified: false
        },
        {
          id: "rev5",
          userId: "user5",
          userName: "James Wilson",
          userAvatar: "/placeholder.svg",
          rating: 3,
          comment: "Decent product for the price. It works well but I think there are better options available if you're willing to spend a bit more.",
          createdAt: "2025-03-10T16:30:00.000Z",
          productId,
          sellerResponse: "Thank you for your feedback. We're always working to improve our products. Please reach out to our customer service team if you have any specific suggestions."
        }
      ];
      
      setReviews(prev => loadMore ? [...prev, ...mockReviews.slice(prev.length)] : mockReviews.slice(0, initialLoad));
      setLoadedAll(mockReviews.length <= (loadMore ? prev.length + mockReviews.length : initialLoad));
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    fetchReviews(true);
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-none">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={review.userAvatar} alt={review.userName} />
                    <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium">{review.userName}</p>
                      {review.isVerified && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-1.5 py-0.5 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-muted stroke-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <p>{review.comment}</p>
                
                {/* Seller response */}
                {review.sellerResponse && (
                  <div className="mt-3 bg-muted/30 p-3 rounded-md">
                    <p className="text-sm font-medium mb-1">Seller Response:</p>
                    <p className="text-sm">{review.sellerResponse}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {!loadedAll && (
            <div className="text-center mt-4">
              <Button 
                variant="outline" 
                onClick={loadMore} 
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More Reviews"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
