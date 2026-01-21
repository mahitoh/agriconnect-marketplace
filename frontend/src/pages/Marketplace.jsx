import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ProductCard';
import { products } from '../data/mockData';
import { useCart } from '../context/CartContext';

const Marketplace = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    // Convert the product data format for cart
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: parseInt(product.price.replace(/[^\d]/g, '')), // Convert "15 000 FCFA" to 15000
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
      
      <section className="section" style={{ background: 'white', paddingTop: '120px' }}>
        <div className="section-header">
          <div className="section-label">Marketplace</div>
          <h2 className="section-title">Browse All Products</h2>
          <p className="section-subtitle">
            Discover fresh agricultural products from verified farmers across Cameroon.
          </p>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Marketplace;
