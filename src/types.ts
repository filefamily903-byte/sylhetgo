// ==========================================
// 1. Eco Stay & Accommodation Types
// ==========================================
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

// ==========================================
// 2. Transport & Rides Types
// ==========================================
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

// ==========================================
// 3. Local Guide Types (গাইড ভেরিফিকেশনসহ আপডেটেড)
// ==========================================
export type GuideBadge = "Unverified" | "Eco Guide" | "Verified Local Guide" | "SREDA Certified";

export interface LocalGuide {
  id: string;
  name: string;
  category: string; // specialty, e.g., "Wildlife & Swamp Specialist"
  location: string;
  price: number; // in BDT per day
  rating: number;
  badge: GuideBadge | string; // আমাদের নতুন স্ট্রং টাইপ এবং ব্যাকওয়ার্ড সামঞ্জস্যের জন্য string রাখা হলো
  image: string;
  languages: string[];
  experienceYears: number;
  description: string;
  available: boolean;
  isVerified?: boolean; // 🔥 অ্যাডমিন প্যানেলে ট্রগল বা এপ্রুভালের জন্য নতুন যুক্ত করা হলো
}

// ==========================================
// 4. Attractions & Dining Types
// ==========================================
export interface EcoAttraction {
  id: string;
  title: string;
  category: string; // e.g., "Freshwater Swamp Forest", "Emerald Waterway"
  location: string;
  rating: number;
  badge: string;
  image: string;
  description: string;
  crowlLevel?: "Low" | "Moderate" | "High"; // টাইপো সেফ রাখার জন্য অপশনাল বা ফিক্সড রাখা যেতে পারে
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

// ==========================================
// 5. Haor Metrics & Real-time Alerts
// ==========================================
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

// ==========================================
// 6. Community Forum Types
// ==========================================
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

// ==========================================
// 7. Eco Booking & Payment Types (পেমেন্ট গেটওয়ে অনুযায়ী আপডেটেড)
// ==========================================
export type PaymentStatus = "Unpaid" | "Paid/Verifying" | "Verified" | "Confirmed" | "Cancelled";
export type PaymentMethod = "bKash" | "Nagad" | "SSLCommerz/Card" | "None";

export interface EcoBooking {
  id: string;
  serviceType: "Stay" | "Transport" | "Guide" | "Package"; // ব্যাকওয়ার্ড সাপোর্টের জন্য "Package" টাইপ রাখার সুযোগ থাকল
  itemName: string;
  userDates: string;
  userBudget: number;
  status: "Pending" | "Approved" | "Rejected";
  timestamp: string;
  
  // পেমেন্ট ও কাস্টমার ফিল্ডস
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId: string;
  paymentTime?: string;
  guestCount: number;
  specialNotes?: string;
}

// ==========================================
// 8. Main Mock Database Interface
// ==========================================
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
}  title: string;
  category: string; // e.g., "Freshwater Swamp Forest", "Emerald Waterway"
  location: string;
  rating: number;
  badge: string;
  image: string;
  description: string;
  crowlLevel?: "Low" | "Moderate" | "High"; // টাইপো সেফ রাখার জন্য অপশনাল বা ফিক্সড রাখা যেতে পারে
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

// ==========================================
// 5. Haor Metrics & Real-time Alerts
// ==========================================
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

// ==========================================
// 6. Community Forum Types
// ==========================================
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

// ==========================================
// 7. Eco Booking & Payment Types (পেমেন্ট গেটওয়ে অনুযায়ী আপডেটেড)
// ==========================================
export type PaymentStatus = "Unpaid" | "Paid/Verifying" | "Verified" | "Confirmed" | "Cancelled";
export type PaymentMethod = "bKash" | "Nagad" | "SSLCommerz/Card" | "None";

export interface EcoBooking {
  id: string;
  serviceType: "Stay" | "Transport" | "Guide" | "Package"; // ব্যাকওয়ার্ড সাপোর্টের জন্য "Package" টাইপ রাখার সুযোগ থাকল
  itemName: string;
  userDates: string;
  userBudget: number;
  status: "Pending" | "Approved" | "Rejected";
  timestamp: string;
  
  // পেমেন্ট ও কাস্টমার ফিল্ডস
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId: string;
  paymentTime?: string;
  guestCount: number;
  specialNotes?: string;
}

// ==========================================
// 8. Main Mock Database Interface
// ==========================================
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
