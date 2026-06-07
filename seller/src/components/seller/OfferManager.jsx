import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit, Trash, CheckCircle, XCircle, Truck, Settings, Save } from 'lucide-react';

export default function OfferManager({ offers, onAddOffer, onUpdateOffer, onDeleteOffer }) {
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delivery settings state
  const [deliverySettings, setDeliverySettings] = useState({
    shippingFee: 40,
    freeDeliveryEnabled: false,
    freeDeliveryThreshold: 500
  });
  const [deliverySaving, setDeliverySaving] = useState(false);
  const [deliverySaved, setDeliverySaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => setDeliverySettings(data))
      .catch(() => {});
  }, []);

  const handleSaveDelivery = async () => {
    setDeliverySaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deliverySettings)
      });
      if (res.ok) {
        setDeliverySaved(true);
        setTimeout(() => setDeliverySaved(false), 2500);
      }
    } catch {}
    setDeliverySaving(false);
  };

  const emptyForm = { code: '', discount: '', description: '', active: true };
  const [form, setForm] = useState(emptyForm);

  const openAddForm = () => {
    setEditingOffer(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (offer) => {
    setEditingOffer(offer);
    setForm({
      code: offer.code,
      discount: offer.discount,
      description: offer.description || '',
      active: offer.active !== undefined ? offer.active : true
    });
    setShowForm(true);
  };

  const handleToggleActive = async (offer) => {
    await onUpdateOffer(offer.id, { ...offer, active: !offer.active });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const discountNum = parseInt(form.discount);
    if (isNaN(discountNum) || discountNum <= 0 || discountNum > 100) {
      alert('Please enter a valid discount percentage between 1 and 100.');
      return;
    }
    setIsSubmitting(true);

    const payload = {
      ...form,
      code: form.code.toUpperCase().trim(),
      discount: discountNum
    };

    let success = false;
    if (editingOffer) {
      success = await onUpdateOffer(editingOffer.id, payload);
    } else {
      success = await onAddOffer(payload);
    }

    setIsSubmitting(false);
    if (success) {
      setShowForm(false);
      setEditingOffer(null);
      setForm(emptyForm);
    } else {
      alert('Failed to save coupon offer. Please check server connection.');
    }
  };

  return (
    <div>

      {/* ── Delivery Settings Card ─────────────────────────────────────────── */}
      <div style={{
        backgroundColor: 'var(--bg-cream)',
        border: '2px solid var(--border-color)',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Truck size={20} style={{ color: 'var(--primary)' }} />
          <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--primary-dark)' }}>
            Delivery Settings
          </h4>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Standard Shipping Fee */}
          <div>
            <label className="form-label" style={{ display: 'block', marginBottom: '6px' }}>
              Standard Shipping Fee (₹)
            </label>
            <input
              className="form-control"
              type="number"
              min="0"
              value={deliverySettings.shippingFee}
              onChange={e => setDeliverySettings({ ...deliverySettings, shippingFee: parseInt(e.target.value) || 0 })}
              placeholder="e.g. 40"
            />
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Charged when no free delivery rule applies
            </p>
          </div>

          {/* Free delivery above threshold */}
          <div>
            <label className="form-label" style={{ display: 'block', marginBottom: '6px' }}>
              Free Delivery Above Order Total (₹)
            </label>
            <input
              className="form-control"
              type="number"
              min="0"
              value={deliverySettings.freeDeliveryThreshold}
              onChange={e => setDeliverySettings({ ...deliverySettings, freeDeliveryThreshold: parseInt(e.target.value) || 0 })}
              placeholder="e.g. 500"
            />
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Set to 0 to disable threshold-based free delivery
            </p>
          </div>
        </div>

        {/* Global Free Delivery Campaign Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: deliverySettings.freeDeliveryEnabled ? 'rgba(17,61,38,0.06)' : 'white',
          border: `2px solid ${deliverySettings.freeDeliveryEnabled ? 'var(--primary)' : 'var(--border-color)'}`,
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
          onClick={() => setDeliverySettings({ ...deliverySettings, freeDeliveryEnabled: !deliverySettings.freeDeliveryEnabled })}
        >
          {/* Toggle Switch */}
          <div style={{
            width: '44px',
            height: '24px',
            backgroundColor: deliverySettings.freeDeliveryEnabled ? 'var(--primary)' : '#ccc',
            borderRadius: '12px',
            position: 'relative',
            transition: 'background 0.2s',
            flexShrink: 0
          }}>
            <div style={{
              position: 'absolute',
              top: '3px',
              left: deliverySettings.freeDeliveryEnabled ? '23px' : '3px',
              width: '18px',
              height: '18px',
              backgroundColor: 'white',
              borderRadius: '50%',
              transition: 'left 0.2s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
            }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: deliverySettings.freeDeliveryEnabled ? 'var(--primary-dark)' : 'var(--text-muted)' }}>
              {deliverySettings.freeDeliveryEnabled ? '🚚 FREE DELIVERY CAMPAIGN — ACTIVE' : 'Free Delivery Campaign (Off)'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              When ON, every customer gets free delivery regardless of order value
            </div>
          </div>
        </div>

        {/* Preview */}
        <div style={{
          backgroundColor: 'white',
          border: '1px dashed var(--border-color)',
          borderRadius: '8px',
          padding: '10px 16px',
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '16px'
        }}>
          <strong>📦 Live preview: </strong>
          {deliverySettings.freeDeliveryEnabled
            ? `All orders get FREE delivery (campaign active)`
            : deliverySettings.freeDeliveryThreshold > 0
              ? `Orders above ₹${deliverySettings.freeDeliveryThreshold} → FREE delivery | Below → ₹${deliverySettings.shippingFee} shipping`
              : `Standard shipping: ₹${deliverySettings.shippingFee} on all orders`
          }
        </div>

        <button
          onClick={handleSaveDelivery}
          disabled={deliverySaving}
          className="btn btn-primary"
          style={{ fontSize: '13px', padding: '9px 22px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          {deliverySaved
            ? <><CheckCircle size={15} /> Saved!</>
            : deliverySaving
              ? 'Saving...'
              : <><Save size={15} /> Save Delivery Settings</>
          }
        </button>
      </div>

      {/* ── Coupons Section ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Tag size={22} /> Offers & Coupons Manager
          <span style={{ fontSize: '14px', fontWeight: 600, backgroundColor: 'var(--bg-cream)', padding: '2px 10px', borderRadius: '20px', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
            {offers.length} coupons
          </span>
        </h3>
        <button onClick={openAddForm} className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 18px' }}>
          <Plus size={15} /> Create Coupon
        </button>
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
            {editingOffer ? `✏️ Editing Coupon: ${editingOffer.code}` : '➕ Create New Coupon Code'}
          </h4>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Coupon Code *</label>
                <input className="form-control" required value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="e.g. FESTIVE15" style={{ textTransform: 'uppercase' }} />
              </div>
              <div>
                <label className="form-label">Discount Percentage (%) *</label>
                <input className="form-control" type="number" required min="1" max="100" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} placeholder="e.g. 15" />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Description / Tagline *</label>
              <input className="form-control" required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. Get 15% off on orders above Rs. 500" />
            </div>

            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="active"
                checked={form.active}
                onChange={e => setForm({ ...form, active: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="active" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)', cursor: 'pointer' }}>
                Active & Visible to Customers
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ minWidth: '120px' }}>
                {isSubmitting ? 'Saving...' : (editingOffer ? '💾 Save Changes' : '✅ Create Offer')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      {offers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <Tag size={44} style={{ margin: '0 auto 16px', opacity: 0.25 }} />
          <p style={{ fontWeight: 600, fontSize: '16px' }}>No active coupons listed</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>Click "Create Coupon" to list your first discount offer.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-cream)', borderBottom: '2px solid var(--border-color)' }}>
                {['Coupon Code', 'Discount', 'Description', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {offers.map((o, idx) => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: idx % 2 === 0 ? 'white' : 'var(--bg-cream)' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '15px', color: 'var(--primary)', letterSpacing: '1px' }}>{o.code}</div>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 800, fontSize: '14px', color: '#C62828' }}>
                    {o.discount}% OFF
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>{o.description}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <button
                      onClick={() => handleToggleActive(o)}
                      style={{
                        border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                        backgroundColor: o.active ? '#E8F5E9' : '#FFEBEE',
                        color: o.active ? '#2E7D32' : '#C62828',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      {o.active ? <><CheckCircle size={11} /> Active</> : <><XCircle size={11} /> Inactive</>}
                    </button>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => openEditForm(o)} style={{ border: 'none', background: 'rgba(17,61,38,0.07)', color: 'var(--primary)', cursor: 'pointer', padding: '6px 8px', borderRadius: '6px' }} title="Edit">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => { if (window.confirm(`Delete coupon "${o.code}"?`)) onDeleteOffer(o.id); }} style={{ border: 'none', background: '#FFEBEE', color: '#C62828', cursor: 'pointer', padding: '6px 8px', borderRadius: '6px' }} title="Delete">
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
