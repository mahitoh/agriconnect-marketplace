import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ProductCard';
import { products } from '../data/mockData';

const Marketplace = () => {
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Marketplace;
