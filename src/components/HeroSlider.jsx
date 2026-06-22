import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export default function HeroSlider({ featuredListings, onSelectListing }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered || featuredListings.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredListings.length);
    }, 5000);
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

  return (
    <div 
      className="hero-slider-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      {featuredListings.map((item, index) => {
        const isActive = index === currentIndex;
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
              <span className="slide-badge">Featured {item.category.replace(/^\w/, (c) => c.toUpperCase())}</span>
              <h2 className="slide-title">{item.title}</h2>
              <p className="slide-desc">{item.description}</p>
              <button 
                className="slide-btn"
                onClick={() => onSelectListing(item)}
              >
                <span>Explore Deal • ${item.price.toLocaleString()}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        );
      })}

      {/* Navigation Buttons */}
      <button className="slider-nav-btn prev" onClick={handlePrev} aria-label="Previous Slide">
        <ChevronLeft size={24} />
      </button>
      <button className="slider-nav-btn next" onClick={handleNext} aria-label="Next Slide">
        <ChevronRight size={24} />
      </button>

      {/* Indicator Dots */}
      <div className="slider-dots">
        {featuredListings.map((_, index) => (
          <button
            key={index}
            className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
