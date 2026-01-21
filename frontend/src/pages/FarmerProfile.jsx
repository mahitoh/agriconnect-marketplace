import React, { useState } from 'react';

const FarmerProfile = () => {
  const [activeTab, setActiveTab] = useState('products');

  // Farmer Data
  const farmer = {
    id: 1,
    name: 'Jean-Pierre Mballa',
    farmName: 'Ferme Bio Mballa',
    location: 'Yaoundé, Centre Region',
    memberSince: 'March 2024',
    rating: 4.9,
    totalReviews: 234,
    totalProducts: 45,
    totalOrders: 892,
    yearsExperience: 12,
    responseTime: '< 2 hours',
    coverImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1400&h=400&fit=crop',
    profileImage: 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=200&h=200&fit=crop',
    badges: ['🌱 Organic', '♻️ Sustainable', '🚫 Non-GMO', '✓ Verified'],
    bio: 'Third-generation farmer committed to organic agriculture and sustainable farming practices. Our family has been cultivating this land for over 30 years, and we take pride in producing the freshest, highest-quality vegetables and fruits without the use of harmful pesticides or chemicals. We believe in working with nature, not against it, to create products that are not only delicious but also beneficial for your health and the environment.',
    philosophy: 'At Ferme Bio Mballa, we practice regenerative farming techniques that improve soil health, conserve water, and promote biodiversity. Every product we grow is a testament to our commitment to quality and sustainability.',
    certifications: ['Organic Certification', 'Sustainable Farming Practice', 'Local Farmers Association Member']
  };

  // Products
  const products = [
    { id: 1, name: 'Organic Vegetable Basket', category: 'Vegetables', price: 15000, stock: 45, sales: 234, image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=300&h=300&fit=crop', rating: 4.8 },
    { id: 2, name: 'Fresh Tomatoes (5kg)', category: 'Vegetables', price: 8500, stock: 120, sales: 456, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&h=300&fit=crop', rating: 4.9 },
    { id: 3, name: 'Organic Lettuce Bundle', category: 'Vegetables', price: 3500, stock: 80, sales: 189, image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=300&h=300&fit=crop', rating: 4.7 },
    { id: 4, name: 'Mixed Fruit Basket', category: 'Fruits', price: 12000, stock: 35, sales: 298, image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300&h=300&fit=crop', rating: 5.0 },
    { id: 5, name: 'Fresh Carrots (3kg)', category: 'Vegetables', price: 4500, stock: 95, sales: 367, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop', rating: 4.8 },
    { id: 6, name: 'Organic Bell Peppers', category: 'Vegetables', price: 6000, stock: 60, sales: 178, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&h=300&fit=crop', rating: 4.6 }
  ];

  // Reviews
  const reviews = [
    { id: 1, author: 'Marie Nguema', rating: 5, date: '2026-01-15', comment: 'Amazing quality vegetables! Fresh and organic. Will definitely order again.', avatar: 'MN' },
    { id: 2, author: 'Pierre Kamga', rating: 5, date: '2026-01-12', comment: 'Best farmer on the platform. Products always arrive fresh and well-packaged.', avatar: 'PK' },
    { id: 3, author: 'Aminata Sow', rating: 4, date: '2026-01-08', comment: 'Great quality products. Delivery was a bit delayed but worth the wait.', avatar: 'AS' },
    { id: 4, author: 'Jean Tchoua', rating: 5, date: '2026-01-05', comment: 'Outstanding! The vegetables taste so much better than store-bought.', avatar: 'JT' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: '#2d5f3f', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🌾</div>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a1a' }}>FarmLink</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>← Back to Farmers</a>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>Marketplace</a>
            <button style={{ padding: '10px 20px', background: '#2d5f3f', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
              🛒 Cart (3)
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Cover */}
      <div style={{ position: 'relative', height: '400px', background: `url(${farmer.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))' }}></div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'flex-end', gap: '2rem' }}>
            <img src={farmer.profileImage} alt={farmer.name} style={{ width: '160px', height: '160px', borderRadius: '20px', border: '4px solid white', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }} />
            <div style={{ flex: 1, paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {farmer.badges.map((badge, i) => (
                  <span key={i} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: '12px', fontSize: '13px', fontWeight: '600', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                    {badge}
                  </span>
                ))}
              </div>
              <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'white', margin: '0 0 8px 0' }}>{farmer.name}</h1>
              <div style={{ fontSize: '20px', color: 'rgba(255,255,255,0.95)', marginBottom: '8px', fontWeight: '600' }}>{farmer.farmName}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '15px', color: 'rgba(255,255,255,0.9)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📍 {farmer.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>⭐ {farmer.rating} ({farmer.totalReviews} reviews)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📦 {farmer.totalOrders} orders</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', paddingBottom: '1rem' }}>
              <button style={{ padding: '12px 24px', background: 'white', color: '#2d5f3f', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                ❤️ Follow
              </button>
              <button style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
                💬 Contact
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Stats Card */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem' }}>Farmer Stats</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Experience</div>
                  <div style={{ fontSize: '18px', fontWeight: '700' }}>{farmer.yearsExperience} years</div>
                </div>
                <div style={{ height: '1px', background: '#f3f4f6' }}></div>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Products</div>
                  <div style={{ fontSize: '18px', fontWeight: '700' }}>{farmer.totalProducts}</div>
                </div>
                <div style={{ height: '1px', background: '#f3f4f6' }}></div>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Response Time</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#059669' }}>{farmer.responseTime}</div>
                </div>
                <div style={{ height: '1px', background: '#f3f4f6' }}></div>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Member Since</div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>{farmer.memberSince}</div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem' }}>Certifications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {farmer.certifications.map((cert, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#059669' }}>
                    <span>✓</span>
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badge */}
            <div style={{ background: 'linear-gradient(135deg, #2d5f3f, #3d7f5f)', borderRadius: '16px', padding: '1.5rem', color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛡️</div>
              <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Verified Farmer</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Identity & farm verified by FarmLink</div>
            </div>
          </div>

          {/* Main Content */}
          <div>
            {/* Tabs */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              {[
                { id: 'products', label: 'Products', icon: '🌱' },
                { id: 'about', label: 'About', icon: '📖' },
                { id: 'reviews', label: 'Reviews', icon: '⭐' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '10px 20px',
                    background: activeTab === tab.id ? '#2d5f3f' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#6b7280',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '700' }}>All Products ({products.length})</h2>
                  <select style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', fontWeight: '600' }}>
                    <option>All Categories</option>
                    <option>Vegetables</option>
                    <option>Fruits</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                  {products.map(product => (
                    <div key={product.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer' }}>
                      <div style={{ position: 'relative' }}>
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                        {product.stock < 50 && (
                          <span style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 10px', background: '#fef2f2', color: '#dc2626', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                            Low Stock
                          </span>
                        )}
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>{product.category}</div>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>{product.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#f59e0b', marginBottom: '10px' }}>
                          ⭐ {product.rating} <span style={{ color: '#9ca3af' }}>({product.sales} sold)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '20px', fontWeight: '800', color: '#2d5f3f' }}>{product.price.toLocaleString()} FCFA</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Stock: {product.stock}</div>
                          </div>
                          <button style={{ padding: '10px 16px', background: '#2d5f3f', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '1.5rem' }}>About {farmer.name}</h2>
                <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#374151', marginBottom: '2rem' }}>
                  {farmer.bio}
                </div>

                <div style={{ height: '1px', background: '#f3f4f6', margin: '2rem 0' }}></div>

                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '1rem' }}>Our Philosophy</h3>
                <div style={{ fontSize: '15px', lineHeight: '1.8', color: '#374151', background: '#f9fafb', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #2d5f3f' }}>
                  {farmer.philosophy}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
                  <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f9fafb', borderRadius: '12px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌱</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>100% Organic</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>No pesticides or chemicals</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f9fafb', borderRadius: '12px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>♻️</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Sustainable</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Regenerative farming</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f9fafb', borderRadius: '12px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🤝</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Community</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Supporting local economy</div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                {/* Rating Summary */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '64px', fontWeight: '800', color: '#2d5f3f', marginBottom: '8px' }}>{farmer.rating}</div>
                      <div style={{ fontSize: '24px', color: '#f59e0b', marginBottom: '8px' }}>⭐⭐⭐⭐⭐</div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>{farmer.totalReviews} reviews</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                      {[5, 4, 3, 2, 1].map(star => (
                        <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '600', width: '60px' }}>{star} stars</span>
                          <div style={{ flex: 1, height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: star === 5 ? '85%' : star === 4 ? '12%' : '3%', height: '100%', background: '#f59e0b' }}></div>
                          </div>
                          <span style={{ fontSize: '13px', color: '#6b7280', width: '40px' }}>{star === 5 ? '85%' : star === 4 ? '12%' : '3%'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reviews.map(review => (
                    <div key={review.id} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2d5f3f', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px' }}>
                          {review.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <div style={{ fontSize: '15px', fontWeight: '700' }}>{review.author}</div>
                            <div style={{ fontSize: '13px', color: '#9ca3af' }}>{review.date}</div>
                          </div>
                          <div style={{ color: '#f59e0b', fontSize: '14px', marginBottom: '8px' }}>
                            {'⭐'.repeat(review.rating)}
                          </div>
                          <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>{review.comment}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;