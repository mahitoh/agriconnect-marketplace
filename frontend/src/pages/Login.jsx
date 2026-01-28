import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GiWheat } from 'react-icons/gi';
import { FaEnvelope, FaLock, FaArrowRight, FaGoogle, FaFacebook } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/input';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      login({
        name: 'John Doe',
        email: formData.email,
        role: 'consumer'
      });
      setLoading(false);
      navigate('/consumer/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative pt-24">
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 groupmb-10 ">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
            <GiWheat size={20} />
          </div>
          <span className="font-bold text-xl text-[var(--text-primary)]">AgriConnect</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-3">Welcome Back! 👋</h1>
            <p className="text-[var(--text-secondary)] text-lg">
              Sign in to access your dashboard and continue your journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              icon={<FaEnvelope size={16} />}
              required
            />

            <div>
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                icon={<FaLock size={16} />}
                required
              />
              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-[var(--primary-600)] hover:text-[var(--primary-700)] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white font-bold text-lg shadow-lg hover:shadow-[var(--primary-500)]/40 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <FaArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[var(--border-color)]" />
            <span className="text-sm text-[var(--text-tertiary)] font-medium">Or continue with</span>
            <div className="h-px flex-1 bg-[var(--border-color)]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border-2 border-[var(--border-color)] rounded-xl hover:bg-[var(--bg-secondary)] hover:border-[var(--primary-200)] transition-all font-medium text-[var(--text-secondary)]">
              <FaGoogle className="text-red-500" /> Google 
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border-2 border-[var(--border-color)] rounded-xl hover:bg-[var(--bg-secondary)] hover:border-[var(--primary-200)] transition-all font-medium text-[var(--text-secondary)]">
              <FaFacebook className="text-blue-600" /> Facebook
            </button>
          </div>

          <p className="mt-8 text-center text-[var(--text-secondary)]">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[var(--primary-600)] hover:text-[var(--primary-700)] hover:underline">
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Image/Decoration */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-[var(--primary-900)]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=1600&h=1600&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-900)]/90 to-[var(--accent-900)]/80" />

        <div className="absolute inset-0 flex flex-col justify-center px-20 text-white z-10">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 border border-white/20">
              <span className="text-4xl">🌱</span>
            </div>
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Start Your <br />
              <span className="text-[var(--accent-400)]">Sustainable</span> Journey
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-lg">
              Join thousands of farmers and conscious consumers building a better future for agriculture in Cameroon.
            </p>

            <div className="mt-12 flex gap-4">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-[var(--primary-900)] overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1 text-[var(--accent-400)]">
                  ⭐⭐⭐⭐⭐
                </div>
                <span className="text-sm font-medium">Trusted by 10,000+ users</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;