import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  FaExclamationTriangle,
  FaImage,
  FaTimes,
  FaSearchPlus,
  FaSearchMinus,
  FaCheck
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Input from '../../components/ui/input';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS } from '../../config/api';
import { authFetch } from '../../utils/authFetch';
import { allCities } from '../../data/cameroonCities';
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
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  // Product management state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    harvestLocation: '',
    description: '',
    imageUrl: ''
  });
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    farmDetails: '',
    farmName: '',
    yearsExperience: '',
    certifications: [],
    avatarUrl: '',
    bannerUrl: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // Image cropper modal state
  const [cropperModal, setCropperModal] = useState({
    isOpen: false,
    imageUrl: null,
    type: null, // 'banner' or 'avatar'
    originalFile: null
  });
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [cropZoom, setCropZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cropperRef = useRef(null);

  // Fetch products on mount and when section changes
  useEffect(() => {
    if (activeSection === SECTIONS.PRODUCTS || activeSection === SECTIONS.DASHBOARD) {
      fetchProducts();
    }
    if (activeSection === SECTIONS.PROFILE) {
      fetchProfile();
    }
  }, [activeSection]);

  // Also fetch profile on initial mount to have data ready
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Set initial form data from user context as fallback
  useEffect(() => {
    if (user && !profileForm.fullName) {
      console.log('🔄 Setting initial profile form from user context:', user);
      setProfileForm(prev => ({
        ...prev,
        fullName: user.full_name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch(API_ENDPOINTS.FARMER_PRODUCTS, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      if (data.success) {
        setProducts(data.data.products || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Using mock data.');
      setProducts(farmerProducts);
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile from API
  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('⚠️ No token found, using user context data');
        setProfileForm(prev => ({
          ...prev,
          fullName: user?.full_name || '',
          email: user?.email || '',
          phone: user?.phone || ''
        }));
        setProfileLoading(false);
        return;
      }

      const response = await authFetch(API_ENDPOINTS.PROFILE, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Profile API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📦 Full API response:', data);
        
        if (data.success && data.data && data.data.profile) {
          const profile = data.data.profile;
          console.log('👤 Profile object:', profile);
          console.log('📍 full_name:', profile.full_name);
          console.log('📍 phone:', profile.phone);
          console.log('📍 location:', profile.location);
          console.log('📍 bio:', profile.bio);
          console.log('📍 farm_details:', profile.farm_details);
          console.log('📍 farm_name:', profile.farm_name);
          console.log('📍 years_experience:', profile.years_experience);
          console.log('📍 certifications:', profile.certifications);
          console.log('📍 avatar_url:', profile.avatar_url);
          console.log('📍 banner_url:', profile.banner_url);
          
          // Build the profile form with all available data
          const newProfileForm = {
            fullName: profile.full_name || user?.full_name || '',
            email: user?.email || '', // Email comes from auth, not profiles table
            phone: profile.phone || '',
            location: profile.location || '',
            bio: profile.bio || '',
            farmDetails: profile.farm_details || '',
            farmName: profile.farm_name || '',
            yearsExperience: profile.years_experience || '',
            certifications: Array.isArray(profile.certifications) ? profile.certifications : [],
            avatarUrl: profile.avatar_url || '',
            bannerUrl: profile.banner_url || ''
          };
          
          console.log('📝 Setting profileForm to:', newProfileForm);
          setProfileForm(newProfileForm);
          
          // Set previews from existing URLs - check for valid URL strings
          const avatarUrl = profile.avatar_url;
          const bannerUrl = profile.banner_url;
          
          if (avatarUrl && typeof avatarUrl === 'string' && avatarUrl.startsWith('http')) {
            console.log('🖼️ Setting avatar preview:', avatarUrl);
            setAvatarPreview(avatarUrl);
          }
          if (bannerUrl && typeof bannerUrl === 'string' && bannerUrl.startsWith('http')) {
            console.log('🖼️ Setting banner preview:', bannerUrl);
            setBannerPreview(bannerUrl);
          }
        } else {
          console.log('⚠️ Profile data not in expected format:', data);
          // Set defaults from user context
          setProfileForm(prev => ({
            ...prev,
            fullName: user?.full_name || '',
            email: user?.email || '',
            phone: user?.phone || ''
          }));
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Profile API error:', response.status, errorData);
        // If API fails, use user data from auth context
        setProfileForm(prev => ({
          ...prev,
          fullName: user?.full_name || '',
          email: user?.email || '',
          phone: user?.phone || ''
        }));
      }
    } catch (err) {
      console.error('❌ Error fetching profile:', err);
      // Fallback to user data from auth context
      setProfileForm(prev => ({
        ...prev,
        fullName: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || ''
      }));
    } finally {
      setProfileLoading(false);
    }
  };

  // Open image cropper modal
  const openCropper = (file, type) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropperModal({
        isOpen: true,
        imageUrl: reader.result,
        type: type,
        originalFile: file
      });
      setCropPosition({ x: 0, y: 0 });
      setCropZoom(1);
    };
    reader.readAsDataURL(file);
  };

  // Handle mouse/touch events for dragging
  const handleCropperMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - cropPosition.x, y: clientY - cropPosition.y });
  };

  const handleCropperMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setCropPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleCropperMouseUp = () => {
    setIsDragging(false);
  };

  // Apply cropped image
  const applyCroppedImage = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Set canvas size based on type - optimized sizes for faster upload
      if (cropperModal.type === 'banner') {
        canvas.width = 800;  // Reduced from 1200 for faster upload
        canvas.height = 267; // Maintain 3:1 aspect ratio
      } else {
        canvas.width = 200;  // Reduced from 400 for faster upload
        canvas.height = 200;
      }
      
      // Calculate the scaled image dimensions
      const scale = cropZoom;
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      
      // Calculate position to draw the image (centered + offset)
      const drawX = (canvas.width - scaledWidth) / 2 + cropPosition.x;
      const drawY = (canvas.height - scaledHeight) / 2 + cropPosition.y;
      
      // Fill background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the image
      ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight);
      
      // Convert to blob with lower quality for faster upload
      const quality = cropperModal.type === 'banner' ? 0.7 : 0.8;
      canvas.toBlob((blob) => {
        const croppedFile = new File([blob], `${cropperModal.type}-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const croppedUrl = canvas.toDataURL('image/jpeg', quality);
        
        console.log(`📷 ${cropperModal.type} image size: ${(blob.size / 1024).toFixed(1)} KB`);
        
        if (cropperModal.type === 'banner') {
          setBannerFile(croppedFile);
          setBannerPreview(croppedUrl);
        } else {
          setAvatarFile(croppedFile);
          setAvatarPreview(croppedUrl);
        }
        
        // Close modal
        setCropperModal({ isOpen: false, imageUrl: null, type: null, originalFile: null });
        setSuccess(`${cropperModal.type === 'banner' ? 'Banner' : 'Profile photo'} ready. Click "Save Profile" to upload.`);
      }, 'image/jpeg', quality);
    };
    
    img.src = cropperModal.imageUrl;
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setProductImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to backend
  const uploadImage = async () => {
    if (!productImage) return null;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', productImage);

      const response = await authFetch(API_ENDPOINTS.UPLOAD_PRODUCT_IMAGE, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      if (data.success) {
        return data.data.imageUrl;
      }
      return null;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle product form submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Upload image first if selected
    let imageUrl = productForm.imageUrl;
    if (productImage) {
      imageUrl = await uploadImage();
      if (!imageUrl) {
        setError('Failed to upload image. Please try again.');
        return;
      }
    }

    if (!imageUrl && !editingProduct) {
      setError('Please upload a product image');
      return;
    }

    setLoading(true);
    try {
      const productData = {
        name: productForm.name,
        category: productForm.category,
        price: parseFloat(productForm.price),
        quantity: parseInt(productForm.quantity),
        harvestLocation: productForm.harvestLocation,
        description: productForm.description,
        imageUrl: imageUrl || productForm.imageUrl
      };

      const url = editingProduct 
        ? API_ENDPOINTS.PRODUCT_BY_ID(editingProduct.id)
        : API_ENDPOINTS.PRODUCTS;
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save product');
      }

      setSuccess(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
      
      // Reset form
      setProductForm({
        name: '',
        category: '',
        price: '',
        quantity: '',
        harvestLocation: '',
        description: '',
        imageUrl: ''
      });
      setProductImage(null);
      setImagePreview(null);
      setEditingProduct(null);

      // Refresh products list
      await fetchProducts();

      // Switch to products section after a delay
      setTimeout(() => {
        setActiveSection(SECTIONS.PRODUCTS);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setProfileLoading(true);

    try {
      console.log('🔄 Starting profile save...');
      console.log('📷 Avatar file:', avatarFile ? 'Yes' : 'No');
      console.log('🖼️ Banner file:', bannerFile ? 'Yes' : 'No');
      console.log('📍 Current avatarUrl:', profileForm.avatarUrl);
      console.log('📍 Current bannerUrl:', profileForm.bannerUrl);
      
      // Upload avatar if new file selected
      let avatarUrl = profileForm.avatarUrl;
      if (avatarFile) {
        console.log('📤 Uploading avatar...');
        const formData = new FormData();
        formData.append('image', avatarFile);
        // Use profile upload endpoint with type=avatar
        const uploadRes = await authFetch(`${API_ENDPOINTS.PROFILE_UPLOAD_IMAGE}?type=avatar`, {
          method: 'POST',
          body: formData
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          console.log('✅ Avatar upload response:', uploadData);
          if (uploadData.success) avatarUrl = uploadData.data.imageUrl;
        } else {
          console.error('❌ Avatar upload failed:', uploadRes.status);
        }
      }

      // Upload banner if new file selected
      let bannerUrl = profileForm.bannerUrl;
      if (bannerFile) {
        console.log('📤 Uploading banner...');
        const formData = new FormData();
        formData.append('image', bannerFile);
        // Use profile upload endpoint with type=banner
        const uploadRes = await authFetch(`${API_ENDPOINTS.PROFILE_UPLOAD_IMAGE}?type=banner`, {
          method: 'POST',
          body: formData
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          console.log('✅ Banner upload response:', uploadData);
          if (uploadData.success) bannerUrl = uploadData.data.imageUrl;
        } else {
          console.error('❌ Banner upload failed:', uploadRes.status);
        }
      }

      console.log('📝 Sending profile update with:');
      console.log('   avatarUrl:', avatarUrl);
      console.log('   bannerUrl:', bannerUrl);

      const response = await authFetch(API_ENDPOINTS.PROFILE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: profileForm.fullName,
          phone: profileForm.phone,
          location: profileForm.location,
          bio: profileForm.bio,
          farmDetails: profileForm.farmDetails,
          farmName: profileForm.farmName,
          yearsExperience: profileForm.yearsExperience,
          certifications: profileForm.certifications,
          avatarUrl,
          bannerUrl
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
      
      // Update user in context with avatar
      if (user) {
        const updatedUser = {
          ...user,
          full_name: profileForm.fullName,
          phone: profileForm.phone,
          avatar_url: avatarUrl || profileForm.avatarUrl
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }

      // Refresh profile data to ensure form is in sync with database
      await fetchProfile();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle product edit
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      category: product.category || '',
      price: product.price?.toString() || '',
      quantity: product.quantity?.toString() || '',
      harvestLocation: product.harvest_location || '',
      description: product.description || '',
      imageUrl: product.image_url || ''
    });
    setImagePreview(product.image_url || null);
    setProductImage(null);
    setActiveSection(SECTIONS.ADD_PRODUCT);
  };

  // Handle product delete
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await authFetch(API_ENDPOINTS.PRODUCT_BY_ID(productId), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product');
      }

      setSuccess('Product deleted successfully!');
      await fetchProducts();
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  // Clear messages after timeout
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

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
          onClick={() => {
            setEditingProduct(null);
            setProductForm({
              name: '',
              category: '',
              price: '',
              quantity: '',
              harvestLocation: '',
              description: '',
              imageUrl: ''
            });
            setImagePreview(null);
            setProductImage(null);
            setActiveSection(SECTIONS.ADD_PRODUCT);
          }}
          className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-xl font-medium hover:bg-[var(--primary-600)] transition-colors flex items-center gap-2 shadow-lg shadow-[var(--primary-500)]/20"
        >
          <FaPlusCircle /> Add New Product
        </button>
      </div>

      {(error || success) && (
        <div className={`mb-6 p-4 rounded-xl ${error ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
          {error || success}
        </div>
      )}

      {loading && products.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-500)]"></div>
          <p className="mt-4 text-[var(--text-secondary)]">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <FaBoxOpen className="mx-auto text-4xl text-[var(--text-tertiary)] mb-4" />
          <p className="text-[var(--text-secondary)] mb-4">No products yet</p>
          <button
            onClick={() => setActiveSection(SECTIONS.ADD_PRODUCT)}
            className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-xl font-medium hover:bg-[var(--primary-600)] transition-colors"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-[var(--text-secondary)] border-b border-[var(--border-light)]">
                <th className="pb-3 font-medium">Image</th>
                <th className="pb-3 font-medium">Product Name</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {products.map((product) => {
                const status = product.quantity > 0 ? 'Active' : 'Out of stock';
                const price = typeof product.price === 'number' 
                  ? `${product.price.toLocaleString()} FCFA` 
                  : product.price || 'N/A';
                
                return (
                  <tr key={product.id} className="border-b border-[var(--border-light)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="py-4">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FaImage className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="py-4 font-medium">{product.name}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-[var(--secondary-50)] text-[var(--secondary-700)] rounded-md text-xs font-medium border border-[var(--secondary-200)] capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 font-medium text-[var(--primary-600)]">{price}</td>
                    <td className="py-4">{product.quantity || 0}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary-600)] transition-colors"
                          title="Edit product"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                          title="Delete product"
                          disabled={loading}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );

  const renderAddProduct = () => (
    <motion.div {...fadeIn} className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-8">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h3>
        <p className="text-[var(--text-secondary)]">Fill in the details to list a new product on the marketplace.</p>
      </div>

      {(error || success) && (
        <div className={`mb-6 p-4 rounded-xl ${error ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
          {error || success}
        </div>
      )}

      <form onSubmit={handleProductSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Product Image</label>
          <div className="flex flex-col gap-4">
            {imagePreview && (
              <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-[var(--border-color)]">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setProductImage(null);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            )}
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--border-color)] rounded-xl cursor-pointer hover:border-[var(--primary-500)] transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaImage className="text-3xl text-[var(--text-secondary)] mb-2" />
                <p className="text-sm text-[var(--text-secondary)]">
                  {imagePreview ? 'Change Image' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">PNG, JPG, WEBP up to 5MB</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={uploadingImage}
              />
            </label>
          </div>
        </div>

        <Input
          label="Product Name"
          placeholder="e.g. Organic Tomatoes"
          required
          value={productForm.name}
          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Category</label>
            <select
              className="px-4 py-3 rounded-xl border-2 border-[var(--border-color)] focus:border-[var(--primary-500)] outline-none bg-white"
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="grains">Grains</option>
              <option value="livestock">Livestock</option>
              <option value="dairy">Dairy</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Input
            label="Price (FCFA)"
            type="number"
            placeholder="0.00"
            required
            value={productForm.price}
            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
            min="0"
            step="0.01"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Quantity Available"
            type="number"
            placeholder="0"
            required
            value={productForm.quantity}
            onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
            min="0"
          />
          <div className="form-group flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              Harvest Location <span className="text-red-500">*</span>
            </label>
            <select
              className="px-4 py-3 rounded-xl border-2 border-[var(--border-color)] focus:border-[var(--primary-500)] outline-none bg-white"
              value={productForm.harvestLocation}
              onChange={(e) => setProductForm({ ...productForm, harvestLocation: e.target.value })}
              required
            >
              <option value="">Select City/Town</option>
              {allCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Description</label>
          <textarea
            rows="4"
            className="px-4 py-3 rounded-xl border-2 border-[var(--border-color)] focus:border-[var(--primary-500)] outline-none resize-none"
            placeholder="Describe your product..."
            value={productForm.description}
            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
          />
        </div>

        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={() => {
              setActiveSection(SECTIONS.PRODUCTS);
              setEditingProduct(null);
              setProductForm({
                name: '',
                category: '',
                price: '',
                quantity: '',
                harvestLocation: '',
                description: '',
                imageUrl: ''
              });
              setImagePreview(null);
              setProductImage(null);
            }}
            className="px-6 py-3 rounded-xl border-2 border-[var(--border-color)] font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
            disabled={loading || uploadingImage}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-xl bg-[var(--primary-500)] text-white font-bold hover:bg-[var(--primary-600)] transition-colors shadow-lg shadow-[var(--primary-500)]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || uploadingImage}
          >
            {loading || uploadingImage ? 'Processing...' : editingProduct ? 'Update Product' : 'Publish Product'}
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

  const renderProfile = () => {
    // Show loading state while fetching profile
    if (profileLoading && !profileForm.fullName) {
      return (
        <motion.div {...fadeIn} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-8">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[var(--primary-200)] border-t-[var(--primary-500)] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)]">Loading your profile...</p>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div {...fadeIn} className="max-w-3xl mx-auto">
        {/* Twitter/X-style Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] overflow-hidden mb-6">
          {/* Banner Image - Entire area clickable like Twitter/X */}
          <label className="relative h-48 bg-gradient-to-r from-[var(--primary-400)] to-[var(--primary-600)] block cursor-pointer group">
            {(bannerPreview || profileForm.bannerUrl) ? (
              <img 
                src={bannerPreview || profileForm.bannerUrl} 
                alt="Farm Banner" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50">
                <span className="text-lg">🌾 Your Farm Banner</span>
              </div>
            )}
            {/* Hover Overlay - shows on hover like Twitter/X */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center text-white">
                <FaImage size={32} className="mb-2" />
                <span className="text-sm font-medium">Click to upload banner</span>
              </div>
            </div>
            {/* Hidden file input */}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    setError('Image size must be less than 5MB');
                    return;
                  }
                  openCropper(file, 'banner');
                }
                e.target.value = ''; // Reset input
              }}
            />
          </label>

          {/* Profile Photo & Name Section */}
          <div className="relative px-6 pb-6">
            {/* Avatar - overlapping banner, clickable like Twitter/X */}
            <div className="relative -mt-16 mb-4 w-32">
              <label className="block w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-[var(--primary-100)] cursor-pointer group relative">
                {(avatarPreview || profileForm.avatarUrl) ? (
                  <img 
                    src={avatarPreview || profileForm.avatarUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--primary-600)] text-4xl font-bold">
                    {profileForm.fullName?.charAt(0) || user?.full_name?.charAt(0) || 'F'}
                  </div>
                )}
                {/* Hover Overlay for Avatar */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center rounded-full">
                  <FaEdit size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        setError('Image size must be less than 5MB');
                        return;
                      }
                      openCropper(file, 'avatar');
                    }
                    e.target.value = ''; // Reset input
                  }}
                />
              </label>
            </div>

            {/* Name & Role */}
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                {profileForm.fullName || user?.full_name || 'Farmer'}
              </h2>
              <p className="text-[var(--text-secondary)]">Farmer Account</p>
              {profileForm.location && (
                <p className="text-sm text-[var(--text-tertiary)] flex items-center gap-1 mt-1">
                  📍 {profileForm.location}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-6">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Edit Profile Information</h3>

          {(error || success) && (
            <div className={`mb-6 p-4 rounded-xl ${error ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
              {error || success}
            </div>
          )}

      <form onSubmit={handleProfileUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={profileForm.fullName}
            onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
            required
          />
          <div className="form-group flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Email</label>
            <input
              type="email"
              value={profileForm.email}
              disabled
              className="px-4 py-3 rounded-xl border-2 border-[var(--border-color)] bg-gray-100 text-[var(--text-tertiary)] cursor-not-allowed"
            />
            <span className="text-xs text-[var(--text-tertiary)]">Email cannot be changed</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Phone"
            type="tel"
            value={profileForm.phone}
            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
          />
          <div className="form-group flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Location</label>
            <input
              type="text"
              list="cities-list"
              className="px-4 py-3 rounded-xl border-2 border-[var(--border-color)] focus:border-[var(--primary-500)] outline-none bg-white"
              value={profileForm.location}
              onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
              placeholder="Type or select your city/town"
            />
            <datalist id="cities-list">
              {allCities.map(city => (
                <option key={city} value={city} />
              ))}
            </datalist>
            <span className="text-xs text-[var(--text-tertiary)]">Type your location or select from suggestions</span>
          </div>
        </div>

        {/* Farm Name and Years Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Farm Name"
            value={profileForm.farmName}
            onChange={(e) => setProfileForm({ ...profileForm, farmName: e.target.value })}
            placeholder="e.g., Les Jardins de Mama Ngo"
          />
          <div className="form-group flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Years of Experience</label>
            <select
              className="px-4 py-3 rounded-xl border-2 border-[var(--border-color)] focus:border-[var(--primary-500)] outline-none bg-white"
              value={profileForm.yearsExperience}
              onChange={(e) => setProfileForm({ ...profileForm, yearsExperience: e.target.value })}
            >
              <option value="">Select experience</option>
              <option value="1">Less than 1 year</option>
              <option value="2">1-2 years</option>
              <option value="3">3-5 years</option>
              <option value="5">5-10 years</option>
              <option value="10">10-15 years</option>
              <option value="15">15-20 years</option>
              <option value="20">20+ years</option>
            </select>
          </div>
        </div>

        {/* Certifications / Badges */}
        <div className="form-group flex flex-col gap-3">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Certifications & Practices</label>
          <p className="text-xs text-[var(--text-tertiary)]">Select all that apply to your farming practices</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['Organic', 'Non-GMO', 'Sustainable', 'Fair Trade', 'Pesticide-Free', 'Local', 'Family Farm', 'Regenerative'].map((cert) => (
              <label 
                key={cert}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  profileForm.certifications?.includes(cert) 
                    ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-700)]' 
                    : 'border-[var(--border-color)] hover:border-[var(--primary-300)]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={profileForm.certifications?.includes(cert) || false}
                  onChange={(e) => {
                    const current = profileForm.certifications || [];
                    if (e.target.checked) {
                      setProfileForm({ ...profileForm, certifications: [...current, cert] });
                    } else {
                      setProfileForm({ ...profileForm, certifications: current.filter(c => c !== cert) });
                    }
                  }}
                  className="w-4 h-4 accent-[var(--primary-500)]"
                />
                <span className="text-sm font-medium">{cert}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Bio</label>
          <textarea
            rows="4"
            className="px-4 py-3 rounded-xl border-2 border-[var(--border-color)] focus:border-[var(--primary-500)] outline-none resize-none"
            placeholder="Tell customers about yourself... e.g., I am a passionate farmer with 10 years of experience in organic farming..."
            value={profileForm.bio}
            onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
            maxLength={500}
          />
          <span className="text-xs text-[var(--text-tertiary)]">{profileForm.bio?.length || 0}/500 characters</span>
        </div>

        <div className="form-group flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Farm Details</label>
          <textarea
            rows="4"
            className="px-4 py-3 rounded-xl border-2 border-[var(--border-color)] focus:border-[var(--primary-500)] outline-none resize-none"
            placeholder="Describe your farm... e.g., Size, types of crops, farming practices, certifications, years of operation..."
            value={profileForm.farmDetails}
            onChange={(e) => setProfileForm({ ...profileForm, farmDetails: e.target.value })}
            maxLength={1000}
          />
          <span className="text-xs text-[var(--text-tertiary)]">{profileForm.farmDetails?.length || 0}/1000 characters</span>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 bg-[var(--primary-500)] text-white font-bold rounded-xl hover:bg-[var(--primary-600)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={profileLoading}
          >
            {profileLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>
        </div>
      </motion.div>
    );
  };

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
        {/* Global Success/Error Messages */}
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl ${error ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}
          >
            <div className="flex items-center justify-between">
              <span>{error || success}</span>
              <button
                onClick={() => {
                  setError(null);
                  setSuccess(null);
                }}
                className="ml-4 text-current opacity-70 hover:opacity-100"
              >
                <FaTimes />
              </button>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className={`flex-shrink-0 w-full md:w-64 bg-white rounded-2xl shadow-sm border border-[var(--border-light)] p-4 h-fit sticky top-24 transition-all ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
            <div className="flex items-center gap-3 px-4 py-4 mb-4 border-b border-[var(--border-light)]">
              <div className="w-10 h-10 rounded-full bg-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)] font-bold text-sm overflow-hidden">
                {(avatarPreview || profileForm.avatarUrl) ? (
                  <img src={avatarPreview || profileForm.avatarUrl} alt={profileForm.fullName || user?.full_name} className="w-full h-full object-cover" />
                ) : (
                  user?.full_name?.charAt(0) || 'F'
                )}
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)] text-sm">{profileForm.fullName || user?.full_name || 'Farmer'}</h3>
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
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium"
              >
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

      {/* Image Cropper Modal */}
      <AnimatePresence>
        {cropperModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setCropperModal({ isOpen: false, imageUrl: null, type: null, originalFile: null })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] rounded-2xl overflow-hidden max-w-4xl w-full"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                <button
                  onClick={() => setCropperModal({ isOpen: false, imageUrl: null, type: null, originalFile: null })}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors text-white"
                >
                  <FaTimes size={18} />
                </button>
                <h3 className="text-white font-semibold">
                  {cropperModal.type === 'banner' ? 'Edit Banner' : 'Edit Profile Photo'}
                </h3>
                <button
                  onClick={applyCroppedImage}
                  className="bg-white text-black font-semibold px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Apply
                </button>
              </div>

              {/* Cropper Area */}
              <div 
                ref={cropperRef}
                className="relative overflow-hidden cursor-move"
                style={{ 
                  height: cropperModal.type === 'banner' ? '300px' : '400px',
                  touchAction: 'none'
                }}
                onMouseDown={handleCropperMouseDown}
                onMouseMove={handleCropperMouseMove}
                onMouseUp={handleCropperMouseUp}
                onMouseLeave={handleCropperMouseUp}
                onTouchStart={handleCropperMouseDown}
                onTouchMove={handleCropperMouseMove}
                onTouchEnd={handleCropperMouseUp}
              >
                {/* Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none z-10">
                  <div className="w-full h-full border-2 border-white/30" style={{
                    backgroundImage: cropperModal.type === 'avatar' 
                      ? 'none'
                      : 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '33.33% 33.33%'
                  }}>
                    {cropperModal.type === 'avatar' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 border-2 border-white/50 rounded-full" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Image */}
                <img
                  src={cropperModal.imageUrl}
                  alt="Crop preview"
                  className="absolute select-none"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${cropPosition.x}px), calc(-50% + ${cropPosition.y}px)) scale(${cropZoom})`,
                    maxWidth: 'none',
                    maxHeight: 'none',
                    width: 'auto',
                    height: cropperModal.type === 'banner' ? '100%' : 'auto',
                    minWidth: cropperModal.type === 'banner' ? '100%' : 'auto',
                    minHeight: cropperModal.type === 'avatar' ? '100%' : 'auto'
                  }}
                  draggable={false}
                />
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center justify-center gap-4 py-4 bg-[#1a1a1a]">
                <button
                  onClick={() => setCropZoom(Math.max(0.5, cropZoom - 0.1))}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
                >
                  <FaSearchMinus size={16} />
                </button>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={cropZoom}
                  onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                  className="w-48 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <button
                  onClick={() => setCropZoom(Math.min(3, cropZoom + 0.1))}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
                >
                  <FaSearchPlus size={16} />
                </button>
              </div>

              {/* Instructions */}
              <div className="text-center pb-4 text-gray-400 text-sm">
                Drag to reposition • Use slider to zoom
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default FarmerDashboard;
