import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Image as ImageIcon, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';

const PRESET_BGS = [
  {
    name: 'Penthouse Dusk',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    category: 'properties'
  },
  {
    name: 'Mamba Green 911',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    category: 'cars'
  },
  {
    name: 'Rolex Submariner',
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    category: 'watches'
  },
  {
    name: 'Minimal Tech Setup',
    url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80',
    category: 'electronics'
  }
];

const PRESET_USERS = [
  {
    name: 'Victoria Luxe Watches',
    email: 'victoria@luxe.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    responseRate: '98%',
    listingsCount: 29,
    joined: 'Feb 2021',
    role: 'seller'
  },
  {
    name: 'Marcus Brody',
    email: 'marcus@brody.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5.0,
    responseRate: '100%',
    listingsCount: 2,
    joined: 'Mar 2024',
    role: 'seller'
  },
  {
    name: 'Alexander Sterling',
    email: 'alex@sterling.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    responseRate: '100%',
    listingsCount: 14,
    joined: 'Oct 2023',
    role: 'seller'
  }
];

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedBg, setSelectedBg] = useState(PRESET_BGS[0].url);
  const [customBgUrl, setCustomBgUrl] = useState('');
  const [showBgPicker, setShowBgPicker] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleQuickLogin = (user) => {
    setSuccess(`Logged in successfully as ${user.name}!`);
    setError('');
    setTimeout(() => {
      onLogin(user);
      setSuccess('');
      onClose();
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isSignUp) {
      if (!name || !email || !password) {
        setError('Please fill in all required fields.');
        return;
      }
      
      const newUser = {
        name,
        email,
        avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        rating: 5.0,
        responseRate: '100%',
        listingsCount: 0,
        joined: 'Just Now',
        role: 'user'
      };

      setSuccess('Account created successfully!');
      setTimeout(() => {
        onLogin(newUser);
        setSuccess('');
        onClose();
      }, 1200);

    } else {
      if (!email || !password) {
        setError('Please enter your email and password.');
        return;
      }

      // Check if matches preset
      const matchedPreset = PRESET_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      const loggedUser = matchedPreset || {
        name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' '),
        email: email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        rating: 5.0,
        responseRate: '100%',
        listingsCount: 0,
        joined: 'Jun 2026',
        role: 'user'
      };

      setSuccess('Logged in successfully!');
      setTimeout(() => {
        onLogin(loggedUser);
        setSuccess('');
        onClose();
      }, 1200);
    }
  };

  const applyCustomBg = () => {
    if (customBgUrl.trim().startsWith('http')) {
      setSelectedBg(customBgUrl.trim());
      setCustomBgUrl('');
    } else {
      setError('Please enter a valid image URL starting with http/https.');
    }
  };

  return (
    <div className="login-modal-overlay">
      {/* Background Image Container */}
      <div 
        className="login-modal-bg-image" 
        style={{ backgroundImage: `url(${selectedBg})` }}
      />
      <div className="login-modal-blur-overlay" />

      {/* Modal Main Content Container */}
      <motion.div 
        className="login-modal-card glass-panel"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
      >
        {/* Close Button */}
        <button className="login-close-btn" onClick={onClose} aria-label="Close Modal">
          <X size={20} />
        </button>

        {/* Left Side: Brand & Aesthetics Intro */}
        <div className="login-card-brand-side">
          <div className="brand-logo-badge">
            <img src="/logo.svg" alt="OLX Luxe" className="login-brand-logo" />
            <span className="brand-badge-text">Luxe Market</span>
          </div>

          <div className="brand-pitch-content">
            <h2 className="brand-pitch-title">
              Enter The <br />
              <span className="logo-highlight">Elite Circle</span>
            </h2>
            <p className="brand-pitch-desc">
              Discover and trade ultra-premium assets, from bespoke watch pieces to oceanfront estates.
            </p>
          </div>

          {/* Background Customizer widget */}
          <div className="bg-customizer-widget">
            <button 
              className="bg-toggle-btn glass-panel"
              onClick={() => setShowBgPicker(!showBgPicker)}
            >
              <ImageIcon size={14} className="logo-highlight" />
              <span>Customize Scene</span>
            </button>

            <AnimatePresence>
              {showBgPicker && (
                <motion.div 
                  className="bg-picker-dropdown glass-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <span className="bg-picker-title">Select Atmosphere</span>
                  <div className="bg-presets-grid">
                    {PRESET_BGS.map((bg) => (
                      <button
                        key={bg.name}
                        className={`bg-preset-thumb ${selectedBg === bg.url ? 'active' : ''}`}
                        onClick={() => setSelectedBg(bg.url)}
                        style={{ backgroundImage: `url(${bg.url})` }}
                        title={bg.name}
                      >
                        {selectedBg === bg.url && (
                          <div className="preset-active-check">
                            <Check size={10} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="custom-bg-input-row">
                    <input
                      type="text"
                      className="custom-bg-input"
                      placeholder="Paste Unsplash Image URL..."
                      value={customBgUrl}
                      onChange={(e) => setCustomBgUrl(e.target.value)}
                    />
                    <button className="apply-bg-btn" onClick={applyCustomBg}>
                      Apply
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Forms */}
        <div className="login-card-form-side">
          <div className="form-toggle-header">
            <button 
              className={`toggle-tab-btn ${!isSignUp ? 'active' : ''}`}
              onClick={() => { setIsSignUp(false); setError(''); setSuccess(''); }}
            >
              Sign In
            </button>
            <button 
              className={`toggle-tab-btn ${isSignUp ? 'active' : ''}`}
              onClick={() => { setIsSignUp(true); setError(''); setSuccess(''); }}
            >
              Register
            </button>
          </div>

          {/* Form Info Messages */}
          {error && <div className="form-alert error-alert animate-fade-in">{error}</div>}
          {success && <div className="form-alert success-alert animate-fade-in">{success}</div>}

          {/* Main Auth Form */}
          <form onSubmit={handleSubmit} className="auth-fields-form">
            <AnimatePresence mode="wait">
              {isSignUp ? (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <div className="input-group-wrapper">
                    <label className="input-field-label">Full Name</label>
                    <div className="input-with-icon">
                      <User size={16} className="input-left-icon" />
                      <input 
                        type="text" 
                        className="form-input-field" 
                        placeholder="e.g. James Bond"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="input-group-wrapper">
                    <label className="input-field-label">Avatar URL (Optional)</label>
                    <div className="input-with-icon">
                      <ImageIcon size={16} className="input-left-icon" />
                      <input 
                        type="text" 
                        className="form-input-field" 
                        placeholder="Paste image link..."
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="input-group-wrapper">
              <label className="input-field-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-left-icon" />
                <input 
                  type="email" 
                  className="form-input-field" 
                  placeholder="name@luxury.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group-wrapper">
              <label className="input-field-label">Secure Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-left-icon" />
                <input 
                  type="password" 
                  className="form-input-field" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              <span>{isSignUp ? 'Create Luxury Account' : 'Verify Identity'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick-Login Section for testing & showcase */}
          {!isSignUp && (
            <div className="quick-login-container">
              <div className="quick-login-divider">
                <span className="divider-label">Or Quick Access as Preset Seller</span>
              </div>

              <div className="presets-row">
                {PRESET_USERS.map((user) => (
                  <button
                    key={user.email}
                    className="preset-user-card glass-panel"
                    onClick={() => handleQuickLogin(user)}
                    title={`Log in as ${user.name}`}
                  >
                    <img src={user.avatar} alt={user.name} className="preset-user-avatar" />
                    <div className="preset-user-meta">
                      <span className="preset-user-name">{user.name.split(' ')[0]}</span>
                      <span className="preset-user-details">{user.responseRate} Response</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="secure-badge-row">
            <ShieldCheck size={14} className="logo-highlight" />
            <span>Encrypted Authentication Gateway</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
