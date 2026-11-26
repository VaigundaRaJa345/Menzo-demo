import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Instagram,
} from 'lucide-react';
import {
  EDITORIAL_MEDIA,
  FEATURED_COLLECTIONS,
  INSTAGRAM_GALLERY,
} from '../data/products';
import { STORE_CONFIG } from '../data/storeConfig';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ProductGrid } from '../components/ProductGrid';
import { SafeImage } from '../components/SafeImage';

export const HomePage: React.FC = () => {
  const { products } = useStore();
  const bestSellerTrackRef = useRef<HTMLDivElement>(null);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    document.title = 'Menzo Clothing — Contemporary Menswear & Everyday Essentials | Chennai';
  }, []);

  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 8);
  const bestSellers = products.filter((p) => p.isBestSeller);

  const scrollBestSellers = (direction: 'left' | 'right') => {
    const el = bestSellerTrackRef.current;
    if (!el) return;
    const distance = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <div className="bg-[#FAF9F7]">
      {/* 1. Editorial Campaign Hero */}
      <section className="relative w-full min-h-[76vh] lg:min-h-[84vh] flex items-end overflow-hidden bg-[#181715]">
        <SafeImage
          src={EDITORIAL_MEDIA.heroCampaign}
          alt="Menzo Clothing contemporary menswear campaign in architectural sandstone courtyard"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Measured contrast scrim for 4.5:1+ legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/15"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pb-14 sm:pb-20 pt-28">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.2em] uppercase text-[#EAE6DF]/90 mb-4">
              Menzo Clothing · Chennai
            </p>
            <h1 className="font-serif text-[clamp(2.75rem,6vw,5.25rem)] font-normal text-white leading-[1.02] tracking-[-0.01em]">
              Style That Speaks.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[#EAE6DF]/90 max-w-lg leading-relaxed font-normal">
              Discover everyday essentials and statement pieces designed for your lifestyle.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                to="/shop"
                className="px-7 py-3.5 bg-[#FAF9F7] text-[#111111] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-white transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/new-arrivals"
                className="px-7 py-3.5 bg-transparent text-white border border-white/60 text-xs font-medium uppercase tracking-[0.14em] hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
              >
                Explore New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Collections */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs tracking-[0.16em] uppercase text-[#7C6A58]">
              Curated Edits
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#111111]">
              Featured Collections
            </h2>
          </div>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-[#111111] hover:opacity-70 transition-opacity whitespace-nowrap"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {FEATURED_COLLECTIONS.map((col) => (
            <Link
              key={col.slug}
              to={`/collections/${col.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-[#ECE9E2] block"
            >
              <SafeImage
                src={col.image}
                alt={col.title}
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="font-serif text-2xl font-normal leading-tight">
                  {col.title}
                </h3>
                <p className="mt-1.5 text-xs text-[#EAE6DF]/85 leading-relaxed line-clamp-2">
                  {col.subtitle}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] border-b border-white/70 pb-0.5 group-hover:gap-2.5 transition-all">
                  <span>Shop Now</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. New Arrivals Product Grid */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20 border-t border-[#E4E0D8]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs tracking-[0.16em] uppercase text-[#7C6A58]">
              Latest Drop
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#111111]">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/new-arrivals"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-[#111111] hover:opacity-70 transition-opacity whitespace-nowrap"
          >
            <span>Explore All New Arrivals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid products={newArrivals} columns={4} />
      </section>

      {/* 4. Best Sellers Carousel */}
      <section className="bg-[#F3F1EC] border-y border-[#E4E0D8] py-16 sm:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-[#7C6A58]">
                Most Requested
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#111111]">
                Best Sellers
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollBestSellers('left')}
                aria-label="Scroll best sellers left"
                className="w-10 h-10 border border-[#D8D3C9] bg-[#FAF9F7] text-[#111111] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollBestSellers('right')}
                aria-label="Scroll best sellers right"
                className="w-10 h-10 border border-[#D8D3C9] bg-[#FAF9F7] text-[#111111] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-colors flex items-center justify-center"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={bestSellerTrackRef}
            className="flex gap-5 lg:gap-7 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2"
          >
            {bestSellers.map((product) => (
              <div
                key={product.id}
                className="w-[74vw] sm:w-[44vw] md:w-[31vw] lg:w-[23.5%] shrink-0 snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Brand Story — Balanced 2-Column Editorial Split */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <div className="lg:col-span-6 overflow-hidden bg-[#ECE9E2] min-h-[340px]">
            <SafeImage
              src={EDITORIAL_MEDIA.brandStory}
              alt="Menzo Clothing minimalist garment rack with linen and cotton essentials"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center py-2 lg:py-8">
            <p className="text-xs tracking-[0.16em] uppercase text-[#7C6A58]">
              Our Philosophy · Chennai
            </p>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl font-normal text-[#111111] leading-[1.08]">
              More Than Just Clothing.
            </h2>
            <p className="mt-6 text-[15px] sm:text-base text-[#4B463F] leading-relaxed max-w-xl">
              At Menzo Clothing, every piece begins with how it feels when you step out the door.
              We focus on clean proportions, breathable natural fabrics, and neutral palettes that
              let personal style take the lead without unnecessary noise.
            </p>
            <p className="mt-4 text-[15px] sm:text-base text-[#4B463F] leading-relaxed max-w-xl">
              From heavyweight everyday tees and airy coastal linens to structured evening layers,
              our garments are thoughtfully curated for comfort, individuality, and effortless daily
              wear.
            </p>

            <div className="mt-8 pt-8 border-t border-[#E4E0D8] grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="font-serif text-2xl text-[#111111]">Breathable</p>
                <p className="mt-1 text-xs text-[#6B665E]">Cotton &amp; linen weaves</p>
              </div>
              <div>
                <p className="font-serif text-2xl text-[#111111]">Modern Fit</p>
                <p className="mt-1 text-xs text-[#6B665E]">Relaxed &amp; tailored cuts</p>
              </div>
              <div>
                <p className="font-serif text-2xl text-[#111111]">Direct Care</p>
                <p className="mt-1 text-xs text-[#6B665E]">Online &amp; WhatsApp support</p>
              </div>
            </div>

            <div className="mt-9">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#111111] text-[#111111] text-xs font-medium uppercase tracking-[0.12em] hover:bg-[#111111] hover:text-[#FAF9F7] transition-colors"
              >
                <span>Read Our Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Instagram-Inspired Community Lookbook */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20 border-t border-[#E4E0D8]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs tracking-[0.16em] uppercase text-[#7C6A58]">
              Community &amp; Lookbook
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#111111]">
              Follow Your Style.
            </h2>
          </div>

          <a
            href={STORE_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-[#111111] hover:opacity-70 transition-opacity whitespace-nowrap"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow {STORE_CONFIG.instagramHandle}</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INSTAGRAM_GALLERY.map((post) => (
            <Link
              key={post.id}
              to={`/product/${post.productSlug}`}
              className="group relative aspect-[4/5] overflow-hidden bg-[#ECE9E2] block"
            >
              <SafeImage
                src={post.image}
                alt={post.caption}
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 flex flex-col justify-end text-white">
                <p className="text-[11px] leading-snug text-[#EAE6DF] line-clamp-2">
                  {post.caption}
                </p>
                <span className="mt-2 text-[10px] uppercase tracking-[0.14em] font-medium underline underline-offset-4">
                  Shop {post.productLabel}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Newsletter Section */}
      <section className="bg-[#F3F1EC] border-t border-[#E4E0D8] py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs tracking-[0.16em] uppercase text-[#7C6A58]">
            Private Access
          </p>
          <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-normal text-[#111111]">
            Stay Ahead of the Style Curve.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#5C574F] leading-relaxed">
            Receive early invitations to new Menzo Clothing drops, seasonal restocks, and private
            editorial previews directly in your inbox.
          </p>

          {subscribed ? (
            <div className="mt-8 inline-flex items-center gap-2.5 bg-white border border-[#D8D3C9] px-6 py-4 text-sm text-[#111111]">
              <Check className="w-4 h-4 text-[#15803D]" />
              <span>You&apos;re on the Menzo list. Watch your inbox for our next drop.</span>
            </div>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white border border-[#D8D3C9] px-4 py-3.5 text-sm text-[#111111] placeholder:text-[#8A8378] focus:border-[#111111] focus:outline-none"
              />
              <button
                type="submit"
                className="px-7 py-3.5 bg-[#111111] text-[#FAF9F7] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#2A2A2A] transition-colors whitespace-nowrap shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
