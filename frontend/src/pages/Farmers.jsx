import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaStar, FaFilter, FaTimes, FaChevronRight } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FarmerCard from '../components/FarmerCard';
import { FarmerGridSkeleton } from '../components/ui/skeleton';
import { useFarmers } from '../hooks/useQueries';

const Farmers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data: rawFarmers = [], isLoading: loading, error: queryError } = useFarmers();

  const farmers = useMemo(() => {
    if (!rawFarmers || rawFarmers.length === 0) return [];
    return rawFarmers.map(farmer => {
      const rating = farmer.rating?.average_rating || 0;
      const reviews = farmer.rating?.total_reviews || 0;
      const badges = farmer.certifications && farmer.certifications.length > 0
        ? farmer.certifications.slice(0, 3)
        : (farmer.approved ? ['Verified'] : ['Farmer']);
      const yearsText = farmer.years_experience
        ? `${farmer.years_experience}+ years`
        : 'Active';
      return {
        id: farmer.id,
        name: farmer.full_name || 'Farmer',
        farm: farmer.farm_name || farmer.farm_details || 'Farm',
        location: farmer.location || 'Location not specified',
        bio: farmer.bio || 'Growing fresh, quality products.',
        rating: rating.toFixed(1),
        reviews: reviews.toString(),
        badges,
        years: yearsText,
        products: `${farmer.productCount || 0} products`,
        image: farmer.avatar_url || 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=400&h=400&fit=crop',
        btnStyle: 'primary'
      };
    });
  }, [rawFarmers]);

  const error = queryError
    ? `Unable to load farmers: ${queryError.message}`
    : (rawFarmers.length === 0 && !loading ? 'No farmers found in the marketplace.' : null);

  const locations = [...new Set(farmers.map(f => f.location).filter(Boolean))];

  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = !searchQuery.trim() ||
      farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (farmer.farm && farmer.farm.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(farmer.location);
    const matchesRating = parseFloat(farmer.rating) >= minRating;
    return matchesSearch && matchesLocation && matchesRating;
  });

  const sortedFarmers = [...filteredFarmers].sort((a, b) =>
    parseFloat(b.rating) - parseFloat(a.rating)
  );

  const toggleLocation = (location) => {
    setSelectedLocations(prev =>
      prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
    );
  };

  const clearFilters = () => {
    setSelectedLocations([]);
    setMinRating(0);
    setSearchQuery('');
    setMobileFiltersOpen(false);
  };

  const hasActiveFilters = selectedLocations.length > 0 || minRating > 0;

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
        <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide mb-2 flex items-center gap-2">
          <FaMapMarkerAlt size={12} />
          Location
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
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

      <div>
        <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide mb-2 flex items-center gap-2">
          <FaStar size={12} className="text-amber-500" />
          Minimum Rating
        </h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map(rating => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="minRating"
                checked={minRating === rating}
                onChange={() => setMinRating(minRating === rating ? 0 : rating)}
                className="w-4 h-4 border-[var(--border-color)] text-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)]"
              />
              <span className="text-sm text-[var(--text-primary)] group-hover:text-[var(--primary-600)]">
                {rating}+ stars
              </span>
            </label>
          ))}
        </div>
      </div>
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
                <Link to="/" className="hover:text-[var(--primary-600)] underline">Home</Link>
              </li>
              <li className="flex items-center gap-1.5">
                <FaChevronRight className="text-[10px] text-[var(--text-tertiary)]" />
                <span className="text-[var(--text-primary)] font-medium">Farmers</span>
              </li>
            </ol>
          </nav>

          {/* Header - compact and professional */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-1">
              Meet Our Farmers
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-xl">
              Connect directly with verified producers. Transparency starts with knowing who grows your food.
            </p>
          </div>

          {/* Search bar */}
          <div className="mb-6 w-full">
            <div className="relative w-full max-w-xl">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] text-sm" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or farm"
                className="w-full pl-9 pr-9 py-2.5 rounded border border-[var(--border-color)] bg-white text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)] outline-none text-sm"
                aria-label="Search farmers"
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

            {/* Content */}
            <div className="flex-1 min-w-0 w-full">
              {/* Results bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2 mb-4">
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  {sortedFarmers.length === 0 && !loading
                    ? 'No farmers found'
                    : `${sortedFarmers.length} farmer${sortedFarmers.length !== 1 ? 's' : ''}`}
                </p>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-[var(--border-color)] bg-white text-sm font-medium text-[var(--text-primary)] min-h-[44px] touch-manipulation"
                >
                  <FaFilter className="text-xs" />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-[var(--primary-500)]" />
                  )}
                </button>
              </div>

              {/* Active filter chips */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-4">
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
                  {minRating > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--primary-50)] text-[var(--primary-700)] text-xs font-medium">
                      {minRating}+ stars
                      <button type="button" onClick={() => setMinRating(0)} className="hover:opacity-70" aria-label="Clear rating filter">
                        <FaTimes className="text-[10px]" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Farmers grid */}
              {loading ? (
                <div className="py-4">
                  <FarmerGridSkeleton count={6} />
                </div>
              ) : error ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-amber-800 text-sm">{error}</p>
                </div>
              ) : sortedFarmers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {sortedFarmers.map((farmer) => (
                    <motion.div
                      key={farmer.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FarmerCard farmer={farmer} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-[var(--border-light)] p-6 sm:p-12 text-center">
                  <p className="text-5xl mb-4" aria-hidden="true">🌾</p>
                  <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">No farmers match your search</h2>
                  <p className="text-sm text-[var(--text-secondary)] mb-6">
                    Try adjusting filters or search terms.
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

export default Farmers;
