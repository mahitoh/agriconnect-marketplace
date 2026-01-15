import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { GiWheat } from 'react-icons/gi';
import {
  FaCheck,
  FaMoneyBillWave,
  FaMobileAlt,
  FaTruck,
  FaShoppingBag,
  FaTractor,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebookF
} from 'react-icons/fa';

const Register = () => {
  const [userType, setUserType] = useState('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    farmName: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // UI-only for now
    // console.log('Register form submitted', { userType, formData });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <Navbar />

      <main className="auth-page">
        {/* Left side hero */}
        <section className="auth-left-panel">
          <div className="auth-left-content">
            <div className="auth-logo-section">
              <div className="auth-logo-icon">
                <GiWheat size={32} color="#2d5f3f" />
              </div>
              <div className="auth-logo-title">AgriConnect</div>
            </div>

            <h1 className="auth-left-title">Join the Digital Marketplace</h1>
            <p className="auth-left-text">
              Create your AgriConnect account to start buying or selling fresh agricultural products directly.
            </p>

            <ul className="auth-feature-list">
              <li className="auth-feature-item">
                <div className="auth-feature-icon">
                  <FaCheck />
                </div>
                <div>
                  <strong>Verified Farmers</strong>
                  <br />
                  Every producer is checked before going live.
                </div>
              </li>
              <li className="auth-feature-item">
                <div className="auth-feature-icon">
                  <FaMoneyBillWave />
                </div>
                <div>
                  <strong>Fair & Transparent</strong>
                  <br />
                  Clear pricing for both farmers and consumers.
                </div>
              </li>
              <li className="auth-feature-item">
                <div className="auth-feature-icon">
                  <FaMobileAlt />
                </div>
                <div>
                  <strong>Mobile Payments</strong>
                  <br />
                  MTN Mobile Money integration (UI-ready).
                </div>
              </li>
              <li className="auth-feature-item">
                <div className="auth-feature-icon">
                  <FaTruck />
                </div>
                <div>
                  <strong>Efficient Delivery</strong>
                  <br />
                  Optimised for fresh, local deliveries.
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Right side form */}
        <section className="auth-right-panel">
          <div className="auth-form-container">
            <div className="auth-header">
              <div className="auth-tabs">
                <button
                  className="auth-tab"
                  type="button"
                >
                  <Link to="/login" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    Sign In
                  </Link>
                </button>
                <button className="auth-tab active" type="button">
                  Sign Up
                </button>
              </div>

              <h2 className="auth-title">Create your account</h2>
              <p className="auth-subtitle">
                Choose your role and complete the form to join the AgriConnect platform.
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {/* User type selector */}
              <div className="auth-user-type-grid">
                <button
                  type="button"
                  className={`auth-user-type-card ${userType === 'buyer' ? 'active' : ''}`}
                  onClick={() => setUserType('buyer')}
                >
                  <div className="auth-user-type-icon">
                    <FaShoppingBag size={24} />
                  </div>
                  <div className="auth-user-type-title">I&apos;m a Consumer</div>
                  <div className="auth-user-type-desc">Buy fresh products</div>
                </button>

                <button
                  type="button"
                  className={`auth-user-type-card ${userType === 'farmer' ? 'active' : ''}`}
                  onClick={() => setUserType('farmer')}
                >
                  <div className="auth-user-type-icon">
                    <FaTractor size={24} />
                  </div>
                  <div className="auth-user-type-title">I&apos;m a Farmer</div>
                  <div className="auth-user-type-desc">Sell your produce</div>
                </button>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="fullName">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="form-input"
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              {userType === 'farmer' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="farmName">
                    Farm Name *
                  </label>
                  <input
                    id="farmName"
                    name="farmName"
                    type="text"
                    className="form-input"
                    placeholder="Your farm name"
                    value={formData.farmName}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="auth-two-column-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-input"
                    placeholder="+237 6XX XXX XXX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="location">
                    Location *
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    className="form-input"
                    placeholder="City, Region"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-two-column-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="password">
                    Password *
                  </label>
                  <div className="auth-password-wrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="confirmPassword">
                    Confirm Password *
                  </label>
                  <div className="auth-password-wrapper">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="auth-checkbox-row">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  className="auth-checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="acceptTerms" className="auth-checkbox-label">
                  I agree to the <a>Terms &amp; Conditions</a> and <a>Privacy Policy</a>.
                </label>
              </div>

              <button type="submit" className="auth-submit-btn">
                Create Account
              </button>

              <div className="auth-divider">
                <div className="auth-divider-line" />
                <span className="auth-divider-text">OR</span>
                <div className="auth-divider-line" />
              </div>

              <div className="auth-social-grid">
                <button type="button" className="auth-social-btn">
                  <span className="auth-social-icon">
                    <FaGoogle />
                  </span>
                  Google
                </button>
                <button type="button" className="auth-social-btn">
                  <span className="auth-social-icon">
                    <FaFacebookF />
                  </span>
                  Facebook
                </button>
              </div>

              <div className="auth-footer-text">
                <p>
                  Already have an account? <Link to="/login">Sign In</Link>
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
