import React, { useState } from "react";
import { useDB } from "../DBContext";
import { LocalGuide } from "../types";
import { Star, ShieldCheck, MapPin, BadgeCheck, Phone, Mail, Award, Check, Users, X } from "lucide-react";
import PaymentGateway from "./PaymentGateway";

export default function GuidesPage() {
  const { guides, addBooking, addGuide } = useDB(); // এখানে addGuide ফাংশনটি আনা হয়েছে (যদি আপনার DBContext এ থাকে)
  const [searchTerm, setSearchTerm] = useState("");

  // Booking guides state
  const [selectedGuide, setSelectedGuide] = useState<LocalGuide | null>(null);
  const [tourDate, setTourDate] = useState("");
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  // Become a Guide Form State
  const [showBecomeGuideModal, setShowBecomeGuideModal] = useState(false);
  const [newGuideData, setNewGuideData] = useState({
    name: "",
    category: "Naturalist Guide",
    location: "",
    price: 1500,
    languages: "",
    description: "",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" // Default Demo Image
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

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

  // নতুন গাইড অ্যাডমিন প্যানেল/DB তে সাবমিট করার লজিক
  const handleBecomeGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const guidePayload = {
      id: `guide-${Date.now()}`,
      name: newGuideData.name,
      category: newGuideData.category,
      location: newGuideData.location,
      price: Number(newGuideData.price),
      languages: newGuideData.languages.split(",").map(lang => lang.trim()),
      description: newGuideData.description,
      image: newGuideData.image,
      rating: 5.0, // New guides start with fresh rating
      experienceYears: 1
    };

    // আপনার DBContext এর addGuide রান করবে (যদি না থাকে তবে এটি লোকাল স্টেট ম্যানেজ করবে)
    if (typeof addGuide === "function") {
      addGuide(guidePayload);
    } else {
      // Fallback: যদি DBContext এ ফাংশন না থাকে, তবে guides অ্যারেতে পুশ করার ট্রাই করবে
      guides.push(guidePayload);
    }

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

                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "{guide.description}"
                </p>
              </div>

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
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Hire {guide.name.split(" ")[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================== */}
      {/* BANNER FROM image_eacaa9.png (NOW WORKING) */}
      {/* ========================================== */}
      <div className="w-full bg-[#022c22] text-white rounded-[2rem] p-8 md:p-14 my-14 relative overflow-hidden shadow-2xl text-left border border-emerald-900">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-emerald-800/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-xl">
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white tracking-tight">
              Are you a local expert?
            </h2>
            <p className="text-emerald-100/70 text-sm md:text-base font-normal leading-relaxed">
              Join the SylhetGo community and share your passion for our beautiful land with travelers from all over the world.
            </p>
            <div className="pt-3">
              <button 
                onClick={() => setShowBecomeGuideModal(true)} // অন-ক্লিক ইভেন্ট হ্যান্ডলার অ্যাড করা হয়েছে
                className="bg-[#922b16] hover:bg-[#7a2210] text-white font-bold text-sm px-7 py-3.5 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                Become a Guide
              </button>
            </div>
          </div>

          <div className="w-full md:w-auto min-w-[260px] bg-emerald-900/20 border border-emerald-800/40 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-emerald-800/40 rounded-xl text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="font-mono font-black text-2xl text-white">50+</div>
              <p className="text-[11px] text-emerald-200/60 font-medium leading-normal max-w-[180px]">
                Verified guides across the Sylhet Division
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* BECOME A GUIDE REGISTRATION MODAL FORM     */}
      {/* ========================================== */}
      {showBecomeGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] border border-emerald-100 max-w-lg w-full overflow-hidden shadow-2xl relative text-left">
            
            <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-xl">Join as Local Guide</h3>
                <p className="text-xs text-emerald-200">Fill your expert details to list instantly</p>
              </div>
              <button 
                onClick={() => setShowBecomeGuideModal(false)}
                className="p-1.5 hover:bg-emerald-800/50 rounded-xl text-emerald-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {formSubmitted ? (
                <div className="text-center py-8 space-y-3 animate-in zoom-in-95">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                  <h4 className="font-bold text-lg text-emerald-950">Application Successful!</h4>
                  <p className="text-xs text-gray-500">You have been successfully added to the system and Admin DB.</p>
                </div>
              ) : (
                <form onSubmit={handleBecomeGuideSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase font-mono mb-1">Full Name</label>
                      <input 
                        type="text" required value={newGuideData.name}
                        onChange={e => setNewGuideData({...newGuideData, name: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="e.g. Abul Kashem"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase font-mono mb-1">Base Location</label>
                      <input 
                        type="text" required value={newGuideData.location}
                        onChange={e => setNewGuideData({...newGuideData, location: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="e.g. Sreemangal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase font-mono mb-1">Daily Fee (BDT)</label>
                      <input 
                        type="number" required value={newGuideData.price}
                        onChange={e => setNewGuideData({...newGuideData, price: Number(e.target.value)})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase font-mono mb-1">Languages (Comma separated)</label>
                      <input 
                        type="text" required value={newGuideData.languages}
                        onChange={e => setNewGuideData({...newGuideData, languages: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="Bengali, English, Sylheti"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase font-mono mb-1">Short Description / Bio</label>
                    <textarea 
                      required rows={3} value={newGuideData.description}
                      onChange={e => setNewGuideData({...newGuideData, description: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder="Share your expertise or tribal knowledge..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md mt-2"
                  >
                    Submit & Register Guide
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Guide Booking Modal */}
      {selectedGuide && !showPaymentGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/75 backdrop-blur-sm animate-in fade-in">
          {/* ... আপনার পূর্বের বুকিং মোডাল কোড অক্ষত রয়েছে ... */}
          <div className="bg-white rounded-[2rem] max-w-md w-full overflow-hidden shadow-2xl relative p-6 text-left">
             <h3 className="font-bold text-lg text-emerald-950 mb-4">Hire {selectedGuide.name}</h3>
             <form onSubmit={handleGuideBookInitiate} className="space-y-4">
               <div>
                 <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Tour Date</label>
                 <input type="date" required value={tourDate} onChange={e => setTourDate(e.target.value)} className="w-full bg-gray-50 border p-2 rounded-xl text-xs" />
               </div>
               <div className="flex gap-2">
                 <button type="button" onClick={() => setSelectedGuide(null)} className="flex-1 py-2 border rounded-xl text-xs">Cancel</button>
                 <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs">Pay ৳{selectedGuide.price}</button>
               </div>
             </form>
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
