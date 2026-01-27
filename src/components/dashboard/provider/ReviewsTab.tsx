import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageSquare, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface Review {
  id: string;
  client_id: string;
  client_name: string;
  client_avatar: string | null;
  service_title: string;
  created_at: string;
  rating: number;
  comment: string | null;
  provider_response: string | null;
}

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            id,
            client_id,
            rating,
            comment,
            provider_response,
            created_at,
            services (
              title
            )
          `)
          .eq('provider_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch client names from public_profiles
        const clientIds = [...new Set((data || []).map((r: any) => r.client_id).filter(Boolean))];
        
        let clientProfiles: any[] = [];
        if (clientIds.length > 0) {
          const { data: profiles } = await supabase
            .from('public_profiles')
            .select('id, first_name, last_name, avatar_url')
            .in('id', clientIds);
          clientProfiles = profiles || [];
        }

        const formattedReviews: Review[] = (data || []).map((review: any) => {
          const clientProfile = clientProfiles.find(p => p.id === review.client_id);
          return {
            id: review.id,
            client_id: review.client_id,
            client_name: clientProfile 
              ? `${clientProfile.first_name || ''} ${clientProfile.last_name || ''}`.trim() || 'Anonymous'
              : 'Anonymous',
            client_avatar: clientProfile?.avatar_url || null,
            service_title: review.services?.title || 'Service',
            created_at: review.created_at,
            rating: review.rating,
            comment: review.comment,
            provider_response: review.provider_response
          };
        });

        setReviews(formattedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [user?.id]);

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;
  
  // Rating distribution
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };

  const handleReplySubmit = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ provider_response: replyText })
        .eq('id', reviewId)
        .eq('provider_id', user?.id);

      if (error) throw error;

      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, provider_response: replyText } 
          : review
      ));
      setReplyText('');
      setActiveReviewId(null);
      toast.success('Response submitted successfully');
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('Failed to submit response');
    }
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
  const unansweredReviews = reviews.filter(review => !review.provider_response);
  const answeredReviews = reviews.filter(review => review.provider_response);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="space-y-4">
          {[1, 2].map(i => <Skeleton key={i} className="h-40" />)}
        </div>
      </div>
    );
  }

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

      {reviews.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Star className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
          <p className="text-muted-foreground">
            Complete bookings to receive reviews from your clients.
          </p>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Overall Rating</CardTitle>
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
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {[5, 4, 3, 2, 1].map(stars => (
                  <div key={stars} className="flex items-center mb-1">
                    <div className="w-12 flex text-sm">
                      {stars} <Star className="h-3 w-3 ml-1 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: reviews.length > 0 
                            ? `${(ratingDistribution[stars as keyof typeof ratingDistribution] / reviews.length) * 100}%`
                            : '0%'
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
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Review Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Reviews</span>
                  <span className="font-bold">{reviews.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unanswered</span>
                  <span className="font-bold">{unansweredReviews.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Rate</span>
                  <span className="font-bold">
                    {reviews.length > 0 ? Math.round((answeredReviews.length / reviews.length) * 100) : 0}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews Tabs */}
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({reviews.length})</TabsTrigger>
              <TabsTrigger value="unanswered">Unanswered ({unansweredReviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-4">
              {reviews.map(review => (
                <ReviewCard 
                  key={review.id}
                  review={review}
                  onReply={() => setActiveReviewId(review.id)}
                  isReplying={activeReviewId === review.id}
                  replyText={replyText}
                  setReplyText={setReplyText}
                  onSubmitReply={() => handleReplySubmit(review.id)}
                  onCancelReply={() => { setActiveReviewId(null); setReplyText(''); }}
                />
              ))}
            </TabsContent>

            <TabsContent value="unanswered" className="space-y-4 mt-4">
              {unansweredReviews.length > 0 ? (
                unansweredReviews.map(review => (
                  <ReviewCard 
                    key={review.id}
                    review={review}
                    onReply={() => setActiveReviewId(review.id)}
                    isReplying={activeReviewId === review.id}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    onSubmitReply={() => handleReplySubmit(review.id)}
                    onCancelReply={() => { setActiveReviewId(null); setReplyText(''); }}
                  />
                ))
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">All reviews have been responded to!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
  onReply: () => void;
  isReplying: boolean;
  replyText: string;
  setReplyText: (text: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
}

function ReviewCard({
  review,
  onReply,
  isReplying,
  replyText,
  setReplyText,
  onSubmitReply,
  onCancelReply
}: ReviewCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={review.client_avatar || undefined} />
            <AvatarFallback>{review.client_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{review.client_name}</h3>
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
          {new Date(review.created_at).toLocaleDateString()}
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium mb-1">Service: {review.service_title}</p>
        {review.comment && <p className="text-sm">{review.comment}</p>}
      </div>

      {review.provider_response && (
        <div className="mt-4 bg-muted/40 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-sm font-medium">Your Response</div>
          </div>
          <p className="text-sm">{review.provider_response}</p>
        </div>
      )}

      {!review.provider_response && !isReplying && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onReply}>
            <MessageSquare className="mr-1 h-4 w-4" />
            Reply
          </Button>
        </div>
      )}

      {isReplying && (
        <div className="mt-4">
          <textarea
            className="w-full p-3 border rounded-lg min-h-[100px] text-sm"
            placeholder="Type your response here..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={onCancelReply}>Cancel</Button>
            <Button size="sm" onClick={onSubmitReply} disabled={!replyText.trim()}>Submit Reply</Button>
          </div>
        </div>
      )}
    </div>
  );
}
