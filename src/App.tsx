import { BrowserRouter, Routes, Route, RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
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
          <RouterProvider
            router={createBrowserRouter([
              {
                path: "/",
                element: <Index />
              },
              {
                path: "/categories",
                element: <ServiceCategories />
              },
              {
                path: "/service/:serviceId",
                element: <ServiceDetail />
              },
              {
                path: "/shop",
                element: <EcommerceShop />
              },
              {
                path: "/product/:productId",
                element: <ProductDetail />
              },
              {
                path: "/cart",
                element: <Cart />
              },
              {
                path: "/checkout",
                element: <Checkout />
              },
              {
                path: "/order-confirmation",
                element: <OrderConfirmation />
              },
              {
                path: "/sign-in",
                element: <SignIn />
              },
              {
                path: "/sign-up",
                element: <SignUp />
              },
              {
                path: "/forgot-password",
                element: <ForgotPassword />
              },
              {
                path: "/become-provider",
                element: <BecomeProvider />
              },
              {
                path: "/become-seller",
                element: <BecomeSeller />
              },
              {
                path: "/booking/:bookingId",
                element: <BookingPage />
              },
              {
                path: "/contact-support",
                element: <ContactSupport />
              },
              {
                path: "/terms-conditions",
                element: <TermsConditions />
              },
              {
                path: "/dashboard/client",
                element: <ClientDashboard />
              },
              {
                path: "/dashboard/provider",
                element: <ProviderDashboard />
              },
              {
                path: "/dashboard/seller",
                element: <SellerDashboard />
              },
              {
                path: "/dashboard",
                element: <UserDashboard />
              },
              {
                path: "*",
                element: <NotFound />
              }
            ])}
          />
          <Toaster position="top-right" />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
