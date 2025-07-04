import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Categories from './pages/Categories';
import CategoryDetails from './pages/CategoryDetails';
import ServiceDetails from './pages/ServiceDetails';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:categoryId" element={<CategoryDetails />} />
        <Route path="/service/:serviceId" element={<ServiceDetails />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
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
    </BrowserRouter>
  );
}

export default App;
