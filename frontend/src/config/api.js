// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  PROFILE: `${API_BASE_URL}/api/profile`,
  PROFILE_UPLOAD_IMAGE: `${API_BASE_URL}/api/profile/upload-image`,
  REFRESH_TOKEN: `${API_BASE_URL}/api/auth/refresh`,
  VERIFY_EMAIL: `${API_BASE_URL}/api/auth/verify`,
  RESEND_VERIFICATION: `${API_BASE_URL}/api/auth/resend-verification`,
  PROMOTE_ADMIN: `${API_BASE_URL}/api/auth/promote-admin`,
  
  // OAuth endpoints
  GOOGLE_AUTH: `${API_BASE_URL}/api/oauth/google`,
  FACEBOOK_AUTH: `${API_BASE_URL}/api/oauth/facebook`,

  // Admin endpoints
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  ADMIN_PENDING_FARMERS: `${API_BASE_URL}/api/admin/farmers/pending`,
  ADMIN_APPROVE_FARMER: `${API_BASE_URL}/api/admin/farmers`,
  ADMIN_REJECT_FARMER: `${API_BASE_URL}/api/admin/farmers`,
  ADMIN_TRANSACTIONS: `${API_BASE_URL}/api/admin/transactions`,
  ADMIN_ACTIVITY: `${API_BASE_URL}/api/admin/analytics/activity`,
  ADMIN_TOP_FARMERS: `${API_BASE_URL}/api/admin/analytics/top-farmers`,
  ADMIN_DASHBOARD: `${API_BASE_URL}/api/admin/analytics/dashboard`,

  // Product endpoints
  PRODUCTS: `${API_BASE_URL}/api/products`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/api/products/${id}`,
  FARMER_PRODUCTS: `${API_BASE_URL}/api/products/farmer/my-products`,
  UPLOAD_PRODUCT_IMAGE: `${API_BASE_URL}/api/products/upload-image`,
  DASHBOARD_STATS: `${API_BASE_URL}/api/products/dashboard/stats`,

  // Marketplace endpoints
  MARKETPLACE_FARMERS: `${API_BASE_URL}/api/marketplace/farmers`,
  MARKETPLACE_FARMER_PROFILE: (id) => `${API_BASE_URL}/api/marketplace/farmers/${id}`,

  // Review endpoints
  REVIEWS: `${API_BASE_URL}/api/reviews`,
  REVIEWS_FARMER: (farmerId) => `${API_BASE_URL}/api/reviews/farmer/${farmerId}`,
  REVIEWS_PRODUCT: (productId) => `${API_BASE_URL}/api/reviews/product/${productId}`,
  REVIEW_BY_ID: (id) => `${API_BASE_URL}/api/reviews/${id}`,
  REVIEW_CAN_REVIEW: (productId) => `${API_BASE_URL}/api/reviews/can-review/${productId}`,
  REVIEW_MY_REVIEWABLE: `${API_BASE_URL}/api/reviews/my-reviewable-products`,

  // Order endpoints
  ORDERS: `${API_BASE_URL}/api/orders`,
  MY_ORDERS: `${API_BASE_URL}/api/orders`,
  ORDER_BY_ID: (id) => `${API_BASE_URL}/api/orders/${id}`,
  VALIDATE_CART: `${API_BASE_URL}/api/orders/validate-cart`,
  CHECKOUT: `${API_BASE_URL}/api/orders/checkout`,
  CONFIRM_PAYMENT: `${API_BASE_URL}/api/orders/confirm-payment`,
  CONFIRM_COD: `${API_BASE_URL}/api/orders/confirm-cod`,
  FARMER_ORDERS: `${API_BASE_URL}/api/orders/farmer`,
  ORDER_STATUS: (id) => `${API_BASE_URL}/api/orders/${id}/status`,

  // Payment endpoints
  PAYMENT_INITIATE: `${API_BASE_URL}/api/payment/initiate`,
  PAYMENT_STATUS: (refId) => `${API_BASE_URL}/api/payment/status/${refId}`,

  // Favorites endpoints
  FAVORITES: `${API_BASE_URL}/api/favorites`,
  FAVORITES_CHECK: (productId) => `${API_BASE_URL}/api/favorites/check/${productId}`,
  FAVORITES_REMOVE: (productId) => `${API_BASE_URL}/api/favorites/${productId}`,

  // Inventory endpoints
  INVENTORY_SUMMARY: `${API_BASE_URL}/api/inventory/summary`,
  INVENTORY_LOW_STOCK: `${API_BASE_URL}/api/inventory/low-stock`,
  INVENTORY_HISTORY: `${API_BASE_URL}/api/inventory/history`,
  INVENTORY_ADJUST: (productId) => `${API_BASE_URL}/api/inventory/products/${productId}/adjust`,
  INVENTORY_PRODUCT_HISTORY: (productId) => `${API_BASE_URL}/api/inventory/products/${productId}/history`,
  INVENTORY_ALERT_SETTINGS: (productId) => `${API_BASE_URL}/api/inventory/products/${productId}/alert-settings`,

  // Notification endpoints
  NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
  NOTIFICATIONS_UNREAD_COUNT: `${API_BASE_URL}/api/notifications/unread-count`,
  NOTIFICATION_MARK_READ: (id) => `${API_BASE_URL}/api/notifications/${id}/read`,
  NOTIFICATIONS_MARK_ALL_READ: `${API_BASE_URL}/api/notifications/mark-all-read`,
  NOTIFICATION_DELETE: (id) => `${API_BASE_URL}/api/notifications/${id}`,
  NOTIFICATION_PREFERENCES: `${API_BASE_URL}/api/notifications/preferences`,
};

export default API_BASE_URL;
