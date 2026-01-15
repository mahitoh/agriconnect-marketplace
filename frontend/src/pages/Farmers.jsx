import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FarmerCard from '../components/FarmerCard';
import { farmers } from '../data/mockData';

const Farmers = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <Navbar />
      
      <section className="section" style={{ background: 'white', paddingTop: '120px' }}>
        <div className="section-header">
          <div className="section-label">Our Producers</div>
          <h2 className="section-title">Meet Our Farmers</h2>
          <p className="section-subtitle">
            Discover the dedicated people behind your products. Transparency starts with knowing your farmer.
          </p>
        </div>

        <div className="farmers-grid">
          {farmers.map((farmer) => (
            <FarmerCard key={farmer.id} farmer={farmer} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Farmers;
