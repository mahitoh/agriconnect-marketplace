import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Add item to cart
  const addToCart = (product, farmer = null) => {
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
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const item = prevItems.find(i => i.id === productId);
      if (item) {
        showNotification(`${item.name} removed from cart`);
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  // Update item quantity
  const updateQuantity = (productId, change) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  // Set specific quantity
  const setQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    showNotification('Cart cleared');
  };

  // Get cart totals
  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
    isInCart,
    notification
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
