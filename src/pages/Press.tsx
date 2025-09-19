
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, ArrowUpRight } from "lucide-react";

const newsReleases = [
  {
    id: "news1",
    title: "Servie Raises $5M to Expand Service Marketplace Across Africa",
    date: "May 10, 2024",
    excerpt: "Funding will accelerate expansion into new markets and enhance platform capabilities.",
    source: "Tech Crunch",
    link: "#"
  },
  {
    id: "news2",
    title: "Servie Launches Mobile App to Connect Service Providers and Clients",
    date: "March 15, 2024",
    excerpt: "New mobile application makes it easier for clients to find and book services on the go.",
    source: "Africa Business Review",
    link: "#"
  },
  {
    id: "news3",
    title: "Servie Partners with Local Banks to Offer Financial Services to Providers",
    date: "February 2, 2024",
    excerpt: "Partnership aims to provide access to financial services for thousands of service providers.",
    source: "Financial Times",
    link: "#"
  }
];

const mediaFeatures = [
  {
    id: "media1",
    title: "How Servie is Transforming Service Delivery in Africa",
    publication: "TechAfrica",
    date: "April 2024",
    excerpt: "An in-depth look at how Servie is addressing the challenges of connecting skilled professionals with clients.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    link: "#"
  },
  {
    id: "media2",
    title: "Servie CEO on Building Tech Solutions for Local Challenges",
    publication: "Entrepreneur Africa",
    date: "March 2024",
    excerpt: "Interview with Servie's CEO on the journey of building a platform that addresses unique local needs.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    link: "#"
  }
];

// Brand assets that would be available for download
const brandAssets = [
  { name: "Servie Logo - Full Color", format: "PNG, SVG", fileSize: "2.5 MB" },
  { name: "Servie Logo - Monochrome", format: "PNG, SVG", fileSize: "2.1 MB" },
  { name: "Servie Brand Guidelines", format: "PDF", fileSize: "4.8 MB" },
  { name: "Servie Press Photos", format: "ZIP (JPG)", fileSize: "15.2 MB" }
];

const Press = () => {
  return (
    <>
      <section className="bg-servie text-white py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Press Center</h1>
              <p className="text-lg opacity-90 mb-8">
                Latest news, media resources, and information about Servie
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="border-white hover:bg-white hover:text-servie">
                  Media Inquiries
                </Button>
                <Button className="bg-white text-servie hover:bg-gray-100">
                  Download Press Kit
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="news" className="mb-8">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="news">News Releases</TabsTrigger>
                  <TabsTrigger value="coverage">Media Coverage</TabsTrigger>
                  <TabsTrigger value="assets">Brand Assets</TabsTrigger>
                </TabsList>
                
                <TabsContent value="news" className="mt-6">
                  <h2 className="text-2xl font-semibold mb-6">Latest News Releases</h2>
                  <div className="space-y-6">
                    {newsReleases.map((news) => (
                      <Card key={news.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">{news.date} • {news.source}</p>
                              <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
                              <p className="text-muted-foreground mb-4">{news.excerpt}</p>
                              <Button variant="link" className="p-0 h-auto" asChild>
                                <a href={news.link} className="flex items-center">
                                  Read Full Story <ArrowUpRight className="ml-1 h-3 w-3" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="mt-6">
                    View All News Releases
                  </Button>
                </TabsContent>
                
                <TabsContent value="coverage" className="mt-6">
                  <h2 className="text-2xl font-semibold mb-6">Media Coverage</h2>
                  <div className="space-y-6">
                    {mediaFeatures.map((feature) => (
                      <Card key={feature.id}>
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/3 h-48 md:h-auto">
                              <img 
                                src={feature.image} 
                                alt={feature.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-6 flex-1">
                              <p className="text-sm text-muted-foreground mb-1">{feature.date} • {feature.publication}</p>
                              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                              <p className="text-muted-foreground mb-4">{feature.excerpt}</p>
                              <Button variant="link" className="p-0 h-auto" asChild>
                                <a href={feature.link} className="flex items-center">
                                  Read Article <ArrowUpRight className="ml-1 h-3 w-3" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="assets" className="mt-6">
                  <h2 className="text-2xl font-semibold mb-6">Brand Assets</h2>
                  <p className="mb-6">
                    These resources are available for press and partners to use in articles and promotional materials. By downloading, you agree to use these assets according to our brand guidelines.
                  </p>
                  <div className="border rounded-lg divide-y">
                    {brandAssets.map((asset, index) => (
                      <div key={index} className="flex justify-between items-center p-4">
                        <div>
                          <p className="font-medium">{asset.name}</p>
                          <p className="text-sm text-muted-foreground">{asset.format} • {asset.fileSize}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-12 border rounded-lg p-6 bg-muted/30">
                <h3 className="text-xl font-semibold mb-2">Media Contact</h3>
                <p className="mb-4">
                  For press inquiries, interview requests, or additional information, please contact our press team.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium w-24">Email:</span>
                    <a href="mailto:press@servie.com" className="text-servie hover:underline">press@servie.com</a>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-24">Phone:</span>
                    <span>+234 800 123 4567</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>
    </>
  );
};

export default Press;
