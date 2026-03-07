import React, { useState } from 'react';
import { FaStar, FaMapMarkerAlt, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, variant = 'default' }) => {
  const [isAdding, setIsAdding] = useState(false);

  const { user } = useAuth();
  const { isProductLiked, toggleLikeProduct } = useFavorites();
  const navigate = useNavigate();

  const isWishlisted = isProductLiked(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      if (window.confirm('You must be logged in to add items to your cart. Would you like to login now?')) {
        navigate('/login');
      }
      return;
    }

    setIsAdding(true);
    await onAddToCart();
    setTimeout(() => setIsAdding(false), 800);
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      if (window.confirm('You must be logged in to save favorites. Would you like to login now?')) {
        navigate('/login');
      }
      return;
    }

    toggleLikeProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category || product.badge
    });
  };

  const isCompact = variant === 'compact';

  if (isCompact) {
    return (
      <div className="group bg-white rounded-lg sm:rounded-xl border border-[var(--border-light)] overflow-hidden hover:border-[var(--primary-200)] hover:shadow-md sm:hover:shadow-lg transition-all duration-200 flex flex-col h-full min-w-0">
        {/* Image */}
        <div className="relative aspect-[4/3] sm:aspect-[4/3] bg-[#f3f3f3] flex items-center justify-center overflow-hidden shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-2 sm:p-4 group-hover:scale-[1.03] transition-transform duration-200"
          />
          {product.badge && (
            <span
              className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-xs font-semibold text-white"
              style={{ background: product.badgeColor || 'var(--primary-500)' }}
            >
              {product.badge}
            </span>
          )}
          <button
            type="button"
            onClick={toggleWishlist}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-white/95 shadow-sm flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--error)] active:scale-95 transition-all z-10 touch-manipulation"
            aria-label="Save for later"
          >
            <FaHeart size={14} className={isWishlisted ? 'fill-current text-[var(--error)]' : ''} />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col min-h-0 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <span className="flex items-center gap-0.5 text-amber-500 shrink-0">
              <FaStar size={10} className="sm:w-3 sm:h-3 fill-current" />
            </span>
            <span className="text-xs sm:text-sm text-[var(--text-secondary)] truncate">
              {product.rating} ({product.reviews})
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] line-clamp-2 mb-1 group-hover:text-[var(--primary-600)] transition-colors leading-snug min-w-0">
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-[var(--text-tertiary)] mb-2 sm:mb-3 line-clamp-1 flex items-center gap-1 sm:gap-1.5 min-w-0 truncate">
            <FaMapMarkerAlt size={10} className="shrink-0 sm:w-3 sm:h-3" />
            <span className="truncate">{product.location}</span>
          </p>

          <div className="mt-auto pt-2 sm:pt-3 border-t border-[var(--border-light)]">
            <p className="text-base sm:text-lg lg:text-xl font-bold text-[var(--primary-600)] mb-1.5 sm:mb-2 truncate">
              {product.price}
            </p>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full py-2.5 sm:py-3 rounded-lg bg-[var(--primary-500)] hover:bg-[var(--primary-600)] active:scale-[0.98] text-white text-xs sm:text-sm font-medium transition-all disabled:opacity-70 flex items-center justify-center gap-1.5 sm:gap-2 min-h-[44px] touch-manipulation"
            >
              {isAdding ? (
                <>Added</>
              ) : (
                <>
                  <FaShoppingCart size={14} />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* Default (larger) card - e.g. for Home */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-[var(--border-light)] hover:border-[var(--primary-200)] h-full flex flex-col"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {product.badge && (
          <span
            className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg"
            style={{ background: product.badgeColor || 'var(--primary-500)' }}
          >
            {product.badge}
          </span>
        )}

        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleWishlist}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-10 ${
            isWishlisted
              ? 'bg-[var(--error)] text-white'
              : 'bg-white/90 text-[var(--text-secondary)] hover:text-[var(--error)]'
          }`}
          aria-label="Add to wishlist"
        >
          <FaHeart size={18} className={isWishlisted ? 'fill-current' : ''} />
        </motion.button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1 text-amber-500">
            <FaStar size={14} className="fill-current" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">{product.rating}</span>
          </div>
          <span className="text-xs text-[var(--text-tertiary)]">({product.reviews} reviews)</span>
        </div>

        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--primary-500)] transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-[var(--text-secondary)] mb-1">
          by <span className="font-semibold">{product.farmer}</span>
        </p>

        <p className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] mb-4">
          <FaMapMarkerAlt size={12} />
          {product.location}
        </p>

        <div className="mt-auto pt-4 border-t border-[var(--border-light)] flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-[var(--primary-600)]">{product.price}</span>
            {product.oldPrice && (
              <span className="text-sm text-[var(--text-tertiary)] line-through ml-2">{product.oldPrice}</span>
            )}
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
              isAdding
                ? 'bg-[var(--success)] text-white'
                : 'bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)]'
            }`}
          >
            {isAdding ? 'Added' : <><FaShoppingCart size={16} /> Add</>}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
