import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Farmers from './pages/Farmers';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/dashboard/FarmerDashboard';
import ConsumerDashboard from './pages/dashboard/ConsumerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Cart from './pages/Cart';
import './styles/global.css';
import FarmerProfile from './pages/FarmerProfile';
import Error404Page from './pages/error/Error404Page';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import PaymentStatus from './pages/PaymentStatus';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/farmers" element={<Farmers />} />
              <Route path="/farmers/:id" element={<FarmerProfile />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
              <Route path="/consumer/dashboard" element={<ConsumerDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment/status" element={<PaymentStatus />} />
              <Route path="/404" element={<Error404Page />} />
              <Route path="*" element={<Error404Page />} />
            </Routes>
          </BrowserRouter>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
