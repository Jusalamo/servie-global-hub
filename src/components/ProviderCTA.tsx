
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

const benefits = [
  "Showcase your skills and build a strong online presence",
  "Connect with clients looking for your specific services",
  "Set your own prices and availability schedule",
  "Receive secure payments directly through our platform",
  "Build your reputation with client reviews and ratings",
]

export default function ProviderCTA() {
  return (
    <section id="become-provider" className="py-16 md:py-24 relative">
      {/* Background accent */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -bottom-96 right-0 w-[600px] h-[600px] rounded-full bg-servie/5 dark:bg-servie/10"></div>
      </div>
      
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Become a Service Provider
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Join our growing network of professionals and start earning by offering your skills and services.
              </p>
            </div>
            <ul className="space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-servie" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div>
              <Button size="lg" className="rounded-full bg-servie hover:bg-servie-600 mt-4">
                Register as a Provider
              </Button>
            </div>
          </div>
          <div className="lg:order-first">
            <div className="aspect-video overflow-hidden rounded-2xl border bg-muted p-2">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                width={600}
                height={400}
                alt="Service provider working"
                className="aspect-video object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
