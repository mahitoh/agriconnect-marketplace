import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaMinus, FaPlus, FaArrowRight, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const deliveryFee = cartItems.length > 0 ? 2000 : 0;
  const total = subtotal + deliveryFee;

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
              {cartItems.length} items
            </span>
          </h1>

          {cartItems.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items List */}
              <div className="flex-1 space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-[var(--border-light)] flex gap-6 items-center group hover:border-[var(--primary-200)] transition-colors"
                    >
                      <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--bg-secondary)]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-[var(--text-primary)] text-lg mb-1 truncate">{item.name}</h3>
                            <p className="text-sm text-[var(--text-secondary)]">Sold by {item.farmer}</p>
                          </div>
                          <span className="font-bold text-[var(--primary-600)] text-lg">
                            {(item.price * item.quantity).toLocaleString()} FCFA
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-4 bg-[var(--bg-secondary)] rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-[var(--text-secondary)] hover:text-[var(--primary-600)] disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus size={10} />
                            </button>
                            <span className="font-bold text-[var(--text-primary)] w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-[var(--text-secondary)] hover:text-[var(--primary-600)]"
                            >
                              <FaPlus size={10} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                          >
                            <FaTrash size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 text-[var(--primary-600)] font-bold hover:gap-3 transition-all mt-6"
                >
                  <FaArrowLeft /> Continue Shopping
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:w-96">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--border-light)] sticky top-24">
                  <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>Subtotal</span>
                      <span className="font-medium text-[var(--text-primary)]">{subtotal.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>Delivery Fee</span>
                      <span className="font-medium text-[var(--text-primary)]">{deliveryFee.toLocaleString()} FCFA</span>
                    </div>
                    <div className="pt-4 border-t border-[var(--border-light)] flex justify-between items-center text-lg font-bold">
                      <span className="text-[var(--text-primary)]">Total</span>
                      <span className="text-[var(--primary-600)]">{total.toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code"
                        className="flex-1 px-4 py-2 rounded-xl border border-[var(--border-color)] focus:border-[var(--primary-500)] outline-none"
                      />
                      <button className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold rounded-xl hover:bg-[var(--neutral-200)] transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full py-4 bg-[var(--primary-500)] text-white font-bold rounded-xl hover:bg-[var(--primary-600)] transition-all shadow-lg hover:shadow-[var(--primary-500)]/30 flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <FaArrowRight />
                  </button>

                  <p className="text-xs text-[var(--text-tertiary)] text-center mt-4">
                    Secure checkout powered by MTN Mobile Money & Orange Money
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
