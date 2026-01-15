import React from 'react';
import { GiWheat } from 'react-icons/gi';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer id="about" className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="logo-icon">
              <GiWheat size={22} />
            </div>
            <div className="logo-title">AgriConnect</div>
          </div>
          <p className="footer-desc">
            Connecting families with local farmers for transparent, sustainable, and fresh agricultural trade.
          </p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Marketplace</h3>
          <ul className="footer-links">
            <li><a href="/marketplace">Browse Products</a></li>
            <li><a href="/farmers">Featured Farmers</a></li>
            <li><a href="#">Seasonal Picks</a></li>
            <li><a href="#">Local Delivery</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>For Farmers</h3>
          <ul className="footer-links">
            <li><a href="#">Become a Seller</a></li>
            <li><a href="#">Farmer Resources</a></li>
            <li><a href="#">Success Stories</a></li>
            <li><a href="#">Pricing</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Company</h3>
          <ul className="footer-links">
            <li><a href="/about">About Us</a></li>
            <li><a href="#">Our Mission</a></li>
            <li><a href="#">Sustainability</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Support</h3>
          <ul className="footer-links">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Shipping Info</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 AgriConnect. All rights reserved.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
