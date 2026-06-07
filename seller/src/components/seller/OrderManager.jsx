import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { ShoppingCart, Trash, FileDown, RefreshCw, Search } from 'lucide-react';

export default function OrderManager({ orders, onUpdateOrderStatus, onDeleteOrder, onRefresh }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = orders.filter(o => {
    const matchSearch = !search ||
      (o.orderId || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.phone || '').includes(search);
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Export all orders to Excel
  const exportToExcel = () => {
    if (orders.length === 0) {
      alert('No orders to export.');
      return;
    }

    const rows = orders.map(o => ({
      'Order ID': o.orderId || '',
      'Date': o.date || '',
      'Time': o.time || '',
      'Customer Name': o.customerName || '',
      'Phone': o.phone || '',
      'Email': o.email || '',
      'Delivery Address': o.address || '',
      'Items': (o.items || []).map(i => `${i.name} x${i.quantity}`).join('; '),
      'Item Count': (o.items || []).reduce((s, i) => s + (i.quantity || 1), 0),
      'Subtotal (₹)': o.subtotal || 0,
      'GST (₹)': o.gst || 0,
      'Shipping (₹)': o.shipping || 0,
      'Total Paid (₹)': o.total || 0,
      'Payment Method': o.paymentMethod || '',
      'Razorpay Payment ID': o.razorpayId || '',
      'Status': o.status || 'Pending',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);

    // Auto-size columns
    const colWidths = Object.keys(rows[0] || {}).map(key => ({
      wch: Math.max(key.length, ...rows.map(r => String(r[key] || '').length)) + 2
    }));
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    const fileName = `Thulasia_Orders_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const statusColor = (status) => {
    if (status === 'Delivered') return { bg: '#E8F5E9', color: '#2E7D32' };
    if (status === 'Shipped') return { bg: '#E3F2FD', color: '#1565C0' };
    return { bg: '#FFF3E0', color: '#E65100' };
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShoppingCart size={22} /> Customer Orders
          <span style={{ fontSize: '14px', fontWeight: 600, backgroundColor: 'var(--bg-cream)', padding: '2px 10px', borderRadius: '20px', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
            {orders.length} total
          </span>
        </h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={onRefresh} className="btn btn-secondary" style={{ fontSize: '13px', padding: '8px 14px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={exportToExcel} className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 18px', backgroundColor: '#1a6b3a' }}>
            <FileDown size={15} /> Export to Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by Order ID, customer name, or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '34px', fontSize: '13px' }}
          />
        </div>
        {['All', 'Pending', 'Shipped', 'Delivered'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              backgroundColor: statusFilter === s ? 'var(--primary)' : 'var(--bg-white)',
              color: statusFilter === s ? 'white' : 'var(--text-dark)',
              transition: 'all 0.2s'
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <ShoppingCart size={44} style={{ margin: '0 auto 16px', opacity: 0.25 }} />
          <p style={{ fontSize: '16px', fontWeight: 600 }}>No orders found</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>Orders placed by customers will appear here.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-cream)', borderBottom: '2px solid var(--border-color)' }}>
                {['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Payment ID', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, idx) => {
                const sc = statusColor(order.status);
                return (
                  <tr key={order.orderId} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: idx % 2 === 0 ? 'white' : 'var(--bg-cream)', transition: 'background 0.15s' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>{order.orderId}</td>
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 600 }}>{order.date}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.time}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.phone}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.address}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {(order.items || []).map(item => (
                        <div key={item.id} style={{ fontSize: '12px' }}>
                          {item.name} <span style={{ color: 'var(--text-muted)' }}>×{item.quantity}</span>
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--primary)', whiteSpace: 'nowrap' }}>₹{order.total}</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {order.razorpayId || '—'}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <select
                        value={order.status}
                        onChange={e => onUpdateOrderStatus(order.orderId, e.target.value)}
                        style={{
                          padding: '5px 8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          borderRadius: '6px',
                          border: `1px solid ${sc.color}40`,
                          backgroundColor: sc.bg,
                          color: sc.color,
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete order ${order.orderId}?`)) onDeleteOrder(order.orderId);
                        }}
                        style={{ border: 'none', background: 'none', color: '#C5221F', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                        title="Delete Order"
                      >
                        <Trash size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Export info */}
      {orders.length > 0 && (
        <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FileDown size={13} />
          Export downloads all <strong>{orders.length}</strong> orders as an Excel spreadsheet (.xlsx) with full details including payment IDs, addresses, and item breakdowns.
        </div>
      )}
    </div>
  );
}
