import React, { useState } from "react";
import { useDB } from "../DBContext";
import { TransportRide } from "../types";
import { MapPin, Star, Shield, BatteryCharging, Filter, CheckCircle, Users } from "lucide-react";
import PaymentGateway from "./PaymentGateway";

export default function TransportPage() {
  const { transport: rides, addBooking } = useDB();
  const [fuelFilter, setFuelFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // Booking details
  const [selectedRide, setSelectedRide] = useState<TransportRide | null>(null);
  const [bookDate, setBookDate] = useState("");
  const [bookHoursOrDays, setBookHoursOrDays] = useState(1);
  const [bookSuccess, setBookSuccess] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  const locations = Array.from(new Set(rides.map(r => r.location)));
  const fuelTypes = Array.from(new Set(rides.map(r => r.fuelType)));

  const filteredRides = rides.filter(ride => {
    const matchesLoc = locationFilter === "all" || ride.location === locationFilter;
    const matchesFuel = fuelFilter === "all" || ride.fuelType === fuelFilter;
    return matchesLoc && matchesFuel;
  });

  const handleBookingInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookDate || !selectedRide) return;

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
    addBooking({
      serviceType: "Transport",
      itemName: selectedRide!.title,
      userDates: `${bookDate} (${bookHoursOrDays} day/trip)`,
      userBudget: selectedRide!.price * bookHoursOrDays,

      customerName: paymentInfo.customerName,
      customerPhone: paymentInfo.customerPhone,
      customerEmail: paymentInfo.customerEmail,
      paymentStatus: "Paid/Verifying",
      paymentMethod: paymentInfo.paymentMethod,
      transactionId: paymentInfo.transactionId,
      guestCount: paymentInfo.guestCount,
      specialNotes: paymentInfo.specialNotes,
    });

    setBookSuccess(true);
    setTimeout(() => {
      setBookSuccess(false);
      setSelectedRide(null);
      setBookDate("");
      setBookHoursOrDays(1);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="text-left space-y-3 border-b border-emerald-100 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100/50 rounded-full text-teal-800 text-xs font-semibold tracking-wide font-mono">
          <BatteryCharging className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
          ZERO EMISSION TRANSIT NETWORKS
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-emerald-950">
          Sustainable Rides & Waterway Cruises
        </h1>
        <p className="text-gray-600 text-sm max-w-2xl">
          Sail over the wetlands without petroleum runoff. Ride silent electric SUVs or peddle heavy-duty e-bikes. Each operator uses green energy or traditional manual oar configurations.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-gray-400 font-mono">
          <Filter className="w-3.5 h-3.5" />
          Quick Filters:
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

        {/* Fuel selector */}
        <select
          value={fuelFilter}
          onChange={(e) => setFuelFilter(e.target.value)}
          className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl px-3 py-2 text-xs font-semibold text-emerald-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="all">All Tech Types</option>
          {fuelTypes.map(fuel => (
            <option key={fuel} value={fuel}>{fuel}</option>
          ))}
        </select>
      </div>

      {/* Catalog Grid */}
      {filteredRides.length === 0 ? (
        <div className="text-center py-20 bg-emerald-50/10 rounded-3xl border border-dashed border-emerald-200">
          <p className="text-gray-500 text-sm font-semibold">No rides matching your search settings.</p>
          <button 
            onClick={() => { setLocationFilter("all"); setFuelFilter("all"); }}
            className="mt-3 text-xs text-emerald-600 font-bold hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRides.map((ride) => (
            <div 
              key={ride.id} 
              className="bg-white rounded-3xl border border-emerald-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group text-left"
            >
              <div>
                {/* Image Section */}
                <div className="relative aspect-[16/10] overflow-hidden bg-emerald-50">
                  <img 
                    src={ride.image} 
                    alt={ride.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-emerald-900/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase font-mono px-2 py-0.5 rounded-full">
                      {ride.fuelType}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-yellow-400 text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono flex items-center gap-1 shadow">
                      <Star className="w-3 h-3 fill-emerald-950" />
                      {ride.rating}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{ride.location}, Sylhet Hub</span>
                  </div>

                  <h3 className="font-display font-extrabold text-lg text-emerald-950">
                    {ride.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {ride.description}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Users className="w-3 h-3 text-emerald-600" />
                      Up to {ride.capacity} Passengers
                    </span>
                    <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      {ride.badge}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking & Price Footer */}
              <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-b-3xl">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold font-mono">
                    Estimated Rate
                  </span>
                  <span className="text-lg font-extrabold text-emerald-900 font-display">
                    ৳{ride.price.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-gray-500">/ block</span>
                  </span>
                </div>

                <button
                  onClick={() => setSelectedRide(ride)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/5 transition-all"
                >
                  Book Rental
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Booking Form Overlay */}
      {selectedRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] border border-emerald-100 max-w-md w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
            
            <div className="bg-gradient-to-r from-teal-800 to-emerald-800 p-6 text-white text-left">
              <span className="text-[10px] tracking-widest uppercase font-mono text-teal-300 font-extrabold block">
                Green Fleet Reservation
              </span>
              <h3 className="font-display font-bold text-xl leading-tight mt-1">
                {selectedRide.title}
              </h3>
              <p className="text-xs text-teal-100 mt-1">
                Technology: <strong>{selectedRide.fuelType}</strong> • Maximum Capacity: <strong>{selectedRide.capacity} people</strong>
              </p>
            </div>

            <div className="p-6 text-left">
              {bookSuccess ? (
                <div className="space-y-4 py-6 text-center animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="font-display font-bold text-lg text-emerald-950">
                    Fleet Dispatch Scheduled!
                  </h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                    Your sustainable ride booking has been synced with the Secure Admin Control Console. 
                  </p>
                  <p className="text-[10px] text-teal-700 font-bold font-mono bg-teal-50 px-3 py-1.5 rounded-xl inline-block">
                    CONFIRMED DISPATCH ID: TRAN-{Math.floor(100000 + Math.random() * 900000)}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingInitiate} className="space-y-4">
                  
                  {/* Dynamic Pricing Estimate */}
                  <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100/50 space-y-1 text-xs text-teal-950">
                    <div className="flex justify-between font-medium">
                      <span>Rate base:</span>
                      <span>৳{selectedRide.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Carbon offset credit:</span>
                      <span className="text-emerald-700 font-bold">100% Offset (Free)</span>
                    </div>
                    <div className="border-t border-teal-100 pt-1.5 flex justify-between font-bold text-emerald-950">
                      <span>Estimated Total:</span>
                      <span>৳{(selectedRide.price * bookHoursOrDays).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono">
                          Date Needed
                        </label>
                        <input
                          type="date"
                          required
                          value={bookDate}
                          onChange={(e) => setBookDate(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-medium focus:outline-none focus:ring-1 text-emerald-950 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono">
                          Duration (Blocks / Days)
                        </label>
                        <select
                          value={bookHoursOrDays}
                          onChange={(e) => setBookHoursOrDays(Number(e.target.value))}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-medium focus:outline-none focus:ring-1 text-emerald-950 font-semibold"
                        >
                          {[1, 2, 3, 4, 5, 7].map(d => (
                            <option key={d} value={d}>{d} {d === 1 ? 'Day / Block' : 'Days / Blocks'}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRide(null)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 text-center transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-md shadow-emerald-100 text-center transition-all cursor-pointer"
                    >
                      Verify & Pay ৳{(selectedRide.price * bookHoursOrDays).toLocaleString()}
                    </button>
                  </div>

                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* PAYMENT GATEWAY MODAL INTEGRATION */}
      {showPaymentGateway && selectedRide && (
        <PaymentGateway
          isOpen={showPaymentGateway}
          onClose={() => setShowPaymentGateway(false)}
          amount={selectedRide.price * bookHoursOrDays}
          itemName={selectedRide.title}
          serviceType="Transport"
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

    </div>
  );
}
