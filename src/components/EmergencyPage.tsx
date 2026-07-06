import React, { useState } from "react";
import { useDB } from "../DBContext";
import { EmergencyAlert } from "../types";
import { ShieldAlert, PhoneCall, AlertTriangle, ShieldCheck, HelpCircle, FlameKindling, Info, Send } from "lucide-react";

export default function EmergencyPage() {
  const { alerts, addAlert } = useDB();
  
  // Submit emergency report states
  const [reporterName, setReporterName] = useState("");
  const [reportPhone, setReportPhone] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportLocation, setReportLocation] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName || !reportPhone || !reportDesc || !reportLocation) return;

    // Simulate appending a temporary warning feed, or adding to database alerts with "warning" severity
    const dummyNewAlert: Omit<EmergencyAlert, "id"> = {
      title: `User Report: Trail Concern at ${reportLocation}`,
      severity: "warning",
      timestamp: "Just Now",
      description: `${reportDesc} (Reported by: ${reporterName}, Contact: ${reportPhone})`,
      region: reportLocation
    };

    addAlert(dummyNewAlert);

    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReporterName("");
      setReportPhone("");
      setReportDesc("");
      setReportLocation("");
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="text-left space-y-3 border-b border-rose-100 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-900 text-xs font-semibold tracking-wide font-mono rounded-full">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
          TOURIST SECURITY & HEALTH HELPLINES
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-rose-950">
          Emergency Services & Live Alerts
        </h1>
        <p className="text-gray-600 text-sm max-w-2xl">
          SylhetGo keeps you linked to search-and-rescue units, regional Tourist Police, medical desks, and provides dynamic climate warning feeds.
        </p>
      </div>

      {/* Grid: Live Alert Feed & Helicopter / Police Contacts */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Live Warning Feed - Column span 2 */}
        <div className="md:col-span-2 space-y-4 text-left">
          <h3 className="font-display font-bold text-lg text-emerald-950 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            Live Wetland & Forest Alert Board
          </h3>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${
                  alert.severity === "danger" 
                    ? "bg-rose-50/60 border-rose-100 text-rose-950" 
                    : alert.severity === "warning"
                    ? "bg-amber-50/60 border-amber-100 text-amber-950"
                    : "bg-blue-50/60 border-blue-100 text-blue-950"
                }`}
              >
                <div className="mt-1 flex-shrink-0">
                  {alert.severity === "danger" ? (
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">🚨</div>
                  ) : alert.severity === "warning" ? (
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">⚠️</div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">ℹ️</div>
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="font-bold text-sm leading-snug">{alert.title}</h4>
                    <span className="text-[10px] opacity-75 font-mono font-bold">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{alert.description}</p>
                  
                  <div className="pt-1.5 flex flex-wrap gap-2 items-center text-[10px] font-mono">
                    <span className="bg-white/70 border border-current px-2 py-0.5 rounded font-bold">
                      Region: {alert.region}
                    </span>
                    {alert.contactNumber && (
                      <span className="bg-white/70 border border-current px-2 py-0.5 rounded font-extrabold flex items-center gap-1">
                        ☎ Helpline: {alert.contactNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Essential Helplines Widget */}
        <div className="space-y-6 text-left">
          <h3 className="font-display font-bold text-lg text-emerald-950 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-emerald-600" />
            Vetted Hotlines
          </h3>

          <div className="bg-white rounded-3xl border border-emerald-100 p-5 space-y-4 shadow-sm">
            
            {/* Tourist Police */}
            <div className="border-b border-gray-100 pb-4 space-y-1">
              <h4 className="text-xs font-bold text-emerald-950 uppercase font-mono">Sylhet Tourist Police Desk</h4>
              <p className="text-xs text-gray-500">Immediate response to safety issues, theft, or guide harassment.</p>
              <div className="pt-2">
                <a 
                  href="tel:+8801711000111" 
                  className="inline-flex items-center gap-2 bg-rose-50 text-rose-800 hover:bg-rose-100 px-3.5 py-1.5 rounded-xl text-xs font-extrabold font-mono transition-all"
                >
                  📞 +880-1711-000111
                </a>
              </div>
            </div>

            {/* Sreemangal Fire & Rescue */}
            <div className="border-b border-gray-100 pb-4 space-y-1">
              <h4 className="text-xs font-bold text-emerald-950 uppercase font-mono">Sreemangal Forest Fire & Rescue</h4>
              <p className="text-xs text-gray-500">Rescues for trail hikers lost in Lawachara deep forest compartments.</p>
              <div className="pt-2">
                <a 
                  href="tel:+8801822333444" 
                  className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl text-xs font-extrabold font-mono transition-all"
                >
                  📞 +880-1822-333444
                </a>
              </div>
            </div>

            {/* Sunamganj Water Ambulance */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-emerald-950 uppercase font-mono">Sunamganj Wetland Water Ambulance</h4>
              <p className="text-xs text-gray-500">Speedboat medical evacuation from houseboats in Tanguar Haor.</p>
              <div className="pt-2">
                <a 
                  href="tel:+8801911999888" 
                  className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 hover:bg-blue-100 px-3.5 py-1.5 rounded-xl text-xs font-extrabold font-mono transition-all"
                >
                  📞 +880-1911-999888
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Incident reporting form */}
      <div className="bg-white rounded-[2rem] border border-rose-100 p-6 md:p-8 text-left max-w-3xl mx-auto space-y-6 shadow-sm">
        <div className="space-y-1">
          <h3 className="font-display font-extrabold text-xl text-rose-950 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />
            Report an Active Trail Hazard or Incident
          </h3>
          <p className="text-xs text-gray-500">
            Encountered high flash flooding, blockages, or high plastic debris dump? Log it directly into our tracker database to alert nearby travelers.
          </p>
        </div>

        {reportSuccess ? (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto text-xl font-bold">✓</div>
            <h4 className="font-display font-bold text-emerald-950">Incident Broadcast Succeeded</h4>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              Your trail concern report has been published on the local alert feed. Nearby tourists have been notified of this update.
            </p>
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono">Your Name</label>
                <input
                  type="text"
                  required
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Imran Hossain"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono">Your Callback Phone</label>
                <input
                  type="tel"
                  required
                  value={reportPhone}
                  onChange={(e) => setReportPhone(e.target.value)}
                  placeholder="e.g. +880-1700-111222"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono">Location / Region</label>
                <input
                  type="text"
                  required
                  value={reportLocation}
                  onChange={(e) => setReportLocation(e.target.value)}
                  placeholder="e.g. Lawachara Trail 2, Sreemangal"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono">Urgency / Type</label>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-rose-500">
                  <option>Muddy Slips / Trail Blocked</option>
                  <option>Flash Flood / Wave Swell</option>
                  <option>Severe Litter Pile / Plastic Leak</option>
                  <option>Wildlife Crossing Danger</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono">Description of Hazard</label>
              <textarea
                required
                rows={3}
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
                placeholder="Describe exactly what you saw. E.g., A heavy mud slide has blocked the main wooden path near the forest streams, making it slippery..."
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-rose-100 flex items-center gap-2 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                Broadcast Warning Alert
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
