import React from 'react';
import { FaShoppingBag, FaHeart, FaMoneyBillWave } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { consumerSummary, consumerRecentOrders, consumerSuggestions } from '../data/dashboardMock';

const ConsumerDashboard = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <Navbar />

      <section className="section" style={{ paddingTop: '120px' }}>
        <div className="section-header" style={{ textAlign: 'left', maxWidth: '1200px', margin: '0 auto 40px' }}>
          <div className="section-label">Consumer Dashboard</div>
          <h2 className="section-title" style={{ marginBottom: 8 }}>
            Hi, {consumerSummary.name}
          </h2>
          <p className="section-subtitle" style={{ margin: 0 }}>
            Track your orders and discover new products. This page is powered by dummy data for now.
          </p>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Summary cards */}
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="dashboard-card-icon">
                <FaMoneyBillWave />
              </div>
              <div className="dashboard-card-label">Total spent</div>
              <div className="dashboard-card-value">{consumerSummary.totalSpent}</div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon">
                <FaShoppingBag />
              </div>
              <div className="dashboard-card-label">Orders placed</div>
              <div className="dashboard-card-value">{consumerSummary.ordersCount}</div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon">
                <FaHeart />
              </div>
              <div className="dashboard-card-label">Favourite farmers</div>
              <div className="dashboard-card-value">{consumerSummary.favouriteFarmers}</div>
            </div>
          </div>

          <div className="dashboard-two-columns">
            {/* Recent orders */}
            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <h3>Recent Orders</h3>
                <span className="dashboard-panel-subtitle">Your latest purchases</span>
              </div>
              <div className="table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Farmer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consumerRecentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.farmer}</td>
                        <td>{order.total}</td>
                        <td>{order.status}</td>
                        <td>{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Suggestions */}
            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <h3>Suggested for You</h3>
                <span className="dashboard-panel-subtitle">Discover fresh products from our farmers</span>
              </div>
              <div className="dashboard-list">
                {consumerSuggestions.map((item) => (
                  <div key={item.id} className="dashboard-list-item">
                    <div>
                      <div className="dashboard-list-title">{item.name}</div>
                      <div className="dashboard-list-subtitle">{item.farmer}</div>
                    </div>
                    <div className="dashboard-list-meta">{item.price}</div>
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

export default ConsumerDashboard;

