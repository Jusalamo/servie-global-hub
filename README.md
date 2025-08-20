# Servie Marketplace 🚀

A comprehensive marketplace platform connecting service providers, sellers, and clients in a seamless digital environment with a focus on African cultural representation.

## 🌟 Features

### Authentication & Role Management
- **Multi-role authentication system**: Client, Service Provider, Seller, Admin
- **Secure sign-up/sign-in** with Supabase authentication
- **Role-based dashboards** with tailored functionality
- **Profile management** with image uploads

### Service Management
- **Complete CRUD operations** for services
- **Category-based organization** with 10+ service categories
- **Service provider profiles** with ratings and reviews
- **Booking system** with real-time status updates
- **Quotation management** for custom service requests

### E-commerce Features
- **Product marketplace** with 15+ sample products
- **Shopping cart** with quantity management
- **Order processing** and confirmation
- **Product management** for sellers
- **Review and rating system**

### Financial Management
- **Transaction tracking** for all financial activities
- **Earnings dashboard** for providers and sellers
- **Payment integration** ready for production
- **Financial reporting** with charts and analytics

### User Experience
- **Responsive design** optimized for all devices
- **Dark/light theme** support
- **Multi-language** support (i18n ready)
- **Real-time notifications** system
- **Advanced search** and filtering

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Authentication + Storage)
- **State Management**: React Context + React Query
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup** 
   The project is pre-configured with Supabase credentials. For production:
   ```bash
   # Create .env file
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📊 Database Schema

The application uses a comprehensive Supabase database with the following main tables:

- **profiles**: User profile information with role management
- **services**: Service listings with provider relationships
- **products**: Product catalog for e-commerce
- **bookings**: Service booking management
- **orders**: E-commerce order processing
- **quotations**: Custom service quotation system
- **financial_transactions**: Complete financial tracking
- **reviews**: Rating and review system

All tables include proper Row Level Security (RLS) policies for data protection.

## 🔐 Authentication Flow

1. **Role Selection**: Users choose their role (Client/Provider/Seller/Admin)
2. **Registration**: Complete profile setup with role-specific fields
3. **Email Verification**: Secure email confirmation process
4. **Dashboard Redirect**: Automatic redirect to role-appropriate dashboard
5. **Profile Management**: Complete profile editing with image uploads

## 📱 Dashboard Features

### Client Dashboard
- Booking management and history
- Favorite services tracking
- Order history and tracking
- Profile and payment settings

### Provider Dashboard
- Service management with CRUD operations
- Booking calendar and client management
- Quotation system for custom requests
- Financial earnings tracking
- Review and rating management

### Seller Dashboard
- Product management with inventory
- Order processing and fulfillment
- Financial sales tracking
- Customer management

### Admin Dashboard
- User management across all roles
- Platform analytics and reporting
- Content moderation tools
- System configuration

## 🎨 Design System

The application uses a comprehensive design system with:
- **Semantic color tokens** for consistent theming
- **Responsive breakpoints** for all device sizes
- **Consistent typography** scale
- **Accessible components** following WCAG guidelines
- **African-inspired** color palette and imagery

## 🔧 Production Deployment

### Vercel Deployment
1. **Connect repository** to Vercel
2. **Configure environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Deploy** automatically on git push

### Manual Deployment
```bash
# Build and deploy
chmod +x deploy.sh
./deploy.sh
```

## 🧪 Demo Accounts

For testing different roles, use these email patterns:
- **Client**: any email (e.g., `user@example.com`)
- **Provider**: include "provider" (e.g., `john.provider@example.com`)
- **Seller**: include "seller" (e.g., `jane.seller@example.com`)  
- **Admin**: include "admin" (e.g., `admin@example.com`)

Password: Any password works in demo mode

## 📈 Key Metrics

- **15+ Products** across 6 categories
- **10 Service Categories** with subcategories
- **8 Comprehensive Services** with African cultural focus
- **4 User Roles** with distinct functionalities
- **Full CRUD Operations** across all data models
- **Row Level Security** for all database tables
- **Real-time Updates** for bookings and orders

---

## Original Lovable Project Info

**URL**: https://lovable.dev/projects/0be97c41-fdd1-4c13-8622-f8dc3f33cfeb
