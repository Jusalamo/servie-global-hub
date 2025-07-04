
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { LocalizationProvider } from "@/components/LangCurrencySelector";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollToPage from "@/components/ScrollToPage";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import NotFound from "@/pages/NotFound";
import BecomeProvider from "@/pages/BecomeProvider";
import BecomeSeller from "@/pages/BecomeSeller";
import BookingPage from "@/pages/BookingPage";
import BookingConfirmation from "@/pages/BookingConfirmation";
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
import AboutUs from "@/pages/AboutUs";
import OurStory from "@/pages/OurStory";
import Team from "@/pages/Team";
import Careers from "@/pages/Careers";
import Press from "@/pages/Press";
import HelpCenter from "@/pages/HelpCenter";
import FAQs from "@/pages/FAQs";
import Returns from "@/pages/Returns";
import Shipping from "@/pages/Shipping";
import Privacy from "@/pages/Privacy";
import Sitemap from "@/pages/Sitemap";
import ProviderContact from "@/pages/ProviderContact";
import "./i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <LocalizationProvider>
                <ScrollToTop />
                <ScrollToPage />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/categories" element={<ServiceCategories />} />
                  <Route path="/service/:serviceId" element={<ServiceDetail />} />
                  <Route path="/shop" element={<EcommerceShop />} />
                  <Route path="/product/:productId" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/become-provider" element={<BecomeProvider />} />
                  <Route path="/become-seller" element={<BecomeSeller />} />
                  <Route path="/booking/:serviceId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
                  <Route path="/booking-confirmation" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
                  <Route path="/provider/:providerId/contact" element={<ProviderContact />} />
                  <Route path="/contact-support" element={<ContactSupport />} />
                  <Route path="/terms-conditions" element={<TermsConditions />} />
                  <Route path="/dashboard/client" element={<ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>} />
                  <Route path="/dashboard/provider" element={<ProtectedRoute role="provider"><ProviderDashboard /></ProtectedRoute>} />
                  <Route path="/dashboard/seller" element={<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                  
                  {/* Footer routes */}
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/our-story" element={<OurStory />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/press" element={<Press />} />
                  <Route path="/help" element={<HelpCenter />} />
                  <Route path="/faqs" element={<FAQs />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<TermsConditions />} />
                  <Route path="/sitemap" element={<Sitemap />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster richColors position="top-right" />
              </LocalizationProvider>
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
