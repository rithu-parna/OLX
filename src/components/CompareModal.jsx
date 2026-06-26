import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale, ArrowRight, Star, MapPin, CheckCircle } from 'lucide-react';

export default function CompareModal({ isOpen, onClose, compareListings, onRemove, onSelectListing }) {
  if (!isOpen) return null;

  // Find cheapest item
  const prices = compareListings.map(item => item.price);
  const minPrice = Math.min(...prices);

  // Extract all unique specs keys across compared items
  const allSpecKeys = Array.from(
    new Set(
      compareListings.flatMap(item => Object.keys(item.specs || {}))
    )
  );

  return (
    <div className="login-modal-overlay" style={{ background: 'rgba(5, 7, 12, 0.94)' }}>
      <motion.div 
        className="compare-modal-card glass-panel"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        style={{
          width: '95%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-color)', background: 'rgba(15, 22, 38, 0.5)', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Scale className="logo-highlight" size={20} />
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>Luxury Asset Comparison</h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Side-by-side premium specs matching</span>
            </div>
          </div>
          <button className="login-close-btn" onClick={onClose} style={{ position: 'static' }}>
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Table Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compareListings.length + 1}, 1fr)`, gap: '16px', minWidth: '700px' }}>
            
            {/* Column 1: Labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '200px' }}>
              <div style={{ height: '40px', display: 'flex', alignItems: 'center', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase' }}>Price</div>
              <div style={{ height: '30px', display: 'flex', alignItems: 'center', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase' }}>Category</div>
              <div style={{ height: '30px', display: 'flex', alignItems: 'center', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase' }}>Condition</div>
              <div style={{ height: '30px', display: 'flex', alignItems: 'center', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase' }}>Location</div>
              <div style={{ height: '30px', display: 'flex', alignItems: 'center', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase' }}>Seller</div>
              <div style={{ height: '30px', display: 'flex', alignItems: 'center', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase' }}>Trust Score</div>
              
              {/* Dynamic Specs Labels */}
              {allSpecKeys.map(key => (
                <div key={key} style={{ height: '30px', display: 'flex', alignItems: 'center', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase' }}>{key}</div>
              ))}
            </div>

            {/* Compared Listings Columns */}
            {compareListings.map(item => {
              const isCheapest = item.price === minPrice && compareListings.length > 1;
              return (
                <div key={item.id} className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => onRemove(item.id)}
                    style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justify: 'center', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <X size={14} />
                  </button>

                  {/* Header Photo & Title */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '170px' }}>
                    <img 
                      src={item.images[0]} 
                      alt="" 
                      style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#fff', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.3' }}>
                      {item.title}
                    </h3>
                  </div>

                  {/* Price */}
                  <div style={{ height: '40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 900, color: 'var(--color-primary)' }}>
                      ${item.price.toLocaleString()}
                    </span>
                    {isCheapest && (
                      <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        BEST VALUE
                      </span>
                    )}
                  </div>

                  {/* Category */}
                  <div style={{ height: '30px', display: 'flex', alignItems: 'center', fontSize: '13px', color: '#fff', textTransform: 'capitalize' }}>
                    {item.category}
                  </div>

                  {/* Condition */}
                  <div style={{ height: '30px', display: 'flex', alignItems: 'center', fontSize: '13px', color: '#fff' }}>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                      {item.condition}
                    </span>
                  </div>

                  {/* Location */}
                  <div style={{ height: '30px', display: 'flex', alignItems: 'center', fontSize: '13px', color: 'var(--text-secondary)', gap: '4px' }}>
                    <MapPin size={12} className="logo-highlight" />
                    <span>{item.location.split(',')[0]}</span>
                  </div>

                  {/* Seller Name */}
                  <div style={{ height: '30px', display: 'flex', alignItems: 'center', fontSize: '13px', color: '#fff', gap: '6px' }}>
                    <img src={item.seller.avatar} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                    <span style={{ fontWeight: 600 }}>{item.seller.name.split(' ')[0]}</span>
                  </div>

                  {/* Rating */}
                  <div style={{ height: '30px', display: 'flex', alignItems: 'center', fontSize: '13px', color: '#fff', gap: '4px' }}>
                    <Star size={12} fill="var(--color-warning)" stroke="var(--color-warning)" />
                    <span>{item.seller.rating || '4.9'} / 5.0</span>
                  </div>

                  {/* Dynamic Specs Values */}
                  {allSpecKeys.map(key => {
                    const value = item.specs?.[key] || '—';
                    return (
                      <div key={key} style={{ height: '30px', display: 'flex', alignItems: 'center', fontSize: '13px', color: value === '—' ? 'var(--text-muted)' : '#fff' }}>
                        {value}
                      </div>
                    );
                  })}

                  {/* View Details Button */}
                  <button 
                    onClick={() => {
                      onSelectListing(item);
                      onClose();
                    }}
                    style={{
                      marginTop: '12px',
                      background: 'var(--color-primary)',
                      border: 'none',
                      color: '#fff',
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      transition: 'opacity 0.2s'
                    }}
                  >
                    <span>Inspect Asset</span>
                    <ArrowRight size={14} />
                  </button>

                </div>
              );
            })}

          </div>
        </div>

      </motion.div>
    </div>
  );
}
