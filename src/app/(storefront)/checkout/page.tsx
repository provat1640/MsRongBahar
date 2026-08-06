'use client';

import React, { useState, useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck, CheckCircle2, Phone, MapPin, CreditCard, ArrowLeft, AlertCircle, Banknote, Lock } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { BD_LOCATIONS } from '@/lib/bd-locations';

// Strict Bangladeshi Mobile Number Regex: ^(?:\+88)?01[3-9]\d{8}$
const BD_PHONE_REGEX = /^(?:\+88)?01[3-9]\d{8}$/;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();

  // Client Idempotency Key to prevent duplicate orders on double clicks
  const [idempotencyKey, setIdempotencyKey] = useState('');

  // Address & Customer Info State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [district, setDistrict] = useState('Kishoreganj');
  const [thana, setThana] = useState('Pakundia');
  const [areaUnion, setAreaUnion] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Payment Option State
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BKASH' | 'NAGAD'>('COD');
  const [bkashTrxId, setBkashTrxId] = useState('');
  const [paymentSenderNo, setPaymentSenderNo] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Generate unique idempotency key on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cryptoObj = window.crypto || (window as any).msCrypto;
      if (cryptoObj && cryptoObj.randomUUID) {
        setIdempotencyKey(cryptoObj.randomUUID());
      } else {
        setIdempotencyKey(`idempotent-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
      }
    }
  }, []);

  // Find active Thanas list based on selected District
  const currentDistrictObj = BD_LOCATIONS.find((d) => d.district === district);
  const availableThanas = currentDistrictObj ? currentDistrictObj.thanas : [];

  useEffect(() => {
    if (availableThanas.length > 0 && !availableThanas.includes(thana)) {
      setThana(availableThanas[0]);
    }
  }, [district, availableThanas, thana]);

  const deliveryFee = 60;
  const grandTotal = cartTotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-4 bg-slate-900 rounded-full inline-block text-slate-500">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-white">Your checkout cart is empty</h2>
        <p className="text-sm text-slate-400">Please add hardware or paint items from the catalog before proceeding.</p>
        <Link href="/products" className="inline-block px-6 py-3 bg-amber-500 text-slate-950 font-bold text-sm rounded-xl">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim() || customerName.trim().length < 2) {
      setError('Please provide your full recipient name (min 2 characters).');
      return;
    }

    const cleanPhone = phone.trim();
    if (!BD_PHONE_REGEX.test(cleanPhone)) {
      setError('Please enter a valid 11-digit Bangladeshi mobile number starting with 013-019 (e.g. 01712345678).');
      return;
    }

    if (!district || !thana) {
      setError('Please select your District and Thana/Upazila.');
      return;
    }

    if (!streetAddress.trim()) {
      setError('Please provide your detailed street address, holding/house number, or landmark.');
      return;
    }

    if ((paymentMethod === 'BKASH' || paymentMethod === 'NAGAD') && !bkashTrxId.trim()) {
      setError(`Please provide the 8-10 character ${paymentMethod} Transaction ID after completing payment transfer.`);
      return;
    }

    // Construct structured detailed full delivery address string
    const fullFormattedAddress = `${streetAddress.trim()}${
      areaUnion.trim() ? `, Area/Union: ${areaUnion.trim()}` : ''
    }${altPhone.trim() ? ` (Alt Contact: ${altPhone.trim()})` : ''}`;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey,
          customerName: customerName.trim(),
          phone: cleanPhone,
          deliveryAddress: fullFormattedAddress,
          district,
          thana,
          paymentMethod,
          bkashTrxId: bkashTrxId.trim(),
          paymentSenderNo: paymentSenderNo.trim() || cleanPhone,
          notes: notes.trim(),
          items: cart,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      clearCart();
      router.push(`/order-success/${data.order.id}`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <Link href="/products" className="text-xs text-amber-400 hover:underline flex items-center gap-1 mb-1 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Structured Checkout & Delivery</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3.5 py-2 rounded-full border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4" /> Idempotent & Verified Checkout
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/90 border-2 border-red-800 text-red-200 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-xl animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer Details, Distinct District/Thana Address & Payment Options */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Customer Contact Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <Phone className="w-4 h-4 text-amber-500" /> 1. Recipient Contact Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kabir Hossain"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-3 text-sm text-slate-100 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Primary Mobile Phone (11 Digits) *</label>
                <input
                  type="tel"
                  required
                  placeholder="01712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-3 text-sm text-slate-100 outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Alternative Contact Phone (Optional)</label>
              <input
                type="tel"
                placeholder="e.g. 01899887766 (Site contractor or home member)"
                value={altPhone}
                onChange={(e) => setAltPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2 px-3 text-xs text-slate-100 outline-none font-mono"
              />
            </div>
          </div>

          {/* Step 2: Detailed Distinct District & Thana Address Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <MapPin className="w-4 h-4 text-amber-500" /> 2. Structured Delivery Address (BD Districts & Thanas)
            </h3>

            {/* District & Dynamic Thana Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Select District *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-3 text-sm text-amber-400 font-bold outline-none"
                >
                  {BD_LOCATIONS.map((loc) => (
                    <option key={loc.district} value={loc.district}>
                      {loc.district} ({loc.division} Division)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Select Thana / Upazila *</label>
                <select
                  value={thana}
                  onChange={(e) => setThana(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-3 text-sm text-white font-bold outline-none"
                >
                  {availableThanas.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Area / Union / Village / Ward Name</label>
              <input
                type="text"
                placeholder="e.g. Mothkhola Union, Ward 04, College Road Area"
                value={areaUnion}
                onChange={(e) => setAreaUnion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2 px-3 text-xs text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Detailed Street Address / Holding No. / Landmark *</label>
              <textarea
                required
                rows={3}
                placeholder="e.g. House No. 14, Mothkhola Road, Near Pakundia College Gate..."
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-2.5 px-3 text-sm text-slate-100 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Special Delivery Instructions / Site Notes (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Deliver before 12 PM, contractor site delivery near paint shop..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-100 outline-none"
              />
            </div>
          </div>

          {/* Step 3: Payment Method Options with bKash & Nagad Official PNG Stickers */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-500" /> 3. Authenticated Payment Gateway Selection
              </span>
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Fraud Protection Active
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* COD */}
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border flex flex-col items-start justify-between gap-3 transition text-left ${
                  paymentMethod === 'COD'
                    ? 'bg-amber-500/10 border-amber-500 text-white font-bold ring-2 ring-amber-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">
                    Pay on Delivery
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Cash on Delivery</span>
                  <span className="text-[11px] text-slate-300">Pay cash upon courier arrival</span>
                </div>
              </button>

              {/* bKash with Official Logo PNG Sticker */}
              <button
                type="button"
                onClick={() => setPaymentMethod('BKASH')}
                className={`p-4 rounded-2xl border flex flex-col items-start justify-between gap-3 transition text-left relative overflow-hidden ${
                  paymentMethod === 'BKASH'
                    ? 'bg-gradient-to-br from-pink-950/60 to-slate-950 border-pink-500 text-white font-bold ring-2 ring-pink-500/40 shadow-lg shadow-pink-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <div className="bg-white p-1.5 rounded-xl border border-pink-200/50 shadow-sm shrink-0 flex items-center justify-center">
                    <img src="/images/bkash.png" alt="bKash Logo" className="h-7 w-auto object-contain" />
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-pink-500/20 text-pink-400 rounded border border-pink-500/30">
                    Instant Trx
                  </span>
                </div>
                <div>
                  <span className="text-xs font-black text-pink-400 block">bKash Send Money</span>
                  <span className="text-[11px] text-slate-300 font-mono font-bold">01621962897</span>
                </div>
              </button>

              {/* Nagad with Official Logo PNG Sticker */}
              <button
                type="button"
                onClick={() => setPaymentMethod('NAGAD')}
                className={`p-4 rounded-2xl border flex flex-col items-start justify-between gap-3 transition text-left relative overflow-hidden ${
                  paymentMethod === 'NAGAD'
                    ? 'bg-gradient-to-br from-orange-950/60 to-slate-950 border-orange-500 text-white font-bold ring-2 ring-orange-500/40 shadow-lg shadow-orange-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <div className="bg-white p-1.5 rounded-xl border border-orange-200/50 shadow-sm shrink-0 flex items-center justify-center">
                    <img src="/images/nagad.png" alt="Nagad Logo" className="h-7 w-auto object-contain" />
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded border border-orange-500/30">
                    Instant Trx
                  </span>
                </div>
                <div>
                  <span className="text-xs font-black text-orange-400 block">Nagad Send Money</span>
                  <span className="text-[11px] text-slate-300 font-mono font-bold">01722452836</span>
                </div>
              </button>
            </div>

            {/* bKash / Nagad Verified Transaction Drawer with PNG Sticker */}
            {(paymentMethod === 'BKASH' || paymentMethod === 'NAGAD') && (
              <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl space-y-4 shadow-2xl animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-xl border border-slate-200 shadow shrink-0">
                      <img
                        src={paymentMethod === 'BKASH' ? '/images/bkash.png' : '/images/nagad.png'}
                        alt={`${paymentMethod} Logo`}
                        className="h-8 w-auto object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">
                        Authenticated {paymentMethod} Transaction Verification
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Official M/S Rong Bahar Personal Account for Pakundia & BD Orders
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-full hidden sm:flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Real Transaction Guard
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <p className="font-bold text-amber-400">
                    Step-by-Step Payment Instructions for {paymentMethod}:
                  </p>
                  <p>
                    1. Open your <strong>{paymentMethod} App</strong> or Dial{' '}
                    <code>{paymentMethod === 'BKASH' ? '*247#' : '*167#'}</code> and select <strong>Send Money</strong>.
                  </p>
                  <p>
                    2. Send total order amount <strong>৳{grandTotal.toLocaleString('en-BD')}</strong> to Personal Number:{' '}
                    <strong className="text-white font-mono text-sm px-2.5 py-1 bg-slate-900 rounded border border-slate-700 inline-block ml-1">
                      {paymentMethod === 'BKASH' ? '01621962897' : '01722452836'}
                    </strong>
                  </p>
                  <p>3. Enter your Sender Mobile Number & 8-10 digit Transaction ID (TrxID) below to authenticate.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Sender Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={paymentSenderNo}
                      onChange={(e) => setPaymentSenderNo(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Transaction ID (TrxID) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9B7X2K89QL"
                      value={bkashTrxId}
                      onChange={(e) => setBkashTrxId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white font-mono uppercase outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 sticky top-24 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-amber-400 font-mono text-xs">{cart.reduce((s, i) => s + i.quantity, 0)} Items</span>
            </h3>

            {/* Cart Items list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => {
                let imgUrl = '/products/2412.jpg';
                try {
                  const parsed = typeof item.product.images === 'string' && item.product.images.startsWith('[')
                    ? JSON.parse(item.product.images)
                    : item.product.images;
                  if (Array.isArray(parsed) && parsed.length > 0) imgUrl = parsed[0];
                  else if (typeof parsed === 'string') imgUrl = parsed;
                } catch (e) {}

                return (
                  <div key={item.id} className="flex gap-3 text-xs border-b border-slate-800/60 pb-3">
                    <div className="relative w-12 h-12 bg-slate-950 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                      <img src={imgUrl} alt="thumb" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-200 line-clamp-1">{item.product.title}</h4>
                      {item.variant && (
                        <span className="text-amber-400 text-[10px] font-bold block">
                          Unit: {item.variant.name}
                        </span>
                      )}
                      <div className="text-slate-400 mt-1 flex justify-between">
                        <span>{item.quantity} x ৳{item.price.toLocaleString('en-BD')}</span>
                        <span className="font-bold text-slate-100">৳{(item.price * item.quantity).toLocaleString('en-BD')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pricing details */}
            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-100">৳{cartTotal.toLocaleString('en-BD')}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge ({district}, {thana})</span>
                <span className="font-semibold text-emerald-400">৳{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                <span>Total Amount Payable</span>
                <span className="text-amber-500">৳{grandTotal.toLocaleString('en-BD')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 font-black rounded-xl text-sm shadow-xl transition flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
              }`}
            >
              {isSubmitting ? (
                <span>Placing Order & Generating Invoice...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" /> Confirm & Place Order (৳{grandTotal.toLocaleString('en-BD')})
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
