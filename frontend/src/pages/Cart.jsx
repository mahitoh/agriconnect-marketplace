import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaMinus, FaPlus, FaArrowRight, FaShoppingBag, FaArrowLeft, FaStore } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getItemsByFarmer, getDeliveryFee, getGrandTotal } = useCart();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const deliveryFee = getDeliveryFee();
  const total = getGrandTotal();
  const farmerGroups = getItemsByFarmer();

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <Navbar />

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)]">
              <FaShoppingBag size={20} />
            </span>
            Shopping Cart
            <span className="text-sm font-medium text-[var(--text-tertiary)] bg-white px-3 py-1 rounded-full border border-[var(--border-light)]">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
            </span>
          </h1>

          {cartItems.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items — Grouped by Farmer */}
              <div className="flex-1 space-y-6">
                {farmerGroups.map((group) => (
                  <div key={group.farmerId} className="bg-white rounded-2xl shadow-sm border border-[var(--border-light)] overflow-hidden">
                    {/* Farmer header */}
                    <div className="px-5 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border-light)] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <FaStore className="text-[var(--primary-500)]" />
                        <span className="font-semibold text-[var(--text-primary)]">{group.farmerName}</span>
                        <span className="text-xs text-[var(--text-tertiary)]">({group.items.length} item{group.items.length !== 1 ? 's' : ''})</span>
                      </div>
                      <span className="text-sm font-bold text-[var(--primary-600)]">
                        {group.subtotal.toLocaleString()} XAF
                      </span>
                    </div>

                    {/* Items */}
                    <AnimatePresence>
                      {group.items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="p-4 flex gap-5 items-center border-b border-[var(--border-light)] last:border-b-0 group hover:bg-[var(--bg-secondary)]/40 transition-colors"
                        >
                          <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--bg-secondary)]">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-bold text-[var(--text-primary)] truncate">{item.name}</h3>
                                <p className="text-sm text-[var(--text-tertiary)]">{Number(item.price).toLocaleString()} XAF / unit</p>
                              </div>
                              <span className="font-bold text-[var(--primary-600)] whitespace-nowrap">
                                {(item.price * item.quantity).toLocaleString()} XAF
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-3 bg-[var(--bg-secondary)] rounded-lg p-1">
                                <button onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1} className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-[var(--text-secondary)] hover:text-[var(--primary-600)] disabled:opacity-40">
                                  <FaMinus size={10} />
                                </button>
                                <span className="font-bold text-[var(--text-primary)] w-6 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-[var(--text-secondary)] hover:text-[var(--primary-600)]">
                                  <FaPlus size={10} />
                                </button>
                              </div>
                              <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium">
                                <FaTrash size={13} /> Remove
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ))}

                <Link to="/marketplace" className="inline-flex items-center gap-2 text-[var(--primary-600)] font-bold hover:gap-3 transition-all mt-4">
                  <FaArrowLeft /> Continue Shopping
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:w-96">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--border-light)] sticky top-24">
                  <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-4">
                    {farmerGroups.map((g) => (
                      <div key={g.farmerId} className="flex justify-between text-sm text-[var(--text-secondary)]">
                        <span className="truncate mr-2">{g.farmerName}</span>
                        <span className="font-medium text-[var(--text-primary)] whitespace-nowrap">{g.subtotal.toLocaleString()} XAF</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[var(--border-light)] mb-6">
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>Subtotal</span>
                      <span className="font-medium text-[var(--text-primary)]">{subtotal.toLocaleString()} XAF</span>
                    </div>
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>Delivery Fee</span>
                      <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : 'text-[var(--text-primary)]'}`}>
                        {deliveryFee === 0 ? 'FREE' : `${deliveryFee.toLocaleString()} XAF`}
                      </span>
                    </div>
                    {deliveryFee > 0 && (
                      <p className="text-xs text-green-600">Free delivery on orders above 50,000 XAF</p>
                    )}
                    <div className="pt-3 border-t border-[var(--border-light)] flex justify-between items-center text-lg font-bold">
                      <span className="text-[var(--text-primary)]">Total</span>
                      <span className="text-[var(--primary-600)]">{total.toLocaleString()} XAF</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full py-4 bg-[var(--primary-500)] text-white font-bold rounded-xl hover:bg-[var(--primary-600)] transition-all shadow-lg hover:shadow-[var(--primary-500)]/30 flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <FaArrowRight />
                  </button>

                  <p className="text-xs text-[var(--text-tertiary)] text-center mt-4">
                    Secure checkout powered by MTN Mobile Money
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-3xl shadow-sm border border-[var(--border-light)]"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center text-[var(--text-tertiary)]">
                <FaShoppingBag size={40} />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Your cart is empty</h2>
              <p className="text-[var(--text-secondary)] mb-8">Looks like you haven't added any fresh products yet.</p>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--primary-500)] text-white font-bold rounded-xl hover:bg-[var(--primary-600)] transition-all shadow-lg hover:shadow-[var(--primary-500)]/30"
              >
                Browse Marketplace <FaArrowRight />
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
