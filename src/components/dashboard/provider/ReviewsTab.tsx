
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageSquare, Flag, ThumbsUp, Calendar } from 'lucide-react';

// Mock data for reviews
const mockReviews = [
  {
    id: 'rev1',
    client: {
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    service: 'Home Cleaning',
    date: '2023-05-10',
    rating: 5,
    text: 'Excellent service! My house has never looked so clean. Professional, punctual, and detail-oriented. Will definitely book again.',
    response: null,
    reported: false
  },
  {
    id: 'rev2',
    client: {
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    service: 'Carpet Cleaning',
    date: '2023-05-05',
    rating: 4,
    text: 'Good service overall. Did a great job with my carpets. Only giving 4 stars because they were slightly late.',
    response: 'Thank you for your feedback! We apologize for being late and will ensure better punctuality in the future.',
    reported: false
  },
  {
    id: 'rev3',
    client: {
      name: 'Emma Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
    },
    service: 'Window Cleaning',
    date: '2023-04-28',
    rating: 3,
    text: 'The service was okay. Windows are clean but there are some streaks left. Could improve on attention to detail.',
    response: null,
    reported: false
  },
  {
    id: 'rev4',
    client: {
      name: 'James Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/33.jpg'
    },
    service: 'Deep Cleaning',
    date: '2023-04-20',
    rating: 5,
    text: 'Absolutely fantastic! They went above and beyond with my deep cleaning request. Every corner of the house is spotless.',
    response: 'Thank you so much for your kind words! We\'re thrilled you\'re satisfied with our service.',
    reported: false
  },
  {
    id: 'rev5',
    client: {
      name: 'Olivia Parker',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    service: 'Move-out Cleaning',
    date: '2023-04-15',
    rating: 5,
    text: 'Helped me get my full deposit back! The apartment was immaculate after they finished.',
    response: null,
    reported: false
  }
];

export default function ReviewsTab() {
  const [reviews, setReviews] = useState(mockReviews);
  const [replyText, setReplyText] = useState('');
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  // Rating distribution
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };

  const handleReplySubmit = (reviewId: string) => {
    setReviews(
      reviews.map(review => 
        review.id === reviewId 
          ? { ...review, response: replyText } 
          : review
      )
    );
    setReplyText('');
    setActiveReviewId(null);
  };

  const handleReportReview = (reviewId: string) => {
    setReviews(
      reviews.map(review => 
        review.id === reviewId 
          ? { ...review, reported: true } 
          : review
      )
    );
  };

  // Render stars for rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  // Filtered reviews
  const unansweredReviews = reviews.filter(review => !review.response);
  const answeredReviews = reviews.filter(review => review.response);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
          <p className="text-muted-foreground">
            Manage and respond to client feedback
          </p>
        </div>
      </div>

      {/* Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">{averageRating.toFixed(1)}</div>
              <div className="flex">{renderStars(Math.round(averageRating))}</div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              From {reviews.length} reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {[5, 4, 3, 2, 1].map(stars => (
              <div key={stars} className="flex items-center mb-1">
                <div className="w-12 flex">
                  {stars} <Star className="h-3 w-3 ml-1 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-servie h-2 rounded-full" 
                    style={{ 
                      width: `${(ratingDistribution[stars as keyof typeof ratingDistribution] / reviews.length) * 100}%` 
                    }}
                  />
                </div>
                <div className="w-8 text-right text-xs text-muted-foreground">
                  {ratingDistribution[stars as keyof typeof ratingDistribution]}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Total Reviews</span>
              <span className="font-bold">{reviews.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Unanswered Reviews</span>
              <span className="font-bold">{unansweredReviews.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Response Rate</span>
              <span className="font-bold">{Math.round((answeredReviews.length / reviews.length) * 100)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Tabs */}
      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Reviews ({reviews.length})</TabsTrigger>
            <TabsTrigger value="unanswered">Unanswered ({unansweredReviews.length})</TabsTrigger>
            <TabsTrigger value="positive">5 Star ({ratingDistribution[5]})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
          {reviews.map(review => (
            <ReviewCard 
              key={review.id}
              review={review}
              onReply={() => setActiveReviewId(review.id)}
              onReportReview={() => handleReportReview(review.id)}
              isReplying={activeReviewId === review.id}
              replyText={replyText}
              setReplyText={setReplyText}
              onSubmitReply={() => handleReplySubmit(review.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="unanswered" className="space-y-4">
          {unansweredReviews.length > 0 ? (
            unansweredReviews.map(review => (
              <ReviewCard 
                key={review.id}
                review={review}
                onReply={() => setActiveReviewId(review.id)}
                onReportReview={() => handleReportReview(review.id)}
                isReplying={activeReviewId === review.id}
                replyText={replyText}
                setReplyText={setReplyText}
                onSubmitReply={() => handleReplySubmit(review.id)}
              />
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground">No unanswered reviews</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="positive" className="space-y-4">
          {ratingDistribution[5] > 0 ? (
            reviews.filter(r => r.rating === 5).map(review => (
              <ReviewCard 
                key={review.id}
                review={review}
                onReply={() => setActiveReviewId(review.id)}
                onReportReview={() => handleReportReview(review.id)}
                isReplying={activeReviewId === review.id}
                replyText={replyText}
                setReplyText={setReplyText}
                onSubmitReply={() => handleReplySubmit(review.id)}
              />
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground">No 5-star reviews yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface Review {
  id: string;
  client: {
    name: string;
    avatar: string;
  };
  service: string;
  date: string;
  rating: number;
  text: string;
  response: string | null;
  reported: boolean;
}

interface ReviewCardProps {
  review: Review;
  onReply: () => void;
  onReportReview: () => void;
  isReplying: boolean;
  replyText: string;
  setReplyText: (text: string) => void;
  onSubmitReply: () => void;
}

function ReviewCard({
  review,
  onReply,
  onReportReview,
  isReplying,
  replyText,
  setReplyText,
  onSubmitReply
}: ReviewCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={review.client.avatar} alt={review.client.name} />
            <AvatarFallback>{review.client.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{review.client.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          {new Date(review.date).toLocaleDateString()}
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium mb-1">Service: {review.service}</p>
        <p className="text-sm">{review.text}</p>
      </div>

      {review.response && (
        <div className="mt-4 bg-muted/40 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium">Your Response</div>
          </div>
          <p className="text-sm">{review.response}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {!review.response && !isReplying && (
          <Button variant="outline" size="sm" onClick={onReply} className="flex items-center">
            <MessageSquare className="mr-1 h-4 w-4" />
            Reply
          </Button>
        )}
        
        {!review.reported && (
          <Button variant="outline" size="sm" onClick={onReportReview}>
            <Flag className="mr-1 h-4 w-4" />
            Report
          </Button>
        )}

        <Button variant="outline" size="sm">
          <ThumbsUp className="mr-1 h-4 w-4" />
          Thank
        </Button>
      </div>

      {isReplying && (
        <div className="mt-4">
          <textarea
            className="w-full p-3 border rounded-lg min-h-[100px]"
            placeholder="Type your response here..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setReplyText('')}>Cancel</Button>
            <Button onClick={onSubmitReply} disabled={!replyText.trim()}>Submit Reply</Button>
          </div>
        </div>
      )}
    </div>
  );
}
