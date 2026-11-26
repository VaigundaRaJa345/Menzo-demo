import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR, STORE_CONFIG } from '../data/storeConfig';
import { SafeImage } from './SafeImage';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    updateCartItemSize,
    cartCount,
    cartSubtotal,
    deliveryCharge,
    cartTotal,
  } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCartOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(
    0,
    STORE_CONFIG.freeShippingThreshold - cartSubtotal
  );
  const freeShippingProgress = Math.min(
    100,
    Math.round((cartSubtotal / STORE_CONFIG.freeShippingThreshold) * 100)
  );

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[1px]"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <aside className="relative w-full max-w-md bg-[#FAF9F7] h-full flex flex-col border-l border-[#E4E0D8] shadow-2xl">
        {/* Drawer Header */}
        <div className="px-6 h-16 flex items-center justify-between border-b border-[#E4E0D8] shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif text-xl font-medium text-[#111111]">
              Your Shopping Bag
            </h2>
            <span className="text-xs text-[#6B665E] tabular-nums">({cartCount})</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close shopping bag"
            className="p-2 -mr-2 text-[#111111] hover:opacity-70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {cart.length > 0 && (
          <div className="px-6 py-3 bg-[#F3F1EC] border-b border-[#E4E0D8] shrink-0">
            <p className="text-xs text-[#3C3832]">
              {remainingForFreeShipping === 0 ? (
                <span>You&apos;ve unlocked complimentary India-wide shipping.</span>
              ) : (
                <span>
                  Add <strong className="font-semibold tabular-nums">{formatINR(remainingForFreeShipping)}</strong> more for complimentary shipping.
                </span>
              )}
            </p>
            <div className="mt-2 h-1 w-full bg-[#DFDAD0] overflow-hidden">
              <div
                className="h-full bg-[#111111] transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-9 h-9 text-[#9A9389] stroke-[1.25] mb-4" />
              <p className="font-serif text-2xl text-[#111111]">Your bag is empty</p>
              <p className="mt-2 text-sm text-[#6B665E] max-w-xs">
                Explore our newest arrivals and heavyweight essentials to build your wardrobe.
              </p>
              <Link
                to="/shop"
                onClick={() => setIsCartOpen(false)}
                className="mt-6 px-6 py-3 bg-[#111111] text-[#FAF9F7] text-xs font-medium uppercase tracking-[0.12em] hover:bg-[#2A2A2A] transition-colors"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-[#E4E0D8]">
              {cart.map((item) => (
                <li key={item.id} className="py-5 first:pt-0 flex gap-4">
                  <Link
                    to={`/product/${item.slug}`}
                    onClick={() => setIsCartOpen(false)}
                    className="w-20 h-[106px] bg-[#ECE9E2] shrink-0 overflow-hidden"
                  >
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-sm font-medium text-[#111111] hover:underline leading-snug"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name} from bag`}
                          className="p-1 text-[#7A746A] hover:text-[#111111] transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-[#6B665E] mt-0.5">{item.color}</p>

                      {/* Inline Size Switcher */}
                      <div className="mt-2 flex items-center gap-2">
                        <label
                          htmlFor={`cart-size-${item.id}`}
                          className="text-[11px] text-[#6B665E]"
                        >
                          Size:
                        </label>
                        <select
                          id={`cart-size-${item.id}`}
                          value={item.size}
                          onChange={(e) => updateCartItemSize(item.id, e.target.value)}
                          className="text-xs font-medium bg-white border border-[#D8D3C9] px-2 py-1 text-[#111111] focus:border-[#111111]"
                        >
                          {item.availableSizes.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#D8D3C9] bg-white">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="w-7 h-7 flex items-center justify-center text-[#111111] hover:bg-[#F3F1EC]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="w-7 h-7 flex items-center justify-center text-[#111111] hover:bg-[#F3F1EC]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-[#111111] tabular-nums">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-[#E4E0D8] bg-[#F3F1EC]/70 shrink-0 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#5C574F]">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatINR(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[#5C574F]">
                <span>Shipping</span>
                <span className="tabular-nums">
                  {deliveryCharge === 0 ? 'Complimentary' : formatINR(deliveryCharge)}
                </span>
              </div>
              <div className="pt-2 border-t border-[#DFDAD0] flex justify-between text-base font-semibold text-[#111111]">
                <span>Estimated Total</span>
                <span className="tabular-nums">{formatINR(cartTotal)}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3.5 px-5 bg-[#111111] text-[#FAF9F7] text-xs font-medium uppercase tracking-[0.12em] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-2.5 text-xs font-medium text-[#5C574F] hover:text-[#111111] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
