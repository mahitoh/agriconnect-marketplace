import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';

const FarmerProductCard = ({ product, onAddToCart }) => {
  const stock = product.stock ?? product.quantity ?? 0;
  const price = typeof product.price === 'number' ? product.price : parseInt(String(product.price).replace(/\D/g, '')) || 0;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[var(--border-light)] hover:shadow-md transition-all duration-200 min-w-0">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f3f3f3]">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover" 
        />
        {stock > 0 && stock < 50 && (
          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-red-50 text-red-600 rounded-lg text-[10px] sm:text-xs font-semibold">
            Low Stock
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <div className="text-[10px] sm:text-xs text-[var(--text-tertiary)] uppercase font-semibold mb-1 truncate">
          {product.category}
        </div>

        <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] mb-2 line-clamp-2 min-w-0">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 sm:gap-2 text-amber-500 text-xs sm:text-sm mb-2 sm:mb-3">
          <Star size={14} className="fill-current shrink-0" />
          <span className="font-medium text-[var(--text-primary)]">{product.rating ?? '0.0'}</span>
          {product.sales != null && (
            <span className="text-[var(--text-tertiary)]">({product.sales} sold)</span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            <div className="text-base sm:text-lg lg:text-xl font-bold text-[var(--primary-600)]">
              {price.toLocaleString()} FCFA
            </div>
            <div className="text-[10px] sm:text-xs text-[var(--text-tertiary)]">
              Stock: {stock}
            </div>
          </div>
          <button 
            onClick={() => onAddToCart?.(product)}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-lg text-xs sm:text-sm font-bold transition-colors min-h-[44px] touch-manipulation shrink-0"
          >
            <ShoppingCart size={14} className="shrink-0" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerProductCard;
