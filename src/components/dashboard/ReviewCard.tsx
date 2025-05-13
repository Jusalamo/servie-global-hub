
import React from 'react';
import { Star, Flag, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

interface Review {
  id: string;
  clientName: string;
  clientAvatar?: string;
  serviceId: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
  response?: string;
  reported?: boolean;
}

interface ReviewCardProps {
  review: Review;
  onReply?: (id: string) => void;
  onReport?: (id: string) => void;
  onThank?: (id: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

export function ReviewCard({ 
  review, 
  onReply,
  onReport,
  onThank,
  showActions = true,
  compact = false
}: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const formattedDate = new Date(review.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className={`p-4 ${compact ? 'border-0 shadow-none' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={review.clientAvatar} alt={review.clientName} />
            <AvatarFallback>{review.clientName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{review.clientName}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
              <div className="flex">{renderStars(review.rating)}</div>
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium mb-1">Service: {review.serviceName}</p>
        <p className="text-sm">{review.comment}</p>
      </div>

      {review.response && (
        <div className="mt-4 bg-muted/40 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium">Provider Response</div>
          </div>
          <p className="text-sm">{review.response}</p>
        </div>
      )}

      {showActions && (
        <div className="mt-4 flex flex-wrap gap-2">
          {onReply && !review.response && (
            <Button variant="outline" size="sm" onClick={() => onReply(review.id)} className="h-8">
              <MessageSquare className="mr-1 h-4 w-4" />
              Reply
            </Button>
          )}
          
          {onReport && !review.reported && (
            <Button variant="outline" size="sm" onClick={() => onReport(review.id)} className="h-8">
              <Flag className="mr-1 h-4 w-4" />
              Report
            </Button>
          )}

          {onThank && (
            <Button variant="outline" size="sm" onClick={() => onThank(review.id)} className="h-8">
              <ThumbsUp className="mr-1 h-4 w-4" />
              Thank
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

export default ReviewCard;
