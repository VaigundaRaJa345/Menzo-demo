import React from 'react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppGeneralUrl } from '../data/storeConfig';

export const WhatsAppButton: React.FC = () => {
  const href = buildWhatsAppGeneralUrl();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order or chat with Menzo Clothing on WhatsApp"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 inline-flex items-center gap-2.5 bg-[#111111] text-[#FAF9F7] px-4 py-3 border border-white/15 shadow-lg hover:bg-[#1E1E1E] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] group"
    >
      <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 transition-transform duration-200 group-hover:scale-105" />
      <span className="text-xs font-medium tracking-[0.06em] whitespace-nowrap hidden sm:inline">
        WhatsApp Stylist
      </span>
    </a>
  );
};
