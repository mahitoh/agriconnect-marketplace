import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [followedFarmers, setFollowedFarmers] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load from localStorage on mount (farmers) and API (products)
  useEffect(() => {
    // Load followed farmers from localStorage (UI-only feature for now)
    const savedFarmers = localStorage.getItem('followedFarmers');
    if (savedFarmers) {
      try {
        setFollowedFarmers(JSON.parse(savedFarmers));
      } catch (error) {
        console.error('Error loading followed farmers:', error);
      }
    }
    
    // Fetch favorited products from API
    fetchFavorites();
  }, []);

  // Fetch favorites from API
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // Not logged in

      const response = await fetch(API_ENDPOINTS.FAVORITES, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.favorites) {
          // Extract products from favorites
          const products = data.data.favorites.map(fav => fav.products).filter(Boolean);
          setLikedProducts(products);
        }
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  // Save farmers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('followedFarmers', JSON.stringify(followedFarmers));
  }, [followedFarmers]);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Follow/Unfollow farmer (localStorage only for now)
  const toggleFollowFarmer = (farmer) => {
    setFollowedFarmers(prev => {
      const isFollowing = prev.some(f => f.id === farmer.id);
      
      if (isFollowing) {
        showNotification(`Unfollowed ${farmer.name}`);
        return prev.filter(f => f.id !== farmer.id);
      } else {
        showNotification(`Now following ${farmer.name}!`);
        return [...prev, {
          id: farmer.id,
          name: farmer.name,
          farmName: farmer.farmName,
          profileImage: farmer.profileImage,
          location: farmer.location,
          rating: farmer.rating
        }];
      }
    });
  };

  // Check if following a farmer
  const isFollowingFarmer = (farmerId) => {
    return followedFarmers.some(f => f.id === farmerId);
  };

  // Like/Unlike product (with API)
  const toggleLikeProduct = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('Please login to add favorites', 'error');
      return;
    }

    setLoading(true);
    const isLiked = isProductLiked(product.id);

    try {
      if (isLiked) {
        // Remove from favorites
        const response = await fetch(API_ENDPOINTS.FAVORITES_REMOVE(product.id), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setLikedProducts(prev => prev.filter(p => p.id !== product.id));
          showNotification(`Removed ${product.name} from favorites`);
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Failed to remove favorite');
        }
      } else {
        // Add to favorites
        const response = await fetch(API_ENDPOINTS.FAVORITES, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId: product.id })
        });

        if (response.ok) {
          const data = await response.json();
          setLikedProducts(prev => [...prev, product]);
          showNotification(`Added ${product.name} to favorites!`);
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Failed to add favorite');
        }
      }
    } catch (error) {
      console.error('Error toggling product favorite:', error);
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Check if product is liked
  const isProductLiked = (productId) => {
    return likedProducts.some(p => p.id === productId);
  };

  // Get counts
  const getFollowedCount = () => followedFarmers.length;
  const getLikedCount = () => likedProducts.length;

  const value = {
    followedFarmers,
    likedProducts,
    toggleFollowFarmer,
    isFollowingFarmer,
    toggleLikeProduct,
    isProductLiked,
    getFollowedCount,
    getLikedCount,
    notification,
    loading,
    refreshFavorites: fetchFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            padding: '16px 24px',
            background: notification.type === 'success' ? '#2d5f3f' : '#dc2626',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            zIndex: 9999,
            animation: 'slideIn 0.3s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          {notification.type === 'success' ? '♥' : '✕'} {notification.message}
        </div>
      )}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;
