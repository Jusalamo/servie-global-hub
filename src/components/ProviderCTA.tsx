
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const benefits = [
  "Showcase your skills and build a strong online presence",
  "Connect with clients looking for your specific services",
  "Set your own prices and availability schedule",
  "Receive secure payments directly through our platform",
  "Build your reputation with client reviews and ratings",
]

// Define the provider tier plans
const providerTiers = [
  {
    id: "basic",
    name: "Basic",
    price: 0,
    features: [
      "Create a profile",
      "List up to 3 services",
      "Basic messaging with clients",
      "Standard search visibility"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    price: 19.99,
    features: [
      "List unlimited services",
      "Priority search placement",
      "Advanced analytics",
      "Featured provider status",
      "Premium support"
    ]
  },
  {
    id: "pro",
    name: "Professional",
    price: 49.99,
    features: [
      "Everything in Premium",
      "Top search placement",
      "Verified badge",
      "Custom branding",
      "Priority customer support",
      "Marketing tools and promotion"
    ]
  }
]

export default function ProviderCTA() {
  const navigate = useNavigate();
  
  const handleRegisterClick = () => {
    console.log("Navigating to provider signup");
    navigate('/signup?tab=provider');
    toast.success("Provider registration page loaded", {
      description: "Choose a plan that fits your needs"
    });
  };

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
              <Button size="lg" className="rounded-full bg-servie hover:bg-servie-600 mt-4" onClick={handleRegisterClick}>
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
        
        {/* New Provider Tiers Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-3">Choose Your Provider Plan</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the plan that best suits your business needs and goals. Upgrade or downgrade anytime.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {providerTiers.map((tier) => (
              <div key={tier.id} className={`border rounded-xl p-6 flex flex-col ${tier.id === 'premium' ? 'border-servie shadow-lg relative' : ''}`}>
                {tier.id === 'premium' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-servie text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h4 className="text-xl font-bold mb-2">{tier.name}</h4>
                <div className="mb-4">
                  <span className="text-3xl font-bold">${tier.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 mb-6 flex-grow">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-servie mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={tier.id === 'premium' ? 'default' : 'outline'} 
                  className={tier.id === 'premium' ? 'bg-servie hover:bg-servie-600' : ''}
                  onClick={handleRegisterClick}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
