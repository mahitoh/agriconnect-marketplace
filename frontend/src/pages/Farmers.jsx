import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaStar, FaFilter, FaTimes } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FarmerCard from '../components/FarmerCard';
import { FarmerGridSkeleton } from '../components/ui/skeleton';
import { useFarmers } from '../hooks/useQueries';

const Farmers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch farmers via React Query
  const { data: rawFarmers = [], isLoading: loading, error: queryError } = useFarmers();

  // Transform API farmers to match FarmerCard format
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
        image: farmer.avatar_url || 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=300&h=350&fit=crop',
        btnStyle: 'primary'
      };
    });
  }, [rawFarmers]);

  const error = queryError ? `Unable to load farmers: ${queryError.message}` : (rawFarmers.length === 0 && !loading ? 'No farmers found in the marketplace.' : null);

  // Extract unique locations
  const locations = [...new Set(farmers.map(f => f.location))];

  // Filter farmers
  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.farm.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(farmer.location);
    const matchesRating = parseFloat(farmer.rating) >= minRating;

    return matchesSearch && matchesLocation && matchesRating;
  });

  const toggleLocation = (location) => {
    setSelectedLocations(prev =>
      prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
    );
  };

  const clearFilters = () => {
    setSelectedLocations([]);
    setMinRating(0);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <Navbar />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] text-sm font-semibold mb-4">
              Our Producers
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
              Meet Our Farmers
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Connect directly with the dedicated people growing your food.
              Transparency starts with knowing who produced your meal.
            </p>
          </motion.div>

          {/* Search and Filters Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search farmers by name or farm..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[var(--border-color)] focus:border-[var(--primary-500)] outline-none transition-all"
                />
              </div>

              {/* Filter Toggles */}
              <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${showFilters
                      ? 'bg-[var(--primary-500)] text-white'
                      : 'bg-[var(--neutral-100)] text-[var(--text-primary)] hover:bg-[var(--neutral-200)]'
                    }`}
                >
                  <FaFilter />
                  Filters
                  {(selectedLocations.length > 0 || minRating > 0) && (
                    <span className="bg-white text-[var(--primary-500)] text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                      {selectedLocations.length + (minRating > 0 ? 1 : 0)}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white mt-4 p-6 rounded-2xl shadow-md border border-[var(--border-light)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Location Filter */}
                      <div>
                        <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-[var(--primary-500)]" />
                          Location
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {locations.map(location => (
                            <button
                              key={location}
                              onClick={() => toggleLocation(location)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedLocations.includes(location)
                                  ? 'bg-[var(--primary-500)] text-white'
                                  : 'bg-[var(--neutral-100)] text-[var(--text-secondary)] hover:bg-[var(--neutral-200)]'
                                }`}
                            >
                              {location}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Rating Filter */}
                      <div>
                        <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                          <FaStar className="text-[var(--warning)]" />
                          Minimum Rating
                        </h3>
                        <div className="flex gap-2">
                          {[4, 3, 2, 1].map(rating => (
                            <button
                              key={rating}
                              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                              className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all flex items-center gap-1 ${minRating === rating
                                  ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-700)]'
                                  : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--primary-300)]'
                                }`}
                            >
                              {rating}+ <FaStar className="text-[var(--warning)]" size={12} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-[var(--border-light)] flex justify-end">
                      <button
                        onClick={clearFilters}
                        className="text-[var(--primary-500)] hover:text-[var(--primary-600)] font-semibold text-sm"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Farmers Grid */}
          {loading ? (
            <div className="py-8">
              <FarmerGridSkeleton count={6} />
            </div>
          ) : error ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-yellow-700">{error}</p>
            </div>
          ) : filteredFarmers.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {filteredFarmers.map((farmer) => (
                  <motion.div
                    key={farmer.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FarmerCard farmer={farmer} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌾</div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">No farmers found</h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Try adjusting your filters or search query
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 rounded-xl bg-[var(--primary-500)] text-white font-semibold hover:bg-[var(--primary-600)] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Farmers;
