import React from 'react';
import { Sparkles, Car, Home, Smartphone, Watch, Headphones, Camera } from 'lucide-react';

const iconMap = {
  Sparkles,
  Car,
  Home,
  Smartphone,
  Watch,
  Headphones,
  Camera
};

export default function CategoryChips({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="categories-wrapper">
      {categories.map((cat) => {
        const IconComponent = iconMap[cat.icon] || Sparkles;
        const isActive = cat.id === selectedCategory;
        
        return (
          <button
            key={cat.id}
            className={`category-chip ${isActive ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <IconComponent size={16} className={isActive ? 'category-chip-active-icon' : ''} />
            <span>{cat.name}</span>
            {isActive && <span className="active-chip-indicator" />}
          </button>
        );
      })}
    </div>
  );
}
