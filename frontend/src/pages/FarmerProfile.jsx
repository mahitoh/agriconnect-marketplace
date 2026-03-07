import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

// Layout Components
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// Page Components
import {
  FarmerProfileHero,
  FarmerSidebar,
  FarmerProductCard,
  FarmerReviewCard,
  ProfileTabs,
  RatingSummary,
  FarmerAbout,
  ReviewForm
} from '../components/farmer';

// Contexts
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

// React Query hook
import { useFarmerProfile } from '../hooks/useQueries';
import { FarmerProfileSkeleton } from '../components/ui/skeleton';

// Mock data - fallback only
import { 
  ratingDistribution 
} from '../data/farmerProfileMock';

const FarmerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('products');

  // Fetch farmer data via React Query
  const { data: apiData, isLoading: loading, error: queryError } = useFarmerProfile(id);

  // Transform API data
  const farmer = useMemo(() => {
    if (!apiData?.farmer) return null;
    const data = apiData;
    return {
      id: data.farmer.id,
      name: data.farmer.full_name || 'Farmer',
      farmName: data.farmer.farm_name || data.farmer.farm_details || 'Farm',
      location: data.farmer.location || 'Location not specified',
      bio: data.farmer.bio || 'No bio available',
      verified: data.farmer.approved || false,
      rating: data.rating?.average_rating?.toFixed(1) || '0.0',
      totalReviews: data.rating?.total_reviews || 0,
      totalOrders: 0,
      memberSince: new Date(data.farmer.created_at).getFullYear(),
      yearsExperience: data.farmer.years_experience || null,
      coverImage: data.farmer.banner_url || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=400&fit=crop',
      bannerUrl: data.farmer.banner_url,
      profileImage: data.farmer.avatar_url || 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=200&h=200&fit=crop',
      avatarUrl: data.farmer.avatar_url,
      avatar: data.farmer.avatar_url || 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=200&h=200&fit=crop',
      badges: data.farmer.approved ? ['Verified Farmer'] : ['Pending Approval'],
      certifications: data.farmer.certifications || [],
      products: (data.products || []).map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit || 'kg',
        image: product.image_url || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=400&fit=crop',
        category: product.category || 'Other',
        inStock: product.quantity > 0,
        stock: product.quantity ?? 0,
        quantity: product.quantity,
        description: product.description || '',
        organic: product.organic_certified || false,
        harvest: product.harvest_date ? new Date(product.harvest_date).toLocaleDateString() : null
      })),
      reviews: (data.recentReviews || []).map(review => ({
        id: review.id,
        author: review.profiles?.full_name || 'Anonymous',
        rating: review.rating,
        comment: review.comment,
        date: new Date(review.created_at).toLocaleDateString(),
        productName: review.products?.name || 'Product'
      })),
      specialties: data.farmer.certifications || ['Organic Farming', 'Sustainable'],
      totalProducts: data.products?.length || 0
    };
  }, [apiData]);

  const error = queryError?.message || null;

  // Use contexts
  const { addToCart } = useCart();
  const { toggleFollowFarmer, isFollowingFarmer } = useFavorites();

  // Handlers
  const handleFollow = () => {
    if (farmer) {
      toggleFollowFarmer(farmer);
    }
  };

  const handleContact = () => {
    alert(`Contact ${farmer?.name} at: contact@${farmer?.farmName?.toLowerCase().replace(/\s/g, '')}.com`);
  };

  const handleReviewSubmit = async (review) => {
    console.log('Review submitted:', review);
    queryClient.invalidateQueries({ queryKey: ['farmer', id] });
  };

  const handleAddToCart = (product) => {
    addToCart(product, farmer);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] overflow-x-hidden">
        <Navbar />
        <div className="pt-20">
          <FarmerProfileSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] overflow-x-hidden">
        <Navbar />
        <div className="pt-24 pb-20 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-red-800 mb-4">Error Loading Farmer Profile</h2>
              <p className="text-red-600 text-sm sm:text-base mb-6">{error}</p>
              <button
                onClick={() => navigate('/farmers')}
                className="px-6 py-3 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)] min-h-[44px] touch-manipulation"
              >
                Back to Farmers
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!farmer) {
    return null;
  }

  const products = farmer.products || [];
  const isFollowing = isFollowingFarmer(farmer.id);
  const farmerReviews = farmer.reviews || [];

  return (
    <div className="min-h-screen bg-[#f9fafb] overflow-x-hidden">
      <Navbar />

      <FarmerProfileHero 
        farmer={farmer} 
        onFollow={handleFollow} 
        onContact={handleContact}
        isFollowing={isFollowing}
      />

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          {/* Sidebar - shows below content on mobile */}
          <aside className="order-2 lg:order-1 w-full lg:w-auto">
            <FarmerSidebar farmer={farmer} />
          </aside>

          {/* Main Content Area */}
          <div className="order-1 lg:order-2 min-w-0">
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'products' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text-primary)]">
                    All Products ({products.length})
                  </h2>
                  <select 
                    className="w-full sm:w-auto min-w-0 max-w-[200px] py-2 sm:py-2.5 pl-3 pr-8 rounded-lg border border-[var(--border-color)] bg-white text-sm font-semibold text-[var(--text-primary)] focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)] outline-none"
                  >
                    <option>All Categories</option>
                    <option>Vegetables</option>
                    <option>Fruits</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {products.map(product => (
                    <FarmerProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <FarmerAbout farmer={farmer} />
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4 sm:space-y-6">
                <ReviewForm 
                  farmerId={farmer.id}
                  farmerName={farmer.name}
                  products={products}
                  onSubmit={handleReviewSubmit}
                />

                <RatingSummary 
                  rating={farmer.rating} 
                  totalReviews={farmer.totalReviews}
                  distribution={ratingDistribution}
                />

                <div className="flex flex-col gap-3 sm:gap-4">
                  {farmerReviews.length > 0 ? (
                    farmerReviews.map(review => (
                      <FarmerReviewCard key={review.id} review={review} />
                    ))
                  ) : (
                    <div className="text-center p-6 sm:p-10 bg-white rounded-xl text-[var(--text-secondary)]">
                      <p className="text-sm sm:text-base">No reviews yet. Be the first to review this farmer!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FarmerProfile;
