import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../data/storeConfig';
import { SafeImage } from './SafeImage';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedSize(quickViewProduct.sizes[1] || quickViewProduct.sizes[0] || 'M');
      setQuantity(1);
    }
  }, [quickViewProduct]);

  useEffect(() => {
    if (!quickViewProduct) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQuickViewProduct(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [quickViewProduct, setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const outOfStock = quickViewProduct.stockStatus === 'Out of Stock';

  const handleAdd = () => {
    if (outOfStock || !selectedSize) return;
    addToCart(quickViewProduct, selectedSize, quantity, true);
    setQuickViewProduct(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view ${quickViewProduct.name}`}
    >
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={() => setQuickViewProduct(null)}
        aria-hidden="true"
      />

      <div className="relative bg-[#FAF9F7] w-full max-w-3xl max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 border border-[#E4E0D8] shadow-2xl">
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close quick view"
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-[#FAF9F7]/90 hover:bg-white text-[#111111] flex items-center justify-center border border-[#E4E0D8]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image */}
        <div className="aspect-[3/4] bg-[#ECE9E2] w-full h-full">
          <SafeImage
            src={quickViewProduct.images[0]}
            alt={quickViewProduct.name}
            fallbackLabel={quickViewProduct.name}
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Details */}
        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <p className="text-xs text-[#6B665E] tracking-[0.06em]">
              {quickViewProduct.category} · {quickViewProduct.color}
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-medium text-[#111111] leading-tight">
              {quickViewProduct.name}
            </h2>

            <div className="mt-3 flex items-baseline gap-2.5 tabular-nums">
              <span className="text-lg font-semibold text-[#111111]">
                {formatINR(quickViewProduct.price)}
              </span>
              {quickViewProduct.originalPrice &&
                quickViewProduct.originalPrice > quickViewProduct.price && (
                  <span className="text-sm text-[#8A8378] line-through">
                    {formatINR(quickViewProduct.originalPrice)}
                  </span>
                )}
              <span className="text-xs text-[#6B665E]">Incl. of all taxes</span>
            </div>

            <p className="mt-4 text-sm text-[#4B463F] leading-relaxed">
              {quickViewProduct.shortDescription}
            </p>

            {/* Size Selector */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-medium text-[#111111] uppercase tracking-[0.08em]">
                  Select Size
                </span>
                <span className="text-[#6B665E]">{quickViewProduct.fit}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickViewProduct.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] h-10 px-3 text-xs font-medium border transition-colors ${
                      selectedSize === size
                        ? 'bg-[#111111] text-[#FAF9F7] border-[#111111]'
                        : 'bg-white text-[#111111] border-[#D8D3C9] hover:border-[#111111]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-5">
              <span className="block text-xs font-medium text-[#111111] uppercase tracking-[0.08em] mb-2">
                Quantity
              </span>
              <div className="inline-flex items-center border border-[#D8D3C9] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-10 flex items-center justify-center text-[#111111] hover:bg-[#F3F1EC]"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-medium tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  aria-label="Increase quantity"
                  className="w-10 h-10 flex items-center justify-center text-[#111111] hover:bg-[#F3F1EC]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-7 space-y-3">
            <button
              type="button"
              disabled={outOfStock}
              onClick={handleAdd}
              className="w-full py-3.5 px-6 bg-[#111111] text-[#FAF9F7] text-xs font-medium uppercase tracking-[0.12em] hover:bg-[#2A2A2A] disabled:bg-[#B4AEA4] transition-colors"
            >
              {outOfStock ? 'Currently Sold Out' : `Add to Bag · ${formatINR(quickViewProduct.price * quantity)}`}
            </button>

            <Link
              to={`/product/${quickViewProduct.slug}`}
              onClick={() => setQuickViewProduct(null)}
              className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-medium text-[#111111] hover:opacity-70 transition-opacity"
            >
              <span>View Full Product Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
