import React from 'react';
import { FaStar, FaMapMarkerAlt, FaClock, FaBox } from 'react-icons/fa';

const FarmerCard = ({ farmer }) => {
  return (
    <div className="farmer-card">
      <img src={farmer.image} alt={farmer.name} className="farmer-image" />
      <div className="farmer-info">
        <div className="farmer-rating">
          <FaStar style={{ color: '#fbbf24' }} /> {farmer.rating}{' '}
          <span>({farmer.reviews} reviews)</span>
        </div>
        <h3 className="farmer-name">{farmer.name}</h3>
        <p className="farmer-farm">{farmer.farm}</p>
        <p className="farmer-location">
          <FaMapMarkerAlt style={{ marginRight: 6, fontSize: 12 }} />
          {farmer.location}
        </p>
        <p className="farmer-bio">{farmer.bio}</p>
        <div className="farmer-badges">
          {farmer.badges.map((badge) => (
            <span key={badge} className="farmer-badge">
              {badge}
            </span>
          ))}
        </div>
        <div className="farmer-stats">
          <span>
            <FaClock style={{ marginRight: 6, fontSize: 12 }} />
            {farmer.years}
          </span>
          <span>
            <FaBox style={{ marginRight: 6, fontSize: 12 }} />
            {farmer.products}
          </span>
        </div>
        <button
          className={`btn btn-${farmer.btnStyle} btn-view-profile`}
          type="button"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default FarmerCard;
