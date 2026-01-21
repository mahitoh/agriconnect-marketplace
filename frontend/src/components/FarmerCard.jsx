import React from 'react';
import { Link } from 'react-router-dom';
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
        <Link
          to={`/farmers/${farmer.id}`}
          className={`btn btn-${farmer.btnStyle} btn-view-profile`}
          style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default FarmerCard;
