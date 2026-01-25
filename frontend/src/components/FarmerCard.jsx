import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaClock, FaBox, FaCheckCircle, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FarmerCard = ({ farmer }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const toggleFollow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowing(!isFollowing);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-[var(--border-light)] hover:border-[var(--primary-200)] h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={farmer.image}
          alt={farmer.name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Verification Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg">
          <FaCheckCircle className="text-[var(--success)]" size={14} />
          <span className="text-xs font-bold text-[var(--text-primary)]">Verified</span>
        </div>

        {/* Follow Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleFollow}
          className={`absolute top-4 right-4 px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 shadow-lg backdrop-blur-sm transition-all ${isFollowing
              ? 'bg-white/90 text-[var(--primary-500)] border-2 border-[var(--primary-500)]'
              : 'bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white hover:from-[var(--primary-600)] hover:to-[var(--primary-700)]'
            }`}
          type="button"
        >
          {isFollowing ? (
            <>
              <FaUserCheck size={12} />
              Following
            </>
          ) : (
            <>
              <FaUserPlus size={12} />
              Follow
            </>
          )}
        </motion.button>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Farmer Info */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 text-[var(--secondary-500)]">
            <FaStar size={14} />
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {farmer.rating}
            </span>
          </div>
          <span className="text-xs text-[var(--text-tertiary)]">
            ({farmer.reviews} reviews)
          </span>
        </div>

        {/* Farmer Name */}
        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--primary-500)] transition-colors">
          {farmer.name}
        </h3>

        {/* Farm Name */}
        <p className="text-sm font-semibold text-[var(--primary-600)] mb-2">
          {farmer.farm}
        </p>

        {/* Location */}
        <p className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] mb-3">
          <FaMapMarkerAlt size={12} />
          {farmer.location}
        </p>

        {/* Bio */}
        <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2 leading-relaxed">
          {farmer.bio}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {farmer.badges.map((badge) => (
            <span
              key={badge}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[var(--primary-50)] to-[var(--accent-50)] text-[var(--primary-600)] border border-[var(--primary-200)]"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5">
            <FaClock size={14} className="text-[var(--primary-500)]" />
            <span className="font-medium">{farmer.years}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaBox size={14} className="text-[var(--primary-500)]" />
            <span className="font-medium">{farmer.products}</span>
          </div>
        </div>

        {/* View Profile Button */}
        <Link
          to={`/farmers/${farmer.id}`}
          className="mt-auto"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg ${farmer.btnStyle === 'primary'
                ? 'bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white hover:from-[var(--primary-600)] hover:to-[var(--primary-700)]'
                : 'bg-white text-[var(--primary-500)] border-2 border-[var(--primary-500)] hover:bg-[var(--primary-50)]'
              }`}
            type="button"
          >
            View Profile →
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default FarmerCard;
