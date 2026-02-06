import React from 'react';
import { MapPin, Star, Package, Heart, MessageCircle, CheckCircle } from 'lucide-react';

const FarmerProfileHero = ({ farmer, onFollow, onContact, isFollowing = false }) => {
  // Use banner_url if available, fallback to coverImage
  const bannerImage = farmer.bannerUrl || farmer.banner_url || farmer.coverImage || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=400&fit=crop';
  // Use avatar_url if available, fallback to profileImage
  const profileImage = farmer.avatarUrl || farmer.avatar_url || farmer.profileImage || 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=200&h=200&fit=crop';

  return (
    <div 
      style={{ 
        position: 'relative', 
        height: '400px', 
        background: `url(${bannerImage})`, 
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
            src={profileImage} 
            alt={farmer.name} 
            style={{ 
              width: '160px', 
              height: '160px', 
              borderRadius: '50%', 
              border: '4px solid white', 
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              objectFit: 'cover'
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
                color: 'rgba(255,255,255,0.9)',
                flexWrap: 'wrap'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} /> {farmer.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={16} fill="white" /> {farmer.rating} ({farmer.totalReviews} reviews)
              </span>
              {farmer.yearsExperience && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🌱 {farmer.yearsExperience}+ years
                </span>
              )}
              {farmer.totalProducts > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Package size={16} /> {farmer.totalProducts} products
                </span>
              )}
            </div>

            {/* Certifications */}
            {farmer.certifications && farmer.certifications.length > 0 && (
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  marginTop: '12px',
                  flexWrap: 'wrap'
                }}
              >
                {farmer.certifications.map((cert, i) => (
                  <span 
                    key={i}
                    style={{
                      padding: '4px 10px',
                      background: 'rgba(34, 197, 94, 0.3)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#bbf7d0',
                      border: '1px solid rgba(34, 197, 94, 0.4)'
                    }}
                  >
                    ✓ {cert}
                  </span>
                ))}
              </div>
            )}
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
