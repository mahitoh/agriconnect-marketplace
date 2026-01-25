import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GiWheat } from 'react-icons/gi';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaArrowUp, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    marketplace: [
      { label: 'Browse Products', href: '/marketplace' },
      { label: 'Featured Farmers', href: '/farmers' },
      { label: 'Seasonal Picks', href: '#' },
      { label: 'Local Delivery', href: '#' },
    ],
    farmers: [
      { label: 'Become a Seller', href: '/register' },
      { label: 'Farmer Resources', href: '#' },
      { label: 'Success Stories', href: '#' },
      { label: 'Pricing', href: '#' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Mission', href: '#' },
      { label: 'Sustainability', href: '#' },
      { label: 'Press', href: '#' },
    ],
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'FAQs', href: '#' },
      { label: 'Shipping Info', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-[var(--bg-dark)] to-[var(--primary-900)] text-white">
      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-xl flex items-center justify-center hover:shadow-2xl transition-shadow"
        aria-label="Back to top"
      >
        <FaArrowUp />
      </motion.button>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary-400)] to-[var(--accent-500)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <GiWheat size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">AgriConnect</h3>
                <p className="text-xs text-gray-400 -mt-1">Farm to Table</p>
              </div>
            </Link>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              Connecting families with local farmers for transparent, sustainable, and fresh agricultural trade across Cameroon.
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <FaEnvelope className="text-[var(--accent-400)]" />
                Stay Updated
              </h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[var(--accent-400)] focus:ring-2 focus:ring-[var(--accent-400)]/20 transition-all text-sm"
                  required
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[var(--accent-500)] to-[var(--primary-500)] font-semibold text-sm hover:shadow-lg transition-shadow"
                >
                  {subscribed ? '✓' : 'Subscribe'}
                </motion.button>
              </form>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-[var(--accent-400)] mt-2"
                >
                  Thanks for subscribing!
                </motion.p>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-[var(--primary-500)] hover:to-[var(--accent-500)] flex items-center justify-center transition-all"
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-[var(--accent-400)]">Marketplace</h4>
            <ul className="space-y-2.5">
              {footerLinks.marketplace.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 text-[var(--accent-400)]">For Farmers</h4>
            <ul className="space-y-2.5">
              {footerLinks.farmers.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 text-[var(--accent-400)]">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 text-[var(--accent-400)]">Support</h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2026 AgriConnect. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
