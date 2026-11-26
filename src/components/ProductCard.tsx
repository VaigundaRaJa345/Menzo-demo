import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, Plus } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../data/storeConfig';
import { useStore } from '../context/StoreContext';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isWishlisted, setQuickViewProduct } = useStore();
  const [showQuickSizes, setShowQuickSizes] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.stockStatus === 'Out of Stock';

  const handleQuickAddSize = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, size, 1, false);
    setShowQuickSizes(false);
  };

  const handleQuickAddTrigger = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    setShowQuickSizes((prev) => !prev);
  };

  return (
    <article
      className="group flex flex-col"
      onMouseLeave={() => setShowQuickSizes(false)}
    >
      {/* Editorial 3:4 Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE9E2]">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <SafeImage
            src={product.images[0]}
            alt={`${product.name} in ${product.color}`}
            fallbackLabel={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </Link>

        {/* Minimal Top-Left Unboxed Editorial Label (Max 1 quiet tag) */}
        {(product.isNewArrival || outOfStock) && (
          <div className="absolute top-3 left-3 pointer-events-none">
            <span className="inline-block bg-[#FAF9F7]/92 text-[#111111] px-2.5 py-1 text-[10px] font-medium tracking-[0.14em] uppercase">
              {outOfStock ? 'Sold Out' : 'New Arrival'}
            </span>
          </div>
        )}

        {/* Top-Right Wishlist & Quick View Controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            className="w-9 h-9 bg-[#FAF9F7]/92 hover:bg-white text-[#111111] flex items-center justify-center transition-colors"
          >
            <Heart
              className={`w-4 h-4 stroke-[1.6] transition-colors ${
                wishlisted ? 'fill-[#111111] text-[#111111]' : 'text-[#111111]'
              }`}
            />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            aria-label={`Quick view ${product.name}`}
            className="w-9 h-9 bg-[#FAF9F7]/92 hover:bg-white text-[#111111] flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200"
          >
            <Eye className="w-4 h-4 stroke-[1.6]" />
          </button>
        </div>

        {/* Bottom Quick Add Overlay */}
        {!outOfStock && (
          <div className="absolute inset-x-3 bottom-3">
            {showQuickSizes ? (
              <div className="bg-[#FAF9F7]/96 backdrop-blur-sm p-2.5 border border-[#E4E0D8]">
                <p className="text-[10px] tracking-[0.12em] uppercase text-[#5C574F] text-center mb-2">
                  Select Size to Add
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={(e) => handleQuickAddSize(e, size)}
                      className="min-w-[34px] h-8 px-2 text-xs font-medium text-[#111111] bg-white border border-[#D8D3C9] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleQuickAddTrigger}
                className="w-full py-2.5 px-4 bg-[#FAF9F7]/94 hover:bg-[#111111] text-[#111111] hover:text-[#FAF9F7] text-xs font-medium tracking-[0.1em] uppercase flex items-center justify-center gap-1.5 transition-all duration-200 lg:opacity-0 lg:translate-y-1 lg:group-hover:opacity-100 lg:group-hover:translate-y-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Metadata Below Image */}
      <div className="pt-3.5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#6B665E] tracking-[0.04em]">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.color}</span>
          </div>

          <h3 className="mt-1 text-[15px] font-medium text-[#111111] leading-snug">
            <Link
              to={`/product/${product.slug}`}
              className="hover:underline underline-offset-4 decoration-[#111111]/40"
            >
              {product.name}
            </Link>
          </h3>
        </div>

        <div className="mt-2 flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-[15px] font-semibold text-[#111111]">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#8A8378] line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          <span className="text-[11px] text-[#7A746A] tracking-[0.04em] truncate">
            {product.sizes.join(' · ')}
          </span>
        </div>
      </div>
    </article>
  );
};
