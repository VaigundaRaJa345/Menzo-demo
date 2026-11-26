import React, { useEffect, useState } from 'react';
import { Check, Instagram, Mail, MapPin, MessageCircle } from 'lucide-react';
import { buildWhatsAppGeneralUrl, STORE_CONFIG } from '../data/storeConfig';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = 'Contact — Menzo Clothing';
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="bg-[#FAF9F7] py-14 sm:py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl mb-12">
          <p className="text-xs tracking-[0.16em] uppercase text-[#7C6A58]">
            Get in Touch
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-normal text-[#111111]">
            Contact Menzo Clothing
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#5C574F] leading-relaxed">
            Have a question about sizing, availability, or an existing order? Reach us directly on
            WhatsApp or send a note below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F3F1EC] border border-[#E4E0D8] p-6 sm:p-8 space-y-6">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-4 h-4 text-[#111111] mt-1 shrink-0" />
                <div>
                  <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#111111]">
                    Location
                  </h2>
                  <p className="mt-1 text-sm text-[#4B463F]">{STORE_CONFIG.studioAddress}</p>
                  <p className="mt-0.5 text-xs text-[#6B665E]">{STORE_CONFIG.workingHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <MessageCircle className="w-4 h-4 text-[#15803D] mt-1 shrink-0" />
                <div>
                  <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#111111]">
                    WhatsApp Orders &amp; Sizing
                  </h2>
                  <p className="mt-1 text-sm text-[#4B463F]">{STORE_CONFIG.whatsappDisplay}</p>
                  <a
                    href={buildWhatsAppGeneralUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-medium text-[#111111] underline underline-offset-4 hover:opacity-70"
                  >
                    Start WhatsApp Chat
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Instagram className="w-4 h-4 text-[#111111] mt-1 shrink-0" />
                <div>
                  <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#111111]">
                    Instagram
                  </h2>
                  <a
                    href={STORE_CONFIG.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-sm text-[#4B463F] hover:text-[#111111]"
                  >
                    {STORE_CONFIG.instagramHandle}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-4 h-4 text-[#111111] mt-1 shrink-0" />
                <div>
                  <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#111111]">
                    Email
                  </h2>
                  <p className="mt-1 text-sm text-[#4B463F]">{STORE_CONFIG.contactEmail}</p>
                </div>
              </div>

              <p className="pt-4 border-t border-[#DFDAD0] text-[11px] text-[#7A746A] leading-relaxed">
                Editable placeholder details configured in{' '}
                <code className="bg-white px-1 py-0.5 text-[#111111]">src/data/storeConfig.ts</code>.
              </p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E4E0D8] p-6 sm:p-8">
              <h2 className="font-serif text-2xl text-[#111111] mb-6">Send a Message</h2>
              {sent ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-10 h-10 mx-auto bg-[#F3F1EC] flex items-center justify-center text-[#166534]">
                    <Check className="w-5 h-5" />
                  </div>
                  <p className="font-serif text-2xl text-[#111111]">Message Received</p>
                  <p className="text-sm text-[#5C574F] max-w-md mx-auto">
                    Thank you for reaching out to Menzo Clothing. Our Chennai support team will
                    respond shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-3 text-xs font-medium uppercase tracking-[0.12em] underline underline-offset-4 text-[#111111]"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cnt-name" className="block text-xs font-medium text-[#111111] mb-1.5">
                        Your Name *
                      </label>
                      <input
                        id="cnt-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#FAF9F7] border border-[#D8D3C9] px-3.5 py-3 text-sm focus:border-[#111111] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="cnt-email" className="block text-xs font-medium text-[#111111] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        id="cnt-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#FAF9F7] border border-[#D8D3C9] px-3.5 py-3 text-sm focus:border-[#111111] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cnt-msg" className="block text-xs font-medium text-[#111111] mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="cnt-msg"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Sizing help, bulk inquiry, or order question..."
                      className="w-full bg-[#FAF9F7] border border-[#D8D3C9] px-3.5 py-3 text-sm focus:border-[#111111] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-7 py-3.5 bg-[#111111] text-[#FAF9F7] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#2A2A2A] transition-colors"
                  >
                    Send Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
