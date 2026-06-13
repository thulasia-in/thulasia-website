import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Store from './components/Store';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import Recipes from './components/Recipes';
import TrackOrder from './components/TrackOrder';
import { Phone, Mail, MapPin, Award, CheckCircle, ShieldCheck, Heart, Leaf, Instagram, Facebook } from 'lucide-react';

export default function BuyerApp() {
  const [currentView, setCurrentView] = useState('home');
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [deliverySettings, setDeliverySettings] = useState({ shippingFee: 40, freeDeliveryEnabled: false, freeDeliveryThreshold: 500 });
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('thulasia_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchOffers();
    fetchSettings();
  }, []);

  useEffect(() => {
    localStorage.setItem('thulasia_cart', JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) { console.error('Error fetching products:', err); }
  };

  const fetchOffers = async () => {
    try {
      const res = await fetch('/api/offers');
      const data = await res.json();
      setOffers(data.filter(o => o.active));
    } catch (err) { console.error('Error fetching offers:', err); }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setDeliverySettings(data);
    } catch (err) { console.error('Error fetching settings:', err); }
  };

  // ── Cart helpers ─────────────────────────────────────────────────────────────
  const addToCart = (product, quantity = 1) => {
    if (!product) return;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const removeFromCart = (productId) => setCart(prev => prev.filter(item => item.product.id !== productId));
  const clearCart = () => setCart([]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // ── Checkout success ─────────────────────────────────────────────────────────
  const handleCheckoutSuccess = async (newOrder) => {
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch { /* Order saved in Checkout.jsx success screen */ }
    clearCart();
    setCurrentView('home');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {(offers.length > 0 || deliverySettings.freeDeliveryEnabled || deliverySettings.freeDeliveryThreshold > 0) && (
        <div style={{
          backgroundColor: 'var(--primary-dark)',
          color: 'var(--accent)',
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: 600,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          letterSpacing: '0.5px',
          zIndex: 60,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          fontFamily: "'Outfit', sans-serif"
        }}>
          {/* Free delivery badge */}
          {deliverySettings.freeDeliveryEnabled && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'white' }}>
              🚚 <strong>FREE DELIVERY</strong> on all orders!
            </span>
          )}
          {!deliverySettings.freeDeliveryEnabled && deliverySettings.freeDeliveryThreshold > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              🚚 Free delivery on orders above <strong style={{ color: 'white' }}>₹{deliverySettings.freeDeliveryThreshold}</strong>
            </span>
          )}
          {/* Separator */}
          {offers.length > 0 && (deliverySettings.freeDeliveryEnabled || deliverySettings.freeDeliveryThreshold > 0) && (
            <span style={{ margin: '0 10px', opacity: 0.4 }}>•</span>
          )}
          {/* Coupons */}
          {offers.length > 0 && (
            <>
              <span>🔥 OFFERS:</span>
              {offers.map((offer, idx) => (
                <span key={offer.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span>{offer.description} — use code</span>
                  <strong style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px dashed rgba(255,255,255,0.25)', fontSize: '11px', letterSpacing: '1px' }}>{offer.code}</strong>
                  <span>for <strong>{offer.discount}% OFF</strong></span>
                  {idx < offers.length - 1 && <span style={{ margin: '0 8px', opacity: 0.5 }}>•</span>}
                </span>
              ))}
            </>
          )}
        </div>
      )}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        cartCount={cartCount}
        setIsCartOpen={setIsCartOpen}
      />

      <div style={{ flex: 1 }}>
        {/* ── HOME ── */}
        {currentView === 'home' && (
          <>
            <Hero setCurrentView={setCurrentView} addToCart={addToCart} products={products} />

            {/* Value Proposition */}
            <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-white)', borderBottom: '1px solid var(--border-color)' }}>
              <div className="container">
                <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
                  <span style={{ color: 'var(--accent)', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '2px', fontWeight: 700, display: 'block', marginBottom: '10px' }}>Our Sourcing & Process</span>
                  <h2 style={{ fontSize: '36px', lineHeight: 1.2, fontWeight: 800 }}>Made with Love & Traditional Care</h2>
                  <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>
                    We bridge the gap between traditional Tamil Nadu recipes and modern hygiene. Our manufacturing unit in Erode is fully FSSAI registered.
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                  {[
                    { icon: Award, title: '100% Natural', desc: 'No chemical preservatives, no MSG, and no artificial coloring agents. Only pure native ingredients sourced directly from farmers.' },
                    { icon: CheckCircle, title: 'Traditionally Roasted', desc: 'Dry roasted slowly in small batches over iron pans to preserve volatile oils and deliver that rich, home-cooked aroma.' },
                    { icon: ShieldCheck, title: 'FSSAI Registered', desc: 'Processed under strict hygienic conditions. Fully compliant with food safety regulations. FSSAI No: 22424573000315.' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="card" style={{ padding: '40px 32px', textAlign: 'center' }}>
                      <div style={{ backgroundColor: 'rgba(17,61,38,0.05)', color: 'var(--primary)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <Icon size={32} />
                      </div>
                      <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Flagship Product */}
            <section style={{ padding: '80px 0' }}>
              <div className="container">
                <div className="responsive-grid-2" style={{ gap: '40px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <div style={{ width: '100%', maxWidth: '360px', height: '460px', backgroundColor: 'var(--primary)', borderRadius: '24px', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column', color: 'white', border: '6px solid var(--accent)', padding: '30px', backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.03) 0%, transparent 90%)' }} className="animate-float">
                      <div style={{ position: 'absolute', top: 10, right: 10, opacity: 0.1 }}><Leaf size={150} /></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ border: '2px solid var(--accent)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: 'var(--accent)', fontWeight: 800 }}>100% NATURAL</div>
                        <div style={{ width: '18px', height: '18px', border: '2px solid #00B050', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00B050' }} />
                        </div>
                      </div>
                      <div style={{ textAlign: 'center', margin: '20px 0 10px' }}>
                        <h4 style={{ color: 'var(--accent)', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Thulasia</h4>
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', letterSpacing: '3px' }}>•• FOODS ••</span>
                        <h3 style={{ fontSize: '38px', color: 'white', fontWeight: 800, margin: '15px 0 5px', fontFamily: "'Outfit', sans-serif" }}>POONDU PODI</h3>
                        <span style={{ fontSize: '14px', color: 'var(--accent-light)', fontWeight: 600, letterSpacing: '1px' }}>GARLIC PODI</span>
                      </div>
                      <div style={{ marginTop: 'auto', border: '1px dashed rgba(255,255,255,0.2)', padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: 'rgba(255,255,255,0.8)' }}><span>Tradition Roast</span><span>No Preservatives</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}><span>Garlic Spice Mix</span><span>Net Wt: 100g</span></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px' }}>Flagship Product</span>
                    <h2 style={{ fontSize: 'clamp(24px, 4vw, 42px)', fontWeight: 800, margin: '12px 0 20px', lineHeight: 1.2 }}>Traditional Garlic Podi</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '17px', marginBottom: '24px' }}>
                      Our signature Poondu Podi is prepared with premium garlic cloves, selectively chosen red chillies, and roasted dals. Mix with hot ghee over steaming rice or idlis.
                    </p>
                    <div style={{ display: 'flex', gap: 'clamp(12px, 3vw, 30px)', marginBottom: '28px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '16px 0', flexWrap: 'wrap' }}>
                      {[['100%', 'Pure Vegetarian'], ['Zero', 'Artificial Additives'], ['Erode', 'Homemade Quality']].map(([val, label]) => (
                        <div key={label}>
                          <span style={{ display: 'block', fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>{val}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{label}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button onClick={() => addToCart(products.find(p => p.id === 1) || products[0])} className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '16px' }}>
                        Add to Cart
                      </button>
                      <button onClick={() => setSelectedProduct(products.find(p => p.id === 1) || products[0])} className="btn btn-outline" style={{ padding: '16px 28px', fontSize: '16px' }}>
                        Nutrition Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── STORE ── */}
        {currentView === 'store' && (
          <Store products={products} addToCart={addToCart} setSelectedProduct={setSelectedProduct} />
        )}

        {/* ── RECIPES ── */}
        {currentView === 'recipes' && <Recipes />}

        {/* ── TRACK ORDER ── */}
        {currentView === 'track' && <TrackOrder />}

        {/* ── CHECKOUT ── */}
        {currentView === 'checkout' && (
          <Checkout
            cart={cart}
            subtotal={cartSubtotal}
            offers={offers}
            deliverySettings={deliverySettings}
            onSuccess={handleCheckoutSuccess}
            setCurrentView={setCurrentView}
          />
        )}

        {/* ── CONTACT ── */}
        {currentView === 'contact' && (
          <section style={{ padding: '80px 0' }} className="animate-fade-in">
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px' }}>Get in Touch</span>
                <h2 style={{ fontSize: '36px', fontWeight: 800, marginTop: '8px' }}>Contact Thulasia Foods</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '16px auto 0' }}>
                  Have questions about bulk orders, customization, or shipping? Reach out directly or visit our manufacturing unit.
                </p>
              </div>
              <div className="responsive-grid-2" style={{ gap: '40px' }}>
                <div className="card" style={{ padding: '40px 24px' }}>
                  <h3 style={{ fontSize: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Leaf size={24} /> Manufacturing Details</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {[
                      { icon: MapPin, title: 'Premises Address', content: deliverySettings.address || '84, Pallakatuputhur, Nanjaiuthukuli,\nModakurichy Block, Erode,\nTamil Nadu - 638104, India' },
                      { icon: Phone, title: 'Call / WhatsApp', content: deliverySettings.phone || '+91 12345 67890\n+91 98765 43210' },
                      { icon: Mail, title: 'Support Email', content: deliverySettings.email || 'contact@thulasiafoods.com' },
                      { icon: Award, title: 'FSSAI Registration', content: deliverySettings.fssai || 'License No: 22424573000315\nCategory: Registration [Tamil Nadu]' },
                    ].map(({ icon: Icon, title, content }) => (
                      <div key={title} style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ color: 'var(--primary)', marginTop: '4px' }}><Icon size={20} /></div>
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{title}</h4>
                          <p style={{ color: 'var(--text-muted)', fontSize: '15px', whiteSpace: 'pre-line' }}>{content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  <div className="card" style={{ padding: '32px', backgroundColor: 'var(--primary)', color: 'white' }}>
                    <h3 style={{ fontSize: '20px', color: 'white', marginBottom: '12px' }}>Order Support Policy</h3>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
                      We roast and pack on order to ensure absolute freshness. Orders shipped within 24-48 hours.
                    </p>
                    {['Delivery in India within 3-5 working days', 'Tracking details shared via SMS', 'FSSAI-compliant secure food packaging'].map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginBottom: '8px' }}>
                        <CheckCircle size={16} style={{ color: 'var(--accent)' }} /> {item}
                      </div>
                    ))}
                  </div>
                  <div className="card" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Send us a message</h3>
                    <form onSubmit={(e) => { e.preventDefault(); alert('Message sent! We will contact you soon.'); e.target.reset(); }}>
                      <div className="form-group"><input className="form-control" type="text" placeholder="Your Name" required /></div>
                      <div className="form-group"><input className="form-control" type="email" placeholder="Email Address" required /></div>
                      <div className="form-group"><textarea className="form-control" rows="4" placeholder="Message or inquiry..." required /></div>
                      <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Send Message</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: 'var(--primary-dark)', color: 'rgba(255,255,255,0.7)', padding: '60px 0 30px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div className="responsive-grid-4" style={{ gap: '30px', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <img src="/logo.png" alt="Thulasia Foods" style={{ height: '36px', objectFit: 'contain', backgroundColor: 'white', padding: '4px 8px', borderRadius: '6px' }} />
                <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 800 }}>Thulasia Foods</h3>
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '20px', maxWidth: '320px' }}>Traditional taste, modern convenience. Premium organic spices from Erode, Tamil Nadu.</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a href="#instagram" className="btn-icon" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: 'none' }}><Instagram size={18} /></a>
                <a href="#facebook" className="btn-icon" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: 'none' }}><Facebook size={18} /></a>
              </div>
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Shop</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                {[['Home', 'home'], ['Shop Spice Mixes', 'store'], ['Recipe Hub', 'recipes'], ['Contact Us', 'contact']].map(([label, view]) => (
                  <li key={view}><span onClick={() => setCurrentView(view)} style={{ cursor: 'pointer', transition: 'color 0.2s' }}>{label}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Legal</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                {['Privacy Policy', 'Terms of Service', 'Shipping & Returns'].map(item => (
                  <li key={item}><a href={`#${item.toLowerCase().replace(/[^a-z]/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>FSSAI Registration</h4>
              <p style={{ fontSize: '13px', lineHeight: 1.5, marginBottom: '10px' }}>Registered Manufacturer under FSSAI, Government of Tamil Nadu.</p>
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px', fontSize: '12px' }}>
                <span style={{ display: 'block', color: 'var(--accent)', fontWeight: 'bold' }}>FSSAI REG NO:</span>
                <span style={{ color: 'white', fontFamily: 'monospace', fontSize: '13px' }}>{deliverySettings.fssaiNumber || '22424573000315'}</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '30px', textAlign: 'center', fontSize: '13px' }}>
            <p>© {new Date().getFullYear()} Thulasia Foods. All Rights Reserved. Made with <Heart size={12} style={{ display: 'inline', color: '#e74c3c' }} /> in Erode, Tamil Nadu.</p>
          </div>
        </div>
      </footer>

      {/* ── CART DRAWER ── */}
      {isCartOpen && (
        <CartDrawer
          cart={cart}
          subtotal={cartSubtotal}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={updateCartQuantity}
          onRemove={removeFromCart}
          onCheckout={() => { setIsCartOpen(false); setCurrentView('checkout'); }}
        />
      )}

      {/* ── PRODUCT DETAIL MODAL ── */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }} onClick={() => setSelectedProduct(null)}>
          <div className="card animate-fade-in" style={{ maxWidth: '650px', width: '100%', backgroundColor: 'var(--bg-white)', borderRadius: '24px', overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '30px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <span className="badge badge-success" style={{ marginBottom: '6px' }}>{selectedProduct.category}</span>
                  <h2 style={{ fontSize: '28px', fontWeight: 800 }}>{selectedProduct.name}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{selectedProduct.tagline}</p>
                </div>
                <button onClick={() => setSelectedProduct(null)} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
              </div>
              <div className="modal-content-grid" style={{ gap: '24px', marginBottom: '24px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '1px', marginBottom: '8px' }}>Description</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>{selectedProduct.description}</p>
                  <h4 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '1px', marginBottom: '8px' }}>Ingredients</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-dark)', backgroundColor: 'var(--bg-cream)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid var(--primary)', marginBottom: '16px' }}>{selectedProduct.ingredients}</p>
                  <h4 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '1px', marginBottom: '8px' }}>Directions</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selectedProduct.directions}</p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', textAlign: 'center' }}>Nutrition Facts</h4>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '12px' }}>(Per 100g)</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    {Object.entries(selectedProduct.nutrition || {}).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '4px' }}>
                        <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>{key}</span>
                        <span style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Net Weight: {selectedProduct.weight}</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>₹{selectedProduct.price}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => { addToCart(selectedProduct, 1); setSelectedProduct(null); }} className="btn btn-primary">Add to Cart</button>
                  <button onClick={() => setSelectedProduct(null)} className="btn btn-secondary">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
