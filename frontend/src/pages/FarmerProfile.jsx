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
    // Navigate to contact or open modal
    alert(`Contact ${farmer?.name} at: contact@${farmer?.farmName?.toLowerCase().replace(/\s/g, '')}.com`);
  };

  // Handle review submission - invalidate cache to refresh reviews
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
      <div className="min-h-screen bg-[var(--bg-secondary)]">
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
      <div className="min-h-screen bg-[var(--bg-secondary)]">
        <Navbar />
        <div className="pt-24 pb-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-red-800 mb-4">Error Loading Farmer Profile</h2>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={() => navigate('/farmers')}
                className="px-6 py-3 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)]"
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
    <div 
      style={{ 
        minHeight: '100vh', 
        background: '#f9fafb', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <FarmerProfileHero 
        farmer={farmer} 
        onFollow={handleFollow} 
        onContact={handleContact}
        isFollowing={isFollowing}
      />

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '280px 1fr', 
            gap: '2rem' 
          }}
        >
          {/* Sidebar */}
          <FarmerSidebar farmer={farmer} />

          {/* Main Content Area */}
          <div>
            {/* Tabs */}
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '1.5rem' 
                  }}
                >
                  <h2 style={{ fontSize: '24px', fontWeight: '700' }}>
                    All Products ({products.length})
                  </h2>
                  <select 
                    style={{ 
                      padding: '10px 16px', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '10px', 
                      fontSize: '14px', 
                      fontWeight: '600' 
                    }}
                  >
                    <option>All Categories</option>
                    <option>Vegetables</option>
                    <option>Fruits</option>
                  </select>
                </div>

                <div 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '1.5rem' 
                  }}
                >
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

            {/* About Tab */}
            {activeTab === 'about' && (
              <FarmerAbout farmer={farmer} />
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                {/* Review Form */}
                <ReviewForm 
                  farmerId={farmer.id}
                  farmerName={farmer.name}
                  products={products}
                  onSubmit={handleReviewSubmit}
                />

                {/* Rating Summary */}
                <RatingSummary 
                  rating={farmer.rating} 
                  totalReviews={farmer.totalReviews}
                  distribution={ratingDistribution}
                />

                {/* Reviews List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {farmerReviews.length > 0 ? (
                    farmerReviews.map(review => (
                      <FarmerReviewCard key={review.id} review={review} />
                    ))
                  ) : (
                    <div 
                      style={{ 
                        textAlign: 'center', 
                        padding: '40px', 
                        background: 'white', 
                        borderRadius: '16px',
                        color: '#6b7280'
                      }}
                    >
                      <p>No reviews yet. Be the first to review this farmer!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FarmerProfile;
