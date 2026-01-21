import React, { useState } from 'react';

const ConsumerDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const consumerData = {
    name: 'Marie Nguema',
    email: 'marie.nguema@email.cm',
    phone: '+237 677 123 456',
    location: 'Douala, Littoral',
    memberSince: 'Feb 2024',
    avatar: 'MN',
    totalSpent: '450,000 FCFA',
    ordersCount: 23,
    favouriteFarmers: 5
  };

  const recentOrders = [
    { id: 'FL-847293', farmer: 'Ferme Mballa', items: 'Vegetable Basket, Eggs', total: '32,000 FCFA', status: 'delivered', date: '2026-01-15', image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=100&h=100&fit=crop' },
    { id: 'FL-847290', farmer: 'Poulailler Fotso', items: 'Farm Eggs (30)', total: '18,500 FCFA', status: 'shipped', date: '2026-01-18', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=100&h=100&fit=crop' },
    { id: 'FL-847287', farmer: 'Les Jardins', items: 'Fresh Fruits', total: '25,000 FCFA', status: 'processing', date: '2026-01-19', image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=100&h=100&fit=crop' },
    { id: 'FL-847285', farmer: 'Ferme Bio Mballa', items: 'Organic Vegetables', total: '45,000 FCFA', status: 'pending', date: '2026-01-20', image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=100&h=100&fit=crop' }
  ];

  const suggestions = [
    { id: 1, name: 'Organic Tomatoes (5kg)', farmer: 'Ferme Mballa', price: '8,500 FCFA', rating: 4.8, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=200&h=200&fit=crop' },
    { id: 2, name: 'Fresh Farm Eggs (30)', farmer: 'Poulailler Fotso', price: '4,500 FCFA', rating: 4.9, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop' },
    { id: 3, name: 'Mixed Fruit Basket', farmer: 'Les Jardins', price: '12,000 FCFA', rating: 4.7, image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=200&h=200&fit=crop' },
    { id: 4, name: 'Organic Honey (1L)', farmer: 'Ferme Nkembe', price: '15,000 FCFA', rating: 5.0, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784502?w=200&h=200&fit=crop' }
  ];

  const savedAddresses = [
    { id: 1, label: 'Home', address: 'Akwa, Douala', phone: '+237 677 123 456', isDefault: true },
    { id: 2, label: 'Work', address: 'Bonanjo, Douala', phone: '+237 677 123 456', isDefault: false }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      delivered: { bg: '#ecfdf5', color: '#059669', icon: '✓', label: 'Delivered' },
      shipped: { bg: '#eff6ff', color: '#2563eb', icon: '🚚', label: 'Shipped' },
      processing: { bg: '#fef3c7', color: '#d97706', icon: '⏳', label: 'Processing' },
      pending: { bg: '#fef2f2', color: '#dc2626', icon: '⏰', label: 'Pending' },
      cancelled: { bg: '#f3f4f6', color: '#6b7280', icon: '✕', label: 'Cancelled' }
    };
    
    const style = styles[status] || styles.pending;
    
    return (
      <span style={{ padding: '6px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: '600', background: style.bg, color: style.color, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <span>{style.icon}</span> {style.label}
      </span>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f5f0 0%, #e8f1eb 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: '#2d5f3f', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🌾</div>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a' }}>FarmLink</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>Home</a>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>Marketplace</a>
            <a href="#" style={{ color: '#2d5f3f', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>My Account</a>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2d5f3f', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
              {consumerData.avatar}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Welcome Banner */}
        <div style={{ background: 'linear-gradient(135deg, #2d5f3f 0%, #1d4f2f 100%)', borderRadius: '24px', padding: '3rem', marginBottom: '2rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', transform: 'translate(30%, -30%)' }}></div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', transform: 'translate(-30%, 30%)' }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', opacity: 0.9, marginBottom: '8px' }}>Welcome back! 👋</div>
              <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 12px 0' }}>{consumerData.name}</h1>
              <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>Discover fresh products from local farmers</p>
            </div>
            <button style={{ padding: '14px 28px', background: 'white', color: '#2d5f3f', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              🛒 Browse Marketplace
            </button>
          </div>
        </div>

        {/* Profile & Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Profile Card */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', height: 'fit-content' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #2d5f3f, #3d7f5f)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: '800', margin: '0 auto 1rem', boxShadow: '0 8px 20px rgba(45,95,63,0.3)' }}>
                {consumerData.avatar}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 4px 0' }}>{consumerData.name}</h3>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>{consumerData.email}</p>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>{consumerData.phone}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', padding: '6px 12px', background: '#f3f4f6', borderRadius: '16px', fontSize: '13px', color: '#6b7280' }}>
                📍 {consumerData.location}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ color: '#6b7280' }}>Member since</span>
                <span style={{ fontWeight: '600' }}>{consumerData.memberSince}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#6b7280' }}>Account status</span>
                <span style={{ color: '#059669', fontWeight: '600' }}>✓ Verified</span>
              </div>
            </div>

            <button style={{ width: '100%', padding: '12px', background: '#2d5f3f', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginBottom: '10px' }}>
              Edit Profile
            </button>
            <button style={{ width: '100%', padding: '12px', background: 'transparent', color: '#6b7280', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
              Settings
            </button>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'transform 0.3s', cursor: 'pointer' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #2d5f3f, #3d7f5f)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '1rem' }}>
                💰
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Total Spent</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a' }}>{consumerData.totalSpent}</div>
            </div>

            <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'transform 0.3s', cursor: 'pointer' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '1rem' }}>
                📦
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Orders Placed</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a' }}>{consumerData.ordersCount}</div>
            </div>

            <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'transform 0.3s', cursor: 'pointer' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '1rem' }}>
                ❤️
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>Favorite Farmers</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a' }}>{consumerData.favouriteFarmers}</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚡ Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { icon: '👤', label: 'My Profile', color: '#2d5f3f' },
              { icon: '📍', label: 'Addresses', color: '#3b82f6' },
              { icon: '💳', label: 'Payments', color: '#8b5cf6' },
              { icon: '⭐', label: 'Reviews', color: '#f59e0b' }
            ].map((action, i) => (
              <div key={i} style={{ padding: '1.5rem', border: '2px solid #f3f4f6', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{action.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>{action.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
          {/* Recent Orders */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Recent Orders</h2>
              <button style={{ padding: '8px 16px', background: 'transparent', color: '#2d5f3f', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                View All
              </button>
            </div>

            {recentOrders.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentOrders.map(order => (
                  <div key={order.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '16px', transition: 'all 0.3s', cursor: 'pointer' }}>
                    <img src={order.image} alt={order.items} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#2d5f3f' }}>{order.id}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>{order.items}</div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>From {order.farmer}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>{order.total}</span>
                        <span style={{ fontSize: '13px', color: '#9ca3af' }}>{order.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '64px', marginBottom: '1rem' }}>📦</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No orders yet</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '1.5rem' }}>Start shopping fresh farm products</p>
                <button style={{ padding: '12px 24px', background: '#2d5f3f', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                  Browse Products →
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Suggested Products */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '1.5rem' }}>Suggested for You</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {suggestions.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '12px', padding: '12px', border: '1px solid #f3f4f6', borderRadius: '12px', transition: 'all 0.3s', cursor: 'pointer' }}>
                    <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>{item.farmer}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '15px', fontWeight: '700', color: '#2d5f3f' }}>{item.price}</span>
                        <span style={{ fontSize: '13px', color: '#f59e0b' }}>★ {item.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Addresses */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '1.5rem' }}>Saved Addresses</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {savedAddresses.map(addr => (
                  <div key={addr.id} style={{ padding: '12px', border: '1px solid #f3f4f6', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700' }}>{addr.label}</span>
                      {addr.isDefault && (
                        <span style={{ fontSize: '11px', padding: '2px 8px', background: '#ecfdf5', color: '#059669', borderRadius: '8px', fontWeight: '600' }}>Default</span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>{addr.address}</div>
                  </div>
                ))}
                <button style={{ padding: '10px', background: 'transparent', color: '#2d5f3f', border: '2px dashed #e5e7eb', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  + Add New Address
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;