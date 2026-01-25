import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { consumerSummary, consumerRecentOrders, consumerSuggestions } from '../../data/dashboardMock';

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

  // Local Wishlist Data
  const wishlistItems = [
    { id: 1, name: 'Organic Tomatoes', farmer: 'Ferme Mballa', price: '2,500 FCFA', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&h=200&fit=crop', inStock: true },
    { id: 2, name: 'Fresh Honey', farmer: 'Beekeeping Co.', price: '5,000 FCFA', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784502?w=200&h=200&fit=crop', inStock: true },
    { id: 3, name: 'Sweet Potatoes', farmer: 'Root Farms', price: '3,000 FCFA', image: 'https://images.unsplash.com/photo-1596097635121-14b63b7a7843?w=200&h=200&fit=crop', inStock: false }
  ];

  // Dummy Addresses
  const addresses = [
    { id: 1, label: 'Home', name: 'Marie Nguema', phone: '+237 677 123 456', address: '123 Main St, Akwa', city: 'Douala', region: 'Littoral', isDefault: true },
    { id: 2, label: 'Office', name: 'Marie Nguema', phone: '+237 677 123 456', address: 'Business Park, Bonanjo', city: 'Douala', region: 'Littoral', isDefault: false }
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
            <h2 className="text-3xl font-bold mb-2">Welcome back, {consumerSummary.name.split(' ')[0]}! 👋</h2>
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
          value={consumerSummary.totalSpent}
          color="from-[var(--primary-500)] to-[var(--primary-700)]"
        />
        <StatCard
          icon={<FaShoppingBag size={20} />}
          label="Orders Placed"
          value={consumerSummary.ordersCount}
          color="from-[var(--secondary-500)] to-[var(--secondary-700)]"
        />
        <StatCard
          icon={<FaHeart size={20} />}
          label="Saved Items"
          value="12"
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
          {consumerRecentOrders.map((order) => (
            <div key={order.id} className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl border border-[var(--border-light)] hover:bg-[var(--bg-secondary)] transition-all group cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)] font-bold text-lg">
                📦
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1">
                  <h4 className="font-bold text-[var(--text-primary)]">Order #{order.id}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'On the way' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                    }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">From {order.farmer} • {order.date}</p>
              </div>
              <div className="text-right flex flex-col items-center md:items-end">
                <span className="font-bold text-[var(--primary-600)]">{order.total}</span>
                <button className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary-600)] transition-colors flex items-center gap-1 mt-1">
                  Details <FaChevronRight size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderOrders = () => (
    <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Order History</h3>
      <div className="space-y-4">
        {/* Extended list simulation using existing data */}
        {[...consumerRecentOrders, ...consumerRecentOrders].map((order, index) => (
          <div key={`${order.id}-${index}`} className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl border border-[var(--border-light)] hover:bg-[var(--bg-secondary)] transition-all">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-[var(--text-primary)]">Order #{order.id}</span>
                <span className="font-bold text-[var(--primary-600)]">{order.total}</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">Purchased from: <span className="font-medium">{order.farmer}</span></p>
              <p className="text-xs text-[var(--text-tertiary)]">{order.date}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-[var(--border-color)] rounded-lg text-sm font-medium hover:bg-gray-50">View Invoice</button>
              <button className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-600)]">Reorder</button>
            </div>
          </div>
        ))}
      </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="border border-[var(--border-light)] rounded-xl overflow-hidden group hover:shadow-md transition-all">
            <div className="relative h-48 overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-500 shadow-md hover:bg-red-50 transition-colors">
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
          {consumerSummary.name.charAt(0)}
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">{consumerSummary.name}</h2>
        <p className="text-[var(--text-secondary)]">Consumer Account</p>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" defaultValue={consumerSummary.name} />
          <Input label="Email" type="email" defaultValue="marie.nguema@email.cm" />
        </div>
        <Input label="Phone Number" type="tel" defaultValue="+237 677 123 456" />

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
              <div className="w-10 h-10 rounded-full bg-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)]">
                <FaUserCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)] text-sm">{consumerSummary.name}</h3>
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