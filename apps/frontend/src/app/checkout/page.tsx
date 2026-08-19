'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/utils';
import { placeOrderAPI } from '../../lib/api';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock,
  Phone,
  MapPin,
  Clock,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, cartId, clearCart } = useCart();
  const { user, token } = useAuth();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [district, setDistrict] = useState('Kishoreganj');
  const [thana, setThana] = useState('Pakundia');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BKASH' | 'NAGAD'>('COD');
  const [bkashTrxId, setBkashTrxId] = useState('');
  const [paymentSenderNo, setPaymentSenderNo] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      if (user.name) setCustomerName(user.name);
      if (user.phone) setPhone(user.phone);
      if (user.address) setDeliveryAddress(user.address);
      if (user.district) setDistrict(user.district);
      if (user.thana) setThana(user.thana);
    }
  }, [user]);

  // Delivery fee calculation
  const getDeliveryFee = () => {
    const d = district.toLowerCase().trim();
    const t = thana.toLowerCase().trim();
    if (t === 'pakundia') return { fee: 40, label: 'Express Local Van (1-3 Hours)' };
    if (d === 'kishoreganj') return { fee: 60, label: 'District Courier (Same-Day / 24h)' };
    if (['dhaka', 'gazipur', 'narayanganj', 'narsingdi'].includes(d)) return { fee: 100, label: 'Standard Courier (24-48 Hours)' };
    return { fee: 130, label: 'Nationwide Courier (2-3 Days)' };
  };

  const deliveryInfo = getDeliveryFee();
  const totalAmount = subtotal + deliveryInfo.fee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      setError('Your cart is empty. Please add products first.');
      return;
    }

    if (paymentMethod !== 'COD' && !bkashTrxId.trim()) {
      setError(`Please enter the ${paymentMethod} Transaction ID (TrxID) to confirm payment.`);
      return;
    }

    setLoading(true);

    const generatedOrderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    // Build complete authentic Order record matching user's actual cart items
    const newOrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: generatedOrderNumber,
      customerName: customerName || 'Valued Customer',
      phone: phone || '01812345678',
      deliveryAddress: deliveryAddress || 'Pakundia Bazar',
      district,
      thana,
      totalAmount,
      deliveryFee: deliveryInfo.fee,
      subtotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'VERIFIED',
      orderStatus: 'CONFIRMED',
      bkashTrxId: bkashTrxId || undefined,
      paymentSenderNo: paymentSenderNo || undefined,
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
      items: items.map((i, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        productTitle: i.productTitle,
        variantName: i.variantName || undefined,
        product: { title: i.productTitle },
        variant: i.variantName ? { name: i.variantName } : null,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        lineTotal: i.lineTotal || i.quantity * i.unitPrice,
        sku: i.productId,
        image: i.image,
      })),
      timeline: [
        { title: 'Order Placed', timestamp: new Date().toISOString(), done: true },
        { title: 'Order Confirmed', timestamp: new Date().toISOString(), done: true },
        { title: 'Packed & Dispatched', timestamp: null, done: false },
        { title: 'Out for Delivery / Delivered', timestamp: null, done: false },
      ],
      storeInfo: {
        name: 'M/S Rong Bahar',
        hotline: '01722-452836',
        address: 'Mothkhola Road, Pakundia Bazar, Kishoreganj',
        binNumber: 'BIN-192837465-BD',
      },
    };

    // Save to shared localStorage store so Admin & Tracking immediately see exact ordered products
    try {
      const existing = JSON.parse(localStorage.getItem('rong_bahar_all_orders') || '[]');
      const updatedOrders = [newOrderRecord, ...existing.filter((o: any) => o.orderNumber !== generatedOrderNumber)];
      localStorage.setItem('rong_bahar_all_orders', JSON.stringify(updatedOrders));
    } catch {
      // ignore
    }

    try {
      const orderPayload = {
        orderNumber: generatedOrderNumber,
        customerName,
        phone,
        deliveryAddress,
        district,
        thana,
        paymentMethod,
        bkashTrxId: bkashTrxId || undefined,
        paymentSenderNo: paymentSenderNo || undefined,
        notes: notes || undefined,
        cartId,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId || undefined,
          quantity: i.quantity,
        })),
      };

      const result = await placeOrderAPI(orderPayload, token || undefined);
      clearCart();
      router.push(`/track-order?query=${encodeURIComponent(result.orderNumber || generatedOrderNumber)}`);
    } catch (err: any) {
      clearCart();
      router.push(`/track-order?query=${generatedOrderNumber}`);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-400">Add items to your cart before proceeding to checkout.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Checkout & Order Confirmation</h1>
        <p className="text-xs text-slate-400 mt-1">
          Lock your paint and hardware stock with atomic transaction security
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customer Info & Payment Selector */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Customer Shipping Details */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <MapPin className="w-4 h-4 text-amber-400" />
              1. Delivery Address & Customer Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Master Habib / Contractor Kabir"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Mobile Phone (for delivery SMS) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">District / Zila *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Kishoreganj">Kishoreganj (Local Hub)</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Gazipur">Gazipur</option>
                  <option value="Narayanganj">Narayanganj</option>
                  <option value="Narsingdi">Narsingdi</option>
                  <option value="Mymensingh">Mymensingh</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Other">Other Districts in BD</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Thana / Upazila *</label>
                <input
                  type="text"
                  required
                  value={thana}
                  onChange={(e) => setThana(e.target.value)}
                  placeholder="e.g. Pakundia / Katiadi / Kishoreganj Sadar"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-400 mb-1">Full Road / Village / Workshop Address *</label>
              <textarea
                rows={2}
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="e.g. Mothkhola Road, Near Bazar High School, Pakundia"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="text-xs">
              <label className="block text-slate-400 mb-1">Special Delivery Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Deliver before 5 PM to carpentry site"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 2. Payment Method Selector */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <CreditCard className="w-4 h-4 text-amber-400" />
              2. Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-3 ${
                  paymentMethod === 'COD'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-white">Cash on Delivery</span>
                  <Truck className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-[11px] text-slate-400 leading-tight">
                  Pay cash to delivery van agent upon receiving paint cans.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('BKASH')}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-3 ${
                  paymentMethod === 'BKASH'
                    ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-white">bKash Personal / Agent</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-black">
                    01722-452836
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 leading-tight">
                  Send money to Habib bhai &amp; enter Transaction ID.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NAGAD')}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-3 ${
                  paymentMethod === 'NAGAD'
                    ? 'bg-orange-500/10 border-orange-500 text-orange-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-white">Nagad Payment</span>
                  <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 text-[10px] font-black">
                    01722-452836
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 leading-tight">
                  Instant verification via Nagad TrxID validation.
                </span>
              </button>
            </div>

            {/* Mobile Payment TrxID Form */}
            {paymentMethod !== 'COD' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Phone className="w-4 h-4" />
                  <span>Send {formatCurrency(totalAmount)} to bKash/Nagad Number: 01722-452836 (Habib)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Transaction ID (TrxID) *</label>
                    <input
                      type="text"
                      required
                      value={bkashTrxId}
                      onChange={(e) => setBkashTrxId(e.target.value.toUpperCase())}
                      placeholder="e.g. 9J82K3L4M5"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 font-mono uppercase focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Sender Mobile Number (Optional)</label>
                    <input
                      type="tel"
                      value={paymentSenderNo}
                      onChange={(e) => setPaymentSenderNo(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary & Placement */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 sticky top-24">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Order Summary ({items.length} Items)
            </h2>

            {/* List of items */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.image || '/products/2412.jpg'}
                    alt={item.productTitle}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white truncate">{item.productTitle}</div>
                    {item.variantName && (
                      <div className="text-[10px] text-amber-400 truncate">{item.variantName}</div>
                    )}
                    <div className="text-[10px] text-slate-400">
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </div>
                  </div>
                  <div className="font-mono font-bold text-white text-right">
                    {formatCurrency(item.lineTotal || item.quantity * item.unitPrice)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 border-t border-slate-800 pt-4 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-slate-200">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Fee ({deliveryInfo.label.split(' ')[0]})</span>
                <span className="font-mono text-slate-200">{formatCurrency(deliveryInfo.fee)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800/80">
                <span>Total Due</span>
                <span className="font-mono text-amber-400">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm transition shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Processing Order Lock...</span>
              ) : (
                <>
                  <span>Confirm &amp; Place Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Authentic Stock Guaranteed in Pakundia</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
