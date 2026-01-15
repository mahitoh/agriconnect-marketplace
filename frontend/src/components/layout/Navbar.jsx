import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GiWheat } from 'react-icons/gi';
import { FiGlobe, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // Add shadow after small scroll
      setIsScrolled(currentY > 50);

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

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''} ${showHeader ? '' : 'header-hidden'}`}>
      <nav className="nav-container">
        <Link to="/" className="logo-section">
          <div className="logo-icon">
            <GiWheat size={26} />
          </div>
          <div className="logo-title">AgriConnect</div>
        </Link>

        <ul className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/marketplace" 
              className={`nav-link ${isActive('/marketplace') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
          </li>
          <li>
            <Link 
              to="/farmers" 
              className={`nav-link ${isActive('/farmers') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Farmers
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
          </li>
        </ul>

        <div className="nav-actions">
          <button className="icon-btn" type="button" aria-label="Language">
            <FiGlobe />
            <span style={{ marginLeft: 4, fontSize: 13 }}>EN</span>
          </button>
          <button className="icon-btn" type="button" aria-label="Shopping Cart">
            <FiShoppingCart />
            <span className="cart-badge">3</span>
          </button>
          <Link
            to="/login"
            className={`btn btn-outline ${isActive('/login') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className={`btn btn-primary ${isActive('/register') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Join
          </Link>
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
