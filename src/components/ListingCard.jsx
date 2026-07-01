import React, { useRef, useState } from 'react';
import { Heart, MapPin, Play, Scale } from 'lucide-react';

export default function ListingCard({ listing, onSelect, isSaved, onToggleSave, isComparing, onToggleCompare }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (listing.video && videoRef.current) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Video autoplay prevented: ', err));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave(listing.id);
  };

  return (
    <div 
      className="listing-card glass-panel"
      onClick={() => onSelect(listing)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'pointer' }}
    >
      {/* Media Cover */}
      <div className="card-media-wrapper">
        <img 
          src={listing.images[0]} 
          alt={listing.title} 
          className="card-image"
        />
        
        {listing.video && (
          <video
            ref={videoRef}
            src={listing.video}
            className="card-video"
            loop
            muted
            playsInline
          />
        )}

        {/* Badges */}
        <div className="badge-overlay-container">
          {listing.isAuction ? (
            <span className="card-badge featured-badge" style={{ background: 'linear-gradient(90deg, #14b8a6 0%, #0f766e 100%)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 0 12px rgba(20, 184, 166, 0.5)', fontWeight: 900 }}>👑 LIVE AUCTION</span>
          ) : listing.id === 1 || listing.id === 3 || listing.id === 6 ? (
            <span className="card-badge promoted-badge">PROMOTED</span>
          ) : listing.id === 2 ? (
            <span className="card-badge featured-badge">FEATURED</span>
          ) : (
            <span className="card-badge trending-badge">TRENDING</span>
          )}
          
          {listing.video && (
            <span className="card-badge video-badge">
              <Play size={10} fill="#fff" />
              <span>VIDEO TOUR</span>
            </span>
          )}
        </div>

        {/* Compare Toggle */}
        <button 
          className={`compare-btn-overlay ${isComparing ? 'comparing' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleCompare(listing);
          }}
          aria-label="Compare listing"
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: isComparing ? 'var(--color-primary)' : 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: isComparing ? '#fff' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 10,
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.background = isComparing ? 'var(--color-primary)' : 'rgba(15, 23, 42, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = isComparing ? 'var(--color-primary)' : 'rgba(15, 23, 42, 0.6)';
          }}
        >
          <Scale size={13} />
        </button>

        {/* Save Toggle */}
        <button 
          className={`save-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleSaveClick}
          aria-label={isSaved ? "Remove from saved" : "Save ad"}
        >
          <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Info Body */}
      <div className="card-info">
        <h3 className="card-title">{listing.title}</h3>
        <span className="card-price">${listing.price.toLocaleString()}</span>
        
        <div className="card-location-row">
          <span className="card-location">
            <MapPin size={12} style={{ marginRight: '4px', flexShrink: 0 }} />
            {listing.location.split(',')[0]}
          </span>
          <span className="card-time">{listing.postedDate}</span>
        </div>

        {/* Specs tags footer */}
        {listing.specs && (
          <div className="card-specs-tags">
            {Object.entries(listing.specs).slice(0, 4).map(([key, value]) => (
              <span key={key} className="card-spec-tag">
                {value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
