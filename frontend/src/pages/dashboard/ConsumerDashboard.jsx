import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaShoppingBag,
  FaHeart,
  FaUserCircle,
  FaMapMarkerAlt,
  FaCreditCard,
  FaHistory,
  FaSignOutAlt,
  FaStar,
  FaSearch,
  FaFilter,
  FaChevronRight,
  FaHome,
  FaEdit,
  FaTrash,
  FaPlus
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Input from '../../components/ui/input';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { API_ENDPOINTS } from '../../config/api';
import { authFetch } from '../../utils/authFetch';

const SECTIONS = {
  DASHBOARD: 'dashboard',
  ORDERS: 'orders',
  WISHLIST: 'wishlist',
  PROFILE: 'profile',
  ADDRESSES: 'addresses'
};

const ConsumerDashboard = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const { likedProducts, toggleLikeProduct, refreshFavorites } = useFavorites();
  const navigate = useNavigate();

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsModal, setOrderDetailsModal] = useState(false);
  
  // Reviewable products state
  const [reviewableProducts, setReviewableProducts] = useState([]);
  const [reviewModal, setReviewModal] = useState({ isOpen: false, product: null });
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Fetch orders from API
  useEffect(() => {
    if (activeSection === SECTIONS.ORDERS || activeSection === SECTIONS.DASHBOARD) {
      fetchOrders();
    }
  }, [activeSection]);

  // Fetch orders and reviewable products on mount
  useEffect(() => {
    fetchOrders();
    fetchReviewableProducts();
  }, []);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await authFetch(API_ENDPOINTS.MY_ORDERS);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data?.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchReviewableProducts = async () => {
    try {
      const response = await authFetch(API_ENDPOINTS.REVIEW_MY_REVIEWABLE);
      if (response.ok) {
        const data = await response.json();
        const products = data.data?.products || [];
        setReviewableProducts(products);
      }
    } catch (error) {
      console.error('Error fetching reviewable products:', error);
      setReviewableProducts([]);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewModal.product || reviewForm.rating === 0) {
      alert('Please select a rating');
      return;
    }

    // Validate that we have required fields
    if (!reviewModal.product.farmerId) {
      console.error('Missing farmerId:', reviewModal.product);
      alert('Error: Farmer information not loaded. Please try again.');
      return;
    }
    
    setReviewSubmitting(true);
    try {
      const payload = {
        productId: reviewModal.product.productId,
        farmerId: reviewModal.product.farmerId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        orderItemId: reviewModal.product.orderItemId
      };

      console.log('Submitting review with payload:', payload);

      const response = await authFetch(API_ENDPOINTS.REVIEWS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (response.ok) {
        alert('Review submitted successfully!');
        setReviewModal({ isOpen: false, product: null });
        setReviewForm({ rating: 0, comment: '' });
        fetchReviewableProducts(); // Refresh the list
      } else {
        console.error('Review submission error:', data);
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Local Wishlist Data - now using context
  const wishlistItems = likedProducts.map(p => ({
    id: p.id,
    name: p.name,
    farmer: p.farmer || 'Farmer',
    price: typeof p.price === 'number' ? `${p.price.toLocaleString()} FCFA` : p.price,
    image: p.image || p.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&h=200&fit=crop',
    inStock: true
  }));

  // Dummy Addresses
  const addresses = [
    { id: 1, label: 'Home', name: user?.full_name || 'Customer', phone: user?.phone || '+237 XXX XXX XXX', address: '123 Main St, Akwa', city: 'Douala', region: 'Littoral', isDefault: true },
    { id: 2, label: 'Office', name: user?.full_name || 'Customer', phone: user?.phone || '+237 XXX XXX XXX', address: 'Business Park, Bonanjo', city: 'Douala', region: 'Littoral', isDefault: false }
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  };

  const SidebarItem = ({ id, icon, label }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeSection === id
          ? 'bg-[var(--primary-500)] text-white shadow-lg shadow-[var(--primary-500)]/30'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--primary-600)]'
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const StatCard = ({ icon, label, value, color }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--border-light)] relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-bl-full transition-transform group-hover:scale-110`} />
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-md`}>
          {icon}
        </div>
      </div>
      <h3 className="text-[var(--text-secondary)] text-sm font-medium">{label}</h3>
      <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{value}</p>
    </motion.div>
  );

  const renderDashboardOverview = () => (
    <motion.div {...fadeIn} className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-[var(--primary-600)] to-[var(--primary-800)] rounded-3xl p-8 text-white overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-sm font-medium mb-3 backdrop-blur-sm">
              Member since Feb 2024
            </span>
            <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.full_name?.split(' ')[0] || 'Customer'}! 👋</h2>
            <p className="text-white/80">Ready to discover fresh products from local farmers?</p>
          </div>
          <button className="px-6 py-3 bg-white text-[var(--primary-600)] rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
            Browse Marketplace
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<FaCreditCard size={20} />}
          label="Total Spent"
          value={`${(orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)).toLocaleString()} FCFA`}
          color="from-[var(--primary-500)] to-[var(--primary-700)]"
        />
        <StatCard
          icon={<FaShoppingBag size={20} />}
          label="Orders Placed"
          value={orders.length}
          color="from-[var(--secondary-500)] to-[var(--secondary-700)]"
        />
        <StatCard
          icon={<FaHeart size={20} />}
          label="Saved Items"
          value={likedProducts.length}
          color="from-[var(--accent-500)] to-[var(--accent-700)]"
        />
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Recent Orders</h3>
          <button
            onClick={() => setActiveSection(SECTIONS.ORDERS)}
            className="text-sm text-[var(--primary-600)] font-medium hover:underline"
          >
            View All History
          </button>
        </div>
        <div className="space-y-4">
          {ordersLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--primary-500)] border-t-transparent"></div>
            </div>
          ) : orders.length === 0 ? (
            <p className="text-center py-8 text-[var(--text-secondary)]">No orders yet. Start shopping from the marketplace!</p>
          ) : (
            orders.slice(0, 3).map((order) => {
              const itemCount = order.order_items?.length || 0;
              const status = order.status === 'PENDING_PAYMENT' ? 'Pending' : 
                            order.status === 'CONFIRMED' ? 'Confirmed' :
                            order.status === 'COMPLETED' ? 'Delivered' : order.status;
              return (
                <div 
                  key={order.id} 
                  onClick={() => {
                    setSelectedOrder(order);
                    setOrderDetailsModal(true);
                  }}
                  className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl border border-[var(--border-light)] hover:bg-[var(--bg-secondary)] transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)] font-bold text-lg">
                    📦
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1">
                      <h4 className="font-bold text-[var(--text-primary)]">Order #{order.id.slice(0, 8).toUpperCase()}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {status}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">{itemCount} item{itemCount !== 1 ? 's' : ''} • {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right flex flex-col items-center md:items-end">
                    <span className="font-bold text-[var(--primary-600)]">{(order.total_amount || 0).toLocaleString()} FCFA</span>
                    <button className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary-600)] transition-colors flex items-center gap-1 mt-1">
                      Details <FaChevronRight size={10} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderOrders = () => (
    <motion.div {...fadeIn} className="space-y-6">
      {/* Reviewable Products Section - TEST MODE */}
      {reviewableProducts.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-sm border border-yellow-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
              <FaStar className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Review Products</h3>
              <p className="text-sm text-[var(--text-secondary)]">Share your feedback on products you've purchased</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviewableProducts.slice(0, 6).map((product) => (
              <div key={product.productId} className="bg-white rounded-xl p-4 flex items-center gap-3 border border-yellow-100">
                <img 
                  src={product.productImage || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&h=100&fit=crop'} 
                  alt={product.productName}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-[var(--text-primary)] truncate">{product.productName}</h4>
                  <p className="text-xs text-[var(--text-secondary)]">From {product.farmerName}</p>
                </div>
                <button
                  onClick={() => {
                    setReviewModal({ isOpen: true, product });
                    setReviewForm({ rating: 0, comment: '' });
                  }}
                  className="px-3 py-1.5 bg-yellow-400 text-white text-xs font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-1"
                >
                  <FaStar size={10} /> Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Order History</h3>
        
        {ordersLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-[var(--primary-200)] border-t-[var(--primary-500)] rounded-full animate-spin mx-auto"></div>
            <p className="text-[var(--text-secondary)] mt-2">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <FaShoppingBag size={48} className="text-[var(--text-tertiary)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">No orders yet</p>
            <button 
              onClick={() => navigate('/marketplace')}
              className="mt-4 px-6 py-2 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)]"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="p-4 rounded-xl border border-[var(--border-light)] hover:bg-[var(--bg-secondary)] transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                  <div>
                    <span className="font-bold text-[var(--text-primary)]">Order #{order.id.slice(0, 8)}</span>
                    <span className={`ml-3 px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                  </div>
                  <span className="font-bold text-[var(--primary-600)]">{order.total_amount?.toLocaleString()} FCFA</span>
                </div>
                
                {/* Order Items */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {order.order_items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3 text-sm p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {item.products?.image_url && (
                            <img src={item.products.image_url} alt={item.products?.name} className="w-10 h-10 rounded-lg object-cover" />
                          )}
                          <span className="text-[var(--text-secondary)] truncate">
                            {item.products?.name || 'Product'} × {item.quantity}
                          </span>
                        </div>
                        {/* Review Button for Order Items */}
                        {item.products && (
                          <button
                            onClick={() => {
                              // Handle profiles as either object or array
                              const profileData = Array.isArray(item.products.profiles) 
                                ? item.products.profiles[0] 
                                : item.products.profiles;
                              
                              const farmerName = profileData?.full_name || item.products.farmer_name || 'Farmer';
                              // Use farmer_id from products, fallback to order_items if needed
                              const farmerId = item.products.farmer_id || item.farmer_id;
                              
                              setReviewModal({ 
                                isOpen: true, 
                                product: {
                                  productId: item.products.id,
                                  productName: item.products.name,
                                  productImage: item.products.image_url,
                                  farmerId: farmerId,
                                  farmerName: farmerName,
                                  orderItemId: item.id
                                }
                              });
                              setReviewForm({ rating: 0, comment: '' });
                            }}
                            className="px-2 py-1 bg-yellow-400 text-white text-xs font-bold rounded hover:bg-yellow-500 transition-colors whitespace-nowrap"
                          >
                            Review
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[var(--text-tertiary)]">
                    {new Date(order.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', month: 'short', day: 'numeric' 
                    })}
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setSelectedOrder(order);
                        setOrderDetailsModal(true);
                      }}
                      className="px-3 py-1.5 border border-[var(--border-color)] rounded-lg text-xs font-medium hover:bg-gray-50"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
              Review {reviewModal.product?.productName}
            </h3>
            
            {/* Star Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                    className="text-3xl transition-transform hover:scale-110"
                  >
                    <FaStar 
                      className={reviewForm.rating >= star ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Your Review</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience with this product..."
                rows={4}
                className="w-full px-4 py-3 border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] resize-none"
              />
            </div>
            
            {/* Verified Purchase Badge */}
            <div className="flex items-center gap-2 mb-4 text-sm text-green-600">
              <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">✓</span>
              Verified Purchase
            </div>
            
            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setReviewModal({ isOpen: false, product: null })}
                className="flex-1 py-3 border border-[var(--border-color)] rounded-xl font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={reviewForm.rating === 0 || reviewSubmitting}
                className="flex-1 py-3 bg-[var(--primary-500)] text-white rounded-xl font-bold hover:bg-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Order Details Modal */}
      {orderDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Order #{selectedOrder.id.slice(0, 8)}
              </h2>
              <button
                onClick={() => setOrderDetailsModal(false)}
                className="text-2xl text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>
            </div>

            {/* Order Status */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-[var(--text-secondary)] mb-1">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                selectedOrder.status === 'completed' || selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-700' :
                selectedOrder.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                selectedOrder.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-700' :
                selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {selectedOrder.status?.replace(/_/g, ' ').charAt(0).toUpperCase() + selectedOrder.status?.slice(1).replace(/_/g, ' ')}
              </span>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Items</h3>
              <div className="space-y-3">
                {selectedOrder.order_items?.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    {item.products?.image_url && (
                      <img 
                        src={item.products.image_url} 
                        alt={item.products?.name} 
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-[var(--text-primary)]">{item.products?.name || 'Product'}</p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Quantity: {item.quantity} × {item.unit_price?.toLocaleString()} = {item.line_total?.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="mb-6 p-4 bg-green-50 border-t-2 border-green-300 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[var(--text-primary)]">Total Amount</span>
                <span className="text-2xl font-bold text-green-600">
                  {selectedOrder.total_amount?.toLocaleString()} FCFA
                </span>
              </div>
            </div>

            {/* Delivery Info */}
            {selectedOrder.delivery_address && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">Delivery Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold text-[var(--text-primary)]">Name:</span> {selectedOrder.delivery_name}</p>
                  <p><span className="font-semibold text-[var(--text-primary)]">Phone:</span> {selectedOrder.delivery_phone}</p>
                  <p><span className="font-semibold text-[var(--text-primary)]">Address:</span> {selectedOrder.delivery_address}</p>
                  <p><span className="font-semibold text-[var(--text-primary)]">City:</span> {selectedOrder.delivery_city}</p>
                </div>
              </div>
            )}

            {/* Order Date */}
            <div className="text-xs text-[var(--text-tertiary)] mb-6 pb-6 border-b border-[var(--border-light)]">
              Placed on {new Date(selectedOrder.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </div>

            {/* Close Button */}
            <div className="flex gap-3">
              <button
                onClick={() => setOrderDetailsModal(false)}
                className="flex-1 py-3 border border-[var(--border-color)] rounded-lg font-medium hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );

  const renderWishlist = () => (
    <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">My Wishlist</h3>
          <p className="text-sm text-[var(--text-secondary)]">{wishlistItems.length} items saved for later</p>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <FaHeart size={48} className="text-[var(--text-tertiary)] mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Your wishlist is empty</p>
          <button 
            onClick={() => navigate('/marketplace')}
            className="mt-4 px-6 py-2 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)]"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="border border-[var(--border-light)] rounded-xl overflow-hidden group hover:shadow-md transition-all">
              <div className="relative h-48 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <button 
                  onClick={() => toggleLikeProduct(item)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-500 shadow-md hover:bg-red-50 transition-colors"
                >
                  <FaHeart />
                </button>
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-gray-800">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-bold text-[var(--text-primary)] mb-1">{item.name}</h4>
                <p className="text-sm text-[var(--text-secondary)] mb-3">Sold by {item.farmer}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-[var(--primary-600)]">{item.price}</span>
                  <button
                    disabled={!item.inStock}
                    className="px-3 py-1.5 bg-[var(--primary-500)] text-white text-sm rounded-lg font-medium hover:bg-[var(--primary-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );

  const renderAddresses = () => (
    <motion.div {...fadeIn} className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">My Addresses</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)]">
          <FaPlus size={12} /> Add New
        </button>
      </div>
      <div className="space-y-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--border-light)] flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-[var(--text-primary)]">{addr.label}</span>
                {addr.isDefault && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">Default</span>
                )}
              </div>
              <p className="text-sm font-medium">{addr.name}</p>
              <p className="text-sm text-[var(--text-secondary)]">{addr.address}</p>
              <p className="text-sm text-[var(--text-secondary)]">{addr.city}, {addr.region}</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{addr.phone}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-600)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors">
                <FaEdit />
              </button>
              {!addr.isDefault && (
                <button className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <FaTrash />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderProfile = () => (
    <motion.div {...fadeIn} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-8">
      <div className="text-center mb-8">
        <div className="w-24 h-24 rounded-full bg-[var(--primary-100)] mx-auto mb-4 flex items-center justify-center text-[var(--primary-600)] text-3xl font-bold">
          {user?.full_name?.charAt(0) || 'C'}
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">{user?.full_name || 'Consumer'}</h2>
        <p className="text-[var(--text-secondary)]">Consumer Account</p>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" defaultValue={user?.full_name || ''} />
          <Input label="Email" type="email" defaultValue={user?.email || ''} />
        </div>
        <Input label="Phone Number" type="tel" defaultValue={user?.phone || ''} />

        <div className="pt-4">
          <button type="button" className="w-full py-3 bg-[var(--primary-500)] text-white font-bold rounded-xl hover:bg-[var(--primary-600)] transition-all">
            Save Profile
          </button>
        </div>
      </form>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <Navbar />

      <div className="pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className={`flex-shrink-0 w-full md:w-64 bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-4 h-fit sticky top-24 transition-all ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
            <div className="flex items-center gap-3 px-4 py-4 mb-4 border-b border-[var(--border-light)]">
              <div className="w-10 h-10 rounded-full bg-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)] font-bold text-sm">
                {user?.full_name?.charAt(0) || 'C'}
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)] text-sm">{user?.full_name || 'Customer'}</h3>
                <p className="text-xs text-[var(--text-secondary)]">Consumer Account</p>
              </div>
            </div>

            <nav className="space-y-1">
              <SidebarItem id={SECTIONS.DASHBOARD} icon={<FaHome />} label="Overview" />
              <SidebarItem id={SECTIONS.ORDERS} icon={<FaHistory />} label="Order History" />
              <SidebarItem id={SECTIONS.WISHLIST} icon={<FaHeart />} label="Wishlist" />
              <SidebarItem id={SECTIONS.ADDRESSES} icon={<FaMapMarkerAlt />} label="Addresses" />
              <SidebarItem id={SECTIONS.PROFILE} icon={<FaUserCircle />} label="Profile Settings" />
            </nav>

            <div className="mt-8 pt-4 border-t border-[var(--border-light)]">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium">
                <FaSignOutAlt />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeSection === SECTIONS.DASHBOARD && renderDashboardOverview()}
              {activeSection === SECTIONS.WISHLIST && renderWishlist()}
              {activeSection === SECTIONS.ORDERS && renderOrders()}
              {activeSection === SECTIONS.ADDRESSES && renderAddresses()}
              {activeSection === SECTIONS.PROFILE && renderProfile()}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ConsumerDashboard;