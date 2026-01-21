import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiCheck, FiPhone, FiMapPin, FiUser, FiTruck } from 'react-icons/fi';
import { FaMobileAlt, FaMoneyBillWave } from 'react-icons/fa';
import { BsCashCoin } from 'react-icons/bs';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const [currentStep, setCurrentStep] = useState('cart');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Use cart context instead of local state
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    region: ''
  });

  const handleUpdateQuantity = (id, change) => {
    updateQuantity(id, change);
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const subtotal = getCartTotal();
  const deliveryFee = cartItems.length > 0 ? 2000 : 0;
  const total = subtotal + deliveryFee;

  const handleDeliveryChange = (e) => {
    setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });
  };

  // Step Progress Indicator
  const StepIndicator = () => {
    const steps = [
      { key: 'cart', label: 'Cart', number: 1 },
      { key: 'checkout', label: 'Delivery', number: 2 },
      { key: 'payment', label: 'Payment', number: 3 }
    ];
    
    const currentIndex = steps.findIndex(s => s.key === currentStep);
    
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        {steps.map((step, index) => (
          <div key={step.key} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              cursor: index < currentIndex ? 'pointer' : 'default'
            }}
            onClick={() => index < currentIndex && setCurrentStep(step.key)}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: index <= currentIndex ? '#2d5f3f' : '#e0e0e0',
                color: index <= currentIndex ? 'white' : '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '16px',
                transition: 'all 0.3s'
              }}>
                {index < currentIndex ? <FiCheck size={20} /> : step.number}
              </div>
              <span style={{ 
                marginTop: '8px', 
                fontSize: '13px', 
                fontWeight: index === currentIndex ? '700' : '500',
                color: index <= currentIndex ? '#2d5f3f' : '#666'
              }}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div style={{
                width: '80px',
                height: '3px',
                background: index < currentIndex ? '#2d5f3f' : '#e0e0e0',
                margin: '0 15px',
                marginBottom: '25px',
                borderRadius: '2px',
                transition: 'all 0.3s'
              }} />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Order Summary Component
  const OrderSummary = ({ buttonText, onButtonClick, onBackClick, backText, disabled }) => (
    <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
      <div style={{ 
        background: 'white', 
        borderRadius: '20px', 
        padding: '30px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '25px', color: '#1a1a1a' }}>
          Order Summary
        </h2>
        
        {/* Cart Items Preview */}
        <div style={{ marginBottom: '20px' }}>
          {cartItems.slice(0, 2).map(item => (
            <div key={item.id} style={{ 
              display: 'flex', 
              gap: '12px', 
              marginBottom: '12px',
              padding: '10px',
              background: '#f9f9f9',
              borderRadius: '10px'
            }}>
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} 
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>{item.name}</p>
                <p style={{ fontSize: '12px', color: '#666' }}>Qty: {item.quantity}</p>
              </div>
              <p style={{ fontSize: '13px', fontWeight: '700', color: '#2d5f3f' }}>
                {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
          {cartItems.length > 2 && (
            <p style={{ fontSize: '13px', color: '#666', textAlign: 'center', marginTop: '5px' }}>
              +{cartItems.length - 2} more items
            </p>
          )}
        </div>

        <div style={{ height: '1px', background: '#e0e0e0', margin: '15px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ color: '#666', fontSize: '15px' }}>Subtotal ({cartItems.length} items)</span>
          <span style={{ fontWeight: '600' }}>{subtotal.toLocaleString()} FCFA</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ color: '#666', fontSize: '15px' }}>Delivery Fee</span>
          <span style={{ fontWeight: '600' }}>{deliveryFee.toLocaleString()} FCFA</span>
        </div>
        <div style={{ height: '1px', background: '#e0e0e0', margin: '20px 0' }} />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '20px', 
          fontWeight: '800', 
          marginBottom: '25px' 
        }}>
          <span>Total</span>
          <span style={{ color: '#2d5f3f' }}>{total.toLocaleString()} FCFA</span>
        </div>
        
        <button 
          onClick={onButtonClick}
          disabled={disabled}
          style={{ 
            width: '100%', 
            padding: '16px', 
            background: disabled ? '#ccc' : '#2d5f3f', 
            color: 'white', 
            border: 'none', 
            borderRadius: '12px', 
            fontWeight: '700', 
            fontSize: '16px', 
            cursor: disabled ? 'not-allowed' : 'pointer', 
            marginBottom: '12px',
            transition: 'all 0.3s'
          }}
        >
          {buttonText}
        </button>
        
        {onBackClick && (
          <button 
            onClick={onBackClick}
            style={{ 
              width: '100%', 
              padding: '14px', 
              background: 'white', 
              color: '#2d5f3f', 
              border: '2px solid #2d5f3f', 
              borderRadius: '12px', 
              fontWeight: '700', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s'
            }}
          >
            <FiArrowLeft size={18} />
            {backText || 'Back'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f0' }}>
      <Navbar />
      
      <div style={{ padding: '120px 20px 60px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Progress Steps - hide on success/confirmation */}
        {!['success', 'confirmation'].includes(currentStep) && <StepIndicator />}

        {/* CART STEP */}
        {currentStep === 'cart' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              padding: '35px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1a1a1a' }}>
                  Shopping Cart
                </h1>
                <span style={{ color: '#666', fontSize: '15px' }}>{cartItems.length} items</span>
              </div>

              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ 
                    width: '100px', 
                    height: '100px', 
                    background: '#f5f5f5', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <FiTrash2 size={40} color="#ccc" />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Your cart is empty</h3>
                  <p style={{ color: '#666', marginBottom: '25px' }}>Browse our marketplace to find fresh products</p>
                  <Link 
                    to="/marketplace"
                    style={{
                      display: 'inline-block',
                      padding: '14px 30px',
                      background: '#2d5f3f',
                      color: 'white',
                      borderRadius: '12px',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                cartItems.map(item => (
                  <div 
                    key={item.id} 
                    style={{ 
                      display: 'flex', 
                      gap: '20px', 
                      padding: '20px 0', 
                      borderBottom: '1px solid #f0f0f0',
                      alignItems: 'center'
                    }}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ 
                        width: '110px', 
                        height: '110px', 
                        borderRadius: '14px', 
                        objectFit: 'cover',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px', color: '#1a1a1a' }}>
                        {item.name}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#666', marginBottom: '2px' }}>{item.farmer}</p>
                      <p style={{ fontSize: '13px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiMapPin size={12} /> {item.location}
                      </p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          background: '#f5f5f5', 
                          borderRadius: '10px',
                          overflow: 'hidden'
                        }}>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            style={{ 
                              padding: '10px 14px', 
                              border: 'none', 
                              background: 'transparent', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              color: '#333'
                            }}
                          >
                            <FiMinus size={16} />
                          </button>
                          <span style={{ 
                            fontWeight: '700', 
                            padding: '0 15px',
                            fontSize: '16px'
                          }}>
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            style={{ 
                              padding: '10px 14px', 
                              border: 'none', 
                              background: 'transparent', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              color: '#333'
                            }}
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: '#ef5350', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          <FiTrash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ 
                        fontSize: '20px', 
                        fontWeight: '800', 
                        color: '#2d5f3f' 
                      }}>
                        {(item.price * item.quantity).toLocaleString()} FCFA
                      </p>
                      <p style={{ fontSize: '13px', color: '#888' }}>
                        {item.price.toLocaleString()} FCFA each
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <OrderSummary 
              buttonText="Proceed to Checkout"
              onButtonClick={() => setCurrentStep('checkout')}
              onBackClick={null}
              disabled={cartItems.length === 0}
            />
          </div>
        )}

        {/* CHECKOUT / DELIVERY STEP */}
        {currentStep === 'checkout' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              padding: '35px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)' 
            }}>
              <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px', color: '#1a1a1a' }}>
                Delivery Information
              </h1>
              <p style={{ color: '#666', marginBottom: '30px', fontSize: '15px' }}>
                Please provide your delivery details
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '10px', 
                    fontWeight: '600', 
                    fontSize: '14px',
                    color: '#333'
                  }}>
                    <FiUser size={16} color="#2d5f3f" />
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    name="fullName"
                    placeholder="Enter your full name" 
                    value={deliveryInfo.fullName}
                    onChange={handleDeliveryChange}
                    style={{ 
                      width: '100%', 
                      padding: '14px 16px', 
                      border: '2px solid #e0e0e0', 
                      borderRadius: '12px', 
                      fontSize: '15px',
                      transition: 'border-color 0.3s',
                      outline: 'none'
                    }} 
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '10px', 
                    fontWeight: '600', 
                    fontSize: '14px',
                    color: '#333'
                  }}>
                    <FiPhone size={16} color="#2d5f3f" />
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="+237 6XX XXX XXX" 
                    value={deliveryInfo.phone}
                    onChange={handleDeliveryChange}
                    style={{ 
                      width: '100%', 
                      padding: '14px 16px', 
                      border: '2px solid #e0e0e0', 
                      borderRadius: '12px', 
                      fontSize: '15px',
                      outline: 'none'
                    }} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '10px', 
                  fontWeight: '600', 
                  fontSize: '14px',
                  color: '#333'
                }}>
                  <FiMapPin size={16} color="#2d5f3f" />
                  Delivery Address
                </label>
                <input 
                  type="text" 
                  name="address"
                  placeholder="Street address, neighborhood" 
                  value={deliveryInfo.address}
                  onChange={handleDeliveryChange}
                  style={{ 
                    width: '100%', 
                    padding: '14px 16px', 
                    border: '2px solid #e0e0e0', 
                    borderRadius: '12px', 
                    fontSize: '15px',
                    outline: 'none'
                  }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '10px', 
                    fontWeight: '600', 
                    fontSize: '14px',
                    color: '#333'
                  }}>
                    City
                  </label>
                  <input 
                    type="text" 
                    name="city"
                    placeholder="e.g., Yaoundé" 
                    value={deliveryInfo.city}
                    onChange={handleDeliveryChange}
                    style={{ 
                      width: '100%', 
                      padding: '14px 16px', 
                      border: '2px solid #e0e0e0', 
                      borderRadius: '12px', 
                      fontSize: '15px',
                      outline: 'none'
                    }} 
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '10px', 
                    fontWeight: '600', 
                    fontSize: '14px',
                    color: '#333'
                  }}>
                    Region
                  </label>
                  <select
                    name="region"
                    value={deliveryInfo.region}
                    onChange={handleDeliveryChange}
                    style={{ 
                      width: '100%', 
                      padding: '14px 16px', 
                      border: '2px solid #e0e0e0', 
                      borderRadius: '12px', 
                      fontSize: '15px',
                      outline: 'none',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select Region</option>
                    <option value="Centre">Centre</option>
                    <option value="Littoral">Littoral</option>
                    <option value="Ouest">Ouest</option>
                    <option value="Sud">Sud</option>
                    <option value="Est">Est</option>
                    <option value="Nord">Nord</option>
                    <option value="Extrême-Nord">Extrême-Nord</option>
                    <option value="Adamaoua">Adamaoua</option>
                    <option value="Nord-Ouest">Nord-Ouest</option>
                    <option value="Sud-Ouest">Sud-Ouest</option>
                  </select>
                </div>
              </div>

              {/* Delivery Options */}
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px', color: '#1a1a1a' }}>
                  Delivery Option
                </h3>
                <div style={{ 
                  padding: '20px', 
                  border: '2px solid #2d5f3f', 
                  borderRadius: '12px', 
                  background: '#e8f5eb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    background: '#2d5f3f', 
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FiTruck size={24} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a1a' }}>Standard Delivery</p>
                    <p style={{ fontSize: '13px', color: '#666' }}>Delivery within 24-48 hours</p>
                  </div>
                  <p style={{ fontWeight: '700', color: '#2d5f3f' }}>{deliveryFee.toLocaleString()} FCFA</p>
                </div>
              </div>
            </div>

            <OrderSummary 
              buttonText="Continue to Payment"
              onButtonClick={() => setCurrentStep('payment')}
              onBackClick={() => setCurrentStep('cart')}
              backText="Back to Cart"
            />
          </div>
        )}

        {/* PAYMENT STEP */}
        {currentStep === 'payment' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              padding: '35px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)' 
            }}>
              <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px', color: '#1a1a1a' }}>
                Select Payment Method
              </h1>
              <p style={{ color: '#666', marginBottom: '30px', fontSize: '15px' }}>
                Choose your preferred payment option
              </p>
              
              {/* MTN Mobile Money */}
              <div 
                onClick={() => setPaymentMethod('mtn')} 
                style={{ 
                  padding: '20px', 
                  border: paymentMethod === 'mtn' ? '2px solid #2d5f3f' : '2px solid #e0e0e0', 
                  borderRadius: '14px', 
                  marginBottom: '15px', 
                  cursor: 'pointer', 
                  background: paymentMethod === 'mtn' ? '#e8f5eb' : 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ 
                  width: '55px', 
                  height: '55px', 
                  background: '#ffcc00', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}>
                  <FaMobileAlt size={26} color="#000" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '17px', color: '#1a1a1a' }}>MTN Mobile Money</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Pay securely with MTN MoMo</div>
                </div>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: paymentMethod === 'mtn' ? 'none' : '2px solid #ccc',
                  background: paymentMethod === 'mtn' ? '#2d5f3f' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {paymentMethod === 'mtn' && <FiCheck size={14} color="white" />}
                </div>
              </div>

              {/* Orange Money */}
              <div 
                onClick={() => setPaymentMethod('orange')} 
                style={{ 
                  padding: '20px', 
                  border: paymentMethod === 'orange' ? '2px solid #2d5f3f' : '2px solid #e0e0e0', 
                  borderRadius: '14px', 
                  marginBottom: '15px', 
                  cursor: 'pointer', 
                  background: paymentMethod === 'orange' ? '#e8f5eb' : 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ 
                  width: '55px', 
                  height: '55px', 
                  background: '#ff6600', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}>
                  <FaMobileAlt size={26} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '17px', color: '#1a1a1a' }}>Orange Money</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Pay securely with Orange Money</div>
                </div>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: paymentMethod === 'orange' ? 'none' : '2px solid #ccc',
                  background: paymentMethod === 'orange' ? '#2d5f3f' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {paymentMethod === 'orange' && <FiCheck size={14} color="white" />}
                </div>
              </div>

              {/* Cash on Delivery */}
              <div 
                onClick={() => setPaymentMethod('cash')} 
                style={{ 
                  padding: '20px', 
                  border: paymentMethod === 'cash' ? '2px solid #2d5f3f' : '2px solid #e0e0e0', 
                  borderRadius: '14px', 
                  cursor: 'pointer', 
                  background: paymentMethod === 'cash' ? '#e8f5eb' : 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ 
                  width: '55px', 
                  height: '55px', 
                  background: '#4caf50', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}>
                  <BsCashCoin size={26} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '17px', color: '#1a1a1a' }}>Cash on Delivery</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Pay when you receive your order</div>
                </div>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: paymentMethod === 'cash' ? 'none' : '2px solid #ccc',
                  background: paymentMethod === 'cash' ? '#2d5f3f' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {paymentMethod === 'cash' && <FiCheck size={14} color="white" />}
                </div>
              </div>

              {/* Phone Number Input for Mobile Money */}
              {(paymentMethod === 'mtn' || paymentMethod === 'orange') && (
                <div style={{ marginTop: '25px', animation: 'fadeIn 0.3s ease' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '10px', 
                    fontWeight: '600', 
                    fontSize: '14px',
                    color: '#333'
                  }}>
                    <FiPhone size={16} color="#2d5f3f" />
                    {paymentMethod === 'mtn' ? 'MTN' : 'Orange'} Phone Number
                  </label>
                  <input 
                    type="tel" 
                    placeholder="+237 6XX XXX XXX" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '14px 16px', 
                      border: '2px solid #e0e0e0', 
                      borderRadius: '12px', 
                      fontSize: '15px',
                      outline: 'none'
                    }} 
                  />
                  <p style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>
                    You will receive a payment request on this number
                  </p>
                </div>
              )}
            </div>

            <OrderSummary 
              buttonText={paymentMethod === 'cash' ? 'Place Order' : 'Proceed to Payment'}
              onButtonClick={() => paymentMethod === 'cash' ? setCurrentStep('success') : setCurrentStep('confirmation')}
              onBackClick={() => setCurrentStep('checkout')}
              backText="Back to Delivery"
              disabled={!paymentMethod}
            />
          </div>
        )}

        {/* PAYMENT CONFIRMATION STEP */}
        {currentStep === 'confirmation' && (
          <div style={{ maxWidth: '550px', margin: '0 auto' }}>
            <div style={{ 
              background: 'white', 
              borderRadius: '24px', 
              padding: '50px 40px', 
              textAlign: 'center', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)' 
            }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                background: '#fff3cd', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 25px' 
              }}>
                <FaMobileAlt size={42} color="#f59e0b" />
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '12px', color: '#1a1a1a' }}>
                Confirm Payment on Your Phone
              </h2>
              <p style={{ fontSize: '15px', color: '#666', marginBottom: '10px' }}>
                We've sent a payment request to:
              </p>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: '#2d5f3f', 
                margin: '20px 0 25px', 
                padding: '15px 20px', 
                background: '#f0f9f4', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}>
                <FiPhone size={20} />
                {phoneNumber || '+237 6XX XXX XXX'}
              </div>
              <p style={{ fontSize: '15px', color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
                Please check your phone and enter your PIN to complete the payment of <strong>{total.toLocaleString()} FCFA</strong>.
              </p>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  onClick={() => setCurrentStep('success')} 
                  style={{ 
                    padding: '16px 35px', 
                    background: '#2d5f3f', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    fontWeight: '700', 
                    fontSize: '15px', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FiCheck size={18} />
                  I've Confirmed Payment
                </button>
              </div>
              
              <button 
                onClick={() => setCurrentStep('payment')} 
                style={{ 
                  marginTop: '15px',
                  padding: '12px 25px', 
                  background: 'transparent', 
                  color: '#666', 
                  border: 'none', 
                  fontSize: '14px', 
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Change payment method
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS STEP */}
        {currentStep === 'success' && (
          <div style={{ maxWidth: '550px', margin: '0 auto' }}>
            <div style={{ 
              background: 'white', 
              borderRadius: '24px', 
              padding: '50px 40px', 
              textAlign: 'center', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)' 
            }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                background: '#e8f5e9', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 25px' 
              }}>
                <FiCheck size={50} color="#2d5f3f" />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px', color: '#2d5f3f' }}>
                Order Placed Successfully!
              </h2>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
                Thank you for your order. Your fresh products will be delivered within 24-48 hours.
              </p>
              
              <div style={{ 
                background: '#f9f9f9', 
                padding: '25px', 
                borderRadius: '16px', 
                marginBottom: '30px' 
              }}>
                <div style={{ fontSize: '13px', color: '#888', marginBottom: '5px' }}>Order Number</div>
                <div style={{ fontSize: '26px', fontWeight: '800', color: '#1a1a1a' }}>
                  AC-{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
                </div>
                <div style={{ 
                  height: '1px', 
                  background: '#e0e0e0', 
                  margin: '15px 0' 
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#666' }}>Total Paid</span>
                  <span style={{ fontWeight: '700', color: '#2d5f3f' }}>{total.toLocaleString()} FCFA</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  style={{ 
                    padding: '14px 28px', 
                    background: '#2d5f3f', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    fontWeight: '700', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FiTruck size={18} />
                  Track Order
                </button>
                <Link 
                  to="/marketplace"
                  style={{ 
                    padding: '14px 28px', 
                    background: 'white', 
                    color: '#2d5f3f', 
                    border: '2px solid #2d5f3f', 
                    borderRadius: '12px', 
                    fontWeight: '700', 
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
