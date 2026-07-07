import { MockDatabase, EcoStay, TransportRide, LocalGuide, EcoAttraction, DiningSpot, HaorMetric, EmergencyAlert, CommunityPost } from "./types";

const INITIAL_DB: MockDatabase = {
  stays: [
    {
      id: "stay-1",
      title: "Novomera Eco-Resort & Spa",
      category: "Premium Eco Lodge",
      location: "Sreemangal",
      price: 8500,
      rating: 4.9,
      badge: "Plastic-Free Certified",
      image: "https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=600&q=80",
      description: "Nestled in the lush hills of Sreemangal, this resort features eco-lodges constructed from sustainable bamboo and local timber. Employs 100% solar heating and organic farming.",
      features: ["Solar Powered Hot Water", "Organic Organic Tea Garden Tours", "On-site Wetland Reservoir", "Complimentary Bicycle Hire"],
      ecoScore: 98,
      available: true
    },
    {
      id: "stay-2",
      title: "The Palace Luxury Resort",
      category: "Premium Resort",
      location: "Bahubal",
      price: 14000,
      rating: 4.8,
      badge: "Wildlife Friendly",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      description: "A gorgeous luxury estate surrounded by green tea slopes. Features modern luxury combined with strict local wildlife protection practices and Zero-Waste kitchens.",
      features: ["5-star Eco Luxury", "Protected Bird Forest Canopy", "Zero Single-use Plastic", "Electric Buggy Shuttles"],
      ecoScore: 94,
      available: true
    },
    {
      id: "stay-3",
      title: "Shanti Bari Eco Resort",
      category: "Boutique Wood Cabin",
      location: "Sreemangal",
      price: 4500,
      rating: 4.7,
      badge: "Local Community Owned",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
      description: "Traditional raised wood cabins designed in alignment with indigenous architecture. Wake up to the serene calls of forest birds and experience authentic local dining.",
      features: ["100% Local Bamboo Design", "Rainwater Harvesting Systems", "Traditional Clay Pot Cooking", "Indigenous Guide-Led Treks"],
      ecoScore: 99,
      available: true
    },
    {
      id: "stay-4",
      title: "Tanguar Lakeside Eco-Cottage",
      category: "Lakeside Wooden Cabin",
      location: "Tanguar Haor",
      price: 5200,
      rating: 4.8,
      badge: "Wetland Guarded",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
      description: "Positioned directly on the fringe of the gorgeous Tanguar Haor. Features wooden walkways over water, solar-charging arrays, and incredible balcony views of incoming migratory birds.",
      features: ["Direct Haor Water Access", "100% Solar-Powered Grid", "Locally Sourced Freshwater Catch", "Community Conservation Fund Partner"],
      ecoScore: 97,
      available: true
    }
  ],
  transport: [
    {
      id: "trans-1",
      title: "SylhetGreen Electric SUV",
      category: "Chauffeur Drive",
      location: "Sreemangal",
      price: 4500,
      rating: 4.9,
      badge: "Zero-Emission",
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
      description: "Premium silent electric vehicle suited for rough tea garden paths and highway commutes from Sylhet Osmani Airport. Comes with a professional naturalist driver.",
      fuelType: "Electric",
      capacity: 5,
      available: true
    },
    {
      id: "trans-2",
      title: "Tanguar Haor Wood-Boats",
      category: "Eco Wooden Cruise Boat",
      location: "Tanguar Haor",
      price: 12000,
      rating: 4.7,
      badge: "Solar Powered",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      description: "Traditional high-prow wooden cruiser crafted from local mahogany and equipped with solar-powered quiet electric propulsion. Highly safe, comfortable double bedrooms on deck.",
      fuelType: "Solar-Powered",
      capacity: 12,
      available: true
    },
    {
      id: "trans-3",
      title: "Ratargul Swamp Canoe",
      category: "Traditional Wooden Canoe",
      location: "Ratargul",
      price: 1500,
      rating: 4.8,
      badge: "Silent Oar Only",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
      description: "A traditional slim country-skiff hand-rowed by licensed local boatmen. It causes zero motor noise, preserving the nesting birds in the flooded forest sanctuary.",
      fuelType: "Manual Oar",
      capacity: 4,
      available: true
    },
    {
      id: "trans-4",
      title: "Sreemangal Off-Road Electric Bikes",
      category: "Adventure Rent-a-Bike",
      location: "Sreemangal",
      price: 1800,
      rating: 4.9,
      badge: "Carbon Neutral Self-Drive",
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
      description: "Fat-tire mountain e-bikes capable of gliding over rocky tea estate trails and sandy village tracks easily. Comes with custom offline GPS maps and high-capacity battery.",
      fuelType: "Electric Battery",
      capacity: 1,
      available: true
    }
  ],
  guides: [
    {
      id: "guide-1",
      name: "Sufian Ahmed",
      category: "Swamp Forest & Wildlife Specialist",
      location: "Ratargul",
      price: 2500,
      rating: 5.0,
      badge: "SREDA Certified",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      languages: ["Bengali", "English", "Sylheti"],
      experienceYears: 8,
      description: "Grown up on the edges of Ratargul, Sufian has registered over 140 species of native birds and has extensive knowledge of reptile behavior in flooded environments.",
      available: true
    },
    {
      id: "guide-2",
      name: "Zareen Tasnim",
      category: "Khasia Tribal Culture & Tea Garden Historian",
      location: "Sreemangal",
      price: 3000,
      rating: 4.9,
      badge: "Local Historian",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
      languages: ["Bengali", "English", "Khasia", "Sylheti"],
      experienceYears: 6,
      description: "Zareen connects tourists directly with indigenous forest communities. She specializes in local cultural dances, traditional tea harvesting, and historical land narratives.",
      available: true
    },
    {
      id: "guide-3",
      name: "Binoy Tripura",
      category: "Forest Trekking & Medicinal Botanist",
      location: "Sreemangal",
      price: 2000,
      rating: 4.8,
      badge: "Forest Ranger Vetted",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
      languages: ["Bengali", "Tripura Language", "Sylheti"],
      experienceYears: 12,
      description: "An expert in forest survival and medicinal flora. Binoy takes adventurers deep into Lawachara National Park and helps identify endangered tree species and local fauna.",
      available: true
    }
  ],
  attractions: [
    {
      id: "attr-1",
      title: "Ratargul Swamp Forest",
      category: "Freshwater Swamp Forest",
      location: "Ratargul",
      rating: 4.8,
      badge: "Must Visit",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
      description: "The only freshwater swamp forest in Bangladesh and one of the few in the world. Trees like Koroch and Hijol remain submerged in up to 15 feet of water in peak monsoon.",
      crowdLevel: "Moderate",
      mudIndex: "Very Muddy",
      bestSeason: "Monsoon (June to September)",
      conservationStatus: "Protected Wildlife Sanctuary"
    },
    {
      id: "attr-2",
      title: "Lalakhal (Shari River)",
      category: "Emerald Waterway",
      location: "Jaflong",
      rating: 4.9,
      badge: "Eco Protected",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
      description: "A gorgeous turquoise river carrying glacial sand down from the Jaintia Hills. Offers pristine swimming spots, clean air, and lush green hills lining both shores.",
      crowdLevel: "Low",
      mudIndex: "Dry",
      bestSeason: "Late Autumn to Winter (November to February)",
      conservationStatus: "Siltation Control Zone"
    },
    {
      id: "attr-3",
      title: "Tanguar Haor Wetland",
      category: "RAMSAR Wetland Site",
      location: "Tanguar Haor",
      rating: 4.9,
      badge: "RAMSAR Certified",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
      description: "A massive wetland ecosystem containing over 200 species of fish and hosting more than 100,000 migratory Siberian birds during winter months.",
      crowdLevel: "Low",
      mudIndex: "Moderate Muddy",
      bestSeason: "Monsoon for houseboats; Winter for birdwatching",
      conservationStatus: "RAMSAR Wetland of International Importance"
    }
  ],
  dining: [
    {
      id: "dining-1",
      title: "Nilkantha Tea Cabin",
      category: "Legendary Tea House",
      location: "Sreemangal",
      rating: 4.8,
      badge: "Original Inventor",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
      specialty: "7-Layer Tea",
      priceRange: "৳",
      description: "Home of Romesh Ram Gour's secret formula. Sip tea where layers of black, green, ginger, lemon, and white teas stay perfectly stacked inside a single glass.",
      isOrganic: true
    },
    {
      id: "dining-2",
      title: "Shatkora Cuisine Palace",
      category: "Authentic Sylhety Diner",
      location: "Sreemangal",
      rating: 4.7,
      badge: "Eco Gastronomy Award",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
      specialty: "Shatkora Beef & Freshwater Fish",
      priceRange: "৳৳",
      description: "Shatkora is a wild, citrus fruit unique to the Sylhet district. We cook the citrus rind with tender beef and local freshwater carp for a bitter, aromatic punch.",
      isOrganic: true
    },
    {
      id: "dining-3",
      title: "Khasia Hill Organic Kitchen",
      category: "Farm-to-Table Traditional",
      location: "Ratargul",
      rating: 4.9,
      badge: "100% Native Cooked",
      image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80",
      specialty: "Bamboo Chicken & Pan-roasted Betel leaf curry",
      priceRange: "৳৳",
      description: "Tucked inside Khasia territory, this cooperative features vegetables gathered directly from forest clearings and chicken slow-cooked in natural bamboo cylinders.",
      isOrganic: true
    }
  ],
  haor: {
    waterHeight: 12.4,
    monsoonWaterHeight: 12.4,
    winterWaterHeight: 1.8,
    currentStatus: "Monsoon Deep Water",
    policeAlert: "Lifevest mandates are actively in effect for all wooden houseboats. Night anchoring outside authorized stations is prohibited due to seasonal squalls.",
    safetyIndex: 94,
    boatRateRegulation: "Official Rate BDT 1,200/hr for country boats, BDT 12,000/24hrs for mid-size double decker houseboats."
  },
  alerts: [
    {
      id: "alert-1",
      title: "Monsoon Storm & Wave Surge Warning",
      severity: "danger",
      timestamp: "Today, 10:15 AM",
      description: "Sustained high winds over Tanguar Haor. All recreational boats are directed to dock near the Sunamganj harbor immediately until weather permits.",
      region: "Tanguar Haor",
      contactNumber: "+880-1711-234567"
    },
    {
      id: "alert-2",
      title: "Mud Trekking Warning",
      severity: "warning",
      timestamp: "Yesterday, 4:00 PM",
      description: "Heavy rainfall in Lawachara National Park trails has made the short trek slippery. Hiking boots and local naturalist support are heavily recommended.",
      region: "Sreemangal",
      contactNumber: "+880-1711-765432"
    },
    {
      id: "alert-3",
      title: "Ratargul High Visitor Density Alert",
      severity: "info",
      timestamp: "Today, 8:00 AM",
      description: "Extended canoe wait times expected due to local holiday crowds. Morning visits (6:00 AM - 8:30 AM) recommended for bird enthusiasts.",
      region: "Ratargul",
      contactNumber: "+880-1822-111222"
    }
  ],
  posts: [
    {
      id: "post-1",
      authorName: "Anika Rahman",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      title: "Looking for boat mates this Sunday!",
      content: "Hi everyone! I am booking a premium solar houseboat for Tanguar Haor this Sunday (2 days, 1 night). We are currently a group of 4 and looking for 4-6 more eco-minded travelers to split costs. Let's make this trip zero-waste together!",
      category: "rideshare",
      likes: 12,
      commentsCount: 5,
      timestamp: "2 Hours Ago",
      joinedCount: 4
    },
    {
      id: "post-2",
      authorName: "Rafi Chowdhury",
      authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      title: "Weekly Ratargul Forest Boundary Clean-Up",
      content: "Volunteers needed! We are hosting our weekly LNT plastic cleanup along the forest entry channels on Friday morning. Gloves, garbage sacks, and snacks will be provided by the SylhetGo local guide fund.",
      category: "event",
      likes: 24,
      commentsCount: 8,
      timestamp: "5 Hours Ago",
      joinedCount: 15
    },
    {
      id: "post-3",
      authorName: "Liam Davis",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      title: "Etiquette advice when visiting Khasia Punji villages?",
      content: "I am traveling to Sreemangal tomorrow and planning to visit some tribal betel leaf orchards. Are there specific local traditions or boundaries I should watch out for?",
      category: "question",
      likes: 8,
      commentsCount: 14,
      timestamp: "1 Day Ago"
    }
  ],
  bookings: []
};

const DB_KEY = "sylhetgo_local_db";

export function getDatabase(): MockDatabase {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    // Clone first to prevent mutations on the module-level singleton
    const clone = JSON.parse(JSON.stringify(INITIAL_DB));
    saveDatabase(clone);
    return clone;
  }
  try {
    const parsed = JSON.parse(data);
    if (!parsed.bookings) {
      parsed.bookings = [];
    }
    return parsed;
  } catch (e) {
    console.error("Error reading database", e);
    return JSON.parse(JSON.stringify(INITIAL_DB));
  }
}

export function saveDatabase(db: MockDatabase) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Stays CRUD
export function getStays(): EcoStay[] {
  return getDatabase().stays;
}
export function addStay(stay: Omit<EcoStay, "id">): EcoStay {
  const db = getDatabase();
  const newStay = { ...stay, id: `stay-${Date.now()}` };
  db.stays.push(newStay);
  saveDatabase(db);
  return newStay;
}
export function updateStay(id: string, updated: Partial<EcoStay>): boolean {
  const db = getDatabase();
  const idx = db.stays.findIndex(s => s.id === id);
  if (idx > -1) {
    db.stays[idx] = { ...db.stays[idx], ...updated };
    saveDatabase(db);
    return true;
  }
  return false;
}
export function deleteStay(id: string): boolean {
  const db = getDatabase();
  const initialLength = db.stays.length;
  db.stays = db.stays.filter(s => s.id !== id);
  saveDatabase(db);
  return db.stays.length < initialLength;
}

// Transport CRUD
export function getTransport(): TransportRide[] {
  return getDatabase().transport;
}
export function addTransport(ride: Omit<TransportRide, "id">): TransportRide {
  const db = getDatabase();
  const newRide = { ...ride, id: `trans-${Date.now()}` };
  db.transport.push(newRide);
  saveDatabase(db);
  return newRide;
}
export function updateTransport(id: string, updated: Partial<TransportRide>): boolean {
  const db = getDatabase();
  const idx = db.transport.findIndex(t => t.id === id);
  if (idx > -1) {
    db.transport[idx] = { ...db.transport[idx], ...updated };
    saveDatabase(db);
    return true;
  }
  return false;
}
export function deleteTransport(id: string): boolean {
  const db = getDatabase();
  const initialLength = db.transport.length;
  db.transport = db.transport.filter(t => t.id !== id);
  saveDatabase(db);
  return db.transport.length < initialLength;
}

// Guides CRUD
export function getGuides(): LocalGuide[] {
  return getDatabase().guides;
}
export function addGuide(guide: Omit<LocalGuide, "id">): LocalGuide {
  const db = getDatabase();
  const newGuide = { ...guide, id: `guide-${Date.now()}` };
  db.guides.push(newGuide);
  saveDatabase(db);
  return newGuide;
}
export function updateGuide(id: string, updated: Partial<LocalGuide>): boolean {
  const db = getDatabase();
  const idx = db.guides.findIndex(g => g.id === id);
  if (idx > -1) {
    db.guides[idx] = { ...db.guides[idx], ...updated };
    saveDatabase(db);
    return true;
  }
  return false;
}
export function deleteGuide(id: string): boolean {
  const db = getDatabase();
  const initialLength = db.guides.length;
  db.guides = db.guides.filter(g => g.id !== id);
  saveDatabase(db);
  return db.guides.length < initialLength;
}

// Attractions CRUD
export function getAttractions(): EcoAttraction[] {
  return getDatabase().attractions;
}
export function addAttraction(attraction: Omit<EcoAttraction, "id">): EcoAttraction {
  const db = getDatabase();
  const newAttr = { ...attraction, id: `attr-${Date.now()}` };
  db.attractions.push(newAttr);
  saveDatabase(db);
  return newAttr;
}
export function updateAttraction(id: string, updated: Partial<EcoAttraction>): boolean {
  const db = getDatabase();
  const idx = db.attractions.findIndex(a => a.id === id);
  if (idx > -1) {
    db.attractions[idx] = { ...db.attractions[idx], ...updated };
    saveDatabase(db);
    return true;
  }
  return false;
}
export function deleteAttraction(id: string): boolean {
  const db = getDatabase();
  const initialLength = db.attractions.length;
  db.attractions = db.attractions.filter(a => a.id !== id);
  saveDatabase(db);
  return db.attractions.length < initialLength;
}

// Dining CRUD
export function getDining(): DiningSpot[] {
  return getDatabase().dining;
}
export function addDining(spot: Omit<DiningSpot, "id">): DiningSpot {
  const db = getDatabase();
  const newSpot = { ...spot, id: `dining-${Date.now()}` };
  db.dining.push(newSpot);
  saveDatabase(db);
  return newSpot;
}
export function updateDining(id: string, updated: Partial<DiningSpot>): boolean {
  const db = getDatabase();
  const idx = db.dining.findIndex(d => d.id === id);
  if (idx > -1) {
    db.dining[idx] = { ...db.dining[idx], ...updated };
    saveDatabase(db);
    return true;
  }
  return false;
}
export function deleteDining(id: string): boolean {
  const db = getDatabase();
  const initialLength = db.dining.length;
  db.dining = db.dining.filter(d => d.id !== id);
  saveDatabase(db);
  return db.dining.length < initialLength;
}

// Haor Metrics
export function getHaorMetric(): HaorMetric {
  return getDatabase().haor;
}
export function updateHaorMetric(updated: Partial<HaorMetric>): HaorMetric {
  const db = getDatabase();
  db.haor = { ...db.haor, ...updated };
  saveDatabase(db);
  return db.haor;
}

// Alerts CRUD
export function getAlerts(): EmergencyAlert[] {
  return getDatabase().alerts;
}
export function addAlert(alert: Omit<EmergencyAlert, "id">): EmergencyAlert {
  const db = getDatabase();
  const newAlert = { ...alert, id: `alert-${Date.now()}` };
  db.alerts.unshift(newAlert); // Add to beginning of feed
  saveDatabase(db);
  return newAlert;
}
export function updateAlert(id: string, updated: Partial<EmergencyAlert>): boolean {
  const db = getDatabase();
  const idx = db.alerts.findIndex(a => a.id === id);
  if (idx > -1) {
    db.alerts[idx] = { ...db.alerts[idx], ...updated };
    saveDatabase(db);
    return true;
  }
  return false;
}
export function deleteAlert(id: string): boolean {
  const db = getDatabase();
  const initialLength = db.alerts.length;
  db.alerts = db.alerts.filter(a => a.id !== id);
  saveDatabase(db);
  return db.alerts.length < initialLength;
}

// Posts CRUD (Community)
export function getPosts(): CommunityPost[] {
  return getDatabase().posts;
}
export function addPost(post: Omit<CommunityPost, "id" | "likes" | "commentsCount" | "timestamp">): CommunityPost {
  const db = getDatabase();
  const newPost = {
    ...post,
    id: `post-${Date.now()}`,
    likes: 0,
    commentsCount: 0,
    timestamp: "Just Now"
  };
  db.posts.unshift(newPost);
  saveDatabase(db);
  return newPost;
}
export function updatePost(id: string, updated: Partial<CommunityPost>): boolean {
  const db = getDatabase();
  const idx = db.posts.findIndex(p => p.id === id);
  if (idx > -1) {
    db.posts[idx] = { ...db.posts[idx], ...updated };
    saveDatabase(db);
    return true;
  }
  return false;
}
export function deletePost(id: string): boolean {
  const db = getDatabase();
  const initialLength = db.posts.length;
  db.posts = db.posts.filter(p => p.id !== id);
  saveDatabase(db);
  return db.posts.length < initialLength;
}
