import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserFriends,
  FaBoxOpen,
  FaCheckCircle,
  FaSeedling,
  FaBalanceScale,
  FaShieldAlt,
  FaMobileAlt,
  FaSearch,
  FaShoppingCart,
  FaTruck,
  FaArrowRight
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ProductCard';
import FarmerCard from '../components/FarmerCard';
import { stats, features, products, steps, farmers } from '../data/mockData';
import { useCart } from '../context/CartContext';

const Home = () => {
  const { addToCart } = useCart();
  const [counters, setCounters] = useState(stats.map(() => 0));

  const handleAddToCart = (product) => {
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: parseInt(product.price.replace(/[^\d]/g, '')),
      image: product.image,
      category: product.badge,
      farmer: product.farmer,
      location: product.location
    };
    addToCart(cartProduct);
  };

  // Animate counters on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = stats.map(stat => parseInt(stat.number.replace(/\D/g, '')));
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setCounters(targets.map(target =>
        Math.min(Math.floor((target / steps) * currentStep), target)
      ));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&h=900&fit=crop')"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-900)]/90 via-[var(--primary-800)]/85 to-[var(--accent-900)]/80" />

          {/* Animated Shapes */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-20 right-20 w-64 h-64 bg-[var(--accent-500)]/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute bottom-20 left-20 w-96 h-96 bg-[var(--secondary-500)]/10 rounded-full blur-3xl"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 bg-[var(--accent-400)] rounded-full animate-pulse" />
            Digital Agricultural Marketplace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Buy Directly From Farmers.
            <br />
            <span className="text-gradient bg-gradient-to-r from-[var(--accent-400)] to-[var(--secondary-400)] bg-clip-text text-transparent">
              Transparent Prices.
            </span>{' '}
            Fresh Produce.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Connect with local farmers in Cameroon. Cut out the middlemen and support sustainable agriculture.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/marketplace">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-[var(--secondary-500)] to-[var(--secondary-600)] text-white shadow-2xl hover:from-[var(--secondary-600)] hover:to-[var(--secondary-700)] transition-all flex items-center gap-3"
                type="button"
              >
                Explore Products
                <FaArrowRight />
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-bold text-lg bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 transition-all"
                type="button"
              >
                Sell Your Products
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-20 z-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all text-center group hover:-translate-y-2 duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  {index === 0 && <FaUserFriends size={28} />}
                  {index === 1 && <FaBoxOpen size={28} />}
                  {index === 2 && <FaCheckCircle size={28} />}
                </div>
                <div className="text-4xl font-bold text-[var(--primary-600)] mb-2">
                  {counters[index]}+
                </div>
                <div className="text-sm text-[var(--text-secondary)] font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] text-sm font-semibold mb-4">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              A Better Way to Buy Fresh
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              The most transparent and fair marketplace for agricultural trade in Cameroon.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 mb-4 rounded-xl bg-gradient-to-br from-[var(--primary-50)] to-[var(--accent-50)] flex items-center justify-center text-[var(--primary-600)] group-hover:scale-110 transition-transform">
                  {index === 0 && <FaSeedling size={24} />}
                  {index === 1 && <FaBalanceScale size={24} />}
                  {index === 2 && <FaShieldAlt size={24} />}
                  {index === 3 && <FaMobileAlt size={24} />}
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[var(--secondary-50)] text-[var(--secondary-600)] text-sm font-semibold mb-4">
              Featured Products
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Today's Selection
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Fresh products selected from our trusted local farmers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {products.slice(0, 3).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>

          <div className="text-center">
            <Link to="/marketplace">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3"
                type="button"
              >
                View All Products
                <FaArrowRight />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[var(--accent-50)] text-[var(--accent-700)] text-sm font-semibold mb-4">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              From Farm to Your Table
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              A simple three-step process for fresh and transparent products.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className="relative text-center"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] flex items-center justify-center text-white shadow-xl">
                  {index === 0 && <FaSearch size={36} />}
                  {index === 1 && <FaShoppingCart size={36} />}
                  {index === 2 && <FaTruck size={36} />}
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                  {step.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {step.description}
                </p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[var(--primary-300)] to-transparent" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Farmers */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] text-sm font-semibold mb-4">
              Our Producers
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Featured Farmers
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Discover the dedicated people behind your products. Transparency starts with knowing your farmer.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {farmers.slice(0, 2).map((farmer) => (
              <FarmerCard key={farmer.id} farmer={farmer} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/farmers">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-bold text-lg bg-white text-[var(--primary-500)] border-2 border-[var(--primary-500)] hover:bg-[var(--primary-50)] transition-all inline-flex items-center gap-3"
                type="button"
              >
                View All Farmers
                <FaArrowRight />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
