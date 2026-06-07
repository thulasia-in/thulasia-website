import React from 'react';
import { TrendingUp, ShoppingCart, Package, BarChart2 } from 'lucide-react';

export default function Analytics({ products, orders }) {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const activeProducts = products.filter(p => p.inStock).length;

  // Sales by product
  const salesMap = {};
  products.forEach(p => { salesMap[p.name] = 0; });
  orders.forEach(o => {
    (o.items || []).forEach(item => {
      if (salesMap[item.name] !== undefined) {
        salesMap[item.name] += (item.price || 0) * (item.quantity || 1);
      } else {
        salesMap[item.name] = (item.price || 0) * (item.quantity || 1);
      }
    });
  });
  const chartData = Object.entries(salesMap).map(([name, val]) => ({ name, val }))
    .sort((a, b) => b.val - a.val);
  const maxVal = Math.max(...chartData.map(d => d.val), 1);

  // Orders by status
  const pending = orders.filter(o => o.status === 'Pending').length;
  const shipped = orders.filter(o => o.status === 'Shipped').length;
  const delivered = orders.filter(o => o.status === 'Delivered').length;

  const kpis = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: '#113d26' },
    { label: 'Total Orders', value: totalOrders, icon: ShoppingCart, color: '#b48548' },
    { label: 'Avg Order Value', value: `₹${avgOrderValue}`, icon: BarChart2, color: '#1c5737' },
    { label: 'Active Products', value: activeProducts, icon: Package, color: '#8e622e' },
  ];

  return (
    <div>
      <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <TrendingUp size={22} /> Sales Performance
      </h3>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{
            backgroundColor: 'var(--bg-cream)',
            padding: '24px 20px',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: '70px', height: '70px',
              background: `${kpi.color}08`,
              borderRadius: '0 0 0 100%'
            }} />
            <kpi.icon size={18} style={{ color: kpi.color, marginBottom: '10px' }} />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: kpi.color, marginTop: '4px' }}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Order Status Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '36px' }}>
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--primary-dark)' }}>Order Status Breakdown</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Pending', count: pending, color: '#E65100', bg: '#FFF3E0' },
              { label: 'Shipped', count: shipped, color: '#1565C0', bg: '#E3F2FD' },
              { label: 'Delivered', count: delivered, color: '#2E7D32', bg: '#E8F5E9' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', backgroundColor: s.bg }}>
                <span style={{ fontWeight: 700, fontSize: '20px', color: s.color, minWidth: '32px' }}>{s.count}</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: s.color }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Sales Bar Chart */}
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--primary-dark)' }}>Revenue by Product</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chartData.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No sales data yet.</p>
            ) : chartData.map((d, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                  <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{d.name}</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{d.val}</span>
                </div>
                <div style={{ height: '10px', backgroundColor: 'rgba(17,61,38,0.07)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.round((d.val / maxVal) * 100)}%`,
                    background: 'linear-gradient(90deg, var(--primary), var(--primary-light))',
                    borderRadius: '5px',
                    transition: 'width 0.6s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
