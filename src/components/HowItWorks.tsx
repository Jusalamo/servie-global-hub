
import { Search, Calendar, UserCheck, CreditCard } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Find Services",
    description: "Browse through our wide range of services or search for specific needs",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    icon: UserCheck,
    title: "Choose a Provider",
    description: "Select from verified professionals based on reviews, ratings & portfolios",
    color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  {
    icon: Calendar,
    title: "Book Services",
    description: "Schedule an appointment at your preferred date and time",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "Pay securely through our platform with multiple payment options",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 scroll-mt-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              How Servie Works
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Getting the services you need has never been easier
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {steps.map((step, index) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <div className="relative">
                <div className={`p-4 rounded-full mb-4 ${step.color}`}>
                  <step.icon className="h-8 w-8" />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-muted-foreground/20 -translate-y-1/2">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-muted-foreground/60"></div>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-xl mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
