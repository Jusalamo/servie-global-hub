
import { 
  Home, Briefcase, Scissors, CalendarClock, Truck, GraduationCap, 
  Heart, Palette, Wrench, Hammer, Laptop, Utensils, ShoppingBag, 
  Car, Music, Camera, Globe, UserCog, Award, BookOpen,
  Baby, Dumbbell, Building, Gamepad, ThermometerSnowflake, Shirt,
  BadgeDollarSign, Bus, PawPrint, ShieldPlus, HelpCircle, Download,
  Printer, ScrollText, Sun, Sprout, Smartphone, Zap, TreePine,
  Factory, Plane, Users, Megaphone, Gift, Droplets, Stethoscope,
  GraduationCap as Education, Calculator, Scale, Gavel, Shield,
  Radio, Tv, Wind, Mountain, Fish, Wheat, Truck as Delivery,
  PhoneCall, Mail, MapPin, Clock, Star, Target, Lightbulb,
  Cpu, Database, Code, Wifi, Headphones, Mic, Video
} from "lucide-react";

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  region?: 'Africa' | 'Global';
  featured?: boolean;
}

export const serviceCategories: ServiceCategory[] = [
  // Home & Property Services
  {
    id: 'home-services',
    name: 'Home Services',
    description: 'Cleaning, repairs, gardening, and maintenance',
    icon: Home,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    region: 'Global',
    featured: true
  },
  {
    id: 'construction-building',
    name: 'Construction & Building',
    description: 'Building, renovation, construction management',
    icon: Building,
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    region: 'Global'
  },
  {
    id: 'plumbing-electrical',
    name: 'Plumbing & Electrical',
    description: 'Water systems, electrical installations, repairs',
    icon: Wrench,
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
    region: 'Global'
  },
  {
    id: 'hvac-services',
    name: 'HVAC Services',
    description: 'Heating, ventilation, air conditioning repair',
    icon: ThermometerSnowflake,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    region: 'Global'
  },

  // Technology & Digital Services
  {
    id: 'it-support',
    name: 'IT Support & Tech',
    description: 'Computer repair, IT services, tech support',
    icon: Laptop,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    region: 'Global',
    featured: true
  },
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Website creation, app development, programming',
    icon: Code,
    color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    region: 'Global'
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    description: 'SEO, social media, online advertising',
    icon: Megaphone,
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
    region: 'Global'
  },
  {
    id: 'mobile-app-development',
    name: 'Mobile App Development',
    description: 'iOS, Android app development and maintenance',
    icon: Smartphone,
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    region: 'Global'
  },

  // African-Focused Services
  {
    id: 'mobile-money',
    name: 'Mobile Money Services',
    description: 'Mobile banking, payments, financial transfers',
    icon: PhoneCall,
    color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    region: 'Africa',
    featured: true
  },
  {
    id: 'solar-energy',
    name: 'Solar Energy Solutions',
    description: 'Solar panel installation, renewable energy systems',
    icon: Sun,
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    region: 'Africa',
    featured: true
  },
  {
    id: 'agriculture-services',
    name: 'Agriculture Services',
    description: 'Farming, crop management, agricultural consulting',
    icon: Sprout,
    color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    region: 'Africa',
    featured: true
  },
  {
    id: 'borehole-drilling',
    name: 'Borehole & Water Services',
    description: 'Water drilling, pump installation, water systems',
    icon: Droplets,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    region: 'Africa'
  },
  {
    id: 'generator-services',
    name: 'Generator Services',
    description: 'Generator sales, installation, maintenance',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    region: 'Africa'
  },

  // Professional Services
  {
    id: 'legal-services',
    name: 'Legal Services',
    description: 'Legal advice, documentation, court representation',
    icon: Gavel,
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300',
    region: 'Global'
  },
  {
    id: 'accounting-finance',
    name: 'Accounting & Finance',
    description: 'Bookkeeping, tax preparation, financial planning',
    icon: Calculator,
    color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    region: 'Global'
  },
  {
    id: 'business-consulting',
    name: 'Business Consulting',
    description: 'Strategy, operations, management consulting',
    icon: Briefcase,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    region: 'Global'
  },
  {
    id: 'insurance-services',
    name: 'Insurance Services',
    description: 'Insurance advice, claims, policy management',
    icon: Shield,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    region: 'Global'
  },

  // Health & Wellness
  {
    id: 'healthcare',
    name: 'Healthcare Services',
    description: 'Medical care, nursing, health consultations',
    icon: Stethoscope,
    color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    region: 'Global',
    featured: true
  },
  {
    id: 'fitness-training',
    name: 'Fitness & Training',
    description: 'Personal training, fitness coaching, gym services',
    icon: Dumbbell,
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
    region: 'Global'
  },
  {
    id: 'mental-health',
    name: 'Mental Health & Therapy',
    description: 'Counseling, therapy, mental health support',
    icon: Heart,
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
    region: 'Global'
  },
  {
    id: 'nutrition-wellness',
    name: 'Nutrition & Wellness',
    description: 'Diet planning, wellness coaching, nutrition advice',
    icon: TreePine,
    color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    region: 'Global'
  },

  // Education & Training
  {
    id: 'tutoring-education',
    name: 'Tutoring & Education',
    description: 'Academic tutoring, skill training, courses',
    icon: Education,
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    region: 'Global',
    featured: true
  },
  {
    id: 'language-services',
    name: 'Language Services',
    description: 'Translation, interpretation, language teaching',
    icon: Globe,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    region: 'Global'
  },
  {
    id: 'vocational-training',
    name: 'Vocational Training',
    description: 'Skills training, certification programs, workshops',
    icon: Award,
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    region: 'Global'
  },

  // Creative & Media
  {
    id: 'photography-video',
    name: 'Photography & Video',
    description: 'Photography, videography, editing services',
    icon: Camera,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    region: 'Global'
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    description: 'Logo design, branding, visual design',
    icon: Palette,
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
    region: 'Global'
  },
  {
    id: 'music-entertainment',
    name: 'Music & Entertainment',
    description: 'Music production, DJ services, entertainment',
    icon: Music,
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    region: 'Global'
  },
  {
    id: 'content-writing',
    name: 'Content Writing',
    description: 'Copywriting, content creation, editing',
    icon: BookOpen,
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    region: 'Global'
  },

  // Transportation & Logistics
  {
    id: 'transportation',
    name: 'Transportation Services',
    description: 'Ride services, delivery, logistics',
    icon: Truck,
    color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    region: 'Global'
  },
  {
    id: 'delivery-courier',
    name: 'Delivery & Courier',
    description: 'Package delivery, courier services, logistics',
    icon: Delivery,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    region: 'Global'
  },
  {
    id: 'moving-relocation',
    name: 'Moving & Relocation',
    description: 'House moving, office relocation, packing',
    icon: Bus,
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
    region: 'Global'
  },

  // Personal Care & Lifestyle
  {
    id: 'personal-care',
    name: 'Personal Care & Beauty',
    description: 'Hair styling, beauty services, spa treatments',
    icon: Scissors,
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
    region: 'Global'
  },
  {
    id: 'childcare',
    name: 'Child Care Services',
    description: 'Babysitting, nannying, daycare services',
    icon: Baby,
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    region: 'Global'
  },
  {
    id: 'pet-services',
    name: 'Pet Services',
    description: 'Pet care, grooming, veterinary services',
    icon: PawPrint,
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
    region: 'Global'
  },

  // Events & Entertainment
  {
    id: 'event-planning',
    name: 'Event Planning',
    description: 'Wedding planning, corporate events, celebrations',
    icon: CalendarClock,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    region: 'Global'
  },
  {
    id: 'catering-food',
    name: 'Catering & Food Services',
    description: 'Catering, meal preparation, food delivery',
    icon: Utensils,
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    region: 'Global'
  },

  // Security & Safety
  {
    id: 'security-services',
    name: 'Security Services',
    description: 'Security guards, surveillance, safety consulting',
    icon: ShieldPlus,
    color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    region: 'Global'
  },

  // Automotive
  {
    id: 'automotive',
    name: 'Automotive Services',
    description: 'Car repair, maintenance, automotive services',
    icon: Car,
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    region: 'Global'
  },

  // Manufacturing & Industrial
  {
    id: 'manufacturing',
    name: 'Manufacturing Services',
    description: 'Production, assembly, industrial services',
    icon: Factory,
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300',
    region: 'Global'
  },

  // Travel & Tourism
  {
    id: 'travel-tourism',
    name: 'Travel & Tourism',
    description: 'Travel planning, tour guides, tourism services',
    icon: Plane,
    color: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
    region: 'Global'
  },

  // Environmental Services
  {
    id: 'environmental',
    name: 'Environmental Services',
    description: 'Waste management, recycling, environmental consulting',
    icon: TreePine,
    color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    region: 'Global'
  },

  // Communication & Media
  {
    id: 'telecommunications',
    name: 'Telecommunications',
    description: 'Network setup, communication systems, tech support',
    icon: Radio,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    region: 'Global'
  },

  // Real Estate
  {
    id: 'real-estate',
    name: 'Real Estate Services',
    description: 'Property sales, rentals, real estate consulting',
    icon: Home,
    color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    region: 'Global'
  },

  // Specialized African Services
  {
    id: 'micro-finance',
    name: 'Micro Finance',
    description: 'Small loans, savings groups, financial inclusion',
    icon: BadgeDollarSign,
    color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    region: 'Africa'
  },
  {
    id: 'traditional-crafts',
    name: 'Traditional Crafts',
    description: 'Handicrafts, traditional art, cultural services',
    icon: Hammer,
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    region: 'Africa'
  },
  {
    id: 'farming-livestock',
    name: 'Farming & Livestock',
    description: 'Animal husbandry, crop farming, agricultural equipment',
    icon: Wheat,
    color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    region: 'Africa'
  },
  {
    id: 'fishing-aquaculture',
    name: 'Fishing & Aquaculture',
    description: 'Fish farming, fishing equipment, marine services',
    icon: Fish,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    region: 'Africa'
  }
];

// Helper functions
export const getFeaturedCategories = () => serviceCategories.filter(cat => cat.featured);
export const getAfricanCategories = () => serviceCategories.filter(cat => cat.region === 'Africa');
export const getGlobalCategories = () => serviceCategories.filter(cat => cat.region === 'Global');
export const getCategoryById = (id: string) => serviceCategories.find(cat => cat.id === id);
