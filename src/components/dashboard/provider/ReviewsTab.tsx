
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock review data
const mockReviews = [
  {
    id: 1,
    client: { name: "Sam Taylor", avatar: "/placeholder.svg" },
    service: "Home Cleaning",
    rating: 5,
    date: "2023-04-15",
    comment: "Excellent service! The house was spotless. Would definitely book again.",
    replied: false
  },
  {
    id: 2,
    client: { name: "Jordan Lee", avatar: "/placeholder.svg" },
    service: "Plumbing",
    rating: 4,
    date: "2023-04-10",
    comment: "Good job fixing my sink. Arrived on time and was professional.",
    replied: true
  },
  {
    id: 3,
    client: { name: "Alex Johnson", avatar: "/placeholder.svg" },
    service: "Gardening",
    rating: 3,
    date: "2023-04-05",
    comment: "Service was okay. Garden looks better but some areas were missed.",
    replied: false
  },
  {
    id: 4,
    client: { name: "Morgan Smith", avatar: "/placeholder.svg" },
    service: "Home Cleaning",
    rating: 5,
    date: "2023-04-01",
    comment: "Amazing attention to detail. My home has never been this clean!",
    replied: false
  }
];

export default function ReviewsTab() {
  const [activeTab, setActiveTab] = useState("all");
  const [reviews, setReviews] = useState(mockReviews);
  
  const handleReply = (reviewId: number) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === reviewId ? { ...review, replied: true } : review
      )
    );
  };
  
  const filterReviews = () => {
    if (activeTab === "all") return reviews;
    if (activeTab === "unresponded") return reviews.filter(review => !review.replied);
    if (activeTab === "positive") return reviews.filter(review => review.rating >= 4);
    if (activeTab === "negative") return reviews.filter(review => review.rating < 4);
    return reviews;
  };
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
      />
    ));
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Client Reviews</h2>
        <p className="text-muted-foreground">Manage and respond to client feedback.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-5xl font-bold text-servie">4.5</p>
              <div className="flex justify-center my-2">
                {renderStars(4)}
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              </div>
              <p className="text-sm text-muted-foreground">Overall Rating</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{reviews.length}</p>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{reviews.filter(r => r.rating >= 4).length}</p>
              <p className="text-sm text-muted-foreground">Positive Reviews</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{reviews.filter(r => !r.replied).length}</p>
              <p className="text-sm text-muted-foreground">Awaiting Response</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="unresponded">Unresponded</TabsTrigger>
          <TabsTrigger value="positive">Positive</TabsTrigger>
          <TabsTrigger value="negative">Negative</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4 mt-4">
          {filterReviews().map(review => (
            <Card key={review.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={review.client.avatar} />
                      <AvatarFallback>{review.client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{review.client.name}</CardTitle>
                      <CardDescription className="text-xs">{review.date}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm font-medium">{review.rating}.0</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-0">
                <p className="text-sm text-muted-foreground mb-1">Service: {review.service}</p>
                <p className="text-sm">{review.comment}</p>
                <div className="flex justify-between mt-4">
                  <div>
                    <Button variant="ghost" size="sm" className="text-sm">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful
                    </Button>
                  </div>
                  {!review.replied ? (
                    <Button 
                      size="sm" 
                      className="text-sm bg-servie hover:bg-servie-600"
                      onClick={() => handleReply(review.id)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  ) : (
                    <span className="text-sm text-green-600 flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Responded
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
