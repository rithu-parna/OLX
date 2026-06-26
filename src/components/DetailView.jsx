import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Share, Play, MapPin, Star, ShieldCheck, Camera, Activity, ArrowRight, ChevronLeft, ChevronRight, MessageSquare, Phone, Sparkles } from 'lucide-react';
import ThreeSixtyModal from './ThreeSixtyModal';
import ARModal from './ARModal';

export default function DetailView({ 
  listing, 
  onClose, 
  onSendChatMessage, 
  listings, 
  onSelectListing,
  currentUser,
  onOpenLogin,
  isSaved,
  onToggleSave
}) {
  const [activeMediaTab, setActiveMediaTab] = useState('image'); // 'image' or 'video'
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [bidValue, setBidValue] = useState(listing.price);
  
  const [showThreeSixty, setShowThreeSixty] = useState(false);
  const [showAR, setShowAR] = useState(false);

  // Chat States & AI Price Negotiator
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSellerAsk, setCurrentSellerAsk] = useState(listing.price);
  const [negotiationPhase, setNegotiationPhase] = useState('initial'); // 'initial', 'negotiating', 'agreed', 'locked'
  const chatBodyRef = useRef(null);

  // Sync bid value and reset AI negotiator on listing change
  useEffect(() => {
    setBidValue(listing.price);
    setCurrentSellerAsk(listing.price);
    setNegotiationPhase('initial');
    setActiveImgIndex(0);
    setActiveMediaTab('image');
    setMessages([
      { 
        sender: 'seller', 
        text: `Hi there! I am the automated smart negotiator representing the seller of this ${listing.title}. My asking price is $${listing.price.toLocaleString()}. Feel free to type questions, appraise the asset, or submit your offer!`, 
        time: 'Just now' 
      }
    ]);
  }, [listing]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handlePresetBid = (percentage) => {
    const calculated = Math.round(listing.price * (1 + percentage));
    setBidValue(calculated);
  };

  const handleNegotiateOffer = (userOffer) => {
    if (!currentUser) {
      onOpenLogin();
      return;
    }

    const minAcceptable = Math.round(listing.price * 0.90); // 10% discount cap
    const absoluteLimit = Math.round(listing.price * 0.82); // 18% hard cap

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      if (userOffer >= currentSellerAsk) {
        setNegotiationPhase('agreed');
        setMessages(prev => [
          ...prev,
          { 
            sender: 'seller', 
            text: `🎉 That is a fair offer of $${userOffer.toLocaleString()}! We have a deal. Please click "Accept & Lock-in Deal" below to secure this asset in escrow.`, 
            time: 'Just now' 
          }
        ]);
      } else if (userOffer >= minAcceptable) {
        setNegotiationPhase('agreed');
        setCurrentSellerAsk(userOffer);
        setMessages(prev => [
          ...prev,
          { 
            sender: 'seller', 
            text: `I've appraised your offer, and I can accept $${userOffer.toLocaleString()}! Let's lock this in. Please click "Accept & Lock-in Deal" below to finalize.`, 
            time: 'Just now' 
          }
        ]);
      } else if (userOffer >= absoluteLimit) {
        const counter = Math.round((currentSellerAsk + userOffer) / 2);
        setCurrentSellerAsk(counter);
        setNegotiationPhase('negotiating');
        setMessages(prev => [
          ...prev,
          { 
            sender: 'seller', 
            text: `That's a bit lower than expected. The absolute lowest we can go right now is $${counter.toLocaleString()}. What do you think about meeting in the middle?`, 
            time: 'Just now' 
          }
        ]);
      } else {
        const counter = Math.round(currentSellerAsk * 0.95);
        setCurrentSellerAsk(counter);
        setNegotiationPhase('negotiating');
        setMessages(prev => [
          ...prev,
          { 
            sender: 'seller', 
            text: `I'm afraid $${userOffer.toLocaleString()} is a bit too low for a verified asset in ${listing.condition} condition. How about we look at $${counter.toLocaleString()}?`, 
            time: 'Just now' 
          }
        ]);
      }
    }, 1200);
  };

  const handleSendOffer = () => {
    if (!currentUser) {
      onOpenLogin();
      return;
    }
    const offerMessage = `Hello, I would like to submit an offer of $${bidValue.toLocaleString()} for this item. Is this acceptable?`;

    // Add user message
    const userMsg = { sender: 'user', text: offerMessage, time: 'Just now' };
    setMessages(prev => [...prev, userMsg]);

    if (onSendChatMessage) {
      onSendChatMessage(listing.id, offerMessage);
    }
    handleNegotiateOffer(bidValue);
  };

  const handleSendText = (e) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenLogin();
      return;
    }
    if (!newMsg.trim()) return;

    // Check if the message contains a numeric price value
    const cleanedMsg = newMsg.replace(/,/g, '');
    const priceMatch = cleanedMsg.match(/\$?(\d+)/);
    
    const userMsg = { sender: 'user', text: newMsg, time: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    setNewMsg('');

    if (priceMatch && priceMatch[1]) {
      const offeredAmt = parseInt(priceMatch[1]);
      if (offeredAmt > 100 && offeredAmt < listing.price * 2) {
        handleNegotiateOffer(offeredAmt);
        return;
      }
    }

    // Default chat replies based on keywords
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const text = userMsg.text.toLowerCase();
      let reply = `I'm here to help negotiate. The current counter-offer is $${currentSellerAsk.toLocaleString()}. Would you like to submit a bid?`;
      
      if (text.includes('condition') || text.includes('new') || text.includes('clean')) {
        reply = `The item is in verified ${listing.condition} condition. It includes all matching papers, credentials, and has passed full authenticity checks.`;
      } else if (text.includes('lowest') || text.includes('best price') || text.includes('discount')) {
        reply = `My best available price is $${currentSellerAsk.toLocaleString()}. I can negotiate slightly if you make a counter-offer right now.`;
      } else if (text.includes('shipping') || text.includes('delivery')) {
        reply = `We provide insured overnight shipping with real-time GPS tracking. Escrow protection covers all damage checks before you approve payment.`;
      }
      
      setMessages(prev => [
        ...prev,
        { sender: 'seller', text: reply, time: 'Just now' }
      ]);
    }, 1200);
  };

  // Related items
  const relatedListings = listings
    ? listings.filter(item => item.id !== listing.id).slice(0, 5)
    : [];

  const getSpecIcon = (key) => {
    const k = key.toLowerCase();
    if (k.includes('camera') || k.includes('lens')) return <Camera size={16} />;
    if (k.includes('flight') || k.includes('time') || k.includes('battery') || k.includes('engine') || k.includes('speed')) return <Activity size={16} />;
    if (k.includes('video') || k.includes('resolution') || k.includes('screen') || k.includes('model')) return <Play size={16} />;
    return <ArrowRight size={16} />;
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
      <div className="detail-modal-container glass-panel" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="detail-modal-header">
          <div className="detail-modal-header-left">
            <button className="close-x-btn" onClick={onClose} aria-label="Close dialog">
              <X size={16} />
            </button>
            <span className="header-title">Product Details</span>
          </div>
          <div className="detail-modal-header-right">
            <span className="item-id-label">ID: #{listing.id}109</span>
            <button 
              className={`header-save-btn ${isSaved ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (!currentUser) {
                  onOpenLogin();
                  return;
                }
                onToggleSave(listing.id);
              }}
              style={{
                background: isSaved ? 'rgba(239, 68, 68, 0.1)' : '',
                borderColor: isSaved ? 'rgba(239, 68, 68, 0.3)' : '',
                color: isSaved ? 'var(--color-danger)' : ''
              }}
            >
              <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button className="header-share-btn">
              <Share size={14} />
            </button>
            <button className="close-x-btn" onClick={onClose} aria-label="Close dialog">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Two-Column Grid Area */}
        <div className="detail-grid-layout">

          {/* Left Panel: Media Viewport, Badges & AI Pricing Insight */}
          <div className="detail-left-column">

            <div className="media-section-row">
              {/* Vertical Thumbnail Strip */}
              <div className="vertical-thumbnails-strip">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`vertical-thumb-btn ${idx === activeImgIndex ? 'active' : ''}`}
                    onClick={() => {
                      setActiveImgIndex(idx);
                      setActiveMediaTab('image');
                    }}
                  >
                    <img src={img} alt="" className="vertical-thumb-img" />
                  </button>
                ))}
                {listing.images.length > 3 && (
                  <div className="more-photos-badge">
                    <span className="more-photos-text">+{listing.images.length + 8}</span>
                    <span className="more-photos-sub">Photos</span>
                  </div>
                )}
              </div>

              {/* Main Viewport */}
              <div className="main-media-viewport">
                {/* Overlay Badges (Top Left) */}
                <div className="viewport-overlay-badges">
                  <span className="viewport-badge trending"><span className="badge-dot">🔥</span> Trending</span>
                  <span className="viewport-badge verified"><span className="badge-dot">🟢</span> Verified</span>
                  <span className="viewport-badge premium"><span className="badge-dot">⭐</span> Premium Seller</span>
                </div>

                {/* Main Media Content */}
                <div className="viewport-media-wrapper">
                  {activeMediaTab === 'image' ? (
                    <img
                      src={listing.images[activeImgIndex]}
                      alt={listing.title}
                      className="viewport-media-img"
                    />
                  ) : (
                    <video
                      src={listing.video}
                      className="viewport-media-video"
                      controls
                      autoPlay
                      muted
                      loop
                    />
                  )}
                </div>

                {/* Media Control Overlays (Bottom Center) */}
                <div className="viewport-media-controls">
                  <button className="viewport-control-btn" onClick={() => setShowThreeSixty(true)}>
                    <span>🔄 360° View</span>
                  </button>
                  <button className="viewport-control-btn" onClick={() => setShowAR(true)}>
                    <span>📐 AR Preview</span>
                  </button>
                  {listing.video && (
                    <button
                      className={`viewport-control-btn ${activeMediaTab === 'video' ? 'active' : ''}`}
                      onClick={() => setActiveMediaTab(activeMediaTab === 'video' ? 'image' : 'video')}
                    >
                      <span>▶️ Play Video</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* AI Pricing Insight Banner */}
            <div className="ai-pricing-insight-card">
              <div className="ai-insight-left">
                <div className="ai-avatar-pulse">
                  <Sparkles size={18} className="ai-spark-icon" />
                </div>
                <div className="ai-insight-text">
                  <h4 className="ai-insight-title">AI Pricing Insight</h4>
                  <p className="ai-insight-desc">
                    This item is priced 8% below the current market average. Great time to buy! 🔥
                  </p>
                </div>
              </div>
              <div className="ai-insight-right">
                <div className="market-stat">
                  <span className="stat-label">Market Average</span>
                  <span className="stat-val">${Math.round(listing.price * 1.09).toLocaleString()}</span>
                </div>
                <div className="market-stat">
                  <span className="stat-label">You Save</span>
                  <span className="stat-val highlight">${Math.round(listing.price * 0.09).toLocaleString()} (8%)</span>
                </div>
                {/* SVG Sparkline */}
                <div className="ai-sparkline-svg">
                  <svg viewBox="0 0 60 20" width="60" height="20">
                    <path d="M 0 15 Q 15 5, 30 12 T 60 2" fill="none" stroke="#14b8a6" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* RELATED ITEMS CAROUSEL */}
            <div className="related-items-section">
              <h3 className="section-title-label">You May Also Like</h3>
              <div className="related-items-carousel">
                {relatedListings.map((item) => (
                  <div
                    key={item.id}
                    className="related-item-card glass-panel"
                    onClick={() => {
                      if (onSelectListing) onSelectListing(item);
                    }}
                  >
                    <div className="related-card-media">
                      <img src={item.images[0]} alt={item.title} className="related-card-img" />
                      <span className="related-card-price">${item.price.toLocaleString()}</span>
                    </div>
                    <div className="related-card-info">
                      <h4 className="related-card-title">{item.title}</h4>
                      <div className="related-card-meta">
                        <MapPin size={10} />
                        <span>{item.location.split(',')[0]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Panel: Title, Bidding, Seller info, Specs */}
          <div className="detail-right-column">

            {/* Title & Condition */}
            <div className="title-section-block">
              <div className="title-row-container">
                <h2 className="product-main-title">{listing.title}</h2>
                <span className="product-condition-badge">🟢 {listing.condition}</span>
              </div>
              <div className="product-meta-row">
                <span className="meta-item">📍 {listing.location}</span>
                <span className="meta-item">⏰ {listing.postedDate}</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="pricing-section-block">
              <div className="pricing-left">
                <span className="pricing-main-value">${listing.price.toLocaleString()}</span>
                <div className="pricing-savings-row">
                  <span className="market-value-label">Market Value ${Math.round(listing.price * 1.12).toLocaleString()}</span>
                  <span className="save-amount-badge">Save ${Math.round(listing.price * 0.12).toLocaleString()} (11%)</span>
                </div>
              </div>

              <div className="pricing-trend-box">
                <div className="pricing-trend-info">
                  <span className="trend-title">Price Trend</span>
                  <span className="trend-desc">⬇️ 11% vs last 30 days</span>
                </div>
                <div className="trend-sparkline-svg">
                  <svg viewBox="0 0 50 20" width="50" height="20">
                    <path d="M 0 5 L 15 12 L 30 8 L 50 18" fill="none" stroke="#ef4444" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Make an Offer Section */}
            <div className="offer-section-block glass-panel">
              <div className="offer-header-row">
                <h4 className="offer-panel-title">Make an Offer</h4>
                <span className="recommended-price-label">Recommended Price: ${Math.round(listing.price * 0.95).toLocaleString()}</span>
              </div>

              {/* Offer input */}
              <div className="offer-input-container">
                <span className="offer-currency-symbol">$</span>
                <input
                  type="text"
                  className="offer-input-field"
                  value={bidValue.toLocaleString()}
                  onChange={(e) => setBidValue(Number(e.target.value.replace(/,/g, '')) || 0)}
                />
              </div>

              {/* Presets */}
              <div className="offer-presets-row">
                <button className="offer-preset-btn" onClick={() => handlePresetBid(-0.1)}>-10%</button>
                <button className="offer-preset-btn" onClick={() => handlePresetBid(-0.05)}>-5%</button>
                <button className="offer-preset-btn" onClick={() => setBidValue(listing.price)}>Ask Price</button>
                <button className="offer-preset-btn" onClick={() => handlePresetBid(0.05)}>+5%</button>
              </div>

              {/* Actions */}
              <div className="offer-actions-row">
                <button className="offer-submit-btn" onClick={handleSendOffer}>
                  Submit Offer
                </button>
                <button className="offer-buynow-btn" onClick={handleSendOffer}>
                  ⚡ Buy Now
                </button>
              </div>

              {/* Guarantee items */}
              <div className="offer-guarantees-grid">
                <div className="guarantee-item">
                  <span className="guarantee-icon">🛡️</span>
                  <div>
                    <span className="guarantee-title">Secure Payment</span>
                    <span className="guarantee-desc">Escrow Protection</span>
                  </div>
                </div>
                <div className="guarantee-item">
                  <span className="guarantee-icon">🚚</span>
                  <div>
                    <span className="guarantee-title">Fast Shipping</span>
                    <span className="guarantee-desc">2-3 Days Delivery</span>
                  </div>
                </div>
                <div className="guarantee-item">
                  <span className="guarantee-icon">🔄</span>
                  <div>
                    <span className="guarantee-title">Money Back</span>
                    <span className="guarantee-desc">7 Days Guarantee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller profile Section */}
            <div className="seller-section-block glass-panel">
              <div className="seller-header-info">
                <div className="seller-left">
                  <img src={listing.seller.avatar} alt={listing.seller.name} className="seller-avatar-icon" />
                  <div className="seller-name-col">
                    <span className="seller-name-label">{listing.seller.name} <span className="verified-badge-inline">🟢 Verified Pro</span></span>
                    <span className="seller-rating-sub">⭐ 4.9 (128 reviews)</span>
                  </div>
                </div>
              </div>

              {/* Metrics grid */}
              <div className="seller-metrics-grid">
                <div className="seller-metric-card">
                  <span className="metric-val">98%</span>
                  <span className="metric-lbl">Positive Rating</span>
                </div>
                <div className="seller-metric-card">
                  <span className="metric-val">320</span>
                  <span className="metric-lbl">Transactions</span>
                </div>
                <div className="seller-metric-card">
                  <span className="metric-val">7+</span>
                  <span className="metric-lbl">Years Selling</span>
                </div>
                <div className="seller-metric-card">
                  <span className="metric-val">&lt; 2min</span>
                  <span className="metric-lbl">Response Time</span>
                </div>
              </div>

              {/* Communication actions */}
              <div className="seller-comm-actions">
                <button className="seller-comm-btn chat" onClick={() => {
                  // Scroll to chat
                  if (chatBodyRef.current) {
                    chatBodyRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }}>
                  <MessageSquare size={14} />
                  <span>Message</span>
                </button>
                <button className="seller-comm-btn call">
                  <Phone size={14} />
                  <span>Call Seller</span>
                </button>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="specifications-section-block">
              <div className="spec-header-row">
                <h3 className="spec-section-title">Product Specifications</h3>
                <span className="spec-view-all-link">View All →</span>
              </div>
              <div className="specifications-grid">
                {Object.entries(listing.specs || {}).slice(0, 4).map(([key, value]) => (
                  <div key={key} className="specifications-card glass-panel">
                    <div className="spec-card-icon-wrapper">
                      {getSpecIcon(key)}
                    </div>
                    <div className="spec-card-content">
                      <span className="spec-card-label">{key}</span>
                      <span className="spec-card-value">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Conversation Console */}
            <div className="live-chat-panel glass-panel">
              <div className="chat-panel-header">
                <span className="chat-panel-title">
                  <span className="chat-status-dot"></span>
                  Chat with {listing.seller.name.split(' ')[0]}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Active Now</span>
              </div>

              <div className="chat-panel-body" ref={chatBodyRef}>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`chat-msg ${msg.sender}`}>
                    <div>{msg.text}</div>
                    <div className="chat-msg-time">{msg.time}</div>
                  </div>
                ))}
                {isTyping && (
                  <div className="chat-msg seller typing" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>

              {negotiationPhase === 'agreed' && (
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(20, 184, 166, 0.12)',
                  borderTop: '1px solid rgba(20, 184, 166, 0.2)',
                  borderBottom: '1px solid rgba(20, 184, 166, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>✨ Agreed Price:</span>
                    <span style={{ color: 'var(--color-primary)', fontSize: '14px', fontWeight: 900 }}>${currentSellerAsk.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => {
                      setNegotiationPhase('locked');
                      setMessages(prev => [
                        ...prev,
                        { 
                          sender: 'seller', 
                          text: `🔒 DEAL LOCKED! We have officially secured the price of $${currentSellerAsk.toLocaleString()} in your name. A verification specialist will contact you with payment escrow details shortly.`, 
                          time: 'Just now' 
                        }
                      ]);
                    }}
                    style={{
                      background: 'var(--color-primary)',
                      border: 'none',
                      color: '#fff',
                      padding: '6px 14px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      boxShadow: '0 4px 10px rgba(19, 161, 145, 0.3)'
                    }}
                  >
                    Accept & Lock-in Deal
                  </button>
                </div>
              )}

              <form className="chat-panel-footer" onSubmit={handleSendText}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="chat-panel-input"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                />
                <button type="submit" className="chat-panel-send-btn">
                  <X size={14} style={{ transform: 'rotate(45deg)' }} />
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)', justifyContent: 'center', marginTop: '16px' }}>
              <ShieldCheck size={14} style={{ color: 'var(--color-success)' }} />
              <span>Purchase safety tips: Meet in a public place. Do not pay in advance.</span>
            </div>

          </div>

        </div>

      </div>
    </div>

    {showThreeSixty && (
      <ThreeSixtyModal
        listing={listing}
        onClose={() => setShowThreeSixty(false)}
      />
    )}

    {showAR && (
      <ARModal
        listing={listing}
        onClose={() => setShowAR(false)}
      />
    )}
  </>
);
}
