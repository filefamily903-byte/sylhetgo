import React, { useState } from "react";
import { useDB } from "../DBContext";
import { EcoStay, TransportRide, LocalGuide, EmergencyAlert, HaorMetric } from "../types";
import { ShieldAlert, Trash2, Plus, RefreshCw, Layers, Database, Hotel, Car, Users, AlertOctagon, ShieldCheck, Star, Sparkles, CheckCircle2, ClipboardList, Check, X, LogOut, Settings, Lock } from "lucide-react";

interface AdminPageProps {
  onLogout?: () => void;
}

export default function AdminPage({ onLogout }: AdminPageProps) {
  const {
    stays, addStay, deleteStay,
    transport: rides, addTransport, deleteTransport,
    guides, addGuide, deleteGuide, toggleGuideVerification,
    alerts, addAlert, deleteAlert,
    haor, updateHaor,
    resetDatabase,
    bookings, updateBookingStatus, deleteBooking
  } = useDB();

  const [activeSubTab, setActiveSubTab] = useState<"stays" | "transport" | "guides" | "alerts" | "haor" | "bookings" | "settings">("bookings");
  
  // System Settings state
  const [bkashNumber, setBkashNumber] = useState(() => localStorage.getItem("sylhetgo_bkash_number") || "+8801700-SYLHET");
  const [bkashType, setBkashType] = useState(() => localStorage.getItem("sylhetgo_bkash_type") || "Merchant");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleBkashSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("sylhetgo_bkash_number", bkashNumber);
    localStorage.setItem("sylhetgo_bkash_type", bkashType);
    alert("Settings updated successfully!");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem("sylhetgo_admin_password") || "Sylhetgo@2026";
    if (currentPassword !== storedPassword) {
      alert("Incorrect current password. Please try again.");
      return;
    }
    if (!newPassword.trim()) {
      alert("New password cannot be empty.");
      return;
    }
    localStorage.setItem("sylhetgo_admin_password", newPassword);
    alert("Settings updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
  };

  // Form toggles
  const [showAddForm, setShowAddForm] = useState(false);

  // Forms states
  const [stayTitle, setStayTitle] = useState("");
  const [stayCategory, setStayCategory] = useState("Premium Eco Lodge");
  const [stayLocation, setStayLocation] = useState("Sreemangal");
  const [stayPrice, setStayPrice] = useState(4500);
  const [stayBadge, setStayBadge] = useState("Plastic-Free Certified");
  const [stayDesc, setStayDesc] = useState("");
  const [stayImage, setStayImage] = useState("https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=600&q=80");

  const [rideTitle, setRideTitle] = useState("");
  const [rideCategory, setRideCategory] = useState("Chauffeur Drive");
  const [rideLocation, setRideLocation] = useState("Sreemangal");
  const [ridePrice, setRidePrice] = useState(3500);
  const [rideFuel, setRideFuel] = useState("Electric");
  const [rideCapacity, setRideCapacity] = useState(4);
  const [rideImage, setRideImage] = useState("https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80");

  const [guideName, setGuideName] = useState("");
  const [guideCategory, setGuideCategory] = useState("Swamp Forest & Wildlife Specialist");
  const [guideLocation, setGuideLocation] = useState("Ratargul");
  const [guidePrice, setGuidePrice] = useState(2500);
  const [guideLangs, setGuideLangs] = useState("Bengali, English, Sylheti");
  const [guideExp, setGuideExp] = useState(5);
  const [guideDesc, setGuideDesc] = useState("");
  const [guideImage, setGuideImage] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80");

  const [alertTitle, setAlertTitle] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"info" | "warning" | "danger">("warning");
  const [alertRegion, setAlertRegion] = useState("Tanguar Haor");
  const [alertDesc, setAlertDesc] = useState("");
  const [alertContact, setAlertContact] = useState("");

  const [haorHeight, setHaorHeight] = useState(haor.waterHeight);
  const [haorStatus, setHaorStatus] = useState(haor.currentStatus);
  const [haorPolice, setHaorPolice] = useState(haor.policeAlert);
  const [haorSafety, setHaorSafety] = useState(haor.safetyIndex);

  const handleResetDatabase = () => {
    if (confirm("Are you sure you want to restore the default seed database? This will clear custom entries.")) {
      resetDatabase();
      alert("Database successfully reset to default configurations!");
    }
  };

  // Save helpers
  const handleStaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStay({
      title: stayTitle || "Untitled Eco Cabin",
      category: stayCategory,
      location: stayLocation,
      price: Number(stayPrice),
      badge: stayBadge || "Carbon Vetted",
      image: stayImage,
      description: stayDesc || "A beautiful sustainable lodge surrounded by Sylhet nature.",
      features: ["Solar Powered Hot Water", "Organic Local Meals", "Biodiversity Corridor"]
    });
    setShowAddForm(false);
    setStayTitle("");
    setStayDesc("");
  };

  const handleRideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransport({
      title: rideTitle || "Eco Cruiser SUV",
      category: rideCategory,
      location: rideLocation,
      price: Number(ridePrice),
      image: rideImage,
      description: "A gorgeous modern vehicle utilizing zero emissions transit systems.",
      fuelType: rideFuel,
      capacity: Number(rideCapacity)
    });
    setShowAddForm(false);
    setRideTitle("");
  };

  const handleGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGuide({
      name: guideName || "Mofizur Rahman",
      category: guideCategory,
      location: guideLocation,
      price: Number(guidePrice),
      image: guideImage,
      languages: guideLangs.split(",").map(s => s.trim()),
      experienceYears: Number(guideExp),
      description: guideDesc || "Experienced guide trained in Leave No Trace rules."
    });
    setShowAddForm(false);
    setGuideName("");
    setGuideDesc("");
  };

  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAlert({
      title: alertTitle || "Weather Warning",
      severity: alertSeverity,
      timestamp: "Just Now",
      description: alertDesc || "Runoff speeds are high, boat safety gear must be worn.",
      region: alertRegion,
      contactNumber: alertContact || undefined
    });
    setShowAddForm(false);
    setAlertTitle("");
    setAlertDesc("");
    setAlertContact("");
  };

  const handleHaorUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateHaor({
      waterHeight: Number(haorHeight),
      currentStatus: haorStatus as any,
      policeAlert: haorPolice,
      safetyIndex: Number(haorSafety)
    });
    alert("Haor Swamp metrics updated successfully in the central database!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="text-left space-y-3 border-b border-emerald-100 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-900 text-xs font-semibold tracking-wide font-mono rounded-full">
            <Database className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            LIVE SECURE DATA PERSISTENCE MANAGER
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-emerald-950">
            SylhetGo Central Admin Dashboard
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl">
            Direct CRUD manager for all sustainable segments. Edits made here will propagate instantly to Stays, Transport, Guides, Emergency alert lists, and Haor gauges.
          </p>
        </div>

        {/* Database tools */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleResetDatabase}
            className="bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Demo DB
          </button>
          {onLogout && (
            <button
              onClick={() => {
                if (confirm("Are you sure you want to log out of the Admin panel?")) {
                  onLogout();
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white border border-purple-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          )}
        </div>
      </div>

      {/* Selector Subtabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
        {[
          { id: "bookings", label: "📋 Booking Requests", icon: <ClipboardList className="w-4 h-4" /> },
          { id: "stays", label: "🏨 Lodges & Stays", icon: <Hotel className="w-4 h-4" /> },
          { id: "transport", label: "🚗 Sustainable Rides", icon: <Car className="w-4 h-4" /> },
          { id: "guides", label: "🌿 Naturalist Guides", icon: <Users className="w-4 h-4" /> },
          { id: "alerts", label: "🚨 Critical Alerts", icon: <AlertOctagon className="w-4 h-4" /> },
          { id: "haor", label: "🌊 Swamp Water Metrics", icon: <Layers className="w-4 h-4" /> },
          { id: "settings", label: "⚙️ System Settings", icon: <Settings className="w-4 h-4" /> }
        ].map((sub) => (
          <button
            key={sub.id}
            onClick={() => { setActiveSubTab(sub.id as any); setShowAddForm(false); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === sub.id
                ? "bg-emerald-950 text-white shadow-sm"
                : "bg-emerald-50/50 text-emerald-900 border border-emerald-100/50 hover:bg-emerald-100"
            }`}
          >
            {sub.icon}
            <span>{sub.label}</span>
          </button>
        ))}
      </div>

      {/* MAIN DATA VIEW */}
      <div className="bg-white rounded-[2rem] border border-emerald-100 p-6 text-left shadow-sm space-y-6">
        
        {/* Subtab Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-display font-extrabold text-lg text-emerald-950 uppercase tracking-wide">
              {activeSubTab === "bookings" && "Booking Requests Management"}
              {activeSubTab === "stays" && "Lodgings Catalog"}
              {activeSubTab === "transport" && "Rides & Transit Fleet"}
              {activeSubTab === "guides" && "Naturalist Rosters"}
              {activeSubTab === "alerts" && "Active Emergency Feeds"}
              {activeSubTab === "haor" && "Wetland Flood Gauges"}
              {activeSubTab === "settings" && "System Settings Configurations"}
            </h3>
            <p className="text-xs text-gray-400">Manage database entries securely below.</p>
          </div>

          {activeSubTab !== "haor" && activeSubTab !== "bookings" && activeSubTab !== "settings" && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold shadow flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              {showAddForm ? "Collapse Form" : "Insert Entry"}
            </button>
          )}
        </div>

        {/* 1. ADD NEW RECORD FORM (STAYS, TRANS, GUIDES, ALERTS) */}
        {showAddForm && (
          <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl space-y-4 animate-in slide-in-from-top duration-300">
            <h4 className="font-display font-bold text-sm text-emerald-900 uppercase tracking-wider">
              Create New Record {activeSubTab.toUpperCase()}
            </h4>

            {activeSubTab === "stays" && (
              <form onSubmit={handleStaySubmit} className="grid sm:grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <label className="block text-gray-500 mb-1">Stay Name</label>
                  <input type="text" value={stayTitle} onChange={e => setStayTitle(e.target.value)} required placeholder="e.g. Sreemangal Hill Cabin" className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Category / Type</label>
                  <input type="text" value={stayCategory} onChange={e => setStayCategory(e.target.value)} required placeholder="e.g. Traditional Wooden Cabin" className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Location Region</label>
                  <input type="text" value={stayLocation} onChange={e => setStayLocation(e.target.value)} required placeholder="e.g. Sreemangal" className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Price per Night (BDT)</label>
                  <input type="number" value={stayPrice} onChange={e => setStayPrice(Number(e.target.value))} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Eco Certificate Badge</label>
                  <input type="text" value={stayBadge} onChange={e => setStayBadge(e.target.value)} placeholder="e.g. Plastic-Free Certified" className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Cover Photo URL</label>
                  <input type="text" value={stayImage} onChange={e => setStayImage(e.target.value)} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-500 mb-1">Eco Lodge Description</label>
                  <textarea rows={3} value={stayDesc} onChange={e => setStayDesc(e.target.value)} placeholder="Describe green features, building materials, local guides support..." className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button type="submit" className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl shadow">Save Stay Listing</button>
                </div>
              </form>
            )}

            {activeSubTab === "transport" && (
              <form onSubmit={handleRideSubmit} className="grid sm:grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <label className="block text-gray-500 mb-1">Ride Service Name</label>
                  <input type="text" value={rideTitle} onChange={e => setRideTitle(e.target.value)} required placeholder="e.g. Swamp Boat Tracker" className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Category / Engine Tech</label>
                  <input type="text" value={rideCategory} onChange={e => setRideCategory(e.target.value)} required placeholder="e.g. Electric Hybrid SUV" className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Base Location</label>
                  <input type="text" value={rideLocation} onChange={e => setRideLocation(e.target.value)} required placeholder="e.g. Ratargul" className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Rent Cost (BDT)</label>
                  <input type="number" value={ridePrice} onChange={e => setRidePrice(Number(e.target.value))} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Fuel Class</label>
                  <select value={rideFuel} onChange={e => setRideFuel(e.target.value)} className="w-full bg-white border border-emerald-100 p-2.5 rounded-xl focus:outline-none">
                    <option value="Electric">Silent Electric (Battery)</option>
                    <option value="CNG">Standard CNG (Low Carbon)</option>
                    <option value="Manual Boat">Manual Rowing (Zero Carbon)</option>
                    <option value="Solar Boat">Solar Houseboat (Zero Emission)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Passenger Capacity</label>
                  <input type="number" value={rideCapacity} onChange={e => setRideCapacity(Number(e.target.value))} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-500 mb-1">Photo URL</label>
                  <input type="text" value={rideImage} onChange={e => setRideImage(e.target.value)} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button type="submit" className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl shadow">Save Ride Asset</button>
                </div>
              </form>
            )}

            {activeSubTab === "guides" && (
              <form onSubmit={handleGuideSubmit} className="grid sm:grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <label className="block text-gray-500 mb-1">Naturalist Name</label>
                  <input type="text" value={guideName} onChange={e => setGuideName(e.target.value)} required placeholder="e.g. Abul Kalam" className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Naturalist Specialty</label>
                  <input type="text" value={guideCategory} onChange={e => setGuideCategory(e.target.value)} required placeholder="e.g. Swamps, Birdwatching" className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Base Active Location</label>
                  <input type="text" value={guideLocation} onChange={e => setGuideLocation(e.target.value)} required placeholder="e.g. Sreemangal" className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Daily Wage Fee (BDT)</label>
                  <input type="number" value={guidePrice} onChange={e => setGuidePrice(Number(e.target.value))} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Spoken Languages (Comma separated)</label>
                  <input type="text" value={guideLangs} onChange={e => setGuideLangs(e.target.value)} required placeholder="Bengali, English, Sylheti, Khasi" className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Years of Wild Experience</label>
                  <input type="number" value={guideExp} onChange={e => setGuideExp(Number(e.target.value))} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-500 mb-1">Cover Avatar Photo URL</label>
                  <input type="text" value={guideImage} onChange={e => setGuideImage(e.target.value)} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-500 mb-1">Personal Bio</label>
                  <textarea rows={3} value={guideDesc} onChange={e => setGuideDesc(e.target.value)} placeholder="Provide information on local knowledge, tribal history storytelling ability..." className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button type="submit" className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl shadow">Add New Naturalist</button>
                </div>
              </form>
            )}

            {activeSubTab === "alerts" && (
              <form onSubmit={handleAlertSubmit} className="grid sm:grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <label className="block text-gray-500 mb-1">Alert Title</label>
                  <input type="text" value={alertTitle} onChange={e => setAlertTitle(e.target.value)} required placeholder="e.g. Swell wave alert" className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Severity Rating</label>
                  <select value={alertSeverity} onChange={e => setAlertSeverity(e.target.value as any)} className="w-full bg-white border border-emerald-100 p-2.5 rounded-xl focus:outline-none">
                    <option value="info">Info (Blue)</option>
                    <option value="warning">Warning (Amber)</option>
                    <option value="danger">Danger (Rose)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Involved Region</label>
                  <input type="text" value={alertRegion} onChange={e => setAlertRegion(e.target.value)} required placeholder="e.g. Ratargul Swamp" className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Callback Helpline (Optional)</label>
                  <input type="text" value={alertContact} onChange={e => setAlertContact(e.target.value)} placeholder="+880-1711..." className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-500 mb-1">Description of warning</label>
                  <textarea rows={3} value={alertDesc} onChange={e => setAlertDesc(e.target.value)} required placeholder="Specify guidelines..." className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button type="submit" className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl shadow">Broadcast Alert</button>
                </div>
              </form>
            )}

          </div>
        )}

        {/* 2. DYNAMIC TABLE VIEWS WITH DELETE ACTIONS */}
        {activeSubTab === "bookings" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-semibold">
                Total Requests: {bookings ? bookings.length : 0}
              </span>
            </div>
            {!bookings || bookings.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-emerald-100 rounded-3xl bg-emerald-50/10">
                <ClipboardList className="w-12 h-12 text-emerald-300 mx-auto mb-3 animate-bounce" />
                <h4 className="font-display font-bold text-base text-emerald-950">No Booking Requests Yet</h4>
                <p className="text-gray-500 text-xs mt-1">When users reserve stays, naturalist guides, or transport, their bookings will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase font-mono">
                      <th className="py-3 px-2">ID & Customer Details</th>
                      <th className="py-3 px-2">Service & Item</th>
                      <th className="py-3 px-2">Dates, Guests & Notes</th>
                      <th className="py-3 px-2">Cost / Amount</th>
                      <th className="py-3 px-2">Payment Details</th>
                      <th className="py-3 px-2">Booking Status</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-emerald-50/20 font-medium text-emerald-950">
                        {/* ID & Customer */}
                        <td className="py-3.5 px-2">
                          <span className="font-mono text-[10px] block text-gray-400 mb-1">#{b.id.substring(0, 10)}</span>
                          <div className="space-y-0.5">
                            <p className="font-semibold text-emerald-950">{b.customerName || "Walk-In Guest"}</p>
                            <p className="text-[10px] text-gray-505 font-mono">{b.customerPhone || "No Phone"}</p>
                            <p className="text-[10px] text-gray-400 font-mono truncate max-w-[150px]">{b.customerEmail || "No Email"}</p>
                          </div>
                        </td>

                        {/* Service & Item */}
                        <td className="py-3.5 px-2">
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase font-mono mb-1 ${
                            b.serviceType === "Stay"
                              ? "bg-emerald-100 text-emerald-800"
                              : b.serviceType === "Transport"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {b.serviceType}
                          </span>
                          <p className="font-bold text-emerald-900 leading-tight">{b.itemName}</p>
                        </td>

                        {/* Dates, Guests & Notes */}
                        <td className="py-3.5 px-2">
                          <p className="text-gray-700 font-semibold">{b.userDates}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5 font-mono">Guests: <strong>{b.guestCount || 1}</strong></p>
                          {b.specialNotes && (
                            <p className="text-[10px] text-teal-800 italic mt-1 max-w-[180px] truncate" title={b.specialNotes}>
                              💬 "{b.specialNotes}"
                            </p>
                          )}
                        </td>

                        {/* Cost */}
                        <td className="py-3.5 px-2 font-mono font-bold text-emerald-950">
                          ৳{typeof b.userBudget === 'number' ? b.userBudget.toLocaleString() : b.userBudget}
                        </td>

                        {/* Payment Details */}
                        <td className="py-3.5 px-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono ${
                                b.paymentStatus === "Verified"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : "bg-amber-100 text-amber-800 border border-amber-200"
                              }`}>
                                {b.paymentStatus || "Unpaid"}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-500 font-mono">Method: <strong>{b.paymentMethod || "bKash"}</strong></p>
                            <p className="text-[9px] text-gray-400 font-mono truncate max-w-[120px]" title={b.transactionId}>
                              TXN: <strong>{b.transactionId || "No TXN ID"}</strong>
                            </p>
                          </div>
                        </td>

                        {/* Booking Status */}
                        <td className="py-3.5 px-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono ${
                            b.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : b.status === "Rejected"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              b.status === "Approved"
                                ? "bg-emerald-600 animate-pulse"
                                : b.status === "Rejected"
                                ? "bg-rose-600"
                                : "bg-amber-500 animate-bounce"
                            }`} />
                            {b.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {b.paymentStatus !== "Verified" && (
                              <button
                                onClick={() => {
                                  updateBookingStatus(b.id, b.status, "Verified");
                                  alert("Transaction successfully marked as Paid & Verified!");
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[9px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer animate-pulse"
                                title="Mark as Verified & Paid"
                              >
                                Verify Payment
                              </button>
                            )}

                            {/* Always visible action buttons for full flexibility and re-editing */}
                            <button
                              onClick={() => {
                                updateBookingStatus(b.id, "Approved");
                                if (b.status !== "Approved") {
                                  alert("Booking status changed to Approved!");
                                }
                              }}
                              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                b.status === "Approved"
                                  ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                                  : "bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                              }`}
                              title="Approve Booking"
                            >
                              <Check className="w-3.5 h-3.5 font-extrabold" />
                            </button>

                            <button
                              onClick={() => {
                                updateBookingStatus(b.id, "Rejected");
                                if (b.status !== "Rejected") {
                                  alert("Booking status changed to Rejected!");
                                }
                              }}
                              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                b.status === "Rejected"
                                  ? "bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
                                  : "bg-rose-100 hover:bg-rose-200 text-rose-800"
                              }`}
                              title="Reject Booking"
                            >
                              <X className="w-3.5 h-3.5 font-extrabold" />
                            </button>

                            {(b.status === "Approved" || b.status === "Rejected") && (
                              <button
                                onClick={() => {
                                  updateBookingStatus(b.id, "Pending");
                                  alert("Booking status reset back to Pending!");
                                }}
                                className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-1.5 rounded-lg transition-all cursor-pointer"
                                title="Reset / Undo to Pending"
                              >
                                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this booking record?")) {
                                  deleteBooking(b.id);
                                }
                              }}
                              className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
                              title="Delete Record"
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
        )}

        {activeSubTab === "stays" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase font-mono">
                  <th className="py-3 px-2">Lodge Title</th>
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-2">Region</th>
                  <th className="py-3 px-2">Price</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stays.map(s => (
                  <tr key={s.id} className="hover:bg-emerald-50/20 font-medium text-emerald-950">
                    <td className="py-3 px-2 font-semibold flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-emerald-50">
                        <img src={s.image} alt="" className="w-full h-full object-cover animate-fade-in" />
                      </div>
                      <span>{s.title}</span>
                    </td>
                    <td className="py-3 px-2">{s.category}</td>
                    <td className="py-3 px-2">{s.location}</td>
                    <td className="py-3 px-2">৳{s.price.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right">
                      <button 
                        onClick={() => deleteStay(s.id)}
                        className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 inline-flex transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === "transport" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase font-mono">
                  <th className="py-3 px-2">Vehicle</th>
                  <th className="py-3 px-2">Fuel Tech</th>
                  <th className="py-3 px-2">Location</th>
                  <th className="py-3 px-2">Rent Fee</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rides.map(r => (
                  <tr key={r.id} className="hover:bg-emerald-50/20 font-medium text-emerald-950">
                    <td className="py-3 px-2 font-semibold flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-emerald-50">
                        <img src={r.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span>{r.title}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded font-mono">
                        {r.fuelType}
                      </span>
                    </td>
                    <td className="py-3 px-2">{r.location}</td>
                    <td className="py-3 px-2">৳{r.price.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right">
                      <button 
                        onClick={() => deleteTransport(r.id)}
                        className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 inline-flex transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === "guides" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase font-mono">
                  <th className="py-3 px-2">Guide Name</th>
                  <th className="py-3 px-2">Specialty</th>
                  <th className="py-3 px-2">Location</th>
                  <th className="py-3 px-2">Daily Wage</th>
                  <th className="py-3 px-2">Verification Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {guides.map(g => {
                  const isVerified = g.badge === "Verified Local Guide";
                  return (
                    <tr key={g.id} className="hover:bg-emerald-50/20 font-medium text-emerald-950">
                      <td className="py-3 px-2 font-semibold flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-emerald-50">
                          <img src={g.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span>{g.name}</span>
                      </td>
                      <td className="py-3 px-2">{g.category}</td>
                      <td className="py-3 px-2">{g.location}</td>
                      <td className="py-3 px-2">৳{g.price.toLocaleString()}</td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => {
                            toggleGuideVerification(g.id);
                          }}
                          className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold flex items-center gap-1 transition-all ${
                            isVerified 
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                              : "bg-gray-100 text-gray-500 border border-gray-200"
                          }`}
                        >
                          <ShieldCheck className={`w-3.5 h-3.5 ${isVerified ? 'text-emerald-600' : 'text-gray-400'}`} />
                          <span>{isVerified ? "Verified (Active)" : "Toggle Verification"}</span>
                        </button>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button 
                          onClick={() => deleteGuide(g.id)}
                          className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 inline-flex transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === "alerts" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase font-mono">
                  <th className="py-3 px-2">Alert Heading</th>
                  <th className="py-3 px-2">Severity</th>
                  <th className="py-3 px-2">Region</th>
                  <th className="py-3 px-2">Helpline</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {alerts.map(a => (
                  <tr key={a.id} className="hover:bg-emerald-50/20 font-medium text-emerald-950">
                    <td className="py-3 px-2 font-semibold">{a.title}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase font-mono text-[10px] ${
                        a.severity === "danger" ? "bg-rose-100 text-rose-800" : a.severity === "warning" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="py-3 px-2">{a.region}</td>
                    <td className="py-3 px-2 font-mono">{a.contactNumber || "N/A"}</td>
                    <td className="py-3 px-2 text-right">
                      <button 
                        onClick={() => deleteAlert(a.id)}
                        className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 inline-flex transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. HAOR DYNAMIC FORM CONTROLS */}
        {activeSubTab === "haor" && (
          <form onSubmit={handleHaorUpdate} className="space-y-4 max-w-xl text-xs font-medium">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 mb-1">Live Water Level (Meters)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={haorHeight} 
                  onChange={e => setHaorHeight(Number(e.target.value))} 
                  required 
                  className="w-full bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                />
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Safety Index Score (0-100%)</label>
                <input 
                  type="number" 
                  max="100" 
                  value={haorSafety} 
                  onChange={e => setHaorSafety(Number(e.target.value))} 
                  required 
                  className="w-full bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Active Basin Classification</label>
              <select 
                value={haorStatus} 
                onChange={e => setHaorStatus(e.target.value as any)} 
                className="w-full bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Monsoon Deep Water">Monsoon Deep Water</option>
                <option value="Winter Dry Grassland">Winter Dry Grassland</option>
                <option value="Transitioning">Transitioning</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Police Safety Alert Broadcast Text</label>
              <textarea 
                rows={4} 
                value={haorPolice} 
                onChange={e => setHaorPolice(e.target.value)} 
                required 
                className="w-full bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500" 
              />
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition-all font-display"
              >
                Update Swamp Metrics
              </button>
            </div>
          </form>
        )}

        {/* 4. SYSTEM SETTINGS CONTROLS */}
        {activeSubTab === "settings" && (
          <div className="space-y-8 max-w-2xl">
            {/* bKash Configuration Section */}
            <div className="bg-emerald-50/20 p-6 rounded-2xl border border-emerald-100/50 space-y-4">
              <div className="flex items-center gap-2 border-b border-emerald-100/30 pb-3">
                <div className="p-2 rounded-lg bg-pink-100 text-pink-700 font-bold text-xs uppercase font-mono">bK</div>
                <div>
                  <h4 className="font-display font-bold text-sm text-emerald-950 uppercase">bKash Configuration</h4>
                  <p className="text-[10px] text-gray-500">Configure payment receiving phone details for conscious travellers.</p>
                </div>
              </div>
              
              <form onSubmit={handleBkashSubmit} className="space-y-4 text-xs font-medium">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 mb-1">Active bKash Number</label>
                    <input 
                      type="text" 
                      value={bkashNumber} 
                      onChange={e => setBkashNumber(e.target.value)} 
                      required 
                      placeholder="e.g., +8801700-SYLHET"
                      className="w-full bg-white border border-emerald-100 p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-emerald-950" 
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 mb-1">Account Type</label>
                    <select 
                      value={bkashType} 
                      onChange={e => setBkashType(e.target.value)} 
                      className="w-full bg-white border border-emerald-100 p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold text-emerald-950"
                    >
                      <option value="Merchant">Merchant</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button 
                    type="submit" 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl shadow transition-all font-display uppercase tracking-wider text-[11px] cursor-pointer"
                  >
                    Save Config
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password Section */}
            <div className="bg-purple-50/10 p-6 rounded-2xl border border-purple-100/30 space-y-4">
              <div className="flex items-center gap-2 border-b border-purple-100/20 pb-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                  <Lock className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-emerald-950 uppercase">Change Admin Password</h4>
                  <p className="text-[10px] text-gray-500">Dynamically update credentials to secure this administrative workspace.</p>
                </div>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs font-medium">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 mb-1">Current Password</label>
                    <input 
                      type="password" 
                      value={currentPassword} 
                      onChange={e => setCurrentPassword(e.target.value)} 
                      required 
                      placeholder="Enter current password"
                      className="w-full bg-white border border-emerald-100 p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-emerald-950" 
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 mb-1">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={e => setNewPassword(e.target.value)} 
                      required 
                      placeholder="Enter new custom password"
                      className="w-full bg-white border border-emerald-100 p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-emerald-950" 
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button 
                    type="submit" 
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl shadow transition-all font-display uppercase tracking-wider text-[11px] cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
