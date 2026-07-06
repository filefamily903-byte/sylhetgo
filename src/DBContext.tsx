import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  EcoStay, 
  TransportRide, 
  LocalGuide, 
  EcoAttraction, 
  DiningSpot, 
  HaorMetric, 
  EmergencyAlert, 
  CommunityPost, 
  EcoBooking,
  MockDatabase 
} from "./types";

// ==========================================
// 1. Initial Mock Data (প্রাথমিক ডেমো ডাটা)
// ==========================================

const initialStays: EcoStay[] = [
  {
    id: "stay-1",
    title: "Tanguar Haor Eco Resort",
    category: "Eco Resort",
    location: "Sunamganj",
    price: 3500,
    rating: 4.8,
    badge: "Top Rated",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    description: "An eco-friendly resort built with local materials overlooking the serene Tanguar Haor.",
    features: ["Solar Power", "Rainwater Harvesting", "Local Organic Food"],
    ecoScore: 95,
    available: true
  }
];

const initialGuides: LocalGuide[] = [
  {
    id: "guide-1",
    name: "Abdur Rahman",
    category: "Wildlife & Swamp Specialist",
    location: "Sunamganj / Ratargul",
    price: 2000,
    rating: 4.9,
    badge: "Verified Local Guide",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    languages: ["Bangla", "English", "Sylheti"],
    experienceYears: 5,
    description: "Expert in local biodiversity, bird watching, and boat navigation in swamp forests.",
    available: true,
    isVerified: true
  },
  {
    id: "guide-2",
    name: "Suresh Das",
    category: "Eco-Trail Specialist",
    location: "Sreemangal",
    price: 1800,
    rating: 4.7,
    badge: "SREDA Certified",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    languages: ["Bangla", "Sylheti"],
    experienceYears: 4,
    description: "Specialized in rainforest tracking and local tea culture tours.",
    available: true,
    isVerified: true
  }
];

const initialHaor: HaorMetric = {
  waterHeight: 8.5,
  monsoonWaterHeight: 12.4,
  winterWaterHeight: 1.8,
  currentStatus: "Monsoon Deep Water",
  policeAlert: "Normal conditions. Wearing life vests is mandatory for all boat trips.",
  safetyIndex: 92,
  boatRateRegulation: "Standard government rates active (৳৩০০০-৳৫০০০ per day based on boat size)."
};

// ==========================================
// 2. Context Interface Definition
// ==========================================
interface DBContextType {
  stays: EcoStay[];
  transport: TransportRide[];
  guides: LocalGuide[];
  attractions: EcoAttraction[];
  dining: DiningSpot[];
  haor: HaorMetric;
  alerts: EmergencyAlert[];
  posts: CommunityPost[];
  bookings: EcoBooking[];
  
  // Actions
  addBooking: (booking: Omit<EcoBooking, 'status' | 'timestamp'> & { id?: string; status?: "Pending" | "Approved" | "Rejected"; timestamp?: string }) => void;
  updateBookingStatus: (id: string, status: "Pending" | "Approved" | "Rejected" | "Verified") => void;
  addGuide: (newGuideData: Omit<LocalGuide, 'id' | 'rating' | 'available' | 'isVerified' | 'badge'>) => void;
  toggleGuideVerification: (id: string) => void;
}

const DBContext = createContext<DBContextType | undefined>(undefined);

// ==========================================
// 3. DBContext Provider Component
// ==========================================
export const DBProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // State Initialization with Safe LocalStorage parsing
  const [stays, setStays] = useState<EcoStay[]>(() => {
    const local = localStorage.getItem("eco_stays");
    return local ? JSON.parse(local) : initialStays;
  });

  const [guides, setGuides] = useState<LocalGuide[]>(() => {
    const local = localStorage.getItem("eco_guides");
    return local ? JSON.parse(local) : initialGuides;
  });

  const [bookings, setBookings] = useState<EcoBooking[]>(() => {
    const local = localStorage.getItem("eco_bookings");
    return local ? JSON.parse(local) : [];
  });

  const [transport] = useState<TransportRide[]>([]);
  const [attractions] = useState<EcoAttraction[]>([]);
  const [dining] = useState<DiningSpot[]>([]);
  const [alerts] = useState<EmergencyAlert[]>([]);
  const [posts] = useState<CommunityPost[]>([]);
  const [haor] = useState<HaorMetric>(initialHaor);

  // ==========================================
  // 4. Glitch-Free LocalStorage Sync Effects
  // ==========================================
  useEffect(() => {
    localStorage.setItem("eco_stays", JSON.stringify(stays));
  }, [stays]);

  useEffect(() => {
    localStorage.setItem("eco_guides", JSON.stringify(guides));
  }, [guides]);

  useEffect(() => {
    localStorage.setItem("eco_bookings", JSON.stringify(bookings));
  }, [bookings]);


  // ==========================================
  // 5. Database Actions (ফাংশনসমূহ)
  // ==========================================
  
  // বুকিং যুক্ত করার লজিক
  const addBooking = (bookingData: any) => {
    const newBooking: EcoBooking = {
      ...bookingData,
      id: bookingData.id || `book-${Date.now()}`,
      status: bookingData.status || "Pending",
      timestamp: bookingData.timestamp || new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  // বুকিং স্ট্যাটাস আপডেট লজিক
  const updateBookingStatus = (id: string, status: any) => {
    setBookings((prevBookings) =>
      prevBookings.map((b) => (b.id === id ? { ...b, status: status === "Verified" ? "Approved" : status, paymentStatus: status === "Verified" ? "Verified" : b.paymentStatus } : b))
    );
  };

  // নতুন গাইড যুক্ত করার নিখুঁত লজিক
  const addGuide = (newGuideData: Omit<LocalGuide, 'id' | 'rating' | 'available' | 'isVerified' | 'badge'>) => {
    setGuides((prevGuides) => {
      const freshGuide: LocalGuide = {
        ...newGuideData,
        id: `guide-${Date.now()}`,               
        rating: 5.0,                              
        available: true,                          
        isVerified: false,                        // শুরুতে Admin Panel-এ Review
