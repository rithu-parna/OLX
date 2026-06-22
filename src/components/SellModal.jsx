import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Upload, Play, Check, Sparkles } from 'lucide-react';

const presetImages = [
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80', // Sports Car
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80', // Villa
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80', // Smart phone
  'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=400&q=80', // Luxury watch
  'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80', // Headphones
  'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=400&q=80'  // Drone
];

const mockVideos = [
  'https://assets.mixkit.co/videos/preview/mixkit-red-sports-car-driving-fast-32608-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-exterior-of-a-modern-house-41559-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-wrist-watch-in-close-up-42099-large.mp4'
];

export default function SellModal({ onClose, onPublish }) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('cars');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('New');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Manhattan, New York');
  
  // Media states
  const [selectedPresets, setSelectedPresets] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [customImgUrl, setCustomImgUrl] = useState('');

  // Specs states
  const [specKey1, setSpecKey1] = useState('Brand');
  const [specVal1, setSpecVal1] = useState('');
  const [specKey2, setSpecKey2] = useState('Model');
  const [specVal2, setSpecVal2] = useState('');

  const togglePresetSelect = (url) => {
    if (selectedPresets.includes(url)) {
      setSelectedPresets(selectedPresets.filter(u => u !== url));
    } else {
      setSelectedPresets([...selectedPresets, url]);
    }
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct images array (using selected presets or custom URL or fallback)
    let images = [...selectedPresets];
    if (customImgUrl.trim()) images.unshift(customImgUrl);
    if (images.length === 0) {
      images.push('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'); // Fallback
    }

    // Specs
    const specs = {};
    if (specKey1.trim() && specVal1.trim()) specs[specKey1] = specVal1;
    if (specKey2.trim() && specVal2.trim()) specs[specKey2] = specVal2;

    const newListing = {
      id: Date.now(),
      title: title || 'Premium Luxury Listing',
      category,
      price: Number(price) || 999,
      condition,
      location,
      postedDate: 'Just now',
      description: description || 'No description provided.',
      images,
      video: videoUrl.trim() || mockVideos[0], // fallback video loop
      featured: true,
      seller: {
        name: 'Victoria Luxe Watches',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        responseRate: '100%',
        listingsCount: 30,
        joined: 'Jun 2026'
      },
      stats: { views: 0, clicks: 0, offers: 0 },
      specs
    };

    onPublish(newListing);
    setStep(5); // Go to success step
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="sell-modal-container glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sell-modal-header">
          <h2 className="sell-modal-title">Create Premium Ad</h2>
          <button className="sell-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Stepper progress bar */}
        {step < 5 && (
          <div className="sell-modal-stepper">
            <div className={`step-indicator ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}></div>
            <div className={`step-indicator ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}></div>
            <div className={`step-indicator ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}></div>
            <div className={`step-indicator ${step >= 4 ? 'active' : ''} ${step > 4 ? 'completed' : ''}`}></div>
          </div>
        )}

        {/* Body content */}
        <div className="sell-modal-body">
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Basic Information</h3>
              
              <div className="form-group">
                <label>Select Category</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="cars">Cars & Motors</option>
                  <option value="properties">Real Estate / Villa</option>
                  <option value="electronics">Tech & Mobiles</option>
                  <option value="watches">Luxury Watches</option>
                  <option value="audio">Premium Audio</option>
                  <option value="drones">Drones & Camera</option>
                </select>
              </div>

              <div className="form-group">
                <label>Listing Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Porsche 911 GT3 RS (Guards Red)" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Price ($ USD)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="e.g. 150000" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Condition</label>
                <select className="form-select" value={condition} onChange={(e) => setCondition(e.target.value)}>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Specifications & Description</h3>

              <div className="form-group">
                <label>Item Description</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Provide a detailed description of features, history, documentation, package contents..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Specifications (Key-Value)</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Key (e.g. Brand)" 
                    value={specKey1}
                    onChange={(e) => setSpecKey1(e.target.value)}
                  />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Value (e.g. Rolex)" 
                    value={specVal1}
                    onChange={(e) => setSpecVal1(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Key (e.g. Year)" 
                    value={specKey2}
                    onChange={(e) => setSpecKey2(e.target.value)}
                  />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Value (e.g. 2024)" 
                    value={specVal2}
                    onChange={(e) => setSpecVal2(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Beverly Hills, Los Angeles" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Upload Media (Image & Video)</h3>

              <div className="form-group">
                <label>Custom Image URL (Optional)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Paste direct link (https://images.unsplash.com/...)" 
                  value={customImgUrl}
                  onChange={(e) => setCustomImgUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Select High-Res Preset Images (Recommended)</label>
                <div className="presets-grid">
                  {presetImages.map((img, idx) => (
                    <div 
                      key={idx}
                      className={`preset-img-wrapper ${selectedPresets.includes(img) ? 'selected' : ''}`}
                      onClick={() => togglePresetSelect(img)}
                    >
                      <img src={img} alt="" />
                      {selectedPresets.includes(img) && (
                        <div className="preset-selection-check">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Demonstration Video URL (Direct MP4 link)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Paste direct MP4 link (https://assets.mixkit.co/...)" 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                  Provide an MP4 link to support our premium hover-video play features. Leave blank to use a default car/villa loop.
                </span>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in" style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Review & Submit</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
                Your ad will be listed instantly across our premium channels and marked as a <strong>Promoted listing</strong>.
              </p>

              <div className="listing-card glass-panel" style={{ maxWidth: '300px', margin: '0 auto', textAlign: 'left' }}>
                <div className="card-media-wrapper">
                  <img 
                    src={customImgUrl.trim() || selectedPresets[0] || presetImages[0]} 
                    alt="Preview" 
                    className="card-image"
                  />
                  <div className="badge-overlay-container">
                    <span className="card-badge featured">Promoted</span>
                    <span className="card-badge video-badge">
                      <Play size={10} fill="#fff" />
                      <span>Video tour</span>
                    </span>
                  </div>
                </div>
                <div className="card-info">
                  <div className="card-price-row">
                    <span className="card-price">${(Number(price) || 0).toLocaleString()}</span>
                    <span className="card-condition">{condition}</span>
                  </div>
                  <h3 className="card-title">{title || 'Premium Luxury Listing'}</h3>
                  <div className="card-footer">
                    <span>{location.split(',')[0]}</span>
                    <span>Just now</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-scale-in success-creation-pane">
              {/* Confetti simulator particles */}
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="success-confetti-particle"
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    backgroundColor: i % 2 === 0 ? 'var(--color-primary)' : 'var(--color-secondary)',
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}

              <div className="success-icon-badge">
                <Sparkles size={36} />
              </div>
              <h3 className="success-title">Listing Published!</h3>
              <p className="success-desc">
                Your premium classified ad is now live. Buyers can watch video tours, submit bids, and message you instantly.
              </p>
              <button 
                className="sell-publish-btn" 
                onClick={onClose}
                style={{ width: '200px', height: '44px', borderRadius: 'var(--radius-sm)' }}
              >
                Close & View Ad
              </button>
            </div>
          )}
        </div>

        {/* Footer controls */}
        {step < 5 && (
          <div className="sell-modal-footer">
            {step > 1 ? (
              <button className="sell-back-btn" onClick={handleBack}>
                <ChevronLeft size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button className="sell-next-btn" onClick={handleNext}>
                Next
                <ChevronRight size={16} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
              </button>
            ) : (
              <button className="sell-publish-btn" onClick={handleSubmit}>
                Publish Ad
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
