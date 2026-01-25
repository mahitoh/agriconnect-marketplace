import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaHome, FaShoppingBag, FaFileDownload } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const isSuccess = searchParams.get('success') === 'true';
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        // Generate random order ID
        setOrderId(`ORD-${Math.floor(Math.random() * 1000000)}`);
    }, []);

    return (
        <div className="min-h-screen bg-[var(--bg-secondary)]">
            <Navbar />

            <div className="pt-32 pb-20 px-6">
                <div className="max-w-md mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-8 rounded-3xl shadow-lg border border-[var(--border-light)] text-center relative overflow-hidden"
                    >
                        {/* Background decoration */}
                        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${isSuccess ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'
                            }`} />

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                            className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${isSuccess ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
                                }`}
                        >
                            {isSuccess ? <FaCheckCircle size={48} /> : <FaTimesCircle size={48} />}
                        </motion.div>

                        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
                        </h1>

                        <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                            {isSuccess
                                ? `Thank you for your purchase. Your order #${orderId} has been confirmed and will be shipped shortly.`
                                : 'Something went wrong with your transaction. Please try again or contact support if the issue persists.'
                            }
                        </p>

                        {isSuccess && (
                            <div className="bg-[var(--bg-secondary)] p-4 rounded-xl mb-8 border border-[var(--border-light)] text-left">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-[var(--text-secondary)]">Amount Paid:</span>
                                    <span className="font-bold text-[var(--text-primary)]">42,500 FCFA</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-[var(--text-secondary)]">Payment Method:</span>
                                    <span className="font-medium text-[var(--text-primary)]">MTN Mobile Money</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-[var(--text-secondary)]">Date:</span>
                                    <span className="font-medium text-[var(--text-primary)]">{new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            {isSuccess ? (
                                <>
                                    <button className="w-full py-3 bg-[var(--primary-500)] text-white font-bold rounded-xl hover:bg-[var(--primary-600)] transition-all shadow-lg hover:shadow-[var(--primary-500)]/30 flex items-center justify-center gap-2">
                                        <FaFileDownload /> Download Receipt
                                    </button>
                                    <Link
                                        to="/marketplace"
                                        className="w-full py-3 bg-white border border-[var(--border-color)] text-[var(--text-secondary)] font-bold rounded-xl hover:bg-[var(--bg-secondary)] transition-all flex items-center justify-center gap-2"
                                    >
                                        <FaShoppingBag /> Continue Shopping
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    to="/checkout"
                                    className="w-full py-3 bg-[var(--primary-500)] text-white font-bold rounded-xl hover:bg-[var(--primary-600)] transition-all shadow-lg hover:shadow-[var(--primary-500)]/30 flex items-center justify-center gap-2"
                                >
                                    Try Again
                                </Link>
                            )}

                            <Link
                                to="/"
                                className="w-full py-3 text-[var(--text-tertiary)] font-medium hover:text-[var(--primary-600)] transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <FaHome /> Back to Home
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PaymentStatus;
