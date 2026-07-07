import React, { createContext, useContext, useState } from "react";
import { MockDatabase, EcoStay, TransportRide, LocalGuide, EcoAttraction, DiningSpot, HaorMetric, EmergencyAlert, CommunityPost, EcoBooking } from "./types";
import { getDatabase, saveDatabase } from "./db";

// Fallback initial database in case local db helper can't resolve
const INITIAL_DB_FALLBACK: MockDatabase = {
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
    }
  ],
  dining: [],
  haor: {
    waterHeight: 12.4,
    monsoonWaterHeight: 12.4,
    winterWaterHeight: 1.8,
    currentStatus: "Monsoon Deep Water",
    policeAlert: "Lifevest mandates are actively in effect for all wooden houseboats. Night anchoring outside authorized stations is prohibited due to seasonal squalls.",
    safetyIndex: 94,
    boatRateRegulation: "Official Rate BDT 1,200/hr for country boats, BDT 12,000/24hrs for mid-size double decker houseboats."
  },
  alerts: [],
  posts: [],
  bookings: []
};

interface DBContextType {
  db: MockDatabase;
  stays: EcoStay[];
  transport: TransportRide[];
  guides: LocalGuide[];
  attractions: EcoAttraction[];
  dining: DiningSpot[];
  haor: HaorMetric;
  alerts: EmergencyAlert[];
  posts: CommunityPost[];
  bookings: EcoBooking[];
  
  addStay: (stay: Omit<EcoStay, "id" | "rating" | "ecoScore" | "available">) => void;
  updateStay: (id: string, updated: Partial<EcoStay>) => void;
  deleteStay: (id: string) => void;
  
  addTransport: (ride: Omit<TransportRide, "id" | "rating" | "available" | "badge">) => void;
  updateTransport: (id: string, updated: Partial<TransportRide>) => void;
  deleteTransport: (id: string) => void;
  
  addGuide: (guide: Omit<LocalGuide, "id" | "rating" | "available" | "badge">) => void;
  updateGuide: (id: string, updated: Partial<LocalGuide>) => void;
  deleteGuide: (id: string) => void;
  toggleGuideVerification: (id: string) => void;
  
  addAttraction: (attraction: Omit<EcoAttraction, "id" | "rating">) => void;
  updateAttraction: (id: string, updated: Partial<EcoAttraction>) => void;
  deleteAttraction: (id: string) => void;
  
  updateHaor: (updated: Partial<HaorMetric>) => void;
  resetDatabase: () => void;

  addAlert: (alert: Omit<EmergencyAlert, "id">) => void;
  deleteAlert: (id: string) => void;
  
  addPost: (post: Omit<CommunityPost, "id" | "likes" | "commentsCount" | "timestamp">) => void;
  deletePost: (id: string) => void;
  likePost: (id: string) => void;
  updatePost: (id: string, updated: Partial<CommunityPost>) => void;

  addBooking: (booking: Omit<EcoBooking, "id" | "status" | "timestamp">) => void;
  updateBookingStatus: (id: string, status: "Pending" | "Approved" | "Rejected", paymentStatus?: "Unpaid" | "Paid/Verifying" | "Verified") => void;
  deleteBooking: (id: string) => void;
}

const DBContext = createContext<DBContextType | undefined>(undefined);

export function DBProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<MockDatabase>(() => {
    let initialDb: MockDatabase;
    try {
      initialDb = JSON.parse(JSON.stringify(getDatabase()));
    } catch (e) {
      console.error("Error loading initial DB, using fallback", e);
      initialDb = JSON.parse(JSON.stringify(INITIAL_DB_FALLBACK));
    }

    // Ensure all array fields are defensively initialized to empty arrays if missing
    if (!initialDb.stays) initialDb.stays = [];
    if (!initialDb.transport) initialDb.transport = [];
    if (!initialDb.guides) initialDb.guides = [];
    if (!initialDb.attractions) initialDb.attractions = [];
    if (!initialDb.dining) initialDb.dining = [];
    if (!initialDb.alerts) initialDb.alerts = [];
    if (!initialDb.posts) initialDb.posts = [];
    if (!initialDb.bookings) initialDb.bookings = [];

    // 1. Stays Synchronization
    const localStays = localStorage.getItem("sylhetgo_stays");
    if (localStays) {
      try {
        initialDb.stays = JSON.parse(localStays);
      } catch (e) {
        console.error("Error parsing local stays", e);
      }
    } else {
      localStorage.setItem("sylhetgo_stays", JSON.stringify(initialDb.stays));
    }

    // 2. Guides Synchronization
    const localGuides = localStorage.getItem("sylhetgo_guides");
    if (localGuides) {
      try {
        initialDb.guides = JSON.parse(localGuides);
      } catch (e) {
        console.error("Error parsing local guides", e);
      }
    } else {
      localStorage.setItem("sylhetgo_guides", JSON.stringify(initialDb.guides));
    }

    // 3. Bookings Synchronization
    const localBookings = localStorage.getItem("sylhetgo_bookings");
    if (localBookings) {
      try {
        initialDb.bookings = JSON.parse(localBookings);
      } catch (e) {
        console.error("Error parsing local bookings", e);
      }
    } else {
      localStorage.setItem("sylhetgo_bookings", JSON.stringify(initialDb.bookings));
    }

    // 4. Alerts Synchronization
    const localAlerts = localStorage.getItem("sylhetgo_alerts");
    if (localAlerts) {
      try {
        initialDb.alerts = JSON.parse(localAlerts);
      } catch (e) {
        console.error("Error parsing local alerts", e);
      }
    } else {
      localStorage.setItem("sylhetgo_alerts", JSON.stringify(initialDb.alerts));
    }

    // 5. Posts Synchronization
    const localPosts = localStorage.getItem("sylhetgo_posts");
    if (localPosts) {
      try {
        initialDb.posts = JSON.parse(localPosts);
      } catch (e) {
        console.error("Error parsing local posts", e);
      }
    } else {
      localStorage.setItem("sylhetgo_posts", JSON.stringify(initialDb.posts));
    }

    // 6. Attractions Synchronization
    const localAttractions = localStorage.getItem("sylhetgo_attractions");
    if (localAttractions) {
      try {
        initialDb.attractions = JSON.parse(localAttractions);
      } catch (e) {
        console.error("Error parsing local attractions", e);
      }
    } else {
      localStorage.setItem("sylhetgo_attractions", JSON.stringify(initialDb.attractions));
    }

    // Save back to general db
    try {
      saveDatabase(initialDb);
    } catch (e) {
      console.error(e);
    }

    return initialDb;
  });

  // Event listener to sync updates across tabs/windows (e.g., from separate admin panel)
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "sylhetgo_stays") {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : [];
          setDb(prev => {
            const next = { ...prev, stays: parsed };
            saveDatabase(next);
            return next;
          });
        } catch (err) {
          console.error("Failed to parse stays from storage", err);
        }
      } else if (e.key === "sylhetgo_guides") {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : [];
          setDb(prev => {
            const next = { ...prev, guides: parsed };
            saveDatabase(next);
            return next;
          });
        } catch (err) {
          console.error("Failed to parse guides from storage", err);
        }
      } else if (e.key === "sylhetgo_bookings") {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : [];
          setDb(prev => {
            const next = { ...prev, bookings: parsed };
            saveDatabase(next);
            return next;
          });
        } catch (err) {
          console.error("Failed to parse bookings from storage", err);
        }
      } else if (e.key === "sylhetgo_alerts") {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : [];
          setDb(prev => {
            const next = { ...prev, alerts: parsed };
            saveDatabase(next);
            return next;
          });
        } catch (err) {
          console.error("Failed to parse alerts from storage", err);
        }
      } else if (e.key === "sylhetgo_posts") {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : [];
          setDb(prev => {
            const next = { ...prev, posts: parsed };
            saveDatabase(next);
            return next;
          });
        } catch (err) {
          console.error("Failed to parse posts from storage", err);
        }
      } else if (e.key === "sylhetgo_attractions") {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : [];
          setDb(prev => {
            const next = { ...prev, attractions: parsed };
            saveDatabase(next);
            return next;
          });
        } catch (err) {
          console.error("Failed to parse attractions from storage", err);
        }
      } else if (e.key === "sylhetgo_local_db") {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : null;
          if (parsed) {
            setDb(parsed);
          }
        } catch (err) {
          console.error("Failed to parse local db from storage", err);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const updateAndSave = (updater: (prev: MockDatabase) => MockDatabase) => {
    setDb((prev) => {
      // Create a complete deep copy of the previous state to fully sever object reference identity.
      // This forces React to detect nested changes and trigger updates to destructured context bindings.
      const clonedPrev = JSON.parse(JSON.stringify(prev));
      const next = updater(clonedPrev);
      try {
        saveDatabase(next);
        // Write to separate individual keys for cross-project sync!
        localStorage.setItem("sylhetgo_stays", JSON.stringify(next.stays || []));
        localStorage.setItem("sylhetgo_guides", JSON.stringify(next.guides || []));
        localStorage.setItem("sylhetgo_bookings", JSON.stringify(next.bookings || []));
        localStorage.setItem("sylhetgo_alerts", JSON.stringify(next.alerts || []));
        localStorage.setItem("sylhetgo_posts", JSON.stringify(next.posts || []));
        localStorage.setItem("sylhetgo_attractions", JSON.stringify(next.attractions || []));
      } catch (e) {
        console.error("Failed to save database to localStorage", e);
      }
      return next;
    });
  };

  // Stays CRUD
  const addStay = (stay: Omit<EcoStay, "id" | "rating" | "ecoScore" | "available">) => {
    updateAndSave((prev) => {
      const newStay: EcoStay = {
        ...stay,
        id: `stay-${Date.now()}`,
        rating: 4.8,
        ecoScore: 96,
        available: true
      };
      return {
        ...prev,
        stays: [...prev.stays, newStay]
      };
    });
  };

  const updateStay = (id: string, updated: Partial<EcoStay>) => {
    updateAndSave((prev) => ({
      ...prev,
      stays: prev.stays.map((s) => (s.id === id ? { ...s, ...updated } : s))
    }));
  };

  const deleteStay = (id: string) => {
    updateAndSave((prev) => ({
      ...prev,
      stays: prev.stays.filter((s) => s.id !== id)
    }));
  };

  // Transport CRUD
  const addTransport = (ride: Omit<TransportRide, "id" | "rating" | "available" | "badge">) => {
    updateAndSave((prev) => {
      const newRide: TransportRide = {
        ...ride,
        id: `trans-${Date.now()}`,
        rating: 4.8,
        badge: "Eco Vetted",
        available: true
      };
      return {
        ...prev,
        transport: [...prev.transport, newRide]
      };
    });
  };

  const updateTransport = (id: string, updated: Partial<TransportRide>) => {
    updateAndSave((prev) => ({
      ...prev,
      transport: prev.transport.map((r) => (r.id === id ? { ...r, ...updated } : r))
    }));
  };

  const deleteTransport = (id: string) => {
    updateAndSave((prev) => ({
      ...prev,
      transport: prev.transport.filter((r) => r.id !== id)
    }));
  };

  // Guides CRUD
  const addGuide = (guide: Omit<LocalGuide, "id" | "rating" | "available" | "badge">) => {
    updateAndSave((prev) => {
      const newGuide: LocalGuide = {
        ...guide,
        id: `guide-${Date.now()}`,
        rating: 5.0,
        badge: "Eco Guide",
        available: true
      };
      return {
        ...prev,
        guides: [...prev.guides, newGuide]
      };
    });
  };

  const updateGuide = (id: string, updated: Partial<LocalGuide>) => {
    updateAndSave((prev) => ({
      ...prev,
      guides: prev.guides.map((g) => (g.id === id ? { ...g, ...updated } : g))
    }));
  };

  const deleteGuide = (id: string) => {
    updateAndSave((prev) => ({
      ...prev,
      guides: prev.guides.filter((g) => g.id !== id)
    }));
  };

  const toggleGuideVerification = (id: string) => {
    updateAndSave((prev) => ({
      ...prev,
      guides: prev.guides.map((g) => {
        if (g.id === id) {
          const isVerified = g.badge === "Verified Local Guide";
          return {
            ...g,
            badge: isVerified ? "Eco Guide" : "Verified Local Guide"
          };
        }
        return g;
      })
    }));
  };

  // Attractions CRUD
  const addAttraction = (attraction: Omit<EcoAttraction, "id" | "rating">) => {
    updateAndSave((prev) => {
      const newAttr: EcoAttraction = {
        ...attraction,
        id: `attr-${Date.now()}`,
        rating: 4.8
      };
      return {
        ...prev,
        attractions: [...prev.attractions, newAttr]
      };
    });
  };

  const updateAttraction = (id: string, updated: Partial<EcoAttraction>) => {
    updateAndSave((prev) => ({
      ...prev,
      attractions: prev.attractions.map((a) => (a.id === id ? { ...a, ...updated } : a))
    }));
  };

  const deleteAttraction = (id: string) => {
    updateAndSave((prev) => ({
      ...prev,
      attractions: prev.attractions.filter((a) => a.id !== id)
    }));
  };

  // Haor Metrics
  const updateHaor = (updated: Partial<HaorMetric>) => {
    updateAndSave((prev) => ({
      ...prev,
      haor: { ...prev.haor, ...updated }
    }));
  };

  // Reset database helper
  const resetDatabase = () => {
    // Flush all individual sylhetgo_* keys cleanly from localStorage
    const keysToRemove = Object.keys(localStorage).filter(key => key.startsWith("sylhetgo_"));
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    const freshDb = getDatabase();

    // Repopulate individual keys with fresh initial values
    localStorage.setItem("sylhetgo_stays", JSON.stringify(freshDb.stays));
    localStorage.setItem("sylhetgo_guides", JSON.stringify(freshDb.guides));
    localStorage.setItem("sylhetgo_bookings", JSON.stringify(freshDb.bookings || []));
    localStorage.setItem("sylhetgo_alerts", JSON.stringify(freshDb.alerts || []));
    localStorage.setItem("sylhetgo_posts", JSON.stringify(freshDb.posts || []));
    localStorage.setItem("sylhetgo_attractions", JSON.stringify(freshDb.attractions || []));

    setDb(freshDb);
  };

  // Alerts CRUD
  const addAlert = (alert: Omit<EmergencyAlert, "id">) => {
    updateAndSave((prev) => {
      const newAlert: EmergencyAlert = {
        ...alert,
        id: `alert-${Date.now()}`
      };
      return {
        ...prev,
        alerts: [newAlert, ...prev.alerts]
      };
    });
  };

  const deleteAlert = (id: string) => {
    updateAndSave((prev) => ({
      ...prev,
      alerts: prev.alerts.filter((a) => a.id !== id)
    }));
  };

  // Posts CRUD
  const addPost = (post: Omit<CommunityPost, "id" | "likes" | "commentsCount" | "timestamp">) => {
    updateAndSave((prev) => {
      const newPost: CommunityPost = {
        ...post,
        id: `post-${Date.now()}`,
        likes: 0,
        commentsCount: 0,
        timestamp: "Just Now"
      };
      return {
        ...prev,
        posts: [newPost, ...prev.posts]
      };
    });
  };

  const deletePost = (id: string) => {
    updateAndSave((prev) => ({
      ...prev,
      posts: prev.posts.filter((p) => p.id !== id)
    }));
  };

  const likePost = (id: string) => {
    updateAndSave((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    }));
  };

  const updatePost = (id: string, updated: Partial<CommunityPost>) => {
    updateAndSave((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => (p.id === id ? { ...p, ...updated } : p))
    }));
  };

  // Bookings CRUD
  const addBooking = (booking: Omit<EcoBooking, "id" | "status" | "timestamp">) => {
    updateAndSave((prev) => {
      const newBooking: EcoBooking = {
        ...booking,
        id: `book-${Date.now()}`,
        status: "Pending",
        timestamp: new Date().toLocaleString()
      };
      return {
        ...prev,
        bookings: [newBooking, ...(prev.bookings || [])]
      };
    });
  };

  const updateBookingStatus = (id: string, status: "Pending" | "Approved" | "Rejected", paymentStatus?: "Unpaid" | "Paid/Verifying" | "Verified") => {
    updateAndSave((prev) => ({
      ...prev,
      bookings: (prev.bookings || []).map((b) => (b.id === id ? { 
        ...b, 
        status, 
        paymentStatus: paymentStatus || (status === "Approved" ? "Verified" : b.paymentStatus) 
      } : b))
    }));
  };

  const deleteBooking = (id: string) => {
    updateAndSave((prev) => ({
      ...prev,
      bookings: (prev.bookings || []).filter((b) => b.id !== id)
    }));
  };

  return (
    <DBContext.Provider
      value={{
        db,
        stays: db.stays,
        transport: db.transport,
        guides: db.guides,
        attractions: db.attractions,
        dining: db.dining,
        haor: db.haor,
        alerts: db.alerts,
        posts: db.posts,
        bookings: db.bookings || [],
        
        addStay,
        updateStay,
        deleteStay,
        
        addTransport,
        updateTransport,
        deleteTransport,
        
        addGuide,
        updateGuide,
        deleteGuide,
        toggleGuideVerification,
        
        addAttraction,
        updateAttraction,
        deleteAttraction,
        
        updateHaor,
        resetDatabase,

        addAlert,
        deleteAlert,
        
        addPost,
        deletePost,
        likePost,
        updatePost,

        addBooking,
        updateBookingStatus,
        deleteBooking
      }}
    >
      {children}
    </DBContext.Provider>
  );
}

export function useDB() {
  const context = useContext(DBContext);
  if (context === undefined) {
    throw new Error("useDB must be used within a DBProvider");
  }
  return context;
}
