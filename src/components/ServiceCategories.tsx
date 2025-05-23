
import { 
  Home, Briefcase, Scissors, CalendarClock, Truck, GraduationCap, 
  Heart, Palette, Wrench, Hammer, Laptop, Utensils, ShoppingBag, 
  Car, Music, Camera, Globe, UserCog, Award, BookOpen,
  Baby, Dumbbell, Building, Gamepad, ThermometerSnowflake, Shirt,
  BadgeDollarSign, Bus, PawPrint, ShieldPlus, HelpCircle, Download,
  Printer, ScrollText
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
  {
    icon: Laptop,
    name: "Digital Services",
    description: "Web development, digital marketing, SEO",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    icon: Utensils,
    name: "Food & Culinary",
    description: "Personal chefs, cooking lessons, meal prep",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  },
  {
    icon: ShoppingBag,
    name: "Shopping & Styling",
    description: "Personal shopping, wardrobe styling, fashion advice",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  },
  {
    icon: Car,
    name: "Automotive Services",
    description: "Car repair, detailing, driving lessons",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  {
    icon: Music,
    name: "Music & Entertainment",
    description: "Music lessons, DJs, entertainment planning",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  {
    icon: Camera,
    name: "Photography & Video",
    description: "Professional photography, videography, editing",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  },
  {
    icon: Globe,
    name: "Travel Services",
    description: "Travel planning, tour guides, concierge services",
    color: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  },
  {
    icon: UserCog,
    name: "Business Consulting",
    description: "Business strategy, marketing advice, finance consulting",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    icon: Award,
    name: "Legal & Professional",
    description: "Legal advice, accounting, professional services",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  },
  {
    icon: BookOpen,
    name: "Writing & Editing",
    description: "Content writing, editing, proofreading services",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  // New categories
  {
    icon: Baby,
    name: "Child Care",
    description: "Babysitting, nannying, daycare services",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  },
  {
    icon: Dumbbell,
    name: "Fitness & Training",
    description: "Personal training, group classes, fitness programs",
    color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  {
    icon: Building,
    name: "Construction",
    description: "Building, renovation, construction management",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    icon: Gamepad,
    name: "Gaming Services",
    description: "Coaching, streaming assistance, game development",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  },
  {
    icon: ThermometerSnowflake,
    name: "HVAC Services",
    description: "Heating, ventilation, air conditioning repair",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    icon: Shirt,
    name: "Clothing & Alterations",
    description: "Custom clothing, alterations, tailoring",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  {
    icon: BadgeDollarSign,
    name: "Financial Services",
    description: "Financial planning, tax preparation, investment advice",
    color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  {
    icon: Bus,
    name: "Public Transportation",
    description: "Bus services, shuttle services, transportation planning",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    icon: PawPrint,
    name: "Pet Services",
    description: "Pet sitting, dog walking, grooming, training",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    icon: ShieldPlus,
    name: "Security Services",
    description: "Home security, personal protection, security consulting",
    color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
  {
    icon: HelpCircle,
    name: "Counseling & Therapy",
    description: "Personal counseling, therapy, mental health services",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    icon: Download,
    name: "Digital Downloads",
    description: "Templates, digital products, ready-to-use assets",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  {
    icon: Printer,
    name: "Printing Services",
    description: "Custom printing, business cards, promotional materials",
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  },
  {
    icon: ScrollText,
    name: "Documentation Services",
    description: "Notarization, certification, document preparation",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  }
]

export default function ServiceCategories() {
  const navigate = useNavigate();
  
  const handleCategoryClick = (categoryName: string) => {
    console.log("Navigating to category:", categoryName);
    navigate(`/categories?category=${encodeURIComponent(categoryName)}`);
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-12">
          {categories.map((category) => (
            <div 
              key={category.name} 
              className="flex flex-col items-center p-6 bg-background rounded-xl border hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className={`p-3 rounded-full mb-4 ${category.color}`}>
                <category.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-1 text-center">{category.name}</h3>
              <p className="text-sm text-center text-muted-foreground line-clamp-2">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
