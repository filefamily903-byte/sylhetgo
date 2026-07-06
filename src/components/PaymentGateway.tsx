import React, { useState } from "react";
import { CreditCard, Check, ShieldCheck, ArrowRight, Smartphone, Phone, Mail, User, Users, FileText, AlertCircle, Sparkles } from "lucide-react";

interface PaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  itemName: string;
  serviceType: "Stay" | "Transport" | "Guide";
  onPaymentSuccess: (paymentInfo: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    paymentMethod: "bKash" | "Nagad" | "SSLCommerz/Card";
    transactionId: string;
    guestCount: number;
    specialNotes: string;
  }) => void;
}

type Step = "customer_info" | "payment_method" | "payment_simulation";

export default function PaymentGateway({
  isOpen,
  onClose,
  amount,
  itemName,
  serviceType,
  onPaymentSuccess,
}: PaymentGatewayProps) {
  const [step, setStep] = useState<Step>("customer_info");
  
  const bkashNumber = localStorage.getItem("sylhetgo_bkash_number") || "+8801700-SYLHET";
  const bkashType = localStorage.getItem("sylhetgo_bkash_type") || "Merchant";
  
  // Customer details state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [specialNotes, setSpecialNotes] = useState("");
  const [formError, setFormError] = useState("");

  // Payment method state
  const [selectedMethod, setSelectedMethod] = useState<"bKash" | "Nagad" | "SSLCommerz/Card">("bKash");
  
  // Transaction details
  const [transactionId, setTransactionId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);

  if (!isOpen) return null;

  // Form Validation for Step 1
  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError("Full Name is required.");
      return;
    }
    if (!customerPhone.trim()) {
      setFormError("Phone Number is required.");
      return;
    }
    const phoneRegex = /^(?:\+88|01)?\d{11}$/;
    if (!phoneRegex.test(customerPhone.trim().replace(/\s+/g, ""))) {
      setFormError("Please enter a valid 11-digit Bangladeshi phone number.");
      return;
    }
    if (!customerEmail.trim()) {
      setFormError("Email Address is required.");
      return;
    }
    if (guestCount < 1) {
      setFormError("Guest count must be at least 1.");
      return;
    }
    
    setFormError("");
    setStep("payment_method");
  };

  // Generate a random transaction ID based on method
  const handleAutoSimulate = () => {
    const prefix = selectedMethod === "bKash" ? "BK" : selectedMethod === "Nagad" ? "NG" : "SSL";
    const rand = Math.floor(10000000 + Math.random() * 90000000);
    setTransactionId(`${prefix}${rand}S`);
  };

  // Finalize booking with payments
  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setFormError("Transaction ID (TxnID) is required for verification.");
      return;
    }

    setIsVerifying(true);
    setFormError("");

    // Simulate merchant verification call
    setTimeout(() => {
      setIsVerifying(false);
      setVerifySuccess(true);
      
      // Delay before submitting to state and closing
      setTimeout(() => {
        onPaymentSuccess({
          customerName,
          customerPhone,
          customerEmail,
          paymentMethod: selectedMethod,
          transactionId: transactionId.trim().toUpperCase(),
          guestCount,
          specialNotes,
        });
        resetState();
        onClose();
      }, 1500);
    }, 1200);
  };

  const resetState = () => {
    setStep("customer_info");
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setGuestCount(1);
    setSpecialNotes("");
    setTransactionId("");
    setSelectedMethod("bKash");
    setVerifySuccess(false);
    setIsVerifying(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] border border-emerald-100 max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white p-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base tracking-wide uppercase">SylhetGo Secure Checkout</h3>
              <p className="text-[10px] text-emerald-300/80 tracking-wider uppercase font-mono font-bold">100% Secure SSL Encrypted Gateway</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetState();
              onClose();
            }}
            className="absolute top-6 right-6 text-emerald-300/60 hover:text-white transition-colors cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Amount bar */}
        <div className="bg-emerald-50 px-6 py-3 border-b border-emerald-100/50 flex justify-between items-center text-xs">
          <div>
            <span className="text-gray-400 font-bold uppercase text-[9px] font-mono block">Paying For</span>
            <span className="text-emerald-950 font-semibold">{serviceType}: {itemName}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 font-bold uppercase text-[9px] font-mono block">Total Amount</span>
            <span className="text-emerald-900 font-bold font-mono text-base">৳{amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-4 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider font-mono text-gray-400 border-b border-gray-50 pb-2">
          <span className={step === "customer_info" ? "text-emerald-600 font-bold" : ""}>1. Traveler Details</span>
          <ArrowRight className="w-3 h-3 text-gray-300" />
          <span className={step === "payment_method" ? "text-emerald-600 font-bold" : ""}>2. Payment Method</span>
          <ArrowRight className="w-3 h-3 text-gray-300" />
          <span className={step === "payment_simulation" ? "text-emerald-600 font-bold" : ""}>3. Pay & Verify</span>
        </div>

        {/* Scrollable content */}
        <div className="p-6 overflow-y-auto flex-1">
          {formError && (
            <div className="mb-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* STEP 1: CUSTOMER INFO */}
          {step === "customer_info" && (
            <form onSubmit={handleNextToPayment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono tracking-wider flex items-center gap-1">
                    <User className="w-3 h-3 text-emerald-600" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white text-emerald-950"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono tracking-wider flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-600" /> Phone Number (11-digit)
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white font-mono text-emerald-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono tracking-wider flex items-center gap-1">
                    <Mail className="w-3 h-3 text-emerald-600" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white font-mono text-emerald-950"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono tracking-wider flex items-center gap-1">
                    <Users className="w-3 h-3 text-emerald-600" /> Travelers Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white text-emerald-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono tracking-wider flex items-center gap-1">
                  <FileText className="w-3 h-3 text-emerald-600" /> Special Eco-Requests & Notes (Optional)
                </label>
                <textarea
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Guide needs Sylheti language expertise, solar power plug, non-plastic preferences..."
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white text-emerald-950"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-emerald-950 hover:bg-emerald-900 text-white font-display font-extrabold text-xs tracking-wider uppercase px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Select Payment Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === "payment_method" && (
            <div className="space-y-6">
              <p className="text-xs text-gray-500 leading-relaxed">
                Choose a trusted local or international gateway option to settle your green reservation instantly. 
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* bKash */}
                <button
                  onClick={() => setSelectedMethod("bKash")}
                  className={`border-2 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedMethod === "bKash"
                      ? "border-pink-500 bg-pink-50/50 shadow-md"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm tracking-tighter">
                    bK
                  </div>
                  <span className="text-xs font-bold text-gray-800">bKash</span>
                  <span className="text-[9px] text-pink-600 font-bold uppercase font-mono tracking-wide">Instant Pay</span>
                </button>

                {/* Nagad */}
                <button
                  onClick={() => setSelectedMethod("Nagad")}
                  className={`border-2 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedMethod === "Nagad"
                      ? "border-orange-500 bg-orange-50/50 shadow-md"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                    ৳
                  </div>
                  <span className="text-xs font-bold text-gray-800">Nagad</span>
                  <span className="text-[9px] text-orange-600 font-bold uppercase font-mono tracking-wide">Charge Free</span>
                </button>

                {/* SSLCommerz */}
                <button
                  onClick={() => setSelectedMethod("SSLCommerz/Card")}
                  className={`border-2 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedMethod === "SSLCommerz/Card"
                      ? "border-blue-500 bg-blue-50/50 shadow-md"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-gray-800">Cards/SSL</span>
                  <span className="text-[9px] text-blue-600 font-bold uppercase font-mono tracking-wide">Visa/Master</span>
                </button>
              </div>

              {/* API Integration Notice (Clean Comments/Dev info for future-proofing) */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-[10px] text-gray-500 space-y-2 leading-relaxed">
                <div className="flex items-center gap-1 text-emerald-950 font-bold uppercase tracking-wider font-mono">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> Merchant sandbox integration framework
                </div>
                <p>
                  {selectedMethod === "bKash" && "bKash Tokenized Checkout API will load the active bKash iframe, initiating mobile OTP authentication & automated wallet verification."}
                  {selectedMethod === "Nagad" && "Nagad PG Direct Payment v2.3 endpoint provides fully automated server-to-server transaction status queries with refund callbacks."}
                  {selectedMethod === "SSLCommerz/Card" && "SSLCommerz Sandbox API will redirect users to secure payment pages supporting all commercial banks, VISA, and MasterCard."}
                </p>
                <div className="text-[9px] text-gray-400 border-t border-dashed border-gray-200 pt-1.5">
                  Production endpoint hook: <span className="font-mono bg-white px-1 py-0.5 rounded border border-gray-100 text-emerald-800">POST /api/payment/initiate</span>
                </div>
              </div>

              <div className="flex gap-3 justify-between">
                <button
                  type="button"
                  onClick={() => setStep("customer_info")}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("payment_simulation")}
                  className="bg-emerald-950 hover:bg-emerald-900 text-white font-display font-extrabold text-xs tracking-wider uppercase px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Proceed to Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT SIMULATION / MANUAL TXN ID ENTRY */}
          {step === "payment_simulation" && (
            <form onSubmit={handleCompletePayment} className="space-y-4">
              <div className="text-center p-4 bg-emerald-50 border border-emerald-100/50 rounded-2xl space-y-1">
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider font-mono">Verification Sandbox Instructions</span>
                <p className="text-xs text-emerald-950 leading-relaxed font-semibold">
                  Send BDT <span className="font-bold underline text-emerald-900">৳{amount.toLocaleString()}</span> to official {bkashType.toLowerCase()} account: <span className="font-mono text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-100 font-bold">{bkashNumber}</span>
                </p>
                <p className="text-[10px] text-gray-500 leading-normal">
                  Reference: <span className="font-mono text-gray-600">{serviceType.toUpperCase()}</span> | Retrieve the 10-digit transaction string.
                </p>
              </div>

              {verifySuccess ? (
                <div className="text-center py-6 space-y-2 animate-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-8 h-8 font-extrabold text-emerald-600" />
                  </div>
                  <h4 className="font-display font-extrabold text-base text-emerald-950">Payment Settled Successfully!</h4>
                  <p className="text-xs text-gray-500">Transaction ID verified. Your booking is logged with Pending approval state.</p>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 font-mono tracking-wider flex items-center justify-between">
                      <span>Transaction ID (TxnID)</span>
                      <button
                        type="button"
                        onClick={handleAutoSimulate}
                        className="text-[10px] text-pink-600 hover:text-pink-700 font-mono font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        ⚡ Simulate Instant Payment
                      </button>
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. BK987654321S"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white text-center font-mono text-emerald-950 text-base uppercase tracking-wider"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={isVerifying}
                      onClick={() => setStep("payment_method")}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 text-center transition-all cursor-pointer disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 disabled:bg-emerald-950/70 text-white text-xs font-bold shadow-md text-center font-display transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isVerifying ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-emerald-300 border-t-white rounded-full animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <span>Verify & Submit</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
