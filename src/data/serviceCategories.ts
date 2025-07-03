export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  image?: string; // Add image property
  subcategories?: {
    id: string;
    name: string;
    icon: string;
    image?: string; // Add image property to subcategories too
  }[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "1",
    name: "Home Services",
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1558618047-b00de36e47d7?w=400&h=300&fit=crop",
    subcategories: [
      { 
        id: "1-1", 
        name: "Plumbing", 
        icon: "🔧",
        image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop"
      },
      { 
        id: "1-2", 
        name: "Electrical", 
        icon: "⚡",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop"
      },
      { 
        id: "1-3", 
        name: "Cleaning", 
        icon: "🧽",
        image: "https://images.unsplash.com/photo-1558618047-b00de36e47d7?w=400&h=300&fit=crop"
      },
      { 
        id: "1-4", 
        name: "Gardening", 
        icon: "🌱",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop"
      },
      { 
        id: "1-5", 
        name: "Painting", 
        icon: "🎨",
        image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop"
      }
    ]
  },
  {
    id: "2",
    name: "Beauty & Wellness",
    icon: "💄",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
    subcategories: [
      { 
        id: "2-1", 
        name: "Hair Styling", 
        icon: "💇‍♀️",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"
      },
      { 
        id: "2-2", 
        name: "Makeup", 
        icon: "💋",
        image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop"
      },
      { 
        id: "2-3", 
        name: "Massage Therapy", 
        icon: "💆‍♀️",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop"
      },
      { 
        id: "2-4", 
        name: "Nail Care", 
        icon: "💅",
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop"
      }
    ]
  },
  {
    id: "3",
    name: "Photography",
    icon: "📸",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
    subcategories: [
      { 
        id: "3-1", 
        name: "Wedding Photography", 
        icon: "💒",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop"
      },
      { 
        id: "3-2", 
        name: "Portrait Photography", 
        icon: "👤",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop"
      },
      { 
        id: "3-3", 
        name: "Event Photography", 
        icon: "🎉",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop"
      },
      { 
        id: "3-4", 
        name: "Product Photography", 
        icon: "📦",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"
      }
    ]
  },
  {
    id: "4",
    name: "Technology",
    icon: "💻",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    subcategories: [
      { 
        id: "4-1", 
        name: "Computer Repair", 
        icon: "🖥️",
        image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400&h=300&fit=crop"
      },
      { 
        id: "4-2", 
        name: "Web Development", 
        icon: "🌐",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop"
      },
      { 
        id: "4-3", 
        name: "Mobile App Development", 
        icon: "📱",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop"
      },
      { 
        id: "4-4", 
        name: "IT Support", 
        icon: "🛠️",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop"
      }
    ]
  },
  {
    id: "5",
    name: "Fitness & Health",
    icon: "💪",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    subcategories: [
      { 
        id: "5-1", 
        name: "Personal Training", 
        icon: "🏋️‍♂️",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
      },
      { 
        id: "5-2", 
        name: "Yoga Instruction", 
        icon: "🧘‍♀️",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"
      },
      { 
        id: "5-3", 
        name: "Nutrition Consulting", 
        icon: "🥗",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop"
      },
      { 
        id: "5-4", 
        name: "Physiotherapy", 
        icon: "🩺",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
      }
    ]
  },
  {
    id: "6",
    name: "Education & Tutoring",
    icon: "📚",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop",
    subcategories: [
      { 
        id: "6-1", 
        name: "Mathematics", 
        icon: "🔢",
        image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=300&fit=crop"
      },
      { 
        id: "6-2", 
        name: "Language Learning", 
        icon: "🗣️",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
      },
      { 
        id: "6-3", 
        name: "Music Lessons", 
        icon: "🎵",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"
      },
      { 
        id: "6-4", 
        name: "Test Preparation", 
        icon: "📝",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
      }
    ]
  }
];
