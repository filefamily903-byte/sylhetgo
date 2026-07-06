export interface EcoStay {
  id: string;
  title: string;
  category: string;
  location: string;
  price: number; // in BDT
  rating: number;
  badge: string;
  image: string;
  description: string;
  features: string[];
  ecoScore: number; // e.g., 98 for 98%
  available: boolean;
}

export interface TransportRide {
  id: string;
  title: string;
  category: string; // e.g., "Chauffeur Drive", "Wooden Cruise Boat"
  location: string;
  price: number; // in BDT per day or trip
  rating: number;
  badge: string;
  image: string;
  description: string;
  fuelType: string; // e.g., "Electric", "Solar-Powered", "Hybrid"
  capacity: number;
  available: boolean;
}

export interface LocalGuide {
  id: string;
  name: string;
  category: string; // specialty, e.g., "Wildlife & Swamp Specialist"
  location: string;
  price: number; // in BDT per day
  rating: number;
  badge: string;
  image: string;
  languages: string[];
  experienceYears: number;
  description: string;
  available: boolean;
}

export interface EcoAttraction {
  id: string;
  title: string;
  category: string; // e.g., "Freshwater Swamp Forest", "Emerald Waterway"
  location: string;
  rating: number;
  badge: string;
  image: string;
  description: string;
  crowdLevel: "Low" | "Moderate" | "High";
  mudIndex: "Dry" | "Moderate Muddy" | "Very Muddy";
  bestSeason: string;
  conservationStatus: string; // e.g., "Protected Reserve", "Vulnerable"
}

export interface DiningSpot {
  id: string;
  title: string;
  category: string; // e.g., "Tribal Cuisine", "Shatkora Special", "Farm-to-Table"
  location: string;
  rating: number;
  badge: string;
  image: string;
  specialty: string; // e.g., "Shatkora Beef", "7-Layer Tea"
  priceRange: string; // e.g., "৳৳", "৳৳৳"
  description: string;
  isOrganic: boolean;
}

export interface HaorMetric {
  waterHeight: number; // in meters, e.g. 12.4
  monsoonWaterHeight: number; // e.g. 12.4
  winterWaterHeight: number; // e.g. 1.8
  currentStatus: "Monsoon Deep Water" | "Winter Dry Grassland" | "Transitioning";
  policeAlert: string;
  safetyIndex: number; // e.g. 95 for 95% safety
  boatRateRegulation: string;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  severity: "info" | "warning" | "danger";
  timestamp: string;
  description: string;
  region: string;
  contactNumber?: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  category: "rideshare" | "event" | "question" | "guide-review";
  likes: number;
  commentsCount: number;
  timestamp: string;
  joinedCount?: number; // for events / rideshare
}

export interface EcoBooking {
  id: string;
  serviceType: "Stay" | "Transport" | "Guide";
  itemName: string;
  userDates: string;
  userBudget: number;
  status: "Pending" | "Approved" | "Rejected";
  timestamp: string;
  
  // New fields requested
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentStatus: "Unpaid" | "Paid/Verifying" | "Verified";
  paymentMethod: "bKash" | "Nagad" | "SSLCommerz/Card" | "None";
  transactionId: string;
  paymentTime?: string;
  guestCount: number;
  specialNotes?: string;
}

export interface MockDatabase {
  stays: EcoStay[];
  transport: TransportRide[];
  guides: LocalGuide[];
  attractions: EcoAttraction[];
  dining: DiningSpot[];
  haor: HaorMetric;
  alerts: EmergencyAlert[];
  posts: CommunityPost[];
  bookings: EcoBooking[];
}
