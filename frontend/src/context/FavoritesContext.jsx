import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load from localStorage on mount
  useEffect(() => {
    const savedFarmers = localStorage.getItem('followedFarmers');
    const savedProducts = localStorage.getItem('likedProducts');
    
    if (savedFarmers) {
      try {
        setFollowedFarmers(JSON.parse(savedFarmers));
      } catch (error) {
        console.error('Error loading followed farmers:', error);
      }
    }
    
    if (savedProducts) {
      try {
        setLikedProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Error loading liked products:', error);
      }
    }
  }, []);

  // Save to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('followedFarmers', JSON.stringify(followedFarmers));
  }, [followedFarmers]);

  useEffect(() => {
    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
  }, [likedProducts]);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Follow/Unfollow farmer
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

  // Like/Unlike product
  const toggleLikeProduct = (product) => {
    setLikedProducts(prev => {
      const isLiked = prev.some(p => p.id === product.id);
      
      if (isLiked) {
        showNotification(`Removed ${product.name} from favorites`);
        return prev.filter(p => p.id !== product.id);
      } else {
        showNotification(`Added ${product.name} to favorites!`);
        return [...prev, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category
        }];
      }
    });
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
    notification
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
