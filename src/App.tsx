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
              {["home", "stays", "transport", "guides", "attractions", "dining", "haor", "emergency", "community"].map((page) => (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`font-sans text-xs font-bold px-3 py-2 rounded-xl transition-all capitalize ${
                    currentPage === page 
                      ? "text-emerald-900 bg-emerald-50/80 border border-emerald-100/40" 
                      : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/20"
                  }`}
                >
                  {page === "haor" ? "Haor Tracker" : page}
                </button>
              ))}
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
                <Settings className="w-3.5 h-3.5" />
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
                        <div className="mt-4 bg-white/95 backdrop-blur-md rounded-2xl border border-emerald-100 shadow-xl p-4 space-y-3 max-h-[350px] overflow-y-auto">
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
                              <p className="text-xs font-semibold text-gray-500">No direct matching sustainable results found.</p>
                            </div>
                          ) : (
                            <div className="space-y-2.5">
                              {getSearchResults().map((item: any) => (
                                <div key={item.id} className="flex gap-3 bg-emerald-50/10 p-2.5 rounded-xl border border-emerald-100/40 text-left">
                                  {item.image && (
                                    <img 
                                      src={item.image} 
                                      alt={item.title || item.name} 
                                      className="w-14 h-14 object-cover rounded-lg shrink-0"
                                      referrerPolicy="no-referrer"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-center justify-between gap-2">
                                        <h4 className="text-xs font-extrabold text-emerald-950 truncate">{item.title || item.name}</h4>
                                        {item.rating && <span className="text-[10px] text-amber-500 font-bold">★ {item.rating}</span>}
                                      </div>
                                      <p className="text-[9px] text-gray-500 font-semibold truncate mt-0.5">{item.category}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-100">
                                      <span className="text-xs font-black text-emerald-900">
                                        {item.price ? `৳${item.price.toLocaleString()}` : "Free Area"}
                                      </span>
                                      <button 
                                        onClick={() => setCurrentPage(activeSearchTab)}
                                        className="text-[9px] bg-emerald-600 text-white font-black px-2.5 py-1 rounded-lg"
                                      >
                                        Book Now
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Hero Visual Frame */}
                  <div className="lg:col-span-5 relative">
                    <div className="relative mx-auto max-w-[340px] sm:max-w-[400px] aspect-[4/5] rounded-[2.5rem] p-4 bg-white shadow-2xl border border-emerald-100/60 overflow-hidden group">
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
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full font-mono">● Active</span>
                      </div>

                      <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
                        <img 
                          src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80" 
                          alt="Sylhet Tea Estates" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
                      </div>

                      <div className="absolute bottom-8 left-8 right-8 bg-emerald-900/90 backdrop-blur-md rounded-2xl p-4 border border-emerald-800/50 text-white z-20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase font-bold text-teal-300 font-mono tracking-wider">Live Conservation Health</span>
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
                      <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-900 font-mono">Sustainable choice</p>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* ECO PLEDGE SECTION */}
            <section className="py-12 bg-emerald-900 text-white border-t border-emerald-800">
              <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                <Leaf className="w-8 h-8 mx-auto text-teal-300 animate-bounce" />
                <h2 className="text-3xl font-bold font-display">Take the Sylhet Eco-Visitor Pledge</h2>
                <p className="text-emerald-100 max-w-xl mx-auto text-sm">Join conscious global travelers committed to preserving wetlands and respecting indigenous cultures.</p>
                
                {!pledgeSigned ? (
                  <form onSubmit={handleSignPledge} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                    <input 
                      type="text" 
                      placeholder="Enter your full name"
                      value={pledgeName}
                      onChange={(e) => setPledgeName(e.target.value)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm flex-1"
                      required
                    />
                    <button type="submit" className="bg-teal-400 hover:bg-teal-500 text-emerald-950 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" /> Sign Pledge
                    </button>
                  </form>
                ) : (
                  <div className="bg-emerald-800/80 p-4 rounded-2xl border border-teal-500/30 max-w-md mx-auto text-center">
                    <Award className="w-8 h-8 mx-auto text-yellow-400 mb-1" />
                    <p className="text-sm font-bold text-teal-200">Thank you, {pledgeName}!</p>
                    <p className="text-xs text-emerald-200 mt-1">You are a certified Eco-Responsible Guardian of Sylhet.</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* CONDITIONALLY RENDER MODULAR ROUTER PAGES */}
        {currentPage === "stays" && <StaysPage />}
        {currentPage === "transport" && <TransportPage />}
        {currentPage === "guides" && <GuidesPage />}
        {currentPage === "attractions" && <AttractionsPage />}
        {currentPage === "dining" && <DiningPage />}
        {currentPage === "haor" && <HaorPage />}
        {currentPage === "emergency" && <EmergencyPage />}
        {currentPage === "community" && <CommunityPage />}
        {currentPage === "admin" && <AdminPage />}
      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="font-display font-extrabold text-xl text-white">SylhetGo</span>
            <p className="text-xs text-emerald-300">Preserving the biodiversity and eco-heritage of Sylhet division through decentralized green travel initiatives.</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Resource Centers</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setShowLNTModal(true)} className="hover:text-white">Leave No Trace Guidelines</button></li>
              <li><button onClick={() => setShowConservationModal(true)} className="hover:text-white">Local Wetland Framework</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setShowPrivacyModal(true)} className="hover:text-white">Privacy & Native Data Rights</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Emergency Contact</h4>
            <p className="text-xs text-emerald-300 flex items-center gap-2"><PhoneCall className="w-3.5 h-3.5" /> support@sylhetgo.org</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[11px] text-emerald-400 border-t border-emerald-900/60 mt-8 pt-4">
          &copy; 2026 SylhetGo. All Rights Reserved. Built securely for eco-conscious conservationism.
        </div>
      </footer>

      {/* MODAL OVERLAYS (Admin Login & Footer Explanations) */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-purple-100 shadow-2xl relative">
            <button onClick={() => setShowAdminLoginModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center space-y-2 mb-4">
              <Lock className="w-8 h-8 mx-auto text-purple-700" />
              <h3 className="text-lg font-bold text-gray-900">Admin Authentication Console</h3>
              <p className="text-xs text-gray-500">Access protected database engines securely.</p>
            </div>
            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Security Token / Password</label>
                <input 
                  type="password" 
                  value={adminInputPassword}
                  onChange={(e) => setAdminInputPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 text-sm focus:outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
              {adminError && <p className="text-xs text-red-600 font-semibold">{adminError}</p>}
              <button type="submit" className="w-full bg-purple-950 text-white font-bold text-sm py-2.5 rounded-xl hover:bg-purple-900">
                Verify Identity
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LEAVE NO TRACE INTERACTIVE MODAL */}
      {showLNTModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white text-gray-800 rounded-3xl p-6 max-w-md w-full relative space-y-4">
            <button onClick={() => setShowLNTModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-950"><Shield className="w-5 h-5 text-emerald-600" /> Leave No Trace Code</h3>
            <p className="text-xs text-gray-600">Tick items off to prepare safely for your ecosystem venture:</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-xs font-medium cursor-pointer">
                <input type="checkbox" checked={lntChecklist.waste} onChange={() => setLntChecklist({...lntChecklist, waste: !lntChecklist.waste})} className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4" />
                <span>Pack out all plastic wrappers and metal wastes.</span>
              </label>
              <label className="flex items-center gap-3 text-xs font-medium cursor-pointer">
                <input type="checkbox" checked={lntChecklist.water} onChange={() => setLntChecklist({...lntChecklist, water: !lntChecklist.water})} className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4" />
                <span>Avoid discarding synthetic cosmetics into freshwater haors.</span>
              </label>
            </div>
            <button onClick={() => setShowLNTModal(false)} className="w-full bg-emerald-600 text-white font-bold text-xs py-2 rounded-xl">Got It</button>
          </div>
        </div>
      )}

      {/* PRIVACY MODAL */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full relative space-y-3">
            <button onClick={() => setShowPrivacyModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            <h3 className="text-base font-bold text-gray-900">Privacy & Data Charter</h3>
            <p className="text-xs text-gray-600 leading-relaxed">SylhetGo operates transparently. No native resident profiles or guest itineraries are tracked or sold to corporate brokers.</p>
          </div>
        </div>
      )}

      {/* CONSERVATION MODAL */}
      {showConservationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full relative space-y-3">
            <button onClick={() => setShowConservationModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            <h3 className="text-base font-bold text-gray-900">Wetland Framework Accord</h3>
            <p className="text-xs text-gray-600 leading-relaxed">Every booking fee processed funnels directly into ecosystem rejuvenation funds governed explicitly by regional naturalist communities.</p>
          </div>
        </div>
      )}

    </div>
  );
}
