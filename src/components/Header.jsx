import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ChevronDown, Plus, Moon, Sun, MessageSquare, BarChart3, Bell, Sparkles } from 'lucide-react';

const locations = [
  'All Locations',
  'Beverly Hills, Los Angeles',
  'Malibu Coastline, CA',
  'Manhattan, New York',
  'Miami Beach, FL',
  'Seattle, WA',
  'San Francisco, CA'
];

export default function Header({
  searchTerm,
  setSearchTerm,
  selectedLocation,
  setSelectedLocation,
  theme,
  toggleTheme,
  onOpenSell,
  onOpenChats,
  onOpenDashboard,
  listings
}) {
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const locRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (locRef.current && !locRef.current.contains(event.target)) {
        setShowLocDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    const query = searchTerm.toLowerCase();
    const filtered = listings
      .filter(item => item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query))
      .slice(0, 5);
    setSuggestions(filtered);
  }, [searchTerm, listings]);

  const handleSuggestionClick = (title) => {
    setSearchTerm(title);
    setShowSuggestions(false);
  };

  return (
    <header className="header-wrapper glass-panel">
      <div className="container header-container">
        <a href="#" className="logo-container" onClick={(e) => { e.preventDefault(); setSearchTerm(''); setSelectedLocation('All Locations'); }}>
          <img src="/logo.svg" alt="OLX Luxe Logo" style={{ height: '38px', width: '38px', objectFit: 'contain', marginRight: '4px' }} />
          <span>OLX<span className="logo-highlight">Luxe</span></span>
        </a>
        <div className="search-section">
          <div className="location-dropdown-wrapper" ref={locRef}>
            <button className="location-button" onClick={() => setShowLocDropdown(!showLocDropdown)}>
              <span className="location-button-content">
                <MapPin size={16} className="logo-highlight" />
                {selectedLocation}
              </span>
              <ChevronDown size={14} style={{ transform: showLocDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {showLocDropdown && (
              <div className="location-dropdown glass-panel">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    className="location-option"
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowLocDropdown(false);
                    }}
                  >
                    <MapPin size={14} />
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Input with autocomplete */}
          <div className="search-bar-wrapper" ref={searchRef}>
            <div className="search-bar">
              <Search size={18} className="text-muted" />
              <input
                type="text"
                className="search-input"
                placeholder="Find luxury cars, houses, tech, watches..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions glass-panel">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(item.title)}
                  >
                    <span>{item.title}</span>
                    <span className="suggestion-category">{item.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="header-actions">
          {/* Theme Toggle */}
          <button className="action-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Messages shortcut */}
          <button className="action-btn" onClick={onOpenChats} title="My Chats">
            <MessageSquare size={18} />
            <span className="badge-dot"></span>
          </button>

          {/* Dashboard shortcut */}
          <button className="action-btn" onClick={onOpenDashboard} title="Seller Dashboard">
            <BarChart3 size={18} />
          </button>

          {/* Sell Button */}
          <button className="sell-btn" onClick={onOpenSell}>
            <Plus size={18} />
            <span>SELL</span>
          </button>

          {/* User Profile Avatar */}
          <button className="profile-widget" onClick={onOpenDashboard} title="My Profile">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="User profile"
              className="profile-avatar"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
