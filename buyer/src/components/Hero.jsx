import React from 'react';
import { ArrowRight, Leaf, Shield, Award, ShieldCheck } from 'lucide-react';

export default function Hero({ setCurrentView, addToCart, products }) {
  const flagshipProduct = products && products.length > 0
    ? (products.find(p => p.id === 1) || products[0])
    : null;

  // Show a minimal loading skeleton while products are being fetched
  if (!flagshipProduct) {
    return (
      <section style={{
        padding: '80px 0 100px',
        background: 'radial-gradient(circle at 80% 20%, rgba(17, 61, 38, 0.04) 0%, rgba(17, 61, 38, 0) 50%), var(--bg-cream)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid rgba(17,61,38,0.1)',
              borderTop: '4px solid var(--primary)',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Loading Thulasia Foods...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-fade-in" style={{
      padding: 'clamp(40px, 8vw, 80px) 0 clamp(60px, 10vw, 100px)',
      background: 'radial-gradient(circle at 80% 20%, rgba(17, 61, 38, 0.04) 0%, rgba(17, 61, 38, 0) 50%), var(--bg-cream)',
      borderBottom: '1px solid var(--border-color)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Decorative Leaves */}
      <div className="animate-float" style={{ position: 'absolute', top: '15%', left: '5%', opacity: 0.08, color: 'var(--primary)' }}>
        <Leaf size={48} />
      </div>
      <div className="animate-float" style={{ position: 'absolute', bottom: '15%', right: '10%', opacity: 0.06, color: 'var(--primary)', animationDelay: '2s' }}>
        <Leaf size={72} />
      </div>

      <div className="container">
        <div className="responsive-grid-2" style={{
          alignItems: 'center',
          gap: '40px'
        }}>
          {/* Text Content */}
          <div style={{ zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', backgroundColor: 'rgba(17, 61, 38, 0.06)', borderRadius: '100px', marginBottom: '24px' }}>
              <Award size={14} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)' }}>
                FSSAI Registered Manufacturer
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(28px, 6vw, 56px)',
              lineHeight: 1.15,
              fontWeight: 800,
              letterSpacing: '-0.5px',
              marginBottom: '24px',
              color: 'var(--primary-dark)'
            }}>
              Authentic Spice Podis from <span style={{ color: 'var(--accent)' }}>Tamil Nadu</span>
            </h1>
            
            <p style={{
              fontSize: 'clamp(14px, 2.5vw, 18px)',
              color: 'var(--text-muted)',
              marginBottom: '32px',
              lineHeight: 1.6,
              maxWidth: '540px'
            }}>
              Handcrafted in Erode using traditional slow-roasting recipes passed down through generations. 100% natural ingredients, packed with flavor and zero preservatives.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={() => setCurrentView('store')}
                className="btn btn-primary"
                style={{
                  padding: '16px 36px',
                  fontSize: '16px',
                }}
              >
                Explore Shop
                <ArrowRight size={18} />
              </button>
              
              <button 
                onClick={() => setCurrentView('recipes')}
                className="btn btn-secondary"
                style={{
                  padding: '16px 28px',
                  fontSize: '16px',
                }}
              >
                View Recipes
              </button>
            </div>

            {/* Quick trust items */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '40px',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '24px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 'max-content' }}>
                <ShieldCheck size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>No Preservatives</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 'max-content' }}>
                <ShieldCheck size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>Slow Pan-Roasted</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 'max-content' }}>
                <ShieldCheck size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>100% Vegetarian</span>
              </div>
            </div>
          </div>

          {/* Right Product Graphic Card */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            zIndex: 1
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '380px'
            }}>
              {/* Card behind product */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '-20px',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(180, 133, 72, 0.08)',
                borderRadius: '32px',
                zIndex: -1,
                transform: 'rotate(-4deg)'
              }} />

              {/* Core Hero Showcase Card */}
              <div className="card" style={{
                padding: '16px',
                borderRadius: '24px',
                backgroundColor: 'var(--bg-white)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <img 
                  src="/pouch.png" 
                  alt="Thulasia Poondu Podi Pouch" 
                  style={{
                    width: '100%',
                    borderRadius: '16px',
                    objectFit: 'cover',
                    height: '320px',
                    display: 'block'
                  }}
                />
                
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: 700 }}>{flagshipProduct.name}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{flagshipProduct.tagline}</p>
                    </div>
                    <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>₹{flagshipProduct.price}</span>
                  </div>

                  <button 
                    onClick={() => addToCart(flagshipProduct, 1)}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px' }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
