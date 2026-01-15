import React, { useState } from 'react';
import {
  FaShoppingBasket,
  FaBoxOpen,
  FaMoneyBillWave,
  FaCheckCircle,
  FaListUl,
  FaPlusCircle,
  FaClipboardList,
  FaCreditCard,
  FaChartLine,
  FaBell,
  FaUserCircle,
  FaQuestionCircle
} from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  farmerSummary,
  farmerRecentOrders,
  farmerProducts,
  farmerPayments,
  farmerEarningsByMonth,
  farmerInventory,
  farmerNotifications,
  farmerSupportTickets
} from '../data/dashboardMock';

const SECTIONS = {
  DASHBOARD: 'dashboard',
  PRODUCTS: 'products',
  ADD_PRODUCT: 'addProduct',
  ORDERS: 'orders',
  PAYMENTS: 'payments',
  EARNINGS: 'earnings',
  INVENTORY: 'inventory',
  NOTIFICATIONS: 'notifications',
  PROFILE: 'profile',
  SUPPORT: 'support'
};

const FarmerDashboard = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS.DASHBOARD);

  const renderDashboardOverview = () => (
    <>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            <FaMoneyBillWave />
          </div>
          <div className="dashboard-card-label">Revenue this month</div>
          <div className="dashboard-card-value">{farmerSummary.revenueThisMonth}</div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            <FaShoppingBasket />
          </div>
          <div className="dashboard-card-label">Orders this month</div>
          <div className="dashboard-card-value">{farmerSummary.ordersThisMonth}</div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            <FaBoxOpen />
          </div>
          <div className="dashboard-card-label">Active products</div>
          <div className="dashboard-card-value">{farmerSummary.activeProducts}</div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            <FaCheckCircle />
          </div>
          <div className="dashboard-card-label">Order fulfillment rate</div>
          <div className="dashboard-card-value">{farmerSummary.fulfillmentRate}</div>
        </div>
      </div>

      <div className="dashboard-two-columns">
        {/* Recent orders */}
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h3>Recent Orders</h3>
            <span className="dashboard-panel-subtitle">Latest orders from your customers (dummy data)</span>
          </div>

          <div className="table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {farmerRecentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.total}</td>
                    <td>
                      <span className={`status-pill status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Simple earnings chart (UI only) */}
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h3>Monthly Earnings</h3>
            <span className="dashboard-panel-subtitle">Dummy data – visual-only bar chart</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {farmerEarningsByMonth.map((item) => {
              const max = Math.max(...farmerEarningsByMonth.map((m) => m.amount));
              const width = `${(item.amount / max) * 100}%`;
              return (
                <div key={item.month} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 40, fontSize: 13, color: '#6b7280' }}>{item.month}</span>
                  <div style={{ flex: 1, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden' }}>
                    <div
                      style={{
                        width,
                        height: 10,
                        background: '#2d5f3f'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );

  const renderProducts = () => (
    <div className="dashboard-panel">
      <div className="dashboard-panel-header">
        <h3>My Products</h3>
        <span className="dashboard-panel-subtitle">Manage all products you have listed (dummy data)</span>
      </div>
      <div className="table-wrapper">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {farmerProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAddProduct = () => (
    <div className="dashboard-panel">
      <div className="dashboard-panel-header">
        <h3>Add Product</h3>
        <span className="dashboard-panel-subtitle">UI-only form for listing a new product</span>
      </div>
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="form-group">
          <label className="form-label" htmlFor="productName">
            Product name *
          </label>
          <input id="productName" className="form-input" placeholder="e.g. Organic Vegetable Basket" required />
        </div>
        <div className="auth-two-column-row">
          <div className="form-group">
            <label className="form-label" htmlFor="category">
              Category *
            </label>
            <select id="category" className="form-input" defaultValue="">
              <option value="" disabled>
                Select category
              </option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="livestock">Livestock</option>
              <option value="grains">Grains</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="price">
              Price (FCFA) *
            </label>
            <input id="price" type="number" className="form-input" placeholder="e.g. 15000" required />
          </div>
        </div>
        <div className="auth-two-column-row">
          <div className="form-group">
            <label className="form-label" htmlFor="quantity">
              Quantity available *
            </label>
            <input id="quantity" type="number" className="form-input" placeholder="e.g. 25" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="location">
              Harvest location
            </label>
            <input id="location" className="form-input" placeholder="e.g. Yaoundé, Centre" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="form-input"
            rows={3}
            placeholder="Short description of the product quality and packaging"
          />
        </div>
        <div className="form-footer">
          <button type="submit" className="auth-submit-btn">
            Save Product (Dummy)
          </button>
        </div>
      </form>
    </div>
  );

  const renderOrders = () => (
    <div className="dashboard-panel">
      <div className="dashboard-panel-header">
        <h3>Orders</h3>
        <span className="dashboard-panel-subtitle">Same dummy data as recent orders, extended for management</span>
      </div>
      <div className="table-wrapper">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {farmerRecentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.total}</td>
                <td>{order.status}</td>
                <td>{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="dashboard-panel">
      <div className="dashboard-panel-header">
        <h3>Payments (MTN MoMo)</h3>
        <span className="dashboard-panel-subtitle">UI for MoMo payment history using dummy data</span>
      </div>
      <div className="table-wrapper">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Phone</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Reference</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {farmerPayments.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.orderId}</td>
                <td>{p.phone}</td>
                <td>{p.amount}</td>
                <td>{p.status}</td>
                <td>{p.reference}</td>
                <td>{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="dashboard-panel">
      <div className="dashboard-panel-header">
        <h3>Earnings Overview</h3>
        <span className="dashboard-panel-subtitle">
          Total earnings and monthly trend (all dummy values, UI only)
        </span>
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-icon">
            <FaMoneyBillWave />
          </div>
          <div className="dashboard-card-label">Estimated total earnings</div>
          <div className="dashboard-card-value">6,770,000 FCFA</div>
        </div>
      </div>
      <div className="dashboard-panel" style={{ marginTop: 16 }}>
        <div className="dashboard-panel-header">
          <h3>Monthly earnings (visual)</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {farmerEarningsByMonth.map((item) => {
            const max = Math.max(...farmerEarningsByMonth.map((m) => m.amount));
            const width = `${(item.amount / max) * 100}%`;
            return (
              <div key={item.month} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 40, fontSize: 13, color: '#6b7280' }}>{item.month}</span>
                <div style={{ flex: 1, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden' }}>
                  <div
                    style={{
                      width,
                      height: 10,
                      background: '#16a34a'
                    }}
                  />
                </div>
                <span style={{ fontSize: 12, color: '#6b7280' }}>{item.amount.toLocaleString()} FCFA</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="dashboard-panel">
      <div className="dashboard-panel-header">
        <h3>Inventory</h3>
        <span className="dashboard-panel-subtitle">Stock levels with low-stock indicators (dummy data)</span>
      </div>
      <div className="table-wrapper">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity available</th>
              <th>Low stock threshold</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {farmerInventory.map((item) => {
              const isLow = item.quantity <= item.lowStockThreshold;
              const status = item.quantity === 0 ? 'Out of stock' : isLow ? 'Low stock' : 'Healthy';
              return (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.lowStockThreshold}</td>
                  <td>{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="dashboard-panel">
      <div className="dashboard-panel-header">
        <h3>Notifications</h3>
        <span className="dashboard-panel-subtitle">Order, payment and system notifications (dummy)</span>
      </div>
      <div className="dashboard-list">
        {farmerNotifications.map((n) => (
          <div key={n.id} className="dashboard-list-item">
            <div>
              <div className="dashboard-list-title">{n.message}</div>
              <div className="dashboard-list-subtitle">{n.time}</div>
            </div>
            {!n.read && <div className="dashboard-list-meta">New</div>}
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="dashboard-panel">
      <div className="dashboard-panel-header">
        <h3>Profile Settings</h3>
        <span className="dashboard-panel-subtitle">Update personal and farm information (UI only)</span>
      </div>
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="auth-two-column-row">
          <div className="form-group">
            <label className="form-label" htmlFor="farmerName">
              Full name
            </label>
            <input
              id="farmerName"
              className="form-input"
              defaultValue={farmerSummary.name}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="farmName">
              Farm name
            </label>
            <input
              id="farmName"
              className="form-input"
              defaultValue={farmerSummary.farmName}
            />
          </div>
        </div>
        <div className="auth-two-column-row">
          <div className="form-group">
            <label className="form-label" htmlFor="phoneProfile">
              Phone number
            </label>
            <input id="phoneProfile" className="form-input" placeholder="+237 6XX XXX XXX" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="locationProfile">
              Farm location
            </label>
            <input id="locationProfile" className="form-input" placeholder="City, Region" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="passwordProfile">
            New password (optional)
          </label>
          <input id="passwordProfile" type="password" className="form-input" placeholder="Enter new password" />
        </div>
        <div className="form-footer">
          <button type="submit" className="auth-submit-btn">
            Save Changes (Dummy)
          </button>
        </div>
      </form>
    </div>
  );

  const renderSupport = () => (
    <div className="dashboard-panel">
      <div className="dashboard-panel-header">
        <h3>Help &amp; Support</h3>
        <span className="dashboard-panel-subtitle">
          Submit support requests to the admin team (UI layout with dummy ticket list)
        </span>
      </div>
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="form-group">
          <label className="form-label" htmlFor="supportSubject">
            Subject
          </label>
          <input id="supportSubject" className="form-input" placeholder="Brief summary of your issue" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="supportMessage">
            Message
          </label>
          <textarea
            id="supportMessage"
            className="form-input"
            rows={3}
            placeholder="Describe your problem or question"
          />
        </div>
        <div className="form-footer">
          <button type="submit" className="auth-submit-btn">
            Send Request (Dummy)
          </button>
        </div>
      </form>

      <div className="dashboard-panel" style={{ marginTop: 16 }}>
        <div className="dashboard-panel-header">
          <h3>Previous requests</h3>
        </div>
        <div className="dashboard-list">
          {farmerSupportTickets.map((t) => (
            <div key={t.id} className="dashboard-list-item">
              <div>
                <div className="dashboard-list-title">{t.subject}</div>
                <div className="dashboard-list-subtitle">{t.date}</div>
              </div>
              <div className="dashboard-list-meta">{t.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case SECTIONS.PRODUCTS:
        return renderProducts();
      case SECTIONS.ADD_PRODUCT:
        return renderAddProduct();
      case SECTIONS.ORDERS:
        return renderOrders();
      case SECTIONS.PAYMENTS:
        return renderPayments();
      case SECTIONS.EARNINGS:
        return renderEarnings();
      case SECTIONS.INVENTORY:
        return renderInventory();
      case SECTIONS.NOTIFICATIONS:
        return renderNotifications();
      case SECTIONS.PROFILE:
        return renderProfile();
      case SECTIONS.SUPPORT:
        return renderSupport();
      case SECTIONS.DASHBOARD:
      default:
        return renderDashboardOverview();
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <Navbar />

      <section className="section" style={{ paddingTop: '120px' }}>
        <div className="section-header" style={{ textAlign: 'left', maxWidth: '1200px', margin: '0 auto 24px' }}>
          <div className="section-label">Farmer Dashboard</div>
          <h2 className="section-title" style={{ marginBottom: 8 }}>
            Welcome back, {farmerSummary.name}
          </h2>
          <p className="section-subtitle" style={{ margin: 0 }}>
            Manage your products, orders, payments, inventory and profile. All data shown is dummy data for UI and
            academic documentation.
          </p>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="farmer-layout">
          {/* Sidebar */}
          <aside className="farmer-sidebar">
            <div className="farmer-sidebar-title">Navigation</div>
            <ul className="farmer-menu">
              <li>
                <button
                  type="button"
                  className={`farmer-menu-button ${activeSection === SECTIONS.DASHBOARD ? 'active' : ''}`}
                  onClick={() => setActiveSection(SECTIONS.DASHBOARD)}
                >
                  <span className="farmer-menu-icon">
                    <FaChartLine />
                  </span>
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`farmer-menu-button ${activeSection === SECTIONS.PRODUCTS ? 'active' : ''}`}
                  onClick={() => setActiveSection(SECTIONS.PRODUCTS)}
                >
                  <span className="farmer-menu-icon">
                    <FaListUl />
                  </span>
                  My Products
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`farmer-menu-button ${activeSection === SECTIONS.ADD_PRODUCT ? 'active' : ''}`}
                  onClick={() => setActiveSection(SECTIONS.ADD_PRODUCT)}
                >
                  <span className="farmer-menu-icon">
                    <FaPlusCircle />
                  </span>
                  Add Product
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`farmer-menu-button ${activeSection === SECTIONS.ORDERS ? 'active' : ''}`}
                  onClick={() => setActiveSection(SECTIONS.ORDERS)}
                >
                  <span className="farmer-menu-icon">
                    <FaClipboardList />
                  </span>
                  Orders
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`farmer-menu-button ${activeSection === SECTIONS.PAYMENTS ? 'active' : ''}`}
                  onClick={() => setActiveSection(SECTIONS.PAYMENTS)}
                >
                  <span className="farmer-menu-icon">
                    <FaCreditCard />
                  </span>
                  Payments
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`farmer-menu-button ${activeSection === SECTIONS.EARNINGS ? 'active' : ''}`}
                  onClick={() => setActiveSection(SECTIONS.EARNINGS)}
                >
                  <span className="farmer-menu-icon">
                    <FaMoneyBillWave />
                  </span>
                  Earnings
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`farmer-menu-button ${activeSection === SECTIONS.INVENTORY ? 'active' : ''}`}
                  onClick={() => setActiveSection(SECTIONS.INVENTORY)}
                >
                  <span className="farmer-menu-icon">
                    <FaBoxOpen />
                  </span>
                  Inventory
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`farmer-menu-button ${activeSection === SECTIONS.NOTIFICATIONS ? 'active' : ''}`}
                  onClick={() => setActiveSection(SECTIONS.NOTIFICATIONS)}
                >
                  <span className="farmer-menu-icon">
                    <FaBell />
                  </span>
                  Notifications
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`farmer-menu-button ${activeSection === SECTIONS.PROFILE ? 'active' : ''}`}
                  onClick={() => setActiveSection(SECTIONS.PROFILE)}
                >
                  <span className="farmer-menu-icon">
                    <FaUserCircle />
                  </span>
                  Profile Settings
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`farmer-menu-button ${activeSection === SECTIONS.SUPPORT ? 'active' : ''}`}
                  onClick={() => setActiveSection(SECTIONS.SUPPORT)}
                >
                  <span className="farmer-menu-icon">
                    <FaQuestionCircle />
                  </span>
                  Help / Support
                </button>
              </li>
            </ul>
          </aside>

          {/* Main content */}
          <div className="farmer-main">{renderActiveSection()}</div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FarmerDashboard;

