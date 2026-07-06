import React, { useState } from "react";
import { useDB } from "../DBContext";
import { LocalGuide } from "../types";
import { Star, MapPin, BadgeCheck, Award, Users, X } from "lucide-react";
import PaymentGateway from "./PaymentGateway";

export default function GuidesPage() {
  const { guides, addBooking, addGuide } = useDB(); 
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
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // 🔥 একদম নিখুঁত ফিল্টার: যে সব গাইডের ব্যাজ "Verified Local Guide" অথবা "SREDA Certified" (ডেমো ডাটা), শুধু তাদেরই দেখাবে।
  // নতুনরা ফর্ম সাবমিট করলে তাদের ব্যাজ থাকে "Eco Guide", তাই তারা রিভিউ বা ভেরিফাইড হওয়ার আগে এখানে শো করবে না!
  const filteredGuides = guides.filter(guide => {
    const isVerified = guide.badge === "Verified Local Guide" || guide.badge === "SREDA Certified";
    
    const matchesSearch = guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          guide.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          guide.location.toLowerCase().includes(searchTerm.toLowerCase());
    return isVerified && matchesSearch;
  });

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

  const handleBecomeGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // DBContext-এর নিয়ম অনুযায়ী অবজেক্ট পাঠানো হচ্ছে, ব্যাজ অটোমেটিক "Eco Guide" (Pending) হয়ে যাবে
    const guidePayload = {
      name: newGuideData.name,
      category: newGuideData.category,
      location: newGuideData.location,
      price: Number(newGuideData.price),
      languages: newGuideData.languages.split(",").map(lang => lang.trim()),
      description: newGuideData.description,
      image: newGuideData.image,
      experienceYears: 2
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
