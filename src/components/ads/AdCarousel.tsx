import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';

// Temporary mock ads (replace with Supabase data later)
const mockAds = [
  {
    id: 'ad-1',
    title: 'Trusted Local Pros Near You',
    description: 'Book vetted service providers across Africa.',
    imageUrl: '/placeholder.svg',
    linkUrl: '#',
  },
  {
    id: 'ad-2',
    title: 'Sell Your Services on Servie',
    description: 'Join free. Upgrade anytime for more reach.',
    imageUrl: '/placeholder.svg',
    linkUrl: '#',
  },
  {
    id: 'ad-3',
    title: 'Shop Local, Support Communities',
    description: 'Discover products from nearby sellers.',
    imageUrl: '/placeholder.svg',
    linkUrl: '#',
  },
];

const AdCarousel: React.FC = () => {
  return (
    <section aria-label="Sponsored ads" className="w-full py-6">
      <div className="container mx-auto px-4">
        <Carousel
          opts={{ align: 'start', loop: true }}
          className="relative"
        >
          <CarouselContent>
            {mockAds.map((ad) => (
              <CarouselItem key={ad.id} className="md:basis-1/2 lg:basis-1/3">
                <a href={ad.linkUrl} aria-label={ad.title} className="block group">
                  <Card className="overflow-hidden border-foreground/10">
                    <div className="relative aspect-[16/9]">
                      <img
                        src={ad.imageUrl}
                        alt={`${ad.title} - Servie ad banner`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/5 opacity-90 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-semibold">{ad.title}</h3>
                        <p className="text-sm text-muted-foreground">{ad.description}</p>
                      </div>
                    </div>
                  </Card>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-6" aria-label="Previous ad" />
          <CarouselNext className="-right-6" aria-label="Next ad" />
        </Carousel>
      </div>
    </section>
  );
};

export default AdCarousel;
