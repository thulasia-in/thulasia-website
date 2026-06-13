import React, { useState, useEffect } from 'react';
import { Search, Truck, Calendar, MapPin, CreditCard, CheckCircle, Mail, MessageSquare, ArrowRight, CornerDownRight, Clock } from 'lucide-react';

export default function TrackOrder() {
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Check URL parameters on load for direct tracking link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlOrderId = params.get('orderId') || params.get('id');
    if (urlOrderId) {
      setQuery(urlOrderId);
      handleTrack(null, urlOrderId);
    }
  }, []);

  const handleTrack = async (e, directQuery = '') => {
    if (e) e.preventDefault();
    const searchVal = (directQuery || query).trim();
    if (!searchVal) return;

    setLoading(true);
    setErrorMsg('');
    setSearched(true);
    setSelectedOrder(null);

    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const allOrders = await res.json();

      // Filter by Order ID (exact, case insensitive) or Phone Number (containment)
      const cleanSearch = searchVal.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      const matches = allOrders.filter(order => {
        const cleanOrderId = (order.orderId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanPhone = (order.phone || '').replace(/[^0-9]/g, '');
        const searchPhone = searchVal.replace(/[^0-9]/g, '');

        const matchId = cleanOrderId === cleanSearch || (order.orderId || '').toLowerCase() === searchVal.toLowerCase();
        const matchPhone = searchPhone.length > 4 && cleanPhone.includes(searchPhone);

        return matchId || matchPhone;
      });

      if (matches.length === 0) {
        setErrorMsg('No orders found matching that Order ID or WhatsApp Number. Please verify and try again.');
        setOrders([]);
      } else {
        setOrders(matches);
        // If there's only one match, auto-select it
        if (matches.length === 1) {
          setSelectedOrder(matches[0]);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred while tracking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatusClass = (order, step) => {
    const status = order.status || 'Pending';
    
    // Status mapping: Pending | Shipped | Delivered
    // Step index: 1 (Placed) | 2 (Confirmed) | 3 (Roasting) | 4 (Dispatched) | 5 (Delivered)
    if (step === 1 || step === 2) {
      return 'completed'; // Placed & Confirmed are always done if order exists
    }
    
    if (step === 3) {
      // Roasting: active if Pending, completed if Shipped or Delivered
      if (status === 'Pending') return 'active';
      return 'completed';
    }

    if (step === 4) {
      // Dispatched: active if Shipped, completed if Delivered, otherwise pending
      if (status === 'Shipped') return 'active';
      if (status === 'Delivered') return 'completed';
      return '';
    }

    if (step === 5) {
      // Delivered: completed if Delivered, otherwise pending
      if (status === 'Delivered') return 'completed';
      return '';
    }

    return '';
  };

  return (
    <section style={{ padding: '60px 0 100px' }} className="animate-fade-in">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            backgroundColor: 'rgba(180, 133, 72, 0.1)', 
            color: 'var(--accent-dark)', 
            width: '64px', height: '64px', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto 16px' 
          }}>
            <Truck size={30} />
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800 }}>Order Tracking Center</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '8px' }}>
            Check your live order status and delivery updates instantly
          </p>
        </div>

        {/* Search Panel Card */}
        <div className="card glow-on-hover" style={{ padding: '30px', marginBottom: '32px' }}>
          <form onSubmit={handleTrack}>
            <label className="form-label" style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 700 }}>
              Enter Order ID or WhatsApp Number
            </label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="E.g., ORD-388588 or 7373662697"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="form-control form-control-premium"
                  style={{ paddingLeft: '48px' }}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-premium-gradient"
                style={{ padding: '12px 28px', minHeight: '44px' }}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Track Order'}
              </button>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '10px' }}>
              💡 Hint: Enter the 10-digit WhatsApp number or the Order ID from your payment receipt.
            </span>
          </form>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{
              width: '40px', height: '40px',
              border: '4px solid rgba(17,61,38,0.1)',
              borderTop: '4px solid var(--primary)',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Retrieving tracking data...</p>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && !loading && (
          <div className="card animate-fade-in" style={{ 
            padding: '24px', 
            borderLeft: '4px solid #C5221F', 
            backgroundColor: 'rgba(197, 34, 31, 0.04)',
            color: '#C5221F',
            fontSize: '14px'
          }}>
            {errorMsg}
          </div>
        )}

        {/* Results List: If multiple orders found */}
        {searched && orders.length > 1 && !selectedOrder && !loading && (
          <div className="card animate-fade-in" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: 'var(--primary-dark)' }}>
              Multiple Orders Found ({orders.length})
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
              We found multiple orders associated with this number. Please select the order you wish to track:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.map(order => (
                <div 
                  key={order.orderId}
                  onClick={() => setSelectedOrder(order)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    backgroundColor: 'var(--bg-cream)',
                    transition: 'var(--transition)'
                  }}
                  className="glow-on-hover"
                >
                  <div>
                    <span style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--primary)', fontSize: '14px' }}>
                      {order.orderId}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '12px' }}>
                      {order.date} {order.time}
                    </span>
                    <span style={{ display: 'block', fontSize: '13px', color: 'var(--text-dark)', marginTop: '4px' }}>
                      Items: {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`tracking-status-badge ${order.status === 'Delivered' ? 'success' : order.status === 'Shipped' ? 'info' : 'active'}`}>
                      {order.status}
                    </span>
                    <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Order Tracking Detail */}
        {selectedOrder && !loading && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Tracking Status Card */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="track-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>Active Sourcing Status</span>
                  <h3 style={{ color: 'white', fontSize: '24px', fontWeight: 800, fontFamily: 'monospace' }}>{selectedOrder.orderId}</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', display: 'block', opacity: 0.8 }}>Placed on</span>
                  <span style={{ fontWeight: 600 }}>{selectedOrder.date} at {selectedOrder.time}</span>
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                
                {/* Visual Tracker Stepper */}
                <div style={{ margin: '16px 0 32px' }}>
                  <div className="stepper-container" style={{ border: 'none', boxShadow: 'none', padding: 0, marginBottom: 0 }}>
                    
                    {/* Horizontal Line Connector (Desktop) */}
                    <div className="stepper-line-horizontal" style={{ top: '22px', left: '44px', right: '44px' }} />
                    <div className="stepper-line-horizontal-progress" style={{ 
                      top: '22px', 
                      left: '44px', 
                      width: selectedOrder.status === 'Delivered' 
                        ? 'calc(100% - 88px)' 
                        : selectedOrder.status === 'Shipped' 
                          ? '75%' 
                          : '50%' 
                    }} />

                    {/* Vertical Line Connector (Mobile) */}
                    <div className="stepper-line-vertical" style={{ left: '22px' }} />
                    <div className="stepper-line-vertical-progress" style={{ 
                      left: '22px',
                      height: selectedOrder.status === 'Delivered' 
                        ? 'calc(100% - 44px)' 
                        : selectedOrder.status === 'Shipped' 
                          ? '75%' 
                          : '50%' 
                    }} />

                    {/* Step 1: Order Placed */}
                    <div className="step-item completed">
                      <div className="step-icon-wrapper" style={{ width: '40px', height: '40px', marginBottom: '4px' }}>✓</div>
                      <div className="step-info">
                        <div className="step-title">Order Placed</div>
                        <div className="step-desc">Received at Erode unit</div>
                      </div>
                    </div>

                    {/* Step 2: Confirmed */}
                    <div className="step-item completed">
                      <div className="step-icon-wrapper" style={{ width: '40px', height: '40px', marginBottom: '4px' }}>✓</div>
                      <div className="step-info">
                        <div className="step-title">Confirmed</div>
                        <div className="step-desc">Paid via {selectedOrder.paymentMethod}</div>
                      </div>
                    </div>

                    {/* Step 3: Roasting Spices */}
                    <div className={`step-item ${getStepStatusClass(selectedOrder, 3)}`}>
                      <div className="step-icon-wrapper" style={{ width: '40px', height: '40px', marginBottom: '4px' }}>
                        {selectedOrder.status === 'Pending' ? '3' : '✓'}
                      </div>
                      <div className="step-info">
                        <div className="step-title">Pan-Roasting</div>
                        <div className="step-desc">Pan-roasting dry spices</div>
                      </div>
                    </div>

                    {/* Step 4: Dispatched */}
                    <div className={`step-item ${getStepStatusClass(selectedOrder, 4)}`}>
                      <div className="step-icon-wrapper" style={{ width: '40px', height: '40px', marginBottom: '4px' }}>
                        {selectedOrder.status === 'Delivered' ? '✓' : '4'}
                      </div>
                      <div className="step-info">
                        <div className="step-title">Dispatched</div>
                        <div className="step-desc">
                          {selectedOrder.status === 'Shipped' ? 'In transit via courier' : 'Handed to courier'}
                        </div>
                      </div>
                    </div>

                    {/* Step 5: Delivered */}
                    <div className={`step-item ${getStepStatusClass(selectedOrder, 5)}`}>
                      <div className="step-icon-wrapper" style={{ width: '40px', height: '40px', marginBottom: '4px' }}>
                        {selectedOrder.status === 'Delivered' ? '✓' : '5'}
                      </div>
                      <div className="step-info">
                        <div className="step-title">Delivered</div>
                        <div className="step-desc">Spices delivered!</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Automation Notice Badges */}
                <div style={{ 
                  borderTop: '1px solid var(--border-color)', 
                  paddingTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary-dark)' }}>
                    📲 Automatic Order Sourcing Tracking
                  </h4>
                  <div className="tracking-channel-indicator">
                    <MessageSquare size={16} style={{ color: '#25D366' }} />
                    <div>
                      <strong>WhatsApp Notifications Active:</strong> Live alerts are set for <strong>{selectedOrder.phone}</strong>. 
                      You will receive automated updates when your package is roasted and dispatched.
                    </div>
                  </div>
                  <div className="tracking-channel-indicator" style={{ borderLeftColor: '#D1A66B' }}>
                    <Mail size={16} style={{ color: '#EA4335' }} />
                    <div>
                      <strong>Gmail Alerts Active:</strong> Confirmation and dispatch tracking codes are automatically sent to <strong>{selectedOrder.email}</strong>.
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Order Sourcing & Summary Panel */}
            <div className="responsive-grid-2" style={{ gap: '20px' }}>
              {/* Shipping Details */}
              <div className="card" style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-dark)' }}>
                  <MapPin size={18} /> Shipping & Premises
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Customer Name</span>
                    <strong>{selectedOrder.customerName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>WhatsApp Number</span>
                    <strong>{selectedOrder.phone}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Email Address</span>
                    <strong>{selectedOrder.email}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Delivery Address</span>
                    <span style={{ lineHeight: 1.4, display: 'block', fontWeight: 600 }}>{selectedOrder.address}</span>
                  </div>
                </div>
              </div>

              {/* Order Items & Cost Summary */}
              <div className="card" style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-dark)' }}>
                  <Clock size={18} /> Order Summary
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '16px' }}>
                  {selectedOrder.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '6px' }}>
                      <div>
                        <strong>{item.name}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>
                          Qty: {item.quantity} × ₹{item.price} ({item.weight})
                        </span>
                      </div>
                      <span style={{ fontWeight: 'bold' }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.subtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>GST (5%):</span>
                    <span>₹{selectedOrder.gst}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Shipping Charges:</span>
                    <span>{selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping}`}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#C62828', fontWeight: 600 }}>
                      <span>Discount ({selectedOrder.couponCode}):</span>
                      <span>-₹{selectedOrder.discount}</span>
                    </div>
                  )}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: '15px', 
                    fontWeight: 800, 
                    color: 'var(--primary-dark)',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '8px',
                    marginTop: '4px'
                  }}>
                    <span>Total Paid:</span>
                    <span>₹{selectedOrder.total}.00</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '16px', borderTop: '1px dashed var(--border-color)', paddingTop: '10px' }}>
                  <CreditCard size={14} />
                  <span>Paid via {selectedOrder.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Back Button */}
            {orders.length > 1 && (
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="btn btn-secondary"
                style={{ alignSelf: 'center', marginTop: '10px' }}
              >
                ← Back to Matches
              </button>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
