
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface ReviewFormProps {
  productId: string;
  onSubmitSuccess?: () => void;
}

const ReviewForm = ({ productId, onSubmitSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please sign in to leave a review");
      return;
    }
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    if (!comment.trim()) {
      toast.error("Please provide a review comment");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to save the review
      // API call simulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Your review has been submitted");
      setRating(0);
      setComment('');
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="rating" className="block text-sm font-medium mb-2">
            Your Rating *
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoverRating || rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {rating > 0 && (
                rating === 1 ? "Poor" :
                rating === 2 ? "Fair" :
                rating === 3 ? "Average" :
                rating === 4 ? "Good" :
                "Excellent"
              )}
            </span>
          </div>
        </div>
        
        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-2">
            Your Review *
          </label>
          <Textarea
            id="comment"
            placeholder="Share your experience with this product..."
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none"
          />
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting || rating === 0 || !comment.trim()}
          className="bg-servie hover:bg-servie-600"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;
