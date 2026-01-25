import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GiWheat } from 'react-icons/gi';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaStore,
  FaArrowRight,
  FaArrowLeft,
  FaCheckCircle,
  FaShoppingBag,
  FaTractor
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/input';

const Register = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('buyer'); // 'buyer' or 'farmer'
  const [loading, setLoading] = useState(false);
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      signup({
        ...formData,
        role: userType === 'buyer' ? 'customer' : 'farmer'
      });
      setLoading(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Progress & Form */}
      <div className="w-full lg:w-1/2 flex flex-col px-8 sm:px-12 lg:px-20 xl:px-24 py-12 relative overflow-y-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group w-fit mb-12">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
            <GiWheat size={20} />
          </div>
          <span className="font-bold text-xl text-[var(--text-primary)]">AgriConnect</span>
        </Link>

        <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">
              Join AgriConnect 🚀
            </h1>
            <p className="text-[var(--text-secondary)]">
              Create your account and start your journey towards fresher, fairer food.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= i
                  ? 'bg-[var(--primary-500)] text-white shadow-lg shadow-[var(--primary-500)]/30'
                  : 'bg-[var(--neutral-200)] text-[var(--text-tertiary)]'
                  }`}>
                  {step > i ? <FaCheckCircle /> : i}
                </div>
                {i < 3 && (
                  <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-300 ${step > i ? 'bg-[var(--primary-500)]' : 'bg-[var(--neutral-100)]'
                    }`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Select your role</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setUserType('buyer')}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 text-center ${userType === 'buyer'
                        ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-700)] shadow-md'
                        : 'border-[var(--border-color)] hover:border-[var(--primary-200)] hover:bg-[var(--bg-secondary)]'
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${userType === 'buyer' ? 'bg-[var(--primary-200)]' : 'bg-[var(--neutral-100)]'
                        }`}>
                        <FaShoppingBag size={20} />
                      </div>
                      <span className="font-semibold">I'm a Buyer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUserType('farmer')}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 text-center ${userType === 'farmer'
                        ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-700)] shadow-md'
                        : 'border-[var(--border-color)] hover:border-[var(--primary-200)] hover:bg-[var(--bg-secondary)]'
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${userType === 'farmer' ? 'bg-[var(--primary-200)]' : 'bg-[var(--neutral-100)]'
                        }`}>
                        <FaTractor size={20} />
                      </div>
                      <span className="font-semibold">I'm a Farmer</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Personal Details</h3>
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    icon={<FaUser size={16} />}
                    placeholder="John Doe"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    icon={<FaEnvelope size={16} />}
                    placeholder="john@example.com"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      icon={<FaPhone size={16} />}
                      placeholder="+237..."
                    />
                    <Input
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      icon={<FaMapMarkerAlt size={16} />}
                      placeholder="City, Region"
                    />
                  </div>
                  {userType === 'farmer' && (
                    <Input
                      label="Farm Name"
                      name="farmName"
                      value={formData.farmName}
                      onChange={handleChange}
                      icon={<FaStore size={16} />}
                      placeholder="Green Valley Farms"
                    />
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Secure your account</h3>
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    icon={<FaLock size={16} />}
                    placeholder="Create a password"
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    icon={<FaLock size={16} />}
                    placeholder="Confirm password"
                  />

                  <label className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border-color)] cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="w-5 h-5 rounded text-[var(--primary-500)] focus:ring-[var(--primary-500)]"
                    />
                    <span className="text-sm text-[var(--text-secondary)]">
                      I agree to the <span className="text-[var(--primary-600)] font-semibold">Terms</span> and <span className="text-[var(--primary-600)] font-semibold">Privacy Policy</span>
                    </span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-4 rounded-xl font-bold text-[var(--text-secondary)] hover:bg-[var(--neutral-100)] transition-all flex items-center gap-2"
                >
                  <FaArrowLeft /> Back
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-4 rounded-xl bg-[var(--primary-500)] text-white font-bold shadow-lg hover:shadow-[var(--primary-500)]/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  Continue <FaArrowRight />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white font-bold shadow-lg hover:shadow-[var(--primary-500)]/40 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Create Account <FaCheckCircle /></>
                  )}
                </button>
              )}
            </div>
          </form>

          <p className="mt-8 text-center text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[var(--primary-600)] hover:text-[var(--primary-700)] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Decoration */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden bg-[var(--secondary-500)]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1600&h=1600&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-bl from-[var(--secondary-900)]/80 to-[var(--primary-900)]/80" />

        <div className="absolute inset-0 flex flex-col justify-center px-20 text-white z-10">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-5xl font-bold mb-8 leading-tight">
              Join a Growing <br />
              <span className="text-[var(--secondary-300)]">Community</span>
            </h2>

            <div className="space-y-8">
              {[
                { title: 'For Farmers', desc: 'Reach thousands of customers directly and get fair prices for your produce.', icon: '🚜' },
                { title: 'For Consumers', desc: 'Access fresh, organic produce delivered straight from the farm to your table.', icon: '🥗' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all">
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{item.title}</h3>
                    <p className="text-white/80 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
