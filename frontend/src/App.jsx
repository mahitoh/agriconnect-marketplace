import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/consumer/dashboard" element={<ConsumerDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/FarmerProfile" element={<FarmerProfile/>} />
          <Route path="/Error404Page" element={<Error404Page/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
