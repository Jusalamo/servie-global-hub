
import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from "./components/ui/ThemeProvider"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { LocalizationProvider } from './components/LangCurrencySelector'
import Index from './pages/Index'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import NotFound from './pages/NotFound'
import ServiceCategories from './pages/ServiceCategories'
import ServiceDetail from './pages/ServiceDetail'
import EcommerceShop from './pages/ecommerce/EcommerceShop'
import ProductDetail from './pages/ecommerce/ProductDetail'
import Cart from './pages/ecommerce/Cart'
import UserDashboard from './pages/dashboard/UserDashboard'
import ClientDashboard from './pages/dashboard/ClientDashboard'
import ProviderDashboard from './pages/dashboard/ProviderDashboard'
import SellerDashboard from './pages/dashboard/SellerDashboard'
import BecomeProvider from './pages/BecomeProvider'
import BecomeSeller from './pages/BecomeSeller'
import BookingPage from './pages/BookingPage'
import TermsConditions from './pages/TermsConditions'
import ContactSupport from './pages/ContactSupport' // New page
import ScrollToTop from './components/ScrollToTop'

// Remove console logs in production
if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
  console.warn = () => {}
  console.error = () => {}
}

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="servie-theme">
        <AuthProvider>
          <LocalizationProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/categories" element={<ServiceCategories />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/shop" element={<EcommerceShop />} />
              <Route path="/shop/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/dashboard/client" element={<ClientDashboard />} />
              <Route path="/dashboard/provider" element={<ProviderDashboard />} />
              <Route path="/dashboard/seller" element={<SellerDashboard />} />
              <Route path="/become-provider" element={<BecomeProvider />} />
              <Route path="/become-seller" element={<BecomeSeller />} />
              <Route path="/booking/:id" element={<BookingPage />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/contact-support" element={<ContactSupport />} /> {/* Added new route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </LocalizationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
