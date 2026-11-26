import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, MessageCircle } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { buildWhatsAppGeneralUrl, STORE_CONFIG } from '../data/storeConfig';
import { SafeImage } from './SafeImage';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111111] text-[#EAE6DF] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3.5 group">
              <div className="w-14 h-14 bg-black border border-white/15 overflow-hidden shrink-0">
                <SafeImage
                  src={STORE_CONFIG.logoUrl}
                  alt="Menzo Clothing Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="block font-serif text-2xl tracking-[0.14em] uppercase text-white leading-none">
                  Menzo
                </span>
                <span className="block text-[11px] tracking-[0.22em] uppercase text-[#A7A197] mt-1">
                  Clothing
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#B4AEA4] leading-relaxed max-w-sm">
              Contemporary menswear and everyday essentials crafted with clean silhouettes,
              breathable fabrics, and understated presence. Based in {STORE_CONFIG.city},{' '}
              {STORE_CONFIG.state}.
            </p>
            <div className="flex items-center gap-4 pt-1">
              <a
                href={STORE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-[#EAE6DF] hover:text-white border border-white/15 px-3.5 py-2 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>{STORE_CONFIG.instagramHandle}</span>
              </a>
              <a
                href={buildWhatsAppGeneralUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-[#EAE6DF] hover:text-white border border-white/15 px-3.5 py-2 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-medium tracking-[0.14em] uppercase text-[#9A9389]">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-[#D6D1C9]">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-white transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop Categories */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-medium tracking-[0.14em] uppercase text-[#9A9389]">
              Shop Categories
            </h3>
            <ul className="space-y-2.5 text-sm text-[#D6D1C9]">
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(category)}`}
                    className="hover:text-white transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Policies */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-medium tracking-[0.14em] uppercase text-[#9A9389]">
              Customer Care
            </h3>
            <ul className="space-y-3 text-sm text-[#B4AEA4]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#8E877D]" />
                <span>{STORE_CONFIG.studioAddress}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#8E877D]" />
                <span>{STORE_CONFIG.whatsappDisplay}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 shrink-0 mt-0.5 text-[#8E877D]" />
                <span>{STORE_CONFIG.contactEmail}</span>
              </li>
            </ul>
            <p className="text-[11px] text-[#7F7970] leading-relaxed pt-1">
              Demo storefront concept. Contact numbers, handles, and catalog entries are editable
              placeholders ready for Menzo Clothing&apos;s official details.
            </p>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="mt-14 pt-7 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#9A9389]">
          <p>© {new Date().getFullYear()} Menzo Clothing. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/shipping" className="hover:text-white transition-colors">
              Shipping &amp; Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
