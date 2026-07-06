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
  Square
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
import AdminPage from "./components/AdminPage";

type SearchTab = "stays" | "transport" | "guides" | "attractions";

export default function App() {
  // Client Router state
  // Supported pages: "home" | "stays" | "transport" | "guides" | "attractions" | "dining" | "haor" | "emergency" | "community" | "admin"
  const [currentPage, setCurrentPage] = useState<string>("home");

  // Database Context
  const { stays, transport, guides, attractions } = useDB();

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

  // Admin Mode state & handlers
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminInputPassword, setAdminInputPassword] = useState("");
  const [adminError, setAdminError] = useState("");

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

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentAdminPassword = localStorage.getItem("sylhetgo_admin_password") || "Sylhetgo@2026";
    if (adminInputPassword === currentAdminPassword) {
      setAdminAuthenticated(true);
      setShowAdminLoginModal(false);
      setAdminInputPassword("");
      setAdminError("");
      setCurrentPage("admin");
    } else {
      setAdminError("Invalid Password. Please try again.");
      alert("Invalid Password");
    }
  };

  const handleAdminNavigation = () => {
    if (adminAuthenticated) {
      setCurrentPage("admin");
    } else {
      setAdminError("");
      setAdminInputPassword("");
      setShowAdminLoginModal(true);
    }
  };

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

            {/* Admin toggle + Book Button */}
            <div className="hidden xl:flex items-center gap-3">
              <button
                onClick={handleAdminNavigation}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  currentPage === "admin"
                    ? "bg-purple-950 text-white shadow-sm animate-pulse"
                    : "bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-100/40"
                }`}
              >
                <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                <span>{adminAuthenticated ? "Admin Dashboard" : "Admin Login"}</span>
              </button>

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

        {/* Mobile Navigation Panel */}
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
              { id: "community", label: "Community Forum" },
              { id: "admin", label: adminAuthenticated ? "Admin Dashboard" : "Admin Panel Console" }
            ].map((mob) => (
              <button
                key={mob.id}
                onClick={() => {
                  if (mob.id === "admin") {
                    handleAdminNavigation();
                  } else {
                    setCurrentPage(mob.id);
                  }
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
        {currentPage === "admin" && (
          adminAuthenticated ? (
            <AdminPage 
              onLogout={() => { 
                setAdminAuthenticated(false); 
                setAdminInputPassword(""); 
                setAdminError(""); 
                setCurrentPage("home"); 
              }} 
            />
          ) : <div className="p-20 text-center text-rose-600 font-bold bg-white rounded-3xl border border-red-100 max-w-lg mx-auto my-10">Access Denied. Please authenticate via the Admin console login first.</div>
        )}
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
                onClick={handleAdminNavigation}
                className="hover:text-purple-400 text-purple-300 font-mono text-[10px] uppercase font-bold flex items-center gap-1 transition-colors cursor-pointer bg-transparent border-none outline-none"
              >
                <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                <span>{adminAuthenticated ? "Logged in as Admin" : "Secure Admin Console Login"}</span>
              </button>
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

      {/* ADMIN PASSWORD PROMPT MODAL */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] border border-emerald-100 max-w-sm w-full overflow-hidden shadow-2xl relative p-6 space-y-4 animate-in zoom-in-95 duration-300">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-md">
                <Settings className="w-6 h-6 animate-spin-slow" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-emerald-950">
                SylhetGo Secure Login
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Provide administrative password to update eco-resorts, CNG/boat transport rates, and track active warning gauges.
              </p>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono tracking-wider">
                  Administrative Password
                </label>
                <input
                  type="password"
                  required
                  value={adminInputPassword}
                  onChange={(e) => setAdminInputPassword(e.target.value)}
                  placeholder="Enter Passcode..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white text-center font-mono text-emerald-950"
                  autoFocus
                />
              </div>

              {adminError && (
                <div className="bg-rose-50 text-rose-700 text-[11px] font-semibold px-3 py-2 rounded-xl text-center border border-rose-100 animate-pulse">
                  ⚠️ {adminError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLoginModal(false);
                    setAdminInputPassword("");
                    setAdminError("");
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 text-center transition-all animate-fade-in"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-white text-xs font-bold shadow-md text-center font-display transition-all"
                >
                  Verify ID
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

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


    </div>
  );
}
