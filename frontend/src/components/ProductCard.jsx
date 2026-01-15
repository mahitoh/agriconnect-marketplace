import React from 'react';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        <span className="product-badge" style={{ background: product.badgeColor }}>
          {product.badge}
        </span>
      </div>
      <div className="product-info">
        <div className="product-rating">
          <FaStar style={{ color: '#fbbf24' }} /> {product.rating}{' '}
          <span>({product.reviews})</span>
        </div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-farmer">{product.farmer}</p>
        <p className="product-location">
          <FaMapMarkerAlt style={{ marginRight: 6, fontSize: 12 }} />
          {product.location}
        </p>
        <div className="product-footer">
          <div>
            <span className="product-price">{product.price}</span>
            {product.oldPrice && (
              <span className="price-old">{product.oldPrice}</span>
            )}
          </div>
          <button className="btn-add" type="button">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
