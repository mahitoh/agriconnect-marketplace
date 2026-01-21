import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';

const FarmerProductCard = ({ product, onAddToCart }) => {
  return (
    <div 
      style={{ 
        background: 'white', 
        borderRadius: '16px', 
        overflow: 'hidden', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)', 
        transition: 'transform 0.3s, box-shadow 0.3s', 
        cursor: 'pointer' 
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative' }}>
        <img 
          src={product.image} 
          alt={product.name} 
          style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
        />
        {product.stock < 50 && (
          <span 
            style={{ 
              position: 'absolute', 
              top: '12px', 
              right: '12px', 
              padding: '4px 10px', 
              background: '#fef2f2', 
              color: '#dc2626', 
              borderRadius: '12px', 
              fontSize: '12px', 
              fontWeight: '600' 
            }}
          >
            Low Stock
          </span>
        )}
      </div>
      
      {/* Content */}
      <div style={{ padding: '1rem' }}>
        {/* Category */}
        <div 
          style={{ 
            fontSize: '11px', 
            color: '#6b7280', 
            marginBottom: '4px', 
            textTransform: 'uppercase', 
            fontWeight: '600' 
          }}
        >
          {product.category}
        </div>
        
        {/* Name */}
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>
          {product.name}
        </h3>
        
        {/* Rating */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            fontSize: '13px', 
            color: '#f59e0b', 
            marginBottom: '10px' 
          }}
        >
          <Star size={14} fill="#f59e0b" /> 
          {product.rating} 
          <span style={{ color: '#9ca3af' }}>({product.sales} sold)</span>
        </div>
        
        {/* Price & Add to Cart */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
        >
          <div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#2d5f3f' }}>
              {product.price.toLocaleString()} FCFA
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Stock: {product.stock}
            </div>
          </div>
          <button 
            onClick={() => onAddToCart?.(product)}
            style={{ 
              padding: '10px 16px', 
              background: '#2d5f3f', 
              color: 'white', 
              border: 'none', 
              borderRadius: '10px', 
              fontSize: '13px', 
              fontWeight: '700', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}
          >
            <ShoppingCart size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerProductCard;
