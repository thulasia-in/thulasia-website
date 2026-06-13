import React, { useState } from 'react';
import { ShoppingCart, BookOpen, Store as StoreIcon, Phone, Menu, X, Truck } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, cartCount, setIsCartOpen }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { view: 'home', label: 'Home', icon: null },
    { view: 'store', label: 'Shop Podis', icon: StoreIcon },
    { view: 'recipes', label: 'Recipes', icon: BookOpen },
    { view: 'track', label: 'Track Order', icon: Truck },
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
        <div onClick={() => { setCurrentView('home'); setIsMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <img src="/logo.png" alt="Thulasia Foods" style={{ height: '52px', objectFit: 'contain' }} />
        </div>

        {/* Desktop Nav Links */}
        <div className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {navLinks.map(({ view, label, icon: Icon }) => {
            const hash = view === 'home' ? '#/' : `#/${view}`;
            return (
              <a
                key={view}
                href={hash}
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
                  gap: '6px',
                  textDecoration: 'none'
                }}
              >
                {Icon && <Icon size={15} />}
                {label}
              </a>
            );
          })}

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

        {/* Mobile Nav Actions (Shown on mobile/tablet) */}
        <div className="mobile-actions-wrapper" style={{ display: 'none', alignItems: 'center', gap: '12px' }}>
          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn btn-primary"
            style={{
              position: 'relative',
              padding: '0',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                backgroundColor: 'var(--accent)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                width: '20px',
                height: '20px',
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

          {/* Hamburger Button */}
          <button
            className="mobile-nav-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-white)',
              borderRadius: '50%',
              width: '44px',
              height: '44px'
            }}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-nav-menu ${isMenuOpen ? 'open' : ''}`}>
        {navLinks.map(({ view, label, icon: Icon }) => {
          const hash = view === 'home' ? '#/' : `#/${view}`;
          return (
            <a
              key={view}
              href={hash}
              onClick={() => setIsMenuOpen(false)}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
                color: currentView === view ? 'var(--primary)' : 'var(--text-muted)',
                padding: '12px 0',
                borderBottom: '1px solid rgba(17, 61, 38, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none'
              }}
            >
              {Icon && <Icon size={18} />}
              {label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
