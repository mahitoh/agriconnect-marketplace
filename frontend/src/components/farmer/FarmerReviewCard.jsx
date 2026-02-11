import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

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
          {review.avatar || review.author?.charAt(0) || '?'}
        </div>
        
        {/* Content */}
        <div style={{ flex: 1 }}>
          {/* Header */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '6px',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: '700' }}>
                {review.author}
              </span>
              {review.verified_purchase && (
                <span 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    fontSize: '11px', 
                    fontWeight: '600',
                    color: '#059669',
                    background: '#d1fae5',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}
                >
                  <CheckCircle size={10} /> Verified Purchase
                </span>
              )}
              {review.reviewer_role === 'farmer' && (
                <span 
                  style={{ 
                    fontSize: '11px', 
                    fontWeight: '600',
                    color: '#2d5f3f',
                    background: '#dcfce7',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}
                >
                  Farmer
                </span>
              )}
            </div>
            <div style={{ fontSize: '13px', color: '#9ca3af' }}>
              {review.date}
            </div>
          </div>
          
          {/* Product Name if available */}
          {review.productName && (
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
              Reviewed: <span style={{ fontWeight: '500' }}>{review.productName}</span>
            </div>
          )}
          
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
