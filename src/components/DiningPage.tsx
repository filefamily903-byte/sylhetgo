import React, { useState } from "react";
import { getDining } from "../db";
import { DiningSpot } from "../types";
import { MapPin, Star, Utensils, Heart, Sparkles, Coffee } from "lucide-react";

export default function DiningPage() {
  const [spots, setSpots] = useState<DiningSpot[]>(() => getDining());
  const [organicOnly, setOrganicOnly] = useState(false);

  const filteredSpots = spots.filter(spot => !organicOnly || spot.isOrganic);

  React.useEffect(() => {
    setSpots(getDining());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="text-left space-y-3 border-b border-emerald-100 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/60 rounded-full text-amber-900 text-xs font-semibold tracking-wide font-mono">
          <Utensils className="w-3.5 h-3.5 text-amber-700" />
          ETHICAL GASTRONOMY & TRADITIONAL CUISINE
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-emerald-950">
          Shatkora Palaces & Organic Kitchens
        </h1>
        <p className="text-gray-600 text-sm max-w-2xl">
          Treat yourself to authentic Sylhety dishes, wild Shatkora citrus stews, multi-layer teas, and forest tribal bamboo dinners. 100% organic and sourced from cooperative community growers.
        </p>
      </div>

      {/* Filter Toggle */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm flex items-center justify-between gap-4">
        <div className="text-left">
          <h4 className="text-xs font-bold text-emerald-950 uppercase font-mono">Sustainable Diets Only</h4>
          <p className="text-[10px] text-gray-500">Show only certified organic, zero-mile farms and tribal cooperative kitchens.</p>
        </div>
        
        <button
          onClick={() => setOrganicOnly(!organicOnly)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            organicOnly 
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/10" 
              : "bg-emerald-50 text-emerald-900 border border-emerald-100/50 hover:bg-emerald-100"
          }`}
        >
          {organicOnly ? "✓ Organic Only Engaged" : "Show All Kitchens"}
        </button>
      </div>

      {/* Spots Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpots.map((spot) => (
          <div 
            key={spot.id} 
            className="bg-white rounded-3xl border border-emerald-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left group"
          >
            <div>
              {/* Image Header */}
              <div className="relative aspect-[16/10] bg-emerald-50 overflow-hidden">
                <img 
                  src={spot.image} 
                  alt={spot.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-emerald-900/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-full font-mono">
                    {spot.category}
                  </span>
                </div>
                {spot.isOrganic && (
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white text-emerald-800 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm border border-emerald-50 font-mono">
                      🌱 100% Organic Farmed
                    </span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="bg-yellow-400 text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono flex items-center gap-1 shadow">
                    <Star className="w-3 h-3 fill-emerald-950" />
                    {spot.rating}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{spot.location}, Sylhet</span>
                </div>

                <h3 className="font-display font-extrabold text-lg text-emerald-950 group-hover:text-emerald-700 transition-colors">
                  {spot.title}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {spot.description}
                </p>

                {/* Specialty Banner */}
                <div className="bg-amber-50/50 border border-amber-100/50 rounded-2xl p-3 flex gap-2.5 items-start mt-2">
                  <Coffee className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-bold text-amber-950 uppercase font-mono">Signature Specialty</h4>
                    <p className="text-xs text-amber-900 font-semibold">{spot.specialty}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer pricing */}
            <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-b-3xl text-xs">
              <div>
                <span className="text-gray-400 font-bold uppercase font-mono text-[9px]">Price Category</span>
                <span className="block font-bold text-emerald-900 text-sm font-mono mt-0.5">
                  {spot.priceRange} (Approx. ৳৳)
                </span>
              </div>

              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg">
                {spot.badge}
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
