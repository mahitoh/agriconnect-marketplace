import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import GoogleLogo from '../assets/Google.png';
import FacebookLogo from '../assets/facebook.png';
import { GiWheat } from 'react-icons/gi';
import {
  FaCheck,
  FaMoneyBillWave,
  FaMobileAlt,
  FaTruck,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // UI-only for now
    // console.log('Login form submitted', formData);
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

            <h1 className="auth-left-title">Connect With Local Farmers</h1>
            <p className="auth-left-text">
              Sign in to access transparent pricing, verified farmers, and convenient delivery across Cameroon.
            </p>

            <ul className="auth-feature-list">
              <li className="auth-feature-item">
                <div className="auth-feature-icon">
                  <FaCheck />
                </div>
                <div>
                  <strong>Verified Farmers</strong>
                  <br />
                  All producers are reviewed before joining.
                </div>
              </li>
              <li className="auth-feature-item">
                <div className="auth-feature-icon">
                  <FaMoneyBillWave />
                </div>
                <div>
                  <strong>Fair Prices</strong>
                  <br />
                  Most of your payment goes directly to farmers.
                </div>
              </li>
              <li className="auth-feature-item">
                <div className="auth-feature-icon">
                  <FaMobileAlt />
                </div>
                <div>
                  <strong>Easy Payments</strong>
                  <br />
                  MTN Mobile Money and cash on delivery.
                </div>
              </li>
              <li className="auth-feature-item">
                <div className="auth-feature-icon">
                  <FaTruck />
                </div>
                <div>
                  <strong>Fast Delivery</strong>
                  <br />
                  Fresh products in 24–48 hours.
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
                <button className="auth-tab active" type="button">
                  Sign In
                </button>
                <button
                  className="auth-tab"
                  type="button"
                  onClick={() => {}}
                >
                  <Link to="/register" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    Sign Up
                  </Link>
                </button>
              </div>

              <h2 className="auth-title">Welcome Back</h2>
              <p className="auth-subtitle">
                Sign in to continue ordering or managing your agricultural products.
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
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
                    placeholder="Enter your password"
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

              <div className="auth-forgot">
                <button type="button">Forgot password?</button>
              </div>

              <button type="submit" className="auth-submit-btn">
                Sign In
              </button>

              <div className="auth-divider">
                <div className="auth-divider-line" />
                <span className="auth-divider-text">OR</span>
                <div className="auth-divider-line" />
              </div>

              <div className="auth-social-grid">
                <button type="button" className="auth-social-btn">
                  <span className="auth-social-icon">
                    <img src={GoogleLogo} alt="Google" style={{ width: '20px', height: '20px' }} />
                  </span>
                  Google
                </button>
                <button type="button" className="auth-social-btn">
                  <span className="auth-social-icon">
                    <img src={FacebookLogo} alt="Facebook" style={{ width: '20px', height: '20px' }} />
                  </span>
                  Facebook
                </button>
              </div>

              <div className="auth-footer-text">
                <p>
                  Don&apos;t have an account?{' '}
                  <Link to="/register">Sign Up</Link>
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

export default Login;