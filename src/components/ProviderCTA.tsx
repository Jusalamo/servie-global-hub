import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ProviderCTA() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-servie/10 via-background to-background">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Become a Service Provider</h2>
              <p className="mt-4 text-muted-foreground text-base md:text-lg">
                Join our platform and connect with customers looking for your skills. Start growing your business today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-servie hover:bg-servie-600">
                <Link to="/become-provider">Register as Provider</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/become-seller">Register as Seller</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden bg-muted p-5 md:p-6">
            <div className="space-y-4">
              <div className="bg-servie/10 p-4 rounded-lg">
                <h4 className="font-semibold text-base mb-3">What You Get</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-servie">✓</span> Access to thousands of potential clients
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-servie">✓</span> Payment protection and easy invoicing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-servie">✓</span> Marketing tools and business insights
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-servie">✓</span> Support to help grow your business
                  </li>
                </ul>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-base mb-2">Testimonial</h4>
                <blockquote className="italic text-sm">
                  "Since joining this platform, I've increased my client base by 300% and been able to focus on what I love doing most - providing quality service."
                </blockquote>
                <p className="text-right text-xs font-medium mt-2">— Michael Rodriguez, Plumber</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}