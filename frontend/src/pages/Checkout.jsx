import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaTruck,
    FaCreditCard,
    FaCheckCircle,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaUser,
    FaArrowRight,
    FaArrowLeft,
    FaMobileAlt
} from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Input from '../components/ui/input';
import { useCart } from '../context/CartContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');

    const [deliveryInfo, setDeliveryInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        region: ''
    });

    const subtotal = getCartTotal();
    const deliveryFee = 2000;
    const total = subtotal + deliveryFee;

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleChange = (e) => {
        setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            clearCart();
            const success = Math.random() > 0.1; // 90% success chance for demo
            navigate(success ? '/payment/status?success=true' : '/payment/status?success=false');
        }, 2000);
    };

    const steps = [
        { id: 1, label: 'Delivery', icon: <FaTruck /> },
        { id: 2, label: 'Payment', icon: <FaCreditCard /> },
        { id: 3, label: 'Review', icon: <FaCheckCircle /> }
    ];

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen bg-[var(--bg-secondary)]">
            <Navbar />

            <div className="pt-24 pb-12 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Progress Steps */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[var(--border-color)] -z-10" />
                            <div
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--primary-500)] transition-all duration-500 -z-10"
                                style={{ width: `${((step - 1) / 2) * 100}%` }}
                            />
                            {steps.map((s) => (
                                <div key={s.id} className="flex flex-col items-center gap-2 bg-[var(--bg-secondary)] px-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${step >= s.id
                                        ? 'bg-[var(--primary-500)] text-white shadow-lg scale-110'
                                        : 'bg-[var(--neutral-200)] text-[var(--text-tertiary)]'
                                        }`}>
                                        {s.icon}
                                    </div>
                                    <span className={`text-sm font-bold ${step >= s.id ? 'text-[var(--primary-600)]' : 'text-[var(--text-tertiary)]'
                                        }`}>
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Form Area */}
                        <div className="lg:col-span-2">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--border-light)]"
                                    >
                                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-[var(--primary-500)]" />
                                            Delivery Information
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <Input
                                                label="Full Name"
                                                name="fullName"
                                                value={deliveryInfo.fullName}
                                                onChange={handleChange}
                                                icon={<FaUser size={14} />}
                                                placeholder="John Doe"
                                            />
                                            <Input
                                                label="Phone Number"
                                                name="phone"
                                                value={deliveryInfo.phone}
                                                onChange={handleChange}
                                                icon={<FaPhoneAlt size={14} />}
                                                placeholder="+237 6XX..."
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <Input
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                value={deliveryInfo.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <Input
                                                label="Street Address"
                                                name="address"
                                                value={deliveryInfo.address}
                                                onChange={handleChange}
                                                icon={<FaMapMarkerAlt size={14} />}
                                                placeholder="House number, Street name"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                label="City"
                                                name="city"
                                                value={deliveryInfo.city}
                                                onChange={handleChange}
                                                placeholder="e.g. Douala"
                                            />
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-medium text-[var(--text-secondary)]">Region</label>
                                                <select
                                                    name="region"
                                                    value={deliveryInfo.region}
                                                    onChange={handleChange}
                                                    className="px-4 py-3 rounded-xl border border-[var(--border-color)] focus:border-[var(--primary-500)] outline-none bg-white"
                                                >
                                                    <option value="">Select Region</option>
                                                    <option value="Centre">Centre</option>
                                                    <option value="Littoral">Littoral</option>
                                                    <option value="Ouest">Ouest</option>
                                                    <option value="Nord">Nord</option>
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--border-light)]"
                                    >
                                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                            <FaCreditCard className="text-[var(--primary-500)]" />
                                            Payment Method
                                        </h2>

                                        <div className="space-y-4">
                                            {['mtn', 'orange', 'cash'].map((method) => (
                                                <div
                                                    key={method}
                                                    onClick={() => setPaymentMethod(method)}
                                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method
                                                        ? 'border-[var(--primary-500)] bg-[var(--primary-50)]'
                                                        : 'border-[var(--border-color)] hover:border-[var(--primary-200)]'
                                                        }`}
                                                >
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method === 'mtn' ? 'bg-yellow-400' :
                                                        method === 'orange' ? 'bg-orange-500' : 'bg-green-500'
                                                        } text-white`}>
                                                        {method === 'cash' ? <FaCheckCircle size={20} /> : <FaMobileAlt size={24} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-[var(--text-primary)]">
                                                            {method === 'mtn' ? 'MTN Mobile Money' :
                                                                method === 'orange' ? 'Orange Money' : 'Cash on Delivery'}
                                                        </h3>
                                                        <p className="text-sm text-[var(--text-secondary)]">
                                                            {method === 'cash' ? 'Pay when you receive your order' : 'Secure payment via mobile money'}
                                                        </p>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === method
                                                        ? 'border-[var(--primary-500)] bg-[var(--primary-500)]'
                                                        : 'border-[var(--border-color)]'
                                                        }`}>
                                                        {paymentMethod === method && <FaCheckCircle className="text-white" size={12} />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {(paymentMethod === 'mtn' || paymentMethod === 'orange') && (
                                            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-sm text-yellow-800">
                                                Please ensure your phone ({deliveryInfo.phone}) is close by to approve the transaction.
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--border-light)]"
                                    >
                                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                            <FaCheckCircle className="text-[var(--primary-500)]" />
                                            Review Order
                                        </h2>

                                        <div className="space-y-6">
                                            <div className="bg-[var(--bg-secondary)] p-4 rounded-xl">
                                                <h3 className="font-bold text-[var(--text-primary)] mb-2">Delivery Details</h3>
                                                <p className="text-sm text-[var(--text-secondary)]">{deliveryInfo.fullName}</p>
                                                <p className="text-sm text-[var(--text-secondary)]">{deliveryInfo.address}, {deliveryInfo.city}</p>
                                                <p className="text-sm text-[var(--text-secondary)]">{deliveryInfo.phone}</p>
                                            </div>

                                            <div className="bg-[var(--bg-secondary)] p-4 rounded-xl">
                                                <h3 className="font-bold text-[var(--text-primary)] mb-2">Payment</h3>
                                                <p className="text-sm text-[var(--text-secondary)] capitalized">
                                                    {paymentMethod === 'mtn' ? 'MTN Mobile Money' :
                                                        paymentMethod === 'orange' ? 'Orange Money' : 'Cash on Delivery'}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-[var(--text-primary)] mb-3">Items</h3>
                                                <div className="space-y-3">
                                                    {cartItems.map((item) => (
                                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                                            <span className="text-[var(--text-secondary)]">
                                                                {item.quantity}x {item.name}
                                                            </span>
                                                            <span className="font-medium text-[var(--text-primary)]">
                                                                {(item.price * item.quantity).toLocaleString()} FCFA
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex justify-between mt-8">
                                {step > 1 ? (
                                    <button
                                        onClick={handleBack}
                                        className="px-6 py-3 rounded-xl border border-[var(--border-color)] font-bold text-[var(--text-secondary)] hover:bg-white transition-colors flex items-center gap-2"
                                    >
                                        <FaArrowLeft /> Back
                                    </button>
                                ) : <div />}

                                {step < 3 ? (
                                    <button
                                        onClick={handleNext}
                                        className="px-8 py-3 bg-[var(--primary-500)] text-white font-bold rounded-xl hover:bg-[var(--primary-600)] transition-all shadow-lg hover:shadow-[var(--primary-500)]/30 flex items-center gap-2"
                                    >
                                        Continue <FaArrowRight />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="px-8 py-3 bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Processing...' : 'Place Order'} <FaCheckCircle />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--border-light)] sticky top-24">
                                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Order Summary</h3>
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-[var(--text-secondary)]">
                                        <span>Subtotal</span>
                                        <span>{subtotal.toLocaleString()} FCFA</span>
                                    </div>
                                    <div className="flex justify-between text-[var(--text-secondary)]">
                                        <span>Delivery Fee</span>
                                        <span>{deliveryFee.toLocaleString()} FCFA</span>
                                    </div>
                                    <div className="pt-4 border-t border-[var(--border-light)] flex justify-between font-bold text-lg">
                                        <span className="text-[var(--text-primary)]">Total</span>
                                        <span className="text-[var(--primary-600)]">{total.toLocaleString()} FCFA</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] bg-[var(--bg-secondary)] p-3 rounded-lg">
                                    <FaCheckCircle className="text-green-500" />
                                    Secure checkout guaranteed
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Checkout;
