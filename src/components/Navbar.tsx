import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { STORE_CONFIG } from '../data/storeConfig';
import { useStore } from '../context/StoreContext';
import { SafeImage } from './SafeImage';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'Collections', to: '/collections' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const Navbar: React.FC = () => {
  const { cartCount, setIsCartOpen } = useStore();
  const navigate = useNavigate();

  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    setSearchOpen(false);
    setMobileMenuOpen(false);
    if (trimmed) {
      navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <div className="sticky top-0 z-40 w-full">
      {/* Slim Dismissible Announcement Bar (<= 36px) */}
      {showAnnouncement && (
        <div className="bg-[#111111] text-[#FAF9F7] px-4 py-2 text-center relative">
          <p className="text-[11px] sm:text-xs tracking-[0.08em] text-[#EAE6DF] pr-6">
            Discover Your Next Favorite Style
            <span className="mx-2 text-[#7C6A58]" aria-hidden="true">
              ·
            </span>
            <span className="hidden sm:inline">
              Complimentary India-wide shipping on orders over ₹1,999
            </span>
            <span className="sm:hidden">Free shipping over ₹1,999</span>
          </p>
          <button
            type="button"
            onClick={() => setShowAnnouncement(false)}
            aria-label="Dismiss announcement"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#A7A197] hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Sticky Editorial Navigation Bar */}
      <header className="bg-[#FAF9F7]/95 backdrop-blur-md border-b border-[#E4E0D8]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
          {/* Left Zone: Mobile menu trigger + Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 -ml-2 text-[#111111] hover:opacity-70 transition-opacity"
            >
              <Menu className="w-5 h-5 stroke-[1.75]" />
            </button>

            <Link
              to="/"
              className="flex items-center gap-3 whitespace-nowrap shrink-0 group"
              aria-label="Menzo Clothing Home"
            >
              <span className="w-9 h-9 bg-[#111111] flex items-center justify-center overflow-hidden shrink-0">
                <SafeImage
                  src={STORE_CONFIG.logoUrl}
                  alt="Menzo Clothing monogram logo"
                  className="w-full h-full object-cover"
                />
              </span>
              <span className="font-serif text-xl sm:text-[22px] font-medium tracking-[0.12em] uppercase text-[#111111] leading-none">
                Menzo
              </span>
            </Link>
          </div>

          {/* Center Zone: Clean Single-Line Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-7 xl:gap-9"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `text-[13px] tracking-[0.04em] whitespace-nowrap shrink-0 py-1 border-b transition-colors duration-150 ${
                    isActive
                      ? 'text-[#111111] font-medium border-[#111111]'
                      : 'text-[#5C574F] border-transparent hover:text-[#111111] hover:border-[#111111]/40'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Zone: Search & Shopping Bag */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Search catalog"
              aria-expanded={searchOpen}
              className="w-10 h-10 flex items-center justify-center text-[#111111] hover:bg-[#F3F1EC] transition-colors"
            >
              {searchOpen ? (
                <X className="w-[18px] h-[18px] stroke-[1.75]" />
              ) : (
                <Search className="w-[18px] h-[18px] stroke-[1.75]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open shopping bag with ${cartCount} items`}
              className="h-10 px-3 flex items-center gap-2 text-[#111111] hover:bg-[#F3F1EC] transition-colors whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-[18px] h-[18px] stroke-[1.75]" />
              <span className="text-xs font-medium tabular-nums">
                Bag ({cartCount})
              </span>
            </button>
          </div>
        </div>

        {/* Inline Expandable Editorial Search Bar */}
        {searchOpen && (
          <div className="border-t border-[#E4E0D8] bg-[#FAF9F7]">
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-3xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3"
            >
              <Search className="w-4 h-4 text-[#5C574F] shrink-0" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search oversized tees, linen shirts, hoodies, trousers..."
                autoFocus
                className="w-full bg-transparent text-sm text-[#111111] placeholder:text-[#8B8479] focus:outline-none py-1"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#111111] text-[#FAF9F7] text-xs font-medium tracking-[0.06em] hover:bg-[#2A2A2A] transition-colors whitespace-nowrap shrink-0"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-[1px]"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-[84vw] max-w-xs bg-[#FAF9F7] h-full flex flex-col justify-between shadow-2xl border-r border-[#E4E0D8]">
            <div>
              <div className="px-5 h-16 flex items-center justify-between border-b border-[#E4E0D8]">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 bg-[#111111] flex items-center justify-center overflow-hidden">
                    <SafeImage
                      src={STORE_CONFIG.logoUrl}
                      alt="Menzo Clothing logo"
                      className="w-full h-full object-cover"
                    />
                  </span>
                  <span className="font-serif text-lg tracking-[0.12em] uppercase font-medium">
                    Menzo
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-2 -mr-2 text-[#111111]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <form
                onSubmit={handleSearchSubmit}
                className="p-5 border-b border-[#E4E0D8] flex items-center gap-2"
              >
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pieces..."
                  className="w-full bg-[#F3F1EC] px-3 py-2.5 text-sm text-[#111111] placeholder:text-[#7A746A] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="px-3.5 py-2.5 bg-[#111111] text-white"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              <nav className="py-3 px-2 flex flex-col">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-3.5 text-[15px] transition-colors border-b border-[#EFECE6] ${
                        isActive
                          ? 'text-[#111111] font-semibold bg-[#F3F1EC]/70'
                          : 'text-[#4B463F] hover:text-[#111111]'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="p-5 border-t border-[#E4E0D8] bg-[#F3F1EC]/60 space-y-2 text-xs text-[#5C574F]">
              <p className="font-medium text-[#111111]">Menzo Clothing · Chennai</p>
              <p>{STORE_CONFIG.workingHours}</p>
              <p>{STORE_CONFIG.instagramHandle}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
