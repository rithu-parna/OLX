import React from 'react';
import { Sparkles, Car, Home, Smartphone, Watch, Headphones, Camera, ChevronRight } from 'lucide-react';

const iconMap = {
  Sparkles,
  Car,
  Home,
  Smartphone,
  Watch,
  Headphones,
  Camera
};

const categoryListingsCounts = {
  all: 'View All',
  cars: '2,450+ Listings',
  properties: '1,890+ Listings',
  electronics: '3,210+ Listings',
  watches: '950+ Listings',
  audio: '760+ Listings',
  drones: '680+ Listings'
};

export default function CategoryChips({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="categories-section-container">
      <div className="categories-wrapper">
        {categories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Sparkles;
          const isActive = cat.id === selectedCategory;
          const subtitle = categoryListingsCounts[cat.id] || 'Explore Ads';
          
          return (
            <button
              key={cat.id}
              className={`category-chip ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <div className="category-chip-icon-wrapper">
                <IconComponent size={18} className="category-icon" />
              </div>
              <div className="category-chip-text">
                <span className="category-chip-name">{cat.name}</span>
                <span className="category-chip-subtitle">{subtitle}</span>
              </div>
              {isActive && <span className="active-chip-indicator" />}
            </button>
          );
        })}
      </div>
      <div className="categories-scroll-arrow">
        <ChevronRight size={16} />
      </div>
    </div>
  );
}
