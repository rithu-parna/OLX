import React, { useRef, useState } from 'react';
import { Heart, MapPin, Play } from 'lucide-react';

export default function ListingCard({ listing, onSelect, isSaved, onToggleSave }) {
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
          {listing.id === 1 || listing.id === 3 || listing.id === 6 ? (
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
