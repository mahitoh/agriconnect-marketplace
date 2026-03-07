import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaBox, FaCheckCircle, FaUserPlus, FaUserCheck } from 'react-icons/fa';

const FarmerCard = ({ farmer }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const toggleFollow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="group bg-white rounded-lg sm:rounded-xl border border-[var(--border-light)] overflow-hidden shadow-sm hover:shadow-md sm:hover:shadow-lg hover:border-[var(--primary-200)] transition-all duration-200 h-full flex flex-col min-w-0">
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-[#f8f9fa] shrink-0">
        <img
          src={farmer.image}
          alt={farmer.name}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />

        {/* Badges row */}
        <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:py-1 rounded-md bg-white/95 shadow-sm">
            <FaCheckCircle className="text-[var(--success)] shrink-0" size={10} />
            <span className="text-[10px] sm:text-xs font-semibold text-[var(--text-primary)]">Verified</span>
          </div>
          <button
            type="button"
            onClick={toggleFollow}
            className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition-colors min-h-[36px] sm:min-h-0 touch-manipulation ${
              isFollowing
                ? 'bg-white/95 text-[var(--primary-600)] border border-[var(--primary-200)]'
                : 'bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)]'
            }`}
          >
            {isFollowing ? (
              <span className="flex items-center gap-1.5"><FaUserCheck size={10} /> Following</span>
            ) : (
              <span className="flex items-center gap-1.5"><FaUserPlus size={10} /> Follow</span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 lg:p-6 flex-1 flex flex-col min-h-0 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
          <span className="flex items-center gap-0.5 text-amber-500 shrink-0">
            <FaStar size={12} className="fill-current shrink-0" />
          </span>
          <span className="text-sm sm:text-base font-semibold text-[var(--text-primary)]">{farmer.rating}</span>
          <span className="text-xs sm:text-sm text-[var(--text-tertiary)]">({farmer.reviews})</span>
        </div>

        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[var(--text-primary)] mb-0.5 sm:mb-1 group-hover:text-[var(--primary-600)] transition-colors line-clamp-1 min-w-0">
          {farmer.name}
        </h3>
        <p className="text-sm sm:text-base font-medium text-[var(--primary-600)] mb-1 sm:mb-2 truncate min-w-0">{farmer.farm}</p>

        <p className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-[var(--text-tertiary)] mb-2 sm:mb-3 truncate min-w-0">
          <FaMapMarkerAlt size={10} className="shrink-0" />
          <span className="truncate">{farmer.location}</span>
        </p>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-2 sm:mb-3 min-w-0">
          {farmer.bio}
        </p>

        {/* Badges - compact */}
        {farmer.badges && farmer.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {farmer.badges.slice(0, 3).map((badge) => (
              <span
                key={badge}
                className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--primary-50)] text-[var(--primary-700)]"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] mb-4">
          <span className="font-medium">{farmer.years}</span>
          <span className="flex items-center gap-1">
            <FaBox size={11} className="text-[var(--primary-500)]" />
            {farmer.products}
          </span>
        </div>

        {/* CTA */}
        <Link to={`/farmers/${farmer.id}`} className="mt-auto block">
          <span className="block w-full py-2.5 sm:py-3 rounded-lg text-center text-xs sm:text-sm font-semibold bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)] active:scale-[0.98] transition-all min-h-[44px] flex items-center justify-center touch-manipulation">
            View Profile →
          </span>
        </Link>
      </div>
    </div>
  );
};

export default FarmerCard;
