import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatINR, STORE_CONFIG } from '../data/storeConfig';

interface PolicyPageProps {
  type: 'privacy' | 'terms' | 'shipping';
}

const POLICY_COPY: Record<
  PolicyPageProps['type'],
  { title: string; subtitle: string; sections: { heading: string; body: string }[] }
> = {
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How Menzo Clothing handles customer contact and order information.',
    sections: [
      {
        heading: 'Information We Collect',
        body: 'When you place an order or reach out for sizing support, we collect only the details required to fulfill your order—such as your name, phone number, email address, and shipping address.',
      },
      {
        heading: 'Demo Notice',
        body: 'In this demonstration storefront, cart items, demo orders, and catalog edits are stored strictly in your browser local storage and are not transmitted to external servers.',
      },
      {
        heading: 'Customer Privacy',
        body: 'Upon production launch, Menzo Clothing will never sell or rent customer details to third parties and will process payments exclusively through PCI-compliant payment gateways.',
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Standard guidelines for shopping with Menzo Clothing.',
    sections: [
      {
        heading: 'Pricing & Availability',
        body: 'All prices are displayed in Indian Rupees (INR) inclusive of applicable taxes. Product stock and pricing are subject to updates as new collections arrive.',
      },
      {
        heading: 'Order Confirmation',
        body: 'Orders placed online or via WhatsApp are confirmed once stock availability and delivery details are verified by our Chennai dispatch team.',
      },
      {
        heading: 'Demo Catalog Disclaimer',
        body: 'Products, pricing, and descriptions displayed in this preview serve as demonstration content designed to be replaced with Menzo Clothing’s official inventory.',
      },
    ],
  },
  shipping: {
    title: 'Shipping & Returns',
    subtitle: 'Dispatch timelines across Chennai and India, plus easy size exchanges.',
    sections: [
      {
        heading: 'Shipping Rates',
        body: `Orders above ${formatINR(STORE_CONFIG.freeShippingThreshold)} qualify for complimentary standard shipping across India. Orders below this threshold carry a flat shipping fee of ${formatINR(STORE_CONFIG.standardDeliveryFee)}.`,
      },
      {
        heading: 'Delivery Timelines',
        body: 'Orders are dispatched from Chennai within 24–48 business hours. Estimated delivery is 1–2 business days within Chennai and 3–5 business days across major Indian cities.',
      },
      {
        heading: '7-Day Easy Exchange',
        body: 'Need a different size? Unused garments with original tags intact are eligible for size exchange within 7 days of delivery. Reach out via WhatsApp with your order number to initiate a quick swap.',
      },
    ],
  },
};

export const PolicyPage: React.FC<PolicyPageProps> = ({ type }) => {
  const data = POLICY_COPY[type];

  useEffect(() => {
    document.title = `${data.title} — Menzo Clothing`;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [data.title]);

  return (
    <div className="bg-[#FAF9F7] py-14 sm:py-20 min-h-[70vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="text-xs tracking-[0.16em] uppercase text-[#7C6A58]">
          Menzo Clothing · Policy
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-normal text-[#111111]">
          {data.title}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#5C574F]">{data.subtitle}</p>

        <div className="mt-10 pt-8 border-t border-[#E4E0D8] space-y-8">
          {data.sections.map((sec) => (
            <section key={sec.heading} className="space-y-2">
              <h2 className="font-serif text-2xl text-[#111111]">{sec.heading}</h2>
              <p className="text-sm sm:text-[15px] text-[#4B463F] leading-relaxed">
                {sec.body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-[#E4E0D8]">
          <Link
            to="/shop"
            className="text-xs font-medium uppercase tracking-[0.12em] text-[#111111] underline underline-offset-4 hover:opacity-70"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
