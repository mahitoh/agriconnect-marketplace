import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  FaDownload,
  FaTimes,
  FaArrowLeft,
  FaStar,
  FaBox
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Input from '../../components/ui/input';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS } from '../../config/api';
import { authFetch } from '../../utils/authFetch';

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pendingFarmers, setPendingFarmers] = useState([]);
  const [loadingFarmers, setLoadingFarmers] = useState(false);
  const [farmerError, setFarmerError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState(null);
  
  // User detail modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [userDetailsError, setUserDetailsError] = useState(null);
  
  // Suspend user modal state
  const [suspendModal, setSuspendModal] = useState({ open: false, user: null });
  const [suspendLoading, setSuspendLoading] = useState(false);

  // Unsuspend user modal state
  const [unsuspendModal, setUnsuspendModal] = useState({ open: false, user: null });
  const [unsuspendLoading, setUnsuspendLoading] = useState(false);

  // Add admin modal state
  const [addAdminModal, setAddAdminModal] = useState(false);
  const [selectedAdminUserId, setSelectedAdminUserId] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  // User search + selection
  const [userSearch, setUserSearch] = useState('');

  // Edit profile modal state
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editData, setEditData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Farmer action handlers
  const [farmerAction, setFarmerAction] = useState(null); // { type: 'approve'|'reject', farmer: {} }

  // Real dashboard data
  const [recentActivity, setRecentActivity] = useState([]);
  const [topFarmers, setTopFarmers] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  // Transactions data
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState(null);

  // Dashboard analytics
  const [dashboardStats, setDashboardStats] = useState(null);

  // Fetch all users from backend
  React.useEffect(() => {
    const fetchAllUsers = async () => {
      setLoadingUsers(true);
      setUsersError(null);
      try {
        const response = await authFetch(API_ENDPOINTS.ADMIN_USERS, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        console.log('👥 All users fetched:', data);
        setAllUsers(data.data?.users || []);
      } catch (error) {
        console.error('❌ Error fetching users:', error);
        setUsersError(error.message);
      } finally {
        setLoadingUsers(false);
      }
    };

    // Only fetch if user is admin
    if (user?.role === 'admin') {
      fetchAllUsers();
    }
  }, [user?.role]);

  // Fetch real activity and top farmers from admin API
  React.useEffect(() => {
    const fetchActivityAndFarmers = async () => {
      setActivityLoading(true);
      try {
        // Fetch recent activity from admin analytics endpoint
        const [activityRes, farmersRes, dashboardRes] = await Promise.all([
          authFetch(API_ENDPOINTS.ADMIN_ACTIVITY, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          }),
          authFetch(API_ENDPOINTS.ADMIN_TOP_FARMERS, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          }),
          authFetch(API_ENDPOINTS.ADMIN_DASHBOARD, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          })
        ]);

        // Process activity
        if (activityRes.ok) {
          const activityData = await activityRes.json();
          const activities = (activityData.data?.activities || []).slice(0, 10).map(a => ({
            id: a.id,
            type: a.type === 'order' ? 'Order Placed' : a.type === 'product' ? 'Product Added' : 'Review Posted',
            actor: a.description?.split(' ')[0] || 'User',
            target: a.description || '',
            time: new Date(a.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            rawType: a.type
          }));
          setRecentActivity(activities);
        }

        // Process top farmers
        if (farmersRes.ok) {
          const farmersData = await farmersRes.json();
          const farmers = (farmersData.data?.farmers || []).map(f => ({
            id: f.id,
            name: f.name,
            phone: f.phone || '',
            revenue: `${Math.floor(f.revenue).toLocaleString()} FCFA`,
            orderCount: f.orderCount,
            productsSold: f.productsSold
          }));
          setTopFarmers(farmers);
        }

        // Process dashboard stats
        if (dashboardRes.ok) {
          const dashData = await dashboardRes.json();
          setDashboardStats(dashData.data);
        }
      } catch (error) {
        console.error('❌ Error fetching activity and farmers:', error);
      } finally {
        setActivityLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchActivityAndFarmers();
    }
  }, [user?.role]);

  // Fetch real transactions
  React.useEffect(() => {
    const fetchTransactions = async () => {
      setTransactionsLoading(true);
      setTransactionsError(null);
      try {
        const response = await authFetch(API_ENDPOINTS.ADMIN_TRANSACTIONS, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();
        console.log('💰 Transactions fetched:', data);
        setTransactions(data.data?.transactions || []);
      } catch (error) {
        console.error('❌ Error fetching transactions:', error);
        setTransactionsError(error.message);
      } finally {
        setTransactionsLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchTransactions();
    }
  }, [user?.role]);

  // View user details
  const handleViewUserDetails = async (userId) => {
    setSelectedUser(userId);
    setUserDetails(null);
    setLoadingUserDetails(true);
    setUserDetailsError(null);
    try {
      const response = await authFetch(`${API_ENDPOINTS.ADMIN_USERS}/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      console.log('👤 User details fetched:', data);
      setUserDetails(data.data);
    } catch (error) {
      console.error('❌ Error fetching user details:', error);
      setUserDetailsError(error.message);
    } finally {
      setLoadingUserDetails(false);
    }
  };

  // Handle suspend user
  const handleSuspendUser = (user) => {
    setSuspendModal({ open: true, user });
  };

  // Submit suspend user
  const submitSuspendUser = async () => {
    if (!suspendModal.user) return;
    
    setSuspendLoading(true);
    try {
      const endpoint = `${API_ENDPOINTS.ADMIN_USERS}/${suspendModal.user.id}/suspend`;
      console.log('🔗 Suspending user at:', endpoint);
      console.log('📋 User data:', suspendModal.user);
      console.log('👤 User ID being sent:', suspendModal.user.id);
      
      const response = await authFetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({message: 'Unknown error'}));
        console.error('📊 Error response:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to suspend user`);
      }

      const data = await response.json();
      console.log('✅ User suspended:', data);
      
      // Update users list
      setAllUsers(allUsers.map(u => 
        u.id === suspendModal.user.id 
          ? { ...u, suspended: true }
          : u
      ));

      // Close modal
      setSuspendModal({ open: false, user: null });
      
      alert(`${suspendModal.user.full_name} has been suspended`);
    } catch (error) {
      console.error('❌ Error suspending user:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setSuspendLoading(false);
    }
  };

  // Handle unsuspend user
  const handleUnsuspendUser = (user) => {
    setUnsuspendModal({ open: true, user });
  };

  // Submit unsuspend user
  const submitUnsuspendUser = async () => {
    if (!unsuspendModal.user) return;
    
    setUnsuspendLoading(true);
    try {
      const endpoint = `${API_ENDPOINTS.ADMIN_USERS}/${unsuspendModal.user.id}/unsuspend`;
      console.log('🔗 Unsuspending user at:', endpoint);
      
      const response = await authFetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({message: 'Unknown error'}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to unsuspend user`);
      }

      const data = await response.json();
      console.log('✅ User unsuspended:', data);
      
      // Update users list
      setAllUsers(allUsers.map(u => 
        u.id === unsuspendModal.user.id 
          ? { ...u, suspended: false }
          : u
      ));

      // Close modal
      setUnsuspendModal({ open: false, user: null });
      
      alert(`${unsuspendModal.user.full_name} has been unsuspended`);
    } catch (error) {
      console.error('❌ Error unsuspending user:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setUnsuspendLoading(false);
    }
  };

  // Handle approve farmer
  const handleApproveFarmer = async (farmer) => {
    setFarmerAction({ type: 'approve', farmer });
  };

  const submitApproveFarmer = async () => {
    if (!farmerAction?.farmer) return;
    
    try {
      const response = await authFetch(`${API_ENDPOINTS.ADMIN_APPROVE_FARMER}/${farmerAction.farmer.id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to approve farmer');
      }

      console.log('✅ Farmer approved');
      setPendingFarmers(pendingFarmers.filter(f => f.id !== farmerAction.farmer.id));
      setFarmerAction(null);
      alert(`${farmerAction.farmer.full_name} has been approved`);
    } catch (error) {
      console.error('❌ Error approving farmer:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Handle reject farmer
  const handleRejectFarmer = async (farmer) => {
    setFarmerAction({ type: 'reject', farmer });
  };

  const submitRejectFarmer = async () => {
    if (!farmerAction?.farmer) return;
    
    try {
      const response = await authFetch(`${API_ENDPOINTS.ADMIN_REJECT_FARMER}/${farmerAction.farmer.id}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reject farmer');
      }

      console.log('✅ Farmer rejected');
      setPendingFarmers(pendingFarmers.filter(f => f.id !== farmerAction.farmer.id));
      setFarmerAction(null);
      alert(`${farmerAction.farmer.full_name} has been rejected`);
    } catch (error) {
      console.error('❌ Error rejecting farmer:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Handle add admin
  const handleAddAdmin = async () => {
    if (!selectedAdminUserId) {
      alert('Please select a user to promote');
      return;
    }

    setAdminLoading(true);
    try {
      const response = await authFetch(`${API_ENDPOINTS.ADMIN_USERS}/${selectedAdminUserId}/promote`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to add admin');
      }

      const data = await response.json();
      console.log('✅ Admin added:', data);
      setAllUsers(allUsers.map(u => 
        u.id === selectedAdminUserId
          ? { ...u, role: 'admin', approved: true }
          : u
      ));
      setAddAdminModal(false);
      setSelectedAdminUserId('');
      alert(`${selectedAdminUser?.full_name || 'User'} is now an admin`);
    } catch (error) {
      console.error('❌ Error adding admin:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setAdminLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  // Handle edit profile
  const handleEditProfile = async () => {
    setEditLoading(true);
    try {
      const response = await authFetch(API_ENDPOINTS.PROFILE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      console.log('✅ Profile updated');
      setEditProfileModal(false);
      alert('Profile has been updated successfully');
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setEditLoading(false);
    }
  };

  // Fetch pending farmers from backend
  React.useEffect(() => {
    const fetchPendingFarmers = async () => {
      setLoadingFarmers(true);
      setFarmerError(null);
      try {
        const response = await authFetch(API_ENDPOINTS.ADMIN_PENDING_FARMERS, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch pending farmers');
        }

        const data = await response.json();
        console.log('📋 Pending farmers fetched:', data);
        setPendingFarmers(data.data?.farmers || []);
      } catch (error) {
        console.error('❌ Error fetching pending farmers:', error);
        setFarmerError(error.message);
      } finally {
        setLoadingFarmers(false);
      }
    };

    // Only fetch if user is admin
    if (user?.role === 'admin') {
      fetchPendingFarmers();
    }
  }, [user?.role]);

  // Export transactions to CSV
  const exportTransactionsCSV = () => {
    if (transactions.length === 0) {
      alert('No transactions to export');
      return;
    }

    const headers = ['Transaction ID', 'Customer', 'Phone', 'Type', 'Amount (FCFA)', 'Payment Status', 'Order Status', 'Date'];
    const rows = transactions.map(trx => [
      trx.orderId,
      trx.customer,
      trx.customerPhone,
      trx.type,
      trx.amount,
      trx.status,
      trx.orderStatus,
      new Date(trx.date).toLocaleString()
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agriconnect-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Format payment status for display
  const formatStatus = (status) => {
    const statusMap = {
      'pending_payment': 'Pending',
      'paid': 'Completed',
      'successful': 'Completed',
      'processing': 'Processing',
      'completed': 'Completed',
      'failed': 'Failed',
      'cancelled': 'Cancelled',
      'refunded': 'Refunded',
      'initiated': 'Initiated',
      'expired': 'Expired'
    };
    return statusMap[status] || status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown';
  };

  const getStatusColor = (status) => {
    const s = formatStatus(status);
    if (s === 'Completed') return 'bg-green-100 text-green-700';
    if (s === 'Processing') return 'bg-blue-100 text-blue-700';
    if (s === 'Pending' || s === 'Initiated') return 'bg-yellow-100 text-yellow-700';
    if (s === 'Failed' || s === 'Cancelled') return 'bg-red-100 text-red-700';
    if (s === 'Refunded') return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  const normalizedUserSearch = userSearch.trim().toLowerCase();
  const filteredUsers = allUsers.filter((u) => {
    if (!normalizedUserSearch) return true;
    return (
      (u.full_name || '').toLowerCase().includes(normalizedUserSearch) ||
      (u.phone || '').toLowerCase().includes(normalizedUserSearch) ||
      (u.role || '').toLowerCase().includes(normalizedUserSearch)
    );
  });
  const adminEligibleUsers = allUsers.filter((u) => u.role !== 'admin');
  const selectedAdminUser = allUsers.find((u) => u.id === selectedAdminUserId);

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
          value={dashboardStats?.overview?.totalUsers ?? allUsers.length}
          color="from-blue-500 to-blue-700"
        />
        <StatCard
          icon={<FaTractor size={20} />}
          label="Farmers"
          value={dashboardStats?.overview?.totalFarmers ?? allUsers.filter(u => u.role === 'farmer').length}
          color="from-[var(--primary-500)] to-[var(--primary-700)]"
        />
        <StatCard
          icon={<FaShoppingCart size={20} />}
          label="Total Orders"
          value={dashboardStats?.overview?.totalOrders ?? 0}
          color="from-[var(--secondary-500)] to-[var(--secondary-700)]"
        />
        <StatCard
          icon={<FaMoneyBillWave size={20} />}
          label="Revenue"
          value={`${(dashboardStats?.overview?.totalRevenue ?? 0).toLocaleString()} FCFA`}
          color="from-green-500 to-green-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Recent Activity</h3>
            <span className="text-sm text-[var(--text-secondary)]">{recentActivity.length} events</span>
          </div>
          <div className="space-y-4">
            {activityLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--primary-500)] border-t-transparent"></div>
              </div>
            ) : recentActivity.length === 0 ? (
              <p className="text-center py-8 text-[var(--text-secondary)]">No recent activity</p>
            ) : (
              recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-light)] hover:bg-[var(--bg-secondary)] transition-all">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.rawType === 'order' ? 'bg-green-100 text-green-600' :
                    item.rawType === 'product' ? 'bg-blue-100 text-blue-600' :
                    item.rawType === 'review' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {item.rawType === 'order' ? <FaShoppingCart /> :
                     item.rawType === 'product' ? <FaBox /> :
                     item.rawType === 'review' ? <FaStar /> :
                     <FaExclamationTriangle />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-[var(--text-primary)]">{item.type}</span>
                      <span className="text-xs text-[var(--text-secondary)]">{item.time}</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] truncate">{item.target}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Farmers */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Top Farmers</h3>
          </div>
          <div className="space-y-4">
            {activityLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--primary-500)] border-t-transparent"></div>
              </div>
            ) : topFarmers.length === 0 ? (
              <p className="text-center py-8 text-[var(--text-secondary)]">No farmer sales data yet</p>
            ) : (
              topFarmers.map((farmer, index) => (
                <div key={farmer.id} className="flex items-center gap-3 pb-4 border-b border-[var(--border-light)] last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-[var(--primary-100)] text-[var(--primary-600)]'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[var(--text-primary)] text-sm">{farmer.name}</h4>
                    <p className="text-xs text-[var(--text-secondary)]">{farmer.orderCount} orders • {farmer.productsSold} items sold</p>
                  </div>
                  <span className="font-bold text-[var(--primary-600)] text-sm">{farmer.revenue}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderUsers = () => (
    <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">User Management ({filteredUsers.length} of {allUsers.length})</h3>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-lg outline-none focus:border-[var(--primary-500)]"
            />
          </div>
          <button 
            onClick={() => setAddAdminModal(true)}
            className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)]">
            <FaUserShield className="inline mr-2" /> Add Admin
          </button>
        </div>
      </div>

      {loadingUsers ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-600)]"></div>
        </div>
      ) : usersError ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          ❌ Error loading users: {usersError}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-secondary)]">
          <FaUsers size={48} className="mx-auto mb-4 opacity-20" />
          <p>No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-[var(--text-secondary)] border-b border-[var(--border-light)]">
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Phone</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Joined</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredUsers.map((userItem) => (
                <tr
                  key={userItem.id}
                  onClick={() => handleViewUserDetails(userItem.id)}
                  className="border-b border-[var(--border-light)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                >
                  <td className="py-4">
                    <p className="font-bold text-[var(--text-primary)]">{userItem.full_name || 'Unknown'}</p>
                  </td>
                  <td className="py-4 text-[var(--text-secondary)]">{userItem.phone || 'N/A'}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${
                      userItem.role === 'farmer' ? 'bg-green-50 text-green-700 border-green-200' : 
                      userItem.role === 'admin' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {userItem.role?.charAt(0).toUpperCase() + userItem.role?.slice(1) || 'Customer'}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                      userItem.suspended ? 'bg-red-100 text-red-700' :
                      userItem.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {userItem.suspended ? (
                        <>
                          <FaBan size={10} />
                          Suspended
                        </>
                      ) : userItem.approved ? (
                        <>
                          <FaCheckCircle size={10} />
                          Active
                        </>
                      ) : (
                        <>
                          <FaExclamationTriangle size={10} />
                          Pending
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 text-[var(--text-secondary)]">
                    {new Date(userItem.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewUserDetails(userItem.id);
                        }}
                        className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-600)] hover:bg-gray-100 rounded-lg" 
                        title="View details"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (userItem.role !== 'admin') {
                            setSelectedAdminUserId(userItem.id);
                            setAddAdminModal(true);
                          }
                        }}
                        disabled={userItem.role === 'admin'}
                        className={`p-2 rounded-lg transition-colors ${
                          userItem.role === 'admin'
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-[var(--text-secondary)] hover:text-[var(--primary-600)] hover:bg-blue-50'
                        }`}
                        title={userItem.role === 'admin' ? 'Already an admin' : 'Make admin'}
                      >
                        <FaUserShield />
                      </button>
                      {!userItem.suspended ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSuspendUser(userItem);
                          }}
                          className="p-2 text-[var(--text-secondary)] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Suspend user"
                        >
                          <FaBan />
                        </button>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnsuspendUser(userItem);
                          }}
                          className="p-2 text-red-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Unsuspend user"
                        >
                          <FaCheckCircle />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );

  const renderFarmers = () => (
    <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Pending Farmers</h3>
          <p className="text-sm text-[var(--text-secondary)]">{pendingFarmers.length} awaiting approval</p>
        </div>
        <button className="text-sm text-[var(--primary-600)] font-medium">Export List</button>
      </div>

      {farmerError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          ❌ {farmerError}
        </div>
      )}

      {loadingFarmers ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-[var(--primary-200)] border-t-[var(--primary-500)] rounded-full animate-spin" />
        </div>
      ) : pendingFarmers.length === 0 ? (
        <div className="text-center py-8 text-[var(--text-secondary)]">
          <FaCheckCircle size={32} className="mx-auto mb-3 text-green-500" />
          <p>No pending farmers! All farmers have been reviewed.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-[var(--text-secondary)] border-b border-[var(--border-light)]">
                <th className="pb-3 font-medium">Farmer Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Phone</th>
                <th className="pb-3 font-medium">Applied</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {pendingFarmers.map((farmer) => (
                <tr key={farmer.id} className="border-b border-[var(--border-light)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="py-4 font-bold text-[var(--text-primary)]">{farmer.full_name}</td>
                  <td className="py-4 text-[var(--text-secondary)]">{farmer.email || 'N/A'}</td>
                  <td className="py-4 text-[var(--text-secondary)]">{farmer.phone || 'N/A'}</td>
                  <td className="py-4 text-xs text-[var(--text-tertiary)]">
                    {new Date(farmer.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 text-right flex gap-2 justify-end">
                    <button 
                      onClick={() => handleApproveFarmer(farmer)}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-xs font-medium flex items-center gap-1 transition-colors">
                      <FaCheckCircle size={12} /> Approve
                    </button>
                    <button 
                      onClick={() => handleRejectFarmer(farmer)}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-xs font-medium flex items-center gap-1 transition-colors">
                      <FaTimesCircle size={12} /> Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );

  const renderTransactions = () => (
    <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Platform Transactions</h3>
          <p className="text-sm text-[var(--text-secondary)]">{transactions.length} total transactions</p>
        </div>
        <button
          onClick={exportTransactionsCSV}
          disabled={transactions.length === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            transactions.length === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)]'
          }`}
        >
          <FaDownload size={12} /> Export CSV
        </button>
      </div>

      {transactionsLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-600)]"></div>
        </div>
      ) : transactionsError ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error loading transactions: {transactionsError}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-secondary)]">
          <FaMoneyBillWave size={48} className="mx-auto mb-4 opacity-20" />
          <p>No transactions yet</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-xs text-green-600 font-medium">Total Revenue</p>
              <p className="text-xl font-bold text-green-700">
                {transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()} FCFA
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs text-blue-600 font-medium">Completed</p>
              <p className="text-xl font-bold text-blue-700">
                {transactions.filter(t => ['paid', 'successful', 'completed'].includes(t.status)).length}
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-xs text-yellow-600 font-medium">Pending</p>
              <p className="text-xl font-bold text-yellow-700">
                {transactions.filter(t => ['pending_payment', 'initiated', 'processing'].includes(t.status)).length}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-[var(--text-secondary)] border-b border-[var(--border-light)]">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Payment Method</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {transactions.map((trx) => (
                  <tr key={trx.id} className="border-b border-[var(--border-light)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="py-4 font-medium text-[var(--primary-600)]">{trx.orderId}</td>
                    <td className="py-4">
                      <p className="font-medium text-[var(--text-primary)]">{trx.customer}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{trx.customerPhone}</p>
                    </td>
                    <td className="py-4 text-[var(--text-secondary)]">{trx.type}</td>
                    <td className="py-4 font-bold text-[var(--text-primary)]">{trx.amount.toLocaleString()} FCFA</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(trx.status)}`}>
                        {formatStatus(trx.status)}
                      </span>
                    </td>
                    <td className="py-4 text-[var(--text-tertiary)]">
                      {new Date(trx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div {...fadeIn} className="max-w-3xl mx-auto space-y-6">
      {/* Admin Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Admin Profile</h3>
          <button 
            onClick={() => setEditProfileModal(true)}
            className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg font-medium hover:bg-[var(--primary-600)] flex items-center gap-2">
            <FaEdit size={14} /> Edit Profile
          </button>
        </div>
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user?.full_name?.charAt(0) || 'A'}
          </div>
          <div>
            <h4 className="text-lg font-bold text-[var(--text-primary)]">{user?.full_name || 'Administrator'}</h4>
            <p className="text-[var(--text-secondary)]">{user?.email || 'admin@agriconnect.cm'}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
              Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Platform Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-8">
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
      </div>
    </motion.div>
  );

  // User Details Modal
  const UserDetailsModal = () => (
    <AnimatePresence>
      {selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setSelectedUser(null);
            setUserDetails(null);
            setUserDetailsError(null);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <FaUsers size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">User Details</h2>
                  <p className="text-sm text-[var(--primary-100)]">Complete profile information</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setUserDetails(null);
                  setUserDetailsError(null);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {loadingUserDetails ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--primary-200)] border-t-[var(--primary-600)] mb-4"></div>
                <p className="text-[var(--text-secondary)] font-medium">Loading user details...</p>
              </div>
            ) : userDetailsError ? (
              <div className="p-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  ❌ {userDetailsError}
                </div>
              </div>
            ) : userDetails ? (
              <div className="p-6 space-y-6">
                {/* Profile Section */}
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <FaUserShield className="text-[var(--primary-600)]" />
                    Profile Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <p className="text-xs text-blue-700 font-bold uppercase tracking-wide">Name</p>
                      <p className="text-lg font-bold text-[var(--text-primary)] mt-1">{userDetails.profile?.full_name || 'N/A'}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                      <p className="text-xs text-purple-700 font-bold uppercase tracking-wide">Role</p>
                      <p className="text-lg font-bold text-[var(--text-primary)] capitalize mt-1">{userDetails.profile?.role || 'N/A'}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                      <p className="text-xs text-green-700 font-bold uppercase tracking-wide">Phone</p>
                      <p className="text-lg font-bold text-[var(--text-primary)] mt-1">{userDetails.profile?.phone || 'N/A'}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                      <p className="text-xs text-orange-700 font-bold uppercase tracking-wide">Status</p>
                      <p className="text-lg font-bold text-[var(--text-primary)] capitalize mt-1">
                        {userDetails.profile?.suspended ? '🚫 Suspended' : userDetails.profile?.approved ? '✅ Active' : '⏳ Pending'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 md:col-span-2">
                      <p className="text-xs text-gray-700 font-bold uppercase tracking-wide">Member Since</p>
                      <p className="text-lg font-bold text-[var(--text-primary)] mt-1">
                        {new Date(userDetails.profile?.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary Stats */}
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <FaChartLine className="text-[var(--primary-600)]" />
                    Activity Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-center shadow-lg">
                      <p className="text-3xl font-bold text-white">{userDetails.summary?.totalOrders || 0}</p>
                      <p className="text-xs text-blue-100 font-medium mt-1">Orders</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-center shadow-lg">
                      <p className="text-3xl font-bold text-white">{userDetails.summary?.totalProducts || 0}</p>
                      <p className="text-xs text-green-100 font-medium mt-1">Products</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl text-center shadow-lg">
                      <p className="text-3xl font-bold text-white">{userDetails.summary?.totalReviews || 0}</p>
                      <p className="text-xs text-orange-100 font-medium mt-1">Reviews</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl text-center shadow-lg">
                      <p className="text-3xl font-bold text-white">{userDetails.summary?.totalFavorites || 0}</p>
                      <p className="text-xs text-purple-100 font-medium mt-1">Favorites</p>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                {userDetails.orders && userDetails.orders.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                      <FaShoppingCart className="text-[var(--primary-600)]" />
                      Recent Orders
                    </h3>
                    <div className="space-y-2">
                      {userDetails.orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                          <div>
                            <p className="text-sm font-bold text-[var(--text-primary)]">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-[var(--primary-600)]">${order.total_amount}</p>
                            <p className="text-xs text-[var(--text-secondary)] capitalize font-medium">{order.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Suspend User Modal
  const SuspendUserModal = () => (
    <AnimatePresence>
      {suspendModal.open && (
        <motion.div
          key="suspend-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSuspendModal({ open: false, user: null })}
        >
          <motion.div
            key="suspend-modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-500/30 flex items-center justify-center">
                  <FaBan size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Suspend User</h2>
                  <p className="text-sm text-red-100">This action can be reversed</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-[var(--text-secondary)] text-sm">
                  You are about to suspend <span className="font-bold text-red-700">{suspendModal.user?.full_name}</span>
                </p>
                <p className="text-[var(--text-secondary)] text-sm mt-2">
                  Suspended users will be unable to log in or access the platform.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 border-t border-[var(--border-light)] p-4 flex gap-3 justify-end">
              <button
                onClick={() => setSuspendModal({ open: false, user: null })}
                disabled={suspendLoading}
                className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg font-medium text-[var(--text-primary)] hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submitSuspendUser}
                disabled={suspendLoading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {suspendLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Suspending...
                  </>
                ) : (
                  <>
                    <FaBan size={16} />
                    Suspend User
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Unsuspend User Modal
  const UnsuspendUserModal = () => (
    <AnimatePresence>
      {unsuspendModal.open && (
        <motion.div
          key="unsuspend-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setUnsuspendModal({ open: false, user: null })}
        >
          <motion.div
            key="unsuspend-modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/30 flex items-center justify-center">
                  <FaCheckCircle size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Unsuspend User</h2>
                  <p className="text-sm text-green-100">Restore user access</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-[var(--text-secondary)] text-sm">
                  You are about to unsuspend <span className="font-bold text-green-700">{unsuspendModal.user?.full_name}</span>
                </p>
                <p className="text-[var(--text-secondary)] text-sm mt-2">
                  This user will regain full access to the platform.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 border-t border-[var(--border-light)] p-4 flex gap-3 justify-end">
              <button
                onClick={() => setUnsuspendModal({ open: false, user: null })}
                disabled={unsuspendLoading}
                className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg font-medium text-[var(--text-primary)] hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submitUnsuspendUser}
                disabled={unsuspendLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {unsuspendLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Unsuspending...
                  </>
                ) : (
                  <>
                    <FaCheckCircle size={16} />
                    Unsuspend User
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Add Admin Modal
  const AddAdminModal = () => (
    <AnimatePresence>
      {addAdminModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setAddAdminModal(false);
            setSelectedAdminUserId('');
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <FaUserShield size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Add New Admin</h2>
                  <p className="text-sm text-[var(--primary-100)]">Grant administrator access</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Select a user to promote to admin.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  User
                </label>
                <select
                  value={selectedAdminUserId}
                  onChange={(e) => setSelectedAdminUserId(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[var(--border-color)] rounded-lg outline-none focus:border-[var(--primary-500)] font-medium text-sm bg-white"
                >
                  <option value="">Select user</option>
                  {adminEligibleUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name || 'Unknown'} • {u.phone || 'No phone'} • {u.role || 'user'}
                    </option>
                  ))}
                </select>
              </div>

              {selectedAdminUser ? (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)] font-medium">Name:</span>
                    <span className="font-bold text-[var(--text-primary)]">{selectedAdminUser.full_name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)] font-medium">Role:</span>
                    <span className="font-bold text-[var(--text-primary)] capitalize">{selectedAdminUser.role || 'customer'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)] font-medium">Phone:</span>
                    <span className="font-bold text-[var(--text-primary)]">{selectedAdminUser.phone || 'N/A'}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[var(--text-secondary)]">No user selected</div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-gray-50 border-t border-[var(--border-light)] p-4 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setAddAdminModal(false);
                  setSelectedAdminUserId('');
                }}
                disabled={adminLoading}
                className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg font-medium text-[var(--text-primary)] hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAdmin}
                disabled={adminLoading || !selectedAdminUserId}
                className="px-6 py-2 bg-[var(--primary-500)] text-white rounded-lg font-bold hover:bg-[var(--primary-600)] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {adminLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <FaUserShield size={16} />
                    Add Admin
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Edit Profile Modal
  const EditProfileModal = () => (
    <AnimatePresence>
      {editProfileModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setEditProfileModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <FaEdit size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Edit Profile</h2>
                  <p className="text-sm text-[var(--primary-100)]">Update your information</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editData.full_name}
                  onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-[var(--border-color)] rounded-lg outline-none focus:border-[var(--primary-500)] font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-[var(--border-color)] rounded-lg outline-none focus:border-[var(--primary-500)] font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-[var(--border-color)] rounded-lg outline-none focus:border-[var(--primary-500)] font-medium text-sm"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 border-t border-[var(--border-light)] p-4 flex gap-3 justify-end">
              <button
                onClick={() => setEditProfileModal(false)}
                disabled={editLoading}
                className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg font-medium text-[var(--text-primary)] hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditProfile}
                disabled={editLoading}
                className="px-6 py-2 bg-[var(--primary-500)] text-white rounded-lg font-bold hover:bg-[var(--primary-600)] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {editLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaCheckCircle size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Farmer Action Modal
  const FarmerActionModal = () => (
    <AnimatePresence>
      {farmerAction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setFarmerAction(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${farmerAction.type === 'approve' ? 'from-green-600 to-green-700' : 'from-red-600 to-red-700'} text-white p-6`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${farmerAction.type === 'approve' ? 'bg-green-500/30' : 'bg-red-500/30'} flex items-center justify-center`}>
                  {farmerAction.type === 'approve' ? <FaCheckCircle size={24} /> : <FaTimesCircle size={24} />}
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {farmerAction.type === 'approve' ? 'Approve Farmer' : 'Reject Farmer'}
                  </h2>
                  <p className="text-sm opacity-90">Confirm this action</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className={`${farmerAction.type === 'approve' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4`}>
                <p className="text-sm">
                  You are about to <span className="font-bold">{farmerAction.type === 'approve' ? 'approve' : 'reject'}</span> <span className="font-bold text-[var(--text-primary)]">{farmerAction.farmer?.full_name}</span> as a farmer.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                  <span className="text-[var(--text-secondary)] font-medium">Full Name:</span>
                  <span className="font-bold text-[var(--text-primary)]">{farmerAction.farmer?.full_name}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                  <span className="text-[var(--text-secondary)] font-medium">Phone:</span>
                  <span className="font-bold text-[var(--text-primary)]">{farmerAction.farmer?.phone || 'Not provided'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)] font-medium">Applied On:</span>
                  <span className="font-bold text-[var(--text-primary)]">{new Date(farmerAction.farmer?.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 border-t border-[var(--border-light)] p-4 flex gap-3 justify-end">
              <button
                onClick={() => setFarmerAction(null)}
                className="px-4 py-2 bg-white border border-[var(--border-color)] rounded-lg font-medium text-[var(--text-primary)] hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={farmerAction.type === 'approve' ? submitApproveFarmer : submitRejectFarmer}
                className={`px-6 py-2 ${farmerAction.type === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white rounded-lg font-bold transition-colors flex items-center gap-2`}
              >
                {farmerAction.type === 'approve' ? (
                  <>
                    <FaCheckCircle size={16} />
                    Approve
                  </>
                ) : (
                  <>
                    <FaTimesCircle size={16} />
                    Reject
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <Navbar />

      <div className="pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className={`flex-shrink-0 w-full md:w-64 bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-4 h-fit sticky top-24 transition-all ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
            <div className="flex items-center gap-3 px-4 py-4 mb-4 border-b border-[var(--border-light)]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center text-white font-bold text-sm">
                {user?.full_name?.charAt(0) || 'A'}
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)] text-sm">{user?.full_name || 'Administrator'}</h3>
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
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium">
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

      {/* Modals */}
      <UserDetailsModal />
      <SuspendUserModal />
      <UnsuspendUserModal />
      <AddAdminModal />
      <EditProfileModal />
      <FarmerActionModal />

      <Footer />
    </div>
  );
};

export default AdminDashboard;
