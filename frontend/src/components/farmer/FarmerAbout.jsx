import React from 'react';
import { Leaf, Recycle, Users } from 'lucide-react';

const FarmerAbout = ({ farmer }) => {
  const highlights = [
    { 
      icon: Leaf, 
      title: '100% Organic', 
      description: 'No pesticides or chemicals' 
    },
    { 
      icon: Recycle, 
      title: 'Sustainable', 
      description: 'Regenerative farming' 
    },
    { 
      icon: Users, 
      title: 'Community', 
      description: 'Supporting local economy' 
    }
  ];

  return (
    <div 
      style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '2rem', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
      }}
    >
      {/* Title */}
      <h2 
        style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          marginBottom: '1.5rem' 
        }}
      >
        About {farmer.name}
      </h2>
      
      {/* Bio */}
      <div 
        style={{ 
          fontSize: '16px', 
          lineHeight: '1.8', 
          color: '#374151', 
          marginBottom: '2rem' 
        }}
      >
        {farmer.bio}
      </div>

      <div style={{ height: '1px', background: '#f3f4f6', margin: '2rem 0' }} />

      {/* Philosophy */}
      <h3 
        style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          marginBottom: '1rem' 
        }}
      >
        Our Philosophy
      </h3>
      <div 
        style={{ 
          fontSize: '15px', 
          lineHeight: '1.8', 
          color: '#374151', 
          background: '#f9fafb', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          borderLeft: '4px solid #2d5f3f' 
        }}
      >
        {farmer.philosophy}
      </div>

      {/* Highlights Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1.5rem', 
          marginTop: '2rem' 
        }}
      >
        {highlights.map(({ icon: Icon, title, description }) => (
          <div 
            key={title}
            style={{ 
              textAlign: 'center', 
              padding: '1.5rem', 
              background: '#f9fafb', 
              borderRadius: '12px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}
          >
            <Icon size={32} color="#2d5f3f" style={{ marginBottom: '8px' }} />
            <div 
              style={{ 
                fontSize: '14px', 
                fontWeight: '700', 
                marginBottom: '4px' 
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              {description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmerAbout;
