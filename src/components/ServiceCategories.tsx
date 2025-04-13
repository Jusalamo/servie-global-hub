
import { 
  Home, Briefcase, Scissors, CalendarClock, Truck, GraduationCap, 
  Heart, Palette, Wrench, Hammer 
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const categories = [
  {
    icon: Home,
    name: "Home Services",
    description: "Cleaning, repairs, gardening, and more",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    icon: Briefcase,
    name: "Professional Services",
    description: "Programming, design, consulting, and more",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  {
    icon: Scissors,
    name: "Personal Care",
    description: "Hairstyling, spa services, fitness training",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  },
  {
    icon: CalendarClock,
    name: "Events & Catering",
    description: "Event planning, catering, photography",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  },
  {
    icon: Truck,
    name: "Transportation & Delivery",
    description: "Ride services, delivery, moving assistance",
    color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  {
    icon: GraduationCap,
    name: "Education & Tutoring",
    description: "Tutoring, language lessons, skill training",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  },
  {
    icon: Heart,
    name: "Health & Wellness",
    description: "Fitness training, nutrition, counseling",
    color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
  {
    icon: Palette,
    name: "Creative Services",
    description: "Design, writing, photography, and more",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  },
  {
    icon: Wrench,
    name: "Technical Support & IT",
    description: "Computer repair, IT services, and more",
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  },
  {
    icon: Hammer,
    name: "Craft & Artisanal",
    description: "Handmade goods, custom crafts, and more",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
]

export default function ServiceCategories() {
  const navigate = useNavigate();
  
  const handleCategoryClick = (categoryName: string) => {
    navigate(`/categories?category=${categoryName}`);
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-secondary/50 dark:bg-secondary/20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Explore Our Service Categories
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Browse through our wide range of services to find exactly what you need
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mt-12">
          {categories.map((category) => (
            <div 
              key={category.name} 
              className="flex flex-col items-center p-6 bg-background rounded-xl border hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className={`p-3 rounded-full mb-4 ${category.color}`}>
                <category.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-1">{category.name}</h3>
              <p className="text-sm text-center text-muted-foreground">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
