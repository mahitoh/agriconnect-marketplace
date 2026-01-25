import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaShoppingBasket,
  FaBoxOpen,
  FaMoneyBillWave,
  FaCheckCircle,
  FaPlusCircle,
  FaClipboardList,
  FaCreditCard,
  FaChartLine,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUserCircle,
  FaBell,
  FaEdit,
  FaTrash,
  FaSearch,
  FaPaperPlane,
  FaExclamationTriangle
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Input from '../../components/ui/input';
import {
  farmerSummary,
  farmerRecentOrders,
  farmerProducts,
  farmerPayments,
  farmerInventory,
  farmerNotifications,
  farmerSupportTickets
} from '../../data/dashboardMock';

const SECTIONS = {
  DASHBOARD: 'dashboard',
  PRODUCTS: 'products',
  ADD_PRODUCT: 'addProduct',
  ORDERS: 'orders',
  PAYMENTS: 'payments',
  INVENTORY: 'inventory',
  PROFILE: 'profile',
  NOTIFICATIONS: 'notifications',
  SUPPORT: 'support'
};

const FarmerDashboard = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Animation variants
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

  const StatCard = ({ icon, label, value, trend, color }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--border-light)] relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-bl-full transition-transform group-hover:scale-110`} />
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-md`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-[var(--text-secondary)] text-sm font-medium">{label}</h3>
      <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{value}</p>
    </motion.div>
  );

  const renderDashboardOverview = () => (
    <motion.div {...fadeIn} className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaMoneyBillWave size={20} />}
          label="Total Revenue"
          value={farmerSummary.revenueThisMonth}
          trend={12.5}
          color="from-[var(--primary-500)] to-[var(--primary-700)]"
        />
        <StatCard
          icon={<FaShoppingBasket size={20} />}
          label="Total Orders"
          value={farmerSummary.ordersThisMonth}
          trend={8.2}
          color="from-[var(--secondary-500)] to-[var(--secondary-700)]"
        />
        <StatCard
          icon={<FaBoxOpen size={20} />}
          label="Active Products"
          value={farmerSummary.activeProducts}
          trend={0}
          color="from-[var(--accent-500)] to-[var(--accent-700)]"
        />
        <StatCard
          icon={<FaCheckCircle size={20} />}
          label="Fulfillment Rate"
          value={farmerSummary.fulfillmentRate}
          trend={2.4}
          color="from-blue-500 to-blue-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Recent Orders</h3>
            <button
              onClick={() => setActiveSection(SECTIONS.ORDERS)}
              className="text-sm text-[var(--primary-600)] font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-[var(--text-secondary)] border-b border-[var(--border-light)]">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {farmerRecentOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-[var(--border-light)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="py-4 font-medium text-[var(--primary-600)]">#{order.id}</td>
                    <td className="py-4">{order.customer}</td>
                    <td className="py-4 font-medium">{order.total}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-[var(--text-tertiary)]">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Alert Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Inventory Alerts</h3>
          </div>
          <div className="space-y-4">
            {farmerInventory.filter(i => i.quantity <= i.lowStockThreshold).map(item => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-red-50 border border-red-100">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                  <FaExclamationTriangle />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-[var(--text-primary)]">{item.name}</h4>
                  <p className="text-xs text-red-600 font-medium">Only {item.quantity} left in stock</p>
                </div>
                <button
                  onClick={() => setActiveSection(SECTIONS.INVENTORY)}
                  className="text-xs font-bold px-3 py-1.5 bg-white rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  Manage
                </button>
              </div>
            ))}
            {farmerInventory.filter(i => i.quantity <= i.lowStockThreshold).length === 0 && (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                <FaCheckCircle className="mx-auto mb-2 text-green-500" size={24} />
                <p>All stock levels are healthy!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderProducts = () => (
    <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">My Products</h3>
          <p className="text-sm text-[var(--text-secondary)]">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setActiveSection(SECTIONS.ADD_PRODUCT)}
          className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-xl font-medium hover:bg-[var(--primary-600)] transition-colors flex items-center gap-2 shadow-lg shadow-[var(--primary-500)]/20"
        >
          <FaPlusCircle /> Add New Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-[var(--text-secondary)] border-b border-[var(--border-light)]">
              <th className="pb-3 font-medium">Product Name</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">Stock</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {farmerProducts.map((product) => (
              <tr key={product.id} className="border-b border-[var(--border-light)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors">
                <td className="py-4 font-medium">{product.name}</td>
                <td className="py-4">
                  <span className="px-2 py-1 bg-[var(--secondary-50)] text-[var(--secondary-700)] rounded-md text-xs font-medium border border-[var(--secondary-200)]">
                    {product.category}
                  </span>
                </td>
                <td className="py-4 font-medium text-[var(--primary-600)]">{product.price}</td>
                <td className="py-4">{product.quantity}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {product.status}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary-600)] transition-colors">
                      <FaEdit />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg text-[var(--text-secondary)] hover:text-red-500 transition-colors">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderAddProduct = () => (
    <motion.div {...fadeIn} className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-8">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">Add New Product</h3>
        <p className="text-[var(--text-secondary)]">Fill in the details to list a new product on the marketplace.</p>
      </div>

      <form className="space-y-6">
        <Input label="Product Name" placeholder="e.g. Organic Tomatoes" required />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Category</label>
            <select className="px-4 py-3 rounded-xl border-2 border-[var(--border-color)] focus:border-[var(--primary-500)] outline-none bg-white">
              <option value="">Select Category</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="grains">Grains</option>
            </select>
          </div>
          <Input label="Price (FCFA)" type="number" placeholder="0.00" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Quantity Available" type="number" placeholder="0" required />
          <Input label="Harvest Location" placeholder="e.g. Bamenda" required />
        </div>

        <div className="form-group flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Description</label>
          <textarea
            rows="4"
            className="px-4 py-3 rounded-xl border-2 border-[var(--border-color)] focus:border-[var(--primary-500)] outline-none resize-none"
            placeholder="Describe your product..."
          />
        </div>

        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={() => setActiveSection(SECTIONS.PRODUCTS)}
            className="px-6 py-3 rounded-xl border-2 border-[var(--border-color)] font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 px-6 py-3 rounded-xl bg-[var(--primary-500)] text-white font-bold hover:bg-[var(--primary-600)] transition-colors shadow-lg shadow-[var(--primary-500)]/20"
          >
            Publish Product
          </button>
        </div>
      </form>
    </motion.div>
  );

  const renderOrders = () => (
    <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Manage Orders</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-sm font-medium hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]">All Status</button>
          <button className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-sm font-medium hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]">Export CSV</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-[var(--text-secondary)] border-b border-[var(--border-light)]">
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Total</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {farmerRecentOrders.map((order) => (
              <tr key={order.id} className="border-b border-[var(--border-light)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors">
                <td className="py-4 font-medium text-[var(--primary-600)]">{order.id}</td>
                <td className="py-4">{order.customer}</td>
                <td className="py-4 font-medium">{order.total}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                    }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 text-[var(--text-tertiary)]">{order.date}</td>
                <td className="py-4 text-right">
                  <button className="text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium text-sm">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderPayments = () => (
    <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Transaction History</h3>
          <p className="text-sm text-[var(--text-secondary)]">Track your earnings and payouts</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-[var(--text-secondary)]">Total Revenue</p>
          <p className="text-xl font-bold text-[var(--primary-600)]">{farmerSummary.revenueThisMonth}</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-[var(--text-secondary)] border-b border-[var(--border-light)]">
              <th className="pb-3 font-medium">Reference</th>
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {farmerPayments.map((payment) => (
              <tr key={payment.id} className="border-b border-[var(--border-light)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors">
                <td className="py-4 font-medium text-[var(--text-primary)]">{payment.reference}</td>
                <td className="py-4 text-[var(--primary-600)]">{payment.orderId}</td>
                <td className="py-4 font-bold">{payment.amount}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${payment.status === 'Successful' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="py-4 text-[var(--text-tertiary)]">{payment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderInventory = () => (
    <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Inventory Management</h3>
        <p className="text-sm text-[var(--text-secondary)]">Monitor stock levels and restock items</p>
      </div>
      <div className="space-y-4">
        {farmerInventory.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 border border-[var(--border-light)] rounded-xl hover:bg-[var(--bg-secondary)] transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.quantity <= item.lowStockThreshold ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                <FaBoxOpen />
              </div>
              <div>
                <h4 className="font-bold text-[var(--text-primary)]">{item.name}</h4>
                <p className={`text-xs font-medium ${item.quantity <= item.lowStockThreshold ? 'text-red-500' : 'text-green-500'
                  }`}>
                  {item.quantity} units in stock
                </p>
              </div>
            </div>
            <button className="px-4 py-2 border border-[var(--border-color)] bg-white hover:bg-[var(--bg-secondary)] rounded-lg text-sm font-medium text-[var(--text-secondary)]">
              Update Stock
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderNotifications = () => (
    <motion.div {...fadeIn} className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Notifications</h3>
        <button className="text-sm text-[var(--primary-600)] font-medium hover:underline">Mark all as read</button>
      </div>
      <div className="space-y-4">
        {farmerNotifications.map((notif) => (
          <div key={notif.id} className={`flex gap-4 p-4 rounded-xl ${notif.read ? 'bg-white' : 'bg-blue-50'} border border-[var(--border-light)]`}>
            <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'order' ? 'bg-green-100 text-green-600' :
                notif.type === 'payment' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
              <FaBell size={14} />
            </div>
            <div className="flex-1">
              <p className={`text-sm ${notif.read ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)] font-medium'}`}>
                {notif.message}
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">{notif.time}</p>
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
          {farmerSummary.name.charAt(0)}
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">{farmerSummary.name}</h2>
        <p className="text-[var(--text-secondary)]">{farmerSummary.farmName}</p>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" defaultValue={farmerSummary.name} />
          <Input label="Farm Name" defaultValue={farmerSummary.farmName} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Email" type="email" defaultValue="farmer@example.com" />
          <Input label="Phone" type="tel" defaultValue="+237 6XX XXX XXX" />
        </div>
        <Input label="Location" defaultValue="Bamenda, North West" />

        <div className="pt-4">
          <button type="button" className="w-full py-3 bg-[var(--primary-500)] text-white font-bold rounded-xl hover:bg-[var(--primary-600)] transition-all">
            Save Changes
          </button>
        </div>
      </form>
    </motion.div>
  );

  const renderSupport = () => (
    <motion.div {...fadeIn} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Contact Support</h3>
        <form className="space-y-4">
          <Input label="Subject" placeholder="Briefly describe your issue" />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Message</label>
            <textarea
              rows="4"
              className="px-4 py-3 rounded-xl border-2 border-[var(--border-color)] focus:border-[var(--primary-500)] outline-none resize-none"
              placeholder="How can we help you?"
            />
          </div>
          <button className="w-full py-3 bg-[var(--primary-500)] text-white font-bold rounded-xl hover:bg-[var(--primary-600)] transition-all flex items-center justify-center gap-2">
            <FaPaperPlane /> Send Message
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Recent Tickets</h3>
        <div className="space-y-4">
          {farmerSupportTickets.map((ticket) => (
            <div key={ticket.id} className="p-4 border border-[var(--border-light)] rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-[var(--text-primary)]">{ticket.id}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                  {ticket.status}
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-2">{ticket.subject}</p>
              <p className="text-xs text-[var(--text-tertiary)]">{ticket.date}</p>
            </div>
          ))}
          {farmerSupportTickets.length === 0 && (
            <p className="text-center text-[var(--text-secondary)] py-4">No tickets found.</p>
          )}
        </div>
      </div>
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
                <h3 className="font-bold text-[var(--text-primary)] text-sm">{farmerSummary.name}</h3>
                <p className="text-xs text-[var(--text-secondary)]">Farmer Account</p>
              </div>
            </div>

            <nav className="space-y-1">
              <SidebarItem id={SECTIONS.DASHBOARD} icon={<FaChartLine />} label="Overview" />
              <SidebarItem id={SECTIONS.PRODUCTS} icon={<FaBoxOpen />} label="Products" />
              <SidebarItem id={SECTIONS.ADD_PRODUCT} icon={<FaPlusCircle />} label="Add Product" />
              <SidebarItem id={SECTIONS.ORDERS} icon={<FaClipboardList />} label="Orders" />
              <SidebarItem id={SECTIONS.PAYMENTS} icon={<FaCreditCard />} label="Payments" />
              <SidebarItem id={SECTIONS.INVENTORY} icon={<FaExclamationTriangle />} label="Inventory" />
              <SidebarItem id={SECTIONS.NOTIFICATIONS} icon={<FaBell />} label="Notifications" />
              <SidebarItem id={SECTIONS.PROFILE} icon={<FaUserCircle />} label="Profile" />
              <SidebarItem id={SECTIONS.SUPPORT} icon={<FaQuestionCircle />} label="Support" />
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
              {activeSection === SECTIONS.PRODUCTS && renderProducts()}
              {activeSection === SECTIONS.ADD_PRODUCT && renderAddProduct()}
              {activeSection === SECTIONS.ORDERS && renderOrders()}
              {activeSection === SECTIONS.PAYMENTS && renderPayments()}
              {activeSection === SECTIONS.INVENTORY && renderInventory()}
              {activeSection === SECTIONS.NOTIFICATIONS && renderNotifications()}
              {activeSection === SECTIONS.PROFILE && renderProfile()}
              {activeSection === SECTIONS.SUPPORT && renderSupport()}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FarmerDashboard;
