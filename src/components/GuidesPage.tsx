import React, { useState } from "react";
import { useDB } from "../DBContext";
import { LocalGuide } from "../types";
import { Star, ShieldCheck, MapPin, BadgeCheck, Phone, Mail, Award, Check } from "lucide-react";
import PaymentGateway from "./PaymentGateway";

export default function GuidesPage() {
  const { guides, addBooking } = useDB();
  const [searchTerm, setSearchTerm] = useState("");

  // Booking guides state
  const [selectedGuide, setSelectedGuide] = useState<LocalGuide | null>(null);
  const [tourDate, setTourDate] = useState("");
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  const filteredGuides = guides.filter(guide => 
    guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGuideBookInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourDate || !selectedGuide) return;

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
      serviceType: "Guide",
      itemName: selectedGuide!.name,
      userDates: `${tourDate} (Day tour)`,
      userBudget: selectedGuide!.price,

      customerName: paymentInfo.customerName,
      customerPhone: paymentInfo.customerPhone,
      customerEmail: paymentInfo.customerEmail,
      paymentStatus: "Paid/Verifying",
      paymentMethod: paymentInfo.paymentMethod,
      transactionId: paymentInfo.transactionId,
      guestCount: paymentInfo.guestCount,
      specialNotes: paymentInfo.specialNotes,
    });

    setBookingCompleted(true);
    setTimeout(() => {
      setBookingCompleted(false);
      setSelectedGuide(null);
      setTourDate("");
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="text-left space-y-3 border-b border-emerald-100 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100/60 rounded-full text-emerald-950 text-xs font-semibold tracking-wide font-mono">
          <Award className="w-3.5 h-3.5 text-yellow-600" />
          COMMUNITY-EMPOWERED NATURALISTS
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-emerald-950">
          Certified Naturalist Guides
        </h1>
        <p className="text-gray-600 text-sm max-w-2xl">
          Sylhet's swamps and tea canopies are best narrated by the people who call them home. Our guides are rigorously trained in Leave-No-Trace codes, wilderness rescue, and tribal folklore.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search guides by name, location (e.g. Ratargul, Sreemangal), or specialties..."
          className="w-full bg-emerald-50/20 border border-emerald-100/60 rounded-xl px-4 py-2.5 text-sm text-emerald-950 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
        />
      </div>

      {/* Guides Grid */}
      {filteredGuides.length === 0 ? (
        <div className="text-center py-20 bg-emerald-50/10 rounded-3xl border border-dashed border-emerald-200">
          <p className="text-gray-500 text-sm font-semibold">No certified naturalists found matching "{searchTerm}".</p>
          <button 
            onClick={() => setSearchTerm("")}
            className="mt-3 text-xs text-emerald-600 font-bold hover:underline"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <div 
              key={guide.id} 
              className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left group"
            >
              <div className="space-y-4">
                
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-emerald-50 border border-emerald-100 flex-shrink-0">
                    <img 
                      src={guide.image} 
                      alt={guide.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-display font-bold text-base text-emerald-950">
                        {guide.name}
                      </h3>
                      <BadgeCheck className="w-4 h-4 text-emerald-600 fill-emerald-100 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-emerald-700 font-semibold font-mono">
                      {guide.category}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="bg-yellow-400 text-emerald-950 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-emerald-950" />
                        {guide.rating}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium font-mono">
                        ({guide.experienceYears} Years Experience)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Locations and Languages */}
                <div className="space-y-2 pt-2 border-t border-gray-50 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="font-medium">Specializes in {guide.location}, Sylhet</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {guide.languages.map((lang, idx) => (
                      <span key={idx} className="bg-emerald-50 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bio Description */}
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "{guide.description}"
                </p>

              </div>

              {/* Price & Book action */}
              <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold font-mono">
                    Daily Guiding Fee
                  </span>
                  <span className="text-base font-extrabold text-emerald-950 font-display">
                    ৳{guide.price.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-gray-500">/ day</span>
                  </span>
                </div>

                <button
                  onClick={() => setSelectedGuide(guide)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/5"
                >
                  Hire {guide.name.split(" ")[0]}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Guide Booking Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] border border-emerald-100 max-w-md w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
            
            <div className="bg-gradient-to-r from-emerald-800 to-teal-700 p-6 text-white text-left">
              <span className="text-[10px] tracking-widest uppercase font-mono text-teal-300 font-extrabold block">
                Direct Naturalist Booking
              </span>
              <h3 className="font-display font-bold text-xl leading-tight mt-1">
                Hire {selectedGuide.name}
              </h3>
              <p className="text-xs text-teal-100 mt-1">
                Specialty: <strong>{selectedGuide.category}</strong> • Base: <strong>{selectedGuide.location}</strong>
              </p>
            </div>

            <div className="p-6 text-left">
              {bookingCompleted ? (
                <div className="space-y-4 py-6 text-center animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="font-display font-bold text-lg text-emerald-950">
                    Guide Booking Request Logged!
                  </h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                    Your secure guiding transaction has been captured and routed to the Secure Admin Console.
                  </p>
                  <p className="text-[10px] text-teal-700 font-mono bg-teal-50 px-3 py-1.5 rounded-xl inline-block font-bold">
                    GUIDING ID: GD-{Math.floor(100000 + Math.random() * 900000)}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleGuideBookInitiate} className="space-y-4">
                  
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 text-xs text-emerald-950 space-y-1">
                    <div className="flex justify-between">
                      <span>Daily Professional Fee:</span>
                      <span className="font-bold">৳{selectedGuide.price.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 italic mt-1 leading-normal">
                      Note: Guiding fees are paid directly to the guide in full. 100% of the proceeds goes to supporting local tribal livelihood preservation.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono">
                        Tour Date
                      </label>
                      <input
                        type="date"
                        required
                        value={tourDate}
                        onChange={(e) => setTourDate(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-medium focus:outline-none focus:ring-1 text-emerald-950 font-mono"
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedGuide(null)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 text-center transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-md shadow-emerald-100 text-center transition-all cursor-pointer"
                    >
                      Verify & Pay ৳{selectedGuide.price.toLocaleString()}
                    </button>
                  </div>

                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* PAYMENT GATEWAY MODAL INTEGRATION */}
      {showPaymentGateway && selectedGuide && (
        <PaymentGateway
          isOpen={showPaymentGateway}
          onClose={() => setShowPaymentGateway(false)}
          amount={selectedGuide.price}
          itemName={selectedGuide.name}
          serviceType="Guide"
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

    </div>
  );
}
      userBudget: selectedGuide!.price,
      customerName: paymentInfo.customerName,
      customerPhone: paymentInfo.customerPhone,
      customerEmail: paymentInfo.customerEmail,
      paymentStatus: "Paid/Verifying",
      paymentMethod: paymentInfo.paymentMethod,
      transactionId: paymentInfo.transactionId,
      guestCount: paymentInfo.guestCount,
      specialNotes: paymentInfo.specialNotes,
    });

    setBookingCompleted(true);
    setTimeout(() => {
      setBookingCompleted(false);
      setSelectedGuide(null);
      setTourDate("");
    }, 2500);
  };

  const handleBecomeGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // নতুন ফর্ম সাবমিট করলে ডিফল্ট ব্যাজ "Unverified" হিসেবে যাবে, যা অ্যাডমিন প্যানেলে দেখাবে
    const guidePayload = {
      name: newGuideData.name,
      category: newGuideData.category,
      location: newGuideData.location,
      price: Number(newGuideData.price),
      languages: newGuideData.languages.split(",").map(lang => lang.trim()),
      description: newGuideData.description,
      image: newGuideData.image,
      experienceYears: 2,
      badge: "Unverified", // শুরুতে আন-ভেরিফাইড থাকবে
      isVerified: false
    };

    try {
      addGuide(guidePayload);
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setShowBecomeGuideModal(false);
        setNewGuideData({
          name: "",
          category: "Naturalist Guide",
          location: "",
          price: 1500,
          languages: "",
          description: "",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
        });
      }, 2000);
    } catch (error) {
      console.error("Failed to add guide:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Header */}
      <div className="space-y-3 border-b border-emerald-100 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100/60 rounded-full text-emerald-950 text-xs font-semibold tracking-wide font-mono">
          <Award className="w-3.5 h-3.5 text-yellow-600" />
          COMMUNITY-EMPOWERED NATURALISTS
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-emerald-950">Certified Naturalist Guides</h1>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search verified guides..."
          className="w-full bg-emerald-50/20 border border-emerald-100/60 rounded-xl px-4 py-2.5 text-sm"
        />
      </div>

      {/* Grid */}
      {filteredGuides.length === 0 ? (
        <div className="text-center py-20 bg-emerald-50/10 rounded-3xl border border-dashed border-emerald-200">
          <p className="text-gray-500 text-sm">No verified guides available right now.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <div key={guide.id} className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img src={guide.image} alt={guide.name} className="w-16 h-16 rounded-2xl object-cover bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold text-base text-emerald-950">{guide.name}</h3>
                      <BadgeCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    </div>
                    <p className="text-xs text-emerald-700 font-mono">{guide.category}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="bg-yellow-400 text-emerald-950 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">★ {guide.rating || 5.0}</span>
                      <span className="ml-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{guide.badge}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t text-xs text-gray-500">
                  <p><MapPin className="w-3.5 h-3.5 inline mr-1 text-emerald-500" /> {guide.location}</p>
                </div>
                <p className="text-xs text-gray-600 italic">"{guide.description}"</p>
              </div>
              <div className="pt-5 mt-5 border-t flex items-center justify-between">
                <div>
                  <span className="block text-[9px] uppercase text-gray-400 font-bold">Daily Fee</span>
                  <span className="text-base font-extrabold text-emerald-950">৳{guide.price}</span>
                </div>
                <button onClick={() => setSelectedGuide(guide)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Hire</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Become a Guide Banner */}
      <div className="w-full bg-[#022c22] text-white rounded-[2rem] p-8 md:p-14 my-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <h2 className="font-extrabold text-3xl text-white">Are you a local expert?</h2>
            <p className="text-emerald-100/70 text-sm">Join us. Your profile will be reviewed by the admin panel before going live.</p>
            <button onClick={() => setShowBecomeGuideModal(true)} className="bg-[#922b16] hover:bg-[#7a2210] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all">
              Become a Guide
            </button>
          </div>
          <div className="bg-emerald-900/20 border border-emerald-800 rounded-2xl p-6 text-center">
            <Users className="w-6 h-6 mx-auto text-emerald-400 mb-2" />
            <div className="font-black text-xl">Verification Desk Active</div>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {showBecomeGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] border max-w-lg w-full overflow-hidden text-left">
            <div className="bg-emerald-900 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Join as Local Guide</h3>
                <p className="text-xs text-emerald-200">Requires Admin Approval</p>
              </div>
              <button onClick={() => setShowBecomeGuideModal(false)} className="text-emerald-200"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              {formSubmitted ? (
                <div className="text-center py-8 space-y-2">
                  <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto font-bold">✓</div>
                  <h4 className="font-bold text-emerald-950">Submitted for Review!</h4>
                  <p className="text-xs text-gray-500">Your profile will show up on the main page as soon as an admin approves it.</p>
                </div>
              ) : (
                <form onSubmit={handleBecomeGuideSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name" required value={newGuideData.name} onChange={e => setNewGuideData({...newGuideData, name: e.target.value})} className="border p-2 rounded-xl text-xs" />
                    <input type="text" placeholder="Location" required value={newGuideData.location} onChange={e => setNewGuideData({...newGuideData, location: e.target.value})} className="border p-2 rounded-xl text-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Daily Fee" required value={newGuideData.price} onChange={e => setNewGuideData({...newGuideData, price: Number(e.target.value)})} className="border p-2 rounded-xl text-xs" />
                    <input type="text" placeholder="Languages (e.g. Bangla, English)" required value={newGuideData.languages} onChange={e => setNewGuideData({...newGuideData, languages: e.target.value})} className="border p-2 rounded-xl text-xs" />
                  </div>
                  <textarea placeholder="Short Bio/Experience..." required rows={3} value={newGuideData.description} onChange={e => setNewGuideData({...newGuideData, description: e.target.value})} className="w-full border p-2 rounded-xl text-xs" />
                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold text-xs py-3 rounded-xl shadow-md">
                    Submit Profile for Review
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Guide Booking Modal */}
      {selectedGuide && !showPaymentGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/75 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-6">
             <h3 className="font-bold text-emerald-950 mb-4">Hire {selectedGuide.name}</h3>
             <form onSubmit={handleGuideBookInitiate} className="space-y-4">
               <input type="date" required value={tourDate} onChange={e => setTourDate(e.target.value)} className="w-full border p-2 rounded-xl text-xs" />
               <div className="flex gap-2">
                 <button type="button" onClick={() => setSelectedGuide(null)} className="flex-1 py-2 border rounded-xl text-xs">Cancel</button>
                 <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs">Pay ৳{selectedGuide.price}</button>
               </div>
             </form>
          </div>
        </div>
      )}

      {/* Payment Gateway */}
      {showPaymentGateway && selectedGuide && (
        <PaymentGateway isOpen={showPaymentGateway} onClose={() => setShowPaymentGateway(false)} amount={selectedGuide.price} itemName={selectedGuide.name} serviceType="Guide" onPaymentSuccess={handlePaymentSuccess} />
      )}

    </div>
  );
}
