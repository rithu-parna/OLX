import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Trophy, Sparkles, Volume2, VolumeX, AlertTriangle, ArrowUp } from 'lucide-react';

const RIVAL_BIDDERS = [
  'GenevaCollector9',
  'MambaRider_911',
  'SterlingAssetMgmt',
  'Goldman_VP',
  'MonacoYachtClub',
  'TokyoMidnight',
  'LondonBrokerage'
];

export default function AuctionArenaModal({ listing, onClose, currentUser }) {
  const [currentBid, setCurrentBid] = useState(listing.price);
  const [highestBidder, setHighestBidder] = useState('Reserve Price Met');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [status, setStatus] = useState('active'); // 'active', 'won', 'lost'
  const [bidHistory, setBidHistory] = useState([
    Math.round(listing.price * 0.85),
    Math.round(listing.price * 0.90),
    Math.round(listing.price * 0.95),
    listing.price
  ]);
  const [bidLog, setBidLog] = useState([
    { bidder: 'House Auctioneer', amount: listing.price, time: '2m ago', type: 'Floor' },
    { bidder: 'GenevaCollector9', amount: Math.round(listing.price * 0.95), time: '3m ago', type: 'Phone' },
    { bidder: 'LondonBrokerage', amount: Math.round(listing.price * 0.90), time: '5m ago', type: 'Online' },
    { bidder: 'House Auctioneer', amount: Math.round(listing.price * 0.85), time: '6m ago', type: 'Floor' }
  ]);
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [announcement, setAnnouncement] = useState('The VIP Auction Arena is live. Place your bid!');
  
  const canvasRef = useRef(null);
  const logEndRef = useRef(null);

  // Timer Countdown Loop
  useEffect(() => {
    if (status !== 'active') return;
    if (timeLeft <= 0) {
      if (highestBidder === 'You (Verified Paddle)') {
        setStatus('won');
        setAnnouncement('🎉 Congratulations! You have won the auction!');
      } else {
        setStatus('lost');
        setAnnouncement(`Sold! The item has been awarded to ${highestBidder}.`);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, status, highestBidder]);

  // AI Rival Bidder Loop
  useEffect(() => {
    if (status !== 'active') return;

    const interval = setInterval(() => {
      // 30% chance for a rival to outbid
      if (Math.random() < 0.35) {
        const increment = Math.round(listing.price * 0.02 + Math.random() * listing.price * 0.03);
        const nextBid = currentBid + increment;
        const rival = RIVAL_BIDDERS[Math.floor(Math.random() * RIVAL_BIDDERS.length)];
        const types = ['Floor Paddle', 'Phone Bidder', 'VIP Online'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        setCurrentBid(nextBid);
        setHighestBidder(rival);
        setBidHistory(prev => [...prev, nextBid]);
        setBidLog(prev => [
          { bidder: rival, amount: nextBid, time: 'Just now', type },
          ...prev
        ]);
        
        setAnnouncement(`Rival bidder ${rival} placed a bid for $${nextBid.toLocaleString()}!`);
        
        // Anti-sniping: Add 15s if timer is under 20s
        if (timeLeft < 20) {
          setTimeLeft(prev => prev + 15);
          setAnnouncement('Bid received! Anti-sniping activated: Time extended +15s.');
        }
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [currentBid, timeLeft, status, listing.price]);

  // Draw Glowing Bidding Trend Sparkline on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set scale for high DPI
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 30) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    if (bidHistory.length < 2) return;

    const minVal = bidHistory[0];
    const maxVal = Math.max(...bidHistory, currentBid) * 1.05;
    const valRange = maxVal - minVal;

    // Drawing Gradient Area Fill under the line
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(20, 184, 166, 0.15)');
    gradient.addColorStop(1, 'rgba(20, 184, 166, 0.0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    bidHistory.forEach((val, idx) => {
      const x = (idx / (bidHistory.length - 1)) * (canvas.width - 40) + 20;
      const y = canvas.height - ((val - minVal) / valRange) * (canvas.height - 40) - 20;
      if (idx === 0) {
        ctx.moveTo(x, canvas.height);
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      if (idx === bidHistory.length - 1) {
        ctx.lineTo(x, canvas.height);
      }
    });
    ctx.closePath();
    ctx.fill();

    // Drawing the Line
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(20, 184, 166, 0.5)';
    ctx.strokeStyle = '#14b8a6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    bidHistory.forEach((val, idx) => {
      const x = (idx / (bidHistory.length - 1)) * (canvas.width - 40) + 20;
      const y = canvas.height - ((val - minVal) / valRange) * (canvas.height - 40) - 20;
      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow

    // Data points dots
    bidHistory.forEach((val, idx) => {
      const x = (idx / (bidHistory.length - 1)) * (canvas.width - 40) + 20;
      const y = canvas.height - ((val - minVal) / valRange) * (canvas.height - 40) - 20;
      ctx.fillStyle = '#14b8a6';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [bidHistory, currentBid]);

  const handleUserBid = (increment) => {
    if (!currentUser) {
      alert("Please sign in to place an official bid.");
      return;
    }
    if (status !== 'active') return;

    const nextBid = currentBid + increment;
    setCurrentBid(nextBid);
    setHighestBidder('You (Verified Paddle)');
    setBidHistory(prev => [...prev, nextBid]);
    setBidLog(prev => [
      { bidder: 'You (Verified Paddle)', amount: nextBid, time: 'Just now', type: 'Online' },
      ...prev
    ]);
    
    setAnnouncement(`You have placed a high bid of $${nextBid.toLocaleString()}!`);
    
    // Extend time if close to end
    if (timeLeft < 25) {
      setTimeLeft(prev => prev + 15);
      setAnnouncement('Bid received! Time extended +15s (Anti-sniping).');
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="login-modal-overlay" style={{ background: 'rgba(5, 7, 12, 0.96)', zIndex: 999 }}>
      
      {/* Outer Modal Container */}
      <motion.div
        className="threesixty-card glass-panel"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid rgba(20, 184, 166, 0.25)',
          background: 'rgba(10, 15, 30, 0.92)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(20, 184, 166, 0.15)', background: 'rgba(10, 15, 30, 0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>👑</span>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', letterSpacing: '0.5px' }}>VIP LIVE AUCTION ARENA</h2>
              <span style={{ fontSize: '12px', color: 'var(--color-primary-light)' }}>Secure Escrow-Backed Luxury Bidding</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button className="login-close-btn" onClick={onClose} style={{ position: 'static' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Live Announcement Banner */}
        <div style={{ padding: '8px 24px', background: 'rgba(20, 184, 166, 0.08)', borderBottom: '1px solid rgba(20, 184, 166, 0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={14} className="logo-highlight" />
          <span style={{ fontSize: '11px', color: '#fff', fontWeight: 600 }}>{announcement}</span>
        </div>

        {/* Main Grid Content */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', overflow: 'hidden' }} className="mobile-grid-single-col">
          
          {/* Left Panel: Media Preview & Graph */}
          <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255, 255, 255, 0.05)', padding: '20px', gap: '16px', overflowY: 'auto' }}>
            
            {/* Asset card summary */}
            <div style={{ display: 'flex', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <img src={listing.images[0]} alt="" style={{ width: '90px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{listing.title}</h3>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '11px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Condition:</span>
                  <span style={{ color: 'var(--color-primary-light)' }}>{listing.condition}</span>
                  <span style={{ color: 'var(--text-muted)' }}>| Location:</span>
                  <span style={{ color: '#fff' }}>{listing.location.split(',')[0]}</span>
                </div>
              </div>
            </div>

            {/* Price HUD Display */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(20, 184, 166, 0.1)', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current High Bid</span>
                <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--color-primary)', marginTop: '4px' }}>
                  ${currentBid.toLocaleString()}
                </div>
                <span style={{ fontSize: '10px', color: '#fff', opacity: 0.7 }}>by {highestBidder}</span>
              </div>

              <div style={{ 
                background: timeLeft < 30 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(15, 23, 42, 0.5)', 
                padding: '16px', 
                borderRadius: '12px', 
                border: timeLeft < 30 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255,255,255,0.05)', 
                textAlign: 'center' 
              }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time Remaining</span>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: 900, 
                  color: timeLeft < 30 ? 'var(--color-danger)' : '#fff', 
                  marginTop: '4px',
                  fontFamily: 'monospace'
                }}>
                  {formatTime(timeLeft)}
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Extended on late bids</span>
              </div>
            </div>

            {/* Sparkline Canvas Chart */}
            <div style={{ flex: 1, minHeight: '180px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bidding Valuation Curve</span>
              <div style={{ flex: 1, background: '#070a13', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', position: 'relative' }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
              </div>
            </div>

          </div>

          {/* Right Panel: Interactive Controls & Log */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', gap: '16px', overflowY: 'auto' }}>
            
            {/* Bid increments section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Raise Paddle / Quick Bids</span>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <button 
                  onClick={() => handleUserBid(Math.round(listing.price * 0.01))}
                  className="sell-publish-btn"
                  style={{ height: '42px', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}
                  disabled={status !== 'active'}
                >
                  <span style={{ fontWeight: 800 }}>+{ (Math.round(listing.price * 0.01)).toLocaleString() }</span>
                  <span style={{ fontSize: '9px', opacity: 0.8 }}>Min bid</span>
                </button>

                <button 
                  onClick={() => handleUserBid(Math.round(listing.price * 0.03))}
                  className="sell-publish-btn"
                  style={{ height: '42px', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', background: 'var(--color-primary-hover)' }}
                  disabled={status !== 'active'}
                >
                  <span style={{ fontWeight: 800 }}>+{ (Math.round(listing.price * 0.03)).toLocaleString() }</span>
                  <span style={{ fontSize: '9px', opacity: 0.8 }}>Medium bid</span>
                </button>

                <button 
                  onClick={() => handleUserBid(Math.round(listing.price * 0.07))}
                  className="sell-publish-btn"
                  style={{ height: '42px', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', background: 'var(--color-secondary)' }}
                  disabled={status !== 'active'}
                >
                  <span style={{ fontWeight: 800 }}>+{ (Math.round(listing.price * 0.07)).toLocaleString() }</span>
                  <span style={{ fontSize: '9px', opacity: 0.8 }}>Aggressive</span>
                </button>
              </div>
            </div>

            {/* Bidding stream timeline log */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '200px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Live Bidding Log</span>
              
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px' }}>
                <AnimatePresence>
                  {bidLog.map((log, idx) => {
                    const isUser = log.bidder.includes('You');
                    return (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          background: isUser ? 'rgba(20, 184, 166, 0.08)' : 'rgba(255,255,255,0.02)',
                          borderRadius: '8px',
                          border: isUser ? '1px solid rgba(20, 184, 166, 0.2)' : '1px solid rgba(255,255,255,0.03)'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: isUser ? 'var(--color-primary)' : '#fff' }}>
                            {log.bidder}
                          </span>
                          <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                            Via {log.type} • {log.time}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 900, color: isUser ? 'var(--color-primary)' : '#fff' }}>
                          ${log.amount.toLocaleString()}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div ref={logEndRef} />
              </div>
            </div>

            {/* Security Notice */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: 'rgba(20,184,166,0.05)', borderRadius: '8px', border: '1px solid rgba(20,184,166,0.1)' }}>
              <ShieldCheck size={16} className="logo-highlight" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                All bids are binding. High bidders agree to deposit collateral into our verified Escrow Protection account within 2 hours of auction close.
              </span>
            </div>

          </div>

        </div>

        {/* Modal Footer Checkouts */}
        <AnimatePresence>
          {status === 'won' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              style={{
                background: 'rgba(20, 184, 166, 0.15)',
                borderTop: '1px solid rgba(20, 184, 166, 0.3)',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'center',
                zIndex: 20
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={24} className="logo-highlight" />
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>AUCTION WON!</h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '500px' }}>
                Your bid of <strong style={{ color: 'var(--color-primary-light)' }}>${currentBid.toLocaleString()}</strong> has won this asset. Click below to secure the item in escrow.
              </p>
              <button 
                onClick={() => {
                  alert(`Secured deal of $${currentBid.toLocaleString()} in escrow! We will contact you soon.`);
                  onClose();
                }}
                className="sell-publish-btn"
                style={{ padding: '10px 30px', width: 'auto', fontSize: '13px' }}
              >
                Secure in Escrow & Pay Deposit
              </button>
            </motion.div>
          )}

          {status === 'lost' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                borderTop: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'center',
                zIndex: 20
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={24} style={{ color: 'var(--color-danger)' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>AUCTION CLOSED</h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '500px' }}>
                This auction has closed. The winning bid was <strong style={{ color: 'var(--color-danger)' }}>${currentBid.toLocaleString()}</strong> by {highestBidder}.
              </p>
              <button 
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  padding: '8px 24px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Close Arena
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
