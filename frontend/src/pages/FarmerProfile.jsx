import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

// Mock data - will be replaced with API calls
import { 
  getFarmerById,
  ratingDistribution 
} from '../data/farmerProfileMock';

const FarmerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userReviews, setUserReviews] = useState([]);

  // Use contexts
  const { addToCart } = useCart();
  const { toggleFollowFarmer, isFollowingFarmer } = useFavorites();

  // Fetch farmer data based on ID
  useEffect(() => {
    // Simulate API call - replace with actual API when backend is connected
    const fetchFarmer = () => {
      setLoading(true);
      const farmerData = getFarmerById(parseInt(id));
      
      if (!farmerData) {
        // Farmer not found, redirect to 404
        navigate('/404');
        return;
      }
      
      setFarmer(farmerData);
      setLoading(false);
    };

    fetchFarmer();
  }, [id, navigate]);

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

  // Load user reviews from localStorage
  useEffect(() => {
    const savedReviews = localStorage.getItem(`reviews_farmer_${id}`);
    if (savedReviews) {
      try {
        setUserReviews(JSON.parse(savedReviews));
      } catch (error) {
        console.error('Error loading reviews:', error);
      }
    }
  }, [id]);

  // Handle review submission
  const handleReviewSubmit = (review) => {
    const updatedReviews = [review, ...userReviews];
    setUserReviews(updatedReviews);
    localStorage.setItem(`reviews_farmer_${id}`, JSON.stringify(updatedReviews));
    alert('Thank you for your review!');
  };

  const handleAddToCart = (product) => {
    addToCart(product, farmer);
  };

  // Loading state
  if (loading) {
    return (
      <div 
        style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#f9fafb'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div 
            style={{ 
              width: '48px', 
              height: '48px', 
              border: '4px solid #e5e7eb', 
              borderTop: '4px solid #2d5f3f', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} 
          />
          <p style={{ color: '#6b7280' }}>Loading farmer profile...</p>
        </div>
      </div>
    );
  }

  if (!farmer) {
    return null;
  }

  const products = farmer.products || [];
  const isFollowing = isFollowingFarmer(farmer.id);
  const farmerReviews = farmer.reviews || [];
  const allReviews = [...userReviews, ...farmerReviews];

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
                  onSubmit={handleReviewSubmit}
                />

                {/* Rating Summary */}
                <RatingSummary 
                  rating={farmer.rating} 
                  totalReviews={farmer.totalReviews + userReviews.length}
                  distribution={ratingDistribution}
                />

                {/* Reviews List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {allReviews.length > 0 ? (
                    allReviews.map(review => (
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
