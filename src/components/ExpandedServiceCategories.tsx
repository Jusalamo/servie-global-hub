
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Scissors, 
  Wrench, 
  Car, 
  Home, 
  Heart, 
  GraduationCap, 
  Camera, 
  Utensils,
  Laptop,
  Trees,
  Dumbbell,
  Baby,
  PaintBucket,
  Music,
  Shirt,
  Dog,
  Briefcase,
  Stethoscope,
  Plane,
  ShoppingBag,
  Truck,
  Hammer,
  Palette,
  Calculator
} from "lucide-react";

const serviceCategories = [
  {
    icon: Scissors,
    name: "Beauty & Personal Care",
    count: 145,
    subcategories: ["Hair Styling", "Nail Care", "Makeup", "Spa Services"]
  },
  {
    icon: Wrench,
    name: "Home Maintenance",
    count: 230,
    subcategories: ["Plumbing", "Electrical", "HVAC", "General Repairs"]
  },
  {
    icon: Car,
    name: "Automotive",
    count: 89,
    subcategories: ["Car Wash", "Oil Change", "Tire Service", "Auto Repair"]
  },
  {
    icon: Home,
    name: "Cleaning Services",
    count: 167,
    subcategories: ["House Cleaning", "Office Cleaning", "Deep Cleaning", "Move-in/out"]
  },
  {
    icon: Heart,
    name: "Health & Wellness",
    count: 201,
    subcategories: ["Massage", "Physical Therapy", "Nutrition", "Mental Health"]
  },
  {
    icon: GraduationCap,
    name: "Education & Tutoring",
    count: 156,
    subcategories: ["Academic Tutoring", "Music Lessons", "Language Learning", "Test Prep"]
  },
  {
    icon: Camera,
    name: "Photography & Video",
    count: 78,
    subcategories: ["Event Photography", "Portrait Sessions", "Video Production", "Photo Editing"]
  },
  {
    icon: Utensils,
    name: "Food & Catering",
    count: 134,
    subcategories: ["Personal Chef", "Catering", "Meal Prep", "Baking"]
  },
  {
    icon: Laptop,
    name: "Technology Services",
    count: 192,
    subcategories: ["IT Support", "Web Development", "App Development", "Tech Repair"]
  },
  {
    icon: Trees,
    name: "Landscaping & Gardening",
    count: 112,
    subcategories: ["Lawn Care", "Garden Design", "Tree Service", "Irrigation"]
  },
  {
    icon: Dumbbell,
    name: "Fitness & Training",
    count: 98,
    subcategories: ["Personal Training", "Group Classes", "Yoga", "Sports Coaching"]
  },
  {
    icon: Baby,
    name: "Childcare & Babysitting",
    count: 87,
    subcategories: ["Babysitting", "Nanny Services", "Tutoring", "Activity Planning"]
  },
  {
    icon: PaintBucket,
    name: "Painting & Decorating",
    count: 145,
    subcategories: ["Interior Painting", "Exterior Painting", "Wallpaper", "Decorating"]
  },
  {
    icon: Music,
    name: "Entertainment",
    count: 67,
    subcategories: ["DJ Services", "Live Music", "Event Planning", "Party Entertainment"]
  },
  {
    icon: Shirt,
    name: "Fashion & Styling",
    count: 54,
    subcategories: ["Personal Styling", "Wardrobe Consulting", "Alterations", "Fashion Design"]
  },
  {
    icon: Dog,
    name: "Pet Services",
    count: 123,
    subcategories: ["Dog Walking", "Pet Grooming", "Pet Sitting", "Training"]
  },
  {
    icon: Briefcase,
    name: "Business Services",
    count: 189,
    subcategories: ["Consulting", "Accounting", "Legal", "Marketing"]
  },
  {
    icon: Stethoscope,
    name: "Healthcare",
    count: 145,
    subcategories: ["Home Care", "Medical Equipment", "Therapy", "Senior Care"]
  },
  {
    icon: Plane,
    name: "Travel & Transportation",
    count: 76,
    subcategories: ["Airport Transfer", "Tour Guide", "Travel Planning", "Moving Services"]
  },
  {
    icon: ShoppingBag,
    name: "Personal Shopping",
    count: 43,
    subcategories: ["Grocery Shopping", "Gift Selection", "Errands", "Delivery"]
  },
  {
    icon: Truck,
    name: "Moving & Delivery",
    count: 91,
    subcategories: ["Local Moving", "Long Distance", "Packing", "Storage"]
  },
  {
    icon: Hammer,
    name: "Construction & Renovation",
    count: 167,
    subcategories: ["Kitchen Remodel", "Bathroom Renovation", "Flooring", "Roofing"]
  },
  {
    icon: Palette,
    name: "Creative Services",
    count: 82,
    subcategories: ["Graphic Design", "Art Classes", "Crafting", "Interior Design"]
  },
  {
    icon: Calculator,
    name: "Financial Services",
    count: 105,
    subcategories: ["Tax Preparation", "Financial Planning", "Bookkeeping", "Insurance"]
  }
];

interface ExpandedServiceCategoriesProps {
  onCategorySelect?: (category: string) => void;
  selectedCategory?: string;
}

const ExpandedServiceCategories = ({ onCategorySelect, selectedCategory }: ExpandedServiceCategoriesProps) => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Service Categories</h2>
        <p className="text-muted-foreground">Browse our comprehensive selection of professional services</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {serviceCategories.map((category) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategory === category.name;
          
          return (
            <Card 
              key={category.name}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected ? 'ring-2 ring-servie border-servie' : 'hover:border-servie/50'
              }`}
              onClick={() => onCategorySelect?.(category.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-servie text-white' : 'bg-servie/10 text-servie'}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground mb-1 leading-tight">
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {category.count} providers
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {category.subcategories.slice(0, 2).map((sub) => (
                        <p key={sub} className="text-xs text-muted-foreground leading-tight">
                          • {sub}
                        </p>
                      ))}
                      {category.subcategories.length > 2 && (
                        <p className="text-xs text-servie font-medium">
                          +{category.subcategories.length - 2} more
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ExpandedServiceCategories;
