import React from 'react';
import { FaUsers, FaTractor, FaShoppingCart, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { adminSummary, adminRecentActivity, adminTopFarmers } from '../data/dashboardMock';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <Navbar />

      <section className="section" style={{ paddingTop: '120px' }}>
        <div className="section-header" style={{ textAlign: 'left', maxWidth: '1200px', margin: '0 auto 40px' }}>
          <div className="section-label">Admin Dashboard</div>
          <h2 className="section-title" style={{ marginBottom: 8 }}>
            Platform Overview
          </h2>
          <p className="section-subtitle" style={{ margin: 0 }}>
            Monitoring users, orders, and transaction volume. All values here are dummy statistics for the UI.
          </p>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Summary cards */}
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="dashboard-card-icon">
                <FaUsers />
              </div>
              <div className="dashboard-card-label">Total users</div>
              <div className="dashboard-card-value">{adminSummary.totalUsers}</div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon">
                <FaTractor />
              </div>
              <div className="dashboard-card-label">Registered farmers</div>
              <div className="dashboard-card-value">{adminSummary.farmers}</div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon">
                <FaShoppingCart />
              </div>
              <div className="dashboard-card-label">Active orders</div>
              <div className="dashboard-card-value">{adminSummary.activeOrders}</div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon">
                <FaMoneyBillWave />
              </div>
              <div className="dashboard-card-label">Monthly volume</div>
              <div className="dashboard-card-value">{adminSummary.monthlyVolume}</div>
            </div>
          </div>

          <div className="dashboard-two-columns">
            {/* Recent activity */}
            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <h3>Recent Activity</h3>
                <span className="dashboard-panel-subtitle">Latest actions across the platform</span>
              </div>
              <div className="dashboard-list">
                {adminRecentActivity.map((item) => (
                  <div key={item.id} className="dashboard-list-item">
                    <div>
                      <div className="dashboard-list-title">{item.type}</div>
                      <div className="dashboard-list-subtitle">
                        {item.actor} • {item.target}
                      </div>
                    </div>
                    <div className="dashboard-list-meta">{item.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top farmers */}
            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <h3>
                  <FaChartLine style={{ marginRight: 8 }} />
                  Top Farmers by Revenue
                </h3>
                <span className="dashboard-panel-subtitle">Performance snapshot (dummy data)</span>
              </div>
              <div className="dashboard-list">
                {adminTopFarmers.map((farmer) => (
                  <div key={farmer.id} className="dashboard-list-item">
                    <div>
                      <div className="dashboard-list-title">{farmer.name}</div>
                      <div className="dashboard-list-subtitle">{farmer.region}</div>
                    </div>
                    <div className="dashboard-list-meta">{farmer.revenue}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdminDashboard;

