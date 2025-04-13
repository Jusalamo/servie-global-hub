
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
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

// ScrollToTop component to handle scrolling to the top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// This function will be replaced by actual authentication check once Supabase is integrated
const isAuthenticated = () => {
  return true; // For demo purposes, always return true
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
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
              // This will be replaced with a proper auth guard when Supabase is integrated
              isAuthenticated() ? <ClientDashboard /> : <Navigate to="/signin" />
            } 
          />
          <Route 
            path="/dashboard/provider" 
            element={
              // This will be replaced with a proper auth guard when Supabase is integrated
              isAuthenticated() ? <ProviderDashboard /> : <Navigate to="/signin" />
            } 
          />
          <Route path="/booking/:serviceId" element={<BookingPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
