import React from 'react';
import { ShoppingCart, BookOpen, Store as StoreIcon, Phone, ExternalLink } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, cartCount, setIsCartOpen }) {
  const navLinks = [
    { view: 'home', label: 'Home', icon: null },
    { view: 'store', label: 'Shop Podis', icon: StoreIcon },
    { view: 'recipes', label: 'Recipes', icon: BookOpen },
    { view: 'contact', label: 'Contact', icon: Phone },
  ];

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '1px solid var(--border-color)',
      padding: '14px 0',
      transition: 'var(--transition)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Brand Logo */}
        <div onClick={() => setCurrentView('home')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <img src="/logo.png" alt="Thulasia Foods" style={{ height: '52px', objectFit: 'contain' }} />
        </div>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {navLinks.map(({ view, label, icon: Icon }) => (
            <span
              key={view}
              onClick={() => setCurrentView(view)}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                color: currentView === view ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: currentView === view ? '2px solid var(--primary)' : '2px solid transparent',
                paddingBottom: '4px',
                transition: 'var(--transition)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {Icon && <Icon size={15} />}
              {label}
            </span>
          ))}



          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn btn-primary"
            style={{ position: 'relative', padding: '10px 20px', fontSize: '14px' }}
          >
            <ShoppingCart size={16} />
            Cart
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: 'var(--accent)',
                color: 'white',
                fontSize: '11px',
                fontWeight: 'bold',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-cream)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                animation: 'pulse-soft 2s infinite'
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
