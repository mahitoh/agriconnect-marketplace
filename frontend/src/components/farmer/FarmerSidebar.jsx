import React from 'react';
import { Award, Sprout, Clock, CheckCircle, ShieldCheck } from 'lucide-react';

const FarmerSidebar = ({ farmer }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Stats Card */}
      <div 
        style={{ 
          background: 'white', 
          borderRadius: '16px', 
          padding: '1.5rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem' }}>
          Farmer Stats
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Experience */}
          <div>
            <div 
              style={{ 
                fontSize: '13px', 
                color: '#6b7280', 
                marginBottom: '4px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px' 
              }}
            >
              <Award size={14} /> Experience
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700' }}>
              {farmer.yearsExperience} years
            </div>
          </div>
          
          <div style={{ height: '1px', background: '#f3f4f6' }} />
          
          {/* Products */}
          <div>
            <div 
              style={{ 
                fontSize: '13px', 
                color: '#6b7280', 
                marginBottom: '4px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px' 
              }}
            >
              <Sprout size={14} /> Products
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700' }}>
              {farmer.totalProducts}
            </div>
          </div>
          
          <div style={{ height: '1px', background: '#f3f4f6' }} />
          
          {/* Response Time */}
          <div>
            <div 
              style={{ 
                fontSize: '13px', 
                color: '#6b7280', 
                marginBottom: '4px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px' 
              }}
            >
              <Clock size={14} /> Response Time
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#059669' }}>
              {farmer.responseTime}
            </div>
          </div>
          
          <div style={{ height: '1px', background: '#f3f4f6' }} />
          
          {/* Member Since */}
          <div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
              Member Since
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>
              {farmer.memberSince}
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div 
        style={{ 
          background: 'white', 
          borderRadius: '16px', 
          padding: '1.5rem', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem' }}>
          Certifications
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {farmer.certifications.map((cert, i) => (
            <div 
              key={i} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '13px', 
                color: '#059669' 
              }}
            >
              <CheckCircle size={14} />
              <span>{cert}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badge */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #2d5f3f, #3d7f5f)', 
          borderRadius: '16px', 
          padding: '1.5rem', 
          color: 'white', 
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <ShieldCheck size={32} style={{ marginBottom: '8px' }} />
        <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>
          Verified Farmer
        </div>
        <div style={{ fontSize: '12px', opacity: 0.9 }}>
          Identity & farm verified by AgriConnect
        </div>
      </div>
    </div>
  );
};

export default FarmerSidebar;
