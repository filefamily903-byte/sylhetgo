import React, { useState, useEffect } from "react";
import {
  Compass,
  MapPin,
  Hotel,
  Car,
  Users,
  CloudRain,
  ShieldAlert,
  MessageSquare,
  Calendar,
  ArrowRight,
  Search,
  Menu,
  X,
  ChevronRight,
  Star,
  Leaf,
  Utensils,
  PhoneCall,
  ExternalLink,
  Award,
  Trees,
  Waves,
  Heart,
  Info,
  CheckCircle2,
  Mail,
  Send,
  Sparkles,
  CalendarDays,
  Settings,
  Lock,
  Shield,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Edit3,
  TrendingUp,
  LogOut,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Clock,
  Activity
} from "lucide-react";

// Import modular pages
import StaysPage from "./components/StaysPage";
import { useDB } from "./DBContext";
import TransportPage from "./components/TransportPage";
import GuidesPage from "./components/GuidesPage";
import AttractionsPage from "./components/AttractionsPage";
import DiningPage from "./components/DiningPage";
import HaorPage from "./components/HaorPage";
import EmergencyPage from "./components/EmergencyPage";
import CommunityPage from "./components/CommunityPage";

type SearchTab = "stays" | "transport" | "guides" | "attractions";

export default function App() {
  // Client Router state
  // Supported pages: "home" | "stays" | "transport" | "guides" | "attractions" | "dining" | "haor" | "emergency" | "community" | "admin"
  const [currentPage, setCurrentPage] = useState<string>("home");

  // Database Context
  const { 
    stays, 
    transport, 
    guides, 
    attractions, 
    bookings,
    addStay,
    updateStay,
    deleteStay,
    addGuide,
    updateGuide,
    deleteGuide,
    toggleGuideVerification,
    updateBookingStatus
  } = useDB();

  // Secret Enterprise Admin states
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [adminTab, setAdminTab] = useState<"dashboard" | "bookings" | "stays" | "guides">("dashboard");

  // Admin CRUD states
  const [showStayModal, setShowStayModal] = useState(false);
  const [selectedAdminStay, setSelectedAdminStay] = useState<any | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [selectedAdminGuide, setSelectedAdminGuide] = useState<any | null>(null);

  // Form states for Stay Modal
  const [stayForm, setStayForm] = useState({
    title: "",
    category: "Eco-Resort",
    location: "Sreemangal",
    price: 3500,
    description: "",
    badge: "Eco-Certified",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80",
    features: "Solar Power, Organic Farming, Water Recycling",
    ecoScore: 95
  });

  // Form states for Guide Modal
  const [guideForm, setGuideForm] = useState({
    name: "",
    category: "Swamp Specialist",
    location: "Sylhet",
    price: 1500,
    badge: "Certified",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    languages: "Bangla, English",
    experienceYears: 4,
    description: "",
    phone: "",
    available: true
  });

  // Keyboard shortcut listener for Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        setShowAdminLogin((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Search Engine states on Homepage
  const [activeSearchTab, setActiveSearchTab] = useState<SearchTab>("stays");
  const [selectedDestination, setSelectedDestination] = useState("Sreemangal");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Season preview state on Homepage
  const [haorSeason, setHaorSeason] = useState<"monsoon" | "winter">("monsoon");

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sign Eco Pledge State
  const [pledgeSigned, setPledgeSigned] = useState(false);
  const [pledgeName, setPledgeName] = useState("");
  const [showPledgeSuccess, setShowPledgeSuccess] = useState(false);

  // Footer Modal States
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showConservationModal, setShowConservationModal] = useState(false);
  const [showLNTModal, setShowLNTModal] = useState(false);
  
  // Interactive Checklist for Leave No Trace Code
  const [lntChecklist, setLntChecklist] = useState({
    waste: false,
    water: false,
    guides: false,
  });

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Handle Landing Page Search submission: filters and triggers the localMockDB results view
  const handleLandingSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPerformed(true);
  };

  // Filter helper for homepage search results
  const getSearchResults = () => {
    if (!searchPerformed) return [];
    
    const term = selectedDestination.toLowerCase();
    if (activeSearchTab === "stays") {
      return stays.filter(s => s.location.toLowerCase().includes(term));
    } else if (activeSearchTab === "transport") {
      return transport.filter(t => t.location.toLowerCase().includes(term));
    } else if (activeSearchTab === "guides") {
      return guides.filter(g => g.location.toLowerCase().includes(term));
    } else if (activeSearchTab === "attractions") {
      return attractions.filter(a => a.location.toLowerCase().includes(term));
    }
    return [];
  };

  // Submit Stay Form
  const handleStaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedFeatures = stayForm.features.split(",").map(f => f.trim()).filter(Boolean);
    if (selectedAdminStay) {
      updateStay(selectedAdminStay.id, {
        title: stayForm.title,
        category: stayForm.category,
        location: stayForm.location,
        price: Number(stayForm.price),
        description: stayForm.description,
        badge: stayForm.badge,
        image: stayForm.image,
        features: parsedFeatures,
        ecoScore: Number(stayForm.ecoScore)
      });
      alert("Stay updated successfully!");
    } else {
      addStay({
        title: stayForm.title,
        category: stayForm.category,
        location: stayForm.location,
        price: Number(stayForm.price),
        description: stayForm.description,
        badge: stayForm.badge,
        image: stayForm.image,
        features: parsedFeatures
      });
      alert("New Eco-Stay created successfully!");
    }
    setShowStayModal(false);
    setSelectedAdminStay(null);
  };

  // Submit Guide Form
  const handleGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLanguages = guideForm.languages.split(",").map(l => l.trim()).filter(Boolean);
    if (selectedAdminGuide) {
      updateGuide(selectedAdminGuide.id, {
        name: guideForm.name,
        category: guideForm.category,
        location: guideForm.location,
        price: Number(guideForm.price),
        badge: guideForm.badge,
        image: guideForm.image,
        languages: parsedLanguages,
        experienceYears: Number(guideForm.experienceYears),
        description: guideForm.description,
        available: guideForm.available
      });
      alert("Guide updated successfully!");
    } else {
      addGuide({
        name: guideForm.name,
        category: guideForm.category,
        location: guideForm.location,
        price: Number(guideForm.price),
        image: guideForm.image,
        languages: parsedLanguages,
        experienceYears: Number(guideForm.experienceYears),
        description: guideForm.description
      });
      alert("New Naturalist Guide registered successfully!");
    }
    setShowGuideModal(false);
    setSelectedAdminGuide(null);
  };

  const startEditStay = (stay: any) => {
    setSelectedAdminStay(stay);
    setStayForm({
      title: stay.title,
      category: stay.category,
      location: stay.location,
      price: stay.price,
      description: stay.description || "",
      badge: stay.badge || "Eco-Certified",
      image: stay.image || "",
      features: (stay.features || []).join(", "),
      ecoScore: stay.ecoScore || 95
    });
    setShowStayModal(true);
  };

  const startEditGuide = (guide: any) => {
    setSelectedAdminGuide(guide);
    setGuideForm({
      name: guide.name,
      category: guide.category,
      location: guide.location,
      price: guide.price,
      badge: guide.badge || "Certified",
      image: guide.image || "",
      languages: (guide.languages || []).join(", "),
      experienceYears: guide.experienceYears || 4,
      description: guide.description || "",
      phone: guide.phone || "",
      available: guide.available !== undefined ? guide.available : true
    });
    setShowGuideModal(true);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === "admin" && loginPassword === "sylhet2026") {
      setIsAdminMode(true);
      setShowAdminLogin(false);
      setLoginError("");
      setLoginUsername("");
      setLoginPassword("");
    } else {
      setLoginError("Invalid username or password. Access denied.");
    }
  };

  // Handle Pledge Sign
  const handleSignPledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (pledgeName.trim()) {
      setPledgeSigned(true);
      setShowPledgeSuccess(true);
      setTimeout(() => {
        setShowPledgeSuccess(false);
      }, 5000);
    }
  };

  // Render Admin Layout if in Admin Mode
  if (isAdminMode) {
    const totalBookingsCount = bookings.length;
    const pendingBookingsCount = bookings.filter(b => b.status === "Pending").length;
    const totalRevenue = bookings.filter(b => b.status === "Approved").reduce((sum, b) => sum + b.userBudget, 0);
    const totalStaysCount = stays.length;
    const totalGuidesCount = guides.length;

    return (
      <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
        
        {/* SIDEBAR: bg-slate-900 */}
        <aside id="admin_sidebar" className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 text-left">
          
          {/* Sidebar Brand Header */}
          <div className="h-20 px-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-extrabold text-lg tracking-tight text-slate-100 flex items-center gap-1">
                Sylhet<span className="text-indigo-400">Go</span>
              </span>
              <span className="block text-[9px] tracking-widest uppercase font-mono font-bold text-slate-500 -mt-1">
                Enterprise Admin
              </span>
            </div>
          </div>

          {/* Secure Session Active badge */}
          <div className="px-4 py-3 mx-4 my-4 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center gap-2.5">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="text-[10px] text-slate-400 font-mono">
              <span className="font-bold text-slate-300 block">Operator: Admin</span>
              <span>Encrypted Session</span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-3 space-y-1">
            {[
              { id: "dashboard", label: "Overview Dashboard", icon: TrendingUp },
              { id: "bookings", label: "User Bookings Influx", icon: CalendarDays },
              { id: "stays", label: "Manage Stays/Lodges", icon: Hotel },
              { id: "guides", label: "Manage Naturalist Guides", icon: Users }
            ].map((item) => {
              const Icon = item.icon;
              const active = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer text-left ${
                    active
                      ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-inner"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? "text-indigo-400" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={() => setIsAdminMode(false)}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl py-3 px-4 text-xs font-bold transition-all cursor-pointer shadow-md border border-slate-700/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin Panel</span>
            </button>
          </div>
        </aside>

        {/* MAIN BODY AREA: bg-slate-950 */}
        <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
          
          {/* Dashboard Main Header */}
          <header className="h-20 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-900/40 backdrop-blur-md sticky top-0 z-10 shrink-0 text-left">
            <div>
              <h1 className="font-display font-extrabold text-xl text-slate-100 capitalize">
                {adminTab === "dashboard" && "Overview Dashboard"}
                {adminTab === "bookings" && "User Bookings Data Influx"}
                {adminTab === "stays" && "Eco-Stays & Lodges Database"}
                {adminTab === "guides" && "Naturalist Guides Database"}
              </h1>
              <p className="text-[10px] font-mono text-slate-400">
                Connected Workspace: local database pipeline via browser LocalStorage
              </p>
            </div>

            {/* Switch to Live Website Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAdminMode(false)}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-emerald-950/20 active:scale-95 cursor-pointer font-mono border border-emerald-500/20"
              >
                <span>Switch to Live Website View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>

          {/* Content Wrapper */}
          <div className="p-8 space-y-8 flex-1">

            {/* TAB 1: OVERVIEW DASHBOARD */}
            {adminTab === "dashboard" && (
              <div className="space-y-8 animate-in fade-in duration-300 text-left">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  
                  {/* Revenue Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between h-32">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">Estimated Local Revenue</span>
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className="font-display font-black text-2xl tracking-tight text-white">৳ {totalRevenue.toLocaleString()}</span>
                      <span className="block text-[9px] text-emerald-400 font-mono mt-0.5">Approved bookings budget</span>
                    </div>
                  </div>

                  {/* Total Bookings Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between h-32">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">Total Bookings</span>
                      <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
                        <CalendarDays className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className="font-display font-black text-2xl tracking-tight text-white">{totalBookingsCount}</span>
                      <span className="block text-[9px] text-indigo-400 font-mono mt-0.5">Total reservation influx</span>
                    </div>
                  </div>

                  {/* Pending Bookings Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between h-32">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">Pending Bookings</span>
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/10 animate-pulse">
                        <Clock className="w-4 h-4 text-amber-400" />
                      </div>
                    </div>
                    <div>
                      <span className="font-display font-black text-2xl tracking-tight text-white">{pendingBookingsCount}</span>
                      <span className="block text-[9px] text-amber-400 font-mono mt-0.5 font-bold">Awaiting action</span>
                    </div>
                  </div>

                  {/* Active Lodges Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between h-32">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">Active Lodges</span>
                      <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/10">
                        <Hotel className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className="font-display font-black text-2xl tracking-tight text-white">{totalStaysCount}</span>
                      <span className="block text-[9px] text-sky-400 font-mono mt-0.5">Stays inventory</span>
                    </div>
                  </div>

                  {/* Certified Guides Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between h-32">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">Naturalist Guides</span>
                      <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/10">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className="font-display font-black text-2xl tracking-tight text-white">{totalGuidesCount}</span>
                      <span className="block text-[9px] text-teal-400 font-mono mt-0.5">Registered guides</span>
                    </div>
                  </div>

                </div>

                {/* Dashboard Notice/Status & Recent Influx summary */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Recent Activity */}
                  <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <h3 className="font-display font-extrabold text-sm text-slate-100 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-400" />
                        <span>Recent Booking Pipeline</span>
                      </h3>
                      <button 
                        onClick={() => setAdminTab("bookings")} 
                        className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider cursor-pointer"
                      >
                        View Full Influx →
                      </button>
                    </div>

                    {bookings.length === 0 ? (
                      <div className="py-12 text-center text-slate-500 text-xs font-mono">
                        No customer bookings inside the localStorage pipeline.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-800/80 text-slate-400 font-mono text-[10px] uppercase">
                              <th className="py-3 px-2">Guest / Contact</th>
                              <th className="py-3 px-2">Item Booking</th>
                              <th className="py-3 px-2">Total Price</th>
                              <th className="py-3 px-2">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/50 font-medium">
                            {bookings.slice(0, 5).map((b) => (
                              <tr key={b.id} className="hover:bg-slate-800/30">
                                <td className="py-3.5 px-2">
                                  <span className="block font-bold text-slate-200">{b.customerName}</span>
                                  <span className="text-[10px] text-slate-500 font-mono">{b.customerPhone}</span>
                                </td>
                                <td className="py-3.5 px-2">
                                  <span className="text-[10px] bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded mr-1.5 uppercase font-mono font-bold">{b.serviceType}</span>
                                  <span className="text-slate-300 text-xs font-bold">{b.itemName}</span>
                                </td>
                                <td className="py-3.5 px-2 font-mono font-bold text-slate-200">
                                  ৳ {b.userBudget.toLocaleString()}
                                </td>
                                <td className="py-3.5 px-2">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                                    b.status === "Approved"
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                      : b.status === "Rejected"
                                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                                  }`}>
                                    {b.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Database pipeline Status panel */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-xs">
                    <h3 className="font-display font-extrabold text-sm text-slate-100 pb-3 border-b border-slate-800 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Workspace Database Sync</span>
                    </h3>
                    
                    <div className="space-y-4">
                      <p className="text-slate-400 leading-relaxed text-[11px]">
                        This panel syncs with the primary database in the workspace. Any edits or additions write directly back to <strong>LocalStorage</strong> using shared JSON pipelines. This allows cross-project updates to reflect instantly.
                      </p>

                      <div className="space-y-2.5 pt-2">
                        <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 font-mono text-[10px]">
                          <span className="text-slate-500">STAYS PIPELINE:</span>
                          <span className="text-emerald-400 font-bold">CONNECTED ({stays.length})</span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 font-mono text-[10px]">
                          <span className="text-slate-500">GUIDES PIPELINE:</span>
                          <span className="text-emerald-400 font-bold">CONNECTED ({guides.length})</span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 font-mono text-[10px]">
                          <span className="text-slate-500">BOOKINGS PIPELINE:</span>
                          <span className="text-emerald-400 font-bold">CONNECTED ({bookings.length})</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-xl text-[10px] leading-relaxed text-indigo-300 font-mono">
                          <strong>💡 SHORTCUT REMINDER:</strong> Use `Ctrl + Shift + A` key combination to toggle administrative portal from any live client screen!
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: USER BOOKINGS DATA INFLUX */}
            {adminTab === "bookings" && (
              <div className="space-y-6 animate-in fade-in duration-300 text-left">
                
                {/* Bookings Table Container */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="font-display font-extrabold text-sm text-slate-100">Live Reservation Influx</h3>
                      <p className="text-[10px] text-slate-400">Manage real-time customer tour bookings and payment settlement audits.</p>
                    </div>
                    <div className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                      Pipeline Size: {bookings.length} reservations
                    </div>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="py-24 text-center text-slate-500 text-xs font-mono">
                      No bookings logged in the browser's `sylhetgo_bookings` LocalStorage key yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                            <th className="py-3 px-4">Booking ID & Date</th>
                            <th className="py-3 px-4">Customer Details</th>
                            <th className="py-3 px-4">Service Type & Item Name</th>
                            <th className="py-3 px-4">Budget / Price</th>
                            <th className="py-3 px-4">Payment Audit</th>
                            <th className="py-3 px-4">Reservation Status</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 font-medium">
                          {bookings.map((b) => (
                            <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                              
                              {/* ID & Date */}
                              <td className="py-4 px-4">
                                <span className="block font-mono text-slate-200 font-extrabold">{b.id}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{b.timestamp || "Unknown Time"}</span>
                              </td>

                              {/* Customer Details */}
                              <td className="py-4 px-4 space-y-0.5">
                                <span className="block font-bold text-slate-200 text-xs">{b.customerName}</span>
                                <span className="block text-[10px] text-slate-400 font-mono">{b.customerPhone}</span>
                                <span className="block text-[10px] text-slate-500 font-mono">{b.customerEmail}</span>
                              </td>

                              {/* Service Type & Item */}
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                                    b.serviceType === "Stay"
                                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/10"
                                      : b.serviceType === "Guide"
                                      ? "bg-teal-500/10 text-teal-400 border border-teal-500/10"
                                      : "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                                  }`}>
                                    {b.serviceType}
                                  </span>
                                  {b.guestCount && (
                                    <span className="text-[10px] text-slate-400 font-mono">({b.guestCount} guest{b.guestCount > 1 ? 's' : ''})</span>
                                  )}
                                </div>
                                <span className="text-slate-100 text-xs font-bold block">{b.itemName}</span>
                                <span className="text-[10px] text-slate-400 font-mono block">{b.userDates}</span>
                              </td>

                              {/* Budget */}
                              <td className="py-4 px-4 font-mono font-black text-slate-200 text-xs">
                                ৳ {b.userBudget.toLocaleString()}
                              </td>

                              {/* Payment Audit */}
                              <td className="py-4 px-4 space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${
                                    b.paymentStatus === "Verified"
                                      ? "bg-emerald-500/10 text-emerald-400"
                                      : b.paymentStatus === "Paid/Verifying"
                                      ? "bg-amber-500/10 text-amber-400 animate-pulse"
                                      : "bg-rose-500/10 text-rose-400"
                                  }`}>
                                    {b.paymentStatus}
                                  </span>
                                  <span className="text-[10px] text-slate-300 font-bold font-mono">{b.paymentMethod !== "None" ? b.paymentMethod : "No Pay"}</span>
                                </div>
                                {b.transactionId && (
                                  <span className="block text-[9px] text-slate-500 font-mono select-all">TXID: {b.transactionId}</span>
                                )}
                              </td>

                              {/* Status */}
                              <td className="py-4 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                                  b.status === "Approved"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : b.status === "Rejected"
                                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                                }`}>
                                  {b.status}
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  {b.status === "Pending" ? (
                                    <>
                                      <button
                                        onClick={() => updateBookingStatus(b.id, "Approved", "Verified")}
                                        className="p-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 rounded-lg transition-colors cursor-pointer border border-emerald-500/10 animate-pulse"
                                        title="Approve Reservation"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => updateBookingStatus(b.id, "Rejected", "Unpaid")}
                                        className="p-1.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 rounded-lg transition-colors cursor-pointer border border-rose-500/10"
                                        title="Cancel Reservation"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    </>
                                  ) : (
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">Settled</span>
                                  )}
                                </div>
                              </td>

                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 3: MANAGE STAYS/LODGES */}
            {adminTab === "stays" && (
              <div className="space-y-6 animate-in fade-in duration-300 text-left">
                
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-extrabold text-sm text-slate-100">Lodging & Eco-Stays Directory</h3>
                    <p className="text-[10px] text-slate-400">Add, edit, or delete persistent lodging partners registered with SylhetGo.</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedAdminStay(null);
                      setStayForm({
                        title: "",
                        category: "Eco-Resort",
                        location: "Sreemangal",
                        price: 3500,
                        description: "",
                        badge: "Eco-Certified",
                        image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80",
                        features: "Solar Power, Organic Farming, Water Recycling",
                        ecoScore: 95
                      });
                      setShowStayModal(true);
                    }}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer font-sans"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>Register New Eco-Stay</span>
                  </button>
                </div>

                {/* Stays Table Grid */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  {stays.length === 0 ? (
                    <div className="py-24 text-center text-slate-500 text-xs font-mono">
                      No lodging items registered. Click the button above to add one.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                            <th className="py-3 px-4">Lodge Name & Category</th>
                            <th className="py-3 px-4">Location</th>
                            <th className="py-3 px-4">Price (BDT / Night)</th>
                            <th className="py-3 px-4">Eco Score</th>
                            <th className="py-3 px-4">Availability</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 font-medium">
                          {stays.map((s) => (
                            <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                              
                              {/* Photo & Title */}
                              <td className="py-4 px-4 flex items-center gap-3">
                                {s.image && (
                                  <img 
                                    src={s.image} 
                                    alt={s.title}
                                    className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                <div>
                                  <span className="font-bold text-slate-200 block text-xs">{s.title}</span>
                                  <span className="text-[10px] text-indigo-400 font-mono">{s.category}</span>
                                </div>
                              </td>

                              {/* Location */}
                              <td className="py-4 px-4 text-slate-300">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  <span>{s.location}</span>
                                </span>
                              </td>

                              {/* Price */}
                              <td className="py-4 px-4 font-mono font-bold text-slate-200">
                                ৳ {s.price.toLocaleString()}
                              </td>

                              {/* Eco Score */}
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px] border border-emerald-500/10">
                                    {s.ecoScore || 95}%
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-sans hidden md:inline">Eco Score</span>
                                </div>
                              </td>

                              {/* Availability */}
                              <td className="py-4 px-4">
                                <button
                                  onClick={() => updateStay(s.id, { available: !s.available })}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase cursor-pointer transition-colors ${
                                    s.available
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                                  }`}
                                >
                                  {s.available ? "Available" : "Fully Booked"}
                                </button>
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => startEditStay(s)}
                                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg transition-colors cursor-pointer border border-slate-700"
                                    title="Edit Lodge Details"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete ${s.title}?`)) {
                                        deleteStay(s.id);
                                      }
                                    }}
                                    className="p-1.5 bg-slate-800 hover:bg-rose-950/40 text-rose-400 rounded-lg transition-colors cursor-pointer border border-slate-700"
                                    title="Delete Lodge"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 4: MANAGE NATURALIST GUIDES */}
            {adminTab === "guides" && (
              <div className="space-y-6 animate-in fade-in duration-300 text-left">
                
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-extrabold text-sm text-slate-100">Naturalist Guides Directory</h3>
                    <p className="text-[10px] text-slate-400">Add, edit, or delete naturalist guides registered with SylhetGo.</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedAdminGuide(null);
                      setGuideForm({
                        name: "",
                        category: "Swamp Specialist",
                        location: "Sylhet",
                        price: 1500,
                        badge: "Certified",
                        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
                        languages: "Bangla, English",
                        experienceYears: 4,
                        description: "",
                        phone: "",
                        available: true
                      });
                      setShowGuideModal(true);
                    }}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer font-sans"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>Register New Guide</span>
                  </button>
                </div>

                {/* Guides Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  {guides.length === 0 ? (
                    <div className="py-24 text-center text-slate-500 text-xs font-mono">
                      No naturalist guides registered in the database.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                            <th className="py-3 px-4">Guide Details</th>
                            <th className="py-3 px-4">Specialty & Languages</th>
                            <th className="py-3 px-4">Location</th>
                            <th className="py-3 px-4">Price (BDT / Day)</th>
                            <th className="py-3 px-4">Verification</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 font-medium">
                          {guides.map((g) => (
                            <tr key={g.id} className="hover:bg-slate-800/30 transition-colors">
                              
                              {/* Photo & Name */}
                              <td className="py-4 px-4 flex items-center gap-3">
                                {g.image && (
                                  <img 
                                    src={g.image} 
                                    alt={g.name}
                                    className="w-10 h-10 rounded-full object-cover bg-slate-800 shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                <div>
                                  <span className="font-bold text-slate-200 block text-xs">{g.name}</span>
                                  <span className="text-[10px] text-slate-500 font-mono">{g.experienceYears || g.experienceYears === 0 ? `${g.experienceYears} Years Exp` : "Expert"}</span>
                                </div>
                              </td>

                              {/* Specialty & Languages */}
                              <td className="py-4 px-4">
                                <span className="block font-semibold text-indigo-400 text-xs">{g.category}</span>
                                <span className="block text-[10px] text-slate-400 font-sans mt-0.5">Lang: {g.languages ? (Array.isArray(g.languages) ? g.languages.join(", ") : g.languages) : "Bangla"}</span>
                              </td>

                              {/* Location */}
                              <td className="py-4 px-4 text-slate-300">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  <span>{g.location}</span>
                                </span>
                              </td>

                              {/* Price */}
                              <td className="py-4 px-4 font-mono font-bold text-slate-200">
                                ৳ {g.price.toLocaleString()}
                              </td>

                              {/* Verification Toggle */}
                              <td className="py-4 px-4">
                                <button
                                  onClick={() => toggleGuideVerification(g.id)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase cursor-pointer transition-colors ${
                                    g.badge === "Verified" || g.badge === "Certified" || g.badge === "Eco Guide" || g.verified
                                      ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                                      : "bg-slate-800 text-slate-400 border border-slate-700"
                                  }`}
                                >
                                  {g.badge === "Verified" || g.badge === "Certified" || g.badge === "Eco Guide" || g.verified ? "Verified" : "Unverified"}
                                </button>
                              </td>

                              {/* Availability */}
                              <td className="py-4 px-4">
                                <button
                                  onClick={() => updateGuide(g.id, { available: !g.available })}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase cursor-pointer transition-colors ${
                                    g.available
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                  }`}
                                >
                                  {g.available ? "Active" : "Suspended"}
                                </button>
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => startEditGuide(g)}
                                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg transition-colors cursor-pointer border border-slate-700"
                                    title="Edit Guide Details"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete guide ${g.name}?`)) {
                                        deleteGuide(g.id);
                                      }
                                    }}
                                    className="p-1.5 bg-slate-800 hover:bg-rose-950/40 text-rose-400 rounded-lg transition-colors cursor-pointer border border-slate-700"
                                    title="Delete Guide"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

          {/* Copyright notice at bottom of Admin Content Area */}
          <footer className="py-4 text-center text-[10px] text-slate-500 font-mono border-t border-slate-900 bg-slate-900/10 mt-auto text-left pl-8">
            SylhetGo Enterprise Administration Portal • SECURE CHANNEL TLS 1.3 SYSTEM LOGGED
          </footer>
        </main>

        {/* ---- STAY FORM MODAL ---- */}
        {showStayModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200 text-left">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-xl w-full overflow-hidden shadow-2xl relative p-6 md:p-8 space-y-6 animate-in zoom-in-95 duration-300">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-900/50">
                    <Hotel className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-100">
                      {selectedAdminStay ? "Edit Eco-Stay Details" : "Register New Eco-Stay"}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono font-bold">STAYS DATABASE PIPELINE</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStayModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleStaySubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Stay Title</label>
                    <input
                      type="text"
                      required
                      value={stayForm.title}
                      onChange={(e) => setStayForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Sreemangal Eco Lodge"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Category</label>
                    <select
                      value={stayForm.category}
                      onChange={(e) => setStayForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                    >
                      <option value="Eco-Resort">Eco-Resort</option>
                      <option value="Treehouse">Treehouse</option>
                      <option value="Cottage">Cottage</option>
                      <option value="Homestay">Homestay</option>
                      <option value="Wooden House">Wooden House</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Location</label>
                    <select
                      value={stayForm.location}
                      onChange={(e) => setStayForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                    >
                      <option value="Sreemangal">Sreemangal</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Jaflong">Jaflong</option>
                      <option value="Sari River">Sari River</option>
                      <option value="Tanguar Haor">Tanguar Haor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Price (BDT / Night)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={stayForm.price}
                      onChange={(e) => setStayForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Eco-Score (%)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={100}
                      value={stayForm.ecoScore}
                      onChange={(e) => setStayForm(prev => ({ ...prev, ecoScore: Number(e.target.value) }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Image URL</label>
                  <input
                    type="url"
                    required
                    value={stayForm.image}
                    onChange={(e) => setStayForm(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={stayForm.description}
                    onChange={(e) => setStayForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter short description of stay..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Features / Amenities (Comma separated)</label>
                  <input
                    type="text"
                    value={stayForm.features}
                    onChange={(e) => setStayForm(prev => ({ ...prev, features: e.target.value }))}
                    placeholder="e.g. Solar Power, Organic Farming, Water Recycling"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowStayModal(false)}
                    className="w-1/3 py-3 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-900/20 cursor-pointer"
                  >
                    Save Lodge Details
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ---- GUIDE FORM MODAL ---- */}
        {showGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200 text-left">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-xl w-full overflow-hidden shadow-2xl relative p-6 md:p-8 space-y-6 animate-in zoom-in-95 duration-300">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-900/50">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-100">
                      {selectedAdminGuide ? "Edit Guide Details" : "Register Naturalist Guide"}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono font-bold">GUIDES DATABASE PIPELINE</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleGuideSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Guide Name</label>
                    <input
                      type="text"
                      required
                      value={guideForm.name}
                      onChange={(e) => setGuideForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Anowar Hussain"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Specialty</label>
                    <select
                      value={guideForm.category}
                      onChange={(e) => setGuideForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                    >
                      <option value="Wildlife & Swamp Specialist">Swamp Specialist</option>
                      <option value="Forest Trekking Guide">Forest Trekking Guide</option>
                      <option value="Tribal Culture Expert">Tribal Culture Expert</option>
                      <option value="Birding Naturalist">Birding Naturalist</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Location</label>
                    <select
                      value={guideForm.location}
                      onChange={(e) => setGuideForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                    >
                      <option value="Sylhet">Sylhet</option>
                      <option value="Sreemangal">Sreemangal</option>
                      <option value="Ratargul Swamp">Ratargul Swamp</option>
                      <option value="Hakaluki Haor">Hakaluki Haor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Price (BDT / Day)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={guideForm.price}
                      onChange={(e) => setGuideForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Exp (Years)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={guideForm.experienceYears}
                      onChange={(e) => setGuideForm(prev => ({ ...prev, experienceYears: Number(e.target.value) }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Contact Phone Number</label>
                    <input
                      type="text"
                      required
                      value={guideForm.phone}
                      onChange={(e) => setGuideForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+880 1712-XXXXXX"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Languages (Comma separated)</label>
                    <input
                      type="text"
                      value={guideForm.languages}
                      onChange={(e) => setGuideForm(prev => ({ ...prev, languages: e.target.value }))}
                      placeholder="Bangla, English, Sylheti"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Image URL</label>
                  <input
                    type="url"
                    required
                    value={guideForm.image}
                    onChange={(e) => setGuideForm(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 font-mono">Short Bio / Description</label>
                  <textarea
                    required
                    rows={3}
                    value={guideForm.description}
                    onChange={(e) => setGuideForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter short biography..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowGuideModal(false)}
                    className="w-1/3 py-3 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-900/20 cursor-pointer"
                  >
                    Save Guide Details
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50/20 text-gray-800">
      
      {/* 1. HEADER & PREMIUM NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100/50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <button 
              onClick={() => { setCurrentPage("home"); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 fill-emerald-100/20" />
              </div>
              <div>
                <span className="font-display font-extrabold text-2xl tracking-tight text-emerald-950 flex items-center gap-1">
                  Sylhet<span className="text-emerald-600">Go</span>
                </span>
                <span className="block text-[9px] tracking-widest uppercase font-semibold text-teal-600 -mt-1 font-mono">
                  Eco-Tourism Portal
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage("home")}
                className={`font-sans text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                  currentPage === "home" 
                    ? "text-emerald-900 bg-emerald-50/80 border border-emerald-100/40" 
                    : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/20"
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentPage("stays")}
                className={`font-sans text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                  currentPage === "stays" 
                    ? "text-emerald-900 bg-emerald-50/80 border border-emerald-100/40" 
                    : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/20"
                }`}
              >
                Stays
              </button>
              <button 
                onClick={() => setCurrentPage("transport")}
                className={`font-sans text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                  currentPage === "transport" 
                    ? "text-emerald-900 bg-emerald-50/80 border border-emerald-100/40" 
                    : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/20"
                }`}
              >
                Transport
              </button>
              <button 
                onClick={() => setCurrentPage("guides")}
                className={`font-sans text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                  currentPage === "guides" 
                    ? "text-emerald-900 bg-emerald-50/80 border border-emerald-100/40" 
                    : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/20"
                }`}
              >
                Guides
              </button>
              <button 
                onClick={() => setCurrentPage("attractions")}
                className={`font-sans text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                  currentPage === "attractions" 
                    ? "text-emerald-900 bg-emerald-50/80 border border-emerald-100/40" 
                    : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/20"
                }`}
              >
                Attractions
              </button>
              <button 
                onClick={() => setCurrentPage("dining")}
                className={`font-sans text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                  currentPage === "dining" 
                    ? "text-emerald-900 bg-emerald-50/80 border border-emerald-100/40" 
                    : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/20"
                }`}
              >
                Dining
              </button>
              <button 
                onClick={() => setCurrentPage("haor")}
                className={`font-sans text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                  currentPage === "haor" 
                    ? "text-emerald-900 bg-emerald-50/80 border border-emerald-100/40" 
                    : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/20"
                }`}
              >
                Haor Tracker
              </button>
              <button 
                onClick={() => setCurrentPage("emergency")}
                className={`font-sans text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                  currentPage === "emergency" 
                    ? "text-emerald-900 bg-emerald-50/80 border border-emerald-100/40" 
                    : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/20"
                }`}
              >
                Emergency
              </button>
              <button 
                onClick={() => setCurrentPage("community")}
                className={`font-sans text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                  currentPage === "community" 
                    ? "text-emerald-900 bg-emerald-50/80 border border-emerald-100/40" 
                    : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/20"
                }`}
              >
                Community
              </button>
            </nav>

            {/* Book Button */}
            <div className="hidden xl:flex items-center gap-3">
              <button 
                onClick={() => setCurrentPage("stays")}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-sans text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-200 hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:-translate-y-0.5"
              >
                Book Eco-Stay
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-emerald-950 hover:bg-emerald-50/80 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-emerald-100/50 shadow-inner max-h-[calc(100vh-80px)] overflow-y-auto px-4 py-6 space-y-2">
            {[
              { id: "home", label: "Home" },
              { id: "stays", label: "Stays & Eco-Lodges" },
              { id: "transport", label: "Transport Hub" },
              { id: "guides", label: "Local Naturalist Guides" },
              { id: "attractions", label: "Attractions Guide" },
              { id: "dining", label: "Food & Dining" },
              { id: "haor", label: "Haor Wetland Tracker" },
              { id: "emergency", label: "Emergency & Helplines" },
              { id: "community", label: "Community Forum" }
            ].map((mob) => (
              <button
                key={mob.id}
                onClick={() => {
                  setCurrentPage(mob.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left block font-sans font-semibold px-4 py-2.5 rounded-xl transition-all ${
                  currentPage === mob.id
                    ? "bg-emerald-50/80 text-emerald-900 border border-emerald-100/40"
                    : "text-gray-700 hover:bg-emerald-50/30"
                }`}
              >
                {mob.label}
              </button>
            ))}

            <div className="pt-4 border-t border-emerald-100">
              <button 
                onClick={() => {
                  setCurrentPage("stays");
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-sans text-xs font-bold py-3 px-4 rounded-xl text-center shadow-md shadow-emerald-200"
              >
                Book Eco-Stay
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN VIEW CONTROLLER RENDERER */}
      <main className="flex-grow">
        {currentPage === "home" && (
          <>
            {/* 2. HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-emerald-100/40 via-white to-transparent py-16 lg:py-24">
              <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-emerald-200/25 to-teal-100/25 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-gradient-to-tr from-yellow-100/20 to-teal-200/20 rounded-full blur-2xl -z-10" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left Side: Captivating Texts */}
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100/50 border border-emerald-200/30 rounded-full text-emerald-800 text-xs font-semibold tracking-wide font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      BANGLADESH'S GREEN ESCAPE
                    </div>
                    <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-emerald-950 leading-[1.1]">
                      Where Emerald Waters Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500">Mystical Hills</span>
                    </h1>
                    <p className="font-sans text-lg text-gray-600 max-w-2xl leading-relaxed">
                      Experience Sylhet's pristine tea gardens, freshwater swamp forests, and seasonal wetlands. Our curated booking portal links you directly with indigenous communities and sustainable eco-lodges.
                    </p>

                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">100% Locally Owned Lodging</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Certified Carbon-Neutral Transit</span>
                      </div>
                    </div>

                    {/* Advanced Interactive Search Engine */}
                    <div className="pt-4 max-w-xl">
                      <div className="bg-white rounded-2xl border border-emerald-100 shadow-xl shadow-emerald-100/40 p-1">
                        
                        {/* Selector Tabs */}
                        <div className="grid grid-cols-4 gap-1 border-b border-gray-100 p-1.5 bg-emerald-50/30 rounded-t-xl">
                          {[
                            { id: "stays", label: "Eco-Stays", icon: <Hotel className="w-3.5 h-3.5" /> },
                            { id: "transport", label: "Transit", icon: <Car className="w-3.5 h-3.5" /> },
                            { id: "guides", label: "Guides", icon: <Users className="w-3.5 h-3.5" /> },
                            { id: "attractions", label: "Spots", icon: <Compass className="w-3.5 h-3.5" /> }
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setActiveSearchTab(tab.id as any)}
                              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                                activeSearchTab === tab.id 
                                  ? "bg-white text-emerald-900 shadow-sm border border-emerald-100/50" 
                                  : "text-gray-500 hover:text-emerald-700"
                              }`}
                            >
                              {tab.icon}
                              <span>{tab.label}</span>
                            </button>
                          ))}
                        </div>

                        {/* Search Fields Form */}
                        <form onSubmit={handleLandingSearch} className="p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
                          
                          {/* Location Selection */}
                          <div className="flex-1 min-w-[130px]">
                            <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 font-mono">
                              Destination
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-emerald-500" />
                              <select
                                value={selectedDestination}
                                onChange={(e) => {
                                  setSelectedDestination(e.target.value);
                                  // Update search state if already performed
                                  if (searchPerformed) setSearchPerformed(true);
                                }}
                                className="w-full bg-gray-50/70 border border-gray-100 rounded-xl py-2 pl-9 pr-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              >
                                <option value="Sreemangal">Sreemangal</option>
                                <option value="Ratargul">Ratargul Swamp</option>
                                <option value="Tanguar Haor">Tanguar Haor</option>
                                <option value="Jaflong">Jaflong Cascades</option>
                              </select>
                            </div>
                          </div>

                          {/* Date picker */}
                          <div className="flex-1 min-w-[120px]">
                            <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 font-mono">
                              Date Planner
                            </label>
                            <div className="relative">
                              <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-emerald-500" />
                              <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full bg-gray-50/70 border border-gray-100 rounded-xl py-2 pl-9 pr-2 text-xs font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>
                          </div>

                          {/* Submit Button */}
                          <div className="sm:pt-5">
                            <button
                              type="submit"
                              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all shadow-md shadow-emerald-100 cursor-pointer"
                            >
                              <Search className="w-4 h-4" />
                              <span>Search</span>
                            </button>
                          </div>

                        </form>

                      </div>

                      {/* Search Results Display Area */}
                      {searchPerformed && (
                        <div className="mt-4 bg-white/95 backdrop-blur-md rounded-2xl border border-emerald-100 shadow-xl p-4 animate-in slide-in-from-top-2 duration-300 space-y-3 max-h-[350px] overflow-y-auto">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <h3 className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-800 font-mono flex items-center gap-1.5">
                              <span>🌿 Matching sustainable {activeSearchTab} ({getSearchResults().length})</span>
                            </h3>
                            <button 
                              onClick={() => setSearchPerformed(false)}
                              className="text-[10px] font-bold text-gray-400 hover:text-emerald-700 font-mono transition-all cursor-pointer"
                            >
                              ✕ Close Results
                            </button>
                          </div>
                          
                          {getSearchResults().length === 0 ? (
                            <div className="text-center py-6">
                              <p className="text-xs font-semibold text-gray-500">
                                No direct matching sustainable results found in "{selectedDestination}".
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1">
                                Check other tabs or try searching for Sreemangal or Ratargul.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2.5">
                              {getSearchResults().map((item: any) => {
                                return (
                                  <div key={item.id} className="flex gap-3 bg-emerald-50/10 hover:bg-emerald-50/30 p-2.5 rounded-xl border border-emerald-100/40 hover:border-emerald-100 transition-all text-left">
                                    {item.image && (
                                      <img 
                                        src={item.image} 
                                        alt={item.title || item.name} 
                                        className="w-14 h-14 object-cover rounded-lg shrink-0 border border-emerald-100/20"
                                        referrerPolicy="no-referrer"
                                      />
                                    )}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                      <div>
                                        <div className="flex items-center justify-between gap-2">
                                          <h4 className="text-xs font-extrabold text-emerald-950 truncate">{item.title || item.name}</h4>
                                          {item.rating && (
                                            <span className="text-[10px] text-amber-500 font-bold shrink-0">★ {item.rating}</span>
                                          )}
                                        </div>
                                        <p className="text-[9px] text-gray-500 font-semibold truncate mt-0.5">{item.category}</p>
                                      </div>
                                      <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-100">
                                        <span className="text-xs font-black text-emerald-900">
                                          {item.price ? `৳${item.price.toLocaleString()}` : "Free Area"}
                                        </span>
                                        <button 
                                          onClick={() => {
                                            setCurrentPage(activeSearchTab);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                          }}
                                          className="text-[9px] bg-emerald-600 hover:bg-emerald-700 text-white font-black px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                                        >
                                          Book Now
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Right Side: Hero Visual Frame */}
                  <div className="lg:col-span-5 relative">
                    <div className="relative mx-auto max-w-[340px] sm:max-w-[400px] aspect-[4/5] rounded-[2.5rem] p-4 bg-white shadow-2xl border border-emerald-100/60 shadow-emerald-200/50 overflow-hidden group">
                      
                      {/* Visual Glass Header overlay representing premium SylhetGo app */}
                      <div className="absolute top-8 left-8 right-8 bg-white/70 backdrop-blur-md rounded-2xl p-3 border border-white/40 shadow-sm z-20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                            <Compass className="w-4 h-4 animate-spin-slow" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-emerald-950">Ratargul Swamp</h4>
                            <p className="text-[9px] text-gray-500 font-medium">Sylhet, Bangladesh</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full font-mono">
                          ● Active
                        </span>
                      </div>

                      {/* Primary Photo */}
                      <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
                        <img 
                          src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80" 
                          alt="Sylhet Tea Estates" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
                      </div>

                      {/* Floating bottom card: Wetland/Tea Estate quick stats */}
                      <div className="absolute bottom-8 left-8 right-8 bg-emerald-900/90 backdrop-blur-md rounded-2xl p-4 border border-emerald-800/50 text-white z-20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase font-bold text-teal-300 font-mono tracking-wider">
                            Live Conservation Health
                          </span>
                          <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                        </div>
                        <h3 className="text-base font-bold font-display">Sreemangal Bio-Sanctuary</h3>
                        <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-emerald-800/80 text-center">
                          <div>
                            <span className="block text-xs font-extrabold text-teal-200">98%</span>
                            <span className="text-[9px] text-emerald-100 font-medium">Eco Score</span>
                          </div>
                          <div>
                            <span className="block text-xs font-extrabold text-teal-200">12k+</span>
                            <span className="text-[9px] text-emerald-100 font-medium">Trees Saved</span>
                          </div>
                          <div>
                            <span className="block text-xs font-extrabold text-teal-200">BDT 4M</span>
                            <span className="text-[9px] text-emerald-100 font-medium">Local Paid</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Little Floating Badge */}
                    <div className="absolute -bottom-4 -left-4 bg-yellow-400 text-emerald-950 p-4 rounded-2xl shadow-lg border-2 border-white max-w-[150px] rotate-[-6deg] hidden sm:block">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-900 font-mono">
                        Sustainable choice
                      </p>
                      <p className="text-xs font-bold leading-tight mt-1">
                        10% of revenue goes to swamp reforestation.
                      </p>
                    </div>

                  </div>

                </div>
              </div>
            </section>

            {/* 3. HAOR SEASON TRACKER INTERACTIVE ALERT */}
            <section className="bg-white border-y border-emerald-100/50 py-12 relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-mono flex items-center justify-center gap-1">
                    <CloudRain className="w-4 h-4 text-emerald-500 animate-bounce" />
                    INTELLIGENT LANDSCAPE SENSING
                  </span>
                  <h2 className="font-display font-extrabold text-3xl text-emerald-950">
                    Wetland Hydrology & Boat Tracker
                  </h2>
                  <p className="text-gray-600 text-sm max-w-xl mx-auto">
                    Sylhet's massive wetlands (Haors) undergo dramatic landscape transformations. Switch seasons below to view real-time hydrology advice, boat pricing regulations, and visual changes.
                  </p>
                </div>

                <div className="max-w-4xl mx-auto bg-emerald-50/30 rounded-3xl p-6 border border-emerald-100 shadow-inner">
                  
                  {/* Season Slide Toggle */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-white p-1.5 rounded-2xl border border-emerald-100 flex items-center shadow-md">
                      <button
                        onClick={() => setHaorSeason("monsoon")}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                          haorSeason === "monsoon"
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                            : "text-gray-500 hover:text-emerald-700"
                        }`}
                      >
                        <Waves className="w-4 h-4" />
                        Monsoon Season (Jun - Sep)
                      </button>
                      <button
                        onClick={() => setHaorSeason("winter")}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                          haorSeason === "winter"
                            ? "bg-amber-600 text-white shadow-md shadow-amber-200"
                            : "text-gray-500 hover:text-emerald-700"
                        }`}
                      >
                        <Trees className="w-4 h-4" />
                        Winter Season (Oct - May)
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Card Display based on Season */}
                  <div className="grid md:grid-cols-12 gap-6 items-center">
                    
                    {/* Dynamic Image & Visual Label */}
                    <div className="md:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden border border-emerald-100">
                      <img 
                        src={
                          haorSeason === "monsoon"
                            ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80"
                            : "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80"
                        }
                        alt={haorSeason === "monsoon" ? "Tanguar Haor Flooded" : "Tanguar Haor Dry Meadow"}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <div className="text-left">
                          <span className="text-[10px] uppercase font-bold text-teal-300 font-mono tracking-wider">
                            Interactive Camera
                          </span>
                          <h4 className="text-white font-bold text-sm">
                            {haorSeason === "monsoon" ? "Tanguar Haor Under Water" : "Tanguar Haor Dry Grasslands"}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Hydrology & Travel Advisories */}
                    <div className="md:col-span-7 space-y-4 text-left">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full font-mono ${
                          haorSeason === "monsoon" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {haorSeason === "monsoon" ? "🌊 HIGHEST FLOOD LEVELS" : "🌾 MEADOWS & TREKKING ACTIVE"}
                        </span>
                        <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5 text-emerald-500" />
                          Updated 2 Hours Ago
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-xl text-emerald-950">
                        {haorSeason === "monsoon" 
                          ? "Deep-water boat cruising, bird migratory bays and floating forests are fully submerged." 
                          : "Wetland paths are dry, bird sanctuaries can be hiked, and light canoe floating is active."
                        }
                      </h3>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="bg-white p-3 rounded-xl border border-emerald-100/50 shadow-sm">
                          <span className="block text-[10px] font-bold text-gray-400 uppercase font-mono">
                            Safe Water Depth
                          </span>
                          <span className={`text-base font-extrabold ${haorSeason === "monsoon" ? "text-blue-600" : "text-amber-600"}`}>
                            {haorSeason === "monsoon" ? "12.4 Meters (Deep)" : "1.8 Meters (Shallow)"}
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-emerald-100/50 shadow-sm">
                          <span className="block text-[10px] font-bold text-gray-400 uppercase font-mono">
                            Regulated Daily Boat Rate
                          </span>
                          <span className="text-base font-extrabold text-emerald-700">
                            {haorSeason === "monsoon" ? "BDT 12,000 / Day" : "BDT 5,000 / Day"}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 bg-white/70 border border-emerald-100 rounded-xl p-3.5 items-start">
                        <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${haorSeason === "monsoon" ? "text-blue-500" : "text-amber-500"}`} />
                        <div>
                          <h5 className="text-xs font-bold text-emerald-950">
                            {haorSeason === "monsoon" ? "Lifejackets Mandatory" : "Migratory Birds Sanctuary Protection"}
                          </h5>
                          <p className="text-xs text-gray-500 leading-snug">
                            {haorSeason === "monsoon" 
                              ? "Local government authorities require standard orange flotation vests for all swamp forest navigations. Police patrol stations will check."
                              : "Loud speakers, motor soundings, and trash dumping near bird nests are strictly fined. Let's protect the natural sanctuary."
                            }
                          </p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => setCurrentPage("haor")}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 group"
                        >
                          Launch Full Wetland Water Gauge Tracker
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            </section>

            {/* 4. CURATED ECO-EXPERIENCES (Bento Grid) */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div className="text-left">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-mono">
                    CURATED WILD ESCAPES
                  </span>
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-emerald-950 mt-1">
                    Sylhet's Most Pristine Secrets
                  </h2>
                </div>
                <p className="text-gray-500 text-sm max-w-md text-left">
                  Our bookings are limited to pre-vetted eco-guides to control tourist footprints and support local community infrastructure directly.
                </p>
              </div>

              {/* Bento Grid Layout */}
              <div className="grid md:grid-cols-12 gap-6">
                
                {/* Card 1: Ratargul */}
                <div className="md:col-span-7 bg-white rounded-3xl border border-emerald-100 p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-100/30 transition-all group text-left">
                  <div className="space-y-4">
                    <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden relative border border-emerald-50">
                      <img 
                        src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80" 
                        alt="Ratargul" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                      />
                      <span className="absolute top-4 left-4 bg-emerald-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full font-mono">
                        💧 SWAMP BIOSPHERE
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                          The Amazon of Bengal
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs font-medium text-gray-500 flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-emerald-500" />
                          Gowainghat, Sylhet
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-2xl text-emerald-950">
                        Ratargul Freshwater Swamp Forest
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Float silently in traditional wooden canoes under canopies of Koroch and Hijol trees submerged in deep, crystal-clear swamp water. Highly protected wildlife corridor.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-6">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400 font-mono">
                        Best visiting month
                      </span>
                      <span className="text-sm font-bold text-emerald-900">
                        July to October
                      </span>
                    </div>
                    <button 
                      onClick={() => setCurrentPage("attractions")}
                      className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Card 2: Sreemangal */}
                <div className="md:col-span-5 bg-white rounded-3xl border border-emerald-100 p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-100/30 transition-all group text-left">
                  <div className="space-y-4">
                    <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden relative border border-emerald-50">
                      <img 
                        src="https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=600&q=80" 
                        alt="Sreemangal Tea Gardens" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                      />
                      <span className="absolute top-4 left-4 bg-emerald-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full font-mono">
                        ⛰️ TEA HILLS
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                          The Tea Capital
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs font-medium text-gray-500 flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-emerald-500" />
                          Maulvibazar, Sylhet
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-2xl text-emerald-950">
                        Sreemangal Tea Estates & Lawachara Forest
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Walk through endlessly rolling slopes of emerald-green tea shrubs, hike dense rainforests to find rare Hoolock Gibbons, and experience centuries-old indigenous tea culture.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-6">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400 font-mono">
                        Vibe check
                      </span>
                      <span className="text-sm font-bold text-emerald-900 font-sans">
                        Serene, Misty & Cultural
                      </span>
                    </div>
                    <button 
                      onClick={() => setCurrentPage("attractions")}
                      className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Card 3: Lalakhal */}
                <div className="md:col-span-6 bg-white rounded-3xl border border-emerald-100 p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-100/30 transition-all group text-left">
                  <div className="space-y-4">
                    <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden relative border border-emerald-50">
                      <img 
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" 
                        alt="Lalakhal" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                      />
                      <span className="absolute top-4 left-4 bg-emerald-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full font-mono">
                        💎 CRYSTAL RIVERS
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                          Pristine Shari River
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs font-medium text-gray-500 flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-emerald-500" />
                          Jaintiapur, Sylhet
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-xl text-emerald-950">
                        Lalakhal Glacial Blue Canal
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Witness the mythical blue-emerald waters flowing from the Jaintia Hills. Cruise silently in custom electric-boats designed to avoid diesel contamination in vulnerable watersheds.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-6">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400 font-mono">
                        Eco Initiative
                      </span>
                      <span className="text-sm font-bold text-emerald-900 font-sans">
                        Zero-Emission Electric Boats
                      </span>
                    </div>
                    <button 
                      onClick={() => setCurrentPage("attractions")}
                      className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Card 4: Bisnakhandi */}
                <div className="md:col-span-6 bg-white rounded-3xl border border-emerald-100 p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-100/30 transition-all group text-left">
                  <div className="space-y-4">
                    <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden relative border border-emerald-50">
                      <img 
                        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80" 
                        alt="Bisnakhandi" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                      />
                      <span className="absolute top-4 left-4 bg-emerald-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full font-mono">
                        🏔️ STONE CASCADES
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                          Where Clouds Touch Stone
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs font-medium text-gray-500 flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-emerald-500" />
                          Jaintiapur Borders
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-xl text-emerald-950">
                        Bisnakhandi Mountain Streams
                      </h3>
                      <p className="text-gray-500 text-sm">
                        An incredible natural spectacle where various steps of the Meghalaya mountains meet a crystal-clear running stream strewn with colored gravel and pebbles. Beautiful cloud sights.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-6">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400 font-mono">
                        Eco Advisory
                      </span>
                      <span className="text-sm font-bold text-amber-600 font-sans flex items-center gap-1 font-semibold">
                        <ShieldAlert className="w-3.5 h-3.5" /> Wear Sturdy Water Shoes
                      </span>
                    </div>
                    <button 
                      onClick={() => setCurrentPage("attractions")}
                      className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

              </div>
            </section>

            {/* 5. INTERACTIVE ECO-IMPACT ENGINE & TRAVELER PLEDGE */}
            <section className="bg-emerald-950 text-white py-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-800/20 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-teal-900/40 rounded-full blur-3xl -z-10" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left Column */}
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <span className="text-xs font-bold uppercase tracking-widest text-teal-400 font-mono flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-yellow-400" />
                      CONSERVATION FIRST PRINCIPLES
                    </span>
                    <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight leading-tight">
                      Our SylhetGo Eco-Impact Engine
                    </h2>
                    <p className="text-emerald-100/80 text-sm leading-relaxed max-w-2xl">
                      Tourism should revive ecosystems, not deplete them. SylhetGo guarantees that a significant portion of booking profits is allocated directly to wetlands protection, plastic extraction, and fair local salaries.
                    </p>

                    <div className="grid sm:grid-cols-3 gap-6 pt-4">
                      <div className="space-y-1">
                        <div className="w-10 h-10 rounded-lg bg-emerald-900 flex items-center justify-center text-teal-300">
                          <Award className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-sm">70% Direct Payout</h4>
                        <p className="text-xs text-emerald-200/70">
                          Bypassing multinational agents—money goes directly to boat drivers and guides.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="w-10 h-10 rounded-lg bg-emerald-900 flex items-center justify-center text-teal-300">
                          <Leaf className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-sm">Reforestation Fund</h4>
                        <p className="text-xs text-emerald-200/70">
                          Funding seed plantation grids of Swamp Hijol trees across Gowainghat swamp.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="w-10 h-10 rounded-lg bg-emerald-900 flex items-center justify-center text-teal-300">
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-sm">Waste Extraction</h4>
                        <p className="text-xs text-emerald-200/70">
                          Financing bi-weekly plastic bottle removal boat runs in Tanguar wetland.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Interactive Eco-Traveler Pledge */}
                  <div className="lg:col-span-5 text-left">
                    <div className="bg-emerald-900/60 backdrop-blur-md rounded-3xl p-6 border border-emerald-800 shadow-xl relative">
                      
                      <div className="absolute -top-5 right-6 w-12 h-12 bg-gradient-to-tr from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg text-emerald-950 font-bold rotate-12">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>

                      <h3 className="font-display font-bold text-xl mb-2">
                        Sign the Sylhet Eco-Traveler Pledge
                      </h3>
                      <p className="text-xs text-emerald-100/70 mb-6">
                        Join 12,400+ travellers who have sworn to travel sustainably, pack out trash, respect tribal habits, and preserve water environments.
                      </p>

                      {pledgeSigned ? (
                        <div className="bg-emerald-950/60 rounded-2xl p-6 border border-teal-500/30 text-center space-y-4 animate-in zoom-in-95 duration-300">
                          <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-7 h-7" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white">
                              Pledge Active, {pledgeName}!
                            </h4>
                            <p className="text-xs text-emerald-200/80 mt-1">
                              A dynamic carbon-neutral badge has been linked to your browser profile. Show this to any SylhetGo certified guide to redeem BDT 500 off your first excursion!
                            </p>
                          </div>
                          <div className="bg-emerald-900 p-3 rounded-xl border border-emerald-800 text-[10px] font-mono text-emerald-300">
                            ID: SG-ECO-PLEDGE-{Math.floor(100000 + Math.random() * 900000)}
                          </div>
                          <button
                            onClick={() => { setPledgeSigned(false); setPledgeName(""); }}
                            className="text-xs text-emerald-300 underline hover:text-white"
                          >
                            Sign another pledge
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleSignPledge} className="space-y-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider font-bold text-emerald-300 mb-1 font-mono">
                              Your Full Name
                            </label>
                            <input
                              type="text"
                              required
                              value={pledgeName}
                              onChange={(e) => setPledgeName(e.target.value)}
                              placeholder="e.g., Salman Chowdhury"
                              className="w-full bg-emerald-950/50 border border-emerald-800 rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-emerald-700 focus:outline-none focus:ring-1 focus:ring-teal-400"
                            />
                          </div>

                          <div className="space-y-2 text-xs text-emerald-200/80">
                            <label className="flex items-start gap-2 cursor-pointer">
                              <input type="checkbox" required className="mt-0.5 rounded border-emerald-800 bg-emerald-950 text-emerald-600 focus:ring-0" />
                              <span>I pledge to pack out all plastic waste from the swamp forest reserves.</span>
                            </label>
                            <label className="flex items-start gap-2 cursor-pointer">
                              <input type="checkbox" required className="mt-0.5 rounded border-emerald-800 bg-emerald-950 text-emerald-600 focus:ring-0" />
                              <span>I pledge to hire only verified local community boat captains & guides.</span>
                            </label>
                            <label className="flex items-start gap-2 cursor-pointer">
                              <input type="checkbox" required className="mt-0.5 rounded border-emerald-800 bg-emerald-950 text-emerald-600 focus:ring-0" />
                              <span>I pledge to respect tribal customs and village peace.</span>
                            </label>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 text-emerald-950 font-sans text-sm font-bold py-3 px-4 rounded-xl text-center shadow-lg transition-all transform hover:-translate-y-0.5"
                          >
                            Activate Carbon Badge
                          </button>
                        </form>
                      )}

                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* 6. TRAVELER STORIES & FEEDBACK */}
            <section className="py-16 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center space-y-2 mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-mono">
                  VERIFIED TRAVEL STORIES
                </span>
                <h2 className="font-display font-extrabold text-3xl text-emerald-950">
                  What Conscious Travellers Say
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-left">
                
                {/* Testimonial 1 */}
                <div className="bg-emerald-50/20 p-6 rounded-3xl border border-emerald-100/50 space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed italic">
                    "Novomera Eco-Lodge booked through SylhetGo was phenomenal. The food was organic, with local Shatkora recipes. Our guide Sufian spoke Khasia fluently and arranged deep boat tours safely. Outstanding platform."
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 overflow-hidden font-bold flex items-center justify-center text-emerald-800 font-mono text-xs">
                      AH
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Aris Henderson</h4>
                      <p className="text-[10px] text-gray-500">Melbourne, Australia</p>
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-emerald-50/20 p-6 rounded-3xl border border-emerald-100/50 space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed italic">
                    "Being able to toggle the Haor water sensors from winter to monsoon is very practical. We knew exactly when to visit Tanguar and what the government boat rates were. Zero price gouging! Local boat driver was paid fair wages."
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 overflow-hidden font-bold flex items-center justify-center text-emerald-800 font-mono text-xs">
                      TK
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Tariqul Khan</h4>
                      <p className="text-[10px] text-gray-500">Dhaka, Bangladesh</p>
                    </div>
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div className="bg-emerald-50/20 p-6 rounded-3xl border border-emerald-100/50 space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed italic">
                    "SylhetGo bridges tribal community guidelines and modern travellers perfectly. The Khasia self-guided etiquette tips meant our family stayed highly respectful. Our kids signed the eco-pledge and received physical wooden badges from the ranger!"
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 overflow-hidden font-bold flex items-center justify-center text-emerald-800 font-mono text-xs">
                      ML
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Marie Laurent</h4>
                      <p className="text-[10px] text-gray-500">Lyon, France</p>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          </>
        )}

        {/* Dynamic page rendering */}
        {currentPage === "stays" && <StaysPage />}
        {currentPage === "transport" && <TransportPage />}
        {currentPage === "guides" && <GuidesPage />}
        {currentPage === "attractions" && <AttractionsPage />}
        {currentPage === "dining" && <DiningPage />}
        {currentPage === "haor" && <HaorPage />}
        {currentPage === "emergency" && <EmergencyPage />}
        {currentPage === "community" && <CommunityPage />}
      </main>

      {/* 7. PREMIUM FOOTER */}
      <footer className="bg-emerald-950 text-gray-400 border-t border-emerald-900 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-emerald-900">
            
            {/* Column 1: Brand Info */}
            <div className="md:col-span-5 space-y-4 text-left">
              <button onClick={() => setCurrentPage("home")} className="flex items-center gap-2 text-left">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md">
                  <Leaf className="w-4 h-4 fill-emerald-100/20" />
                </div>
                <span className="font-display font-extrabold text-xl tracking-tight text-white">
                  Sylhet<span className="text-emerald-400">Go</span>
                </span>
              </button>
              <p className="text-xs leading-relaxed max-w-sm">
                SylhetGo is a dedicated premium eco-tourism network designed to support small-scale local operators, wooden boat guilds, and tribal home-stays across northeastern Bangladesh.
              </p>
              <div className="text-[10px] text-emerald-300 font-semibold font-mono uppercase tracking-widest">
                PERSISTENT LOCAL DATA • CONNECTED WORKSPACE
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="md:col-span-3 space-y-3 text-left">
              <h4 className="text-sm font-bold text-white font-display">Sustainable Sectors</h4>
              <ul className="space-y-2 text-xs">
                {[
                  { id: "stays", label: "Eco-Stays & Cottages" },
                  { id: "transport", label: "Sustainable Rides" },
                  { id: "guides", label: "Certified Naturalist Guides" },
                  { id: "attractions", label: "Protected Swamp Reserves" }
                ].map((item) => (
                  <li key={item.id}>
                    <button 
                      onClick={() => setCurrentPage(item.id)}
                      className="hover:text-emerald-400 transition-colors text-left"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Newsletter */}
            <div className="md:col-span-4 space-y-3 text-left">
              <h4 className="text-sm font-bold text-white font-display">Conservation Letters</h4>
              <p className="text-xs">
                Subscribe to receive seasonal water-level alerts, tribal festival reminders, and eco-lodges discounts.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="name@domain.com"
                  className="bg-emerald-900/50 border border-emerald-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                />
                <button 
                  onClick={() => alert("Thank you for signing up to SylhetGo Conservation Letters!")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-lg flex items-center justify-center shadow-md flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Bottom metadata copy */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-left">
            <p>© {new Date().getFullYear()} SylhetGo. Powered with persistent local state. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="hover:text-emerald-400 transition-colors cursor-pointer bg-transparent border-none outline-none font-medium text-[10px]"
              >
                Privacy Matrix
              </button>
              <button
                onClick={() => setShowConservationModal(true)}
                className="hover:text-emerald-400 transition-colors cursor-pointer bg-transparent border-none outline-none font-medium text-[10px]"
              >
                Conservation Terms
              </button>
              <button
                onClick={() => setShowLNTModal(true)}
                className="hover:text-emerald-400 transition-colors cursor-pointer font-extrabold text-emerald-400 font-sans bg-transparent border-none outline-none text-[10px]"
              >
                Leave No Trace Code
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* 1. PRIVACY MATRIX MODAL */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-[2rem] border border-emerald-100 max-w-lg w-full overflow-hidden shadow-2xl relative p-6 md:p-8 space-y-5 animate-in zoom-in-95 duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 shadow-md">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg md:text-xl text-emerald-950">
                  SylhetGo Secure Privacy Matrix
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Sylhet's premium decentralized eco-system data policy.
                </p>
              </div>
            </div>

            <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50 space-y-3">
              <p className="text-xs text-emerald-950 font-bold leading-relaxed">
                Protecting your travel footprint is fundamental to responsible eco-tourism. Here is how we encrypt and manage your data:
              </p>
              
              <ul className="space-y-2.5 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold font-mono shrink-0">✓</span>
                  <span>
                    <strong>Local Client-Side Storage:</strong> Your private contact details (Tourist Name, Email Address, and Phone Number) are saved securely in your browser's local state, completely protected from external database leaks.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold font-mono shrink-0">✓</span>
                  <span>
                    <strong>Encrypted Transaction Auditing:</strong> Payment data including bKash/Nagad transaction IDs, booked items, and budgets are tracked locally with one-way checksums that only verified local operators can audit.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold font-mono shrink-0">✓</span>
                  <span>
                    <strong>Anti-Ad Tracking Policy:</strong> We do not capture browser telemetry, locate coordinates outside of Sylhet region boundaries, or sell search patterns to third-party ad brokers.
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono bg-gray-50 p-2.5 rounded-xl border border-gray-100 justify-center">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Verified TLS 1.3 Local State Protection Active</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full py-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-white text-xs font-bold shadow-md text-center font-display transition-all cursor-pointer"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONSERVATION TERMS MODAL */}
      {showConservationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-[2rem] border border-emerald-100 max-w-lg w-full overflow-hidden shadow-2xl relative p-6 md:p-8 space-y-5 animate-in zoom-in-95 duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 shadow-md">
                <Leaf className="w-6 h-6 text-emerald-600 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg md:text-xl text-emerald-950">
                  SylhetGo Conservation Terms
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Responsible exploration standards for premium eco-travelers.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-gray-600 leading-relaxed max-h-[300px] overflow-y-auto pr-1">
              <p className="font-bold text-emerald-950">
                Sylhet's natural wetlands (haor) and deep tea plantations are extremely fragile. By booking services through SylhetGo, you commit to these eco-conservation terms:
              </p>

              <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-100/50 space-y-1.5">
                <h4 className="font-extrabold text-emerald-950 flex items-center gap-1">
                  <span>✊ Respect Indigenous Tribes & Communities</span>
                </h4>
                <p>
                  Respect the indigenous Khasi, Manipuri, and Garo communities surrounding Sreemangal and the wetlands. Walk on official roads, respect private properties, and do not take pictures of local residents without asking.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100/50 space-y-1.5">
                <h4 className="font-extrabold text-emerald-950 flex items-center gap-1">
                  <span>🦉 Do Not Disrupt Wildlife Ecosystems</span>
                </h4>
                <p>
                  Never disturb the wildlife, migratory birds, or fragile aquatic life while taking boat rides through Ratargul Swamp Forest, Lalakhal, or Tanguar Haor. Loud speakers, shouting, or feeding wild monkeys is strictly prohibited.
                </p>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5">
                <h4 className="font-extrabold text-emerald-950 flex items-center gap-1">
                  <span>🌱 Guard Tea Gardens & Wetlands Pathing</span>
                </h4>
                <p>
                  Respect the work of tea garden leaf pluckers. Follow tea estate paths strictly and never pluck young leaves or step over fragile crop beds.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setShowConservationModal(false);
                  alert("Thank you for committing to Sylhet's conservation agreements!");
                }}
                className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md text-center font-display transition-all cursor-pointer"
              >
                Commit to Conservation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. LEAVE NO TRACE CODE MODAL (GREEN TRAVEL RULES) */}
      {showLNTModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-[2rem] border border-emerald-100 max-w-lg w-full overflow-hidden shadow-2xl relative p-6 md:p-8 space-y-5 animate-in zoom-in-95 duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-md">
                <Trees className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg md:text-xl text-emerald-950">
                  SylhetGo Green Travel Rules
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Interactive checklist for Leave No Trace eco-tourists.
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Be a protector of Sylhet's natural beauty! Complete our 3 core eco-directives before or during your travel. Tick each rule as you pledge to complete it:
            </p>

            <div className="space-y-3">
              {/* Directive 1 */}
              <div 
                onClick={() => {
                  setLntChecklist(prev => ({ ...prev, waste: !prev.waste }));
                }}
                className={`flex gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  lntChecklist.waste 
                    ? "bg-emerald-50 border-emerald-300 shadow-sm" 
                    : "bg-gray-50 border-gray-100 hover:bg-gray-100/50"
                }`}
              >
                <div className="pt-0.5 shrink-0">
                  {lntChecklist.waste ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 animate-bounce" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-emerald-950">Carry plastic waste back from Ratargul Swamp and Jaflong</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 font-medium">I will pack all non-biodegradable trash, snacks bags, and plastic bottles to hand over to central municipal disposal systems in Sylhet.</p>
                </div>
              </div>

              {/* Directive 2 */}
              <div 
                onClick={() => {
                  setLntChecklist(prev => ({ ...prev, water: !prev.water }));
                }}
                className={`flex gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  lntChecklist.water 
                    ? "bg-emerald-50 border-emerald-300 shadow-sm" 
                    : "bg-gray-50 border-gray-100 hover:bg-gray-100/50"
                }`}
              >
                <div className="pt-0.5 shrink-0">
                  {lntChecklist.water ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 animate-bounce" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-emerald-950">Do not throw litter or pollute the fresh haor waters</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 font-medium">I will guarantee that no soaps, sunscreen oils, or synthetic chemicals enter pristine waters at Hakaluki Haor or Ratargul.</p>
                </div>
              </div>

              {/* Directive 3 */}
              <div 
                onClick={() => {
                  setLntChecklist(prev => ({ ...prev, guides: !prev.guides }));
                }}
                className={`flex gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  lntChecklist.guides 
                    ? "bg-emerald-50 border-emerald-300 shadow-sm" 
                    : "bg-gray-50 border-gray-100 hover:bg-gray-100/50"
                }`}
              >
                <div className="pt-0.5 shrink-0">
                  {lntChecklist.guides ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 animate-bounce" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-emerald-950">Support local economies by hiring verified local community guides</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 font-medium">I pledge to employ authorized local boatmen and guides to make sure the money generated directly feeds families living around the swamp forests.</p>
                </div>
              </div>
            </div>

            {/* Checklist progress bar or score */}
            <div className="flex items-center justify-between px-2 text-[10px] font-mono font-bold text-gray-500">
              <span>PROGRESS METRIC:</span>
              <span className={Object.values(lntChecklist).filter(Boolean).length === 3 ? "text-emerald-600 animate-pulse font-black" : "text-emerald-800"}>
                Checked: {Object.values(lntChecklist).filter(Boolean).length} / 3 Eco-Rules
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setShowLNTModal(false);
                  if (Object.values(lntChecklist).filter(Boolean).length === 3) {
                    alert("Amazing! You checked all 3 rules. Thank you for being an exemplary eco-tourist!");
                  } else {
                    alert("Rules acknowledged. Remember to carry your plastic waste and preserve Sylhet's waters!");
                  }
                }}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md text-center font-display transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {Object.values(lntChecklist).filter(Boolean).length === 3 && (
                  <Award className="w-4 h-4 text-white shrink-0 animate-bounce" />
                )}
                <span>Verify My Footprint & Close</span>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ENTERPRISE ADMIN SECURE LOGIN MODAL */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md text-left">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-md w-full overflow-hidden shadow-2xl relative p-6 md:p-8 space-y-5">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-950 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-800/50 shadow-inner">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-lg md:text-xl text-slate-100">
                    Enterprise Admin Portal
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    SylhetGo Secure Gateway Authorization
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setShowAdminLogin(false); setLoginError(""); }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning Message */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-[11px] text-slate-300 space-y-1.5 leading-relaxed font-mono">
              <span className="text-indigo-400 font-bold block">⚠️ SECURE ACCESS CONTROL</span>
              Authorized personnel only. Sessions are logged locally. Toggle this modal any time using <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-100 font-bold">Ctrl + Shift + A</kbd>.
            </div>

            {/* Login Form */}
            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  Administrator Username
                </label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Enter admin ID"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  Access Key Passphrase
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              {loginError && (
                <p className="text-rose-400 text-xs font-semibold font-mono animate-pulse bg-rose-950/20 p-2.5 rounded-lg border border-rose-900/30">
                  ⚠️ {loginError}
                </p>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowAdminLogin(false); setLoginError(""); }}
                  className="w-1/3 py-3 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold font-display transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-display transition-all cursor-pointer text-center flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/30"
                >
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>Authenticate Access</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
