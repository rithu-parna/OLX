import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Maximize2, Minimize2, Send, MapPin, Star, Calendar, ShieldCheck, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';

const mockReplies = {
  cars: [
    "Thank you for the offer. The Porsche is in pristine condition. Would you like to schedule a viewing at DTLA this Saturday?",
    "Hi there. I have a few viewings scheduled, but if you can make a deposit, I can hold the vehicle for you.",
    "Yes, the service history is completely documented at the local dealership. No accidents at all."
  ],
  properties: [
    "Hello! The Malibu Villa is open for private showings. We require proof of funds prior to booking a tour. Let me know if you would like to proceed.",
    "Yes, the property is fully smart-home enabled and the solar integration yields excellent energy savings.",
    "The listing price is slightly negotiable for cash buyers. Please let me know your timeline."
  ],
  electronics: [
    "Hey! Yes, the iPhone has AppleCare+ active. The battery health is exactly 100%.",
    "I can meet up in Manhattan tomorrow if you want to buy it.",
    "No scratches at all, it was in a leather case since day one."
  ],
  watches: [
    "Hi, yes, this Rolex Submariner is a 2023 model, complete set with box and original papers.",
    "The price is firm at $15,400. This model is trading higher on the grey market.",
    "I can meet at a secure bank or authorized dealer in Miami for verification."
  ],
  audio: [
    "Hi, yes, the headphones function perfectly. Minor scuff on headband but earmuffs are pristine.",
    "I can ship them via USPS if you pay for postage, or we can meet in Seattle.",
    "Yes, the original travel case and cables are included."
  ],
  drones: [
    "Thanks for the inquiry. The DJI Mavic Cine has never been crashed and has under 5 hours of total flight time.",
    "Yes, the built-in 1TB SSD is perfect for high-speed Apple ProRes filming.",
    "I can do $3,500 if you pick it up today."
  ]
};

export default function DetailView({ listing, onClose, onSendChatMessage }) {
  const [activeMediaTab, setActiveMediaTab] = useState('image'); // 'image' or 'video'
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false); // Collapses details sidebar
  
  // Offer / Bidding Slider States
  const [bidValue, setBidValue] = useState(listing.price);
  
  // Chat States
  const [messages, setMessages] = useState([
    { sender: 'seller', text: `Hi there! Thanks for checking out my ${listing.title}. Let me know if you have any questions or would like to make an offer.`, time: 'Just now' }
  ]);
  const [newMsg, setNewMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  // Sync bid value to listing price on load
  useEffect(() => {
    setBidValue(listing.price);
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

  const handleSendOffer = () => {
    const offerMessage = `Hello, I would like to submit an offer of $${bidValue.toLocaleString()} for this item. Is this acceptable?`;
    
    // Add user message
    const userMsg = { sender: 'user', text: offerMessage, time: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    
    // Notify app state for global inbox
    if (onSendChatMessage) {
      onSendChatMessage(listing.id, offerMessage);
    }

    // Trigger seller reply simulation
    simulateSellerReply();
  };

  const handleSendText = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    const userMsg = { sender: 'user', text: newMsg, time: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    
    if (onSendChatMessage) {
      onSendChatMessage(listing.id, newMsg);
    }

    setNewMsg('');

    // Trigger seller reply simulation
    simulateSellerReply();
  };

  const simulateSellerReply = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const categoryReplies = mockReplies[listing.category] || [
        "Thanks for the message! Let me get back to you shortly.",
        "Is this still available? Yes, it is!",
        "Let me know if you want to meet up to check the item."
      ];
      
      // Select random reply
      const randomReply = categoryReplies[Math.floor(Math.random() * categoryReplies.length)];
      
      setMessages(prev => [
        ...prev,
        { sender: 'seller', text: randomReply, time: 'Just now' }
      ]);
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="detail-modal-container glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="detail-modal-header">
          <div className="detail-modal-title-area">
            <button className="detail-back-btn" onClick={onClose} aria-label="Go back">
              <X size={20} />
            </button>
            <span className="detail-modal-title">Item Details</span>
          </div>
          <div className="detail-modal-actions">
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>ID: #{listing.id}109</span>
          </div>
        </div>

        {/* Contents Grid */}
        <div className={`detail-modal-content-grid ${isGalleryExpanded ? 'gallery-expanded' : ''}`}>
          
          {/* Media Viewport (Left) */}
          <div className="detail-media-area">
            {/* Viewport tabs */}
            <div className="media-mode-overlay-tabs">
              <button 
                className={`media-tab-btn ${activeMediaTab === 'image' ? 'active' : ''}`}
                onClick={() => setActiveMediaTab('image')}
              >
                <ImageIcon size={14} />
                <span>Images</span>
              </button>
              {listing.video && (
                <button 
                  className={`media-tab-btn ${activeMediaTab === 'video' ? 'active' : ''}`}
                  onClick={() => setActiveMediaTab('video')}
                >
                  <VideoIcon size={14} />
                  <span>Video Tour</span>
                </button>
              )}
            </div>

            {/* Collapse/Expand Sidebar Toggle */}
            <div className="gallery-toggle-overlay">
              <button 
                className="gallery-toggle-btn"
                onClick={() => setIsGalleryExpanded(!isGalleryExpanded)}
                title={isGalleryExpanded ? "Show Details" : "Fullscreen Gallery"}
              >
                {isGalleryExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                <span>{isGalleryExpanded ? 'Collapse Media' : 'Expand Media'}</span>
              </button>
            </div>

            {/* Main Viewport */}
            <div className="media-viewport-container">
              {activeMediaTab === 'image' ? (
                <img 
                  src={listing.images[activeImgIndex]} 
                  alt={listing.title} 
                  className="viewport-media-content"
                />
              ) : (
                <video 
                  src={listing.video} 
                  className="viewport-media-content"
                  controls
                  autoPlay
                  muted
                />
              )}
            </div>

            {/* Thumbnail Strip */}
            {activeMediaTab === 'image' && (
              <div className="detail-thumbnails-strip">
                {listing.images.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`thumb-wrapper ${idx === activeImgIndex ? 'active' : ''}`}
                    onClick={() => setActiveImgIndex(idx)}
                  >
                    <img src={img} alt="" className="thumb-img" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Sidebar (Right) */}
          <div className="detail-sidebar">
            <div className="detail-price-box">
              <span className="detail-price">${listing.price.toLocaleString()}</span>
              <span className="detail-condition-badge">{listing.condition}</span>
            </div>

            <h2 className="detail-title">{listing.title}</h2>

            <div className="detail-meta-tags">
              <div className="detail-meta-tag">
                <MapPin size={14} className="logo-highlight" />
                <span>{listing.location}</span>
              </div>
              <div className="detail-meta-tag">
                <Calendar size={14} className="logo-highlight" />
                <span>{listing.postedDate}</span>
              </div>
            </div>

            {/* Interactive Offer Slider Section */}
            <div className="bid-slider-section glass-panel" style={{ background: 'var(--bg-tertiary)' }}>
              <div className="bid-slider-header">
                <span>Make an Offer</span>
                <span className="bid-amount">${bidValue.toLocaleString()}</span>
              </div>
              
              <input
                type="range"
                className="bid-range-input"
                min={Math.round(listing.price * 0.7)} // Min offer 70% of price
                max={Math.round(listing.price * 1.15)} // Max offer 115% of price
                step={listing.price > 100000 ? 5000 : listing.price > 10000 ? 500 : 50}
                value={bidValue}
                onChange={(e) => setBidValue(Number(e.target.value))}
              />

              <div className="bid-presets">
                <button className="bid-preset-btn" onClick={() => handlePresetBid(-0.1)}>-10%</button>
                <button className="bid-preset-btn" onClick={() => handlePresetBid(-0.05)}>-5%</button>
                <button className="bid-preset-btn" onClick={() => setBidValue(listing.price)}>Ask Price</button>
                <button className="bid-preset-btn" onClick={() => handlePresetBid(0.05)}>+5%</button>
              </div>

              <button className="bid-action-btn" onClick={handleSendOffer}>
                Submit Custom Offer
              </button>
            </div>

            {/* Seller profile card */}
            <div className="seller-profile-section">
              <div className="seller-info-left">
                <img src={listing.seller.avatar} alt={listing.seller.name} className="seller-avatar-large" />
                <div className="seller-name-row">
                  <span className="seller-name">{listing.seller.name}</span>
                  <div className="seller-rating-box">
                    <Star size={12} fill="currentColor" />
                    <span>{listing.seller.rating}</span>
                    <span className="seller-rating-count">({listing.seller.listingsCount} ads)</span>
                  </div>
                </div>
              </div>
              
              <div className="seller-meta-details">
                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Verified Pro</span>
                <span>Replies in mins</span>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="specs-section">
              <h3 className="specs-title">Product Details</h3>
              <div className="specs-grid">
                {Object.entries(listing.specs || {}).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <span className="spec-label">{key}</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description Section */}
            <div className="description-section">
              <h3 className="description-title">Description</h3>
              <p className="description-text">{listing.description}</p>
            </div>

            {/* Interactive Chat Console */}
            <div className="live-chat-panel">
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

              <form className="chat-panel-footer" onSubmit={handleSendText}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="chat-panel-input"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                />
                <button type="submit" className="chat-panel-send-btn">
                  <Send size={14} />
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)', justifyContent: 'center' }}>
              <ShieldCheck size={14} style={{ color: 'var(--color-success)' }} />
              <span>Purchase safety tips: Meet in a public place. Do not pay in advance.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
