import React from 'react';
import { MapPin, Star, Package, Heart, MessageCircle, CheckCircle } from 'lucide-react';

const FarmerProfileHero = ({ farmer, onFollow, onContact, isFollowing = false }) => {
  return (
    <div 
      style={{ 
        position: 'relative', 
        height: '400px', 
        background: `url(${farmer.coverImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      {/* Overlay */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))' 
        }}
      />
      
      {/* Content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem' }}>
        <div 
          style={{ 
            maxWidth: '1400px', 
            margin: '0 auto', 
            display: 'flex', 
            alignItems: 'flex-end', 
            gap: '2rem' 
          }}
        >
          {/* Profile Image */}
          <img 
            src={farmer.profileImage} 
            alt={farmer.name} 
            style={{ 
              width: '160px', 
              height: '160px', 
              borderRadius: '20px', 
              border: '4px solid white', 
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)' 
            }} 
          />
          
          {/* Info */}
          <div style={{ flex: 1, paddingBottom: '1rem' }}>
            {/* Badges */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {farmer.badges.map((badge, i) => (
                <span 
                  key={i} 
                  style={{ 
                    padding: '6px 12px', 
                    background: 'rgba(255,255,255,0.2)', 
                    backdropFilter: 'blur(10px)', 
                    borderRadius: '12px', 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: 'white', 
                    border: '1px solid rgba(255,255,255,0.3)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px' 
                  }}
                >
                  <CheckCircle size={12} /> {badge}
                </span>
              ))}
            </div>
            
            {/* Name */}
            <h1 
              style={{ 
                fontSize: '36px', 
                fontWeight: '800', 
                color: 'white', 
                margin: '0 0 8px 0' 
              }}
            >
              {farmer.name}
            </h1>
            
            {/* Farm Name */}
            <div 
              style={{ 
                fontSize: '20px', 
                color: 'rgba(255,255,255,0.95)', 
                marginBottom: '8px', 
                fontWeight: '600' 
              }}
            >
              {farmer.farmName}
            </div>
            
            {/* Stats */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.5rem', 
                fontSize: '15px', 
                color: 'rgba(255,255,255,0.9)' 
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} /> {farmer.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={16} fill="white" /> {farmer.rating} ({farmer.totalReviews} reviews)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Package size={16} /> {farmer.totalOrders} orders
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', paddingBottom: '1rem' }}>
            <button 
              onClick={onFollow}
              style={{ 
                padding: '12px 24px', 
                background: isFollowing ? '#2d5f3f' : 'white', 
                color: isFollowing ? 'white' : '#2d5f3f', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: '15px', 
                fontWeight: '700', 
                cursor: 'pointer', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                transition: 'all 0.3s'
              }}
            >
              <Heart size={18} fill={isFollowing ? 'white' : 'none'} /> 
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <button 
              onClick={onContact}
              style={{ 
                padding: '12px 24px', 
                background: 'rgba(255,255,255,0.2)', 
                backdropFilter: 'blur(10px)', 
                color: 'white', 
                border: '1px solid rgba(255,255,255,0.3)', 
                borderRadius: '12px', 
                fontSize: '15px', 
                fontWeight: '700', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}
            >
              <MessageCircle size={18} /> Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfileHero;
