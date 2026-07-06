import React, { useState } from "react";
import { useDB } from "../DBContext";
import { 
  ShieldAlert, Trash2, Plus, RefreshCw, Layers, Database, Hotel, 
  Car, Users, AlertOctagon, ShieldCheck, Star, Sparkles, CheckCircle2, 
  ClipboardList, Check, X, LogOut, Settings, Lock 
} from "lucide-react";

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
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Central System Settings
  const [bkashNumber, setBkashNumber] = useState(() => localStorage.getItem("sylhetgo_bkash_number") || "+8801700-SYLHET");
  const [bkashType, setBkashType] = useState(() => localStorage.getItem("sylhetgo_bkash_type") || "Merchant");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Consolidated Form States
  const [stayForm, setStayForm] = useState({
    title: "", category: "Premium Eco Lodge", location: "Sreemangal", 
    price: 4500, badge: "Plastic-Free Certified", desc: "",
    image: "https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=600&q=80"
  });

  const [rideForm, setRideForm] = useState({
    title: "", category: "Chauffeur Drive", location: "Sreemangal", 
    price: 3500, fuel: "Electric", capacity: 4,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80"
  });

  const [guideForm, setGuideForm] = useState({
    name: "", category: "Swamp Forest & Wildlife Specialist", location: "Ratargul",
    price: 2500, langs: "Bengali, English, Sylheti", exp: 5, desc: "",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
  });

  const [alertForm, setAlertForm] = useState({
    title: "", severity: "warning" as "info" | "warning" | "danger", 
    region: "Tanguar Haor", desc: "", contact: ""
  });

  // Haor Metric Form State initialized with DB values
  const [haorMetrics, setHaorMetrics] = useState({
    waterHeight: haor?.waterHeight || 0,
    currentStatus: haor?.currentStatus || "Normal",
    policeAlert: haor?.policeAlert || "",
    safetyIndex: haor?.safetyIndex || 85
  });

  // Action Submissions
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
    alert("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleStaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStay({
      title: stayForm.title || "Untitled Eco Cabin",
      category: stayForm.category,
      location: stayForm.location,
      price: Number(stayForm.price),
      badge: stayForm.badge || "Carbon Vetted",
      image: stayForm.image,
      description: stayForm.desc || "A beautiful sustainable lodge surrounded by Sylhet nature.",
      features: ["Solar Powered Hot Water", "Organic Local Meals", "Biodiversity Corridor"]
    });
    setShowAddForm(false);
    setStayForm({ ...stayForm, title: "", desc: "" });
  };

  const handleRideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransport({
      title: rideForm.title || "Eco Cruiser SUV",
      category: rideForm.category,
      location: rideForm.location,
      price: Number(rideForm.price),
      image: rideForm.image,
      description: "A gorgeous modern vehicle utilizing zero emissions transit systems.",
      fuelType: rideForm.fuel,
      capacity: Number(rideForm.capacity)
    });
    setShowAddForm(false);
    setRideForm({ ...rideForm, title: "" });
  };

  const handleGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGuide({
      name: guideForm.name || "Mofizur Rahman",
      category: guideForm.category,
      location: guideForm.location,
      price: Number(guideForm.price),
      image: guideForm.image,
      languages: guideForm.langs.split(",").map(s => s.trim()),
      experienceYears: Number(guideForm.exp),
      description: guideForm.desc || "Experienced guide trained in Leave No Trace rules."
    });
    setShowAddForm(false);
    setGuideForm({ ...guideForm, name: "", desc: "" });
  };

  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAlert({
      title: alertForm.title || "Weather Warning",
      severity: alertForm.severity,
      timestamp: "Just Now",
      description: alertForm.desc || "Runoff speeds are high, boat safety gear must be worn.",
      region: alertForm.region,
      contactNumber: alertForm.contact || undefined
    });
    setShowAddForm(false);
    setAlertForm({ ...alertForm, title: "", desc: "", contact: "" });
  };

  const handleHaorUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateHaor({
      waterHeight: Number(haorMetrics.waterHeight),
      currentStatus: haorMetrics.currentStatus as any,
      policeAlert: haorMetrics.policeAlert,
      safetyIndex: Number(haorMetrics.safetyIndex)
    });
    alert("Haor Swamp metrics updated successfully!");
  };

  const handleResetDatabase = () => {
    if (confirm("Are you sure you want to restore the default seed database? This will clear custom entries.")) {
      resetDatabase();
      alert("Database successfully reset!");
    }
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
            Direct CRUD manager for all sustainable segments. Edits propagate instantly across active stays, rides, guides, and metrics.
          </p>
        </div>

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
                if (confirm("Are you sure you want to log out?")) onLogout();
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white border border-purple-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          )}
        </div>
      </div>

      {/* Subtab Selectors */}
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

      {/* Main Panel Content Box */}
      <div className="bg-white rounded-[2rem] border border-emerald-100 p-6 text-left shadow-sm space-y-6">
        
        {/* Dynamic Inner Panel View Header */}
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
            <p className="text-xs text-gray-400">View logs and safely manage database nodes.</p>
          </div>

          {!["haor", "bookings", "settings"].includes(activeSubTab) && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold shadow flex items-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {showAddForm ? "Collapse Form" : "Insert Entry"}
            </button>
          )}
        </div>

        {/* --- Forms Section --- */}
        {showAddForm && (
          <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl space-y-4 animate-in slide-in-from-top duration-300">
            <h4 className="font-display font-bold text-sm text-emerald-900 uppercase tracking-wider">
              Create New Record {activeSubTab.toUpperCase()}
            </h4>

            {activeSubTab === "stays" && (
              <form onSubmit={handleStaySubmit} className="grid sm:grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <label className="block text-gray-500 mb-1">Stay Name</label>
                  <input type="text" value={stayForm.title} onChange={e => setStayForm({...stayForm, title: e.target.value})} required placeholder="e.g. Sreemangal Hill Cabin" className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Category / Type</label>
                  <input type="text" value={stayForm.category} onChange={e => setStayForm({...stayForm, category: e.target.value})} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Location Region</label>
                  <input type="text" value={stayForm.location} onChange={e => setStayForm({...stayForm, location: e.target.value})} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Price per Night (BDT)</label>
                  <input type="number" value={stayForm.price} onChange={e => setStayForm({...stayForm, price: Number(e.target.value)})} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Eco Certificate Badge</label>
                  <input type="text" value={stayForm.badge} onChange={e => setStayForm({...stayForm, badge: e.target.value})} className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Cover Photo URL</label>
                  <input type="text" value={stayForm.image} onChange={e => setStayForm({...stayForm, image: e.target.value})} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-500 mb-1">Eco Lodge Description</label>
                  <textarea rows={3} value={stayForm.desc} onChange={e => setStayForm({...stayForm, desc: e.target.value})} placeholder="Describe green properties..." className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button type="submit" className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl shadow hover:bg-emerald-700">Save Stay Listing</button>
                </div>
              </form>
            )}

            {activeSubTab === "transport" && (
              <form onSubmit={handleRideSubmit} className="grid sm:grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <label className="block text-gray-500 mb-1">Ride Service Name</label>
                  <input type="text" value={rideForm.title} onChange={e => setRideForm({...rideForm, title: e.target.value})} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Category / Fleet Engine</label>
                  <input type="text" value={rideForm.category} onChange={e => setRideForm({...rideForm, category: e.target.value})} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Rent Cost (BDT)</label>
                  <input type="number" value={rideForm.price} onChange={e => setRideForm({...rideForm, price: Number(e.target.value)})} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Fuel Class</label>
                  <select value={rideForm.fuel} onChange={e => setRideForm({...rideForm, fuel: e.target.value})} className="w-full bg-white border border-emerald-100 p-2.5 rounded-xl focus:outline-none">
                    <option value="Electric">Silent Electric (Battery)</option>
                    <option value="CNG">Standard CNG (Low Carbon)</option>
                    <option value="Manual Boat">Manual Rowing (Zero Carbon)</option>
                    <option value="Solar Boat">Solar Houseboat (Zero Emission)</option>
                  </select>
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button type="submit" className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl shadow hover:bg-emerald-700">Save Ride Asset</button>
                </div>
              </form>
            )}

            {activeSubTab === "guides" && (
              <form onSubmit={handleGuideSubmit} className="grid sm:grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <label className="block text-gray-500 mb-1">Naturalist Name</label>
                  <input type="text" value={guideForm.name} onChange={e => setGuideForm({...guideForm, name: e.target.value})} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Daily Wage Fee (BDT)</label>
                  <input type="number" value={guideForm.price} onChange={e => setGuideForm({...guideForm, price: Number(e.target.value)})} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button type="submit" className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl shadow hover:bg-emerald-700">Add New Naturalist</button>
                </div>
              </form>
            )}

            {activeSubTab === "alerts" && (
              <form onSubmit={handleAlertSubmit} className="grid sm:grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <label className="block text-gray-500 mb-1">Alert Dispatch Title</label>
                  <input type="text" value={alertForm.title} onChange={e => setAlertForm({...alertForm, title: e.target.value})} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Severity Rating</label>
                  <select value={alertForm.severity} onChange={e => setAlertForm({...alertForm, severity: e.target.value as any})} className="w-full bg-white border border-emerald-100 p-2.5 rounded-xl focus:outline-none">
                    <option value="info">Info (Blue)</option>
                    <option value="warning">Warning (Amber)</option>
                    <option value="danger">Danger (Rose)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-500 mb-1">Description of Broadcast Warning</label>
                  <textarea rows={2} value={alertForm.desc} onChange={e => setAlertForm({...alertForm, desc: e.target.value})} required className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button type="submit" className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl shadow hover:bg-emerald-700">Broadcast Alert</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* --- Dynamic Content Tables & Management Layout Views --- */}
        {activeSubTab === "bookings" && (
          <div className="space-y-4">
            <span className="text-xs text-gray-500 font-semibold">Total Requests: {bookings?.length || 0}</span>
            {!bookings || bookings.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-emerald-100 rounded-3xl bg-emerald-50/10">
                <ClipboardList className="w-12 h-12 text-emerald-300 mx-auto mb-3 animate-bounce" />
                <h4 className="font-display font-bold text-base text-emerald-950">No Bookings Yet</h4>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase font-mono">
                      <th className="py-3 px-2">ID & Customer Details</th>
                      <th className="py-3 px-2">Service & Item</th>
                      <th className="py-3 px-2">Dates & Notes</th>
                      <th className="py-3 px-2">Cost</th>
                      <th className="py-3 px-2">Payment Details</th>
                      <th className="py-3 px-2">Booking Status</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-emerald-50/20 font-medium text-emerald-950">
                        <td className="py-3.5 px-2">
                          <span className="font-mono text-[10px] block text-gray-400">#{b.id.substring(0, 10)}</span>
                          <p className="font-semibold">{b.customerName || "Walk-In Guest"}</p>
                          <p className="text-[10px] text-gray-500 font-mono">{b.customerPhone}</p>
                        </td>
                        <td className="py-3.5 px-2">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase font-mono mb-1 ${
                            b.serviceType === "Stay" ? "bg-emerald-100 text-emerald-800" : b.serviceType === "Transport" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                          }`}>{b.serviceType}</span>
                          <p className="font-bold text-emerald-900">{b.itemName}</p>
                        </td>
                        <td className="py-3.5 px-2">
                          <p className="text-gray-700 font-semibold">{b.userDates}</p>
                          <p className="text-[10px] text-gray-400 font-mono">Guests: {b.guestCount || 1}</p>
                        </td>
                        <td className="py-3.5 px-2 font-mono font-bold">৳{b.userBudget?.toLocaleString()}</td>
                        <td className="py-3.5 px-2">
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-mono border ${
                            b.paymentStatus === "Verified" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"
                          }`}>{b.paymentStatus || "Unpaid"}</span>
                          <p className="text-[9px] text-gray-400 font-mono truncate max-w-[100px]">TXN: {b.transactionId || "N/A"}</p>
                        </td>
                        <td className="py-3.5 px-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.status === "Approved" ? "bg-emerald-100 text-emerald-800" : b.status === "Rejected" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                          }`}>{b.status}</span>
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {b.paymentStatus !== "Verified" && (
                              <button onClick={() => { updateBookingStatus(b.id, b.status, "Verified"); alert("Payment Verified!"); }} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded" title="Verify Payment"><CheckCircle2 className="w-4 h-4" /></button>
                            )}
                            {b.status === "Pending" && (
                              <>
                                <button onClick={() => updateBookingStatus(b.id, "Approved", b.paymentStatus)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Approve Booking"><Check className="w-4 h-4" /></button>
                                <button onClick={() => updateBookingStatus(b.id, "Rejected", b.paymentStatus)} className="p-1 text-rose-500 hover:bg-rose-50 rounded" title="Reject Booking"><X className="w-4 h-4" /></button>
                              </>
                            )}
                            <button onClick={() => { if(confirm("Delete records?")) deleteBooking(b.id); }} className="p-1 text-gray-400 hover:text-rose-600 rounded"><Trash2 className="w-4 h-4" /></button>
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
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase font-mono"><th className="py-3 px-2">Stay Node</th><th className="py-3 px-2">Region</th><th className="py-3 px-2">Price</th><th className="py-3 px-2 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stays.map(s => (
                  <tr key={s.id} className="hover:bg-emerald-50/10">
                    <td className="py-3 px-2 font-bold text-emerald-950">{s.title}</td>
                    <td className="py-3 px-2 text-gray-500">{s.location}</td>
                    <td className="py-3 px-2 font-mono">৳{s.price}</td>
                    <td className="py-3 px-2 text-right"><button onClick={() => deleteStay(s.id)} className="p-1 text-gray-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button></td>
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
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase font-mono"><th className="py-3 px-2">Transit Unit</th><th className="py-3 px-2">Fuel Type</th><th className="py-3 px-2">Price</th><th className="py-3 px-2 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rides.map(r => (
                  <tr key={r.id} className="hover:bg-emerald-50/10">
                    <td className="py-3 px-2 font-bold text-emerald-950">{r.title}</td>
                    <td className="py-3 px-2 font-mono text-blue-700">{r.fuelType}</td>
                    <td className="py-3 px-2 font-mono">৳{r.price}</td>
                    <td className="py-3 px-2 text-right"><button onClick={() => deleteTransport(r.id)} className="p-1 text-gray-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button></td>
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
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase font-mono"><th className="py-3 px-2">Naturalist Name</th><th className="py-3 px-2">Specialty</th><th className="py-3 px-2">Verification</th><th className="py-3 px-2 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {guides.map(g => (
                  <tr key={g.id} className="hover:bg-emerald-50/10">
                    <td className="py-3 px-2 font-bold text-emerald-950">{g.name}</td>
                    <td className="py-3 px-2 text-gray-500">{g.category}</td>
                    <td className="py-3 px-2">
                      <button onClick={() => toggleGuideVerification(g.id)} className={`px-2 py-0.5 rounded text-[10px] font-bold ${g.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                        {g.isVerified ? '✓ Verified Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td className="py-3 px-2 text-right"><button onClick={() => deleteGuide(g.id)} className="p-1 text-gray-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === "alerts" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase font-mono"><th className="py-3 px-2">Incident Broadcast</th><th className="py-3 px-2">Severity</th><th className="py-3 px-2">Region Involved</th><th className="py-3 px-2 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {alerts.map(a => (
                  <tr key={a.id} className="hover:bg-emerald-50/10">
                    <td className="py-3 px-2 font-bold text-emerald-950">{a.title}</td>
                    <td className="py-3 px-2 uppercase font-mono font-bold"><span className={a.severity === 'danger' ? 'text-rose-600' : 'text-amber-600'}>{a.severity}</span></td>
                    <td className="py-3 px-2 text-gray-600">{a.region}</td>
                    <td className="py-3 px-2 text-right"><button onClick={() => deleteAlert(a.id)} className="p-1 text-gray-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === "haor" && (
          <form onSubmit={handleHaorUpdate} className="max-w-xl space-y-4 text-xs font-medium">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 mb-1">Water Height Level (Meters)</label>
                <input type="number" step="0.1" value={haorMetrics.waterHeight} onChange={e => setHaorMetrics({...haorMetrics, waterHeight: Number(e.target.value)})} className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Safety Index Gauge (%)</label>
                <input type="number" value={haorMetrics.safetyIndex} onChange={e => setHaorMetrics({...haorMetrics, safetyIndex: Number(e.target.value)})} className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-500 mb-1">Police / Navigation Advisory Alert Notice</label>
                <input type="text" value={haorMetrics.policeAlert} onChange={e => setHaorMetrics({...haorMetrics, policeAlert: e.target.value})} className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
              </div>
            </div>
            <button type="submit" className="bg-emerald-950 text-white font-bold px-4 py-2 rounded-xl shadow hover:bg-emerald-900">Update Metrics</button>
          </form>
        )}

        {activeSubTab === "settings" && (
          <div className="grid md:grid-cols-2 gap-8 text-xs font-medium">
            <form onSubmit={handleBkashSubmit} className="space-y-4 bg-emerald-50/20 border border-emerald-100 p-5 rounded-2xl">
              <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-emerald-600" /> Gateway Configurations</h4>
              <div>
                <label className="block text-gray-500 mb-1">bKash Merchant Account Number</label>
                <input type="text" value={bkashNumber} onChange={e => setBkashNumber(e.target.value)} className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Account Ownership Node</label>
                <input type="text" value={bkashType} onChange={e => setBkashType(e.target.value)} className="w-full bg-white border border-emerald-100 p-2 rounded-xl focus:outline-none" />
              </div>
              <button type="submit" className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl shadow hover:bg-emerald-700">Save Gateway</button>
            </form>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 bg-purple-50/20 border border-purple-100 p-5 rounded-2xl">
              <h4 className="font-bold text-sm text-purple-950 flex items-center gap-1.5"><Lock className="w-4 h-4 text-purple-600" /> Update Security Credentials</h4>
              <div>
                <label className="block text-gray-500 mb-1">Current Session Password</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="w-full bg-white border border-purple-100 p-2 rounded-xl focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">New Administrative Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full bg-white border border-purple-100 p-2 rounded-xl focus:outline-none" />
              </div>
              <button type="submit" className="bg-purple-600 text-white font-bold px-4 py-2 rounded-xl shadow hover:bg-purple-700">Save Password</button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
