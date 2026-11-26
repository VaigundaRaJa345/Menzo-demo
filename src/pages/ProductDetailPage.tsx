import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Check,
  ChevronDown,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  Ruler,
  ShieldCheck,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppOrderUrl, formatINR, STORE_CONFIG } from '../data/storeConfig';
import { ProductGrid } from '../components/ProductGrid';
import { SafeImage } from '../components/SafeImage';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    products,
    addToCart,
    toggleWishlist,
    isWishlisted,
    addProductReview,
  } = useStore();

  const product = products.find((p) => p.slug === slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'details' | 'care' | 'delivery'>('details');

  // Review form state
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewCity, setReviewCity] = useState('Chennai');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setActiveImageIndex(0);
    setQuantity(1);
    setSizeError(false);
    setAddedFeedback(false);
    if (product) {
      setSelectedSize(product.sizes[1] || product.sizes[0] || 'M');
      document.title = `${product.name} — Menzo Clothing`;
    } else {
      document.title = 'Product Not Found — Menzo Clothing';
    }
  }, [slug, product?.id]);

  if (!product) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-24 text-center">
        <h1 className="font-serif text-4xl text-[#111111]">Piece Not Found</h1>
        <p className="mt-3 text-sm text-[#5C574F]">
          This garment may have been archived or moved in the demo catalog.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block px-7 py-3.5 bg-[#111111] text-[#FAF9F7] text-xs font-medium uppercase tracking-[0.12em]"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const outOfStock = product.stockStatus === 'Out of Stock';
  const wishlisted = isWishlisted(product.id);
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const avgRating =
    product.reviews.length > 0
      ? (
          product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : null;

  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => (a.category === product.category ? -1 : 1) - (b.category === product.category ? -1 : 1))
    .slice(0, 4);

  const handleAddToCart = () => {
    if (outOfStock) return;
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize, quantity, false);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 2200);
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addToCart(product, selectedSize, quantity, false);
    navigate('/checkout');
  };

  const whatsAppUrl = buildWhatsAppOrderUrl({
    productName: product.name,
    size: selectedSize || product.sizes[0] || 'M',
    quantity,
    price: product.price,
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;
    addProductReview(product.id, {
      author: reviewAuthor.trim(),
      city: reviewCity.trim() || 'Chennai',
      rating: reviewRating,
      title: reviewTitle.trim() || 'Great fit and quality',
      comment: reviewComment.trim(),
      verifiedSize: selectedSize || product.sizes[0] || 'M',
    });
    setReviewAuthor('');
    setReviewTitle('');
    setReviewComment('');
    setReviewFormOpen(false);
  };

  const isBottoms = product.category === 'Bottoms';

  return (
    <div className="bg-[#FAF9F7] pb-24 md:pb-0">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-4">
        <nav aria-label="Breadcrumb" className="text-xs text-[#6B665E] flex flex-wrap items-center gap-2">
          <Link to="/" className="hover:text-[#111111]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/shop" className="hover:text-[#111111]">
            Shop
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            to={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-[#111111]"
          >
            {product.category}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#111111] truncate">{product.name}</span>
        </nav>
      </div>

      {/* Main Contiguous Purchase Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          {/* Left: Product Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 lg:sticky lg:top-24">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible sm:w-20 shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`View angle ${idx + 1} of ${product.name}`}
                  className={`w-16 sm:w-20 aspect-[3/4] bg-[#ECE9E2] overflow-hidden shrink-0 border transition-colors ${
                    activeImageIndex === idx
                      ? 'border-[#111111]'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <SafeImage
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>

            {/* Main 3:4 Editorial Image */}
            <div className="flex-1 aspect-[3/4] bg-[#ECE9E2] overflow-hidden">
              <SafeImage
                src={product.images[activeImageIndex] || product.images[0]}
                alt={`${product.name} in ${product.color}`}
                fallbackLabel={product.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Quiet unboxed metadata line */}
              <div className="flex items-center flex-wrap gap-2 text-xs text-[#6B665E]">
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span>{product.color}</span>
                <span aria-hidden="true">·</span>
                <span
                  className={
                    outOfStock
                      ? 'text-[#991B1B] font-medium'
                      : product.stockStatus === 'Low Stock'
                      ? 'text-[#92400E] font-medium'
                      : 'text-[#166534] font-medium'
                  }
                >
                  {product.stockStatus}
                </span>
              </div>

              <h1 className="mt-2.5 font-serif text-3xl sm:text-4xl font-normal text-[#111111] leading-tight">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="mt-4 flex items-baseline flex-wrap gap-3 tabular-nums">
                <span className="text-2xl font-semibold text-[#111111]">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-[#8A8378] line-through">
                      {formatINR(product.originalPrice)}
                    </span>
                    <span className="text-xs font-medium text-[#7C6A58] uppercase tracking-[0.08em]">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-[#6B665E]">
                Inclusive of all taxes · SKU {product.sku}
              </p>

              {/* Rating Summary */}
              {avgRating && (
                <a
                  href="#customer-reviews"
                  className="mt-3 inline-flex items-center gap-2 text-xs text-[#4B463F] hover:text-[#111111]"
                >
                  <span className="inline-flex items-center gap-0.5 text-[#111111]">
                    <Star className="w-3.5 h-3.5 fill-[#111111]" />
                    <strong className="font-semibold tabular-nums ml-0.5">{avgRating}</strong>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="underline underline-offset-4">
                    {product.reviews.length}{' '}
                    {product.reviews.length === 1 ? 'Review' : 'Reviews'}
                  </span>
                </a>
              )}
            </div>

            <p className="text-sm sm:text-[15px] text-[#4B463F] leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="pt-2 border-t border-[#E4E0D8]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#111111]">
                  Size: <span className="font-normal text-[#5C574F]">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#5C574F] hover:text-[#111111] underline underline-offset-4"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                    className={`min-w-[52px] h-11 px-4 text-xs font-medium border transition-colors ${
                      selectedSize === size
                        ? 'bg-[#111111] text-[#FAF9F7] border-[#111111]'
                        : 'bg-white text-[#111111] border-[#D8D3C9] hover:border-[#111111]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {sizeError && (
                <p className="mt-2 text-xs text-[#991B1B]">
                  Please select a size before adding to bag.
                </p>
              )}
            </div>

            {/* Quantity & Wishlist Row */}
            <div className="flex items-center gap-4">
              <div>
                <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6B665E] mb-1.5">
                  Quantity
                </span>
                <div className="inline-flex items-center border border-[#D8D3C9] bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-11 h-11 flex items-center justify-center text-[#111111] hover:bg-[#F3F1EC]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-11 text-center text-sm font-medium tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                    className="w-11 h-11 flex items-center justify-center text-[#111111] hover:bg-[#F3F1EC]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-5">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="h-11 px-4 border border-[#D8D3C9] bg-white hover:border-[#111111] text-xs font-medium text-[#111111] inline-flex items-center gap-2 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${wishlisted ? 'fill-[#111111]' : ''}`}
                  />
                  <span>{wishlisted ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>

            {/* Primary Purchase CTAs */}
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={outOfStock}
                  onClick={handleAddToCart}
                  className="w-full py-4 px-5 bg-[#111111] text-[#FAF9F7] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#2A2A2A] disabled:bg-[#B4AEA4] transition-colors flex items-center justify-center gap-2"
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : outOfStock ? (
                    <span>Sold Out</span>
                  ) : (
                    <span>Add to Cart</span>
                  )}
                </button>

                <button
                  type="button"
                  disabled={outOfStock}
                  onClick={handleBuyNow}
                  className="w-full py-4 px-5 bg-[#FAF9F7] text-[#111111] border border-[#111111] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#111111] hover:text-[#FAF9F7] disabled:opacity-40 transition-colors"
                >
                  Buy Now
                </button>
              </div>

              {/* Dynamic WhatsApp Product Order CTA */}
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 bg-[#F3F1EC] border border-[#D8D3C9] hover:border-[#111111] text-[#111111] text-xs font-medium uppercase tracking-[0.12em] transition-colors flex items-center justify-center gap-2.5"
              >
                <MessageCircle className="w-4 h-4 text-[#15803D]" />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            {/* Trust & Delivery Strip */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#E4E0D8] text-xs text-[#4B463F]">
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 shrink-0 text-[#111111] mt-0.5" />
                <div>
                  <p className="font-medium text-[#111111]">Pan-India Delivery</p>
                  <p className="mt-0.5 text-[#6B665E]">
                    Chennai 1–2 days · India 3–5 days
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#111111] mt-0.5" />
                <div>
                  <p className="font-medium text-[#111111]">Easy 7-Day Exchange</p>
                  <p className="mt-0.5 text-[#6B665E]">
                    Hassle-free size swaps
                  </p>
                </div>
              </div>
            </div>

            {/* Structured Product Details Accordions */}
            <div className="divide-y divide-[#E4E0D8] border-b border-[#E4E0D8]">
              {/* Product Details */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenAccordion(openAccordion === 'details' ? 'care' : 'details')
                  }
                  className="w-full py-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-[#111111]"
                >
                  <span>Product Details &amp; Fabric</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordion === 'details' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'details' && (
                  <div className="pb-5 text-sm text-[#4B463F] space-y-2">
                    <p>
                      <strong className="font-medium text-[#111111]">Fabric:</strong>{' '}
                      {product.fabric}
                    </p>
                    <p>
                      <strong className="font-medium text-[#111111]">Fit:</strong>{' '}
                      {product.fit}
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 pt-1">
                      {product.details.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Care Instructions */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenAccordion(openAccordion === 'care' ? 'details' : 'care')
                  }
                  className="w-full py-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-[#111111]"
                >
                  <span>Care Instructions</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordion === 'care' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'care' && (
                  <ul className="pb-5 list-disc pl-5 text-sm text-[#4B463F] space-y-1.5">
                    {product.careInstructions.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Delivery Info */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenAccordion(openAccordion === 'delivery' ? 'details' : 'delivery')
                  }
                  className="w-full py-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-[#111111]"
                >
                  <span>Delivery &amp; Returns</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordion === 'delivery' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'delivery' && (
                  <div className="pb-5 text-sm text-[#4B463F] space-y-2 leading-relaxed">
                    <p>
                      Complimentary shipping on orders above{' '}
                      {formatINR(STORE_CONFIG.freeShippingThreshold)}. Standard shipping of{' '}
                      {formatINR(STORE_CONFIG.standardDeliveryFee)} applies below this threshold.
                    </p>
                    <p>
                      Dispatched from Chennai within 24–48 business hours. Express local delivery
                      available across Chennai neighborhoods.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section
        id="customer-reviews"
        className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20 border-t border-[#E4E0D8]"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs tracking-[0.16em] uppercase text-[#7C6A58]">
              Customer Impressions
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#111111]">
              Reviews ({product.reviews.length})
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setReviewFormOpen((prev) => !prev)}
            className="px-5 py-2.5 border border-[#111111] text-xs font-medium uppercase tracking-[0.12em] text-[#111111] hover:bg-[#111111] hover:text-[#FAF9F7] transition-colors self-start sm:self-auto"
          >
            {reviewFormOpen ? 'Cancel Review' : 'Write a Review'}
          </button>
        </div>

        {/* Write a Review Form */}
        {reviewFormOpen && (
          <form
            onSubmit={handleReviewSubmit}
            className="mb-10 p-6 sm:p-8 bg-[#F3F1EC] border border-[#E4E0D8] max-w-2xl space-y-4"
          >
            <h3 className="font-serif text-2xl text-[#111111]">Share Your Experience</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="e.g. Arjun K."
                  className="w-full bg-white border border-[#D8D3C9] px-3.5 py-2.5 text-sm focus:border-[#111111] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={reviewCity}
                  onChange={(e) => setReviewCity(e.target.value)}
                  className="w-full bg-white border border-[#D8D3C9] px-3.5 py-2.5 text-sm focus:border-[#111111] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1.5">
                  Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      aria-label={`Rate ${star} stars`}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= reviewRating
                            ? 'fill-[#111111] text-[#111111]'
                            : 'text-[#C8C2B7]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1.5">
                  Headline
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Short summary of your impression"
                  className="w-full bg-white border border-[#D8D3C9] px-3.5 py-2.5 text-sm focus:border-[#111111] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#111111] mb-1.5">
                Review
              </label>
              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Tell us about the fabric, drape, and sizing..."
                className="w-full bg-white border border-[#D8D3C9] px-3.5 py-2.5 text-sm focus:border-[#111111] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#111111] text-[#FAF9F7] text-xs font-semibold uppercase tracking-[0.12em] hover:bg-[#2A2A2A]"
            >
              Publish Review
            </button>
          </form>
        )}

        {product.reviews.length === 0 ? (
          <p className="text-sm text-[#6B665E]">
            No reviews yet for this piece. Be the first to share your thoughts.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((rev) => (
              <article
                key={rev.id}
                className="p-6 bg-white border border-[#E4E0D8] space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'fill-[#111111] text-[#111111]'
                            : 'text-[#D8D3C9]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#7A746A]">{rev.date}</span>
                </div>
                <h3 className="text-sm font-semibold text-[#111111]">{rev.title}</h3>
                <p className="text-sm text-[#4B463F] leading-relaxed">{rev.comment}</p>
                <p className="text-xs text-[#6B665E] pt-1">
                  {rev.author} · {rev.city} · Size {rev.verifiedSize}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Related Products */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20 border-t border-[#E4E0D8]">
        <div className="mb-10">
          <p className="text-xs tracking-[0.16em] uppercase text-[#7C6A58]">
            Pair It With
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#111111]">
            Complete the Wardrobe
          </h2>
        </div>
        <ProductGrid products={relatedProducts} columns={4} />
      </section>

      {/* Mobile Sticky Add-to-Cart Bar (compact 60px, well within 15% viewport cap) */}
      <div className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-[#FAF9F7]/98 backdrop-blur-md border-t border-[#E4E0D8] px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#111111] truncate">{product.name}</p>
          <p className="text-xs text-[#5C574F] tabular-nums">
            {formatINR(product.price)} · Size {selectedSize}
          </p>
        </div>
        <button
          type="button"
          disabled={outOfStock}
          onClick={handleAddToCart}
          className="px-5 py-3 bg-[#111111] text-[#FAF9F7] text-xs font-semibold uppercase tracking-[0.12em] whitespace-nowrap shrink-0 disabled:bg-[#B4AEA4]"
        >
          {outOfStock ? 'Sold Out' : addedFeedback ? 'Added' : 'Add to Bag'}
        </button>
      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Menzo Clothing Size Guide"
        >
          <div
            className="fixed inset-0 bg-black/55"
            onClick={() => setSizeGuideOpen(false)}
            aria-hidden="true"
          />
          <div className="relative bg-[#FAF9F7] w-full max-w-lg p-6 sm:p-8 border border-[#E4E0D8] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E0D8]">
              <h2 className="font-serif text-2xl text-[#111111]">
                {isBottoms ? 'Bottoms Size Guide' : 'Tops & Outerwear Size Guide'}
              </h2>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                aria-label="Close size guide"
                className="p-1 text-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="mt-4 text-xs text-[#5C574F] leading-relaxed">
              Measurements represent standard garment dimensions in inches. For our oversized
              silhouettes, take your usual size for an intentional relaxed drape.
            </p>

            <div className="mt-5 overflow-x-auto">
              {isBottoms ? (
                <table className="w-full text-left text-xs border-collapse tabular-nums">
                  <thead>
                    <tr className="border-b border-[#D8D3C9] text-[#5C574F] uppercase tracking-[0.08em]">
                      <th className="py-2.5 pr-4">Size</th>
                      <th className="py-2.5 pr-4">Waist (in)</th>
                      <th className="py-2.5 pr-4">Hip (in)</th>
                      <th className="py-2.5">Inseam (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE6DF] text-[#111111]">
                    {[
                      ['30', '30.5', '39.5', '30.0'],
                      ['32', '32.5', '41.5', '30.5'],
                      ['34', '34.5', '43.5', '31.0'],
                      ['36', '36.5', '45.5', '31.5'],
                    ].map((row) => (
                      <tr key={row[0]}>
                        <td className="py-2.5 pr-4 font-semibold">{row[0]}</td>
                        <td className="py-2.5 pr-4">{row[1]}</td>
                        <td className="py-2.5 pr-4">{row[2]}</td>
                        <td className="py-2.5">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left text-xs border-collapse tabular-nums">
                  <thead>
                    <tr className="border-b border-[#D8D3C9] text-[#5C574F] uppercase tracking-[0.08em]">
                      <th className="py-2.5 pr-4">Size</th>
                      <th className="py-2.5 pr-4">Chest (in)</th>
                      <th className="py-2.5 pr-4">Length (in)</th>
                      <th className="py-2.5">Shoulder (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE6DF] text-[#111111]">
                    {[
                      ['S', '40.0', '27.5', '18.5'],
                      ['M', '42.0', '28.5', '19.5'],
                      ['L', '44.5', '29.5', '20.5'],
                      ['XL', '47.0', '30.5', '21.5'],
                      ['XXL', '49.5', '31.5', '22.5'],
                    ].map((row) => (
                      <tr key={row[0]}>
                        <td className="py-2.5 pr-4 font-semibold">{row[0]}</td>
                        <td className="py-2.5 pr-4">{row[1]}</td>
                        <td className="py-2.5 pr-4">{row[2]}</td>
                        <td className="py-2.5">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
