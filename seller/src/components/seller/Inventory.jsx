import React, { useState } from 'react';
import { Package, Plus, Edit, Trash, UploadCloud, CheckCircle, XCircle } from 'lucide-react';

export default function Inventory({ products, onAddProduct, onUpdateProduct, onDeleteProduct, onToggleStock, onReset }) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emptyForm = {
    name: '', tagline: '', price: '', weight: '100g',
    category: 'Podi', description: '', ingredients: '', directions: ''
  };
  const [form, setForm] = useState(emptyForm);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      tagline: product.tagline || '',
      price: product.price,
      weight: product.weight,
      category: product.category,
      description: product.description,
      ingredients: product.ingredients,
      directions: product.directions,
    });
    setImageFile(null);
    setImagePreview(product.imageUrl || null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid price.');
      return;
    }
    setIsSubmitting(true);

    let imageUrl = editingProduct?.imageUrl || null;

    if (imageFile) {
      const fd = new FormData();
      fd.append('image', imageFile);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        if (res.ok) {
          const data = await res.json();
          imageUrl = data.imageUrl;
        } else {
          alert('Image upload failed.');
          setIsSubmitting(false);
          return;
        }
      } catch {
        alert('Image upload failed. Is the server running?');
        setIsSubmitting(false);
        return;
      }
    }

    const payload = { ...form, price: priceNum, imageUrl };

    let success = false;
    if (editingProduct) {
      success = await onUpdateProduct(editingProduct.id, payload);
    } else {
      success = await onAddProduct(payload);
    }

    setIsSubmitting(false);
    if (success) {
      setShowForm(false);
      setEditingProduct(null);
      setForm(emptyForm);
      setImageFile(null);
      setImagePreview(null);
    } else {
      alert('Failed to save product. Please check server connection.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Package size={22} /> Inventory Manager
          <span style={{ fontSize: '14px', fontWeight: 600, backgroundColor: 'var(--bg-cream)', padding: '2px 10px', borderRadius: '20px', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
            {products.length} products
          </span>
        </h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => { if (window.confirm('Reset catalog to default 3 products?')) onReset(); }}
            className="btn btn-secondary"
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            Reset Catalog
          </button>
          <button onClick={openAddForm} className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 18px' }}>
            <Plus size={15} /> Add Product
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div style={{
          backgroundColor: 'var(--bg-cream)',
          border: '2px solid var(--primary)',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '28px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px', color: 'var(--primary-dark)' }}>
            {editingProduct ? `✏️ Editing: ${editingProduct.name}` : '➕ Add New Product'}
          </h4>

          <form onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Product Name *</label>
                <input className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Poondu Podi" />
              </div>
              <div>
                <label className="form-label">Tagline</label>
                <input className="form-control" value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} placeholder="e.g. Authentic Tamil Nadu Recipe" />
              </div>
            </div>

            {/* Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Price (₹) *</label>
                <input className="form-control" type="number" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="120" />
              </div>
              <div>
                <label className="form-label">Net Weight</label>
                <input className="form-control" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="100g" />
              </div>
              <div>
                <label className="form-label">Category</label>
                <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="Podi">Podi</option>
                  <option value="Masala">Masala</option>
                  <option value="Oil">Oil</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Product Image</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                  border: '2px dashed var(--primary)', color: 'var(--primary)',
                  fontSize: '13px', fontWeight: 600, backgroundColor: 'rgba(17,61,38,0.03)',
                  transition: 'all 0.2s'
                }}>
                  <UploadCloud size={16} />
                  {imageFile ? imageFile.name : 'Choose Image File'}
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--border-color)' }}
                  />
                )}
                {imagePreview && (
                  <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                    style={{ border: 'none', background: 'none', color: '#C5221F', cursor: 'pointer', fontSize: '12px' }}>
                    ✕ Remove
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Description *</label>
              <textarea className="form-control" rows={2} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the product, its origin, taste, and method..." />
            </div>

            {/* Ingredients + Directions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label className="form-label">Ingredients (comma-separated)</label>
                <input className="form-control" value={form.ingredients} onChange={e => setForm({ ...form, ingredients: e.target.value })} placeholder="Garlic, Red Chilli, Salt..." />
              </div>
              <div>
                <label className="form-label">Directions for Use</label>
                <input className="form-control" value={form.directions} onChange={e => setForm({ ...form, directions: e.target.value })} placeholder="Mix with ghee and hot rice..." />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ minWidth: '120px' }}>
                {isSubmitting ? 'Saving...' : (editingProduct ? '💾 Save Changes' : '✅ Add Product')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <Package size={44} style={{ margin: '0 auto 16px', opacity: 0.25 }} />
          <p style={{ fontWeight: 600, fontSize: '16px' }}>No products in catalog</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>Click "Add Product" to list your first item.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-cream)', borderBottom: '2px solid var(--border-color)' }}>
                {['Image', 'Product', 'Category', 'Weight', 'Price', 'Stock', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: idx % 2 === 0 ? 'white' : 'var(--bg-cream)' }}>
                  <td style={{ padding: '10px 14px' }}>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                    ) : (
                      <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package size={20} style={{ color: 'white' }} />
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.tagline}</div>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ backgroundColor: 'rgba(17,61,38,0.08)', color: 'var(--primary)', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                      {p.category}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{p.weight}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--primary)' }}>₹{p.price}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <button
                      onClick={() => onToggleStock(p.id, p.inStock)}
                      style={{
                        border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                        backgroundColor: p.inStock ? '#E8F5E9' : '#FFEBEE',
                        color: p.inStock ? '#2E7D32' : '#C62828',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      {p.inStock ? <><CheckCircle size={11} /> In Stock</> : <><XCircle size={11} /> Out of Stock</>}
                    </button>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => openEditForm(p)} style={{ border: 'none', background: 'rgba(17,61,38,0.07)', color: 'var(--primary)', cursor: 'pointer', padding: '6px 8px', borderRadius: '6px' }} title="Edit">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => { if (window.confirm(`Delete "${p.name}"?`)) onDeleteProduct(p.id); }} style={{ border: 'none', background: '#FFEBEE', color: '#C62828', cursor: 'pointer', padding: '6px 8px', borderRadius: '6px' }} title="Delete">
                        <Trash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
