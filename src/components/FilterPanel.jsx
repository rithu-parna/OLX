import React from 'react';
import { Filter, Video, RotateCcw } from 'lucide-react';

export default function FilterPanel({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  selectedConditions,
  setSelectedConditions,
  videoOnly,
  setVideoOnly,
  onReset
}) {
  const maxLimit = 150000; // Cap limit for price range slider (excluding Malibu Villa which is 4.8M)
  
  const handleMinSlider = (e) => {
    const value = Math.min(Number(e.target.value), maxPrice - 1000);
    setMinPrice(value);
  };

  const handleMaxSlider = (e) => {
    const value = Math.max(Number(e.target.value), minPrice + 1000);
    setMaxPrice(value);
  };

  const handleConditionToggle = (condition) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter(c => c !== condition));
    } else {
      setSelectedConditions([...selectedConditions, condition]);
    }
  };

  // Calculate percentage for dual range slider track styling
  const minPercent = (minPrice / maxLimit) * 100;
  const maxPercent = (maxPrice / maxLimit) * 100;

  return (
    <aside className="filters-panel glass-panel">
      <h3 className="filter-title">
        <Filter size={16} className="logo-highlight" />
        Advanced Filters
      </h3>

      {/* Price Range Filter */}
      <div className="filter-group">
        <h4 className="filter-title" style={{ fontSize: '13px', marginBottom: '8px' }}>Price Range (Up to $150k)</h4>
        
        <div className="price-slider-container">
          <div className="price-inputs">
            <div className="price-input-box">
              <label>Min</label>
              <div className="price-box-wrapper">
                <span className="price-currency">$</span>
                <input
                  type="number"
                  className="price-input-field"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                />
              </div>
            </div>
            <div className="price-input-box">
              <label>Max</label>
              <div className="price-box-wrapper">
                <span className="price-currency">$</span>
                <input
                  type="number"
                  className="price-input-field"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Math.max(minPrice, Number(e.target.value)))}
                />
              </div>
            </div>
          </div>

          {/* Visual Dual Slider */}
          <div className="range-slider-visual">
            <div 
              className="range-slider-bar" 
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`
              }}
            ></div>
          </div>
          <div className="range-slider-input-group">
            <input
              type="range"
              min="0"
              max={maxLimit}
              step="500"
              value={minPrice}
              onChange={handleMinSlider}
              className="range-slider-input"
            />
            <input
              type="range"
              min="0"
              max={maxLimit}
              step="500"
              value={maxPrice}
              onChange={handleMaxSlider}
              className="range-slider-input"
            />
          </div>
        </div>
      </div>

      {/* Conditions Checklist */}
      <div className="filter-group">
        <h4 className="filter-title" style={{ fontSize: '13px', marginBottom: '12px' }}>Condition</h4>
        <div>
          {['New', 'Like New', 'Excellent', 'Good'].map((condition) => (
            <label key={condition} className="checkbox-option">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={selectedConditions.includes(condition)}
                onChange={() => handleConditionToggle(condition)}
              />
              <span>{condition}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Video Attached Filter Toggle */}
      <div className="filter-group">
        <div className="switch-wrapper" onClick={() => setVideoOnly(!videoOnly)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Video size={16} className="logo-highlight" />
            <span className="switch-label">Video Tour Only</span>
          </div>
          <div className="switch-control-wrapper">
            <input
              type="checkbox"
              className="switch-checkbox"
              checked={videoOnly}
              onChange={() => {}} // Controlled by wrapper click
            />
            <div className="switch-control"></div>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button className="reset-filters-btn" onClick={onReset}>
        <RotateCcw size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
        Reset Filters
      </button>
    </aside>
  );
}
