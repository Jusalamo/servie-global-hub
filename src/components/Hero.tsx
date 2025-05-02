
import { Link } from "react-router-dom";
import ServieIcon from "@/components/ServieIcon";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import AnimatedSearchInput from "./AnimatedSearchInput";

export default function Hero() {
  const [subscribeEmail, setSubscribeEmail] = useState("");
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail) {
      return toast.error("Please enter your email address");
    }
    toast.success(`Thank you for subscribing with ${subscribeEmail}!`);
    setSubscribeEmail("");
  };

  return (
    <section id="hero" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="dotted-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotted-pattern)" />
        </svg>
      </div>

      <div className="container px-4 md:px-6 relative">
        <div className="max-w-4xl mx-auto text-center space-y-12 relative">
          {/* App logo/icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-servie/10 flex items-center justify-center mb-6">
            <ServieIcon className="w-8 h-8 text-servie" />
          </div>

          {/* Main hero text */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in">
              Find The Perfect Service Provider For Your Needs
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl animate-fade-in">
              Connect with top professionals and skilled service providers in your area
            </p>
          </div>

          {/* Search */}
          <div className="w-full max-w-3xl mx-auto animate-fade-in">
            <AnimatedSearchInput 
              className="w-full"
              onSearch={(query) => {
                toast.info(`Searching for: ${query}`);
                // In a real app, this would navigate to search results
              }}
            />
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button asChild size="lg" className="bg-servie text-white hover:bg-servie-600">
              <Link to="/categories">Browse Services</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/ecommerce/shop">Shop Products</Link>
            </Button>
          </div>

          {/* Trusted by section */}
          <div className="mt-20 animate-fade-in">
            <p className="text-sm text-muted-foreground mb-6">Trusted by over 10,000+ customers</p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-70">
              {["Alpha", "Bravo", "Charlie", "Delta", "Echo"].map((name) => (
                <div key={name} className="text-xl font-semibold tracking-tight">
                  {name} <span className="text-servie">Co.</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
