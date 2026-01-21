import React, { useState, useEffect } from 'react';

const Error404Page = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f5f0 0%, #e8f1eb 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div style={{ width: '40px', height: '40px', background: '#2d5f3f', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🌾</div>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a' }}>FarmLink</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="/" style={{ color: '#6b7280', textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>Home</a>
            <a href="/marketplace" style={{ color: '#6b7280', textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>Marketplace</a>
            <a href="/farmers" style={{ color: '#6b7280', textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>Farmers</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '800px', textAlign: 'center' }}>
          {/* Animated 404 with Vegetables */}
          <div style={{ position: 'relative', marginBottom: '3rem' }}>
            {/* Floating vegetables around 404 */}
            <div style={{ position: 'absolute', top: '-60px', left: '10%', fontSize: '48px', animation: 'float 3s ease-in-out infinite', animationDelay: '0s' }}>🥕</div>
            <div style={{ position: 'absolute', top: '-40px', right: '15%', fontSize: '48px', animation: 'float 3s ease-in-out infinite', animationDelay: '0.5s' }}>🥬</div>
            <div style={{ position: 'absolute', bottom: '-60px', left: '15%', fontSize: '48px', animation: 'float 3s ease-in-out infinite', animationDelay: '1s' }}>🍅</div>
            <div style={{ position: 'absolute', bottom: '-40px', right: '10%', fontSize: '48px', animation: 'float 3s ease-in-out infinite', animationDelay: '1.5s' }}>🌽</div>
            
            {/* Large 404 */}
            <div style={{ fontSize: '160px', fontWeight: '900', color: '#2d5f3f', lineHeight: 1, marginBottom: '1rem', textShadow: '4px 4px 0px rgba(45, 95, 63, 0.1)' }}>
              404
            </div>
            
            {/* Animated tractor */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${rotation}deg)`, fontSize: '80px', opacity: 0.1 }}>
              🚜
            </div>
          </div>

          {/* Error Message */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1a1a1a', marginBottom: '1rem' }}>
              Oops! This Field is Empty
            </h1>
            <p style={{ fontSize: '18px', color: '#6b7280', lineHeight: '1.7', marginBottom: '2rem' }}>
              Looks like you've wandered off the farm path. The page you're looking for doesn't exist or has been moved to a different field.
            </p>
          </div>

          {/* Suggestions Box */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'left' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🧭 Where would you like to go?
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { icon: '🏠', label: 'Go to Homepage', desc: 'Start fresh from the beginning', link: '/' },
                { icon: '🛒', label: 'Browse Marketplace', desc: 'Discover fresh farm products', link: '/marketplace' },
                { icon: '👨‍🌾', label: 'Meet Our Farmers', desc: 'Connect with local producers', link: '/farmers' },
                { icon: '👤', label: 'My Account', desc: 'View your orders and profile', link: '/account' }
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    border: '2px solid #f3f4f6',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2d5f3f';
                    e.currentTarget.style.background = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#f3f4f6';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ fontSize: '32px' }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '2px' }}>{item.label}</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>{item.desc}</div>
                  </div>
                  <div style={{ fontSize: '20px', color: '#9ca3af' }}>→</div>
                </a>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.history.back()}
              style={{
                padding: '14px 32px',
                background: '#2d5f3f',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(45, 95, 63, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1d4f2f';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2d5f3f';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ← Go Back
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '14px 32px',
                background: 'white',
                color: '#2d5f3f',
                border: '2px solid #2d5f3f',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
              }}
            >
              🏠 Homepage
            </button>
          </div>

          {/* Help Text */}
          <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(45, 95, 63, 0.05)', borderRadius: '12px', border: '1px solid rgba(45, 95, 63, 0.1)' }}>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              💡 <strong>Still lost?</strong> Contact our support team at{' '}
              <a href="mailto:support@farmlink.cm" style={{ color: '#2d5f3f', fontWeight: '600', textDecoration: 'none' }}>
                support@farmlink.cm
              </a>{' '}
              or call us at{' '}
              <a href="tel:+237677123456" style={{ color: '#2d5f3f', fontWeight: '600', textDecoration: 'none' }}>
                +237 677 123 456
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: 'white', borderTop: '1px solid #e5e7eb', padding: '2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '1rem' }}>
            <div style={{ width: '32px', height: '32px', background: '#2d5f3f', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🌾</div>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>FarmLink</span>
          </div>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            © 2026 FarmLink. Connecting farmers with consumers across Cameroon.
          </p>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default Error404Page;
