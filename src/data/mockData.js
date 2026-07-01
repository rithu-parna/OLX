export const mockCategories = [
  { id: 'all', name: 'All Categories', icon: 'Sparkles' },
  { id: 'auctions', name: 'VIP Auctions', icon: 'Trophy' },
  { id: 'cars', name: 'Cars & Motors', icon: 'Car' },
  { id: 'properties', name: 'Real Estate', icon: 'Home' },
  { id: 'electronics', name: 'Tech & Mobiles', icon: 'Smartphone' },
  { id: 'watches', name: 'Luxury Watches', icon: 'Watch' },
  { id: 'audio', name: 'Premium Audio', icon: 'Headphones' },
  { id: 'drones', name: 'Drones & Camera', icon: 'Camera' }
];

export const mockListings = [
  {
    id: 1,
    title: 'Porsche 911 Carrera S (Mamba Green Edition)',
    category: 'cars',
    price: 124500,
    condition: 'Excellent',
    location: 'Beverly Hills, Los Angeles',
    postedDate: '2 hours ago',
    description: 'Breathtaking Porsche 911 Carrera S in custom Mamba Green Metallic. Full leather interior in Club Truffle, Sport Chrono Package, Porsche Dynamic Light System Plus (PDLS+), and 20/21-inch Carrera Classic Wheels. Single owner, garage kept, full service history at Porsche DTLA.',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80'
    ],
    video: 'https://assets.mixkit.co/videos/preview/mixkit-red-sports-car-driving-fast-32608-large.mp4',
    featured: true,
    isAuction: true,
    seller: {
      name: 'Alexander Sterling',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      responseRate: '100%',
      listingsCount: 14,
      joined: 'Oct 2023'
    },
    stats: {
      views: 1240,
      clicks: 342,
      offers: 8
    },
    specs: {
      Year: '2022',
      Mileage: '12,500 mi',
      Fuel: 'Petrol',
      Transmission: 'Automatic (PDK)',
      Engine: '3.0L Twin-Turbo Flat-6'
    }
  },
  {
    id: 2,
    title: 'Ultra-Modern Architectural Oceanfront Villa',
    category: 'properties',
    price: 4850000,
    condition: 'New',
    location: 'Malibu Coastline, CA',
    postedDate: 'Yesterday',
    description: 'A masterpiece of contemporary architecture. This 4-bedroom, 5-bathroom villa offers floor-to-ceiling glass walls with panoramic ocean views, an infinity-edge pool, private beach access, a smart home automation system, and a 3-car glass garage. Sustainable solar energy setup integrated.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    ],
    video: 'https://assets.mixkit.co/videos/preview/mixkit-exterior-of-a-modern-house-41559-large.mp4',
    featured: true,
    seller: {
      name: 'Elite Realty Group',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      rating: 4.8,
      responseRate: '96%',
      listingsCount: 42,
      joined: 'Jan 2022'
    },
    stats: {
      views: 5410,
      clicks: 890,
      offers: 3
    },
    specs: {
      Bedrooms: '4',
      Bathrooms: '5',
      'Area (sqft)': '6,200',
      Furnished: 'Fully Furnished',
      Parking: '3 Car Garage'
    }
  },
  {
    id: 3,
    title: 'iPhone 15 Pro Max - Titanium Gray (1TB)',
    category: 'electronics',
    price: 1199,
    condition: 'Like New',
    location: 'Manhattan, New York',
    postedDate: '5 hours ago',
    description: 'Selling my iPhone 15 Pro Max 1TB in Titanium Gray. Condition is absolutely flawless, 100% battery health capacity. Includes original box, unused braided USB-C cable, and a premium leather Apple MagSafe case. Factory unlocked, AppleCare+ active until December 2026.',
    images: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1565630916779-e303be97b6f5?auto=format&fit=crop&w=1200&q=80'
    ],
    video: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-vertical-screen-41710-large.mp4',
    featured: false,
    seller: {
      name: 'Marcus Brody',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      responseRate: '100%',
      listingsCount: 2,
      joined: 'Mar 2024'
    },
    stats: {
      views: 312,
      clicks: 84,
      offers: 12
    },
    specs: {
      Storage: '1 TB',
      Color: 'Titanium Gray',
      Battery: '100% Health',
      Warranty: 'AppleCare+ Active',
      Status: 'Unlocked'
    }
  },
  {
    id: 4,
    title: 'Rolex Submariner Date "Kermit" 126610LV',
    category: 'watches',
    price: 15400,
    condition: 'Like New',
    location: 'Miami Beach, FL',
    postedDate: '3 days ago',
    description: 'Up for sale is the iconic Rolex Submariner Date 126610LV with green cerachrom bezel and black dial (Kermit/Starbucks). 2023 model, comes complete with box, papers, warranty card, and green tag. Worn only a handful of times, zero signs of wear or scratches.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=1200&q=80'
    ],
    video: 'https://assets.mixkit.co/videos/preview/mixkit-wrist-watch-in-close-up-42099-large.mp4',
    featured: true,
    isAuction: true,
    seller: {
      name: 'Victoria Luxe Watches',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      responseRate: '98%',
      listingsCount: 29,
      joined: 'Feb 2021'
    },
    stats: {
      views: 2315,
      clicks: 412,
      offers: 5
    },
    specs: {
      Brand: 'Rolex',
      Model: 'Submariner',
      Year: '2023',
      Movement: 'Automatic 3235',
      WaterProof: '300m / 1000ft'
    }
  },
  {
    id: 5,
    title: 'Sony WH-1000XM5 Wireless Headphones',
    category: 'audio',
    price: 260,
    condition: 'Good',
    location: 'Seattle, WA',
    postedDate: '1 day ago',
    description: 'Selling my Sony XM5 noise-canceling headphones. Perfect working order and amazing battery life. There are minor cosmetic marks on the headband, but the earcups are fresh and clean. Comes with the premium carrying case, headphone jack cable, and charging wire.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80'
    ],
    video: 'https://assets.mixkit.co/videos/preview/mixkit-headphones-lying-on-a-table-42352-large.mp4',
    featured: false,
    seller: {
      name: 'Daniel Chen',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      rating: 4.7,
      responseRate: '91%',
      listingsCount: 5,
      joined: 'Nov 2022'
    },
    stats: {
      views: 180,
      clicks: 45,
      offers: 6
    },
    specs: {
      Brand: 'Sony',
      Color: 'Silver / Platinum',
      NoiseCancel: 'Industry Leading ANC',
      BatteryLife: '30 Hours',
      Connectivity: 'Bluetooth 5.2'
    }
  },
  {
    id: 6,
    title: 'DJI Mavic 3 Pro Cine Premium Combo',
    category: 'drones',
    price: 3650,
    condition: 'Like New',
    location: 'San Francisco, CA',
    postedDate: '4 hours ago',
    description: 'Professional cinema drone kit. DJI Mavic 3 Pro Cine with built-in 1TB SSD, support for Apple ProRes 422 HQ. Includes the DJI RC Pro screen controller, 3 Intelligent Flight Batteries, Battery Charging Hub, ND Filters Set (ND8/16/32/64), and DJI Shoulder Bag. Zero crashes, pristine condition.',
    images: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80'
    ],
    video: 'https://assets.mixkit.co/videos/preview/mixkit-flying-a-drone-over-a-forest-42367-large.mp4',
    featured: true,
    seller: {
      name: 'Skyline Productions',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      responseRate: '100%',
      listingsCount: 8,
      joined: 'Jun 2023'
    },
    stats: {
      views: 730,
      clicks: 120,
      offers: 4
    },
    specs: {
      Brand: 'DJI',
      Camera: 'Triple lens Hasselblad',
      VideoRes: '5.1K Apple ProRes',
      SSDSize: '1TB Built-in',
      FlightTime: '43 mins per battery'
    }
  }
];

export const mockChats = [
  {
    id: 1,
    listingId: 3,
    sellerName: 'Marcus Brody',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    itemTitle: 'iPhone 15 Pro Max - Titanium Gray (1TB)',
    itemPrice: 1199,
    status: 'online',
    messages: [
      { sender: 'user', text: 'Hello, is the iPhone 15 Pro Max still available?', time: 'Yesterday' },
      { sender: 'seller', text: 'Hi! Yes, it is still available. I have a couple of people interested, but no deposit yet.', time: 'Yesterday' },
      { sender: 'user', text: 'Great. Would you accept $1100 cash today?', time: 'Today, 10:15 AM' },
      { sender: 'seller', text: 'I can do $1150. That is my absolute rock bottom. The condition is literally new.', time: 'Today, 10:18 AM' }
    ]
  },
  {
    id: 2,
    listingId: 5,
    sellerName: 'Daniel Chen',
    sellerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    itemTitle: 'Sony WH-1000XM5 Wireless Headphones',
    itemPrice: 260,
    status: 'offline',
    messages: [
      { sender: 'user', text: 'Hey Daniel, do you have the receipt for the Sony XM5s?', time: '2 days ago' },
      { sender: 'seller', text: 'Hey there. Let me check my email, I think I bought them online from Best Buy. I will send a screenshot if I find it.', time: '2 days ago' }
    ]
  }
];
