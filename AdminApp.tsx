import React, { useState, useEffect } from "react";
import { useDB } from "./DBContext";
import { EcoStay, TransportRide, LocalGuide, EcoBooking } from "./types";
import {
  ShieldCheck,
  Lock,
  User,
  LogOut,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Sliders,
  AlertOctagon,
  TrendingUp,
  Clock,
  Briefcase,
  Layers,
  Users,
  Car,
  Hotel,
  Shield,
  Search,
  RefreshCw,
  Award,
  Bell,
  Activity,
  AlertTriangle,
  Info,
  SlidersHorizontal,
  Phone,
  Key
} from "lucide-react";

export default function AdminApp() {
  const {
    stays, addStay, updateStay, deleteStay,
    transport, addTransport, updateTransport, deleteTransport,
    guides, addGuide, updateGuide, deleteGuide, toggleGuideVerification,
    haor, updateHaor,
    alerts, addAlert, deleteAlert,
    bookings, updateBookingStatus, deleteBooking
  } = useDB();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("sylhetgo_admin_session") === "active";
  });
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // Routing State - standalone pages
  // "overview" | "stays" | "guides" | "haor" | "settings"
  const [activeTab, setActiveTab] = useState<"overview" | "stays" | "guides" | "haor" | "settings">("overview");

  // Search filter states
  const [staySearch, setStaySearch] = useState("");
  const [guideSearch, setGuideSearch] = useState("");

  // Add/Edit Modals States
  const [showAddStayModal, setShowAddStayModal] = useState(false);
  const [showEditStayModal, setShowEditStayModal] = useState(false);
  const [selectedStay, setSelectedStay] = useState<EcoStay | null>(null);

  const [showAddGuideModal, setShowAddGuideModal] = useState(false);
  const [showEditGuideModal, setShowEditGuideModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<LocalGuide | null>(null);

  const [showAddTransportModal, setShowAddTransportModal] = useState(false);
  const [showEditTransportModal, setShowEditTransportModal] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<TransportRide | null>(null);

  // Form Fields State - Stays
  const [stayTitle, setStayTitle] = useState("");
  const [stayCategory, setStayCategory] = useState("Premium Eco Lodge");
  const [stayLocation, setStayLocation] = useState("Sreemangal");
  const [stayPrice, setStayPrice] = useState(5000);
  const [stayEcoScore, setStayEcoScore] = useState(95);
  const [stayImage, setStayImage] = useState("");
  const [stayDesc, setStayDesc] = useState("");
  const [stayFeatures, setStayFeatures] = useState("");
  const [stayAvailable, setStayAvailable] = useState(true);

  // Form Fields State - Guides
  const [guideName, setGuideName] = useState("");
  const [guideSpecialty, setGuideSpecialty] = useState("Swamp Forest & Wildlife Specialist");
  const [guideLoc, setGuideLoc] = useState("Ratargul");
  const [guidePrice, setGuidePrice] = useState(2500);
  const [guideExp, setGuideExp] = useState(5);
  const [guideLanguages, setGuideLanguages] = useState("Bengali, English");
  const [guideImage, setGuideImage] = useState("");
  const [guideDesc, setGuideDesc] = useState("");
  const [guideAvailable, setGuideAvailable] = useState(true);

  // Form Fields State - Transport
  const [transTitle, setTransTitle] = useState("");
  const [transCategory, setTransCategory] = useState("Chauffeur Drive");
  const [transLoc, setTransLoc] = useState("Sreemangal");
  const [transPrice, setTransPrice] = useState(4000);
  const [transFuel, setTransFuel] = useState("Electric");
  const [transCapacity, setTransCapacity] = useState(5);
  const [transImage, setTransImage] = useState("");
  const [transDesc, setTransDesc] = useState("");
  const [transAvailable, setTransAvailable] = useState(true);

  // Wetland Form Fields State
  const [newAlertTitle, setNewAlertTitle] = useState("");
  const [newAlertSeverity, setNewAlertSeverity] = useState<"info" | "warning" | "danger">("warning");
  const [newAlertRegion, setNewAlertRegion] = useState("Ratargul Swamp");
  const [newAlertDesc, setNewAlertDesc] = useState("");
  const [newAlertContact, setNewAlertContact] = useState("");

  // bKash Form fields state
  const [bkashNumber, setBkashNumber] = useState(() => localStorage.getItem("sylhetgo_bkash_number") || "+8801700-SYLHET");
  const [bkashType, setBkashType] = useState(() => localStorage.getItem("sylhetgo_bkash_type") || "Merchant");

  // Credentials security state
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // Real-time Persistent Audit Logs
  const [auditLogs, setAuditLogs] = useState<{ id: string; action: string; category: "CMS" | "WETLAND" | "SECURITY" | "SYSTEM" | "BOOKING"; timestamp: string }[]>(() => {
    const saved = localStorage.getItem("sylhetgo_audit_logs");
    if (saved) return JSON.parse(saved);
    return [
      { id: "log-initial", action: "Enterprise Admin Console Initialized securely.", category: "SYSTEM", timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) },
      { id: "log-seed-1", action: "Default bKash configuration loaded.", category: "SYSTEM", timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) }
    ];
  });

  const appendAuditLog = (action: string, category: "CMS" | "WETLAND" | "SECURITY" | "SYSTEM" | "BOOKING") => {
    const newLog = {
      id: `log-${Date.now()}`,
      action,
      category,
      timestamp: new Date().toLocaleString()
    };
    setAuditLogs(prev => {
      const updated = [newLog, ...prev];
      localStorage.setItem("sylhetgo_audit_logs", JSON.stringify(updated));
      return updated;
    });
  };

  // Authenticate login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem("sylhetgo_admin_password") || "Sylhetgo@2026";
    if (passwordInput === storedPassword && (emailInput.toLowerCase().includes("admin") || emailInput === "")) {
      setIsAuthenticated(true);
      localStorage.setItem("sylhetgo_admin_session", "active");
      setLoginError("");
      appendAuditLog("Super Administrator authenticated successfully via credentials.", "SECURITY");
    } else {
      setLoginError("Invalid password or administrative email identifier. Please retry.");
    }
  };

  // Sign out
  const handleLogout = () => {
    if (confirm("Are you sure you want to terminate your administrative session?")) {
      setIsAuthenticated(false);
      localStorage.removeItem("sylhetgo_admin_session");
      setEmailInput("");
      setPasswordInput("");
      appendAuditLog("Administrative session terminated by user.", "SECURITY");
    }
  };

  // Auto-fill form helper - Stays
  const openEditStay = (stay: EcoStay) => {
    setSelectedStay(stay);
    setStayTitle(stay.title);
    setStayCategory(stay.category);
    setStayLocation(stay.location);
    setStayPrice(stay.price);
    setStayEcoScore(stay.ecoScore);
    setStayImage(stay.image);
    setStayDesc(stay.description);
    setStayFeatures(stay.features.join(", "));
    setStayAvailable(stay.available);
    setShowEditStayModal(true);
  };

  // Add Stay handler
  const handleAddStaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStay({
      title: stayTitle,
      category: stayCategory,
      location: stayLocation,
      price: Number(stayPrice),
      image: stayImage || "https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=600&q=80",
      description: stayDesc,
      features: stayFeatures.split(",").map(f => f.trim()).filter(Boolean),
    });
    appendAuditLog(`Added new Lodge/Stay: "${stayTitle}"`, "CMS");
    alert("Lodge added successfully!");
    setShowAddStayModal(false);
    resetStayForm();
  };

  // Edit Stay handler
  const handleEditStaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStay) return;
    updateStay(selectedStay.id, {
      title: stayTitle,
      category: stayCategory,
      location: stayLocation,
      price: Number(stayPrice),
      ecoScore: Number(stayEcoScore),
      image: stayImage,
      description: stayDesc,
      features: stayFeatures.split(",").map(f => f.trim()).filter(Boolean),
      available: stayAvailable,
    });
    appendAuditLog(`Updated Lodge details for ID: ${selectedStay.id} ("${stayTitle}")`, "CMS");
    alert("Lodge updated successfully!");
    setShowEditStayModal(false);
    setSelectedStay(null);
  };

  const handleDeleteStay = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete stay: "${name}"? This is permanent.`)) {
      deleteStay(id);
      appendAuditLog(`Deleted Stay/Lodge: "${name}" (ID: ${id})`, "CMS");
      alert("Lodge deleted successfully!");
    }
  };

  const resetStayForm = () => {
    setStayTitle("");
    setStayCategory("Premium Eco Lodge");
    setStayLocation("Sreemangal");
    setStayPrice(5000);
    setStayEcoScore(95);
    setStayImage("");
    setStayDesc("");
    setStayFeatures("");
    setStayAvailable(true);
  };

  // Guides Actions
  const openEditGuide = (guide: LocalGuide) => {
    setSelectedGuide(guide);
    setGuideName(guide.name);
    setGuideSpecialty(guide.category);
    setGuideLoc(guide.location);
    setGuidePrice(guide.price);
    setGuideExp(guide.experienceYears);
    setGuideLanguages(guide.languages.join(", "));
    setGuideImage(guide.image);
    setGuideDesc(guide.description);
    setGuideAvailable(guide.available);
    setShowEditGuideModal(true);
  };

  const handleAddGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGuide({
      name: guideName,
      category: guideSpecialty,
      location: guideLoc,
      price: Number(guidePrice),
      experienceYears: Number(guideExp),
      languages: guideLanguages.split(",").map(l => l.trim()).filter(Boolean),
      image: guideImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      description: guideDesc
    });
    appendAuditLog(`Added new Naturalist Guide: "${guideName}"`, "CMS");
    alert("Guide registered successfully!");
    setShowAddGuideModal(false);
    resetGuideForm();
  };

  const handleEditGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuide) return;
    updateGuide(selectedGuide.id, {
      name: guideName,
      category: guideSpecialty,
      location: guideLoc,
      price: Number(guidePrice),
      experienceYears: Number(guideExp),
      languages: guideLanguages.split(",").map(l => l.trim()).filter(Boolean),
      image: guideImage,
      description: guideDesc,
      available: guideAvailable
    });
    appendAuditLog(`Updated details for Guide ID: ${selectedGuide.id} ("${guideName}")`, "CMS");
    alert("Guide updated successfully!");
    setShowEditGuideModal(false);
    setSelectedGuide(null);
  };

  const handleDeleteGuide = (id: string, name: string) => {
    if (confirm(`Are you sure you want to de-register guide: "${name}"?`)) {
      deleteGuide(id);
      appendAuditLog(`De-registered Naturalist Guide: "${name}" (ID: ${id})`, "CMS");
      alert("Guide removed successfully.");
    }
  };

  const resetGuideForm = () => {
    setGuideName("");
    setGuideSpecialty("Swamp Forest & Wildlife Specialist");
    setGuideLoc("Ratargul");
    setGuidePrice(2500);
    setGuideExp(5);
    setGuideLanguages("Bengali, English");
    setGuideImage("");
    setGuideDesc("");
    setGuideAvailable(true);
  };

  // Transit Actions
  const openEditTransport = (item: TransportRide) => {
    setSelectedTransport(item);
    setTransTitle(item.title);
    setTransCategory(item.category);
    setTransLoc(item.location);
    setTransPrice(item.price);
    setTransFuel(item.fuelType);
    setTransCapacity(item.capacity);
    setTransImage(item.image);
    setTransDesc(item.description);
    setTransAvailable(item.available);
    setShowEditTransportModal(true);
  };

  const handleAddTransportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransport({
      title: transTitle,
      category: transCategory,
      location: transLoc,
      price: Number(transPrice),
      fuelType: transFuel,
      capacity: Number(transCapacity),
      image: transImage || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
      description: transDesc
    });
    appendAuditLog(`Added Transit Ride: "${transTitle}"`, "CMS");
    alert("Vehicle added successfully!");
    setShowAddTransportModal(false);
    resetTransportForm();
  };

  const handleEditTransportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransport) return;
    updateTransport(selectedTransport.id, {
      title: transTitle,
      category: transCategory,
      location: transLoc,
      price: Number(transPrice),
      fuelType: transFuel,
      capacity: Number(transCapacity),
      image: transImage,
      description: transDesc,
      available: transAvailable
    });
    appendAuditLog(`Updated details for transit ride ID: ${selectedTransport.id} ("${transTitle}")`, "CMS");
    alert("Transit vehicle updated successfully!");
    setShowEditTransportModal(false);
    setSelectedTransport(null);
  };

  const handleDeleteTransport = (id: string, name: string) => {
    if (confirm(`Remove transit vehicle: "${name}" from listings?`)) {
      deleteTransport(id);
      appendAuditLog(`Deleted transit ride: "${name}" (ID: ${id})`, "CMS");
      alert("Transit vehicle deleted successfully.");
    }
  };

  const resetTransportForm = () => {
    setTransTitle("");
    setTransCategory("Chauffeur Drive");
    setTransLoc("Sreemangal");
    setTransPrice(4000);
    setTransFuel("Electric");
    setTransCapacity(5);
    setTransImage("");
    setTransDesc("");
    setTransAvailable(true);
  };

  // Wetland / Haor Actions
  const applyWetlandPreset = (mode: "monsoon" | "winter") => {
    if (mode === "monsoon") {
      updateHaor({
        waterHeight: haor.monsoonWaterHeight,
        currentStatus: "Monsoon Deep Water",
        safetyIndex: 94,
        policeAlert: "Lifevest mandates are actively in effect for all wooden houseboats. Night anchoring outside authorized stations is prohibited due to seasonal squalls."
      });
      appendAuditLog("Applied Monsoon Seasonal Preset to Haor Gauge monitoring.", "WETLAND");
      alert("Applied Monsoon Seasonal Preset!");
    } else {
      updateHaor({
        waterHeight: haor.winterWaterHeight,
        currentStatus: "Winter Dry Grassland",
        safetyIndex: 98,
        policeAlert: "Water levels are low. Hakaluki & Tanguar Haor routes are primarily navigable via low-draft country canoes or walking tracks."
      });
      appendAuditLog("Applied Winter Seasonal Preset to Haor Gauge monitoring.", "WETLAND");
      alert("Applied Winter Seasonal Preset!");
    }
  };

  const handleWetlandGaugeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    appendAuditLog(`Custom Haor metrics updated manually (Water Height: ${haor.waterHeight}m, Safety: ${haor.safetyIndex}%)`, "WETLAND");
    alert("Settings updated successfully!");
  };

  const handleDispatchAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAlert({
      title: newAlertTitle,
      severity: newAlertSeverity,
      region: newAlertRegion,
      description: newAlertDesc,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " | Just Now",
      contactNumber: newAlertContact || undefined
    });
    appendAuditLog(`Dispatched Critical Emergency Alert: "${newAlertTitle}" in ${newAlertRegion}`, "WETLAND");
    alert("Emergency alert dispatched to active feeds successfully!");
    setNewAlertTitle("");
    setNewAlertDesc("");
    setNewAlertContact("");
  };

  // System Config Configuration
  const handleConfigBkashSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("sylhetgo_bkash_number", bkashNumber);
    localStorage.setItem("sylhetgo_bkash_type", bkashType);
    appendAuditLog(`bKash Configuration updated: Number [${bkashNumber}], Type [${bkashType}]`, "SECURITY");
    alert("Settings updated successfully!");
  };

  const handleConfigPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem("sylhetgo_admin_password") || "Sylhetgo@2026";
    if (currentPass !== storedPassword) {
      alert("Current administrative credential does not match our records.");
      return;
    }
    if (newPass !== confirmPass) {
      alert("New passwords do not match. Please ensure identical values.");
      return;
    }
    if (!newPass.trim()) {
      alert("Password value cannot be empty.");
      return;
    }
    localStorage.setItem("sylhetgo_admin_password", newPass);
    appendAuditLog("Master Admin credentials updated successfully.", "SECURITY");
    alert("Settings updated successfully!");
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
  };

  // Status updates
  const handleStatusChange = (bookingId: string, status: "Pending" | "Approved" | "Rejected") => {
    updateBookingStatus(bookingId, status);
    appendAuditLog(`Booking ID: ${bookingId} status changed to "${status}"`, "BOOKING");
    alert(`Booking status changed to ${status}!`);
  };

  const handleBookingDelete = (id: string) => {
    if (confirm("Delete this booking ledger permanently?")) {
      deleteBooking(id);
      appendAuditLog(`Deleted Booking Ledger ID: ${id}`, "BOOKING");
      alert("Booking ledger removed.");
    }
  };

  // Filter lists
  const filteredStays = stays.filter(s =>
    s.title.toLowerCase().includes(staySearch.toLowerCase()) ||
    s.location.toLowerCase().includes(staySearch.toLowerCase())
  );

  const filteredGuides = guides.filter(g =>
    g.name.toLowerCase().includes(guideSearch.toLowerCase()) ||
    g.location.toLowerCase().includes(guideSearch.toLowerCase())
  );

  // Auth gateway view
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Abstract background blobs for premium corporate aesthetic */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-900/20 rounded-full filter blur-3xl" />

        <div className="bg-slate-900/90 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 max-w-md w-full relative z-10 shadow-2xl backdrop-blur-md">
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
              <ShieldCheck className="w-9 h-9 text-white" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-2xl md:text-3xl text-slate-100 uppercase tracking-tight">
                SYLHETGO ENTERPRISE
              </h2>
              <p className="text-slate-400 font-medium text-xs tracking-wider uppercase">
                Secure Administrative Control Deck
              </p>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {loginError && (
              <div className="bg-rose-950/40 border border-rose-800/60 p-4 rounded-2xl flex items-start gap-2 text-xs text-rose-200 leading-snug">
                <AlertOctagon className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest block">
                Admin Username / Email
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="admin@sylhetgo.com (or leave blank)"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-11 pr-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest block">
                Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="Enter secure access key"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-11 pr-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs font-mono font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-2xl font-display font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/10 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In to Terminal
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <span className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-emerald-500" /> Secure 256-Bit Local Session Encrypted
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-200">
      
      {/* 1. LEFT NAVIGATION BAR */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        {/* Title Area */}
        <div className="p-6 border-b border-slate-800 space-y-1.5 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow shadow-indigo-500/20">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-display font-extrabold text-sm uppercase tracking-wider text-slate-100">
              SylhetGo Enterprise
            </h1>
          </div>
          <span className="inline-flex items-center gap-1 bg-indigo-950 text-indigo-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-indigo-900">
            ● MASTER ADMIN CONSOLE
          </span>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "overview", label: "Overview & Analytics", icon: <TrendingUp className="w-4 h-4" /> },
            { id: "stays", label: "Eco Lodges CMS", icon: <Hotel className="w-4 h-4" /> },
            { id: "guides", label: "Guides & Transport", icon: <Users className="w-4 h-4" /> },
            { id: "haor", label: "Wetland Control Deck", icon: <Layers className="w-4 h-4" /> },
            { id: "settings", label: "Security & bKash Config", icon: <Settings className="w-4 h-4" /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === item.id
                  ? "bg-indigo-600 text-white shadow shadow-indigo-500/10"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Admin User Info Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/20">
          <div className="flex items-center gap-3 mb-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-extrabold font-mono text-sm border border-slate-700">
              AD
            </div>
            <div className="truncate">
              <p className="text-xs font-extrabold text-slate-200">System Admin</p>
              <p className="text-[10px] text-slate-500 truncate">admin@sylhetgo.com</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-rose-950/40 hover:bg-rose-950 text-rose-300 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 border border-rose-900/60 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* 2. MAIN VIEW AREA */}
      <main className="flex-1 overflow-y-auto bg-slate-950 text-slate-200 min-w-0">
        
        {/* Header Bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-8 py-5 flex items-center justify-between sticky top-0 z-20 backdrop-blur bg-opacity-95">
          <div>
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest flex items-center gap-1.5">
              <span>SylhetGo Workspace</span>
              <span>/</span>
              <span className="text-slate-400 font-semibold">{activeTab}</span>
            </div>
            <h2 className="font-display font-extrabold text-xl text-slate-100 mt-1 capitalize">
              {activeTab === "overview" && "Analytics Intelligence Overview"}
              {activeTab === "stays" && "Lodges & Stays CMS Table"}
              {activeTab === "guides" && "Guides & Zero-Emission Transit"}
              {activeTab === "haor" && "Wetland Monitoring Terminal"}
              {activeTab === "settings" && "System configuration & logs"}
            </h2>
          </div>

          {/* Status Display badge */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-bold uppercase">SYSTEM OPERATIONAL</span>
            </div>
            <span className="text-slate-500 font-bold hidden md:inline">July 7, 2026</span>
          </div>
        </header>

        {/* View Grid padding */}
        <div className="p-8">

          {/* ========================================================= */}
          {/* A. OVERVIEW / ANALYTICS TAB */}
          {/* ========================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {/* Quick statistics widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Total Bookings Managed", value: bookings.length, desc: "Active customer ledgers", icon: <Briefcase className="w-5 h-5 text-indigo-400" />, color: "border-indigo-500/20 bg-indigo-950/10" },
                  { title: "Eco Stays Listing", value: stays.length, desc: "Bamboo cottages & resorts", icon: <Hotel className="w-5 h-5 text-emerald-400" />, color: "border-emerald-500/20 bg-emerald-950/10" },
                  { title: "Registered Naturalists", value: guides.length, desc: "SREDA verified specialists", icon: <Users className="w-5 h-5 text-amber-400" />, color: "border-amber-500/20 bg-amber-950/10" },
                  { title: "Swamp Safety Index", value: `${haor.safetyIndex}%`, desc: haor.currentStatus, icon: <Activity className="w-5 h-5 text-cyan-400" />, color: "border-cyan-500/20 bg-cyan-950/10" }
                ].map((stat, i) => (
                  <div key={i} className={`border rounded-[1.75rem] p-6 space-y-4 shadow-sm ${stat.color}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{stat.title}</span>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        {stat.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-display font-black text-slate-100">{stat.value}</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">{stat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Booking Management & Administrative modifications */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Bookings table ledger (7 columns width) */}
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-[2rem] p-6 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="font-display font-extrabold text-base text-slate-100">
                        Recent Travel Bookings
                      </h3>
                      <p className="text-[10px] text-slate-500">Live guest check-ins and payments audited below.</p>
                    </div>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-xs">No active travel bookings recorded in the system.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-medium">
                        <thead>
                          <tr className="text-slate-500 border-b border-slate-800">
                            <th className="pb-3">Client details</th>
                            <th className="pb-3">Booked Service</th>
                            <th className="pb-3">Financial Status</th>
                            <th className="pb-3">Decision Status</th>
                            <th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                          {bookings.slice(0, 5).map((b) => (
                            <tr key={b.id} className="hover:bg-slate-950/20">
                              <td className="py-3.5 pr-2">
                                <p className="font-bold text-slate-200">{b.customerName}</p>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{b.customerPhone}</p>
                              </td>
                              <td className="py-3.5">
                                <span className="inline-block bg-slate-950 px-2 py-0.5 rounded text-[10px] font-bold text-indigo-400 mr-1.5 uppercase font-mono">{b.serviceType}</span>
                                <span className="text-slate-300 font-semibold">{b.itemName}</span>
                              </td>
                              <td className="py-3.5">
                                <p className="font-mono font-bold text-slate-200">৳{b.userBudget.toLocaleString()}</p>
                                <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 ${
                                  b.paymentStatus === "Verified" ? "bg-emerald-950 text-emerald-400 border border-emerald-900/60" :
                                  b.paymentStatus === "Paid/Verifying" ? "bg-amber-950 text-amber-400 border border-amber-900/60 animate-pulse" :
                                  "bg-rose-950 text-rose-400 border border-rose-900/60"
                                }`}>
                                  {b.paymentStatus === "Paid/Verifying" ? "Paid (Verifying)" : b.paymentStatus}
                                </span>
                              </td>
                              <td className="py-3.5">
                                <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                                  b.status === "Approved" ? "bg-emerald-500 text-slate-950" :
                                  b.status === "Rejected" ? "bg-rose-500 text-white" :
                                  "bg-slate-800 text-slate-300"
                                }`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="py-3.5 text-right space-x-1.5">
                                <button
                                  onClick={() => handleStatusChange(b.id, "Approved")}
                                  className={`p-1 text-xs rounded transition-all cursor-pointer ${b.status === "Approved" ? "bg-emerald-600 text-white" : "bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400"}`}
                                  title="Approve"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleStatusChange(b.id, "Rejected")}
                                  className={`p-1 text-xs rounded transition-all cursor-pointer ${b.status === "Rejected" ? "bg-rose-600 text-white" : "bg-rose-950/60 hover:bg-rose-900/60 text-rose-400"}`}
                                  title="Reject"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                                {(b.status === "Approved" || b.status === "Rejected") && (
                                  <button
                                    onClick={() => handleStatusChange(b.id, "Pending")}
                                    className="bg-amber-950/60 hover:bg-amber-900/60 text-amber-400 p-1 text-xs rounded transition-all cursor-pointer"
                                    title="Reset / Undo to Pending"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Audit Logs panel (4 columns width) */}
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-[2rem] p-6 space-y-4 shadow-sm flex flex-col max-h-[400px]">
                  <div>
                    <h3 className="font-display font-extrabold text-base text-slate-100 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      Administrative Audit Logs
                    </h3>
                    <p className="text-[10px] text-slate-500">Read-only real-time historical ledger.</p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1.5">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                            log.category === "CMS" ? "bg-emerald-950 text-emerald-400" :
                            log.category === "WETLAND" ? "bg-cyan-950 text-cyan-400" :
                            log.category === "SECURITY" ? "bg-purple-950 text-purple-400" :
                            log.category === "BOOKING" ? "bg-amber-950 text-amber-400" :
                            "bg-slate-800 text-slate-400"
                          }`}>
                            [{log.category}]
                          </span>
                          <span className="text-[9px] text-slate-600 font-mono">{log.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                          {log.action}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* B. ECO LODGES CMS TAB */}
          {/* ========================================================= */}
          {activeTab === "stays" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Header and Add Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by Lodge Title or Location..."
                    value={staySearch}
                    onChange={(e) => setStaySearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                  />
                </div>
                
                <button
                  onClick={() => {
                    resetStayForm();
                    setShowAddStayModal(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all uppercase tracking-wider font-display"
                >
                  <Plus className="w-4 h-4" /> Add New Eco-Lodge
                </button>
              </div>

              {/* Data Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow">
                <table className="w-full text-left text-xs font-medium">
                  <thead>
                    <tr className="bg-slate-950/40 text-slate-400 border-b border-slate-800">
                      <th className="p-4">Lodge & Category</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Price Per Night</th>
                      <th className="p-4">Eco-Score Metric</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {filteredStays.map((stay) => (
                      <tr key={stay.id} className="hover:bg-slate-950/10 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={stay.image}
                            alt={stay.title}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-800"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-slate-200">{stay.title}</p>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">{stay.category}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300 font-semibold">{stay.location}</td>
                        <td className="p-4 text-slate-200 font-mono font-bold">৳{stay.price.toLocaleString()}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2.5 max-w-[120px]">
                            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  stay.ecoScore >= 95 ? "bg-emerald-500" :
                                  stay.ecoScore >= 85 ? "bg-amber-500" :
                                  "bg-rose-500"
                                }`}
                                style={{ width: `${stay.ecoScore}%` }}
                              />
                            </div>
                            <span className="font-mono text-[11px] font-bold text-slate-300">{stay.ecoScore}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            stay.available ? "bg-emerald-950 text-emerald-400 border border-emerald-900/60" : "bg-rose-950 text-rose-400 border border-rose-900/60"
                          }`}>
                            ● {stay.available ? "Available" : "Booked Out"}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1.5">
                          <button
                            onClick={() => openEditStay(stay)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 rounded-lg transition-all cursor-pointer inline-flex"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStay(stay.id, stay.title)}
                            className="p-2 bg-rose-950/60 hover:bg-rose-950 text-rose-400 hover:text-rose-300 rounded-lg transition-all cursor-pointer inline-flex border border-rose-900/30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* C. GUIDES & TRANSIT CMS TAB */}
          {/* ========================================================= */}
          {activeTab === "guides" && (
            <div className="space-y-12 animate-in fade-in duration-200">
              
              {/* Guides Roster Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-100 uppercase tracking-tight">
                      Naturalist Guides CMS
                    </h3>
                    <p className="text-xs text-slate-500">Enable local community certification and rates.</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search guides..."
                        value={guideSearch}
                        onChange={(e) => setGuideSearch(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                      />
                    </div>
                    
                    <button
                      onClick={() => {
                        resetGuideForm();
                        setShowAddGuideModal(true);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Register Guide
                    </button>
                  </div>
                </div>

                {/* Guides Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow">
                  <table className="w-full text-left text-xs font-medium">
                    <thead>
                      <tr className="bg-slate-950/40 text-slate-400 border-b border-slate-800">
                        <th className="p-4">Guide Name</th>
                        <th className="p-4">Specialty & Exp</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Price Per Day</th>
                        <th className="p-4">Certification Badge</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {filteredGuides.map((g) => (
                        <tr key={g.id} className="hover:bg-slate-950/10">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={g.image}
                              alt={g.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-800"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-bold text-slate-200">{g.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{g.languages.join(", ")}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-slate-300 font-semibold">{g.category}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{g.experienceYears} Years Exp</p>
                          </td>
                          <td className="p-4 text-slate-300 font-semibold">{g.location}</td>
                          <td className="p-4 text-slate-200 font-mono font-bold">৳{g.price.toLocaleString()}</td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                toggleGuideVerification(g.id);
                                appendAuditLog(`Toggled verification badge for Guide: "${g.name}"`, "CMS");
                                alert(`Toggled certification for ${g.name}!`);
                              }}
                              className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition-all ${
                                g.badge === "Verified Local Guide"
                                  ? "bg-emerald-950 text-emerald-400 border-emerald-900"
                                  : "bg-indigo-950 text-indigo-400 border-indigo-900"
                              }`}
                              title="Click to toggle certification"
                            >
                              <Award className="w-3 h-3" />
                              <span>{g.badge}</span>
                            </button>
                          </td>
                          <td className="p-4 text-right space-x-1">
                            <button
                              onClick={() => openEditGuide(g)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg inline-flex cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteGuide(g.id, g.name)}
                              className="p-1.5 bg-rose-950/60 hover:bg-rose-950 text-rose-400 rounded-lg inline-flex border border-rose-900/30 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Transit Rides Fleet Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-100 uppercase tracking-tight">
                      Carbon-Neutral Transit Fleet
                    </h3>
                    <p className="text-xs text-slate-500">Manage sustainable electric SUVs and hybrid cruisers.</p>
                  </div>

                  <button
                    onClick={() => {
                      resetTransportForm();
                      setShowAddTransportModal(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Fleet Vehicle
                  </button>
                </div>

                {/* Transit Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow">
                  <table className="w-full text-left text-xs font-medium">
                    <thead>
                      <tr className="bg-slate-950/40 text-slate-400 border-b border-slate-800">
                        <th className="p-4">Vehicle Listing</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Price / Day</th>
                        <th className="p-4">Specs & Propulsion</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {transport.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-950/10">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-10 h-7 rounded-lg object-cover border border-slate-800"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-bold text-slate-200">{item.title}</p>
                              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.category}</p>
                            </div>
                          </td>
                          <td className="p-4 text-slate-300 font-semibold">{item.location}</td>
                          <td className="p-4 text-slate-200 font-mono font-bold">৳{item.price.toLocaleString()}</td>
                          <td className="p-4">
                            <div className="space-y-0.5">
                              <span className="inline-block bg-indigo-950 text-indigo-400 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-indigo-900">
                                🔋 {item.fuelType}
                              </span>
                              <p className="text-[10px] text-slate-500 font-mono mt-1">Capacity: {item.capacity} Seats</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              item.available ? "bg-emerald-950 text-emerald-400 border border-emerald-900/60" : "bg-rose-950 text-rose-400 border border-rose-900/60"
                            }`}>
                              ● {item.available ? "Ready" : "Inactive"}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-1">
                            <button
                              onClick={() => openEditTransport(item)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg inline-flex cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteTransport(item.id, item.title)}
                              className="p-1.5 bg-rose-950/60 hover:bg-rose-950 text-rose-400 rounded-lg inline-flex border border-rose-900/30 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* D. WETLAND MONITORING TERMINAL */}
          {/* ========================================================= */}
          {activeTab === "haor" && (
            <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl">
              
              {/* Monitoring Widgets & Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Metric control deck */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 shadow-sm">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="font-display font-extrabold text-base text-slate-100 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-indigo-400 animate-pulse" />
                      Swamp Water & safety controls
                    </h3>
                    <p className="text-xs text-slate-500">Fine-tune hydrology levels and safety indicators manually.</p>
                  </div>

                  {/* Seasonal Presets Quick Trigger */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Seasonal presets quick launch</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => applyWetlandPreset("monsoon")}
                        className="bg-emerald-950/40 hover:bg-emerald-950 text-emerald-400 border border-emerald-900/50 py-2.5 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        🌊 Monsoon Mode (12.4m)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyWetlandPreset("winter")}
                        className="bg-amber-950/40 hover:bg-amber-950 text-amber-400 border border-amber-900/50 py-2.5 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        🌾 Winter Mode (1.8m)
                      </button>
                    </div>
                  </div>

                  {/* Custom Gauge Adjustment fields */}
                  <form onSubmit={handleWetlandGaugeSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-bold">Water Height Gauge (Meters)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={haor.waterHeight}
                          onChange={(e) => updateHaor({ waterHeight: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono font-bold text-xs focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-bold">Safety Index Score (1-100)</label>
                        <input
                          type="number"
                          value={haor.safetyIndex}
                          onChange={(e) => updateHaor({ safetyIndex: Number(e.target.value) })}
                          min="1"
                          max="100"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono font-bold text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold block">Current Hydrology status String</label>
                      <select
                        value={haor.currentStatus}
                        onChange={(e) => updateHaor({ currentStatus: e.target.value as any })}
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs font-semibold focus:outline-none text-slate-200"
                      >
                        <option value="Monsoon Deep Water">Monsoon Deep Water</option>
                        <option value="Winter Dry Grassland">Winter Dry Grassland</option>
                        <option value="Transitioning">Transitioning</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold">Official Rate Regulations Policy</label>
                      <input
                        type="text"
                        value={haor.boatRateRegulation}
                        onChange={(e) => updateHaor({ boatRateRegulation: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold">Water Police Safety Alert Broadcast</label>
                      <textarea
                        value={haor.policeAlert}
                        onChange={(e) => updateHaor({ policeAlert: e.target.value })}
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs font-medium focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-display cursor-pointer"
                      >
                        Save Hydrology Metrics
                      </button>
                    </div>
                  </form>
                </div>

                {/* Dispatcher Alert Area */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5 shadow-sm">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="font-display font-extrabold text-base text-slate-100 flex items-center gap-2">
                      <AlertOctagon className="w-4 h-4 text-rose-500 animate-pulse" />
                      Dispatch emergency alert feed
                    </h3>
                    <p className="text-xs text-slate-500">Inject real-time safety warnings onto the public warning channel.</p>
                  </div>

                  <form onSubmit={handleDispatchAlertSubmit} className="space-y-4 text-xs font-semibold">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold">Alert Broad Heading / Title</label>
                      <input
                        type="text"
                        value={newAlertTitle}
                        onChange={(e) => setNewAlertTitle(e.target.value)}
                        placeholder="e.g., flash flood squall alert"
                        required
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl focus:outline-none text-slate-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-bold">Severity level</label>
                        <select
                          value={newAlertSeverity}
                          onChange={(e) => setNewAlertSeverity(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl focus:outline-none text-slate-200"
                        >
                          <option value="info">Info / Notice</option>
                          <option value="warning">Warning / Caution</option>
                          <option value="danger">Danger / Critical</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-bold">Affected wetland region</label>
                        <input
                          type="text"
                          value={newAlertRegion}
                          onChange={(e) => setNewAlertRegion(e.target.value)}
                          placeholder="e.g., Ratargul Swamp, Tanguar"
                          required
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl focus:outline-none text-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold">Emergency assistance hotline (Optional)</label>
                      <input
                        type="text"
                        value={newAlertContact}
                        onChange={(e) => setNewAlertContact(e.target.value)}
                        placeholder="e.g., +8801700-POLICE"
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl focus:outline-none text-slate-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold">Full danger / Advisory Description</label>
                      <textarea
                        value={newAlertDesc}
                        onChange={(e) => setNewAlertDesc(e.target.value)}
                        placeholder="Detail the hazard warning fully so boat captains can steer away safely."
                        rows={3}
                        required
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl focus:outline-none text-slate-200 font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow transition-all font-display uppercase tracking-wider text-[11px] cursor-pointer"
                    >
                      ⚠️ Dispatch Public Safety Broadcast
                    </button>
                  </form>
                </div>

              </div>

              {/* Active warnings log to allow deleting */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div>
                  <h3 className="font-display font-extrabold text-base text-slate-100">Active public safety alerts feed</h3>
                  <p className="text-[10px] text-slate-500">Admins can remove active alerts below to clear warnings off tourist maps.</p>
                </div>

                {alerts.length === 0 ? (
                  <div className="p-4 text-center text-slate-600 text-xs font-semibold">No active public safety warnings dispatched.</div>
                ) : (
                  <div className="space-y-3.5">
                    {alerts.map((al) => (
                      <div key={al.id} className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
                        <div className="space-y-1 pr-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                              al.severity === "danger" ? "bg-rose-950 text-rose-400 border border-rose-900" :
                              al.severity === "warning" ? "bg-amber-950 text-amber-400 border border-amber-900" :
                              "bg-blue-950 text-blue-400 border border-blue-900"
                            }`}>
                              {al.severity}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-500">{al.region}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-200">{al.title}</h4>
                          <p className="text-[11px] text-slate-400 leading-normal font-medium">{al.description}</p>
                        </div>
                        <button
                          onClick={() => {
                            deleteAlert(al.id);
                            appendAuditLog(`Removed public warning alert: "${al.title}"`, "WETLAND");
                            alert("Safety alert archived successfully!");
                          }}
                          className="text-xs bg-rose-950/50 hover:bg-rose-950 text-rose-400 hover:text-rose-300 p-2 rounded-lg border border-rose-900/40 cursor-pointer"
                          title="Archive warning"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* E. SECURITY & CONFIG TAB */}
          {/* ========================================================= */}
          {activeTab === "settings" && (
            <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* bKash configuration panel */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                    <div className="w-9 h-9 rounded-xl bg-pink-950 text-pink-400 flex items-center justify-center font-black font-mono text-xs border border-pink-900">
                      bK
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-sm text-slate-100 uppercase tracking-tight">bKash wallet settings</h3>
                      <p className="text-[10px] text-slate-500">Configure money collection wallets instantly.</p>
                    </div>
                  </div>

                  <form onSubmit={handleConfigBkashSubmit} className="space-y-4 text-xs font-semibold">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-[10px]">Active bKash Number</label>
                      <input
                        type="text"
                        value={bkashNumber}
                        onChange={(e) => setBkashNumber(e.target.value)}
                        placeholder="e.g., +8801700-SYLHET"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-[10px]">bKash Account Type</label>
                      <select
                        value={bkashType}
                        onChange={(e) => setBkashType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
                      >
                        <option value="Merchant">Merchant Account</option>
                        <option value="Personal">Personal Account</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-display cursor-pointer"
                    >
                      Save Configuration
                    </button>
                  </form>
                </div>

                {/* Password security update panel */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center border border-indigo-900">
                      <Key className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-sm text-slate-100 uppercase tracking-tight">Change credentials</h3>
                      <p className="text-[10px] text-slate-500">Update administrative security tokens.</p>
                    </div>
                  </div>

                  <form onSubmit={handleConfigPasswordSubmit} className="space-y-4 text-xs font-semibold">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-[10px]">Current Password</label>
                      <input
                        type="password"
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        placeholder="Enter old access key"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-[10px]">New Master Password</label>
                      <input
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="Enter secure new password"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none animate-pulse-slow"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 text-[10px]">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="Confirm secure new password"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-display cursor-pointer"
                    >
                      Update Master Credentials
                    </button>
                  </form>
                </div>

              </div>

              {/* Complete comprehensive historical log output */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm">
                <div>
                  <h3 className="font-display font-extrabold text-base text-slate-100">Full Workspace Operations Audit Log</h3>
                  <p className="text-[10px] text-slate-500">Read-only logging tracker monitoring configuration events and schema migrations.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-800 pb-2">
                        <th className="pb-2">Audit ID</th>
                        <th className="pb-2">Trigger Action</th>
                        <th className="pb-2">Audit Class</th>
                        <th className="pb-2 text-right">Event Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 text-slate-300">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-950/25">
                          <td className="py-2.5 font-mono text-[10px] text-slate-500">{log.id.slice(0, 12)}</td>
                          <td className="py-2.5 pr-4 text-slate-200">{log.action}</td>
                          <td className="py-2.5">
                            <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${
                              log.category === "CMS" ? "bg-emerald-950 text-emerald-400 border-emerald-900" :
                              log.category === "WETLAND" ? "bg-cyan-950 text-cyan-400 border-cyan-900" :
                              log.category === "SECURITY" ? "bg-purple-950 text-purple-400 border-purple-900" :
                              log.category === "BOOKING" ? "bg-amber-950 text-amber-400 border-amber-900" :
                              "bg-slate-800 text-slate-400 border-slate-700"
                            }`}>
                              {log.category}
                            </span>
                          </td>
                          <td className="py-2.5 text-right font-mono text-slate-500 text-[10px]">{log.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* ========================================================= */}
      {/* ADD STAYS MODAL */}
      {/* ========================================================= */}
      {showAddStayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm text-left">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-300">
            <h3 className="font-display font-extrabold text-lg text-slate-100 uppercase tracking-tight">Add New Eco Lodge</h3>
            <form onSubmit={handleAddStaySubmit} className="space-y-4 font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">Lodge Title</label>
                  <input type="text" value={stayTitle} onChange={e => setStayTitle(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Category Type</label>
                  <select value={stayCategory} onChange={e => setStayCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200">
                    <option value="Premium Eco Lodge">Premium Eco Lodge</option>
                    <option value="Standard Eco-Cottage">Standard Eco-Cottage</option>
                    <option value="Wetlands Treehouse">Wetlands Treehouse</option>
                    <option value="Glamping Tent">Glamping Tent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">Location</label>
                  <input type="text" value={stayLocation} onChange={e => setStayLocation(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Price Per Night (৳)</label>
                  <input type="number" value={stayPrice} onChange={e => setStayPrice(Number(e.target.value))} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Eco-Score %</label>
                  <input type="number" value={stayEcoScore} onChange={e => setStayEcoScore(Number(e.target.value))} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Image URL</label>
                <input type="text" value={stayImage} onChange={e => setStayImage(e.target.value)} placeholder="https://unsplash..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Features / Eco Perks (Comma separated)</label>
                <input type="text" value={stayFeatures} onChange={e => setStayFeatures(e.target.value)} placeholder="Solar-powered, Zero single-use plastic" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Description</label>
                <textarea value={stayDesc} onChange={e => setStayDesc(e.target.value)} rows={3} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddStayModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">Save Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT STAYS MODAL */}
      {/* ========================================================= */}
      {showEditStayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm text-left">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-300">
            <h3 className="font-display font-extrabold text-lg text-slate-100 uppercase tracking-tight">Edit Eco Lodge</h3>
            <form onSubmit={handleEditStaySubmit} className="space-y-4 font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">Lodge Title</label>
                  <input type="text" value={stayTitle} onChange={e => setStayTitle(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Category Type</label>
                  <select value={stayCategory} onChange={e => setStayCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200">
                    <option value="Premium Eco Lodge">Premium Eco Lodge</option>
                    <option value="Standard Eco-Cottage">Standard Eco-Cottage</option>
                    <option value="Wetlands Treehouse">Wetlands Treehouse</option>
                    <option value="Glamping Tent">Glamping Tent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">Location</label>
                  <input type="text" value={stayLocation} onChange={e => setStayLocation(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Price Per Night (৳)</label>
                  <input type="number" value={stayPrice} onChange={e => setStayPrice(Number(e.target.value))} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Eco-Score %</label>
                  <input type="number" value={stayEcoScore} onChange={e => setStayEcoScore(Number(e.target.value))} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Image URL</label>
                <input type="text" value={stayImage} onChange={e => setStayImage(e.target.value)} placeholder="https://unsplash..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Features / Eco Perks (Comma separated)</label>
                <input type="text" value={stayFeatures} onChange={e => setStayFeatures(e.target.value)} placeholder="Solar-powered, Zero single-use plastic" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Description</label>
                <textarea value={stayDesc} onChange={e => setStayDesc(e.target.value)} rows={3} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
              </div>

              <div className="flex items-center gap-2.5 p-1">
                <input type="checkbox" checked={stayAvailable} onChange={e => setStayAvailable(e.target.checked)} className="rounded bg-slate-950 border-slate-800 w-4 h-4 text-indigo-600" id="stayAvail" />
                <label htmlFor="stayAvail" className="text-slate-300 select-none">Listing Active & Available</label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowEditStayModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">Update Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* REGISTER GUIDE MODAL */}
      {/* ========================================================= */}
      {showAddGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm text-left">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-300">
            <h3 className="font-display font-extrabold text-lg text-slate-100 uppercase tracking-tight">Register Naturalist Guide</h3>
            <form onSubmit={handleAddGuideSubmit} className="space-y-4 font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">Guide Name</label>
                  <input type="text" value={guideName} onChange={e => setGuideName(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Specialty Specialty</label>
                  <input type="text" value={guideSpecialty} onChange={e => setGuideSpecialty(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">Working Territory</label>
                  <input type="text" value={guideLoc} onChange={e => setGuideLoc(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Price Per Day (৳)</label>
                  <input type="number" value={guidePrice} onChange={e => setGuidePrice(Number(e.target.value))} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Experience (Years)</label>
                  <input type="number" value={guideExp} onChange={e => setGuideExp(Number(e.target.value))} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Languages Spoken (Comma separated)</label>
                <input type="text" value={guideLanguages} onChange={e => setGuideLanguages(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Avatar Image URL</label>
                <input type="text" value={guideImage} onChange={e => setGuideImage(e.target.value)} placeholder="https://unsplash..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Description / Bio</label>
                <textarea value={guideDesc} onChange={e => setGuideDesc(e.target.value)} rows={3} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddGuideModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT GUIDE MODAL */}
      {/* ========================================================= */}
      {showEditGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm text-left">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-300">
            <h3 className="font-display font-extrabold text-lg text-slate-100 uppercase tracking-tight">Edit Naturalist Guide</h3>
            <form onSubmit={handleEditGuideSubmit} className="space-y-4 font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">Guide Name</label>
                  <input type="text" value={guideName} onChange={e => setGuideName(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Specialty Specialty</label>
                  <input type="text" value={guideSpecialty} onChange={e => setGuideSpecialty(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">Working Territory</label>
                  <input type="text" value={guideLoc} onChange={e => setGuideLoc(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Price Per Day (৳)</label>
                  <input type="number" value={guidePrice} onChange={e => setGuidePrice(Number(e.target.value))} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Experience (Years)</label>
                  <input type="number" value={guideExp} onChange={e => setGuideExp(Number(e.target.value))} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Languages Spoken (Comma separated)</label>
                <input type="text" value={guideLanguages} onChange={e => setGuideLanguages(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Avatar Image URL</label>
                <input type="text" value={guideImage} onChange={e => setGuideImage(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Description / Bio</label>
                <textarea value={guideDesc} onChange={e => setGuideDesc(e.target.value)} rows={3} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
              </div>

              <div className="flex items-center gap-2.5 p-1">
                <input type="checkbox" checked={guideAvailable} onChange={e => setGuideAvailable(e.target.checked)} className="rounded bg-slate-950 border-slate-800 w-4 h-4 text-indigo-600" id="guideAv" />
                <label htmlFor="guideAv" className="text-slate-300 select-none">Ready & Active</label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowEditGuideModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD TRANSIT VEHICLE MODAL */}
      {/* ========================================================= */}
      {showAddTransportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm text-left">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-300">
            <h3 className="font-display font-extrabold text-lg text-slate-100 uppercase tracking-tight">Add Fleet Vehicle</h3>
            <form onSubmit={handleAddTransportSubmit} className="space-y-4 font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">Vehicle Name</label>
                  <input type="text" value={transTitle} onChange={e => setTransTitle(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Propulsion Type</label>
                  <select value={transFuel} onChange={e => setTransFuel(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200">
                    <option value="Electric">100% Electric</option>
                    <option value="Solar-Powered">Solar-Powered</option>
                    <option value="Hybrid">Zero-Emissions Hybrid</option>
                    <option value="None">Human-Powered (Paddle/Canoe)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">Service Category</label>
                  <input type="text" value={transCategory} onChange={e => setTransCategory(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" placeholder="e.g., SUV Tour" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Working Territory</label>
                  <input type="text" value={transLoc} onChange={e => setTransLoc(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Price / Trip or Day</label>
                  <input type="number" value={transPrice} onChange={e => setTransPrice(Number(e.target.value))} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">Seating Capacity</label>
                  <input type="number" value={transCapacity} onChange={e => setTransCapacity(Number(e.target.value))} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Fleet Image URL</label>
                  <input type="text" value={transImage} onChange={e => setTransImage(e.target.value)} placeholder="https://unsplash..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Description / Specs</label>
                <textarea value={transDesc} onChange={e => setTransDesc(e.target.value)} rows={3} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddTransportModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">Add Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT TRANSIT VEHICLE MODAL */}
      {/* ========================================================= */}
      {showEditTransportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm text-left">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-300">
            <h3 className="font-display font-extrabold text-lg text-slate-100 uppercase tracking-tight">Edit Fleet Vehicle</h3>
            <form onSubmit={handleEditTransportSubmit} className="space-y-4 font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">Vehicle Name</label>
                  <input type="text" value={transTitle} onChange={e => setTransTitle(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Propulsion Type</label>
                  <select value={transFuel} onChange={e => setTransFuel(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200">
                    <option value="Electric">100% Electric</option>
                    <option value="Solar-Powered">Solar-Powered</option>
                    <option value="Hybrid">Zero-Emissions Hybrid</option>
                    <option value="None">Human-Powered (Paddle/Canoe)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">Service Category</label>
                  <input type="text" value={transCategory} onChange={e => setTransCategory(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Working Territory</label>
                  <input type="text" value={transLoc} onChange={e => setTransLoc(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Price / Trip or Day</label>
                  <input type="number" value={transPrice} onChange={e => setTransPrice(Number(e.target.value))} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">Seating Capacity</label>
                  <input type="number" value={transCapacity} onChange={e => setTransCapacity(Number(e.target.value))} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Fleet Image URL</label>
                  <input type="text" value={transImage} onChange={e => setTransImage(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Description / Specs</label>
                <textarea value={transDesc} onChange={e => setTransDesc(e.target.value)} rows={3} required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200" />
              </div>

              <div className="flex items-center gap-2.5 p-1">
                <input type="checkbox" checked={transAvailable} onChange={e => setTransAvailable(e.target.checked)} className="rounded bg-slate-950 border-slate-800 w-4 h-4 text-indigo-600" id="transAv" />
                <label htmlFor="transAv" className="text-slate-300 select-none">Active & Ready</label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowEditTransportModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
