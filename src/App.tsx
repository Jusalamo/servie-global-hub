
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
import { ServieLayout } from "@/components/layout/ServieLayout";

import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ConfirmEmail from "@/pages/ConfirmEmail";
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
import { SellerStorefront } from "@/components/seller/SellerStorefront";
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
    <ThemeProvider defaultTheme="light" storageKey="servie-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <LocalizationProvider>
                <ScrollToTop />
                <ScrollToPage />
                <Routes>
                  <Route path="/" element={
                    <ServieLayout showBackground={true}>
                      <Index />
                    </ServieLayout>
                  } />
                  <Route path="/categories" element={
                    <ServieLayout>
                      <ServiceCategories />
                    </ServieLayout>
                  } />
                  <Route path="/service/:serviceId" element={
                    <ServieLayout>
                      <ServiceDetail />
                    </ServieLayout>
                  } />
                  <Route path="/shop" element={
                    <ServieLayout>
                      <EcommerceShop />
                    </ServieLayout>
                  } />
                  <Route path="/shop/:sellerSlug" element={
                    <ServieLayout>
                      <SellerStorefront />
                    </ServieLayout>
                  } />
                  <Route path="/product/:productId" element={
                    <ServieLayout>
                      <ProductDetail />
                    </ServieLayout>
                  } />
                  <Route path="/cart" element={
                    <ServieLayout>
                      <Cart />
                    </ServieLayout>
                  } />
                  <Route path="/checkout" element={
                    <ServieLayout>
                      <ProtectedRoute><Checkout /></ProtectedRoute>
                    </ServieLayout>
                  } />
                  <Route path="/order-confirmation" element={
                    <ServieLayout>
                      <ProtectedRoute><OrderConfirmation /></ProtectedRoute>
                    </ServieLayout>
                  } />
                  <Route path="/sign-in" element={
                    <ServieLayout>
                      <SignIn />
                    </ServieLayout>
                  } />
                  <Route path="/signin" element={
                    <ServieLayout>
                      <SignIn />
                    </ServieLayout>
                  } />
                  <Route path="/sign-up" element={
                    <ServieLayout>
                      <SignUp />
                    </ServieLayout>
                  } />
                  <Route path="/signup" element={
                    <ServieLayout>
                      <SignUp />
                    </ServieLayout>
                  } />
                  <Route path="/confirm-email" element={
                    <ServieLayout>
                      <ConfirmEmail />
                    </ServieLayout>
                  } />
                  <Route path="/forgot-password" element={
                    <ServieLayout>
                      <ForgotPassword />
                    </ServieLayout>
                  } />
                  <Route path="/become-provider" element={
                    <ServieLayout>
                      <BecomeProvider />
                    </ServieLayout>
                  } />
                  <Route path="/become-seller" element={
                    <ServieLayout>
                      <BecomeSeller />
                    </ServieLayout>
                  } />
                  <Route path="/booking/:serviceId" element={
                    <ServieLayout>
                      <ProtectedRoute><BookingPage /></ProtectedRoute>
                    </ServieLayout>
                  } />
                  <Route path="/booking-confirmation" element={
                    <ServieLayout>
                      <ProtectedRoute><BookingConfirmation /></ProtectedRoute>
                    </ServieLayout>
                  } />
                  <Route path="/provider/:providerId/contact" element={
                    <ServieLayout>
                      <ProviderContact />
                    </ServieLayout>
                  } />
                  <Route path="/contact-support" element={
                    <ServieLayout>
                      <ContactSupport />
                    </ServieLayout>
                  } />
                  <Route path="/terms-conditions" element={
                    <ServieLayout>
                      <TermsConditions />
                    </ServieLayout>
                  } />
                  <Route path="/dashboard/client" element={
                    <ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>
                  } />
                  <Route path="/dashboard/provider" element={
                    <ProtectedRoute role="provider"><ProviderDashboard /></ProtectedRoute>
                  } />
                  <Route path="/dashboard/seller" element={
                    <ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute><UserDashboard /></ProtectedRoute>
                  } />
                  
                  {/* Footer routes */}
                  <Route path="/about" element={
                    <ServieLayout>
                      <AboutUs />
                    </ServieLayout>
                  } />
                  <Route path="/our-story" element={
                    <ServieLayout>
                      <OurStory />
                    </ServieLayout>
                  } />
                  <Route path="/team" element={
                    <ServieLayout>
                      <Team />
                    </ServieLayout>
                  } />
                  <Route path="/careers" element={
                    <ServieLayout>
                      <Careers />
                    </ServieLayout>
                  } />
                  <Route path="/press" element={
                    <ServieLayout>
                      <Press />
                    </ServieLayout>
                  } />
                  <Route path="/help" element={
                    <ServieLayout>
                      <HelpCenter />
                    </ServieLayout>
                  } />
                  <Route path="/faqs" element={
                    <ServieLayout>
                      <FAQs />
                    </ServieLayout>
                  } />
                  <Route path="/returns" element={
                    <ServieLayout>
                      <Returns />
                    </ServieLayout>
                  } />
                  <Route path="/shipping" element={
                    <ServieLayout>
                      <Shipping />
                    </ServieLayout>
                  } />
                  <Route path="/privacy" element={
                    <ServieLayout>
                      <Privacy />
                    </ServieLayout>
                  } />
                  <Route path="/terms" element={
                    <ServieLayout>
                      <TermsConditions />
                    </ServieLayout>
                  } />
                  <Route path="/sitemap" element={
                    <ServieLayout>
                      <Sitemap />
                    </ServieLayout>
                  } />
                  
                  <Route path="*" element={
                    <ServieLayout>
                      <NotFound />
                    </ServieLayout>
                  } />
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
