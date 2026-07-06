import React, { useState } from "react";
import { useDB } from "../DBContext";
import { EcoStay } from "../types";
import { MapPin, Star, Sparkles, Filter, ShieldCheck, Check, CalendarDays, ArrowUpDown } from "lucide-react";
import PaymentGateway from "./PaymentGateway";

export default function StaysPage() {
  const { stays, addBooking } = useDB();
  const [locationFilter, setLocationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");

  // Booking states
  const [selectedStay, setSelectedStay] = useState<EcoStay | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingNights, setBookingNights] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  const locations = Array.from(new Set(stays.map(s => s.location)));
  const categories = Array.from(new Set(stays.map(s => s.category)));

  // Filter and Sort stays
  const filteredStays = stays
    .filter(stay => {
      const matchLoc = locationFilter === "all" || stay.location === locationFilter;
      const matchCat = categoryFilter === "all" || stay.category === categoryFilter;
      return matchLoc && matchCat;
    })
    .sort((a, b) => {
      if (priceSort === "asc") return a.price - b.price;
      if (priceSort === "desc") return b.price - a.price;
      return 0;
    });

  const handleBookInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !selectedStay) return;
    
    // Open payment gateway
    setShowPaymentGateway(true);
  };

  const handlePaymentSuccess = (paymentInfo: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    paymentMethod: "bKash" | "Nagad" | "SSLCommerz/Card";
    transactionId: string;
    guestCount: number;
    specialNotes: string;
  }) => {
    // Record actual booking in persistent database with all details
    addBooking({
      serviceType: "Stay",
      itemName: selectedStay!.title,
      userDates: `${bookingDate} (${bookingNights} night${bookingNights > 1 ? 's' : ''})`,
      userBudget: selectedStay!.price * bookingNights,
      
      customerName: paymentInfo.customerName,
      customerPhone: paymentInfo.customerPhone,
      customerEmail: paymentInfo.customerEmail,
      paymentStatus: "Paid/Verifying",
      paymentMethod: paymentInfo.paymentMethod,
      transactionId: paymentInfo.transactionId,
      guestCount: paymentInfo.guestCount,
      specialNotes: paymentInfo.specialNotes,
    });

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedStay(null);
      setBookingDate("");
      setBookingNights(1);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="text-left space-y-3 border-b border-emerald-100 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/50 rounded-full text-emerald-800 text-xs font-semibold tracking-wide font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          CARBON-BALANCED SANCTUARIES
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-emerald-950">
          Eco-Lodges & Boutique Stays
        </h1>
        <p className="text-gray-600 text-sm max-w-2xl">
          Rest easy knowing 10% of all lodging fees go directly to native swamp reforestation initiatives. Fully vetted for plastic-free, water-wise, and solar-power practices.
        </p>
      </div>

      {/* Control Bar: Filters & Sorting */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-400 font-mono">
            <Filter className="w-3.5 h-3.5" />
            Filter By:
          </div>
          
          {/* Location selector */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl px-3 py-2 text-xs font-semibold text-emerald-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Category selector */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl px-3 py-2 text-xs font-semibold text-emerald-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Stay Types</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase text-gray-400 font-mono flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort Price:
          </span>
          <div className="flex bg-emerald-50/50 rounded-xl p-0.5 border border-emerald-100/50">
            <button
              onClick={() => setPriceSort("none")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                priceSort === "none" ? "bg-white text-emerald-900 shadow-sm" : "text-gray-500"
              }`}
            >
              Default
            </button>
            <button
              onClick={() => setPriceSort("asc")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                priceSort === "asc" ? "bg-white text-emerald-900 shadow-sm" : "text-gray-500"
              }`}
            >
              Low-High
            </button>
            <button
              onClick={() => setPriceSort("desc")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                priceSort === "desc" ? "bg-white text-emerald-900 shadow-sm" : "text-gray-500"
              }`}
            >
              High-Low
            </button>
          </div>
        </div>

      </div>

      {/* Grid of Stays */}
      {filteredStays.length === 0 ? (
        <div className="text-center py-20 bg-emerald-50/10 rounded-3xl border border-dashed border-emerald-200">
          <p className="text-gray-500 text-sm font-semibold">No eco-stays match your filter selections.</p>
          <button 
            onClick={() => { setLocationFilter("all"); setCategoryFilter("all"); setPriceSort("none"); }}
            className="mt-3 text-xs text-emerald-600 font-bold hover:underline"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStays.map((stay) => (
            <div 
              key={stay.id} 
              className="bg-white rounded-3xl border border-emerald-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              {/* Image with badges */}
              <div className="relative aspect-[4/3] overflow-hidden bg-emerald-100">
                <img 
                  src={stay.image} 
                  alt={stay.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="bg-emerald-900/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase font-mono px-2.5 py-1 rounded-full shadow-sm">
                    {stay.category}
                  </span>
                  <span className="bg-yellow-400 text-emerald-950 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm font-mono flex items-center gap-1">
                    <Star className="w-3 h-3 fill-emerald-950 text-emerald-950" />
                    {stay.rating}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4">
                  <span className="bg-white/95 text-emerald-900 text-[10px] font-extrabold uppercase font-mono px-2 py-0.5 rounded shadow">
                    {stay.badge}
                  </span>
                </div>
              </div>

              {/* Card details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{stay.location}, Sylhet</span>
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-emerald-950 group-hover:text-emerald-700 transition-colors">
                    {stay.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {stay.description}
                  </p>

                  {/* Amenities checklist */}
                  <div className="pt-2">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                      {stay.features.slice(0, 4).map((feat, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-medium truncate">
                          <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pricing & Booking action */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold font-mono">
                      Nightly Rate
                    </span>
                    <span className="text-lg font-extrabold text-emerald-900 font-display">
                      ৳{stay.price.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-gray-500">/ night</span>
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedStay(stay)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/10 transition-all transform hover:-translate-y-0.5"
                  >
                    Reserve Stay
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Dedicated Booking Modal */}
      {selectedStay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] border border-emerald-100 max-w-md w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-700 p-6 text-white text-left">
              <span className="text-[10px] tracking-widest uppercase font-mono text-teal-300 font-extrabold block">
                Direct-To-Local Booking Engine
              </span>
              <h3 className="font-display font-bold text-xl leading-tight mt-1">
                {selectedStay.title}
              </h3>
              <p className="text-xs text-teal-100 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {selectedStay.location}, Sylhet
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-left">
              {bookingSuccess ? (
                <div className="space-y-4 py-6 text-center animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="font-display font-bold text-lg text-emerald-950">
                    Eco-Stay Booking Logged!
                  </h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                    Your secure checkout was complete. Eco-conservation fund payment has been registered and synced with the Secure Admin Control Console.
                  </p>
                  <p className="text-[10px] text-teal-600 font-bold font-mono">
                    ALLOCATED CODE: SG-{Math.floor(100000 + Math.random() * 900000)}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookInitiate} className="space-y-4">
                  
                  {/* Summary math */}
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 space-y-1.5 text-xs text-emerald-950 font-medium">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nightly Rate:</span>
                      <span>৳{selectedStay.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Swamp Conservation Levy (10%):</span>
                      <span className="text-emerald-700 font-bold">+ ৳{(selectedStay.price * 0.1).toFixed(0)}</span>
                    </div>
                    <div className="border-t border-emerald-100 pt-1.5 flex justify-between font-bold">
                      <span>Subtotal Rate:</span>
                      <span>৳{(selectedStay.price * bookingNights).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono">
                          Arrival Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            required
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white text-emerald-950 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono">
                          Nights Count
                        </label>
                        <select
                          value={bookingNights}
                          onChange={(e) => setBookingNights(Number(e.target.value))}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white text-emerald-950 font-semibold"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 10, 14].map(n => (
                            <option key={n} value={n}>{n} {n === 1 ? 'Night' : 'Nights'}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="pt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedStay(null)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 text-center transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-md shadow-emerald-100 text-center transition-all cursor-pointer"
                    >
                      Verify & Pay ৳{(selectedStay.price * bookingNights).toLocaleString()}
                    </button>
                  </div>

                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* PAYMENT GATEWAY MODAL INTEGRATION */}
      {showPaymentGateway && selectedStay && (
        <PaymentGateway
          isOpen={showPaymentGateway}
          onClose={() => setShowPaymentGateway(false)}
          amount={selectedStay.price * bookingNights}
          itemName={selectedStay.title}
          serviceType="Stay"
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

    </div>
  );
}
