import React, { useState, useEffect } from 'react';
import Analytics from './components/seller/Analytics.jsx';
import OrderManager from './components/seller/OrderManager.jsx';
import Inventory from './components/seller/Inventory.jsx';
import RecipeManager from './components/seller/RecipeManager.jsx';
import OfferManager from './components/seller/OfferManager.jsx';
import { Lock, TrendingUp, ShoppingCart, Package, FileText, LogOut, Leaf, ExternalLink, BookOpen, Tag } from 'lucide-react';

export default function SellerApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState('analytics');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [offers, setOffers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [settings, setSettings] = useState({
    address: '',
    phone: '',
    email: '',
    fssai: '',
    fssaiNumber: ''
  });
  const [formSettings, setFormSettings] = useState({
    address: '',
    phone: '',
    email: '',
    fssai: '',
    fssaiNumber: ''
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormSettings({
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
        fssai: settings.fssai || '',
        fssaiNumber: settings.fssaiNumber || ''
      });
    }
  }, [settings]);

  const SELLER_PASSWORD = 'admin123';

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchOrders();
      fetchRecipes();
      fetchOffers();
      fetchSettings();
    }
  }, [isAuthenticated]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch { console.error('Failed to fetch settings'); }
  };

  const handleUpdateSettings = async (updatedData) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        return true;
      }
    } catch { console.error('Failed to update settings'); }
    return false;
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch { console.error('Failed to fetch products'); }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch { console.error('Failed to fetch orders'); }
  };

  const fetchRecipes = async () => {
    try {
      const res = await fetch('/api/recipes');
      const data = await res.json();
      setRecipes(data);
    } catch { console.error('Failed to fetch recipes'); }
  };

  const fetchOffers = async () => {
    try {
      const res = await fetch('/api/offers');
      const data = await res.json();
      setOffers(data);
    } catch { console.error('Failed to fetch offers'); }
  };

  // Recipe CRUD actions
  const handleAddRecipe = async (data) => {
    try {
      const res = await fetch('/api/recipes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) { fetchRecipes(); return true; }
    } catch { }
    return false;
  };

  const handleUpdateRecipe = async (id, data) => {
    try {
      const res = await fetch(`/api/recipes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) { fetchRecipes(); return true; }
    } catch { }
    return false;
  };

  const handleDeleteRecipe = async (id) => {
    try {
      await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
      fetchRecipes();
    } catch { }
  };

  // Offer CRUD actions
  const handleAddOffer = async (data) => {
    try {
      const res = await fetch('/api/offers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) { fetchOffers(); return true; }
    } catch { }
    return false;
  };

  const handleUpdateOffer = async (id, data) => {
    try {
      const res = await fetch(`/api/offers/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) { fetchOffers(); return true; }
    } catch { }
    return false;
  };

  const handleDeleteOffer = async (id) => {
    try {
      await fetch(`/api/offers/${id}`, { method: 'DELETE' });
      fetchOffers();
    } catch { }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === SELLER_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect passcode. Please try again.');
      setPassword('');
    }
  };

  // Product actions
  const handleAddProduct = async (data) => {
    try {
      const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) { fetchProducts(); return true; }
    } catch { }
    return false;
  };

  const handleUpdateProduct = async (id, data) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) { fetchProducts(); return true; }
    } catch { }
    return false;
  };

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch { }
  };

  const handleToggleStock = async (id, currentInStock) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ inStock: !currentInStock }) });
      fetchProducts();
    } catch { }
  };

  const handleResetCatalog = async () => {
    try {
      await fetch('/api/products/reset', { method: 'POST' });
      fetchProducts();
    } catch { }
  };

  // Order actions
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`/api/orders/${orderId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      fetchOrders();
    } catch { }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      fetchOrders();
    } catch { }
  };

  // ── LOGIN SCREEN ──────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-cream)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'radial-gradient(ellipse at 60% 10%, rgba(17,61,38,0.06) 0%, transparent 60%), var(--bg-cream)'
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src="/logo.png" alt="Thulasia Foods" style={{ height: '76px', objectFit: 'contain', marginBottom: '12px' }} />
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '6px' }}>Seller Portal</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Enter your passcode to access the dashboard</p>
          </div>

          {/* Login Card */}
          <div className="card" style={{ padding: '40px', boxShadow: '0 16px 48px rgba(17,61,38,0.10)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
              <div style={{
                backgroundColor: 'rgba(17,61,38,0.07)', color: 'var(--primary)',
                width: '60px', height: '60px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Lock size={26} />
              </div>
            </div>

            <form onSubmit={handleLogin}>
              <label className="form-label" style={{ textAlign: 'center', display: 'block', marginBottom: '8px' }}>Seller Passcode</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setPasswordError(''); }}
                placeholder="Enter passcode"
                className="form-control"
                style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '4px', marginBottom: '8px' }}
                autoFocus
              />
              {passwordError && (
                <p style={{ color: '#C5221F', fontSize: '12px', textAlign: 'center', marginBottom: '12px' }}>{passwordError}</p>
              )}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: '15px', marginTop: '12px' }}>
                Enter Dashboard →
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Looking to shop? <a href="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>Go to Buyer Store →</a>
          </p>
        </div>
      </div>
    );
  }

  // ── TAB CONFIG ────────────────────────────────────────────────────────────────
  const tabs = [
    { key: 'analytics', label: 'Analytics', icon: TrendingUp },
    { key: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
    { key: 'inventory', label: `Inventory (${products.length})`, icon: Package },
    { key: 'recipes', label: 'Recipes', icon: BookOpen },
    { key: 'offers', label: 'Offers', icon: Tag },
    { key: 'compliance', label: 'FSSAI', icon: FileText },
  ];

  // ── DASHBOARD ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-cream)' }}>

      {/* Sidebar */}
      <aside style={{
        width: '240px',
        flexShrink: 0,
        backgroundColor: 'var(--primary-dark)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        {/* Sidebar Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/logo.png" alt="Thulasia Foods" style={{ height: '42px', objectFit: 'contain', backgroundColor: 'white', padding: '4px 8px', borderRadius: '6px', marginBottom: '8px' }} />
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Seller Portal</span>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  width: '100%', padding: '11px 14px',
                  borderRadius: '10px', border: 'none', cursor: 'pointer',
                  fontSize: '13px', fontWeight: isActive ? 700 : 500,
                  marginBottom: '4px',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 14px', borderRadius: '10px',
              color: 'rgba(255,255,255,0.5)', fontSize: '12px', textDecoration: 'none',
              marginBottom: '6px',
              transition: 'all 0.2s'
            }}
          >
            <ExternalLink size={13} /> View Buyer Store
          </a>
          <button
            onClick={() => setIsAuthenticated(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              width: '100%', padding: '10px 14px', borderRadius: '10px',
              border: 'none', cursor: 'pointer', backgroundColor: 'transparent',
              color: 'rgba(255,255,255,0.4)', fontSize: '12px', textAlign: 'left'
            }}
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowX: 'auto' }}>
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>
              Seller Administration
            </p>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary-dark)', marginTop: '2px' }}>
              {tabs.find(t => t.key === activeTab)?.label?.split('(')[0].trim()}
            </h2>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="card animate-fade-in" style={{ padding: '36px', minHeight: '500px' }}>
          {activeTab === 'analytics' && (
            <Analytics products={products} orders={orders} />
          )}

          {activeTab === 'orders' && (
            <OrderManager
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onDeleteOrder={handleDeleteOrder}
              onRefresh={fetchOrders}
            />
          )}

          {activeTab === 'inventory' && (
            <Inventory
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onToggleStock={handleToggleStock}
              onReset={handleResetCatalog}
            />
          )}

          {activeTab === 'recipes' && (
            <RecipeManager
              recipes={recipes}
              onAddRecipe={handleAddRecipe}
              onUpdateRecipe={handleUpdateRecipe}
              onDeleteRecipe={handleDeleteRecipe}
            />
          )}

          {activeTab === 'offers' && (
            <OfferManager
              offers={offers}
              onAddOffer={handleAddOffer}
              onUpdateOffer={handleUpdateOffer}
              onDeleteOffer={handleDeleteOffer}
            />
          )}

          {activeTab === 'compliance' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={22} /> FSSAI Registration
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                This platform complies fully with FSSAI guidelines. Registration details are shown below.
              </p>
              <div style={{ backgroundColor: 'var(--bg-cream)', padding: '28px', borderRadius: '12px', border: '1.5px dashed var(--primary)', fontSize: '14px', lineHeight: 1.8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 40px' }}>
                  {[
                    ['Company / Organization', 'Thulasia'],
                    ['Reference No.', '30260602124685669'],
                    ['Premises Address', settings.address || '84, Pallakatuputhur, Nanjaiuthukuli, Erode, Modakurichy block, Erode, Tamil Nadu – 638104'],
                    ['Category of License', 'Registration [Tamil Nadu] [New Registration]'],
                    ['Kind of Business', 'Manufacturer – General Manufacturing'],
                    ['FSSAI Registration Fee', 'Rs 100 (1 Year validity)'],
                    ['Mode of Payment', 'Razorpay'],
                    ['RazorPay ID', 'pay_Swej7y7Nkx7MLe'],
                  ].map(([key, val]) => (
                    <div key={key}>
                      <strong style={{ display: 'block', color: 'var(--primary-dark)' }}>{key}:</strong>
                      <span style={{ color: 'var(--text-muted)' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(17,61,38,0.05)', padding: '14px 18px', borderRadius: '8px' }}>
                <FileText size={18} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  FSSAI registration verified and active. FSSAI No: <strong>{settings.fssaiNumber || '22426062000191'}</strong>
                </span>
              </div>

              {/* Edit Manufacturing & Contact Details Form */}
              <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-dark)' }}>
                  ✏️ Edit Manufacturing & Contact Details
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
                  Updating these values changes the details shown in the footer and Contact section of the buyer store.
                </p>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setSettingsSaving(true);
                  const success = await handleUpdateSettings(formSettings);
                  setSettingsSaving(false);
                  if (success) {
                    setSettingsSaved(true);
                    setTimeout(() => setSettingsSaved(false), 2000);
                  } else {
                    alert('Failed to save settings.');
                  }
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label className="form-label">Premises Address *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        required
                        value={formSettings.address}
                        onChange={e => setFormSettings({ ...formSettings, address: e.target.value })}
                        placeholder="Address"
                      />
                    </div>
                    <div>
                      <label className="form-label">FSSAI License Credentials *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        required
                        value={formSettings.fssai}
                        onChange={e => setFormSettings({ ...formSettings, fssai: e.target.value })}
                        placeholder="e.g. License No: ...&#10;Category: ..."
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                    <div>
                      <label className="form-label">Call / WhatsApp Number(s) *</label>
                      <input
                        className="form-control"
                        type="text"
                        required
                        value={formSettings.phone}
                        onChange={e => setFormSettings({ ...formSettings, phone: e.target.value })}
                        placeholder="e.g. +91 12345 67890"
                      />
                    </div>
                    <div>
                      <label className="form-label">Support Email *</label>
                      <input
                        className="form-control"
                        type="email"
                        required
                        value={formSettings.email}
                        onChange={e => setFormSettings({ ...formSettings, email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="form-label">FSSAI License Number *</label>
                      <input
                        className="form-control"
                        type="text"
                        required
                        value={formSettings.fssaiNumber}
                        onChange={e => setFormSettings({ ...formSettings, fssaiNumber: e.target.value })}
                        placeholder="e.g. 22426062000191"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '13px' }} disabled={settingsSaving}>
                    {settingsSaved ? 'Saved!' : settingsSaving ? 'Saving...' : 'Save Info'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
