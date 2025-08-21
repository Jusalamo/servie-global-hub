
// Mock data for services
export const services = [
  {
    id: "1",
    title: "Professional Website Development",
    description: "I will create a professional, responsive website for your business or personal brand using the latest technologies. Includes 5 pages, SEO optimization, and basic analytics setup.",
    category: "Web Development",
    subcategory: "Website Creation",
    imageUrl: "https://images.unsplash.com/photo-1581092921461-6dd2d30e08d7?q=80&w=1170&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1581092921461-6dd2d30e08d7?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563986768711-b3bde3dc821e?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1170&auto=format&fit=crop",
    ],
    providerName: "Alex Johnson",
    providerId: "101",
    providerAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    providerJoined: "2022-03-15",
    providerLocation: "Nairobi, Kenya",
    providerDescription: "Full-stack web developer with 8+ years of experience specializing in React and Node.js applications.",
    rating: 4.9,
    reviewCount: 124,
    price: 350,
    currency: "$",
    delivery: "7 days",
    featured: true,
    tags: ["web development", "responsive design", "SEO"],
    packages: [
      {
        id: "1a",
        name: "Basic",
        description: "3-page responsive website with basic SEO",
        price: 250,
        delivery: "5 days",
        revisions: 2,
        features: ["3 pages", "Mobile responsive", "Basic SEO", "Contact form"]
      },
      {
        id: "1b",
        name: "Standard",
        description: "5-page responsive website with advanced features",
        price: 350,
        delivery: "7 days",
        revisions: 3,
        features: ["5 pages", "Mobile responsive", "SEO optimization", "Contact form", "Google Analytics", "Social media integration"]
      },
      {
        id: "1c",
        name: "Premium",
        description: "10-page website with full customization and premium features",
        price: 650,
        delivery: "14 days",
        revisions: 5,
        features: ["10 pages", "Mobile responsive", "Advanced SEO", "Contact form", "Google Analytics", "Social media integration", "E-commerce functionality", "Custom animations", "Logo design"]
      }
    ],
    reviews: [
      {
        id: "101",
        userId: "u201",
        userName: "Sarah M.",
        userAvatar: "https://randomuser.me/api/portraits/women/63.jpg",
        rating: 5,
        date: "2023-11-15",
        comment: "Alex delivered exactly what I needed for my business website. The design is clean, modern and the site works perfectly across all devices. Highly recommended!"
      },
      {
        id: "102",
        userId: "u202",
        userName: "Michael T.",
        userAvatar: "https://randomuser.me/api/portraits/men/47.jpg",
        rating: 4.5,
        date: "2023-10-22",
        comment: "Great service and communication throughout the project. The website looks professional and loads quickly. Would work with Alex again."
      },
      {
        id: "103",
        userId: "u203",
        userName: "Patricia K.",
        userAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
        rating: 5,
        date: "2023-09-30",
        comment: "Impressive attention to detail and excellent problem-solving skills. I had some specific requirements and Alex implemented all of them perfectly."
      }
    ]
  },
  {
    id: "2",
    title: "Mobile App Development for iOS and Android",
    description: "I will develop a custom mobile application for your business that works seamlessly on both iOS and Android platforms using React Native.",
    category: "Mobile Development",
    subcategory: "Apps",
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1074&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1074&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1170&auto=format&fit=crop",
    ],
    providerName: "Priya Sharma",
    providerId: "102",
    providerAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    providerJoined: "2021-07-22",
    providerLocation: "Lagos, Nigeria",
    providerDescription: "Mobile app developer specializing in cross-platform applications with 5 years of industry experience.",
    rating: 4.8,
    reviewCount: 89,
    price: 550,
    currency: "$",
    delivery: "21 days",
    featured: false,
    tags: ["mobile app", "iOS", "Android", "React Native"],
    packages: [
      {
        id: "2a",
        name: "Basic",
        description: "Simple app with up to 3 screens",
        price: 400,
        delivery: "14 days",
        revisions: 2,
        features: ["3 screens", "Basic functionality", "Cross-platform"]
      },
      {
        id: "2b",
        name: "Standard",
        description: "Medium complexity app with up to 6 screens",
        price: 550,
        delivery: "21 days",
        revisions: 3,
        features: ["6 screens", "User authentication", "Data storage", "API integration", "Cross-platform"]
      },
      {
        id: "2c",
        name: "Premium",
        description: "Complex app with unlimited screens and advanced features",
        price: 1200,
        delivery: "35 days",
        revisions: 5,
        features: ["Unlimited screens", "User authentication", "Cloud storage", "Advanced API integration", "Push notifications", "Analytics", "In-app purchases", "Offline functionality"]
      }
    ],
    reviews: [
      {
        id: "201",
        userId: "u301",
        userName: "John D.",
        userAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
        rating: 5,
        date: "2023-10-05",
        comment: "Priya developed a fantastic app for my startup. The code is clean, the app runs smoothly, and she was very responsive to my requirements."
      },
      {
        id: "202",
        userId: "u302",
        userName: "Emily W.",
        userAvatar: "https://randomuser.me/api/portraits/women/12.jpg",
        rating: 4,
        date: "2023-09-18",
        comment: "Good work overall. There were a few minor issues with the UI on certain Android devices, but Priya fixed them quickly."
      }
    ]
  },
  {
    id: "3",
    title: "Professional Logo Design",
    description: "I will create a modern, versatile logo design for your business with unlimited revisions until you're completely satisfied.",
    category: "Design",
    subcategory: "Logo Design",
    imageUrl: "https://images.unsplash.com/photo-1560157368-946d9c8f7cb6?q=80&w=1035&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1560157368-946d9c8f7cb6?q=80&w=1035&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1171&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1633532178462-96858b56f5a4?q=80&w=1169&auto=format&fit=crop",
    ],
    providerName: "David Okafor",
    providerId: "103",
    providerAvatar: "https://randomuser.me/api/portraits/men/79.jpg",
    providerJoined: "2022-01-10",
    providerLocation: "Accra, Ghana",
    providerDescription: "Graphic designer with over 10 years of experience specializing in brand identity and logo design.",
    rating: 5.0,
    reviewCount: 142,
    price: 120,
    currency: "$",
    delivery: "3 days",
    featured: true,
    tags: ["logo design", "branding", "graphic design"],
    packages: [
      {
        id: "3a",
        name: "Basic",
        description: "1 concept with 2 revisions",
        price: 75,
        delivery: "3 days",
        revisions: 2,
        features: ["1 concept", "Vector file", "High resolution files", "Logo transparency"]
      },
      {
        id: "3b",
        name: "Standard",
        description: "3 concepts with unlimited revisions",
        price: 120,
        delivery: "3 days",
        revisions: "Unlimited",
        features: ["3 concepts", "Vector files", "High resolution files", "Logo transparency", "Source files", "Social media kit"]
      },
      {
        id: "3c",
        name: "Premium",
        description: "5 concepts with full brand package",
        price: 250,
        delivery: "5 days",
        revisions: "Unlimited",
        features: ["5 concepts", "Vector files", "High resolution files", "Logo transparency", "Source files", "Social media kit", "Business card design", "Letterhead design", "Brand guidelines"]
      }
    ],
    reviews: [
      {
        id: "301",
        userId: "u401",
        userName: "Rebecca N.",
        userAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
        rating: 5,
        date: "2023-11-20",
        comment: "David created the perfect logo for my new business. He really understood my vision and delivered beyond my expectations!"
      },
      {
        id: "302",
        userId: "u402",
        userName: "Thomas L.",
        userAvatar: "https://randomuser.me/api/portraits/men/55.jpg",
        rating: 5,
        date: "2023-10-14",
        comment: "Extremely professional and talented designer. The logo is unique and perfectly represents my brand identity."
      },
      {
        id: "303",
        userId: "u403",
        userName: "Amina K.",
        userAvatar: "https://randomuser.me/api/portraits/women/40.jpg",
        rating: 5,
        date: "2023-09-05",
        comment: "Outstanding service! David was patient with my requests for changes and provided excellent suggestions. The final logo is perfect."
      }
    ]
  },
  {
    id: "4",
    title: "Home Cleaning Service",
    description: "Professional home cleaning service for apartments and houses. Thorough cleaning of all rooms including kitchen, bathrooms, and living areas.",
    category: "Home Services",
    subcategory: "Cleaning",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1170&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=1167&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=1170&auto=format&fit=crop",
    ],
    providerName: "Clean Masters Ltd",
    providerId: "104",
    providerAvatar: "https://randomuser.me/api/portraits/women/26.jpg",
    providerJoined: "2021-05-18",
    providerLocation: "Cape Town, South Africa",
    providerDescription: "Professional cleaning service with trained and vetted staff. We use eco-friendly products and provide exceptional cleaning results.",
    rating: 4.7,
    reviewCount: 218,
    price: 80,
    currency: "$",
    delivery: "Same day",
    featured: false,
    tags: ["cleaning", "home service", "housekeeping"],
    packages: [
      {
        id: "4a",
        name: "Basic",
        description: "Standard cleaning for small apartment (up to 1 bedroom)",
        price: 60,
        delivery: "2 hours",
        revisions: 0,
        features: ["Dusting", "Vacuuming", "Mopping", "Bathroom cleaning", "Kitchen cleaning"]
      },
      {
        id: "4b",
        name: "Standard",
        description: "Deep cleaning for medium sized homes (2-3 bedrooms)",
        price: 80,
        delivery: "3 hours",
        revisions: 0,
        features: ["All basic features", "Inside window cleaning", "Fridge cleaning", "Oven cleaning", "Baseboards"]
      },
      {
        id: "4c",
        name: "Premium",
        description: "Comprehensive cleaning for large homes (4+ bedrooms)",
        price: 150,
        delivery: "5 hours",
        revisions: 0,
        features: ["All standard features", "Inside cabinet cleaning", "Ceiling fans", "Light fixtures", "Wall washing", "Furniture deep cleaning"]
      }
    ],
    reviews: [
      {
        id: "401",
        userId: "u501",
        userName: "James M.",
        userAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
        rating: 5,
        date: "2023-11-25",
        comment: "Excellent service! My apartment hasn't been this clean since I moved in. The team was professional and thorough."
      },
      {
        id: "402",
        userId: "u502",
        userName: "Zainab A.",
        userAvatar: "https://randomuser.me/api/portraits/women/52.jpg",
        rating: 4,
        date: "2023-11-10",
        comment: "Very good service overall. They missed cleaning under the couch but came back the next day to fix it."
      },
      {
        id: "403",
        userId: "u503",
        userName: "Robert T.",
        userAvatar: "https://randomuser.me/api/portraits/men/33.jpg",
        rating: 5,
        date: "2023-10-22",
        comment: "Punctual, professional and did an amazing job. Worth every penny!"
      }
    ]
  },
  {
    id: "5",
    title: "Professional Photography Session",
    description: "Capture your special moments with a professional photography session. Perfect for portraits, family photos, events, and more.",
    category: "Photography",
    subcategory: "Photo Session",
    imageUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1170&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605117882932-f9e32b3a6e99?q=80&w=1169&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551772412-49a8e4ebea0b?q=80&w=1169&auto=format&fit=crop",
    ],
    providerName: "Grace Mutambo",
    providerId: "105",
    providerAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
    providerJoined: "2022-08-03",
    providerLocation: "Johannesburg, South Africa",
    providerDescription: "Professional photographer with 7 years of experience specializing in portrait, event, and commercial photography.",
    rating: 4.9,
    reviewCount: 76,
    price: 200,
    currency: "$",
    delivery: "7 days",
    featured: true,
    tags: ["photography", "portrait", "professional photos"],
    packages: [
      {
        id: "5a",
        name: "Basic",
        description: "1-hour photo session with 10 edited photos",
        price: 150,
        delivery: "5 days",
        revisions: 1,
        features: ["1-hour session", "10 edited digital photos", "1 location", "1 outfit change"]
      },
      {
        id: "5b",
        name: "Standard",
        description: "2-hour photo session with 25 edited photos",
        price: 200,
        delivery: "7 days",
        revisions: 2,
        features: ["2-hour session", "25 edited digital photos", "2 locations", "2 outfit changes", "Online gallery"]
      },
      {
        id: "5c",
        name: "Premium",
        description: "Half-day session with 50 edited photos and prints",
        price: 450,
        delivery: "10 days",
        revisions: 3,
        features: ["4-hour session", "50 edited digital photos", "Multiple locations", "Unlimited outfit changes", "Online gallery", "5 printed photos (8x10)", "Photo album"]
      }
    ],
    reviews: [
      {
        id: "501",
        userId: "u601",
        userName: "Olivia N.",
        userAvatar: "https://randomuser.me/api/portraits/women/89.jpg",
        rating: 5,
        date: "2023-11-18",
        comment: "Grace made our family photo session so enjoyable! The photos came out beautifully, and she was great with our kids."
      },
      {
        id: "502",
        userId: "u602",
        userName: "Daniel K.",
        userAvatar: "https://randomuser.me/api/portraits/men/37.jpg",
        rating: 5,
        date: "2023-10-30",
        comment: "Professional, creative, and delivered amazing results. I used these photos for my professional profile and received many compliments."
      },
      {
        id: "503",
        userId: "u603",
        userName: "Michelle T.",
        userAvatar: "https://randomuser.me/api/portraits/women/3.jpg",
        rating: 4.5,
        date: "2023-10-12",
        comment: "Grace has an amazing eye for composition and lighting. Very happy with our engagement photos!"
      }
    ]
  },
  {
    id: "6",
    title: "Personal Fitness Training",
    description: "Customized fitness training program designed to help you reach your health and fitness goals with personalized workouts and nutrition guidance.",
    category: "Fitness",
    subcategory: "Personal Training",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1170&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=1074&auto=format&fit=crop",
    ],
    providerName: "Samuel Nkosi",
    providerId: "106",
    providerAvatar: "https://randomuser.me/api/portraits/men/41.jpg",
    providerJoined: "2021-11-15",
    providerLocation: "Nairobi, Kenya",
    providerDescription: "Certified personal trainer with specialization in weight loss, muscle building, and functional fitness. Over 500 clients helped achieve their fitness goals.",
    rating: 4.8,
    reviewCount: 95,
    price: 60,
    currency: "$",
    delivery: "Per session",
    featured: false,
    tags: ["fitness", "personal training", "health", "workout"],
    packages: [
      {
        id: "6a",
        name: "Basic",
        description: "Single training session (1 hour)",
        price: 60,
        delivery: "1 hour",
        revisions: 0,
        features: ["1-hour training session", "Personalized workout", "Form correction", "Progress tracking"]
      },
      {
        id: "6b",
        name: "Standard",
        description: "Weekly package (3 sessions)",
        price: 150,
        delivery: "Weekly",
        revisions: 0,
        features: ["3 one-hour sessions", "Personalized workout plan", "Basic nutrition advice", "Form correction", "Progress tracking"]
      },
      {
        id: "6c",
        name: "Premium",
        description: "Monthly package (12 sessions + nutrition plan)",
        price: 500,
        delivery: "Monthly",
        revisions: 0,
        features: ["12 one-hour sessions", "Comprehensive workout program", "Detailed nutrition plan", "Meal prep guidance", "24/7 support via messaging", "Weekly progress assessments", "Body composition analysis"]
      }
    ],
    reviews: [
      {
        id: "601",
        userId: "u701",
        userName: "Lisa M.",
        userAvatar: "https://randomuser.me/api/portraits/women/72.jpg",
        rating: 5,
        date: "2023-11-22",
        comment: "Samuel is an amazing trainer! I've lost 15kg in 4 months with his program and guidance. He's motivating, knowledgeable and adaptable to your specific needs."
      },
      {
        id: "602",
        userId: "u702",
        userName: "Kevin O.",
        userAvatar: "https://randomuser.me/api/portraits/men/17.jpg",
        rating: 5,
        date: "2023-11-05",
        comment: "Working with Samuel has completely changed my approach to fitness. Not only am I stronger, but I've also learned so much about proper form and nutrition."
      },
      {
        id: "603",
        userId: "u703",
        userName: "Fatima J.",
        userAvatar: "https://randomuser.me/api/portraits/women/22.jpg",
        rating: 4,
        date: "2023-10-19",
        comment: "Good trainer who knows how to push you beyond your comfort zone. Sometimes sessions feel rushed but overall good experience."
      }
    ]
  }
];

// Mock data for categories
export const categories = [
  {
    id: "cat1",
    name: "Web Development",
    icon: "Code",
    description: "Website creation, development, and maintenance",
    subCategories: ["Website Creation", "E-commerce", "WordPress", "Frontend Development", "Backend Development"]
  },
  {
    id: "cat2",
    name: "Mobile Development",
    icon: "Smartphone",
    description: "Mobile app development for iOS and Android",
    subCategories: ["iOS Apps", "Android Apps", "React Native", "Flutter", "Mobile UI/UX"]
  },
  {
    id: "cat3",
    name: "Design",
    icon: "Palette",
    description: "Graphic design, UI/UX design, and branding",
    subCategories: ["Logo Design", "UI/UX Design", "Branding", "Illustration", "Print Design"]
  },
  {
    id: "cat4",
    name: "Writing",
    icon: "FileText",
    description: "Content creation, copywriting, and editing",
    subCategories: ["Content Writing", "Copywriting", "Technical Writing", "Editing", "Translation"]
  },
  {
    id: "cat5",
    name: "Digital Marketing",
    icon: "TrendingUp",
    description: "SEO, social media marketing, and advertising",
    subCategories: ["SEO", "Social Media Marketing", "Email Marketing", "PPC", "Content Marketing"]
  },
  {
    id: "cat6",
    name: "Video & Animation",
    icon: "Video",
    description: "Video production, animation, and motion graphics",
    subCategories: ["Video Editing", "Animation", "Motion Graphics", "Intro Videos", "Explainer Videos"]
  },
  {
    id: "cat7",
    name: "Music & Audio",
    icon: "Music",
    description: "Music production, voice over, and sound design",
    subCategories: ["Voice Over", "Music Production", "Audio Editing", "Sound Effects", "Podcasts"]
  },
  {
    id: "cat8",
    name: "Business",
    icon: "Briefcase",
    description: "Business planning, financial consulting, and legal services",
    subCategories: ["Business Plans", "Financial Consulting", "Legal Consulting", "Market Research", "Business Tips"]
  },
  {
    id: "cat9",
    name: "Home Services",
    icon: "Home",
    description: "Cleaning, repairs, and home maintenance",
    subCategories: ["Cleaning", "Repairs", "Gardening", "Interior Design", "Home Improvement"]
  },
  {
    id: "cat10",
    name: "Fitness",
    icon: "Activity",
    description: "Personal training, nutrition advice, and wellness",
    subCategories: ["Personal Training", "Nutrition", "Yoga", "Fitness Plans", "Meditation"]
  },
  {
    id: "cat11",
    name: "Photography",
    icon: "Camera",
    description: "Professional photography and editing",
    subCategories: ["Portrait Photography", "Event Photography", "Product Photography", "Photo Editing", "Photography Tips"]
  },
  {
    id: "cat12",
    name: "Tutoring",
    icon: "GraduationCap",
    description: "Academic tutoring and skill development",
    subCategories: ["Mathematics", "Science", "Languages", "Programming", "Test Preparation"]
  }
];

// Mock data for users
export const users = [
  {
    id: "u1",
    role: "client",
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    location: "Nairobi, Kenya",
    joined: "2023-01-15",
    bookings: ["booking1", "booking3"],
    favorites: ["1", "3", "5"]
  },
  {
    id: "u2",
    role: "provider",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    location: "Nairobi, Kenya",
    joined: "2022-03-15",
    services: ["1"],
    description: "Full-stack web developer with 8+ years of experience specializing in React and Node.js applications.",
    rating: 4.9,
    reviewCount: 124
  },
  {
    id: "u3",
    role: "provider",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    location: "Lagos, Nigeria",
    joined: "2021-07-22",
    services: ["2"],
    description: "Mobile app developer specializing in cross-platform applications with 5 years of industry experience.",
    rating: 4.8,
    reviewCount: 89
  }
];

// Mock data for bookings
export const bookings = [
  {
    id: "booking1",
    serviceId: "1",
    clientId: "u1",
    providerId: "u2",
    packageId: "1b",
    status: "completed",
    date: "2023-11-10",
    time: "10:00 AM",
    price: 350,
    currency: "$",
    paymentStatus: "paid",
    clientReview: {
      rating: 5,
      comment: "Excellent service! Alex delivered exactly what I needed and was very professional throughout the process."
    }
  },
  {
    id: "booking2",
    serviceId: "3",
    clientId: "u4",
    providerId: "u5",
    packageId: "3b",
    status: "scheduled",
    date: "2023-12-05",
    time: "2:30 PM",
    price: 120,
    currency: "$",
    paymentStatus: "paid",
    clientReview: null
  },
  {
    id: "booking3",
    serviceId: "5",
    clientId: "u1",
    providerId: "u6",
    packageId: "5c",
    status: "in-progress",
    date: "2023-11-25",
    time: "9:00 AM",
    price: 450,
    currency: "$",
    paymentStatus: "paid",
    clientReview: null
  }
];
