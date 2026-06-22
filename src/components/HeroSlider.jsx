import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Play, Building, Users, Award } from 'lucide-react';

export default function HeroSlider({ featuredListings, onSelectListing }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered || featuredListings.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredListings.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered, featuredListings]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredListings.length) % featuredListings.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredListings.length);
  };

  if (featuredListings.length === 0) return null;

  const getHeroSpecs = (item) => {
    if (item.id === 2) {
      return [
        { icon: '🛏️', label: '4 Bedrooms' },
        { icon: '🛁', label: '5 Bathrooms' },
        { icon: '🌊', label: 'Ocean View' },
        { icon: '📐', label: '8,420 Sqft' }
      ];
    }
    if (item.id === 1) {
      return [
        { icon: '🏎️', label: 'Porsche PDK' },
        { icon: '📐', label: '12,500 Miles' },
        { icon: '⛽', label: 'Petrol' },
        { icon: '📅', label: '2022 Model' }
      ];
    }
    return Object.entries(item.specs || {}).slice(0, 4).map(([key, val]) => ({
      icon: '✨',
      label: `${val}`
    }));
  };

  return (
    <div 
      className="hero-slider-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Navigation Overlay */}
      <div className="hero-top-right-nav">
        <span className="slide-counter">
          {String(currentIndex + 1).padStart(2, '0')} / {String(featuredListings.length).padStart(2, '0')}
        </span>
        <div className="slider-arrows-group">
          <button className="slider-arrow-btn" onClick={handlePrev} aria-label="Previous Slide">
            <ChevronLeft size={16} />
          </button>
          <button className="slider-arrow-btn" onClick={handleNext} aria-label="Next Slide">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Slides */}
      {featuredListings.map((item, index) => {
        const isActive = index === currentIndex;
        const specs = getHeroSpecs(item);
        
        return (
          <div 
            key={item.id} 
            className={`slide ${isActive ? 'active' : ''}`}
            style={{ display: isActive ? 'flex' : 'none' }}
          >
            <div className="slide-image-wrapper">
              <img 
                src={item.images[0]} 
                alt={item.title} 
                className="slide-image"
              />
              <div className="slide-overlay"></div>
            </div>
            
            <div className="slide-content">
              <span className="slide-badge">
                {item.category === 'properties' ? '💎 FEATURED PROPERTY' : '🏎️ FEATURED MOTOR'}
              </span>
              <h2 className="slide-title">{item.title}</h2>
              <p className="slide-desc">{item.description}</p>
              
              {/* Specs Pills Row */}
              <div className="hero-specs-row">
                {specs.map((spec, i) => (
                  <span key={i} className="hero-spec-pill">
                    <span className="spec-icon">{spec.icon}</span>
                    <span>{spec.label}</span>
                  </span>
                ))}
              </div>

              {/* Actions Row */}
              <div className="hero-actions-row">
                <button 
                  className="slide-btn"
                  onClick={() => onSelectListing(item)}
                >
                  <span>Explore Deal • ${item.price.toLocaleString()}</span>
                  <ArrowRight size={16} />
                </button>

                {item.video && (
                  <button className="hero-watch-tour-btn" onClick={() => onSelectListing(item)}>
                    <span className="watch-play-circle">
                      <Play size={10} fill="currentColor" />
                    </span>
                    <span>Watch Tour</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Statistics Overlay Cards */}
      <div className="hero-stats-container">
        <div className="hero-stat-card glass-panel">
          <Building size={15} className="stat-icon" />
          <div>
            <div className="stat-value">$2.8B+</div>
            <div className="stat-label">Total Luxury Assets</div>
          </div>
        </div>
        <div className="hero-stat-card glass-panel">
          <Users size={15} className="stat-icon" />
          <div>
            <div className="stat-value">150K+</div>
            <div className="stat-label">Verified Buyers</div>
          </div>
        </div>
        <div className="hero-stat-card glass-panel">
          <Award size={15} className="stat-icon" />
          <div>
            <div className="stat-value">98%</div>
            <div className="stat-label">Successful Deals</div>
          </div>
        </div>
      </div>
    </div>
  );
}
