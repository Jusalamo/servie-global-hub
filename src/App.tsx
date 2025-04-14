
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import ServiceCategories from "./pages/ServiceCategories";
import ServiceDetail from "./pages/ServiceDetail";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import ProviderDashboard from "./pages/dashboard/ProviderDashboard";
import SellerDashboard from "./pages/dashboard/SellerDashboard";
import BookingPage from "./pages/BookingPage";
import EcommerceShop from "./pages/ecommerce/EcommerceShop";
import ProductDetail from "./pages/ecommerce/ProductDetail";
import Cart from "./pages/ecommerce/Cart";
import UserDashboard from "./pages/dashboard/UserDashboard";
import BecomeSeller from "./pages/BecomeSeller";
import BecomeProvider from "./pages/BecomeProvider";
import ProfileEdit from "./components/profile/ProfileEdit";
import EnhancedFooter from "./components/EnhancedFooter";

const queryClient = new QueryClient();

// Protected route component for role-based access control
interface ProtectedRouteProps {
  element: JSX.Element;
  requiredRole?: string;
}

const ProtectedRoute = ({ element, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  
  // Show loading or redirect to sign-in if not authenticated
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }
  
  // If role is required, check if user has that role
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }
  
  return element;
};

// App routes with AuthProvider
const AppRoutes = () => {
  const { userRole } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/categories" element={<ServiceCategories />} />
      <Route path="/service/:id" element={<ServiceDetail />} />
      <Route path="/booking/:serviceId" element={<BookingPage />} />
      <Route path="/become-seller" element={<BecomeSeller />} />
      <Route path="/become-provider" element={<BecomeProvider />} />
      <Route path="/profile/edit" element={
        <ProtectedRoute element={<ProfileEdit />} />
      } />
      
      {/* E-commerce routes */}
      <Route path="/shop" element={<EcommerceShop />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      
      {/* Smart dashboard routing based on user role */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute 
            element={<UserDashboard />}
          />
        } 
      />
      
      {/* Role-based dashboard routes */}
      <Route 
        path="/dashboard/client" 
        element={
          <ProtectedRoute 
            element={<ClientDashboard />}
            requiredRole="client"
          />
        } 
      />
      <Route 
        path="/dashboard/provider" 
        element={
          <ProtectedRoute 
            element={<ProviderDashboard />}
            requiredRole="provider"
          />
        } 
      />
      <Route 
        path="/dashboard/seller" 
        element={
          <ProtectedRoute 
            element={<SellerDashboard />}
            requiredRole="seller"
          />
        } 
      />
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
