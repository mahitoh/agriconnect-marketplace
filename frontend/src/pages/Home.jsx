import React from 'react';
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
  FaEnvelopeOpenText
} from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ProductCard';
import FarmerCard from '../components/FarmerCard';
import { stats, features, products, steps, farmers } from '../data/mockData';
import { useCart } from '../context/CartContext';

const Home = () => {
  const { addToCart } = useCart();

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

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-label">Digital Agricultural Marketplace</div>

          <h1 className="hero-title">
            Buy Directly From Farmers.<br />
            <span className="hero-highlight">Transparent Prices.</span> Fresh Produce.
          </h1>

          <p className="hero-subtitle">
            Connect with local farmers in Cameroon. Cut out the middlemen and support sustainable agriculture.
          </p>

          <div className="cta-buttons">
            <button className="btn btn-primary btn-large" type="button">
              Explore Products →
            </button>
            <button className="btn btn-outline btn-large" type="button">
              Sell Your Products
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-icon">
                {index === 0 && <FaUserFriends size={40} />}
                {index === 1 && <FaBoxOpen size={40} />}
                {index === 2 && <FaCheckCircle size={40} />}
              </div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="section" style={{ background: '#f5f5f0' }}>
        <div className="section-header">
          <div className="section-label">Why Choose Us</div>
          <h2 className="section-title">A Better Way to Buy Fresh</h2>
          <p className="section-subtitle">
            The most transparent and fair marketplace for agricultural trade in Cameroon.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={feature.title} className="feature-card">
              <div className="feature-icon">
                {index === 0 && <FaSeedling size={26} />}
                {index === 1 && <FaBalanceScale size={26} />}
                {index === 2 && <FaShieldAlt size={26} />}
                {index === 3 && <FaMobileAlt size={26} />}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section id="marketplace" className="section" style={{ background: 'white' }}>
        <div className="section-header">
          <div className="section-label">Featured Products</div>
          <h2 className="section-title">Today's Selection</h2>
          <p className="section-subtitle">Fresh products selected from our trusted local farmers.</p>
        </div>

        <div className="products-grid">
          {products.slice(0, 3).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>

        <div className="view-all-container">
          <Link to="/marketplace" className="btn btn-primary btn-large" style={{ textDecoration: 'none' }}>
            View All Products →
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section" style={{ background: '#f5f5f0' }}>
        <div className="section-header">
          <div className="section-label">How It Works</div>
          <h2 className="section-title">From Farm to Your Table</h2>
          <p className="section-subtitle">
            A simple three-step process for fresh and transparent products.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={step.title} className="step-card">
              <div className="step-icon">
                {index === 0 && <FaSearch size={42} />}
                {index === 1 && <FaShoppingCart size={42} />}
                {index === 2 && <FaTruck size={42} />}
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Farmers Section */}
      <section id="farmers" className="section" style={{ background: 'white' }}>
        <div className="section-header">
          <div className="section-label">Our Producers</div>
          <h2 className="section-title">Featured Farmers</h2>
          <p className="section-subtitle">
            Discover the dedicated people behind your products. Transparency starts with knowing your farmer.
          </p>
        </div>

        <div className="farmers-grid">
          {farmers.slice(0, 2).map((farmer) => (
            <FarmerCard key={farmer.id} farmer={farmer} />
          ))}
        </div>

        <div className="view-all-container">
          <Link to="/farmers" className="btn btn-outline btn-large" style={{ textDecoration: 'none' }}>
            View All Farmers →
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="newsletter-content">
          <div className="newsletter-icon">
            <FaEnvelopeOpenText size={60} />
          </div>
          <h2 className="newsletter-title">Stay Informed</h2>
          <p className="newsletter-subtitle">
            Receive seasonal updates, farmer stories, and exclusive offers.
          </p>

          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              className="newsletter-input"
              placeholder="Your email address"
              required
            />
            <button type="submit" className="btn-subscribe">
              Subscribe
            </button>
          </form>

          <p className="newsletter-privacy">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
