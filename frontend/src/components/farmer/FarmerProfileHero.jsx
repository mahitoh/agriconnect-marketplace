import React from 'react';
import { MapPin, Star, Package, Heart, MessageCircle, CheckCircle } from 'lucide-react';

const FarmerProfileHero = ({ farmer, onFollow, onContact, isFollowing = false }) => {
  const bannerImage = farmer.bannerUrl || farmer.banner_url || farmer.coverImage || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=400&fit=crop';
  const profileImage = farmer.avatarUrl || farmer.avatar_url || farmer.profileImage || 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=200&h=200&fit=crop';

  return (
    <div 
      className="relative min-h-[220px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[400px] w-full bg-cover bg-center bg-no-repeat flex flex-col justify-end"
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 lg:gap-8">
          {/* Profile Image */}
          <img 
            src={profileImage} 
            alt={farmer.name} 
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full border-2 sm:border-4 border-white shadow-lg object-cover shrink-0 self-start sm:self-end"
          />

          {/* Info */}
          <div className="flex-1 min-w-0 pb-1 sm:pb-2">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
              {farmer.badges?.map((badge, i) => (
                <span 
                  key={i} 
                  className="inline-flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold border border-white/30"
                >
                  <CheckCircle size={12} className="shrink-0" /> {badge}
                </span>
              ))}
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-1 truncate min-w-0">
              {farmer.name}
            </h1>

            <p className="text-sm sm:text-base md:text-lg font-semibold text-white/95 mb-2 truncate min-w-0">
              {farmer.farmName}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-base text-white/90 mb-2 sm:mb-3">
              <span className="flex items-center gap-1.5 shrink-0">
                <MapPin size={14} className="sm:w-4 sm:h-4 shrink-0" /> {farmer.location}
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                <Star size={14} className="sm:w-4 sm:h-4 fill-white shrink-0" /> {farmer.rating} ({farmer.totalReviews} reviews)
              </span>
              {farmer.yearsExperience && (
                <span className="flex items-center gap-1.5 shrink-0">
                  <span aria-hidden>🌱</span> {farmer.yearsExperience}+ years
                </span>
              )}
              {farmer.totalProducts > 0 && (
                <span className="flex items-center gap-1.5 shrink-0">
                  <Package size={14} className="sm:w-4 sm:h-4 shrink-0" /> {farmer.totalProducts} products
                </span>
              )}
            </div>

            {/* Certifications */}
            {farmer.certifications && farmer.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {farmer.certifications.map((cert, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-emerald-500/30 text-emerald-100 text-[10px] sm:text-xs font-semibold border border-emerald-400/40"
                  >
                    ✓ {cert}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3 shrink-0 pb-1 sm:pb-2">
            <button 
              onClick={onFollow}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-bold shadow-md transition-all min-h-[44px] touch-manipulation ${
                isFollowing 
                  ? 'bg-[var(--primary-600)] text-white' 
                  : 'bg-white text-[var(--primary-600)] hover:bg-white/95'
              }`}
            >
              <Heart size={18} className="shrink-0" fill={isFollowing ? 'currentColor' : 'none'} />
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <button 
              onClick={onContact}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-bold bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all min-h-[44px] touch-manipulation"
            >
              <MessageCircle size={18} className="shrink-0" /> Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfileHero;
