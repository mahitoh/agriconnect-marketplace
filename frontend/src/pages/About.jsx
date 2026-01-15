import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { FaUsers, FaHandshake, FaLeaf, FaChartLine } from 'react-icons/fa';

const About = () => {
  const values = [
    {
      icon: <FaUsers size={40} />,
      title: 'Community First',
      description: 'We prioritize the well-being of farmers and consumers, building a sustainable agricultural community.'
    },
    {
      icon: <FaHandshake size={40} />,
      title: 'Transparency',
      description: 'Every transaction is transparent. You know exactly where your money goes and who grows your food.'
    },
    {
      icon: <FaLeaf size={40} />,
      title: 'Sustainability',
      description: 'We promote sustainable farming practices that protect the environment for future generations.'
    },
    {
      icon: <FaChartLine size={40} />,
      title: 'Growth',
      description: 'Supporting local farmers helps grow the agricultural economy and creates opportunities for all.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero" style={{ minHeight: '400px', paddingTop: '120px' }}>
        <div className="hero-content">
          <h1 className="hero-title" style={{ fontSize: '48px' }}>
            About AgriConnect
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '18px' }}>
            Connecting farmers and consumers for a better agricultural future
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section" style={{ background: 'white' }}>
        <div className="section-header">
          <div className="section-label">Our Mission</div>
          <h2 className="section-title">Building a Transparent Agricultural Marketplace</h2>
          <p className="section-subtitle">
            AgriConnect was founded to bridge the gap between local farmers and consumers in Cameroon. 
            We believe in fair trade, transparency, and supporting local agriculture. Our platform 
            eliminates middlemen, ensuring farmers receive fair compensation while consumers get 
            fresh, quality products at competitive prices.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="section" style={{ background: '#f5f5f0' }}>
        <div className="section-header">
          <div className="section-label">Our Values</div>
          <h2 className="section-title">What We Stand For</h2>
        </div>

        <div className="features-grid">
          {values.map((value) => (
            <div key={value.title} className="feature-card">
              <div className="feature-icon">
                {value.icon}
              </div>
              <h3 className="feature-title">{value.title}</h3>
              <p className="feature-desc">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="section" style={{ background: 'white' }}>
        <div className="section-header">
          <div className="section-label">Our Story</div>
          <h2 className="section-title">How It All Began</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#666', marginBottom: '20px' }}>
              AgriConnect started as a final year project at The ICT University, Cameroon, with a 
              simple goal: to create a digital platform that connects farmers directly with consumers.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#666', marginBottom: '20px' }}>
              We recognized that many small-scale farmers struggle to reach consumers due to 
              intermediaries taking large cuts of their profits. At the same time, consumers 
              wanted fresher products and more transparency about where their food comes from.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#666' }}>
              Today, AgriConnect serves as a transparent marketplace where farmers can showcase 
              their products, consumers can browse and purchase directly, and payments are 
              processed securely through MTN Mobile Money. We're proud to support local agriculture 
              and build a sustainable future for farming in Cameroon.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
