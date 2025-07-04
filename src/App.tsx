
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import AboutUs from './pages/AboutUs';
import ContactSupport from './pages/ContactSupport';
import ServiceCategories from './pages/ServiceCategories';
import ServiceDetail from './pages/ServiceDetail';
import EcommerceShop from './pages/ecommerce/EcommerceShop';
import ProductDetail from './pages/ecommerce/ProductDetail';
import Cart from './pages/ecommerce/Cart';
import Checkout from './pages/ecommerce/Checkout';
import OrderConfirmation from './pages/ecommerce/OrderConfirmation';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import UserDashboard from './pages/dashboard/UserDashboard';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import ProviderDashboard from './pages/dashboard/ProviderDashboard';
import SellerDashboard from './pages/dashboard/SellerDashboard';
import RequireAuth from './components/auth/RequireAuth';
import AdminDashboard from "@/pages/dashboard/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactSupport />} />
      <Route path="/services" element={<ServiceCategories />} />
      <Route path="/categories" element={<ServiceCategories />} />
      <Route path="/category/:categoryId" element={<ServiceCategories />} />
      <Route path="/service/:serviceId" element={<ServiceDetail />} />
      <Route path="/shop" element={<EcommerceShop />} />
      <Route path="/product/:productId" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
      
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/dashboard/client" element={<ClientDashboard />} />
        <Route path="/dashboard/provider" element={<ProviderDashboard />} />
        <Route path="/dashboard/seller" element={<SellerDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
