import React, { useState, useEffect } from "react";
import {
  Compass,
  MapPin,
  Hotel,
  Car,
  Users,
  Shield,
  CalendarDays,
  Settings,
  Lock,
  Plus,
  Trash2,
  Edit3,
  TrendingUp,
  LogOut,
  Clock,
  Activity,
  ArrowRight,
  Search,
  Menu,
  X,
  Star,
  Leaf,
  Info,
  CheckCircle2,
  Calendar
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

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sign Eco Pledge State
  const [pledgeSigned, setPledgeSigned] = useState(false);
  const [pledgeName, setPledgeName] = useState("");

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Handle Landing Page Search submission
  const handleLandingSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPerformed(true);
  };

  // Submit Stay Form
  const handleStaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedFeatures = stayForm.features.split(",").map(f => f.trim()).filter(Boolean);
    if (selectedAdminStay) {
      updateStay(selectedAdminStay.id, {
        ...stayForm,
        price: Number(stayForm.price),
        ecoScore: Number(stayForm.ecoScore),
        features: parsedFeatures
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
        ...guideForm,
        price: Number(guideForm.price),
        experienceYears: Number(guideForm.experienceYears),
        languages: parsedLanguages
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

  // Mock function to trigger a booking pipeline influx item from client side
  const triggerMockBooking = (itemName: string, price: number, type: "Stay" | "Guide") => {
    const currentBookings = JSON.parse(localStorage.getItem("sylhetgo_bookings") || "[]");
    const newBooking = {
      id: "SG-" + Math.floor(100000 + Math.random() * 900000),
      customerName: "Anonymous Eco-Traveler",
      customerPhone: "+880 1712-XXXXXX",
      customerEmail: "traveler@sylhetgo.com",
      serviceType: type,
      itemName: itemName,
      userBudget: price,
      status: "Pending",
      timestamp: new Date().toLocaleString()
    };
    localStorage.setItem("sylhetgo_bookings", JSON.stringify([newBooking, ...currentBookings]));
    alert(`Mock reservation pushed successfully into local pipeline!`);
    window.location.reload();
  };

  // Render Admin Layout if in Admin Mode
  if (isAdminMode) {
    const totalBookingsCount = bookings.length;
    const pendingBookingsCount = bookings.filter(b => b.status === "Pending").length;
    const totalRevenue = bookings.filter(b => b.status === "Approved").reduce((sum, b) => sum + b.userBudget, 0);
    const totalStaysCount = stays.length;
    const totalGuidesCount = guides.length;

    return (
      <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans antialiased">
        {/* SIDEBAR: bg-slate-900 */}
        <aside id="admin_sidebar" className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 text-left">
          <div className="h-20 px-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-100 flex items-center gap-1">
                Sylhet<span className="text-indigo-400">Go</span>
              </span>
              <span className="block text-[9px] tracking-widest uppercase font-mono font-bold text-slate-500 -mt-1">
                Enterprise Admin
              </span>
            </div>
          </div>

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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all text-left ${
                    active ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={() => setIsAdminMode(false)}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl py-3 text-xs font-bold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin Panel</span>
            </button>
          </div>
        </aside>

        {/* MAIN BODY AREA */}
        <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
          <header className="h-20 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-900/40 backdrop-blur-md sticky top-0 z-10 text-left">
            <div>
              <h1 className="font-extrabold text-xl text-slate-100 capitalize">{adminTab} Database Management</h1>
              <p className="text-[10px] font-mono text-slate-400">LocalStorage Connected Sync Workspace Pipeline</p>
            </div>
            <button
              onClick={() => setIsAdminMode(false)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg border border-emerald-500/20"
            >
              <span>Switch to Live Website View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </header>

          <div className="p-8 space-y-8 flex-1 text-left">
            {/* OVERVIEW DASHBOARD */}
            {adminTab === "dashboard" && (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <span className="text-[10px] uppercase text-slate-400 font-mono">Estimated Revenue</span>
                    <span className="block font-black text-2xl text-white mt-2">৳ {totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <span className="text-[10px] uppercase text-slate-400 font-mono">Total Bookings</span>
                    <span className="block font-black text-2xl text-white mt-2">{totalBookingsCount}</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <span className="text-[10px] uppercase text-slate-400 font-mono">Pending Actions</span>
                    <span className="block font-black text-2xl text-amber-400 mt-2">{pendingBookingsCount}</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <span className="text-[10px] uppercase text-slate-400 font-mono">Inventory Base</span>
                    <span className="block font-black text-2xl text-sky-400 mt-2">{totalStaysCount} Lodges</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 mb-4">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    Workspace Shared Sync Pipelines
                  </h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-950 rounded-xl flex justify-between font-mono text-xs">
                      <span className="text-slate-400">LocalStorage Active Influx Linkup:</span>
                      <span className="text-emerald-400">ONLINE ({bookings.length} reservations mapped)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* USER BOOKINGS INFLUX TABLE */}
            {adminTab === "bookings" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                        <th className="py-3 px-4">Booking ID</th>
                        <th className="py-3 px-4">Customer Info</th>
                        <th className="py-3 px-4">Reserved Item</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-center">Pipeline Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-800/20">
                          <td className="py-4 px-4 font-mono font-bold text-slate-200">{b.id}</td>
                          <td className="py-4 px-4">
                            <span className="block font-bold">{b.customerName}</span>
                            <span className="text-slate-400 font-mono text-[11px]">{b.customerPhone}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded font-mono text-[10px] mr-2">{b.serviceType}</span>
                            {b.itemName}
                          </td>
                          <td className="py-4 px-4 font-mono font-bold">৳ {b.userBudget}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${b.status === "Approved" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center space-x-2">
                            <button onClick={() => updateBookingStatus(b.id, "Approved")} className="bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 px-2 py-1 rounded hover:bg-emerald-600/40 text-[11px] font-bold">Approve</button>
                            <button onClick={() => updateBookingStatus(b.id, "Rejected")} className="bg-rose-600/20 border border-rose-500/30 text-rose-400 px-2 py-1 rounded hover:bg-rose-600/40 text-[11px] font-bold">Reject</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* STAYS DATABASE MANAGER */}
            {adminTab === "stays" && (
              <div className="space-y-4">
                <button onClick={() => { setSelectedAdminStay(null); setShowStayModal(true); }} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add New Eco-Lodge
                </button>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stays.map((s) => (
                      <div key={s.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-slate-100">{s.title}</h4>
                          <span className="text-xs text-slate-400 font-mono">{s.location}</span>
                          <span className="block text-indigo-400 text-xs font-bold font-mono mt-2">৳ {s.price} / night</span>
                        </div>
                        <div className="flex gap-2 mt-4 justify-end">
                          <button onClick={() => startEditStay(s)} className="text-slate-400 hover:text-white p-1.5 bg-slate-900 rounded"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => deleteStay(s.id)} className="text-rose-400 hover:text-rose-300 p-1.5 bg-slate-900 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* GUIDES DATABASE MANAGER */}
            {adminTab === "guides" && (
              <div className="space-y-4">
                <button onClick={() => { setSelectedAdminGuide(null); setShowGuideModal(true); }} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Register Naturalist Guide
                </button>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {guides.map((g) => (
                      <div key={g.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-slate-100">{g.name}</h4>
                          <span className="text-xs text-slate-400 font-mono">{g.category} - {g.location}</span>
                        </div>
                        <div className="flex gap-2 mt-4 justify-end">
                          <button onClick={() => startEditGuide(g)} className="text-slate-400 hover:text-white p-1.5 bg-slate-900 rounded"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => deleteGuide(g.id)} className="text-rose-400 hover:text-rose-300 p-1.5 bg-slate-900 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // STANDARD CLIENT REVENUE-FRONT UI LAYOUT
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* GLOBAL HEADER HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage("home")}>
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white"><Leaf className="w-4 h-4" /></div>
          <span className="font-extrabold text-lg text-slate-900 tracking-tight">Sylhet<span className="text-emerald-600">Go</span></span>
        </div>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button onClick={() => setCurrentPage("home")} className={`hover:text-emerald-600 ${currentPage === "home" ? "text-emerald-600" : ""}`}>Home</button>
          <button onClick={() => setCurrentPage("stays")} className={`hover:text-emerald-600 ${currentPage === "stays" ? "text-emerald-600" : ""}`}>Stays</button>
          <button onClick={() => setCurrentPage("transport")} className={`hover:text-emerald-600 ${currentPage === "transport" ? "text-emerald-600" : ""}`}>Transport</button>
          <button onClick={() => setCurrentPage("guides")} className={`hover:text-emerald-600 ${currentPage === "guides" ? "text-emerald-600" : ""}`}>Guides</button>
          <button onClick={() => setCurrentPage("attractions")} className={`hover:text-emerald-600 ${currentPage === "attractions" ? "text-emerald-600" : ""}`}>Attractions</button>
          <button onClick={() => setCurrentPage("dining")} className={`hover:text-emerald-600 ${currentPage === "dining" ? "text-emerald-600" : ""}`}>Dining</button>
          <button onClick={() => setCurrentPage("haor")} className={`hover:text-emerald-600 ${currentPage === "haor" ? "text-emerald-600" : ""}`}>Haor Tracker</button>
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={() => triggerMockBooking("Sreemangal Tea Lodge Resort", 4500, "Stay")} className="hidden md:inline-flex bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all">
            Insta-Book Eco-Stay
          </button>
        </div>
      </header>

      {/* CORE ROUTER VIEWPORTS PANEL */}
      <main className="flex-1">
        {currentPage === "home" && (
          <div className="max-w-6xl mx-auto px-6 py-12 text-center space-y-12">
            <div className="space-y-4 max-w-2xl mx-auto">
              <span className="text-xs uppercase bg-emerald-100 text-emerald-800 font-bold tracking-widest px-3 py-1 rounded-full">Bangladesh's Green Escape</span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-none">Where Emerald Waters Meet Mystical Hills</h1>
              <p className="text-slate-600 text-sm">Experience Sylhet's pristine tea gardens, freshwater swamp forests, and seasonal wetlands directly linked with sustainable local communities.</p>
            </div>

            <form onSubmit={handleLandingSearch} className="bg-white border border-slate-200 shadow-xl rounded-2xl p-4 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="text-left px-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono">Destination</label>
                <select value={selectedDestination} onChange={(e) => setSelectedDestination(e.target.value)} className="w-full text-sm font-bold bg-transparent text-slate-800 outline-none mt-1">
                  <option value="Sreemangal">Sreemangal</option>
                  <option value="Ratargul">Ratargul Swamp</option>
                  <option value="Jaflong">Jaflong Khasi</option>
                  <option value="Tanguar">Tanguar Haor</option>
                </select>
              </div>
              <div className="text-left px-2 border-t md:border-t-0 md:border-l border-slate-200">
                <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono">Date Planner</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full text-sm font-semibold bg-transparent text-slate-800 outline-none mt-1" />
              </div>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm h-12 rounded-xl flex items-center justify-center gap-2">
                <Search className="w-4 h-4" /> Search Availability
              </button>
            </form>
          </div>
        )}

        {currentPage === "stays" && <StaysPage />}
        {currentPage === "transport" && <TransportPage />}
        {currentPage === "guides" && <GuidesPage />}
        {currentPage === "attractions" && <AttractionsPage />}
        {currentPage === "dining" && <DiningPage />}
        {currentPage === "haor" && <HaorPage />}
        {currentPage === "emergency" && <EmergencyPage />}
        {currentPage === "community" && <CommunityPage />}
      </main>

      {/* FOOTER METADATA BAR */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800 mt-auto font-mono">
        <p>© 2026 SylhetGo Eco-Tourism Portal. Preserving wild indigenous horizons with local accountability.</p>
      </footer>

      {/* HIDDEN ADMINISTRATIVE ACCESS GATEWAY MODAL */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-6 text-left shadow-2xl animate-in scale-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-100">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-sm font-mono tracking-tight uppercase">Admin Security Shell</span>
              </div>
              <button onClick={() => setShowAdminLogin(false)} className="text-slate-500 hover:text-slate-300"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold text-slate-400 mb-1">Access Identity ID</label>
                <input type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} placeholder="Enter system username" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono focus:border-indigo-500" required />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold text-slate-400 mb-1">Security Passkey Code</label>
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono focus:border-indigo-500" required />
              </div>
              {loginError && <p className="text-[11px] text-rose-400 font-mono font-semibold">{loginError}</p>}
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl tracking-wide uppercase font-mono transition-all">
                Authenticate Credentials
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
