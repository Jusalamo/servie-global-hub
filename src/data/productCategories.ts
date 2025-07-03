
export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  image: string;
  description: string;
  subcategories?: {
    id: string;
    name: string;
    icon: string;
    image?: string;
  }[];
}

export const productCategories: ProductCategory[] = [
  {
    id: "1",
    name: "Beauty & Personal Care",
    icon: "✨",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
    description: "Beauty products, skincare, and personal care items",
    subcategories: [
      { 
        id: "1-1", 
        name: "Hair Extensions", 
        icon: "💁‍♀️",
        image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=300&fit=crop"
      },
      { 
        id: "1-2", 
        name: "Makeup", 
        icon: "💄",
        image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop"
      },
      { 
        id: "1-3", 
        name: "Skincare", 
        icon: "🧴",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop"
      },
      { 
        id: "1-4", 
        name: "Fragrances", 
        icon: "🌸",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop"
      }
    ]
  },
  {
    id: "2",
    name: "Electronics",
    icon: "📱",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop",
    description: "Latest gadgets, smartphones, and electronic accessories",
    subcategories: [
      { 
        id: "2-1", 
        name: "Smartphones", 
        icon: "📱",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop"
      },
      { 
        id: "2-2", 
        name: "Laptops", 
        icon: "💻",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop"
      },
      { 
        id: "2-3", 
        name: "Headphones", 
        icon: "🎧",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
      },
      { 
        id: "2-4", 
        name: "Accessories", 
        icon: "🔌",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop"
      }
    ]
  },
  {
    id: "3",
    name: "Fashion & Clothing",
    icon: "👗",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    description: "Trendy clothing, shoes, and fashion accessories",
    subcategories: [
      { 
        id: "3-1", 
        name: "Women's Clothing", 
        icon: "👚",
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop"
      },
      { 
        id: "3-2", 
        name: "Men's Clothing", 
        icon: "👔",
        image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=300&fit=crop"
      },
      { 
        id: "3-3", 
        name: "Shoes", 
        icon: "👟",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop"
      },
      { 
        id: "3-4", 
        name: "Accessories", 
        icon: "👜",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop"
      }
    ]
  },
  {
    id: "4",
    name: "Home & Garden",
    icon: "🏡",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    description: "Home decor, furniture, and gardening supplies",
    subcategories: [
      { 
        id: "4-1", 
        name: "Furniture", 
        icon: "🛋️",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
      },
      { 
        id: "4-2", 
        name: "Home Decor", 
        icon: "🖼️",
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop"
      },
      { 
        id: "4-3", 
        name: "Kitchen & Dining", 
        icon: "🍽️",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
      },
      { 
        id: "4-4", 
        name: "Garden Tools", 
        icon: "🌱",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop"
      }
    ]
  },
  {
    id: "5",
    name: "Sports & Fitness",
    icon: "⚽",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    description: "Sports equipment, fitness gear, and outdoor activities",
    subcategories: [
      { 
        id: "5-1", 
        name: "Fitness Equipment", 
        icon: "🏋️‍♂️",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
      },
      { 
        id: "5-2", 
        name: "Sports Gear", 
        icon: "⚽",
        image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=300&fit=crop"
      },
      { 
        id: "5-3", 
        name: "Outdoor Equipment", 
        icon: "🏕️",
        image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&h=300&fit=crop"
      },
      { 
        id: "5-4", 
        name: "Activewear", 
        icon: "👟",
        image: "https://images.unsplash.com/photo-1506629905607-683389167ddb?w=400&h=300&fit=crop"
      }
    ]
  },
  {
    id: "6",
    name: "Books & Education",
    icon: "📚",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    description: "Books, educational materials, and learning resources",
    subcategories: [
      { 
        id: "6-1", 
        name: "Fiction Books", 
        icon: "📖",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop"
      },
      { 
        id: "6-2", 
        name: "Educational Books", 
        icon: "📚",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop"
      },
      { 
        id: "6-3", 
        name: "E-Books", 
        icon: "📱",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop"
      },
      { 
        id: "6-4", 
        name: "Stationery", 
        icon: "✏️",
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop"
      }
    ]
  }
];

export const getProductCategoryById = (id: string): ProductCategory | undefined => {
  return productCategories.find(category => category.id === id);
};

export const getAllSubcategories = () => {
  return productCategories.reduce((acc, category) => {
    if (category.subcategories) {
      acc.push(...category.subcategories);
    }
    return acc;
  }, [] as { id: string; name: string; icon: string; image?: string; }[]);
};
