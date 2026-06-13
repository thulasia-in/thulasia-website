import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer({ cart, subtotal, isOpen, onClose, onUpdateQuantity, onRemove, onCheckout, deliverySettings }) {
  const settings = deliverySettings || { shippingFee: 40, freeDeliveryEnabled: false, freeDeliveryThreshold: 500 };
  const freeShippingThreshold = settings.freeDeliveryThreshold || 500;
  const isFreeShipping = settings.freeDeliveryEnabled || subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;
  const progressPercentage = settings.freeDeliveryEnabled ? 100 : Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <div
      className="cart-drawer-overlay"
      style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end',
      backdropFilter: 'blur(4px)',
      transition: 'var(--transition)'
    }} onClick={onClose}>
      
      {/* Drawer Panel */}
      <div 
        className="animate-slide-left cart-drawer-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-cream)',
          height: '100%',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-white)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Your Shopping Cart</h2>
          </div>
          <button 
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.03)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content list */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {cart.length > 0 && (
            <div style={{
              backgroundColor: 'var(--bg-white)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-dark)' }}>
                <span style={{ fontSize: '16px' }}>🚚</span>
                <span style={{ fontWeight: 500 }}>
                  {isFreeShipping ? (
                    <span>Congratulations! You have unlocked <strong>FREE Shipping</strong>!</span>
                  ) : (
                    <span>Add <strong>₹{remainingForFreeShipping}</strong> more to unlock <strong>FREE Shipping</strong>!</span>
                  )}
                </span>
              </div>
              <div style={{
                height: '6px',
                backgroundColor: 'rgba(17, 61, 38, 0.08)',
                borderRadius: '9999px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  height: '100%',
                  width: `${progressPercentage}%`,
                  background: isFreeShipping ? 'linear-gradient(90deg, #2e7d32, #4caf50)' : 'linear-gradient(90deg, var(--accent), var(--accent-light))',
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease-out'
                }} />
              </div>
            </div>
          )}

          {cart.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1
            }}>
              <ShoppingBag size={48} style={{ color: 'var(--text-muted)', opacity: 0.3, marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--primary-dark)' }}>Cart is empty</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '240px', margin: '0 auto 24px' }}>
                Looks like you haven't added any spice mixes to your cart yet.
              </p>
              <button 
                onClick={onClose}
                className="btn btn-primary"
                style={{ fontSize: '13px' }}
              >
                Go Shop Podis
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div 
                key={item.product.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  backgroundColor: 'var(--bg-white)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Thumb placeholder vector background */}
                <div style={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: 'var(--primary)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontFamily: "'Outfit', sans-serif",
                  textAlign: 'center',
                  lineHeight: 1.1,
                  padding: '4px'
                }}>
                  {item.product.name.split(' ')[0]}<br />Podi
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary-dark)', maxWidth: '180px' }}>
                        {item.product.name}
                      </h4>
                      <button 
                        onClick={() => onRemove(item.product.id)}
                        style={{ border: 'none', background: 'none', color: '#C5221F', cursor: 'pointer' }}
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Net: {item.product.weight}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    {/* Quantity controls */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '100px',
                      padding: '2px',
                      backgroundColor: 'var(--bg-cream)'
                    }}>
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '13px', fontWeight: 700, padding: '0 8px', minWidth: '20px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)' }}>
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{
            padding: '24px',
            backgroundColor: 'var(--bg-white)',
            borderTop: '1px solid var(--border-color)',
            boxShadow: '0 -4px 16px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Items Total:</span>
              <span style={{ color: 'var(--text-dark)', fontSize: '14px', fontWeight: 600 }}>{cart.length} items</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span style={{ color: 'var(--primary-dark)', fontSize: '16px', fontWeight: 700 }}>Total Amount:</span>
              <span style={{ color: 'var(--primary)', fontSize: '20px', fontWeight: 800 }}>₹{subtotal}</span>
            </div>

            <button 
              onClick={onCheckout}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '15px'
              }}
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>
            
            <span style={{ display: 'block', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px' }}>
              Shipping and GST calculated at checkout.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
