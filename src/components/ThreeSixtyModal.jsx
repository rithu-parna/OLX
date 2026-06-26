import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCw, ZoomIn, Info, Play, Pause, Sun, HelpCircle, Eye } from 'lucide-react';

const ATMOSPHERE_LIGHTING = [
  { name: 'Studio Dark', class: 'lighting-studio', glow: 'rgba(20, 184, 166, 0.2)' },
  { name: 'Sunset Glow', class: 'lighting-sunset', glow: 'rgba(245, 158, 11, 0.25)' },
  { name: 'Neon Cyber', class: 'lighting-cyber', glow: 'rgba(99, 102, 241, 0.3)' }
];

const ITEM_HOTSPOTS = {
  1: [
    { x: 30, y: 45, title: 'Active Matrix LED Headlights', desc: 'PDLS+ dynamic cornering lights with signature 4-point design.' },
    { x: 65, y: 55, title: 'Mamba Green Metallic', desc: 'Custom luxury paint protection film with high-gloss ceramic coat.' },
    { x: 50, y: 38, title: 'Sport Chrono Clock', desc: 'Dashboard stopwatch instrument dial in Guards Red.' }
  ],
  2: [
    { x: 40, y: 35, title: 'Panoramic Structural Glass', desc: 'Hurricane-proof insulated dual-pane floor-to-ceiling glass.' },
    { x: 60, y: 70, title: 'Infinity Rim Pool', desc: 'Heated saltwater pool with underwater LED fiber-optic color show.' }
  ],
  4: [
    { x: 50, y: 30, title: 'Cerachrom Bezel', desc: 'Scratch-proof green ceramic bezel insert with platinum graduations.' },
    { x: 52, y: 55, title: 'Chromalight Dial', desc: 'Highly legible luminescent display with long-lasting blue glow.' }
  ],
  6: [
    { x: 45, y: 50, title: 'Triple Hasselblad Cameras', desc: '4/3 CMOS primary sensor with Apple ProRes dual tele cameras.' }
  ]
};

export default function ThreeSixtyModal({ listing, onClose }) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);
  const [lighting, setLighting] = useState(ATMOSPHERE_LIGHTING[0]);
  const [activeHotspot, setActiveHotspot] = useState(null);

  const dragStartRef = useRef(0);
  const rotationStartRef = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    let intervalId;
    if (isAutoSpinning && !isDragging.current) {
      intervalId = setInterval(() => {
        setRotation(prev => (prev + 0.8) % 360);
      }, 30);
    }
    return () => clearInterval(intervalId);
  }, [isAutoSpinning]);

  const handlePointerDown = (e) => {
    isDragging.current = true;
    dragStartRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    rotationStartRef.current = rotation;
    setIsAutoSpinning(false);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartRef.current;
    const sensitivity = 0.5;
    const newRot = (rotationStartRef.current + deltaX * sensitivity) % 360;
    setRotation(newRot < 0 ? 360 + newRot : newRot);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, []);

  const hotspots = ITEM_HOTSPOTS[listing.id] || [
    { x: 50, y: 50, title: 'Premium Material Finish', desc: 'Crafted with premium grade alloys and composites.' }
  ];

  return (
    <div className="login-modal-overlay" style={{ background: 'rgba(5, 7, 12, 0.92)' }}>
      <motion.div
        className="threesixty-card glass-panel"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          width: '95%',
          maxWidth: '1000px',
          height: '650px',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-color)', background: 'rgba(15, 22, 38, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <RotateCw className="logo-highlight" size={20} />
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>Interactive 360° Studio</h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Drag horizontally to spin the asset</span>
            </div>
          </div>
          <button className="login-close-btn" onClick={onClose} style={{ position: 'static' }}>
            <X size={20} />
          </button>
        </div>

        {/* Studio Viewport */}
        <div
          className={`threesixty-viewport ${lighting.class}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          style={{
            flex: 1,
            position: 'relative',
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            background: 'radial-gradient(circle, var(--bg-tertiary) 0%, #070a13 100%)',
            touchAction: 'none'
          }}
        >
          {/* Lighting Overlay Glows */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              boxShadow: `inset 0 0 100px ${lighting.glow}`,
              transition: 'box-shadow 0.6s ease'
            }}
          />

          {/* Asset Image Container */}
          <div
            style={{
              transform: `scale(${zoom})`,
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative',
              width: '80%',
              maxWidth: '550px',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Asset Shadows */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                width: '85%',
                height: '24px',
                background: 'rgba(0,0,0,0.5)',
                filter: 'blur(12px)',
                borderRadius: '50%',
                transform: `rotate(${rotation}deg)`,
                pointerEvents: 'none'
              }}
            />

            {/* Rotated Image */}
            <motion.img
              src={listing.images[0]}
              alt={listing.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transform: `rotateY(${rotation}deg)`,
                filter: lighting.class === 'lighting-sunset' ? 'sepia(0.2) saturate(1.2) hue-rotate(10deg)' : lighting.class === 'lighting-cyber' ? 'hue-rotate(240deg) saturate(1.3)' : 'none',
                userSelect: 'none',
                pointerEvents: 'none'
              }}
            />

            {/* Blinking Hotspots (Only show when close to front view, i.e., rotation < 60 or > 300) */}
            {Math.abs((rotation % 360) - 180) > 100 && hotspots.map((spot, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20
                }}
              >
                <button
                  className="hotspot-pulse-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(activeHotspot === idx ? null : idx);
                  }}
                  onMouseEnter={() => setActiveHotspot(idx)}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    border: '2.5px solid #fff',
                    cursor: 'pointer',
                    boxShadow: '0 0 10px var(--color-primary)'
                  }}
                />

                {/* Hotspot Card */}
                <AnimatePresence>
                  {activeHotspot === idx && (
                    <motion.div
                      className="hotspot-card glass-panel"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: 'absolute',
                        bottom: '24px',
                        left: '-100px',
                        width: '220px',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        zIndex: 30,
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        pointerEvents: 'auto'
                      }}
                    >
                      <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#fff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Info size={12} className="logo-highlight" />
                        {spot.title}
                      </h4>
                      <p style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{spot.desc}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Quick HUD Indicators */}
          <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px', pointerEvents: 'none' }}>
            <span style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
              ROTATION: {Math.round(rotation)}°
            </span>
            <span style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
              ZOOM: {zoom.toFixed(1)}x
            </span>
          </div>

          <div style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Eye size={12} />
            <span>Interactive 3D Render</span>
          </div>
        </div>

        {/* Studio Controls Footer */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: 'rgba(15, 22, 38, 0.8)', borderTop: '1px solid var(--border-color)', gap: '16px' }}>

          {/* Rotation controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className="action-btn"
              onClick={() => setIsAutoSpinning(!isAutoSpinning)}
              title={isAutoSpinning ? 'Pause Spin' : 'Auto Rotate'}
              style={{ width: '36px', height: '36px' }}
            >
              {isAutoSpinning ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              className="bg-toggle-btn"
              onClick={() => setRotation(0)}
              style={{ padding: '8px 14px' }}
            >
              Reset View
            </button>
          </div>

          {/* Zoom controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ZoomIn size={16} className="text-muted" />
            <input
              type="range"
              min="1"
              max="2"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              style={{
                width: '120px',
                accentColor: 'var(--color-primary)',
                height: '4px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            />
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', width: '28px' }}>{Math.round(zoom * 100)}%</span>
          </div>

          {/* Atmosphere Lighting presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sun size={14} className="logo-highlight" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '4px' }}>Lighting:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {ATMOSPHERE_LIGHTING.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setLighting(preset)}
                  className={`bg-toggle-btn ${lighting.name === preset.name ? 'active' : ''}`}
                  style={{
                    padding: '6px 12px',
                    fontSize: '11px',
                    borderRadius: '4px',
                    background: lighting.name === preset.name ? 'var(--color-primary)' : 'rgba(255,255,255,0.03)',
                    borderColor: lighting.name === preset.name ? 'var(--color-primary)' : 'rgba(255,255,255,0.08)',
                    color: '#fff'
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
