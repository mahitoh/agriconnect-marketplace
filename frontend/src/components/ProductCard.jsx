import React, { useState } from 'react';
import { FaStar, FaMapMarkerAlt, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);

  const { user } = useAuth();
  const { isProductLiked, toggleLikeProduct } = useFavorites();
  const navigate = useNavigate();
  
  // Check if product is liked using the context
  const isWishlisted = isProductLiked(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation if wrapped in Link
    e.stopPropagation();

    if (!user) {
      if (window.confirm("You must be logged in to add items to your cart. Would you like to login now?")) {
        navigate('/login');
      }
      return;
    }

    setIsAdding(true);
    await onAddToCart();
    setTimeout(() => setIsAdding(false), 1000);
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!user) {
      if (window.confirm("You must be logged in to add favorites. Would you like to login now?")) {
        navigate('/login');
      }
      return;
    }
    
    // Use the context to toggle like - pass the full product object
    toggleLikeProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category || product.badge
    });
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
          src={product.image}
          alt={product.name}
          className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badge */}
        <span
          className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg backdrop-blur-sm"
          style={{ background: product.badgeColor || 'var(--primary-500)' }}
        >
          {product.badge}
        </span>

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleWishlist}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all z-10 ${isWishlisted
            ? 'bg-[var(--error)] text-white'
            : 'bg-white/90 text-[var(--text-secondary)] hover:text-[var(--error)]'
            }`}
          type="button"
          aria-label="Add to wishlist"
        >
          <motion.div
            animate={{ scale: isWishlisted ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <FaHeart size={18} />
          </motion.div>
        </motion.button>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1 text-[var(--secondary-500)]">
            <FaStar size={14} />
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {product.rating}
            </span>
          </div>
          <span className="text-xs text-[var(--text-tertiary)]">
            ({product.reviews} reviews)
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--primary-500)] transition-colors">
          {product.name}
        </h3>

        {/* Farmer */}
        <p className="text-sm text-[var(--text-secondary)] mb-1">
          by <span className="font-semibold">{product.farmer}</span>
        </p>

        {/* Location */}
        <p className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] mb-4">
          <FaMapMarkerAlt size={12} />
          {product.location}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-[var(--border-light)] flex items-center justify-between">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-[var(--primary-600)]">
              {product.price}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-[var(--text-tertiary)] line-through">
                {product.oldPrice}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all shadow-md hover:shadow-lg ${isAdding
              ? 'bg-[var(--success)] text-white'
              : 'bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white hover:from-[var(--primary-600)] hover:to-[var(--primary-700)]'
              }`}
            type="button"
          >
            {isAdding ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                >
                  ✓
                </motion.div>
                Added
              </>
            ) : (
              <>
                <FaShoppingCart size={16} />
                Add
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
