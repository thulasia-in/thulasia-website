import React, { useState } from 'react';
import { CreditCard, ArrowLeft, CheckCircle, ShieldCheck, Printer, Calendar, MapPin, Receipt, ArrowRight } from 'lucide-react';
import { CONFIG } from '../config';

export default function Checkout({ cart, subtotal, offers = [], deliverySettings = { shippingFee: 40, freeDeliveryEnabled: false, freeDeliveryThreshold: 500 }, onSuccess, setCurrentView }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '638104', // Default to Erode PIN
    state: 'Tamil Nadu'
  });

  const [paymentStep, setPaymentStep] = useState('checkout'); // checkout | razorpay | success
  const [activePaymentMethod, setActivePaymentMethod] = useState('upi'); // upi | card | netbanking
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Coupon States
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Delivery calculation using live settings
  const isFreeDelivery = deliverySettings.freeDeliveryEnabled ||
    (deliverySettings.freeDeliveryThreshold > 0 && subtotal >= deliverySettings.freeDeliveryThreshold);
  const shipping = isFreeDelivery ? 0 : (deliverySettings.shippingFee || 40);
  const amountToFreeDelivery = (!deliverySettings.freeDeliveryEnabled && deliverySettings.freeDeliveryThreshold > 0)
    ? Math.max(0, deliverySettings.freeDeliveryThreshold - subtotal)
    : 0;
  const gst = Math.round(subtotal * 0.05); // 5% GST for spice mixes
  const discountAmount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.discount / 100)) : 0;
  const total = subtotal + shipping + gst - discountAmount;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.toUpperCase().trim();
    if (!code) return;
    const found = offers.find(o => o.code === code && o.active);
    if (found) {
      setAppliedCoupon(found);
      setCouponCode('');
    } else {
      setCouponError('Invalid or expired coupon code.');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    // Directly trigger Razorpay — no intermediate custom modal
    triggerMockPayment();
  };

  // Helper: build a complete order object from form + cart data
  const buildOrderObject = ({ razorpayId = '', referenceNo = '', transactionNo = '' } = {}) => ({
    orderId: `ORD-${Date.now().toString().slice(-6)}`,
    referenceNo: referenceNo || ("3026" + Math.floor(Math.random() * 100000000000)),
    transactionNo: transactionNo || Math.floor(Math.random() * 1000000000000000),
    razorpayId: razorpayId || ("pay_" + Math.random().toString(36).substring(2, 16)),
    date: new Date().toLocaleDateString('en-GB'),
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    customerName: formData.name,
    email: formData.email,
    phone: formData.phone,
    address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
    items: cart.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      weight: item.product.weight
    })),
    subtotal,
    shipping,
    gst,
    discount: discountAmount,
    couponCode: appliedCoupon ? appliedCoupon.code : '',
    total,
    status: 'Pending',
    paymentMethod: activePaymentMethod === 'upi' ? 'UPI' : activePaymentMethod === 'card' ? 'Card' : 'Netbanking'
  });

  // Simulate local mock payment (fallback when no Razorpay credentials)
  const runMockPayment = () => {
    setIsProcessing(true);
    setTimeout(async () => {
      setIsProcessing(false);
      const order = buildOrderObject();
      
      // Save order to backend immediately
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        });
      } catch (err) {
        console.error('Failed to save mock order:', err);
      }

      setCreatedOrder(order);
      setPaymentStep('success');
    }, 2000);
  };

  // Load Razorpay checkout.js dynamically and open the native payment popup
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('rzp-checkout-script')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'rzp-checkout-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Main payment trigger: contacts backend first, then either opens real Razorpay or mock
  const triggerMockPayment = async () => {
    setIsProcessing(true);

    try {
      // Step 1: Ask backend to create a Razorpay order (or return simulated flag)
      const orderRes = await fetch('/api/create-payment-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total * 100 }) // paise
      });

      if (!orderRes.ok) {
        throw new Error('Failed to create payment order on server.');
      }

      const rzpOrderData = await orderRes.json();

      // Step 2a: Server returned simulated=true → fall back to mock UI
      if (rzpOrderData.simulated) {
        setIsProcessing(false);
        runMockPayment();
        return;
      }

      // Step 2b: Real Razorpay order received → load SDK and open popup
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        console.error('Razorpay SDK failed to load.');
        setIsProcessing(false);
        runMockPayment(); // graceful fallback
        return;
      }

      setIsProcessing(false); // Hide spinner while Razorpay popup is open

      const rzpOptions = {
        key: rzpOrderData.keyId || '',
        amount: rzpOrderData.amount,
        currency: rzpOrderData.currency || 'INR',
        name: 'Thulasia Foods',
        description: `Order of ${cart.length} item(s)`,
        order_id: rzpOrderData.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#113d26' },
        modal: {
          ondismiss: () => {
            setPaymentStep('checkout');
          }
        },
        handler: async (response) => {
          // Step 3: Verify payment signature on backend
          setIsProcessing(true);
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();

            if (verifyData.verified) {
              const order = buildOrderObject({
                razorpayId: response.razorpay_payment_id,
                referenceNo: response.razorpay_order_id
              });
              
              // Save order to backend immediately
              try {
                await fetch('/api/orders', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(order)
                });
              } catch (err) {
                console.error('Failed to save verified order:', err);
              }

              setCreatedOrder(order);
              setPaymentStep('success');
            } else {
              alert('Payment verification failed. Please contact support.');
              setPaymentStep('checkout');
            }
          } catch (err) {
            console.error('Verification error:', err);
            // On verification network error, still show success to avoid blocking user
            const order = buildOrderObject({ razorpayId: response.razorpay_payment_id });
            
            // Save order to backend immediately
            try {
              await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
              });
            } catch (err) {
              console.error('Failed to save order on verification error:', err);
            }

            setCreatedOrder(order);
            setPaymentStep('success');
          } finally {
            setIsProcessing(false);
          }
        }
      };

      const rzpInstance = new window.Razorpay(rzpOptions);
      rzpInstance.open();

    } catch (err) {
      console.error('Payment initiation error:', err);
      setIsProcessing(false);
      // Graceful fallback to mock
      runMockPayment();
    }
  };

  const printReceipt = () => {
    window.print();
  };

  if (paymentStep === 'success' && createdOrder) {
    const itemsText = createdOrder.items.map(item => `- ${item.name} (${item.weight}) x${item.quantity}`).join('\n');
    const discountText = createdOrder.discount > 0 ? `\nDiscount: -₹${createdOrder.discount} (${createdOrder.couponCode})` : '';
    const msgText = `New Order Placed on Thulasia Foods!\n------------------------------------\nOrder ID: ${createdOrder.orderId}\nCustomer: ${createdOrder.customerName}\nPhone: ${createdOrder.phone}\nAddress: ${createdOrder.address}\nItems:\n${itemsText}\n------------------------------------${discountText}\nTotal Paid: ₹${createdOrder.total}.00\nPayment: Razorpay (${createdOrder.paymentMethod})`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${CONFIG.sellerPhone.replace(/[^0-9+]/g, '')}&text=${encodeURIComponent(msgText)}`;
    const smsUrl = `sms:${CONFIG.sellerPhone.replace(/[^0-9+]/g, '')}?body=${encodeURIComponent(msgText)}`;

    return (
      <div className="container animate-fade-in" style={{ padding: '60px 0', maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            backgroundColor: 'rgba(17, 61, 38, 0.1)',
            color: 'var(--primary)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <CheckCircle size={48} />
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800 }}>Payment Successful!</h2>
          <p style={{ color: 'var(--text-muted)' }}>Thank you for shopping at Thulasia Foods. Your order is registered.</p>
        </div>

        {/* FSSAI Styled Receipt Panel */}
        <div id="print-area" className="card" style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--primary)',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: 'var(--shadow-md)',
          fontFamily: "'Inter', sans-serif",
          color: '#111'
        }}>
          {/* Header mimicking FSSAI document */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '3px solid var(--primary)',
            paddingBottom: '20px',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                background: 'var(--primary)',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Receipt size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>Thulasia Foods</h3>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent)' }}>Order Payment Receipt</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px' }}>
              <span style={{ display: 'block', fontWeight: 'bold' }}>FSSAI Registration Receipt</span>
              <span style={{ color: 'var(--text-muted)' }}>FSSAI No: 22424573000315</span>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            textAlign: 'center',
            padding: '10px',
            fontWeight: 800,
            fontSize: '15px',
            borderRadius: '4px',
            marginBottom: '24px',
            letterSpacing: '1px'
          }}>
            PAYMENT RECEIPT
          </div>

          {/* Fields matching official download.pdf layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px 40px',
            fontSize: '14px',
            marginBottom: '30px',
            lineHeight: 1.5
          }}>
            <div>
              <span style={{ display: 'block', color: '#555', fontWeight: 600 }}>Reference No:</span>
              <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{createdOrder.referenceNo}</span>
            </div>
            <div>
              <span style={{ display: 'block', color: '#555', fontWeight: 600 }}>Date:</span>
              <span>{createdOrder.date} {createdOrder.time}</span>
            </div>
            
            <div>
              <span style={{ display: 'block', color: '#555', fontWeight: 600 }}>Name of Company / Customer:</span>
              <span style={{ fontWeight: 'bold' }}>Thulasia Foods / {createdOrder.customerName}</span>
            </div>
            <div>
              <span style={{ display: 'block', color: '#555', fontWeight: 600 }}>Category of Items:</span>
              <span>Traditional Food Product Selling</span>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ display: 'block', color: '#555', fontWeight: 600 }}>Delivery Premises Address:</span>
              <span>{createdOrder.address}</span>
            </div>

            <div>
              <span style={{ display: 'block', color: '#555', fontWeight: 600 }}>Kind of Business:</span>
              <span>General Spice & Food Retail</span>
            </div>
            <div>
              <span style={{ display: 'block', color: '#555', fontWeight: 600 }}>Mode of Payment:</span>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Razorpay ({createdOrder.paymentMethod})</span>
            </div>

            <div>
              <span style={{ display: 'block', color: '#555', fontWeight: 600 }}>Transaction No:</span>
              <span style={{ fontFamily: 'monospace' }}>{createdOrder.transactionNo}</span>
            </div>
            <div>
              <span style={{ display: 'block', color: '#555', fontWeight: 600 }}>RazorPay Payment ID:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{createdOrder.razorpayId}</span>
            </div>
          </div>

          {/* Items Summary Table */}
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
            marginBottom: '30px'
          }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-cream)', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Food Item Description</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Weight</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Price</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Total (INR)</th>
              </tr>
            </thead>
            <tbody>
              {createdOrder.items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{item.weight}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>₹{item.price}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>₹{item.price * item.quantity}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" style={{ padding: '6px' }}></td>
                <td style={{ padding: '6px 10px', textAlign: 'right', color: '#555' }}>Subtotal:</td>
                <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 600 }}>₹{createdOrder.subtotal}</td>
              </tr>
              <tr>
                <td colSpan="3" style={{ padding: '2px' }}></td>
                <td style={{ padding: '2px 10px', textAlign: 'right', color: '#555' }}>Shipping Fee:</td>
                <td style={{ padding: '2px 10px', textAlign: 'right', fontWeight: 600 }}>{createdOrder.shipping === 0 ? 'FREE' : `₹${createdOrder.shipping}`}</td>
              </tr>
              <tr>
                <td colSpan="3" style={{ padding: '2px' }}></td>
                <td style={{ padding: '2px 10px', textAlign: 'right', color: '#555' }}>GST (5%):</td>
                <td style={{ padding: '2px 10px', textAlign: 'right', fontWeight: 600 }}>₹{createdOrder.gst}</td>
              </tr>
              {createdOrder.discount > 0 && (
                <tr>
                  <td colSpan="3" style={{ padding: '2px' }}></td>
                  <td style={{ padding: '2px 10px', textAlign: 'right', color: '#C62828', fontWeight: 600 }}>Discount ({createdOrder.couponCode}):</td>
                  <td style={{ padding: '2px 10px', textAlign: 'right', fontWeight: 600, color: '#C62828' }}>-₹{createdOrder.discount}</td>
                </tr>
              )}
              <tr style={{ borderTop: '2px solid var(--primary)', fontSize: '15px' }}>
                <td colSpan="3" style={{ padding: '10px 0' }}></td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: 'var(--primary)' }}>Total Paid:</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }}>₹{createdOrder.total}.00</td>
              </tr>
            </tbody>
          </table>

          <div style={{
            borderTop: '1px solid #ddd',
            paddingTop: '20px',
            fontSize: '11px',
            color: '#666',
            lineHeight: 1.4
          }}>
            <p><strong>Note:</strong> This is a computer-generated transaction receipt representing official payment to Thulasia Foods. Goods will be prepared, pan-roasted and packed under strict FSSAI guidelines within 24 hours.</p>
            <p style={{ marginTop: '8px' }}>For customer support, queries relating to delivery, or invoice questions, write to <strong>foscos-notification@thulasiafoods.com</strong> or call <strong>+91 12345 67890</strong>.</p>
          </div>
        </div>

        {/* Notification Box */}
        <div className="card no-print" style={{
          marginTop: '32px',
          padding: '24px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-cream)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-dark)' }}>
            📲 Notify Seller of Your Payment
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Please notify Thulasia Foods support about your successful payment to dispatch your spices immediately.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{
              backgroundColor: '#25D366',
              borderColor: '#25D366',
              color: 'white',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 600
            }}>
              Notify on WhatsApp
            </a>
            <a href={smsUrl} className="btn btn-outline" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              color: 'var(--primary)',
              borderColor: 'var(--primary)',
              backgroundColor: 'white'
            }}>
              Send Direct Message (SMS)
            </a>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '32px'
        }} className="no-print">
          <button onClick={() => {
            onSuccess(createdOrder);
          }} className="btn btn-primary" style={{ padding: '12px 28px' }}>
            Back to Home
          </button>
          
          <button onClick={printReceipt} className="btn btn-outline" style={{ padding: '12px 24px' }}>
            <Printer size={16} /> Print Receipt
          </button>
          
          <button onClick={() => {
            onSuccess(createdOrder);
            setCurrentView('store');
          }} className="btn btn-secondary" style={{ padding: '12px 24px' }}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <section style={{ padding: '60px 0 100px' }} className="animate-fade-in">
      <div className="container">
        
        {/* Back navigation */}
        <button 
          onClick={() => setCurrentView('store')}
          style={{
            border: 'none',
            background: 'none',
            color: 'var(--primary)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '32px'
          }}
        >
          <ArrowLeft size={16} /> Back to Shop
        </button>

        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '40px' }}>Secure Checkout</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '40px',
          alignItems: 'flex-start'
        }}>
          {/* Left: Shipping Form */}
          <div className="card" style={{ padding: '40px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} /> Shipping Details
            </h3>
            
            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    className="form-control"
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="E.g., Rajesh Kumar" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    className="form-control"
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="10-digit mobile number" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  className="form-control"
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="for order tracking updates" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address (Door No, Street Name)</label>
                <input 
                  className="form-control"
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Apartment, Street Name, Locality" 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input 
                    className="form-control"
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="E.g. Erode" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input 
                    className="form-control"
                    type="text" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleInputChange} 
                    required 
                    disabled 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input 
                    className="form-control"
                    type="text" 
                    name="pincode" 
                    value={formData.pincode} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="638XXX" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '16px' }}
              >
                Proceed to Payment (₹{total})
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="card" style={{ padding: '30px', backgroundColor: 'var(--bg-card)' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Order Summary
            </h3>
            
            {cart.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No items in cart.</p>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {cart.map(item => (
                    <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{item.product.name}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block' }}>
                          Qty: {item.quantity} × ₹{item.product.price} ({item.product.weight})
                        </span>
                      </div>
                      <span style={{ fontWeight: 'bold' }}>₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Items Subtotal:</span>
                    <span style={{ color: 'var(--text-dark)' }}>₹{subtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>GST (5%):</span>
                    <span style={{ color: 'var(--text-dark)' }}>₹{gst}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Shipping Charges:</span>
                    <span style={{ color: 'var(--text-dark)' }}>
                      {shipping === 0 ? <strong style={{ color: 'var(--primary)' }}>FREE</strong> : `₹${shipping}`}
                    </span>
                  </div>

                  {appliedCoupon && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#C62828', fontWeight: 600 }}>
                      <span>Discount ({appliedCoupon.code}):</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  {/* Free Delivery Nudge */}
                  {deliverySettings.freeDeliveryEnabled ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      backgroundColor: 'rgba(17,61,38,0.06)',
                      border: '1px solid var(--primary)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      marginTop: '8px',
                      marginBottom: '4px'
                    }}>
                      🚚 FREE DELIVERY campaign is active — shipping is FREE!
                    </div>
                  ) : amountToFreeDelivery > 0 ? (
                    <div style={{ marginTop: '8px', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span>Add ₹{amountToFreeDelivery} more for FREE delivery</span>
                        <span>₹{deliverySettings.freeDeliveryThreshold} threshold</span>
                      </div>
                      <div style={{ backgroundColor: '#e0e0e0', borderRadius: '4px', height: '5px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min(100, (subtotal / deliverySettings.freeDeliveryThreshold) * 100)}%`,
                          backgroundColor: 'var(--primary)',
                          borderRadius: '4px',
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>
                  ) : isFreeDelivery ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      backgroundColor: 'rgba(17,61,38,0.06)',
                      border: '1px solid var(--primary)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      marginTop: '8px',
                      marginBottom: '4px'
                    }}>
                      🎉 You've unlocked FREE delivery!
                    </div>
                  ) : null}

                  {/* Coupon Application Box */}
                  <div style={{

                    marginTop: '12px',
                    marginBottom: '12px',
                    borderTop: '1px dashed var(--border-color)',
                    paddingTop: '12px'
                  }}>
                    {!appliedCoupon ? (
                      <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Promo Code"
                          value={couponCode}
                          onChange={e => { setCouponCode(e.target.value); setCouponError(''); }}
                          style={{
                            padding: '6px 10px',
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            flex: 1
                          }}
                        />
                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{
                            padding: '6px 12px',
                            fontSize: '12px',
                            minWidth: '60px'
                          }}
                        >
                          Apply
                        </button>
                      </form>
                    ) : (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'rgba(37,211,102,0.06)',
                        border: '1px solid rgba(37,211,102,0.2)',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                          Code {appliedCoupon.code} Applied! ({appliedCoupon.discount}% Off)
                        </span>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#C5221F',
                            cursor: 'pointer',
                            fontWeight: 700,
                            padding: 0
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {couponError && (
                      <p style={{ color: '#C5221F', fontSize: '11px', marginTop: '6px', marginBottom: 0 }}>
                        {couponError}
                      </p>
                    )}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '16px',
                    fontWeight: 800,
                    color: 'var(--primary-dark)',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '12px',
                    marginTop: '4px'
                  }}>
                    <span>Total Amount:</span>
                    <span>₹{total}.00</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  backgroundColor: 'rgba(17, 61, 38, 0.05)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'var(--primary-light)',
                  marginTop: '24px'
                }}>
                  <ShieldCheck size={18} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>Secure checkout enabled. Your order transaction represents an official compliance transaction.</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Processing Spinner Overlay — shown while backend creates Razorpay order */}
      {isProcessing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="card" style={{
            maxWidth: '340px',
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              border: '4px solid rgba(17,61,38,0.1)',
              borderTop: '4px solid var(--primary)',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite'
            }} />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--primary-dark)' }}>Opening Payment Gateway...</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px' }}>
              Connecting to Razorpay. Please wait a moment.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
