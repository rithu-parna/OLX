import React from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

export default function FilterPanel({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  selectedConditions,
  setSelectedConditions,
  selectedLocation,
  setSelectedLocation,
  onReset
}) {
  const maxLimit = 150000;
  
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

  const minPercent = (minPrice / maxLimit) * 100;
  const maxPercent = (maxPrice / maxLimit) * 100;

  // Curated heights for pricing density wave
  const densityHeights = [10, 18, 30, 48, 62, 75, 90, 80, 70, 82, 95, 60, 52, 40, 30, 25, 18, 12, 6, 4];

  return (
    <aside className="filters-panel glass-panel">
      <div className="filter-header-row">
        <h3 className="filter-panel-title">
          <SlidersHorizontal size={14} className="filter-header-icon" />
          <span>Advanced Filters</span>
        </h3>
        <button className="clear-all-filters-btn" onClick={onReset}>
          Clear All
        </button>
      </div>

      {/* Price Range Filter */}
      <div className="filter-group">
        <h4 className="filter-group-title">Price Range (Up to $150k)</h4>
        
        {/* Price Label indicators */}
        <div className="price-labels-row">
          <span>$0</span>
          <span className="current-max-price">${maxPrice.toLocaleString()}</span>
        </div>

        <div className="price-slider-wrapper">
          {/* Wave/Density Histogram Chart */}
          <div className="price-density-chart">
            {densityHeights.map((height, idx) => {
              const barPercent = (idx / densityHeights.length) * 100;
              const isActive = barPercent >= minPercent && barPercent <= maxPercent;
              return (
                <div 
                  key={idx} 
                  className={`density-bar ${isActive ? 'active' : ''}`}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>

          {/* Dual Range Sliders */}
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
              step="1000"
              value={minPrice}
              onChange={handleMinSlider}
              className="range-slider-input"
            />
            <input
              type="range"
              min="0"
              max={maxLimit}
              step="1000"
              value={maxPrice}
              onChange={handleMaxSlider}
              className="range-slider-input"
            />
          </div>
        </div>
      </div>

      {/* Conditions Section */}
      <div className="filter-group">
        <h4 className="filter-group-title">Condition</h4>
        <div className="condition-pills-group">
          <button 
            className={`condition-pill ${selectedConditions.length === 0 ? 'active' : ''}`}
            onClick={() => setSelectedConditions([])}
          >
            All
          </button>
          {['New', 'Like New', 'Excellent', 'Good'].map((condition) => {
            const isActive = selectedConditions.includes(condition);
            return (
              <button
                key={condition}
                className={`condition-pill ${isActive ? 'active' : ''}`}
                onClick={() => handleConditionToggle(condition)}
              >
                {condition}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location Selector */}
      <div className="filter-group">
        <h4 className="filter-group-title">Location</h4>
        <div className="location-select-wrapper">
          <select 
            value={selectedLocation || ''} 
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="location-select-field"
          >
            <option value="">All Locations</option>
            <option value="Miami, FL">Miami, FL</option>
            <option value="Los Angeles, CA">Los Angeles, CA</option>
            <option value="New York, NY">New York, NY</option>
            <option value="San Francisco, CA">San Francisco, CA</option>
          </select>
          <ChevronDown size={14} className="dropdown-arrow-icon" />
        </div>
      </div>
    </aside>
  );
}
