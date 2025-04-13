
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
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
import BookingPage from "./pages/BookingPage";

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
    return <Navigate to="/" />;
  }
  
  return element;
};

// App routes with AuthProvider
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/categories" element={<ServiceCategories />} />
      <Route path="/service/:id" element={<ServiceDetail />} />
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
      <Route path="/booking/:serviceId" element={<BookingPage />} />
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
