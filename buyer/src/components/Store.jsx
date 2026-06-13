import React, { useState } from 'react';
import { Search, Star, Eye, ShoppingCart, Leaf } from 'lucide-react';

// A component to render category-specific vector artwork dynamically
function ProductImage({ type, primaryColor = '#113D26' }) {
  if (type === 'garlic') {
    return (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <rect width="100%" height="100%" fill={primaryColor} />
        {/* Decorative background circle */}
        <circle cx="50" cy="50" r="35" fill="rgba(255,255,255,0.05)" />
        {/* Mortar */}
        <path d="M30 60C30 72 39 80 50 80C61 80 70 72 70 60H30Z" fill="var(--accent)" />
        <ellipse cx="50" cy="60" rx="20" ry="4" fill="var(--accent-dark)" />
        {/* Garlic bulbs */}
        <path d="M42 58C39 58 36 60 36 64C36 68 40 72 42 72C44 72 45 70 47 70C49 70 50 72 52 72C54 72 58 68 58 64C58 60 55 58 52 58C49 58 48 60 47 60C46 60 45 58 42 58Z" fill="white" opacity="0.9" />
        <path d="M54 62C51.5 62 49 63.5 49 66.5C49 69.5 52.5 72.5 54 72.5C55.5 72.5 56.5 71 58 71C59.5 71 60.5 72.5 62 72.5C63.5 72.5 67 69.5 67 66.5C67 63.5 64.5 62 62 62C59.5 62 58.5 63.5 58 63.5C57.5 63.5 56.5 62 54 62Z" fill="white" opacity="0.7" />
        {/* Red chilli */}
        <path d="M68 38C62 48 48 55 48 55C48 55 55 44 63 36C65 34 68 35 68 38Z" fill="#C5221F" />
        <path d="M68 38C69 36 71 34 71 34" stroke="#00b050" strokeWidth="2" />
        {/* Leaf */}
        <path d="M35 38C38 38 41 41 42 44C40 45 37 45 34 42C33 41 33 39 35 38Z" fill="#00b050" />
      </svg>
    );
  }

  if (type === 'curry') {
    return (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <rect width="100%" height="100%" fill={primaryColor} />
        <circle cx="50" cy="50" r="35" fill="rgba(255,255,255,0.05)" />
        {/* Curry leaves stem */}
        <path d="M50 80C50 80 50 45 50 25" stroke="#723E10" strokeWidth="3" strokeLinecap="round" />
        {/* Leaves */}
        <path d="M50 35C40 32 32 38 32 38C32 38 42 42 50 38" fill="#2E7D32" />
        <path d="M50 35C60 32 68 38 68 38C68 38 58 42 50 38" fill="#2E7D32" />
        
        <path d="M50 50C38 47 30 53 30 53C30 53 40 57 50 53" fill="#388E3C" />
        <path d="M50 50C62 47 70 53 70 53C70 53 60 57 50 53" fill="#388E3C" />

        <path d="M50 65C40 62 34 67 34 67C34 67 42 71 50 67" fill="#4CAF50" />
        <path d="M50 65C60 62 66 67 66 67C66 67 58 71 50 67" fill="#4CAF50" />
      </svg>
    );
  }

  if (type === 'gunpowder') {
    return (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <rect width="100%" height="100%" fill={primaryColor} />
        <circle cx="50" cy="50" r="35" fill="rgba(255,255,255,0.05)" />
        {/* Spice powder pile */}
        <path d="M20 75C25 55 45 42 50 42C55 42 75 55 80 75H20Z" fill="#D32F2F" />
        <path d="M30 75C35 62 45 52 50 52C55 52 65 62 70 75H30Z" fill="#E64A19" opacity="0.8" />
        {/* Sesame seeds scattering */}
        <ellipse cx="45" cy="58" rx="2" ry="1" fill="#FFF9C4" transform="rotate(15 45 58)" />
        <ellipse cx="55" cy="62" rx="2" ry="1" fill="#FFF9C4" transform="rotate(-30 55 62)" />
        <ellipse cx="38" cy="68" rx="2" ry="1" fill="#FFF9C4" transform="rotate(45 38 68)" />
        <ellipse cx="62" cy="66" rx="2" ry="1" fill="#FFF9C4" transform="rotate(-15 62 66)" />
        <ellipse cx="50" cy="70" rx="2" ry="1" fill="#FFF9C4" />
      </svg>
    );
  }

  if (type === 'lentil') {
    return (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <rect width="100%" height="100%" fill={primaryColor} />
        <circle cx="50" cy="50" r="35" fill="rgba(255,255,255,0.05)" />
        {/* Bowl */}
        <path d="M25 55C25 72 36 78 50 78C64 78 75 72 75 55H25Z" fill="#FBC02D" />
        <ellipse cx="50" cy="55" rx="25" ry="5" fill="#F57F17" />
        {/* Dals inside */}
        <circle cx="42" cy="54" r="3" fill="#FFF59D" />
        <circle cx="48" cy="55" r="3" fill="#FFF59D" />
        <circle cx="54" cy="53" r="3" fill="#FFF59D" />
        <circle cx="58" cy="55" r="2" fill="#FFF59D" />
        <circle cx="45" cy="52" r="2" fill="#FFF59D" />
      </svg>
    );
  }

  if (type === 'turmeric') {
    return (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <rect width="100%" height="100%" fill={primaryColor} />
        <circle cx="50" cy="50" r="35" fill="rgba(255,255,255,0.05)" />
        {/* Turmeric rhizome roots */}
        <rect x="35" y="45" width="30" height="12" rx="6" fill="#E65100" transform="rotate(-15 50 51)" />
        <rect x="25" y="52" width="22" height="10" rx="5" fill="#F57C00" transform="rotate(30 36 57)" />
        <rect x="52" y="38" width="20" height="9" rx="4.5" fill="#EF6C00" transform="rotate(-45 62 42.5)" />
        {/* Golden dust glow */}
        <circle cx="50" cy="50" r="15" fill="#FFD54F" opacity="0.3" filter="blur(4px)" />
      </svg>
    );
  }

  // Fallback (Sambar/Masala bowl)
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="100%" height="100%" fill={primaryColor} />
      <circle cx="50" cy="50" r="35" fill="rgba(255,255,255,0.05)" />
      {/* Bowl */}
      <path d="M22 55C22 72 34 80 50 80C66 80 78 72 78 55H22Z" fill="#D84315" />
      <ellipse cx="50" cy="55" rx="28" ry="6" fill="#BF360C" />
      {/* Aromatic steam lines */}
      <path d="M42 42C44 36 41 32 43 26" stroke="#FFCC80" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M50 44C52 38 49 34 51 28" stroke="#FFCC80" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <path d="M58 42C60 36 57 32 59 26" stroke="#FFCC80" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export default function Store({ products, addToCart, setSelectedProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Podi', 'Masala'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.ingredients.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section style={{ padding: '60px 0 100px' }} className="animate-fade-in">
      <div className="container">
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px' }}>Product Catalog</span>
          <h1 style={{ fontSize: '36px', fontWeight: 800, marginTop: '8px', color: 'var(--primary-dark)', fontFamily: "'Outfit', sans-serif" }}>Buy Authentic Tamil Nadu Style Podis Online</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '12px auto 0' }}>
            Browse our range of traditional South Indian podis and masalas. Freshly made in Erode and shipped directly to your kitchen.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '40px',
          flexWrap: 'wrap',
          backgroundColor: 'var(--bg-white)',
          padding: '20px 24px',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  padding: '8px 20px',
                  fontSize: '14px'
                }}
              >
                {category === 'All' ? 'All Products' : category + 's'}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="search-wrapper" style={{
            position: 'relative',
            width: '100%',
            maxWidth: '320px'
          }}>
            <Search 
              size={18} 
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} 
            />
            <input
              type="text"
              placeholder="Search podis or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{
                paddingLeft: '44px',
                borderRadius: 'var(--radius-full)'
              }}
            />
          </div>
        </div>
 
        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: 'var(--bg-white)',
            borderRadius: '24px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '16px' }}><Search size={48} style={{ margin: '0 auto' }} /></div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No products found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try modifying your search keywords or checking a different category.</p>
          </div>
        ) : (
          <div className="products-grid" style={{
            gap: '30px'
          }}>
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                {/* SVG Product Packaging Banner representation */}
                <div style={{
                  height: '220px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }} onClick={() => setSelectedProduct(product)}>
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : product.id === 1 ? (
                    <img 
                      src="/pouch.webp" 
                      alt={product.name} 
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <ProductImage type={product.imageType} />
                  )}
                  
                  {/* Category Badge overlay */}
                  <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10 }}>
                    <span className="badge badge-success" style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: 'var(--primary)', fontWeight: 700 }}>
                      {product.category}
                    </span>
                  </div>

                  {/* FSSAI Badge Overlay */}
                  <div style={{ position: 'absolute', bottom: '12px', left: '16px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px', color: 'white', fontSize: '9px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#00b050' }} />
                    FSSAI Certified
                  </div>

                  {/* Hover Quick view icon */}
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(17,61,38,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'var(--transition)',
                    pointerEvents: 'none'
                  }} className="hover-overlay">
                    <span className="btn btn-secondary" style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Eye size={16} /> Quick View
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h3 
                        onClick={() => setSelectedProduct(product)}
                        style={{ fontSize: '18px', fontWeight: 700, cursor: 'pointer', hover: 'color: var(--primary-light)' }}
                      >
                        {product.name}
                      </h3>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{product.tagline}</span>
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>₹{product.price}</span>
                  </div>

                  <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    margin: '12px 0 20px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: 1
                  }}>
                    {product.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} fill="#FFC107" stroke="#FFC107" />
                      <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{product.rating}</span>
                      <span>({product.reviews} reviews)</span>
                    </div>
                    <span>Net Weight: <strong>{product.weight}</strong></span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 44px', gap: '8px' }}>
                    {product.inStock ? (
                      <button 
                        onClick={() => addToCart(product, 1)}
                        className="btn btn-primary"
                        style={{
                          fontSize: '13px',
                          padding: '10px'
                        }}
                      >
                        <ShoppingCart size={15} />
                        Add to Cart
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="btn"
                        style={{
                          backgroundColor: 'var(--border-color)',
                          color: 'var(--text-muted)',
                          fontSize: '13px',
                          padding: '10px',
                          cursor: 'not-allowed'
                        }}
                      >
                        Out of Stock
                      </button>
                    )}
                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="btn-icon"
                      title="Quick View Details"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
