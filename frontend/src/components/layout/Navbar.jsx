import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GiWheat } from 'react-icons/gi';
import { FiGlobe, FiShoppingCart, FiMenu, FiX, FiBell, FiUser, FiLogOut, FiHome } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // Add glassmorphism effect after small scroll
      setIsScrolled(currentY > 20);

      // Hide on scroll down, show on scroll up or near top
      if (currentY <= 0) {
        setShowHeader(true);
      } else if (currentY > lastScrollY + 5) {
        // scrolling down
        setShowHeader(false);
      } else if (currentY < lastScrollY - 5) {
        // scrolling up
        setShowHeader(true);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const isActive = (path) => location.pathname === path;

  // Get dashboard route based on user role
  const getDashboardRoute = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'farmer':
        return '/farmer/dashboard';
      case 'customer':
        return '/consumer/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/');
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuOpen && !event.target.closest('.profile-menu-container')) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/farmers', label: 'Farmers' },
    { path: '/about', label: 'About' },
  ];

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: showHeader ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass shadow-lg'
          : 'bg-white shadow-sm'
      }`}
    >
      <nav className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center text-white shadow-lg"
            >
              <GiWheat size={24} />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-gradient">AgriConnect</h1>
              <p className="text-xs text-[var(--text-tertiary)] -mt-1">Farm to Table</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`relative text-sm font-semibold transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-[var(--primary-500)]'
                      : 'text-[var(--text-primary)] hover:text-[var(--primary-500)]'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <button
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--primary-50)] hover:text-[var(--primary-500)] transition-all"
              type="button"
              aria-label="Language"
            >
              <FiGlobe size={18} />
              <span>EN</span>
            </button>

            {/* Notifications */}
            <button
              className="hidden md:flex relative p-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--primary-50)] hover:text-[var(--primary-500)] transition-all"
              type="button"
              aria-label="Notifications"
            >
              <FiBell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--error)] rounded-full animate-pulse" />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--primary-50)] hover:text-[var(--primary-500)] transition-all"
              aria-label="Shopping Cart"
            >
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-[var(--secondary-500)] to-[var(--secondary-600)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* Auth Buttons - Desktop */}
            {!user ? (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-[var(--primary-500)] hover:bg-[var(--primary-50)] transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] shadow-md hover:shadow-lg transition-all"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="hidden lg:block profile-menu-container relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--primary-50)] hover:text-[var(--primary-500)] transition-all"
                  aria-label="Profile Menu"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center text-white font-semibold shadow-md overflow-hidden">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                    ) : user.full_name ? (
                      user.full_name.charAt(0).toUpperCase()
                    ) : (
                      <FiUser size={18} />
                    )}
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[var(--border-light)] overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-[var(--border-light)] bg-gradient-to-br from-[var(--primary-50)] to-white">
                        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                          {user.full_name || 'User'}
                        </p>
                        <p className="text-xs text-[var(--text-tertiary)] truncate">{user.email}</p>
                        <p className="text-xs text-[var(--primary-500)] font-medium mt-1 capitalize">
                          {user.role}
                        </p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => {
                            navigate(getDashboardRoute());
                            setProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--primary-50)] transition-all"
                        >
                          <FiHome size={16} />
                          <span>
                            {user.role === 'farmer' ? 'My Dashboard' : user.role === 'admin' ? 'Admin Dashboard' : 'My Profile'}
                          </span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--error)] hover:bg-red-50 transition-all"
                        >
                          <FiLogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--primary-50)] transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                      isActive(link.path)
                        ? 'bg-[var(--primary-50)] text-[var(--primary-500)]'
                        : 'text-[var(--text-primary)] hover:bg-[var(--neutral-100)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 mt-4 border-t border-[var(--border-light)] space-y-2">
                  {!user ? (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-lg text-sm font-semibold text-[var(--primary-500)] hover:bg-[var(--primary-50)] transition-all"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] transition-all text-center"
                      >
                        Get Started
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 bg-gradient-to-br from-[var(--primary-50)] to-white rounded-lg">
                        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                          {user.full_name || 'User'}
                        </p>
                        <p className="text-xs text-[var(--text-tertiary)] truncate">{user.email}</p>
                        <p className="text-xs text-[var(--primary-500)] font-medium mt-1 capitalize">
                          {user.role}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          navigate(getDashboardRoute());
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--primary-50)] transition-all"
                      >
                        <FiHome size={16} />
                        <span>
                          {user.role === 'farmer' ? 'My Dashboard' : user.role === 'admin' ? 'Admin Dashboard' : 'My Profile'}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-[var(--error)] hover:bg-red-50 transition-all"
                      >
                        <FiLogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Navbar;
