import React, { useState, useRef, useCallback, useEffect } from 'react';
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
    FaMobileAlt,
    FaLock,
    FaSpinner,
    FaTimesCircle,
    FaShoppingBag,
    FaBox,
    FaStore,
    FaExclamationTriangle
} from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Input from '../components/ui/input';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import { authFetch } from '../utils/authFetch';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, getDeliveryFee, getGrandTotal, getItemsByFarmer, clearCart } = useCart();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [error, setError] = useState('');
    const [orderConfirmation, setOrderConfirmation] = useState(null);
    const [orderComplete, setOrderComplete] = useState(false);

    // Backend-validated data
    const [validatedData, setValidatedData] = useState(null);

    // Order IDs created during checkout (before payment)
    const [pendingOrderIds, setPendingOrderIds] = useState([]);
    const [pendingTotal, setPendingTotal] = useState(0);

    // MTN payment states
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [paymentRef, setPaymentRef] = useState(null);
    const pollRef = useRef(null);

    const [deliveryInfo, setDeliveryInfo] = useState({
        fullName: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: '',
        city: '',
        region: ''
    });

    const subtotal = getCartTotal();
    const deliveryFee = getDeliveryFee();
    const total = getGrandTotal();
    const farmerGroups = getItemsByFarmer();

    // ── Persist checkout session in sessionStorage ──────────
    // So if user refreshes mid-payment, we can resume polling
    const CHECKOUT_SESSION_KEY = 'checkout_session';

    const saveCheckoutSession = (data) => {
        sessionStorage.setItem(CHECKOUT_SESSION_KEY, JSON.stringify(data));
    };

    const loadCheckoutSession = () => {
        try {
            const raw = sessionStorage.getItem(CHECKOUT_SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    };

    const clearCheckoutSession = () => {
        sessionStorage.removeItem(CHECKOUT_SESSION_KEY);
    };

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, []);

    // ── Step validation ──────────────────────────────────────
    const handleNext = () => {
        if (step === 1) {
            if (!deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.address || !deliveryInfo.city) {
                setError('Please fill in all required delivery fields');
                return;
            }
            setError('');
        }
        if (step === 2) {
            if (!paymentMethod) {
                setError('Please select a payment method');
                return;
            }
            setError('');
        }
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        if (orderComplete || paymentStatus === 'SUCCESSFUL') return;
        setError('');
        if (step === 3 && pollRef.current) {
            clearInterval(pollRef.current);
            setPaymentStatus(null);
            setPaymentRef(null);
        }
        if (step > 1) setStep(step - 1);
    };

    const handleChange = (e) => {
        setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });
    };

    // ── Validate cart on backend ─────────────────────────────
    const validateCartOnBackend = async () => {
        const res = await authFetch(API_ENDPOINTS.VALIDATE_CART, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
            throw new Error(data.message || 'Cart validation failed');
        }
        return data.data;
    };

    // ── Create checkout orders (PENDING_PAYMENT) ────────────
    const createCheckoutOrders = async () => {
        const res = await authFetch(API_ENDPOINTS.CHECKOUT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                })),
                deliveryName: deliveryInfo.fullName,
                deliveryPhone: deliveryInfo.phone,
                deliveryAddress: deliveryInfo.address,
                deliveryCity: deliveryInfo.city,
                deliveryRegion: deliveryInfo.region,
                deliveryNotes: '',
                paymentMethod: paymentMethod === 'mtn' ? 'MTN_MOMO' : 'CASH_ON_DELIVERY'
            })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
            throw new Error(data.message || 'Failed to create orders');
        }
        return data.data;
    };

    // ── Confirm payment on backend (reduces stock) ──────────
    const confirmPaymentOnBackend = async (orderIds, referenceId) => {
        const res = await authFetch(API_ENDPOINTS.CONFIRM_PAYMENT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderIds,
                paymentReference: referenceId,
                paymentMethod: 'MTN_MOMO'
            })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
            throw new Error(data.message || 'Payment confirmation failed');
        }
        return data.data;
    };

    // ── Poll MTN payment status ─────────────────────────────
    const startPolling = useCallback((refId, orderIds) => {
        let attempts = 0;
        const maxAttempts = 30;

        console.log(`🔄 Starting payment polling for ref ${refId}, max attempts: ${maxAttempts}`);

        pollRef.current = setInterval(async () => {
            attempts++;
            try {
                console.log(`⏳ Poll attempt ${attempts}/${maxAttempts} for ${refId}`);
                const res = await authFetch(API_ENDPOINTS.PAYMENT_STATUS(refId));
                
                if (!res.ok) {
                    console.error(`❌ Poll response not ok:`, res.status, res.statusText);
                    const errData = await res.json();
                    console.error('Error response:', errData);
                    setError(`Payment status check failed: ${errData.message || 'Unknown error'}`);
                    if (attempts >= maxAttempts) {
                        clearInterval(pollRef.current);
                        setPaymentStatus('FAILED');
                        setLoading(false);
                    }
                    return;
                }

                const data = await res.json();
                console.log(`📊 Poll response:`, data);

                if (data.paymentStatus === 'SUCCESSFUL') {
                    console.log(`✅ Payment SUCCESSFUL!`);
                    clearInterval(pollRef.current);
                    setPaymentStatus('SUCCESSFUL');

                    // Confirm payment on backend → reduces stock, updates orders to PAID
                    try {
                        await confirmPaymentOnBackend(orderIds, refId);
                        setOrderConfirmation({
                            orderIds,
                            paymentReference: refId,
                            paymentMethod: 'MTN Mobile Money',
                            total: pendingTotal,
                            timestamp: new Date()
                        });
                        setOrderComplete(true);
                        clearCart();
                        clearCheckoutSession();
                        setTimeout(() => setStep(4), 1500);
                    } catch (err) {
                        console.error('❌ Confirmation error:', err);
                        setError(err.message);
                    }
                    setLoading(false);
                } else if (['FAILED', 'REJECTED', 'TIMEOUT'].includes(data.paymentStatus)) {
                    console.log(`❌ Payment ${data.paymentStatus}`);
                    clearInterval(pollRef.current);
                    setPaymentStatus('FAILED');
                    setLoading(false);
                    setError(`Payment ${data.paymentStatus.toLowerCase()}. Please try again.`);
                } else {
                    console.log(`⏳ Still PENDING... (attempt ${attempts}/${maxAttempts})`);
                }
            } catch (err) {
                console.error('❌ Poll error:', err);
                setError(`Payment check error: ${err.message}`);
            }

            if (attempts >= maxAttempts) {
                console.log(`⏸️ Max polling attempts reached`);
                clearInterval(pollRef.current);
                setPaymentStatus('FAILED');
                setLoading(false);
                setError('Payment timed out. Please try again.');
            }
        }, 3000);
    }, [pendingTotal]);
    // ── On mount: restore checkout session if payment was in progress ──
    useEffect(() => {
        const session = loadCheckoutSession();
        if (session && session.paymentRef && session.orderIds?.length > 0) {
            // Resume: we had a payment in progress
            setPendingOrderIds(session.orderIds);
            setPendingTotal(session.totalAmount);
            setPaymentRef(session.paymentRef);
            setPaymentMethod(session.paymentMethod || 'mtn');
            setDeliveryInfo(session.deliveryInfo || deliveryInfo);
            setStep(3);
            setPaymentStatus('PENDING');
            setLoading(true);
            // Resume polling
            startPolling(session.paymentRef, session.orderIds);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // ─── MTN MoMo Payment Flow ────────────────────────────
    // 1. Validate cart → 2. Create PENDING_PAYMENT orders → 3. Initiate MTN → 4. Poll → 5. Confirm
    const handleMTNPayment = async () => {
        setLoading(true);
        setError('');
        setPaymentStatus('PENDING');

        try {
            console.log('🔄 Step 1: Creating PENDING_PAYMENT orders...');
            // Step 1: Create orders on backend (PENDING_PAYMENT, no stock reduced)
            const checkoutData = await createCheckoutOrders();
            const orderIds = checkoutData.orderIds;
            const totalAmount = checkoutData.totalAmount;
            setPendingOrderIds(orderIds);
            setPendingTotal(totalAmount);
            console.log(`✅ Orders created:`, orderIds, `Total: ${totalAmount}`);

            // Step 2: Initiate MTN payment
            console.log('🔄 Step 2: Initiating MTN payment...');
            const isSandbox = true;
            let phoneNumber = deliveryInfo.phone.replace(/[\s\-()+ ]/g, '');
            if (isSandbox) {
                phoneNumber = '46733123453';
            } else {
                if (phoneNumber.startsWith('0')) phoneNumber = '237' + phoneNumber.substring(1);
                if (!phoneNumber.startsWith('237')) phoneNumber = '237' + phoneNumber;
            }

            console.log(`📞 Phone: ${phoneNumber}, Amount: ${totalAmount}`);

            const res = await authFetch(API_ENDPOINTS.PAYMENT_INITIATE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumber,
                    amount: parseFloat(totalAmount),
                    orderIds
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                console.error('❌ Payment initiation failed:', res.status, errData);
                throw new Error(errData.message || 'Payment initiation failed');
            }

            const data = await res.json();
            console.log(`✅ MTN payment initiated, ref: ${data.referenceId}`);
            setPaymentRef(data.referenceId);

            // Save session so refresh can resume polling
            saveCheckoutSession({
                orderIds,
                totalAmount,
                paymentRef: data.referenceId,
                paymentMethod: 'mtn',
                deliveryInfo
            });

            console.log(`🔄 Step 3: Starting payment status polling...`);
            startPolling(data.referenceId, orderIds);
        } catch (err) {
            console.error('❌ Payment error:', err);
            setError(err.message || 'Payment failed');
            setPaymentStatus(null);
            setLoading(false);
        }
    };

    // ── Cash on Delivery Flow ───────────────────────────────
    const handleCashOnDelivery = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await authFetch(API_ENDPOINTS.CONFIRM_COD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        productId: item.id,
                        quantity: item.quantity
                    })),
                    deliveryName: deliveryInfo.fullName,
                    deliveryPhone: deliveryInfo.phone,
                    deliveryAddress: deliveryInfo.address,
                    deliveryCity: deliveryInfo.city,
                    deliveryRegion: deliveryInfo.region,
                    deliveryNotes: ''
                })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Failed to place order');
            }
            setOrderConfirmation({
                orderIds: data.data.orderIds,
                paymentReference: null,
                paymentMethod: 'Cash on Delivery',
                total: data.data.totalAmount,
                timestamp: new Date()
            });
            setOrderComplete(true);
            clearCart();
            clearCheckoutSession();
            setStep(4);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Retry payment
    const handleRetryPayment = () => {
        if (pollRef.current) clearInterval(pollRef.current);
        setPaymentRef(null);
        setPaymentStatus(null);
        setPendingOrderIds([]);
        setPendingTotal(0);
        setError('');
        setLoading(false);
        clearCheckoutSession();
    };

    const steps = [
        { id: 1, label: 'Delivery', icon: <FaTruck /> },
        { id: 2, label: 'Payment', icon: <FaCreditCard /> },
        { id: 3, label: 'Review', icon: <FaBox /> },
        { id: 4, label: 'Confirm', icon: <FaCheckCircle /> }
    ];

    if (cartItems.length === 0 && step < 4 && !orderComplete) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen bg-[var(--bg-secondary)]">
            <Navbar />

            <div className="pt-24 pb-12 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Progress Steps with green connecting line */}
                    {step < 4 && (
                        <div className="max-w-3xl mx-auto mb-12">
                            <div className="flex items-center justify-between relative">
                                {/* Background track */}
                                <div className="absolute left-[12%] right-[12%] top-5 h-1 bg-gray-200 rounded-full" />
                                {/* Green progress fill */}
                                <div
                                    className="absolute left-[12%] top-5 h-1 bg-green-500 rounded-full transition-all duration-700 ease-in-out"
                                    style={{ width: `${((Math.min(step, 3) - 1) / 2) * 76}%` }}
                                />
                                {steps.slice(0, 3).map((s) => (
                                    <div key={s.id} className="flex flex-col items-center gap-2 relative z-10">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                                            step > s.id
                                                ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                                                : step === s.id
                                                    ? 'bg-[var(--primary-500)] text-white shadow-lg shadow-[var(--primary-200)] scale-110 ring-4 ring-[var(--primary-100)]'
                                                    : 'bg-white text-gray-400 border-2 border-gray-200'
                                        }`}>
                                            {step > s.id ? <FaCheckCircle size={16} /> : s.icon}
                                        </div>
                                        <span className={`text-xs font-semibold tracking-wide ${
                                            step > s.id
                                                ? 'text-green-600'
                                                : step === s.id
                                                    ? 'text-[var(--primary-600)]'
                                                    : 'text-gray-400'
                                        }`}>
                                            {s.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={`grid gap-8 ${step === 4 ? 'max-w-2xl mx-auto' : 'grid-cols-1 lg:grid-cols-3'}`}>
                        {/* Main Form Area */}
                        <div className={step === 4 ? '' : 'lg:col-span-2'}>
                            <AnimatePresence mode="wait">
                                {/* Step 1: Delivery */}
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[var(--border-light)]"
                                    >
                                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-[var(--primary-500)]" />
                                            Delivery Information
                                        </h2>

                                        {error && (
                                            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                                                <FaTimesCircle /> {error}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                            <Input
                                                label="Full Name *"
                                                name="fullName"
                                                value={deliveryInfo.fullName}
                                                onChange={handleChange}
                                                icon={<FaUser size={14} />}
                                                placeholder="John Doe"
                                            />
                                            <Input
                                                label="Phone Number *"
                                                name="phone"
                                                value={deliveryInfo.phone}
                                                onChange={handleChange}
                                                icon={<FaPhoneAlt size={14} />}
                                                placeholder="+237 6XX XXX XXX"
                                            />
                                        </div>

                                        <div className="mb-5">
                                            <Input
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                value={deliveryInfo.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div className="mb-5">
                                            <Input
                                                label="Street Address *"
                                                name="address"
                                                value={deliveryInfo.address}
                                                onChange={handleChange}
                                                icon={<FaMapMarkerAlt size={14} />}
                                                placeholder="House number, Street name"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <Input
                                                label="City *"
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
                                                    className="px-4 py-3 rounded-xl border border-[var(--border-color)] focus:border-[var(--primary-500)] outline-none bg-white transition"
                                                >
                                                    <option value="">Select Region</option>
                                                    <option value="Centre">Centre</option>
                                                    <option value="Littoral">Littoral</option>
                                                    <option value="Ouest">Ouest</option>
                                                    <option value="Nord">Nord</option>
                                                    <option value="Sud-Ouest">Sud-Ouest</option>
                                                    <option value="Nord-Ouest">Nord-Ouest</option>
                                                    <option value="Est">Est</option>
                                                    <option value="Adamaoua">Adamaoua</option>
                                                    <option value="Sud">Sud</option>
                                                    <option value="Extreme-Nord">Extrême-Nord</option>
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Payment Method */}
                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[var(--border-light)]"
                                    >
                                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                            <FaCreditCard className="text-[var(--primary-500)]" />
                                            Payment Method
                                        </h2>

                                        {error && (
                                            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                                                <FaTimesCircle /> {error}
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            {[
                                                {
                                                    id: 'mtn',
                                                    name: 'MTN Mobile Money',
                                                    desc: 'Pay instantly via MTN MoMo',
                                                    color: 'bg-yellow-400',
                                                    icon: <FaMobileAlt size={22} />
                                                },
                                                {
                                                    id: 'orange',
                                                    name: 'Orange Money',
                                                    desc: 'Coming soon',
                                                    color: 'bg-orange-500',
                                                    icon: <FaMobileAlt size={22} />,
                                                    disabled: true
                                                },
                                                {
                                                    id: 'cash',
                                                    name: 'Cash on Delivery',
                                                    desc: 'Pay when you receive your order',
                                                    color: 'bg-green-500',
                                                    icon: <FaCheckCircle size={20} />
                                                }
                                            ].map((method) => (
                                                <div
                                                    key={method.id}
                                                    onClick={() => !method.disabled && setPaymentMethod(method.id)}
                                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                                                        method.disabled
                                                            ? 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                                                            : paymentMethod === method.id
                                                                ? 'border-[var(--primary-500)] bg-[var(--primary-50)] shadow-sm'
                                                                : 'border-[var(--border-color)] hover:border-[var(--primary-200)] cursor-pointer'
                                                    }`}
                                                >
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.color} text-white flex-shrink-0`}>
                                                        {method.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-[var(--text-primary)]">{method.name}</h3>
                                                        <p className="text-sm text-[var(--text-secondary)]">{method.desc}</p>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                                        paymentMethod === method.id
                                                            ? 'border-[var(--primary-500)] bg-[var(--primary-500)]'
                                                            : 'border-gray-300'
                                                    }`}>
                                                        {paymentMethod === method.id && (
                                                            <div className="w-2 h-2 rounded-full bg-white" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {paymentMethod === 'mtn' && (
                                            <div className="mt-5 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                                <p className="text-sm text-yellow-800 flex items-center gap-2">
                                                    <FaMobileAlt className="text-yellow-600 flex-shrink-0" />
                                                    A payment request will be sent to <strong>{deliveryInfo.phone}</strong>. Keep your phone nearby.
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Step 3: Review & Pay */}
                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[var(--border-light)]"
                                    >
                                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                            <FaBox className="text-[var(--primary-500)]" />
                                            Review & Place Order
                                        </h2>

                                        {/* Delivery summary */}
                                        <div className="bg-[var(--bg-secondary)] p-4 rounded-xl mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold text-[var(--text-primary)] text-sm flex items-center gap-2">
                                                    <FaTruck className="text-green-500" /> Delivery
                                                </h3>
                                                <button onClick={() => setStep(1)} className="text-xs text-[var(--primary-500)] hover:underline font-medium">
                                                    Change
                                                </button>
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)]">{deliveryInfo.fullName}</p>
                                            <p className="text-sm text-[var(--text-secondary)]">{deliveryInfo.address}, {deliveryInfo.city}</p>
                                            <p className="text-sm text-[var(--text-secondary)]">{deliveryInfo.phone}</p>
                                        </div>

                                        {/* Payment method summary */}
                                        <div className="bg-[var(--bg-secondary)] p-4 rounded-xl mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold text-[var(--text-primary)] text-sm flex items-center gap-2">
                                                    <FaCreditCard className="text-blue-500" /> Payment
                                                </h3>
                                                <button onClick={() => { setStep(2); handleRetryPayment(); }} className="text-xs text-[var(--primary-500)] hover:underline font-medium">
                                                    Change
                                                </button>
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)]">
                                                {paymentMethod === 'mtn' ? 'MTN Mobile Money' :
                                                    paymentMethod === 'orange' ? 'Orange Money' : 'Cash on Delivery'}
                                            </p>
                                        </div>

                                        {/* Items grouped by farmer */}
                                        <div className="bg-[var(--bg-secondary)] p-4 rounded-xl mb-6">
                                            <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-3 flex items-center gap-2">
                                                <FaShoppingBag className="text-purple-500" /> Items ({cartItems.length})
                                            </h3>
                                            {farmerGroups.map((group) => (
                                                <div key={group.farmerId} className="mb-3 last:mb-0">
                                                    <div className="flex items-center gap-2 mb-2 text-xs text-[var(--text-tertiary)]">
                                                        <FaStore className="text-[var(--primary-400)]" />
                                                        <span className="font-semibold text-[var(--text-secondary)]">{group.farmerName}</span>
                                                    </div>
                                                    <div className="space-y-2 ml-4">
                                                        {group.items.map((item) => (
                                                            <div key={item.id} className="flex justify-between items-center text-sm py-1">
                                                                <div className="flex items-center gap-3">
                                                                    {item.image && (
                                                                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                                                                    )}
                                                                    <div>
                                                                        <span className="text-[var(--text-primary)] font-medium">{item.name}</span>
                                                                        <span className="text-[var(--text-tertiary)] ml-1">x {item.quantity}</span>
                                                                    </div>
                                                                </div>
                                                                <span className="font-semibold text-[var(--text-primary)]">
                                                                    {(item.price * item.quantity).toLocaleString()} XAF
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="mt-3 pt-3 border-t border-[var(--border-light)] space-y-1">
                                                <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                                                    <span>Subtotal</span>
                                                    <span>{subtotal.toLocaleString()} XAF</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                                                    <span>Delivery</span>
                                                    <span>{deliveryFee === 0 ? <span className="text-green-600 font-medium">Free</span> : `${deliveryFee.toLocaleString()} XAF`}</span>
                                                </div>
                                                <div className="flex justify-between font-bold text-base pt-2 border-t border-[var(--border-light)]">
                                                    <span>Total</span>
                                                    <span className="text-[var(--primary-600)]">{total.toLocaleString()} XAF</span>
                                                </div>
                                            </div>
                                        </div>

                                        {error && !paymentStatus && (
                                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                                                <FaTimesCircle /> {error}
                                            </div>
                                        )}

                                        {/* Payment action area */}
                                        {!paymentStatus && (
                                            <>
                                                {paymentMethod === 'mtn' && (
                                                    <button
                                                        onClick={handleMTNPayment}
                                                        disabled={loading}
                                                        className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-3 text-lg shadow-sm hover:shadow-md"
                                                    >
                                                        <FaMobileAlt /> Pay {total.toLocaleString()} XAF with MTN MoMo
                                                    </button>
                                                )}

                                                {paymentMethod === 'cash' && (
                                                    <button
                                                        onClick={handleCashOnDelivery}
                                                        disabled={loading}
                                                        className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 text-lg shadow-sm hover:shadow-md"
                                                    >
                                                        {loading ? (
                                                            <><FaSpinner className="animate-spin" /> Placing Order...</>
                                                        ) : (
                                                            <><FaCheckCircle /> Place Order — Pay on Delivery</>
                                                        )}
                                                    </button>
                                                )}

                                                {paymentMethod === 'orange' && (
                                                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-center text-sm text-orange-700">
                                                        Orange Money coming soon. Go back and select another payment method.
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {/* MTN Payment: Pending */}
                                        {paymentStatus === 'PENDING' && (
                                            <div className="bg-yellow-50 rounded-2xl p-6 text-center border border-yellow-200">
                                                <FaSpinner className="text-yellow-500 text-4xl mx-auto mb-3 animate-spin" />
                                                <h3 className="text-lg font-bold text-yellow-700 mb-1">Processing Payment...</h3>
                                                <p className="text-sm text-yellow-600 mb-1">
                                                    Approve the MTN MoMo prompt on your phone
                                                </p>
                                                <p className="text-xs text-gray-400 font-mono mt-2">Ref: {paymentRef}</p>
                                                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-yellow-600">
                                                    <FaSpinner className="animate-spin" size={10} /> Checking automatically...
                                                </div>
                                            </div>
                                        )}

                                        {/* MTN Payment: Success */}
                                        {paymentStatus === 'SUCCESSFUL' && (
                                            <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-200">
                                                <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-3" />
                                                <h3 className="text-lg font-bold text-green-700 mb-1">Payment Successful!</h3>
                                                <p className="text-sm text-green-600">Redirecting to confirmation...</p>
                                            </div>
                                        )}

                                        {/* MTN Payment: Failed */}
                                        {paymentStatus === 'FAILED' && (
                                            <div className="bg-red-50 rounded-2xl p-6 text-center border border-red-200">
                                                <FaTimesCircle className="text-red-500 text-4xl mx-auto mb-3" />
                                                <h3 className="text-lg font-bold text-red-700 mb-1">Payment Failed</h3>
                                                <p className="text-sm text-red-600 mb-4">{error}</p>
                                                <button
                                                    onClick={handleRetryPayment}
                                                    className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
                                                >
                                                    Try Again
                                                </button>
                                            </div>
                                        )}

                                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--text-tertiary)]">
                                            <FaLock className="text-green-500" /> Your payment information is secure and encrypted
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 4: Confirmation */}
                                {step === 4 && orderConfirmation && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4 }}
                                        className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-[var(--border-light)] text-center"
                                    >
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <FaCheckCircle className="text-green-600 text-4xl" />
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">Order Confirmed!</h2>
                                        <p className="text-[var(--text-secondary)] mb-8">Thank you for shopping with AgriConnect</p>

                                        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl mb-8 text-left space-y-4 max-w-md mx-auto">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[var(--text-secondary)]">Orders</span>
                                                <div className="flex flex-col items-end gap-1">
                                                    {orderConfirmation.orderIds?.map((oid, i) => (
                                                        <span key={oid} className="font-mono font-bold text-xs bg-white px-3 py-1 rounded-lg">
                                                            #{oid.slice(0, 8)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            {orderConfirmation.orderIds?.length > 1 && (
                                                <p className="text-xs text-[var(--text-tertiary)]">
                                                    {orderConfirmation.orderIds.length} orders created (one per farmer)
                                                </p>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[var(--text-secondary)]">Payment</span>
                                                <span className="font-semibold text-sm">{orderConfirmation.paymentMethod}</span>
                                            </div>
                                            {orderConfirmation.paymentReference && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-[var(--text-secondary)]">Reference</span>
                                                    <span className="font-mono text-xs bg-white px-2 py-1 rounded">{orderConfirmation.paymentReference.slice(0, 12)}...</span>
                                                </div>
                                            )}
                                            <div className="pt-3 border-t border-[var(--border-light)] flex justify-between items-center">
                                                <span className="text-sm text-[var(--text-secondary)]">Total Paid</span>
                                                <span className="font-bold text-xl text-[var(--primary-600)]">{orderConfirmation.total.toLocaleString()} XAF</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                            <button
                                                onClick={() => navigate('/consumer-dashboard')}
                                                className="flex-1 px-6 py-3 bg-[var(--primary-500)] text-white font-bold rounded-xl hover:bg-[var(--primary-600)] transition-all shadow-sm hover:shadow-md"
                                            >
                                                View My Orders
                                            </button>
                                            <button
                                                onClick={() => navigate('/marketplace')}
                                                className="flex-1 px-6 py-3 border-2 border-[var(--primary-500)] text-[var(--primary-500)] font-bold rounded-xl hover:bg-[var(--primary-50)] transition"
                                            >
                                                Continue Shopping
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            {step < 4 && !orderComplete && (
                                <div className="flex justify-between mt-6">
                                    {step > 1 ? (
                                        <button
                                            onClick={handleBack}
                                            disabled={paymentStatus === 'PENDING' || paymentStatus === 'SUCCESSFUL'}
                                            className="px-5 py-3 rounded-xl border border-[var(--border-color)] font-semibold text-[var(--text-secondary)] hover:bg-white transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaArrowLeft size={12} /> Back
                                        </button>
                                    ) : <div />}

                                    {step < 3 && (
                                        <button
                                            onClick={handleNext}
                                            className="px-7 py-3 bg-[var(--primary-500)] text-white font-bold rounded-xl hover:bg-[var(--primary-600)] transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                                        >
                                            Continue <FaArrowRight size={12} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        {step < 4 && (
                            <div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--border-light)] sticky top-24">
                                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-5">Order Summary</h3>
                                    
                                    {/* Cart items grouped by farmer */}
                                    <div className="space-y-4 mb-5 max-h-56 overflow-y-auto">
                                        {farmerGroups.map((group) => (
                                            <div key={group.farmerId}>
                                                <div className="flex items-center gap-1 mb-2">
                                                    <FaStore className="text-[var(--primary-400)]" size={11} />
                                                    <span className="text-xs font-semibold text-[var(--text-secondary)] truncate">{group.farmerName}</span>
                                                </div>
                                                {group.items.map((item) => (
                                                    <div key={item.id} className="flex items-center gap-3 text-sm mb-2 ml-3">
                                                        {item.image && (
                                                            <img src={item.image} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[var(--text-primary)] font-medium truncate text-xs">{item.name}</p>
                                                            <p className="text-xs text-[var(--text-tertiary)]">Qty: {item.quantity}</p>
                                                        </div>
                                                        <span className="text-xs font-semibold text-[var(--text-primary)] flex-shrink-0">
                                                            {(item.price * item.quantity).toLocaleString()} XAF
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-[var(--border-light)] pt-4 space-y-3">
                                        <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                                            <span>Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                                            <span>{subtotal.toLocaleString()} XAF</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                                            <span>Delivery Fee</span>
                                            <span>
                                                {deliveryFee === 0 ? (
                                                    <span className="text-green-600 font-medium">FREE</span>
                                                ) : (
                                                    `${deliveryFee.toLocaleString()} XAF`
                                                )}
                                            </span>
                                        </div>
                                        {deliveryFee > 0 && (
                                            <p className="text-xs text-green-600">Free delivery on orders above 50,000 XAF</p>
                                        )}
                                        <div className="pt-3 border-t border-[var(--border-light)] flex justify-between font-bold text-lg">
                                            <span className="text-[var(--text-primary)]">Total</span>
                                            <span className="text-[var(--primary-600)]">{total.toLocaleString()} XAF</span>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-center gap-2 text-xs text-[var(--text-tertiary)] bg-[var(--bg-secondary)] p-3 rounded-lg">
                                        <FaLock className="text-green-500 flex-shrink-0" />
                                        Secure checkout guaranteed
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Checkout;
