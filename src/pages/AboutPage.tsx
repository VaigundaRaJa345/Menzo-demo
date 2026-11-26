import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { EDITORIAL_MEDIA } from '../data/products';
import { SafeImage } from '../components/SafeImage';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'About Us — Menzo Clothing';
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return (
    <div className="bg-[#FAF9F7]">
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20 border-b border-[#E4E0D8]">
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.16em] uppercase text-[#7C6A58]">
            About Menzo Clothing · Chennai
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-6xl font-normal text-[#111111] leading-[1.06]">
            More Than Just Clothing.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[#4B463F] leading-relaxed">
            Menzo Clothing is a Chennai-based contemporary fashion brand built around a simple
            belief: everyday clothing should feel effortless, look sharp, and leave room for your
            individuality.
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <div className="lg:col-span-6 aspect-[4/3] lg:aspect-auto overflow-hidden bg-[#ECE9E2]">
            <SafeImage
              src={EDITORIAL_MEDIA.brandStory}
              alt="Menzo Clothing garments in neutral linen and heavyweight cotton"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center space-y-5 text-[15px] text-[#4B463F] leading-relaxed">
            <h2 className="font-serif text-3xl sm:text-4xl text-[#111111]">
              Designed for Everyday Presence
            </h2>
            <p>
              Whether you are dressing for a busy weekday, a relaxed evening with friends, or a
              weekend getaway, our pieces are selected to mix and layer naturally. We lean into
              clean silhouettes, breathable cotton and linen weaves, and grounded tones of obsidian,
              bone, sand, and charcoal.
            </p>
            <p>
              Instead of chasing loud seasonal gimmicks, Menzo Clothing focuses on reliable comfort,
              honest proportions, and modern essentials you will keep reaching for week after week.
            </p>
            <p className="text-xs text-[#7A746A] pt-2">
              Note: Brand copy on this page can be customized directly with Menzo Clothing&apos;s
              official story and studio milestones prior to launch.
            </p>
            <div className="pt-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#111111] text-[#FAF9F7] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#2A2A2A] transition-colors"
              >
                <span>Explore the Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="bg-[#F3F1EC] border-t border-[#E4E0D8] py-16 sm:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-2.5">
              <p className="text-xs tracking-[0.14em] uppercase text-[#7C6A58]">01. Fabric First</p>
              <h3 className="font-serif text-2xl text-[#111111]">Climate-Mindful Comfort</h3>
              <p className="text-sm text-[#5C574F] leading-relaxed">
                Breathable combed cottons, airy linen blends, and structured French terry tailored
                for Indian weather and year-round versatility.
              </p>
            </div>
            <div className="space-y-2.5">
              <p className="text-xs tracking-[0.14em] uppercase text-[#7C6A58]">02. Clean Silhouettes</p>
              <h3 className="font-serif text-2xl text-[#111111]">Intentional Proportions</h3>
              <p className="text-sm text-[#5C574F] leading-relaxed">
                Relaxed drop shoulders, crisp collars, and fluid pleats designed to drape cleanly
                without feeling stiff or overstated.
              </p>
            </div>
            <div className="space-y-2.5">
              <p className="text-xs tracking-[0.14em] uppercase text-[#7C6A58]">03. Direct Connection</p>
              <h3 className="font-serif text-2xl text-[#111111]">Personal Styling Support</h3>
              <p className="text-sm text-[#5C574F] leading-relaxed">
                Seamless online shopping backed by direct WhatsApp sizing assistance so every order
                arrives feeling right from the first wear.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
