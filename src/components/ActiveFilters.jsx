import React from 'react';
import { X, Filter } from 'lucide-react';

export default function ActiveFilters({
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  selectedConditions,
  setSelectedConditions,
  videoOnly,
  setVideoOnly,
  searchTerm,
  setSearchTerm,
  categories
}) {
  const hasCategory = selectedCategory !== 'all';
  const hasLocation = selectedLocation !== 'All Locations';
  const hasPrice = minPrice > 0 || maxPrice < 150000;
  const hasConditions = selectedConditions.length > 0;
  const hasVideo = videoOnly;
  const hasSearch = searchTerm.trim().length > 0;

  const anyActive = hasCategory || hasLocation || hasPrice || hasConditions || hasVideo || hasSearch;

  if (!anyActive) return null;

  const activeCategoryName = categories.find(c => c.id === selectedCategory)?.name || selectedCategory;

  const handleClearAll = () => {
    setSelectedCategory('all');
    setSelectedLocation('All Locations');
    setMinPrice(0);
    setMaxPrice(150000);
    setSelectedConditions([]);
    setVideoOnly(false);
    setSearchTerm('');
  };

  return (
    <div className="active-filters-bar glass-panel animate-fade-in">
      <div className="active-filters-label">
        <Filter size={14} className="logo-highlight" />
        <span>Active Filters:</span>
      </div>

      <div className="active-filters-list">
        {/* Search Query Chip */}
        {hasSearch && (
          <div className="active-filter-chip">
            <span>Query: "{searchTerm}"</span>
            <button className="clear-chip-btn" onClick={() => setSearchTerm('')}>
              <X size={12} />
            </button>
          </div>
        )}

        {/* Category Chip */}
        {hasCategory && (
          <div className="active-filter-chip">
            <span>Category: {activeCategoryName}</span>
            <button className="clear-chip-btn" onClick={() => setSelectedCategory('all')}>
              <X size={12} />
            </button>
          </div>
        )}

        {/* Location Chip */}
        {hasLocation && (
          <div className="active-filter-chip">
            <span>Location: {selectedLocation}</span>
            <button className="clear-chip-btn" onClick={() => setSelectedLocation('All Locations')}>
              <X size={12} />
            </button>
          </div>
        )}

        {/* Price Chip */}
        {hasPrice && (
          <div className="active-filter-chip">
            <span>Price: ${minPrice.toLocaleString()} - ${maxPrice >= 150000 ? '150k+' : maxPrice.toLocaleString()}</span>
            <button className="clear-chip-btn" onClick={() => { setMinPrice(0); setMaxPrice(150000); }}>
              <X size={12} />
            </button>
          </div>
        )}

        {/* Conditions Chips */}
        {hasConditions && selectedConditions.map(cond => (
          <div className="active-filter-chip" key={cond}>
            <span>Condition: {cond}</span>
            <button 
              className="clear-chip-btn" 
              onClick={() => setSelectedConditions(selectedConditions.filter(c => c !== cond))}
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {/* Video Tour Chip */}
        {hasVideo && (
          <div className="active-filter-chip">
            <span>With Video Tour</span>
            <button className="clear-chip-btn" onClick={() => setVideoOnly(false)}>
              <X size={12} />
            </button>
          </div>
        )}

        {/* Clear All Trigger */}
        <button className="clear-all-filters-btn" onClick={handleClearAll}>
          Clear All
        </button>
      </div>
    </div>
  );
}
