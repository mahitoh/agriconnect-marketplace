import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUsers,
  FaTractor,
  FaShoppingCart,
  FaMoneyBillWave,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaEdit,
  FaBan,
  FaDownload
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Input from '../../components/ui/input';
import { adminSummary, adminRecentActivity, adminTopFarmers } from '../../data/dashboardMock';

const SECTIONS = {
  OVERVIEW: 'overview',
  USERS: 'users',
  FARMERS: 'farmers',
  TRANSACTIONS: 'transactions',
  SETTINGS: 'settings'
};

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS.OVERVIEW);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mock Data for Admin Tables
  const usersList = [
    { id: 1, name: 'Alice Nkam', email: 'alice@example.com', role: 'Consumer', status: 'Active', joined: 'Feb 2024' },
    { id: 2, name: 'John Doe', email: 'john@example.com', role: 'Farmer', status: 'Pending', joined: 'Mar 2024' },
    { id: 3, name: 'Marie Nguema', email: 'marie@example.com', role: 'Consumer', status: 'Active', joined: 'Jan 2024' },
    { id: 4, name: 'Jean-Pierre', email: 'jp@farm.com', role: 'Farmer', status: 'Active', joined: 'Dec 2023' },
    { id: 5, name: 'Suspended User', email: 'bad@actor.com', role: 'Consumer', status: 'Suspended', joined: 'Mar 2024' }
  ];

  const transactionsList = [
    { id: 'TRX-9901', user: 'Alice Nkam', type: 'Order Payment', amount: '15,000 FCFA', status: 'Completed', date: 'Today, 10:30 AM' },
    { id: 'TRX-9902', user: 'Jean-Pierre', type: 'Payout', amount: '45,000 FCFA', status: 'Processing', date: 'Yesterday' },
    { id: 'TRX-9903', user: 'Marie Nguema', type: 'Order Payment', amount: '8,200 FCFA', status: 'Completed', date: '2 days ago' },
    { id: 'TRX-9904', user: 'System', type: 'Refund', amount: '2,500 FCFA', status: 'Completed', date: 'Last week' }
  ];

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

  const StatCard = ({ icon, label, value, color, trend }) => (
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

  const renderOverview = () => (
    <motion.div {...fadeIn} className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaUsers size={20} />}
          label="Total Users"
          value={adminSummary.totalUsers}
          trend={15.2}
          color="from-blue-500 to-blue-700"
        />
        <StatCard
          icon={<FaTractor size={20} />}
          label="Farmers"
          value={adminSummary.farmers}
          trend={8.5}
          color="from-[var(--primary-500)] to-[var(--primary-700)]"
        />
        <StatCard
          icon={<FaShoppingCart size={20} />}
          label="Active Orders"
          value={adminSummary.activeOrders}
          trend={12.0}
          color="from-[var(--secondary-500)] to-[var(--secondary-700)]"
        />
        <StatCard
          icon={<FaMoneyBillWave size={20} />}
          label="Monthly Volume"
          value={adminSummary.monthlyVolume}
          trend={24.5}
          color="from-[var(--accent-500)] to-[var(--accent-700)]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Recent Activity</h3>
            <button className="text-sm text-[var(--primary-600)] font-medium hover:underline">View Log</button>
          </div>
          <div className="space-y-4">
            {adminRecentActivity.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-light)] hover:bg-[var(--bg-secondary)] transition-all">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'New User' ? 'bg-blue-100 text-blue-600' :
                    item.type === 'New Order' ? 'bg-green-100 text-green-600' :
                      'bg-orange-100 text-orange-600'
                  }`}>
                  {item.type === 'New User' ? <FaUsers /> :
                    item.type === 'New Order' ? <FaShoppingCart /> : <FaExclamationTriangle />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-[var(--text-primary)]">{item.type}</span>
                    <span className="text-xs text-[var(--text-secondary)]">{item.time}</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--text-primary)]">{item.actor}</span> • {item.target}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Farmers */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Top Farmers</h3>
          </div>
          <div className="space-y-4">
            {adminTopFarmers.map((farmer, index) => (
              <div key={farmer.id} className="flex items-center gap-3 pb-4 border-b border-[var(--border-light)] last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-full bg-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)] font-bold text-xs">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[var(--text-primary)] text-sm">{farmer.name}</h4>
                  <p className="text-xs text-[var(--text-secondary)]">{farmer.region}</p>
                </div>
                <span className="font-bold text-[var(--primary-600)] text-sm">{farmer.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderUsers = () => (
    <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">User Management</h3>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-lg outline-none focus:border-[var(--primary-500)]"
            />
          </div>
          <button className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)]">
            <FaUserShield className="inline mr-2" /> Add Admin
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-[var(--text-secondary)] border-b border-[var(--border-light)]">
              <th className="pb-3 font-medium">User</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Joined</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {usersList.map((user) => (
              <tr key={user.id} className="border-b border-[var(--border-light)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors">
                <td className="py-4">
                  <div>
                    <p className="font-bold text-[var(--text-primary)]">{user.name}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{user.email}</p>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${user.role === 'Farmer' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${user.status === 'Active' ? 'bg-green-100 text-green-700' :
                      user.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {user.status === 'Active' && <FaCheckCircle size={10} />}
                    {user.status === 'Pending' && <FaExclamationTriangle size={10} />}
                    {user.status === 'Suspended' && <FaBan size={10} />}
                    {user.status}
                  </span>
                </td>
                <td className="py-4 text-[var(--text-secondary)]">{user.joined}</td>
                <td className="py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-600)] hover:bg-gray-100 rounded-lg">
                      <FaEdit />
                    </button>
                    <button className="p-2 text-[var(--text-secondary)] hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <FaBan />
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

  const renderFarmers = () => (
    <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Farmer Status</h3>
        <button className="text-sm text-[var(--primary-600)] font-medium">Export List</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-[var(--text-secondary)] border-b border-[var(--border-light)]">
              <th className="pb-3 font-medium">Farm Name</th>
              <th className="pb-3 font-medium">Region</th>
              <th className="pb-3 font-medium">Revenue</th>
              <th className="pb-3 font-medium">Verification</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {usersList.filter(u => u.role === 'Farmer').concat([
              { id: 101, name: 'Ferme Bio Mballa', role: 'Farmer', email: 'contact@mballa.cm', status: 'Active', joined: '2023' },
              { id: 102, name: 'Les Jardins de Mama', role: 'Farmer', email: 'mama@jardins.cm', status: 'Active', joined: '2023' }
            ]).slice(0, 5).map((farmer) => (
              <tr key={farmer.id} className="border-b border-[var(--border-light)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors">
                <td className="py-4 font-bold text-[var(--text-primary)]">{farmer.name}</td>
                <td className="py-4 text-[var(--text-secondary)]">Region Info</td>
                <td className="py-4 font-medium text-[var(--primary-600)]">-</td>
                <td className="py-4">
                  {farmer.status === 'Active' ? (
                    <span className="text-green-600 flex items-center gap-1 text-xs font-bold"><FaCheckCircle /> Verified</span>
                  ) : (
                    <span className="text-yellow-600 flex items-center gap-1 text-xs font-bold"><FaExclamationTriangle /> Pending</span>
                  )}
                </td>
                <td className="py-4 text-right">
                  <button className="px-3 py-1 border rounded hover:bg-gray-50 text-xs font-medium">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderTransactions = () => (
    <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Platform Transactions</h3>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-secondary)] rounded-lg text-sm font-medium hover:bg-gray-200">
          <FaDownload size={12} /> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-[var(--text-secondary)] border-b border-[var(--border-light)]">
              <th className="pb-3 font-medium">Transaction ID</th>
              <th className="pb-3 font-medium">User</th>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {transactionsList.map((trx) => (
              <tr key={trx.id} className="border-b border-[var(--border-light)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors">
                <td className="py-4 font-medium text-[var(--text-tertiary)]">{trx.id}</td>
                <td className="py-4 font-medium">{trx.user}</td>
                <td className="py-4 text-[var(--text-secondary)]">{trx.type}</td>
                <td className="py-4 font-bold text-[var(--text-primary)]">{trx.amount}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${trx.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      trx.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                    {trx.status}
                  </span>
                </td>
                <td className="py-4 text-[var(--text-tertiary)]">{trx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div {...fadeIn} className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-8">
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Platform Settings</h3>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Site Name" defaultValue="AgriConnect Marketplace" />
          <Input label="Support Email" defaultValue="support@agriconnect.cm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Platform Fee (%)" type="number" defaultValue="5" />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Currency</label>
            <select className="px-4 py-3 rounded-xl border-2 border-[var(--border-color)] bg-white outline-none">
              <option>FCFA (XAF)</option>
              <option>USD ($)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border-light)] mt-4">
          <h4 className="font-bold text-[var(--text-primary)] mb-4">Security Settings</h4>
          <div className="flex items-center gap-2 mb-4">
            <input type="checkbox" id="2fa" className="w-5 h-5 accent-[var(--primary-600)]" defaultChecked />
            <label htmlFor="2fa" className="text-sm text-[var(--text-primary)]">Require 2FA for Admin accounts</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="verify" className="w-5 h-5 accent-[var(--primary-600)]" defaultChecked />
            <label htmlFor="verify" className="text-sm text-[var(--text-primary)]">Manual verification for new Farmers</label>
          </div>
        </div>

        <div className="pt-6">
          <button type="button" className="px-8 py-3 bg-[var(--primary-500)] text-white font-bold rounded-xl hover:bg-[var(--primary-600)] transition-all">
            Save Configuration
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
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <FaUserShield size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)] text-sm">Administrator</h3>
                <p className="text-xs text-[var(--text-secondary)]">Super Admin</p>
              </div>
            </div>

            <nav className="space-y-1">
              <SidebarItem id={SECTIONS.OVERVIEW} icon={<FaChartLine />} label="Overview" />
              <SidebarItem id={SECTIONS.USERS} icon={<FaUsers />} label="Users" />
              <SidebarItem id={SECTIONS.FARMERS} icon={<FaTractor />} label="Farmers" />
              <SidebarItem id={SECTIONS.TRANSACTIONS} icon={<FaMoneyBillWave />} label="Transactions" />
              <SidebarItem id={SECTIONS.SETTINGS} icon={<FaCog />} label="Settings" />
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
              {activeSection === SECTIONS.OVERVIEW && renderOverview()}
              {activeSection === SECTIONS.USERS && renderUsers()}
              {activeSection === SECTIONS.FARMERS && renderFarmers()}
              {activeSection === SECTIONS.TRANSACTIONS && renderTransactions()}
              {activeSection === SECTIONS.SETTINGS && renderSettings()}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
