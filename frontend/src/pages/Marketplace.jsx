import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaSearch, FaTimes, FaChevronRight } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ui/skeleton';
import { products as mockProducts } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useQueries';

const Marketplace = () => {
  const { addToCart } = useCart();
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data: rawProducts = [], isLoading: loading, error: queryError } = useProducts();

  const products = useMemo(() => {
    if (!rawProducts || rawProducts.length === 0) return queryError ? mockProducts : [];
    return rawProducts.map(product => {
      const farmerProfile = product.profiles || (Array.isArray(product.profiles) ? product.profiles[0] : null);
      const farmerName = farmerProfile?.full_name || product.farmer_name || 'Farmer';
      const farmerLocation = farmerProfile?.location || product.harvest_location || product.location || 'Location not specified';

      const badgeMap = {
        'vegetables': 'Fresh',
        'fruits': 'Popular',
        'grains': 'Bio',
        'livestock': 'Fresh',
        'dairy': 'Fresh',
        'other': 'New'
      };
      const badge = badgeMap[product.category] || 'New';
      const badgeColors = {
        'Fresh': '#ef5350',
        'Popular': '#2d5f3f',
        'Bio': '#66bb6a',
        'New': '#2196f3'
      };

      return {
        id: product.id,
        name: product.name,
        image: product.image_url || 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&h=350&fit=crop',
        badge,
        badgeColor: badgeColors[badge] || '#2d5f3f',
        rating: product.rating || '0.0',
        reviews: product.reviews?.toString() || '0',
        farmer: farmerName,
        location: farmerLocation,
        price: `${product.price.toLocaleString()} FCFA`,
        oldPrice: null,
        category: product.category,
        quantity: product.quantity,
        description: product.description
      };
    });
  }, [rawProducts, queryError]);

  const error = queryError ? 'Failed to load products. Showing sample products.' : null;

  const handleAddToCart = (product) => {
    const priceValue = typeof product.price === 'string'
      ? parseInt(product.price.replace(/[^\d]/g, ''))
      : product.price;

    const cartProduct = {
      id: product.id,
      name: product.name,
      price: priceValue,
      image: product.image,
      category: product.category || product.badge,
      farmer: product.farmer,
      location: product.location
    };
    addToCart(cartProduct);
  };

  const categories = [...new Set(products.map(p => p.category || p.badge).filter(Boolean))];
  const locations = [...new Set(products.map(p => p.location).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery.trim() ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.farmer && product.farmer.toLowerCase().includes(searchQuery.toLowerCase()));
    const productCategory = product.category || product.badge;
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(productCategory);
    const priceValue = typeof product.price === 'string'
      ? parseInt(product.price.replace(/[^\d]/g, ''))
      : product.price;
    const matchesPrice = priceValue >= priceRange[0] && priceValue <= priceRange[1];
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(product.location);

    return matchesSearch && matchesCategory && matchesPrice && matchesLocation;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const getPrice = (product) =>
      typeof product.price === 'string'
        ? parseInt(product.price.replace(/[^\d]/g, ''))
        : product.price;

    switch (sortBy) {
      case 'price-low':
        return getPrice(a) - getPrice(b);
      case 'price-high':
        return getPrice(b) - getPrice(a);
      case 'rating':
        return parseFloat(b.rating) - parseFloat(a.rating);
      default:
        return 0;
    }
  });

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleLocation = (location) => {
    setSelectedLocations(prev =>
      prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setPriceRange([0, 100000]);
    setSearchQuery('');
    setMobileFiltersOpen(false);
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedLocations.length > 0 || priceRange[1] < 100000;

  const FiltersSidebar = () => (
    <div className="bg-white border border-[var(--border-light)] rounded-lg p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wide">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-[var(--primary-600)] hover:underline font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div>
        <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide mb-2">Department</h4>
        <div className="space-y-1.5">
          {categories.map(category => (
            <label key={category} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)]"
              />
              <span className="text-sm text-[var(--text-primary)] group-hover:text-[var(--primary-600)] capitalize">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide mb-2">Price</h4>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100000"
            step="5000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-full h-1.5 accent-[var(--primary-500)]"
          />
          <p className="text-xs text-[var(--text-secondary)]">
            Up to <span className="font-semibold text-[var(--text-primary)]">{priceRange[1].toLocaleString()} FCFA</span>
          </p>
        </div>
      </div>

      {locations.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide mb-2">Location</h4>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {locations.map(location => (
              <label key={location} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(location)}
                  onChange={() => toggleLocation(location)}
                  className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)]"
                />
                <span className="text-sm text-[var(--text-primary)] group-hover:text-[var(--primary-600)] truncate">
                  {location}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#eaeded]">
      <Navbar />

      <div className="pt-20 pb-12 overflow-x-hidden">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="py-3 text-sm text-[var(--text-secondary)]" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li>
                <Link to="/" className="hover:text-[var(--primary-600)] underline">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <FaChevronRight className="text-[10px] text-[var(--text-tertiary)]" />
                <span className="text-[var(--text-primary)] font-medium">Marketplace</span>
              </li>
            </ol>
          </nav>

          {/* Search bar */}
          <div className="mb-4 w-full">
            <div className="relative w-full max-w-2xl">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] text-sm" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products or farmers"
                className="w-full pl-9 pr-9 py-2.5 rounded border border-[var(--border-color)] bg-white text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)] outline-none text-sm"
                aria-label="Search marketplace"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] p-0.5"
                  aria-label="Clear search"
                >
                  <FaTimes className="text-sm" />
                </button>
              )}
            </div>
          </div>

          {/* Main: sidebar + content */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Left sidebar - desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FiltersSidebar />
              </div>
            </aside>

            {/* Products area */}
            <div className="flex-1 min-w-0 w-full">
              <div className="lg:hidden flex items-center gap-2 mb-3">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-[var(--border-color)] bg-white text-sm font-medium text-[var(--text-primary)] min-h-[44px] touch-manipulation"
                >
                  <FaFilter className="text-xs" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-1 w-2 h-2 rounded-full bg-[var(--primary-500)]" />
                  )}
                </button>
              </div>

              {/* Results bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2 mb-2">
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  {sortedProducts.length === 0 && !loading
                    ? 'No products found'
                    : `${sortedProducts.length} result${sortedProducts.length !== 1 ? 's' : ''}`}
                </p>
                <div className="flex items-center gap-2 min-w-0">
                  <label htmlFor="sort-marketplace" className="text-xs sm:text-sm text-[var(--text-secondary)] shrink-0">
                    Sort:
                  </label>
                  <select
                    id="sort-marketplace"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 min-w-0 max-w-[180px] py-2 sm:py-1.5 pl-2 pr-8 rounded border border-[var(--border-color)] bg-white text-sm text-[var(--text-primary)] focus:border-[var(--primary-500)] outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              {/* Active filter chips */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedCategories.map(cat => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--primary-50)] text-[var(--primary-700)] text-xs font-medium"
                    >
                      {cat}
                      <button type="button" onClick={() => toggleCategory(cat)} className="hover:opacity-70" aria-label={`Remove ${cat}`}>
                        <FaTimes className="text-[10px]" />
                      </button>
                    </span>
                  ))}
                  {selectedLocations.map(loc => (
                    <span
                      key={loc}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--primary-50)] text-[var(--primary-700)] text-xs font-medium"
                    >
                      {loc}
                      <button type="button" onClick={() => toggleLocation(loc)} className="hover:opacity-70" aria-label={`Remove ${loc}`}>
                        <FaTimes className="text-[10px]" />
                      </button>
                    </span>
                  ))}
                  {priceRange[1] < 100000 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--primary-50)] text-[var(--primary-700)] text-xs font-medium">
                      Under {priceRange[1].toLocaleString()} FCFA
                      <button type="button" onClick={() => setPriceRange([0, 100000])} className="hover:opacity-70" aria-label="Clear price filter">
                        <FaTimes className="text-[10px]" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Product grid */}
              {loading ? (
                <div className="py-4">
                  <ProductGridSkeleton count={8} compact />
                </div>
              ) : error ? (
                <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-4">
                  <p className="text-amber-800 text-sm">{error}</p>
                </div>
              ) : sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={() => handleAddToCart(product)}
                      variant="compact"
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-[var(--border-light)] p-6 sm:p-12 text-center">
                  <p className="text-6xl mb-4" aria-hidden="true">🔍</p>
                  <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">No products match your search</h2>
                  <p className="text-sm text-[var(--text-secondary)] mb-6">
                    Try changing filters or search terms.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-5 py-2.5 rounded bg-[var(--primary-500)] text-white text-sm font-medium hover:bg-[var(--primary-600)] transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filters panel */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed top-0 left-0 bottom-0 w-[min(320px,85vw)] max-w-full bg-white z-50 shadow-xl overflow-y-auto p-4"
              aria-label="Filters"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                  aria-label="Close filters"
                >
                  <FaTimes />
                </button>
              </div>
              <FiltersSidebar />
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="mt-6 w-full py-3 rounded bg-[var(--primary-500)] text-white font-medium hover:bg-[var(--primary-600)]"
              >
                Show results
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Marketplace;
