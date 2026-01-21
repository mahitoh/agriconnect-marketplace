import React from 'react';
import { Star } from 'lucide-react';

const RatingSummary = ({ rating, totalReviews, distribution }) => {
  return (
    <div 
      style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '2rem', 
        marginBottom: '1.5rem', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
      }}
    >
      <div 
        style={{ 
          display: 'grid',
          gridTemplateColumns: '200px 1fr', 
          gap: '2rem' 
        }}
      >
        {/* Overall Rating */}
        <div style={{ textAlign: 'center' }}>
          <div 
            style={{ 
              fontSize: '64px', 
              fontWeight: '800', 
              color: '#2d5f3f', 
              marginBottom: '8px' 
            }}
          >
            {rating}
          </div>
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '4px', 
              marginBottom: '8px' 
            }}
          >
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={20} fill="#f59e0b" color="#f59e0b" />
            ))}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            {totalReviews} reviews
          </div>
        </div>
        
        {/* Rating Distribution */}
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px', 
            justifyContent: 'center' 
          }}
        >
          {distribution.map(({ stars, percentage }) => (
            <div 
              key={stars} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px' 
              }}
            >
              <span 
                style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  width: '60px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}
              >
                {stars} <Star size={12} fill="#6b7280" color="#6b7280" />
              </span>
              <div 
                style={{ 
                  flex: 1, 
                  height: '8px', 
                  background: '#f3f4f6', 
                  borderRadius: '4px', 
                  overflow: 'hidden' 
                }}
              >
                <div 
                  style={{ 
                    width: `${percentage}%`, 
                    height: '100%', 
                    background: '#f59e0b' 
                  }} 
                />
              </div>
              <span 
                style={{ 
                  fontSize: '13px', 
                  color: '#6b7280', 
                  width: '40px' 
                }}
              >
                {percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;
