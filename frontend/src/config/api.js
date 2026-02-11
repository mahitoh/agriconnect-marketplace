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
  MY_ORDERS: `${API_BASE_URL}/api/orders/my-orders`,
  ORDER_BY_ID: (id) => `${API_BASE_URL}/api/orders/${id}`,

  // Favorites endpoints
  FAVORITES: `${API_BASE_URL}/api/favorites`,
  FAVORITES_CHECK: (productId) => `${API_BASE_URL}/api/favorites/check/${productId}`,
  FAVORITES_REMOVE: (productId) => `${API_BASE_URL}/api/favorites/${productId}`,
};

export default API_BASE_URL;
