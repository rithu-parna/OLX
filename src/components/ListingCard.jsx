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
          {listing.featured && <span className="card-badge featured">Promoted</span>}
          {listing.video && (
            <span className="card-badge video-badge">
              <Play size={10} fill="#fff" />
              <span>Video tour</span>
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
        <div>
          <div className="card-price-row">
            <span className="card-price">${listing.price.toLocaleString()}</span>
            <span className="card-condition">{listing.condition}</span>
          </div>
          <h3 className="card-title">{listing.title}</h3>
        </div>

        <div className="card-footer">
          <span className="card-location">
            <MapPin size={12} style={{ marginRight: '2px', flexShrink: 0 }} />
            {listing.location.split(',')[0]}
          </span>
          <span>{listing.postedDate}</span>
        </div>
      </div>
    </div>
  );
}
