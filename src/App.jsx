import React, { useState, useEffect } from 'react';
import { mockListings, mockCategories, mockChats } from './data/mockData';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import CategoryChips from './components/CategoryChips';
import FilterPanel from './components/FilterPanel';
import ListingCard from './components/ListingCard';
import DetailView from './components/DetailView';
import SellModal from './components/SellModal';
import ChatInbox from './components/ChatInbox';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import ActiveFilters from './components/ActiveFilters';
import { Sparkles } from 'lucide-react';

export default function App() {
  // Main Data States
  const [listings, setListings] = useState(mockListings);
  const [chats, setChats] = useState(mockChats);

  // App settings/modes
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(150000);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [videoOnly, setVideoOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Modals & Panels States
  const [selectedListing, setSelectedListing] = useState(null);
  const [savedListingIds, setSavedListingIds] = useState([]);
  
  const [showSellModal, setShowSellModal] = useState(false);
  const [showChatsDrawer, setShowChatsDrawer] = useState(false);
  const [showDashboardDrawer, setShowDashboardDrawer] = useState(false);

  const [loading, setLoading] = useState(true);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Add mock ad views count on select
  const handleSelectListing = (listing) => {
    setListings(prevListings =>
      prevListings.map(item =>
        item.id === listing.id
          ? { 
              ...item, 
              stats: { 
                ...item.stats, 
                views: (item.stats?.views || 0) + 1, 
                clicks: (item.stats?.clicks || 0) + 1 
              } 
            }
          : item
      )
    );
    // Open detail view modal
    setSelectedListing({
      ...listing,
      stats: {
        ...listing.stats,
        views: (listing.stats?.views || 0) + 1,
        clicks: (listing.stats?.clicks || 0) + 1
      }
    });
  };

  // Toggle saving listings
  const handleToggleSave = (id) => {
    if (savedListingIds.includes(id)) {
      setSavedListingIds(savedListingIds.filter(savedId => savedId !== id));
    } else {
      setSavedListingIds([...savedListingIds, id]);
    }
  };

  // Create new listing
  const handlePublishAd = (newAd) => {
    setListings([newAd, ...listings]);
  };

  // Delete listing
  const handleDeleteListing = (id) => {
    setListings(listings.filter(item => item.id !== id));
    if (selectedListing && selectedListing.id === id) {
      setSelectedListing(null);
    }
  };

  // Reset all active filters
  const handleResetFilters = () => {
    setMinPrice(0);
    setMaxPrice(150000);
    setSelectedConditions([]);
    setVideoOnly(false);
    setSearchTerm('');
    setSelectedLocation('All Locations');
    setSelectedCategory('all');
  };

  // Chat message submission from inside Detail View
  const handleSendChatMessage = (listingId, text) => {
    const targetListing = listings.find(item => item.id === listingId);
    if (!targetListing) return;

    // Check if chat conversation already exists
    const existingChat = chats.find(c => c.listingId === listingId);

    if (existingChat) {
      setChats(prevChats => 
        prevChats.map(c => 
          c.id === existingChat.id
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { sender: 'user', text, time: 'Just now' }
                ]
              }
            : c
        )
      );
    } else {
      // Create new chat log
      const newChat = {
        id: Date.now(),
        listingId: listingId,
        sellerName: targetListing.seller.name,
        sellerAvatar: targetListing.seller.avatar,
        itemTitle: targetListing.title,
        itemPrice: targetListing.price,
        status: 'online',
        messages: [
          { sender: 'user', text, time: 'Just now' }
        ]
      };
      setChats([newChat, ...chats]);
    }
  };

  // Chat message submission inside the global Inbox drawer
  const handleInboxSendMessage = (chatId, text) => {
    setChats(prevChats =>
      prevChats.map(c =>
        c.id === chatId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { sender: 'user', text, time: 'Just now' }
              ]
            }
          : c
      )
    );

    // Simulated reply from the seller depending on category
    setTimeout(() => {
      setChats(prevChats =>
        prevChats.map(c => {
          if (c.id === chatId) {
            // Find listing category to make reply realistic
            const listing = listings.find(l => l.id === c.listingId) || { category: 'cars' };
            const replies = {
              cars: "I can arrange a viewing at DTLA this Saturday. Will you be available?",
              properties: "The price is slightly negotiable for serious buyers. Let me know if you want to request a viewing.",
              electronics: "Yes, battery capacity is 100% and it works perfectly. Can we meet tomorrow?",
              watches: "I can meet at a secure bank for transaction. Original box and receipt are verified.",
              audio: "I can ship via FedEx if you cover shipping costs.",
              drones: "Yes, it supports Apple ProRes and is in pristine condition."
            };
            const defaultReply = "Thanks for your offer. Let me check and get back to you soon.";
            const replyText = replies[listing.category] || defaultReply;

            return {
              ...c,
              messages: [
                ...c.messages,
                { sender: 'seller', text: replyText, time: 'Just now' }
              ]
            };
          }
          return c;
        })
      );
    }, 1500);
  };

  // Filter & Sort Logic
  const filteredListings = listings.filter(item => {
    // 1. Search Query Filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchDesc = item.description.toLowerCase().includes(query);
      const matchCat = item.category.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    // 2. Location Filter
    if (selectedLocation !== 'All Locations') {
      if (item.location !== selectedLocation) return false;
    }

    // 3. Category Filter
    if (selectedCategory !== 'all') {
      if (item.category !== selectedCategory) return false;
    }

    // 4. Price range Filter
    // Allow Malibu villa to exceed maxPrice cap limit if filter is set to default max limit
    if (item.price < minPrice || (item.price > maxPrice && maxPrice < 150000)) {
      return false;
    }

    // 5. Condition Filter
    if (selectedConditions.length > 0) {
      if (!selectedConditions.includes(item.condition)) return false;
    }

    // 6. Video attached Filter
    if (videoOnly) {
      if (!item.video) return false;
    }

    return true;
  });

  // Sort
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'featured') {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    }
    if (sortBy === 'priceLow') return a.price - b.price;
    if (sortBy === 'priceHigh') return b.price - a.price;
    if (sortBy === 'newest') return b.id - a.id;
    return 0;
  });

  const featuredListings = listings.filter(item => item.featured);

  if (loading) {
    return (
      <div className="overall-preloader">
        <div className="preloader-content">
          <div className="preloader-logo-wrapper">
            <img src="/logo.svg" className="preloader-logo" alt="OLX Luxe" />
            <div className="preloader-glow"></div>
          </div>
          <h1 className="preloader-title">OLX <span className="logo-highlight">Luxe</span></h1>
          <p className="preloader-subtitle">Loading Luxury Marketplace...</p>
          <div className="preloader-bar-wrapper">
            <div className="preloader-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top Header */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenSell={() => setShowSellModal(true)}
        onOpenChats={() => setShowChatsDrawer(true)}
        onOpenDashboard={() => setShowDashboardDrawer(true)}
        listings={listings}
      />

      <main className="container animate-fade-in" style={{ flex: 1 }}>
        {/* Banner carousel slider */}
        <HeroSlider 
          featuredListings={featuredListings} 
          onSelectListing={handleSelectListing}
        />

        {/* Category horizontal scrolling selector */}
        <CategoryChips
          categories={mockCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Active Filters Display Bar */}
        <ActiveFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          selectedConditions={selectedConditions}
          setSelectedConditions={setSelectedConditions}
          videoOnly={videoOnly}
          setVideoOnly={setVideoOnly}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categories={mockCategories}
        />

        {/* Filters Sidebar & Ads Grid Container */}
        <div className="main-content-layout">
          <FilterPanel
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            selectedConditions={selectedConditions}
            setSelectedConditions={setSelectedConditions}
            videoOnly={videoOnly}
            setVideoOnly={setVideoOnly}
            onReset={handleResetFilters}
          />

          <div className="listings-grid-section">
            <div className="grid-header">
              <h2 className="grid-title">
                {selectedCategory === 'all' 
                  ? 'Trending Offers' 
                  : `${mockCategories.find(c => c.id === selectedCategory)?.name || 'Filtered Listings'}`
                }
              </h2>
              
              <div className="sort-select-wrapper">
                <span className="sort-label">Sort by</span>
                <select 
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured Ads</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="newest">Newest Listed</option>
                </select>
              </div>
            </div>

            {sortedListings.length === 0 ? (
              <div className="empty-state glass-panel animate-fade-in">
                <div className="lottie-svg-wrapper">
                  <svg className="no-data-svg" viewBox="0 0 200 200" width="160" height="160">
                    <defs>
                      <linearGradient id="svgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    {/* Background floating circles */}
                    <circle cx="100" cy="100" r="80" fill="url(#svgGrad)" />
                    <circle className="pulse-ring" cx="100" cy="100" r="60" fill="none" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                    <circle className="pulse-ring-slow" cx="100" cy="100" r="40" fill="none" stroke="var(--color-secondary)" strokeWidth="1" opacity="0.3" />
                    
                    {/* Box outline */}
                    <path className="floating-box" d="M70,90 L100,75 L130,90 L130,120 L100,135 L70,120 Z" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5" strokeLinejoin="round" />
                    <path className="floating-box" d="M70,90 L100,105 L130,90 M100,105 L100,135" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinejoin="round" opacity="0.7" />
                    
                    {/* Magnifying Glass */}
                    <g className="searching-lens">
                      <circle cx="120" cy="70" r="16" fill="var(--bg-secondary)" stroke="var(--color-primary)" strokeWidth="3" />
                      <line x1="131" y1="81" x2="148" y2="98" stroke="var(--color-primary)" strokeWidth="3.5" strokeLinecap="round" />
                      <circle cx="116" cy="66" r="6" fill="none" stroke="var(--color-secondary)" strokeWidth="1.5" opacity="0.5" />
                    </g>
                  </svg>
                </div>
                <h3 className="empty-title">No Ads Found</h3>
                <p className="empty-desc">
                  Try adjusting your filters, modifying your search, or resetting price ranges.
                </p>
                <button className="reset-filters-btn" onClick={handleResetFilters} style={{ width: 'auto', padding: '10px 24px' }}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="listings-grid">
                {sortedListings.map((item) => (
                  <ListingCard
                    key={item.id}
                    listing={item}
                    onSelect={handleSelectListing}
                    isSaved={savedListingIds.includes(item.id)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <Footer />

      {/* MODAL OVERLAYS */}
      
      {/* 1. Detail View Modal */}
      {selectedListing && (
        <DetailView
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onSendChatMessage={handleSendChatMessage}
        />
      )}

      {/* 2. Sell Listing Wizard Modal */}
      {showSellModal && (
        <SellModal
          onClose={() => setShowSellModal(false)}
          onPublish={handlePublishAd}
        />
      )}

      {/* 3. Messaging Inbox Drawer */}
      <ChatInbox
        isOpen={showChatsDrawer}
        onClose={() => setShowChatsDrawer(false)}
        chats={chats}
        onSendMessage={handleInboxSendMessage}
        onSelectListing={handleSelectListing}
        listings={listings}
      />

      {/* 4. Seller Hub & Analytics Drawer */}
      <Dashboard
        isOpen={showDashboardDrawer}
        onClose={() => setShowDashboardDrawer(false)}
        userListings={listings.filter(item => item.seller.name === 'Victoria Luxe Watches')}
        onDeleteListing={handleDeleteListing}
      />
    </>
  );
}
