import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, RotateCw, ZoomIn, Sun, HelpCircle, Check, Sparkles, RefreshCw, Eye } from 'lucide-react';

const MOCK_BACKDROPS = [
  { name: 'Luxury Living Room', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Minimalist Garage', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Oceanfront Deck', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' }
];

export default function ARModal({ listing, onClose }) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 50 });
  const [activeBackdrop, setActiveBackdrop] = useState(MOCK_BACKDROPS[0]);
  
  // Camera variables
  const [useRealCamera, setUseRealCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  
  // Shutter Flash
  const [isFlashing, setIsFlashing] = useState(false);
  const [showPhotoSaved, setShowPhotoSaved] = useState(false);
  
  const dragConstraintsRef = useRef(null);

  // Initialize camera stream
  useEffect(() => {
    if (useRealCamera) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.warn("Camera access failed, falling back to mock backdrop.", err);
          setCameraError("Camera access denied or unavailable.");
          setUseRealCamera(false);
        });
    } else {
      // Stop stream if active
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [useRealCamera]);

  const handleCapture = () => {
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
      setShowPhotoSaved(true);
      setTimeout(() => {
        setShowPhotoSaved(false);
      }, 3000);
    }, 150);
  };

  const toggleCameraMode = () => {
    setCameraError(null);
    setUseRealCamera(!useRealCamera);
  };

  return (
    <div className="login-modal-overlay" style={{ background: 'rgba(5, 7, 12, 0.94)' }}>
      <motion.div 
        className="ar-modal-card glass-panel"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border-color)', background: 'rgba(15, 22, 38, 0.5)', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles className="logo-highlight" size={20} />
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>AR Space Planner & Simulator</h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Visualize this luxury item in your room environment</span>
            </div>
          </div>
          <button className="login-close-btn" onClick={onClose} style={{ position: 'static' }}>
            <X size={20} />
          </button>
        </div>

        {/* Viewport Screen */}
        <div 
          ref={dragConstraintsRef}
          style={{
            flex: 1,
            position: 'relative',
            background: '#090b10',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* 1. Camera stream view */}
          {useRealCamera ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
          ) : (
            /* 2. Mock backdrop image view */
            <img
              src={activeBackdrop.url}
              alt={activeBackdrop.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
                filter: 'brightness(0.95)'
              }}
            />
          )}

          {/* Guidelines Grid (overlay for positioning) */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              border: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              pointerEvents: 'none'
            }}
          />

          {/* AR Item (Draggable) */}
          <motion.div
            drag
            dragConstraints={dragConstraintsRef}
            style={{
              position: 'absolute',
              x: position.x,
              y: position.y,
              cursor: 'grab',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 5
            }}
            whileDrag={{ cursor: 'grabbing', scale: scale * 1.05 }}
          >
            {/* AR Guide Rings */}
            <div 
              style={{
                position: 'absolute',
                bottom: '-10px',
                width: '120px',
                height: '24px',
                border: '1.5px dashed var(--color-primary)',
                borderRadius: '50%',
                transform: 'rotateX(60deg)',
                opacity: 0.6,
                boxShadow: '0 0 12px var(--color-primary)'
              }}
            />

            <img
              src={listing.images[0]}
              alt={listing.title}
              style={{
                width: listing.category === 'properties' ? '280px' : '220px',
                height: 'auto',
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                filter: `brightness(${brightness}) drop-shadow(0 20px 30px rgba(0,0,0,0.65))`,
                transition: 'transform 0.1s ease, filter 0.1s ease',
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            />
          </motion.div>

          {/* Guidelines HUD Card */}
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '240px', pointerEvents: 'none', zIndex: 10 }}>
            <span style={{ fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AR Guidelines:</span>
            <span>• Drag the item to place it in the view.</span>
            <span>• Adjust scale and rotation below.</span>
            <span>• Align shadows to match light source.</span>
          </div>

          {/* Camera Flashing Effect */}
          <AnimatePresence>
            {isFlashing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#ffffff',
                  zIndex: 100,
                  pointerEvents: 'none'
                }}
              />
            )}
          </AnimatePresence>

          {/* Shutter Success Alert */}
          <AnimatePresence>
            {showPhotoSaved && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                style={{
                  position: 'absolute',
                  top: '20px',
                  background: 'rgba(19, 161, 145, 0.95)',
                  backdropFilter: 'blur(10px)',
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  zIndex: 15,
                  boxShadow: '0 10px 25px rgba(19,161,145,0.4)'
                }}
              >
                <Check size={16} strokeWidth={3} />
                <span>Snap Saved to Luxury Vault & Gallery!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Viewport Control Panel Footer */}
        <div className="modal-controls-footer" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: 'rgba(15, 22, 38, 0.85)', borderTop: '1px solid var(--border-color)', gap: '16px', zIndex: 10 }}>
          
          {/* Left: Mode toggle & Shutter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className={`bg-toggle-btn ${useRealCamera ? 'active' : ''}`}
              onClick={toggleCameraMode}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: useRealCamera ? 'var(--color-primary)' : 'rgba(255,255,255,0.03)',
                borderColor: useRealCamera ? 'var(--color-primary)' : 'rgba(255,255,255,0.08)'
              }}
            >
              <RefreshCw size={14} />
              <span>{useRealCamera ? 'Use Mock Scenes' : 'Activate Webcam'}</span>
            </button>

            <button 
              onClick={handleCapture}
              className="action-btn"
              title="Snap Picture"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'var(--color-primary)',
                color: '#fff',
                border: '3px solid rgba(255,255,255,0.2)'
              }}
            >
              <Camera size={18} />
            </button>
          </div>

          {/* Center: Scale & Rotation sliders */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Scale Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ZoomIn size={14} className="text-muted" />
              <input 
                type="range"
                min="0.3"
                max="2.0"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                style={{ width: '80px', accentColor: 'var(--color-primary)', height: '4px' }}
              />
              <span style={{ fontSize: '10px', color: '#fff', width: '25px' }}>{Math.round(scale * 100)}%</span>
            </div>

            {/* Rotation Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RotateCw size={14} className="text-muted" />
              <input 
                type="range"
                min="0"
                max="360"
                step="5"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                style={{ width: '80px', accentColor: 'var(--color-primary)', height: '4px' }}
              />
              <span style={{ fontSize: '10px', color: '#fff', width: '30px' }}>{rotation}°</span>
            </div>

            {/* Brightness Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sun size={14} className="text-muted" />
              <input 
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={brightness}
                onChange={(e) => setBrightness(parseFloat(e.target.value))}
                style={{ width: '80px', accentColor: 'var(--color-primary)', height: '4px' }}
              />
              <span style={{ fontSize: '10px', color: '#fff', width: '25px' }}>{Math.round(brightness * 100)}%</span>
            </div>
          </div>

          {/* Right: Mock Backdrop dropdown (disabled when using real cam) */}
          {!useRealCamera && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Backdrop:</span>
              <select
                className="sort-select"
                value={activeBackdrop.name}
                onChange={(e) => {
                  const target = MOCK_BACKDROPS.find(b => b.name === e.target.value);
                  if (target) setActiveBackdrop(target);
                }}
                style={{ padding: '6px 12px', fontSize: '11px', height: '32px' }}
              >
                {MOCK_BACKDROPS.map((bg) => (
                  <option key={bg.name} value={bg.name}>{bg.name}</option>
                ))}
              </select>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
