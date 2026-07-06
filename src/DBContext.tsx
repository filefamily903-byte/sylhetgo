import React, { useState } from "react";
import { useDB } from "../DBContext";
import { LocalGuide } from "../types";
import { Star, ShieldCheck, MapPin, BadgeCheck, Phone, Mail, Award, Check, Users, X } from "lucide-react";
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

  // CRITICAL FIX: শুধুমাত্র ভেরিফাইড গাইডদের ফিল্টার করে পেজে দেখানো হবে
  const filteredGuides = guides.filter(guide => {
    const isVerified = guide.badge === "Verified Local Guide";
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
    
    // নতুন অ্যাপ্লিকেশনের ব্যাজ ডিফল্ট "Eco Guide" (Unverified) থাকবে
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
          placeholder="Search verified guides by name, location..."
          className="w-full bg-emerald-50/20 border border-emerald-100/60 rounded-xl px-4 py-2.5 text-sm text-emerald-950 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
        />
      </div>

      {/* Guides Grid */}
      {filteredGuides.length === 0 ? (
        <div className="text-center py-20 bg-emerald-50/10 rounded-3xl border border-dashed border-emerald-200">
          <p className="text-gray-500 text-sm font-semibold">No verified naturalists found matching "{searchTerm}".</p>
          <button onClick={() => setSearchTerm("")} className="mt-3 text-xs text-emerald-600 font-bold hover:underline">
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-
