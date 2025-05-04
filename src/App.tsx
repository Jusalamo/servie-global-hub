
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import NotFound from "@/pages/NotFound";
import BecomeProvider from "@/pages/BecomeProvider";
import BecomeSeller from "@/pages/BecomeSeller";
import BookingPage from "@/pages/BookingPage";
import ContactSupport from "@/pages/ContactSupport";
import TermsConditions from "@/pages/TermsConditions";
import UserDashboard from "@/pages/dashboard/UserDashboard";
import ClientDashboard from "@/pages/dashboard/ClientDashboard";
import ProviderDashboard from "@/pages/dashboard/ProviderDashboard";
import SellerDashboard from "@/pages/dashboard/SellerDashboard";
import ServiceCategories from "@/pages/ServiceCategories";
import ServiceDetail from "@/pages/ServiceDetail";
import EcommerceShop from "@/pages/ecommerce/EcommerceShop";
import ProductDetail from "@/pages/ecommerce/ProductDetail";
import Cart from "@/pages/ecommerce/Cart";
import Checkout from "@/pages/ecommerce/Checkout";
import OrderConfirmation from "@/pages/ecommerce/OrderConfirmation";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/categories" element={<ServiceCategories />} />
            <Route path="/service/:serviceId" element={<ServiceDetail />} />
            <Route path="/shop" element={<EcommerceShop />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/become-provider" element={<BecomeProvider />} />
            <Route path="/become-seller" element={<BecomeSeller />} />
            <Route path="/booking/:bookingId" element={<BookingPage />} />
            <Route path="/contact-support" element={<ContactSupport />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/dashboard/client" element={<ClientDashboard />} />
            <Route path="/dashboard/provider" element={<ProviderDashboard />} />
            <Route path="/dashboard/seller" element={<SellerDashboard />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
