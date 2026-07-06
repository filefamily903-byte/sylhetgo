import React, { useState } from "react";
import { useDB } from "../DBContext";
import { EcoAttraction } from "../types";
import { MapPin, Star, Eye, Compass, Info, ShieldAlert, ThermometerSun } from "lucide-react";

export default function AttractionsPage() {
  const { attractions } = useDB();
  const [crowdFilter, setCrowdFilter] = useState("all");

  const filteredAttractions = attractions.filter(attr => 
    crowdFilter === "all" || attr.crowdLevel === crowdFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="text-left space-y-3 border-b border-emerald-100 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/50 rounded-full text-emerald-800 text-xs font-semibold tracking-wide font-mono">
          <Compass className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
          PROTECTED BIOSPHERES & SANCTUARIES
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-emerald-950">
          Swamp Forests, Rivers & Waterfalls
        </h1>
        <p className="text-gray-600 text-sm max-w-2xl">
          Discover pristine rainforest boundaries, limestone streams, and biodiversity hotspots. All sites are managed under strict local environmental quotas to restrict plastic intake.
        </p>
      </div>

      {/* Filter and Information Strip */}
      <div className="bg-emerald-950 text-white p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 flex-shrink-0">
            <Info className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm">Leave No Trace Guidelines Vetted</h4>
            <p className="text-[11px] text-emerald-200">Avoid single-use plastics. Bring all trash back to city collection centers.</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-300 font-mono">
            Filter Crowd Density:
          </span>
          <select
            value={crowdFilter}
            onChange={(e) => setCrowdFilter(e.target.value)}
            className="bg-emerald-900 border border-emerald-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 font-semibold"
          >
            <option value="all">All Levels</option>
            <option value="Low">Low Density</option>
            <option value="Moderate">Moderate Density</option>
            <option value="High">High Density</option>
          </select>
        </div>
      </div>

      {/* Grid of Attractions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAttractions.map((attr) => (
          <div 
            key={attr.id} 
            className="bg-white rounded-3xl border border-emerald-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group text-left"
          >
            
            {/* Attraction Image */}
            <div className="relative aspect-[16/10] bg-emerald-50 overflow-hidden">
              <img 
                src={attr.image} 
                alt={attr.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-emerald-900/95 text-white text-[10px] font-extrabold font-mono px-2.5 py-0.5 rounded-full uppercase">
                  {attr.category}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="bg-white text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {attr.rating}
                </span>
              </div>
            </div>

            {/* Attraction Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                
                {/* Location */}
                <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{attr.location}, Sylhet</span>
                </div>

                <h3 className="font-display font-extrabold text-lg text-emerald-950">
                  {attr.title}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {attr.description}
                </p>

                {/* Key Eco-Parameters */}
                <div className="pt-3 grid grid-cols-2 gap-2 text-[10px]">
                  
                  {/* Crowd Level */}
                  <div className="bg-gray-50 p-2 rounded-xl border border-gray-100/50">
                    <span className="block text-gray-400 font-bold uppercase font-mono mb-0.5">Crowd Status</span>
                    <span className={`font-extrabold ${
                      attr.crowdLevel === "Low" ? "text-emerald-700" : attr.crowdLevel === "Moderate" ? "text-yellow-700" : "text-red-700"
                    }`}>
                      ● {attr.crowdLevel}
                    </span>
                  </div>

                  {/* Mud Index */}
                  <div className="bg-gray-50 p-2 rounded-xl border border-gray-100/50">
                    <span className="block text-gray-400 font-bold uppercase font-mono mb-0.5">Mud Index</span>
                    <span className="font-extrabold text-amber-800">
                      ⛺ {attr.mudIndex}
                    </span>
                  </div>

                  {/* Best Season */}
                  <div className="bg-gray-50 p-2 rounded-xl border border-gray-100/50 col-span-2">
                    <span className="block text-gray-400 font-bold uppercase font-mono mb-0.5">Best Calendar Season</span>
                    <span className="font-bold text-gray-700 flex items-center gap-1">
                      <ThermometerSun className="w-3 h-3 text-orange-500" />
                      {attr.bestSeason}
                    </span>
                  </div>

                </div>

              </div>

              {/* Status footer */}
              <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] font-mono">
                <span className="text-gray-400 font-bold uppercase">Conservation</span>
                <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-extrabold">
                  {attr.conservationStatus}
                </span>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
