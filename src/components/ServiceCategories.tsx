
import { 
  Home, Briefcase, Scissors, CalendarClock, Truck, GraduationCap, 
  Heart, Palette, Wrench, Hammer, Laptop, Utensils, ShoppingBag, 
  Car, Music, Camera, Globe, UserCog, Award, BookOpen,
  Baby, Dumbbell, Building, Gamepad, ThermometerSnowflake, Shirt,
  BadgeDollarSign, Bus, PawPrint, ShieldPlus, HelpCircle, Download,
  Printer, ScrollText, Stethoscope, Scale, TreePine, Zap, Paintbrush,
  Coffee, Factory, Smartphone, Wifi, Shield, Plane, MapPin, Gift,
  Users, Phone, Video, Headphones, Monitor, Database, Cloud,
  Cpu, HardDrive, Router, Keyboard, Mouse, Speaker, Mic, Radio,
  Settings, Tool, Flashlight, Compass, Mountain, Tent, Fish, Anchor
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const categories = [
  // Core Home & Personal Services
  {
    icon: Home,
    name: "Home Services",
    description: "Cleaning, repairs, gardening, maintenance",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    icon: Scissors,
    name: "Personal Care & Beauty",
    description: "Hairstyling, spa, makeup, grooming",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  },
  {
    icon: Stethoscope,
    name: "Healthcare Services",
    description: "Medical consultations, nursing, physiotherapy",
    color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
  {
    icon: Baby,
    name: "Childcare & Education",
    description: "Babysitting, tutoring, nanny services",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  },
  {
    icon: PawPrint,
    name: "Pet Services",
    description: "Pet sitting, grooming, training, walking",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },

  // Professional & Business Services
  {
    icon: Briefcase,
    name: "Business Consulting",
    description: "Strategy, finance, marketing, management",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    icon: Scale,
    name: "Legal Services",
    description: "Legal advice, documentation, representation",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  },
  {
    icon: BadgeDollarSign,
    name: "Financial Services",
    description: "Accounting, tax, financial planning",
    color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  {
    icon: ScrollText,
    name: "Documentation Services",
    description: "Notarization, certification, translation",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  },
  {
    icon: Users,
    name: "HR & Recruitment",
    description: "Hiring, training, HR consulting",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },

  // Technology & Digital Services
  {
    icon: Laptop,
    name: "Web Development",
    description: "Websites, web apps, e-commerce platforms",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    icon: Smartphone,
    name: "Mobile App Development",
    description: "iOS, Android, cross-platform apps",
    color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  {
    icon: Palette,
    name: "Graphic Design",
    description: "Logo, branding, print, digital design",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  },
  {
    icon: Camera,
    name: "Video & Photography",
    description: "Event photography, video editing, production",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  },
  {
    icon: Wrench,
    name: "IT Support & Repair",
    description: "Computer repair, network setup, tech support",
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  },
  {
    icon: Database,
    name: "Data & Analytics",
    description: "Data analysis, database management, BI",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  {
    icon: Cloud,
    name: "Cloud Services",
    description: "Cloud migration, DevOps, infrastructure",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    icon: Shield,
    name: "Cybersecurity",
    description: "Security audits, penetration testing",
    color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },

  // Creative & Entertainment
  {
    icon: Music,
    name: "Music & Audio",
    description: "Music production, mixing, sound design",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  {
    icon: Video,
    name: "Video Production",
    description: "Film making, editing, animation",
    color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
  {
    icon: BookOpen,
    name: "Writing & Content",
    description: "Copywriting, blogging, content creation",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  {
    icon: Paintbrush,
    name: "Art & Illustration",
    description: "Digital art, illustrations, custom artwork",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  },
  {
    icon: Gamepad,
    name: "Gaming Services",
    description: "Game development, coaching, streaming",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  },

  // Construction & Trades
  {
    icon: Building,
    name: "Construction",
    description: "Building, renovation, project management",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    icon: Hammer,
    name: "Handyman Services",
    description: "Repairs, installations, maintenance",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  },
  {
    icon: Zap,
    name: "Electrical Services",
    description: "Wiring, installations, electrical repairs",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  },
  {
    icon: ThermometerSnowflake,
    name: "HVAC Services",
    description: "Heating, cooling, ventilation systems",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    icon: TreePine,
    name: "Landscaping",
    description: "Garden design, lawn care, tree services",
    color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },

  // Transportation & Logistics
  {
    icon: Truck,
    name: "Delivery & Moving",
    description: "Package delivery, moving services, logistics",
    color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  {
    icon: Car,
    name: "Automotive Services",
    description: "Car repair, detailing, maintenance",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  {
    icon: Bus,
    name: "Transportation",
    description: "Ride services, shuttle, chauffeur",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    icon: Plane,
    name: "Travel Services",
    description: "Travel planning, booking, tour guides",
    color: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  },

  // Health & Fitness
  {
    icon: Dumbbell,
    name: "Fitness & Training",
    description: "Personal training, fitness coaching",
    color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  {
    icon: Heart,
    name: "Wellness & Therapy",
    description: "Massage, counseling, alternative medicine",
    color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },

  // Food & Hospitality
  {
    icon: Utensils,
    name: "Catering & Cooking",
    description: "Personal chef, catering, meal prep",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  },
  {
    icon: Coffee,
    name: "Food & Beverage",
    description: "Coffee services, bartending, food trucks",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    icon: CalendarClock,
    name: "Event Planning",
    description: "Weddings, parties, corporate events",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },

  // Fashion & Lifestyle
  {
    icon: Shirt,
    name: "Fashion & Tailoring",
    description: "Custom clothing, alterations, styling",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  {
    icon: ShoppingBag,
    name: "Personal Shopping",
    description: "Wardrobe styling, personal shopping",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  },

  // Education & Training
  {
    icon: GraduationCap,
    name: "Tutoring & Education",
    description: "Academic tutoring, language lessons",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  },
  {
    icon: Award,
    name: "Professional Training",
    description: "Skill development, certification courses",
    color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },

  // Security & Safety
  {
    icon: ShieldPlus,
    name: "Security Services",
    description: "Home security, personal protection",
    color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },

  // Printing & Manufacturing
  {
    icon: Printer,
    name: "Printing Services",
    description: "Custom printing, promotional materials",
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  },
  {
    icon: Factory,
    name: "Manufacturing",
    description: "Custom manufacturing, prototyping",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },

  // Digital Products & Services
  {
    icon: Download,
    name: "Digital Products",
    description: "Templates, digital assets, software",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  {
    icon: Globe,
    name: "Digital Marketing",
    description: "SEO, social media, online advertising",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },

  // Outdoor & Adventure
  {
    icon: Mountain,
    name: "Outdoor Adventures",
    description: "Hiking guides, outdoor training, expeditions",
    color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  {
    icon: Fish,
    name: "Fishing & Marine",
    description: "Fishing guides, boat services, marine repair",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },

  // Specialized Services
  {
    icon: HelpCircle,
    name: "Consulting & Coaching",
    description: "Life coaching, business consulting",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  {
    icon: Gift,
    name: "Special Occasions",
    description: "Gift services, celebration planning",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  },
  {
    icon: MapPin,
    name: "Local Services",
    description: "Community services, local expertise",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
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
              Browse through our comprehensive range of services to find exactly what you need
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
