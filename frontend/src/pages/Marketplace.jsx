import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaTh, FaList, FaSearch, FaTimes } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ProductCard';
import { products as mockProducts } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { API_ENDPOINTS } from '../config/api';

const Marketplace = () => {
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS);
      const data = await response.json();

      if (data.success && data.data.products) {
        // Transform API products to match ProductCard format
        const transformedProducts = data.data.products.map(product => {
          // Handle different response formats
          const farmerProfile = product.profiles || (Array.isArray(product.profiles) ? product.profiles[0] : null);
          const farmerName = farmerProfile?.full_name || product.farmer_name || 'Farmer';
          const farmerLocation = farmerProfile?.location || product.harvest_location || product.location || 'Location not specified';
          
          console.log('🔍 Product:', product.name, 'Farmer:', farmerName, 'Profile data:', product.profiles);
          
          // Determine badge based on category
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
            badge: badge,
            badgeColor: badgeColors[badge] || '#2d5f3f',
            rating: product.rating || '0.0', // Use rating from API
            reviews: product.reviews?.toString() || '0', // Use reviews from API
            farmer: farmerName,
            location: farmerLocation,
            price: `${product.price.toLocaleString()} FCFA`,
            oldPrice: null,
            category: product.category,
            quantity: product.quantity,
            description: product.description
          };
        });
        setProducts(transformedProducts);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Showing sample products.');
      // Fallback to mock data
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

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

  // Extract unique categories and locations
  const categories = [...new Set(products.map(p => p.category || p.badge))];
  const locations = [...new Set(products.map(p => p.location))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farmer.toLowerCase().includes(searchQuery.toLowerCase());
    const productCategory = product.category || product.badge;
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(productCategory);
    const priceValue = typeof product.price === 'string' 
      ? parseInt(product.price.replace(/[^\d]/g, ''))
      : product.price;
    const matchesPrice = priceValue >= priceRange[0] && priceValue <= priceRange[1];
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(product.location);

    return matchesSearch && matchesCategory && matchesPrice && matchesLocation;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const getPrice = (product) => {
      return typeof product.price === 'string' 
        ? parseInt(product.price.replace(/[^\d]/g, ''))
        : product.price;
    };

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
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="max-w-[1600px] mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[var(--secondary-50)] text-[var(--secondary-600)] text-sm font-semibold mb-4">
              Marketplace
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Browse All Products
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
              Discover fresh agricultural products from verified farmers across Cameroon.
            </p>
          </motion.div>

          {/* Search and Controls */}
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products or farmers..."
                className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-[var(--border-color)] focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-500)]/20 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-[var(--border-color)] focus:border-[var(--primary-500)] outline-none transition-all bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              {/* View Mode */}
              <div className="flex gap-2 p-1 bg-[var(--neutral-100)] rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                      ? 'bg-white text-[var(--primary-500)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                >
                  <FaTh size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                      ? 'bg-white text-[var(--primary-500)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                >
                  <FaList size={18} />
                </button>
              </div>

              {/* Toggle Filters (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden px-4 py-3 rounded-xl bg-[var(--primary-500)] text-white flex items-center gap-2"
              >
                <FaFilter />
                Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <AnimatePresence>
              {showFilters && (
                <motion.aside
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="hidden md:block w-80 flex-shrink-0"
                >
                  <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-md">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">Filters</h3>
                      <button
                        onClick={clearFilters}
                        className="text-sm text-[var(--primary-500)] hover:text-[var(--primary-600)] font-semibold"
                      >
                        Clear All
                      </button>
                    </div>

                    {/* Categories */}
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-[var(--text-primary)] mb-3">Categories</h4>
                      <div className="space-y-2">
                        {categories.map(category => (
                          <label key={category} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category)}
                              onChange={() => toggleCategory(category)}
                              className="w-5 h-5 rounded border-2 border-[var(--border-color)] text-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-500)]/20"
                            />
                            <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors capitalize">
                              {category}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-[var(--text-primary)] mb-3">Price Range</h4>
                      <div className="space-y-3">
                        <input
                          type="range"
                          min="0"
                          max="100000"
                          step="5000"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                          className="w-full accent-[var(--primary-500)]"
                        />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[var(--text-secondary)]">0 FCFA</span>
                          <span className="font-semibold text-[var(--primary-600)]">
                            {priceRange[1].toLocaleString()} FCFA
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Locations */}
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)] mb-3">Location</h4>
                      <div className="space-y-2">
                        {locations.map(location => (
                          <label key={location} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedLocations.includes(location)}
                              onChange={() => toggleLocation(location)}
                              className="w-5 h-5 rounded border-2 border-[var(--border-color)] text-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-500)]/20"
                            />
                            <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                              {location}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results Count */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-[var(--text-secondary)]">
                  Showing <span className="font-semibold text-[var(--text-primary)]">{sortedProducts.length}</span> products
                </p>
                {(selectedCategories.length > 0 || selectedLocations.length > 0) && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map(cat => (
                      <span
                        key={cat}
                        className="px-3 py-1 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] text-xs font-semibold flex items-center gap-2"
                      >
                        {cat}
                        <button onClick={() => toggleCategory(cat)}>
                          <FaTimes size={10} />
                        </button>
                      </span>
                    ))}
                    {selectedLocations.map(loc => (
                      <span
                        key={loc}
                        className="px-3 py-1 rounded-full bg-[var(--accent-50)] text-[var(--accent-700)] text-xs font-semibold flex items-center gap-2"
                      >
                        {loc}
                        <button onClick={() => toggleLocation(loc)}>
                          <FaTimes size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Products */}
              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-500)] mb-4"></div>
                  <p className="text-[var(--text-secondary)]">Loading products...</p>
                </div>
              ) : error ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <p className="text-yellow-700">{error}</p>
                </div>
              ) : sortedProducts.length > 0 ? (
                <div className={`grid gap-6 ${viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                  }`}>
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">No products found</h3>
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Marketplace;
