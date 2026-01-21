import React from 'react';
import { Star } from 'lucide-react';

const FarmerReviewCard = ({ review }) => {
  return (
    <div 
      style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '1.5rem', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {/* Avatar */}
        <div 
          style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            background: '#2d5f3f', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: '700', 
            fontSize: '16px' 
          }}
        >
          {review.avatar}
        </div>
        
        {/* Content */}
        <div style={{ flex: 1 }}>
          {/* Header */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '6px' 
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: '700' }}>
              {review.author}
            </div>
            <div style={{ fontSize: '13px', color: '#9ca3af' }}>
              {review.date}
            </div>
          </div>
          
          {/* Stars */}
          <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
            ))}
            {[...Array(5 - review.rating)].map((_, i) => (
              <Star key={`empty-${i}`} size={14} color="#e5e7eb" />
            ))}
          </div>
          
          {/* Comment */}
          <div 
            style={{ 
              fontSize: '14px', 
              color: '#374151', 
              lineHeight: '1.6' 
            }}
          >
            {review.comment}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerReviewCard;
