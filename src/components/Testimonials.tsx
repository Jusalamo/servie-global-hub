
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Amara Johnson",
    role: "Homeowner",
    content: "Servie made finding a reliable plumber so easy! The booking process was seamless, and I was able to see reviews before making my choice. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80",
    rating: 5,
  },
  {
    name: "Kwame Mensah",
    role: "Small Business Owner",
    content: "As a business owner, I needed to find a web developer quickly. Servie connected me with a professional developer who delivered exactly what I needed. The process was fast and efficient.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80",
    rating: 5,
  },
  {
    name: "Fatima Ahmed",
    role: "Event Planner",
    content: "I found amazing caterers for my client's wedding through Servie. The platform made it easy to compare options, check availability, and book directly. It saved me so much time!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80",
    rating: 4,
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-secondary/50 dark:bg-secondary/20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              What Our Users Say
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from clients and service providers who have found success using Servie
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.name} 
              className="flex flex-col p-6 bg-background rounded-xl border hover:shadow-md transition-all"
            >
              <div className="flex space-x-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-muted fill-muted"}`}
                  />
                ))}
              </div>
              <p className="flex-1 text-muted-foreground mb-6">&ldquo;{testimonial.content}&rdquo;</p>
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
