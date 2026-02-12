import React, { createContext, useContext, useState, useEffect } from 'react';
import { authFetch } from '../utils/authFetch';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendError, setBackendError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // ─── Load cart from backend on mount ───────────────────────
  useEffect(() => {
    const loadCartFromBackend = async () => {
      try {
        setIsLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Only try to load from backend if user is logged in
        if (!user.id) {
          console.log('No user logged in, loading from cache');
          const cached = JSON.parse(localStorage.getItem('cart') || '[]');
          setCartItems(cached);
          setIsLoading(false);
          return;
        }

        // Fetch cart from backend
        const response = await authFetch(`${API_URL}/api/cart`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch cart: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.data?.cartItems) {
          const backendItems = data.data.cartItems.map(ci => ({
            id: ci.productId,
            cartItemId: ci.cartItemId,
            name: ci.product.name,
            price: ci.product.price,
            image: ci.product.image_url,
            farmer: ci.product.farmer?.farmName || 'Local Farmer',
            farmerId: ci.product.farmer_id,
            quantity: ci.quantity,
            category: ci.product.category || ''
          }));
          
          setCartItems(backendItems);
          // Also update localStorage as cache
          localStorage.setItem('cart', JSON.stringify(backendItems));
        }
      } catch (error) {
        console.warn('Could not load cart from backend:', error.message);
        // Fallback to localStorage cache
        try {
          const cached = JSON.parse(localStorage.getItem('cart') || '[]');
          setCartItems(cached);
          if (error.message.includes('Session expired')) {
            setBackendError('Session expired. Cart may be out of sync.');
          }
        } catch (e) {
          console.error('Failed to load cart from cache:', e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCartFromBackend();
  }, []);

  // Save cart to localStorage as backup whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ─── Add item to cart (sync with backend) ──────────────────
  const addToCart = async (product, farmer = null) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // If no user logged in, just add to local cache
      if (!user.id) {
        setCartItems(prevItems => {
          const existingItem = prevItems.find(item => item.id === product.id);
          
          if (existingItem) {
            showNotification(`Updated ${product.name} quantity in cart`);
            return prevItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          }

          showNotification(`${product.name} added to cart!`);
          return [...prevItems, {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            farmer: farmer?.farmName || farmer?.name || 'Local Farmer',
            farmerId: farmer?.id,
            location: farmer?.location || '',
            quantity: 1
          }];
        });
        return;
      }

      // Sync with backend
      const response = await authFetch(`${API_URL}/api/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1
        })
      });

      if (!response.ok) {
        const error = await response.json();
        // Special handling for self-purchase error
        if (error.message?.includes('cannot purchase your own product')) {
          showNotification(error.message, 'error');
          setBackendError(null);
          return;
        }
        throw new Error(error.message || 'Failed to add to cart');
      }

      // Reload cart from backend
      const cartResponse = await authFetch(`${API_URL}/api/cart`);
      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        if (cartData.data?.cartItems) {
          const backendItems = cartData.data.cartItems.map(ci => ({
            id: ci.productId,
            cartItemId: ci.cartItemId,
            name: ci.product.name,
            price: ci.product.price,
            image: ci.product.image_url,
            farmer: ci.product.farmer?.farmName || 'Local Farmer',
            farmerId: ci.product.farmer_id,
            quantity: ci.quantity,
            category: ci.product.category || ''
          }));
          setCartItems(backendItems);
          showNotification(`${product.name} added to cart!`);
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification(error.message || 'Failed to add to cart', 'error');
      setBackendError(error.message);
    }
  };

  // ─── Remove item from cart (sync with backend) ─────────────
  const removeFromCart = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const item = cartItems.find(i => i.id === productId);

      // If no user logged in or no cartItemId, just remove from local
      if (!user.id || !item?.cartItemId) {
        setCartItems(prevItems => {
          const removedItem = prevItems.find(i => i.id === productId);
          if (removedItem) {
            showNotification(`${removedItem.name} removed from cart`);
          }
          return prevItems.filter(i => i.id !== productId);
        });
        return;
      }

      // Sync with backend
      const response = await authFetch(`${API_URL}/api/cart/items/${item.cartItemId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to remove from cart');
      }

      setCartItems(prevItems => {
        const removedItem = prevItems.find(i => i.id === productId);
        if (removedItem) {
          showNotification(`${removedItem.name} removed from cart`);
        }
        return prevItems.filter(i => i.id !== productId);
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      showNotification('Failed to remove item', 'error');
      setBackendError(error.message);
    }
  };

  // ─── Update item quantity (sync with backend) ─────────────
  const updateQuantity = async (productId, change) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const item = cartItems.find(i => i.id === productId);
      const newQuantity = Math.max(1, item.quantity + change);

      // If no user logged in or no cartItemId, just update local
      if (!user.id || !item?.cartItemId) {
        setCartItems(prevItems =>
          prevItems.map(i =>
            i.id === productId
              ? { ...i, quantity: newQuantity }
              : i
          )
        );
        return;
      }

      // Sync with backend
      const response = await authFetch(`${API_URL}/api/cart/items/${item.cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      setCartItems(prevItems =>
        prevItems.map(i =>
          i.id === productId
            ? { ...i, quantity: newQuantity }
            : i
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      showNotification('Failed to update quantity', 'error');
      setBackendError(error.message);
    }
  };

  // ─── Set specific quantity (sync with backend) ─────────────
  const setQuantity = async (productId, quantity) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (quantity < 1) {
        await removeFromCart(productId);
        return;
      }

      const item = cartItems.find(i => i.id === productId);

      // If no user logged in or no cartItemId, just update local
      if (!user.id || !item?.cartItemId) {
        setCartItems(prevItems =>
          prevItems.map(i =>
            i.id === productId
              ? { ...i, quantity }
              : i
          )
        );
        return;
      }

      // Sync with backend
      const response = await authFetch(`${API_URL}/api/cart/items/${item.cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
      });

      if (!response.ok) {
        throw new Error('Failed to set quantity');
      }

      setCartItems(prevItems =>
        prevItems.map(i =>
          i.id === productId
            ? { ...i, quantity }
            : i
        )
      );
    } catch (error) {
      console.error('Error setting quantity:', error);
      showNotification('Failed to update quantity', 'error');
      setBackendError(error.message);
    }
  };

  // ─── Clear cart (sync with backend) ────────────────────────
  const clearCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // If user is logged in, sync with backend
      if (user.id) {
        const response = await authFetch(`${API_URL}/api/cart`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to clear cart');
        }
      }

      setCartItems([]);
      localStorage.removeItem('cart');
      showNotification('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      showNotification('Failed to clear cart', 'error');
      setBackendError(error.message);
    }
  };

  // Get cart totals
  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Get items grouped by farmer (for Cart page & Checkout)
  const getItemsByFarmer = () => {
    const groups = {};
    for (const item of cartItems) {
      const fid = item.farmerId || 'unknown';
      if (!groups[fid]) {
        groups[fid] = {
          farmerId: fid,
          farmerName: item.farmer || 'Local Farmer',
          items: [],
          subtotal: 0
        };
      }
      groups[fid].items.push(item);
      groups[fid].subtotal += item.price * item.quantity;
    }
    return Object.values(groups);
  };

  // Get delivery fee (free above 50,000 XAF)
  const getDeliveryFee = () => {
    const total = getCartTotal();
    return total > 50000 ? 0 : 2000;
  };

  // Get grand total (subtotal + delivery)
  const getGrandTotal = () => {
    return getCartTotal() + getDeliveryFee();
  };

  // Get number of unique items in cart (for badge display)
  const getCartCount = () => {
    return cartItems.length;
  };

  // Get total quantity of all items (if needed)
  const getTotalQuantity = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    setQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    getTotalQuantity,
    getItemsByFarmer,
    getDeliveryFee,
    getGrandTotal,
    isInCart,
    notification,
    isLoading,
    backendError
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
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
          {notification.type === 'success' ? '✓' : '✕'} {notification.message}
        </div>
      )}
    </CartContext.Provider>
  );
};

export default CartContext;
