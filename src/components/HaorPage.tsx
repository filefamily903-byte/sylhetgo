import React from "react";
import { useDB } from "../DBContext";
import { Waves, ShieldCheck, AlertCircle, Compass, HelpCircle } from "lucide-react";

export default function HaorPage() {
  const { haor: metric } = useDB();

  const isHighWater = metric.waterHeight >= 8.0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="text-left space-y-3 border-b border-emerald-100 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100/50 rounded-full text-blue-900 text-xs font-semibold tracking-wide font-mono">
          <Waves className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          REAL-TIME HYDRO-METRIC SENSING
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-emerald-950">
          Haor Wetland Water-Level Tracker
        </h1>
        <p className="text-gray-600 text-sm max-w-2xl">
          Sylhet's wetland basins (Tanguar Haor, Hakaluki Haor) exist as massive inland seas during monsoon, but transform into green dry pasture grazing lands in winter. Keep track of seasonal metrics.
        </p>
      </div>

      {/* Main Metric Visualization Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Core Depth Panel */}
        <div className="bg-gradient-to-br from-blue-900 to-teal-800 text-white rounded-[2rem] p-6 text-left shadow-lg md:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] bg-white/15 border border-white/10 px-3 py-1 rounded-full font-mono uppercase tracking-widest text-teal-200">
              Active Water Height
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-teal-100">
                {metric.waterHeight}m
              </span>
              <span className="text-sm font-semibold text-teal-200 font-mono">Current Basin Depth</span>
            </div>

            <p className="text-xs text-blue-100 leading-relaxed max-w-lg">
              The wetland is currently classified as <strong className="text-white underline">{metric.currentStatus}</strong>. Boat navigation is highly feasible, but safety equipment is required.
            </p>
          </div>

          {/* Depth Comparative Scale */}
          <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider font-mono text-[10px]">Comparative Ranges</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <span className="text-blue-300 block text-[10px] uppercase font-mono">Monsoon Maxima</span>
                <span className="font-extrabold font-display text-sm">{metric.monsoonWaterHeight} Meters</span>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <span className="text-teal-300 block text-[10px] uppercase font-mono">Winter Dry Minima</span>
                <span className="font-extrabold font-display text-sm">{metric.winterWaterHeight} Meters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Gauge Panel */}
        <div className="bg-white rounded-[2rem] border border-emerald-100 p-6 flex flex-col justify-between text-left shadow-sm space-y-4">
          <div className="space-y-3">
            <span className="inline-block text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full uppercase font-mono">
              Hydro Safety Indicator
            </span>
            <h3 className="font-display font-bold text-xl text-emerald-950">Safety Score</h3>
            
            <div className="py-2 flex items-baseline gap-1">
              <span className="text-4xl font-black text-emerald-600 font-mono">{metric.safetyIndex}%</span>
              <span className="text-xs text-gray-500 font-bold uppercase font-mono">Safe Voyage</span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Calculated on wind speed, local current velocity, and tourist police safety alerts.
            </p>
          </div>

          <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100/50 flex gap-2 items-start text-xs text-emerald-900 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span>Guaranteed Life-Jacket standards for all registered houseboats.</span>
          </div>
        </div>

      </div>

      {/* Police Directives and Boat Rate Sheet */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Police Alert Card */}
        <div className="bg-yellow-50/60 border border-yellow-100 rounded-3xl p-6 text-left space-y-3">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="w-5 h-5 text-yellow-700 flex-shrink-0" />
            <h3 className="font-display font-bold text-base">Tourist Police Special Directive</h3>
          </div>
          <p className="text-xs text-yellow-950 leading-relaxed font-medium">
            "{metric.policeAlert}"
          </p>
          <div className="pt-2">
            <span className="text-[10px] bg-yellow-200/50 text-yellow-900 px-3 py-1 rounded-full font-mono font-bold">
              UPDATED TODAY
            </span>
          </div>
        </div>

        {/* Rate Regulation */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 text-left space-y-3">
          <div className="flex items-center gap-2 text-emerald-800">
            <Compass className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <h3 className="font-display font-bold text-base">Local Boat Rate Regulation</h3>
          </div>
          <p className="text-xs text-emerald-950 leading-relaxed">
            The local Upazila administration regulates boat hire prices to protect guests from dynamic price-gouging. Please refer to this rate block:
          </p>
          <p className="text-xs bg-white border border-emerald-100 px-3 py-2.5 rounded-2xl text-emerald-900 font-bold font-mono">
            {metric.boatRateRegulation}
          </p>
        </div>

      </div>

      {/* Seasonal Transition Guide */}
      <div className="bg-white rounded-3xl border border-emerald-100 p-8 text-left space-y-6">
        <h3 className="font-display font-extrabold text-xl text-emerald-950 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          Understanding Sylhet's Wetland Seasons
        </h3>

        <div className="grid md:grid-cols-2 gap-6 text-xs text-gray-600 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-emerald-900 text-sm">🌊 The Monsoon Surge (June - Oct)</h4>
            <p>
              In summer, heavy runoff from the Meghalaya hills floods the entire basin, converting small creeks into a single massive body of deep emerald water. Migratory navigation is fully open, houseboats cruise freely, and the swamp trees in Ratargul sit submerged to their leaf lines. Beautiful but requires active safety precautions.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-emerald-900 text-sm">🌾 The Winter Bed (Nov - Apr)</h4>
            <p>
              As the dry winter months set in, the water recedes completely. The haor beds emerge as rich clay soil filled with dynamic green grazing grass. Migratory birds from Siberia arrive in their hundreds of thousands to nest on the remaining swamp canals. Travel shifts to overland e-bikes and small row-boats.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
