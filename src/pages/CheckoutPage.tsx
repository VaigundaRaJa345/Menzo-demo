import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  MessageCircle,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  buildWhatsAppGeneralUrl,
  formatINR,
  STORE_CONFIG,
} from '../data/storeConfig';
import { CustomerDetails, OrderRecord } from '../types';
import { SafeImage } from '../components/SafeImage';

const INDIAN_STATES = [
  'Tamil Nadu',
  'Karnataka',
  'Kerala',
  'Telangana',
  'Andhra Pradesh',
  'Maharashtra',
  'Delhi',
  'Gujarat',
  'West Bengal',
  'Rajasthan',
  'Uttar Pradesh',
  'Punjab',
  'Other',
];

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, deliveryCharge, cartTotal, placeDemoOrder } = useStore();

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pinCode: '',
  });
  const [paymentMethod, setPaymentMethod] =
    useState<OrderRecord['paymentMethod']>('COD (Demo)');
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    document.title = 'Checkout — Menzo Clothing';
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const handleChange = (field: keyof CustomerDetails, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!/^\d{6}$/.test(customer.pinCode.trim())) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN Code.');
      return;
    }

    if (customer.phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    const order = placeDemoOrder(customer, paymentMethod);
    setConfirmedOrder(order);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Order Confirmation Screen
  if (confirmedOrder) {
    const whatsappConfirmText = `Hi Menzo Clothing! I just placed demo order ${confirmedOrder.orderNumber} for ${confirmedOrder.items
      .map((i) => `${i.name} (${i.size} x${i.quantity})`)
      .join(', ')}. Total: ${formatINR(confirmedOrder.total)}.`;

    return (
      <div className="bg-[#FAF9F7] min-h-[75vh] py-14 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-[#E4E0D8] p-7 sm:p-10">
            <div className="flex items-center gap-3 text-[#166534]">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                Order Confirmed · Demo Checkout
              </span>
            </div>

            <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-normal text-[#111111]">
              Thank you, {confirmedOrder.customer.fullName}.
            </h1>
            <p className="mt-2 text-sm text-[#5C574F] leading-relaxed">
              Order <strong className="text-[#111111] tabular-nums">{confirmedOrder.orderNumber}</strong>{' '}
              has been recorded in this storefront demonstration. No real payment was charged.
            </p>

            {/* Shipping Details */}
            <div className="mt-7 pt-6 border-t border-[#E4E0D8] grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-[#7A746A] mb-1.5">
                  Delivery Address
                </p>
                <p className="font-medium text-[#111111]">
                  {confirmedOrder.customer.fullName}
                </p>
                <p className="text-[#4B463F] mt-0.5">
                  {confirmedOrder.customer.address}
                </p>
                <p className="text-[#4B463F]">
                  {confirmedOrder.customer.city}, {confirmedOrder.customer.state} –{' '}
                  {confirmedOrder.customer.pinCode}
                </p>
                <p className="text-[#5C574F] mt-1">{confirmedOrder.customer.phone}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-[#7A746A] mb-1.5">
                  Order Summary
                </p>
                <p className="text-[#4B463F]">
                  Method: <span className="text-[#111111] font-medium">{confirmedOrder.paymentMethod}</span>
                </p>
                <p className="text-[#4B463F] mt-1">
                  Status: <span className="text-[#111111] font-medium">{confirmedOrder.status}</span>
                </p>
                <p className="text-[#4B463F] mt-1">
                  Dispatch: <span className="text-[#111111]">Estimated 24–48 hrs from Chennai</span>
                </p>
              </div>
            </div>

            {/* Receipt Line Items */}
            <div className="mt-7 pt-6 border-t border-[#E4E0D8]">
              <ul className="divide-y divide-[#EFECE6]">
                {confirmedOrder.items.map((item) => (
                  <li key={item.id} className="py-3 flex items-center justify-between gap-4 text-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-16 bg-[#ECE9E2] shrink-0 overflow-hidden">
                        <SafeImage
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#111111] truncate">{item.name}</p>
                        <p className="text-xs text-[#6B665E]">
                          Size {item.size} · Qty {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium text-[#111111] tabular-nums shrink-0">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-4 border-t border-[#E4E0D8] space-y-1.5 text-sm">
                <div className="flex justify-between text-[#5C574F]">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatINR(confirmedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#5C574F]">
                  <span>Delivery</span>
                  <span className="tabular-nums">
                    {confirmedOrder.deliveryCharge === 0
                      ? 'Complimentary'
                      : formatINR(confirmedOrder.deliveryCharge)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#111111] pt-2">
                  <span>Total</span>
                  <span className="tabular-nums">{formatINR(confirmedOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/shop"
                className="flex-1 py-3.5 px-6 bg-[#111111] text-[#FAF9F7] text-xs font-semibold uppercase tracking-[0.14em] text-center hover:bg-[#2A2A2A] transition-colors"
              >
                Continue Shopping
              </Link>
              <a
                href={buildWhatsAppGeneralUrl(whatsappConfirmText)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 px-6 border border-[#D8D3C9] text-[#111111] text-xs font-medium uppercase tracking-[0.12em] text-center hover:border-[#111111] transition-colors inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#15803D]" />
                <span>Share Order on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart Guard
  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF9F7] min-h-[70vh] flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <h1 className="font-serif text-4xl text-[#111111]">Your Bag is Empty</h1>
          <p className="mt-3 text-sm text-[#5C574F]">
            Add pieces from the Menzo Clothing collection before proceeding to checkout.
          </p>
          <Link
            to="/shop"
            className="mt-7 inline-block px-7 py-3.5 bg-[#111111] text-[#FAF9F7] text-xs font-semibold uppercase tracking-[0.14em]"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F7] min-h-screen py-10 sm:py-14">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs text-[#5C574F] hover:text-[#111111] mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shopping</span>
        </Link>

        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#111111] mb-10">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          {/* Left: Customer & Delivery Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
            <div className="bg-white border border-[#E4E0D8] p-6 sm:p-8 space-y-5">
              <h2 className="font-serif text-2xl text-[#111111] pb-3 border-b border-[#EFECE6]">
                Delivery Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="chk-name" className="block text-xs font-medium text-[#111111] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="chk-name"
                    type="text"
                    required
                    value={customer.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-[#FAF9F7] border border-[#D8D3C9] px-3.5 py-3 text-sm text-[#111111] focus:border-[#111111] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="chk-phone" className="block text-xs font-medium text-[#111111] mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    id="chk-phone"
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+91 98400 00000"
                    className="w-full bg-[#FAF9F7] border border-[#D8D3C9] px-3.5 py-3 text-sm text-[#111111] focus:border-[#111111] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="chk-email" className="block text-xs font-medium text-[#111111] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id="chk-email"
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[#FAF9F7] border border-[#D8D3C9] px-3.5 py-3 text-sm text-[#111111] focus:border-[#111111] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="chk-address" className="block text-xs font-medium text-[#111111] mb-1.5">
                    Delivery Address *
                  </label>
                  <textarea
                    id="chk-address"
                    rows={2}
                    required
                    value={customer.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="House / Flat No., Street, Area, Landmark"
                    className="w-full bg-[#FAF9F7] border border-[#D8D3C9] px-3.5 py-3 text-sm text-[#111111] focus:border-[#111111] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="chk-city" className="block text-xs font-medium text-[#111111] mb-1.5">
                    City *
                  </label>
                  <input
                    id="chk-city"
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full bg-[#FAF9F7] border border-[#D8D3C9] px-3.5 py-3 text-sm text-[#111111] focus:border-[#111111] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="chk-state" className="block text-xs font-medium text-[#111111] mb-1.5">
                    State *
                  </label>
                  <select
                    id="chk-state"
                    value={customer.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full bg-[#FAF9F7] border border-[#D8D3C9] px-3.5 py-3 text-sm text-[#111111] focus:border-[#111111] focus:bg-white focus:outline-none"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="chk-pin" className="block text-xs font-medium text-[#111111] mb-1.5">
                    PIN Code *
                  </label>
                  <input
                    id="chk-pin"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={customer.pinCode}
                    onChange={(e) => handleChange('pinCode', e.target.value.replace(/\D/g, ''))}
                    placeholder="600001"
                    className="w-full bg-[#FAF9F7] border border-[#D8D3C9] px-3.5 py-3 text-sm text-[#111111] tabular-nums focus:border-[#111111] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Simulated Payment Section + Editable Razorpay Placeholder */}
            <div className="bg-white border border-[#E4E0D8] p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EFECE6]">
                <h2 className="font-serif text-2xl text-[#111111]">
                  Payment Method (Demo)
                </h2>
                <span className="inline-flex items-center gap-1.5 text-xs text-[#6B665E]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Simulated Checkout</span>
                </span>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                    paymentMethod === 'COD (Demo)'
                      ? 'border-[#111111] bg-[#FAF9F7]'
                      : 'border-[#E4E0D8] hover:border-[#B4AEA4]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'COD (Demo)'}
                    onChange={() => setPaymentMethod('COD (Demo)')}
                    className="mt-1 accent-[#111111]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#111111]" />
                      <span className="text-sm font-medium text-[#111111]">
                        Cash on Delivery (Simulated)
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#6B665E]">
                      Pay when your Menzo Clothing package arrives at your doorstep.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                    paymentMethod === 'Razorpay (Demo Placeholder)'
                      ? 'border-[#111111] bg-[#FAF9F7]'
                      : 'border-[#E4E0D8] hover:border-[#B4AEA4]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'Razorpay (Demo Placeholder)'}
                    onChange={() => setPaymentMethod('Razorpay (Demo Placeholder)')}
                    className="mt-1 accent-[#111111]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#111111]" />
                      <span className="text-sm font-medium text-[#111111]">
                        Razorpay Online Payment — Integration Placeholder
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#6B665E] leading-relaxed">
                      {STORE_CONFIG.razorpay.modeLabel}. No real card or UPI details are collected
                      in this demo. Configure your live Merchant Key in{' '}
                      <code className="text-[11px] bg-[#EFECE6] px-1 py-0.5 text-[#111111]">
                        src/data/storeConfig.ts
                      </code>
                      .
                    </p>
                  </div>
                </label>
              </div>

              {errorMsg && (
                <p className="text-xs text-[#991B1B] font-medium">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-4 px-6 bg-[#111111] text-[#FAF9F7] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#2A2A2A] transition-colors"
              >
                Place Demo Order · {formatINR(cartTotal)}
              </button>
            </div>
          </form>

          {/* Right: Order Summary */}
          <aside className="lg:col-span-5 bg-[#F3F1EC] border border-[#E4E0D8] p-6 sm:p-8 lg:sticky lg:top-24">
            <h2 className="font-serif text-2xl text-[#111111] pb-4 border-b border-[#DFDAD0]">
              Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>

            <ul className="divide-y divide-[#DFDAD0] my-4">
              {cart.map((item) => (
                <li key={item.id} className="py-4 flex gap-3.5 items-start">
                  <div className="w-16 h-20 bg-[#ECE9E2] shrink-0 overflow-hidden">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111111] leading-snug">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#6B665E] mt-1">
                      Size {item.size} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-[#111111] tabular-nums shrink-0">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-[#DFDAD0] space-y-2.5 text-sm">
              <div className="flex justify-between text-[#5C574F]">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatINR(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[#5C574F]">
                <span>Delivery Charge</span>
                <span className="tabular-nums">
                  {deliveryCharge === 0 ? 'Complimentary' : formatINR(deliveryCharge)}
                </span>
              </div>
              <div className="pt-3 border-t border-[#DFDAD0] flex justify-between text-base font-semibold text-[#111111]">
                <span>Total Amount</span>
                <span className="tabular-nums">{formatINR(cartTotal)}</span>
              </div>
            </div>

            <p className="mt-5 text-[11px] text-[#6B665E] leading-relaxed">
              This is a demonstration checkout flow showcasing the Menzo Clothing customer
              experience. Orders placed here appear immediately in the demo store management
              dashboard.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};
