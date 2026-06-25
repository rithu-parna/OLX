import React from 'react';
import { X, Eye, MousePointerClick, TrendingUp, Trash2, BarChart3 } from 'lucide-react';

export default function Dashboard({ 
  isOpen, 
  onClose, 
  userListings, 
  onDeleteListing,
  currentUser
}) {
  if (!isOpen) return null;

  // Calculate totals
  const totalViews = userListings.reduce((acc, curr) => acc + (curr.stats?.views || 0), 0);
  const totalClicks = userListings.reduce((acc, curr) => acc + (curr.stats?.clicks || 0), 0);
  const totalOffers = userListings.reduce((acc, curr) => acc + (curr.stats?.offers || 0), 0);

  // Hardcoded chart data for clean visual representation
  const weeklyAnalytics = [
    { day: 'Mon', value: 240, height: '40%' },
    { day: 'Tue', value: 380, height: '65%' },
    { day: 'Wed', value: 310, height: '55%' },
    { day: 'Thu', value: 520, height: '90%' },
    { day: 'Fri', value: 450, height: '78%' },
    { day: 'Sat', value: 290, height: '48%' },
    { day: 'Sun', value: 350, height: '60%' }
  ];

  return (
    <div className="sidebar-drawer-overlay" onClick={onClose}>
      <div className="drawer-container glass-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="drawer-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={20} className="logo-highlight" />
              <h2 className="drawer-title">Seller Hub</h2>
            </div>
            <button className="drawer-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          
          {currentUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 'var(--radius-md)', width: '100%', border: '1px solid var(--border-color)' }}>
              <img src={currentUser.avatar} alt={currentUser.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-primary)' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff' }}>{currentUser.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Member since {currentUser.joined || 'Jun 2026'} • Rating: {currentUser.rating || '5.0'} ★</span>
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="drawer-body">
          {/* Stats Widgets */}
          <div className="dashboard-stats-grid">
            <div className="stat-widget glass-panel">
              <Eye size={20} className="stat-widget-icon" />
              <span className="stat-widget-label">Ad Views</span>
              <span className="stat-widget-val">{totalViews.toLocaleString()}</span>
            </div>
            <div className="stat-widget glass-panel">
              <MousePointerClick size={20} className="stat-widget-icon" style={{ color: 'var(--color-secondary)' }} />
              <span className="stat-widget-label">Clicks</span>
              <span className="stat-widget-val">{totalClicks.toLocaleString()}</span>
            </div>
          </div>

          <div className="dashboard-stats-grid" style={{ gridTemplateColumns: '1fr', marginBottom: '24px' }}>
            <div className="stat-widget glass-panel" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="stat-widget-label">Active Offers</span>
                <span className="stat-widget-val" style={{ color: 'var(--color-accent)' }}>{totalOffers} offers pending</span>
              </div>
              <TrendingUp size={24} style={{ color: 'var(--color-accent)' }} />
            </div>
          </div>

          {/* Performance Chart */}
          <div className="dashboard-chart-box glass-panel">
            <h3 className="chart-title">Weekly Traffic (Views)</h3>
            <div className="chart-bars-container">
              {weeklyAnalytics.map((item, idx) => (
                <div key={idx} className="chart-bar-col">
                  <span className="chart-bar-value">{item.value}</span>
                  <div className="chart-bar-fill" style={{ height: item.height }}></div>
                  <span className="chart-bar-label">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Listings Manager */}
          <div className="dashboard-listings-section">
            <h3 className="dashboard-listings-title">Manage Active Ads</h3>
            
            {userListings.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>
                You have no active listings. Click "SELL" to get started!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {userListings.map((item) => (
                  <div key={item.id} className="dashboard-listing-item glass-panel">
                    <img src={item.images[0]} alt={item.title} className="dashboard-listing-img" />
                    
                    <div className="dashboard-listing-info">
                      <h4 className="dashboard-listing-name">{item.title}</h4>
                      <span className="dashboard-listing-price">${item.price.toLocaleString()}</span>
                      <div className="dashboard-listing-stats">
                        <span>Views: {item.stats?.views || 0}</span>
                        <span>•</span>
                        <span>Clicks: {item.stats?.clicks || 0}</span>
                      </div>
                    </div>

                    <button 
                      className="action-btn"
                      onClick={() => onDeleteListing(item.id)}
                      style={{ 
                        borderColor: 'transparent', 
                        color: 'var(--color-danger)', 
                        background: 'rgba(239, 68, 68, 0.1)',
                        width: '32px',
                        height: '32px'
                      }}
                      title="Delete Listing"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
