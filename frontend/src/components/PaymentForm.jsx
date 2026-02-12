import React, { useState, useRef, useCallback } from 'react';
import { FaMobileAlt, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PaymentForm = ({ amount, onPaymentSuccess, onPaymentError }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [referenceId, setReferenceId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, PENDING, SUCCESSFUL, FAILED
  const [error, setError] = useState('');
  const pollRef = useRef(null);

  // Format phone - sandbox uses test numbers directly, production would prefix 237
  const formatPhone = (phone) => {
    let cleaned = phone.replace(/[\s\-()+ ]/g, '');
    // In sandbox mode, use the number as-is (test number: 46733123453)
    // In production, would prefix with 237
    return cleaned;
  };

  // Validate
  const validate = () => {
    const cleaned = phoneNumber.replace(/[\s\-()+ ]/g, '');
    if (cleaned.length < 5) {
      setError('Enter a valid phone number (sandbox test: 46733123453)');
      return false;
    }
    setError('');
    return true;
  };

  // Poll payment status every 3s
  const startPolling = useCallback((refId) => {
    let attempts = 0;
    const maxAttempts = 30;

    pollRef.current = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`${API_BASE_URL}/api/payment/status/${refId}`);
        const data = await res.json();

        if (data.paymentStatus === 'SUCCESSFUL') {
          clearInterval(pollRef.current);
          setPaymentStatus('SUCCESSFUL');
          setLoading(false);
          onPaymentSuccess?.(refId);
        } else if (['FAILED', 'REJECTED', 'TIMEOUT'].includes(data.paymentStatus)) {
          clearInterval(pollRef.current);
          setPaymentStatus('FAILED');
          setLoading(false);
          setError(`Payment ${data.paymentStatus.toLowerCase()}. Please try again.`);
          onPaymentError?.(data.paymentStatus);
        }
        // else still PENDING, keep polling
      } catch (err) {
        console.error('Poll error:', err);
      }

      if (attempts >= maxAttempts) {
        clearInterval(pollRef.current);
        setPaymentStatus('FAILED');
        setLoading(false);
        setError('Payment timed out. Please try again.');
      }
    }, 3000);
  }, [onPaymentSuccess, onPaymentError]);

  // Initiate payment 
  const handlePay = async () => {
    if (!validate()) return;

    setLoading(true);
    setError('');
    setPaymentStatus('PENDING');

    const formatted = formatPhone(phoneNumber);

    try {
      const res = await fetch(`${API_BASE_URL}/api/payment/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: formatted,
          amount: parseFloat(amount)
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Payment failed');
      }

      setReferenceId(data.referenceId);
      startPolling(data.referenceId);
    } catch (err) {
      setError(err.message || 'Payment failed');
      setPaymentStatus(null);
      setLoading(false);
    }
  };

  // Reset for retry
  const handleRetry = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setReferenceId(null);
    setPaymentStatus(null);
    setError('');
    setLoading(false);
  };

  // Success state
  if (paymentStatus === 'SUCCESSFUL') {
    return (
      <div className="bg-green-50 rounded-2xl p-8 text-center border border-green-200">
        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-bold text-green-700 mb-2">Payment Successful!</h3>
        <p className="text-sm text-green-600">Your MTN MoMo payment has been confirmed.</p>
        <p className="text-xs text-gray-500 mt-3 font-mono">Ref: {referenceId}</p>
      </div>
    );
  }

  // Failed state
  if (paymentStatus === 'FAILED') {
    return (
      <div className="bg-red-50 rounded-2xl p-8 text-center border border-red-200">
        <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-700 mb-2">Payment Failed</h3>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Pending/waiting state
  if (paymentStatus === 'PENDING' && referenceId) {
    return (
      <div className="bg-yellow-50 rounded-2xl p-8 text-center border border-yellow-200">
        <FaSpinner className="text-yellow-500 text-4xl mx-auto mb-4 animate-spin" />
        <h3 className="text-xl font-bold text-yellow-700 mb-2">Waiting for payment...</h3>
        <p className="text-sm text-yellow-600 mb-2">
          Approve the payment on your phone.
        </p>
        <p className="text-xs text-gray-500">
          Amount: <strong>{parseFloat(amount).toLocaleString()} EUR</strong> (sandbox)
        </p>
        <p className="text-xs text-gray-400 mt-3 font-mono">Ref: {referenceId}</p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-yellow-600">
          <FaSpinner className="animate-spin" /> Checking status automatically...
        </div>
      </div>
    );
  }

  // Initial form
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--border-light)]">
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
        <FaMobileAlt className="text-yellow-500" /> MTN Mobile Money
      </h3>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        Enter your MTN number to pay <strong>{parseFloat(amount).toLocaleString()} XAF</strong>
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          MTN Phone Number
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="46733123453"
          disabled={loading}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
        />
        <p className="text-xs text-[var(--text-tertiary)] mt-1">
          Sandbox test number: <strong>46733123453</strong> (auto-approves)
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={loading || !phoneNumber}
        className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 text-black font-bold rounded-xl transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" /> Processing...
          </>
        ) : (
          <>
            <FaMobileAlt /> Pay {parseFloat(amount).toLocaleString()} XAF with MTN MoMo
          </>
        )}
      </button>

      <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-xs text-blue-700">
          <strong>Sandbox testing:</strong> Use number <strong>46733123453</strong> for successful payment
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;
