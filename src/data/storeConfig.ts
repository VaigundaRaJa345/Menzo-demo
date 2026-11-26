/**
 * Centralized Storefront Configuration for Menzo Clothing
 * Replace the editable placeholder values below before production launch.
 */
export const STORE_CONFIG = {
  brandName: 'Menzo Clothing',
  city: 'Chennai',
  state: 'Tamil Nadu',
  country: 'India',
  logoUrl: '/assets/aistudio/image_e9d637cf.png',

  // Editable WhatsApp business contact placeholder (country code + 10-digit number, no +)
  whatsappNumber: '919840000000',
  whatsappDisplay: '+91 98400 00000 (Placeholder)',

  // Editable social & contact placeholders
  instagramHandle: '@menzoclothing',
  instagramUrl: 'https://instagram.com/menzoclothing',
  contactEmail: 'hello@menzoclothing-demo.example',
  studioAddress: 'Chennai, Tamil Nadu, India (Update with store address)',
  workingHours: 'Mon – Sat · 10:00 AM – 8:00 PM IST',

  // Commerce thresholds (INR)
  currencySymbol: '₹',
  freeShippingThreshold: 1999,
  standardDeliveryFee: 99,

  // Editable Razorpay integration placeholder for future production checkout
  razorpay: {
    enabledInDemo: false,
    keyIdPlaceholder: 'rzp_test_MENZO_REPLACE_ME',
    modeLabel: 'Ready for Razorpay UPI, Cards & Netbanking Integration',
  },
} as const;

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function buildWhatsAppOrderUrl(params: {
  productName: string;
  size: string;
  quantity: number;
  price: number;
}): string {
  const message = `Hi ${STORE_CONFIG.brandName}! I'm interested in ordering the ${params.productName}. Size: ${params.size}. Quantity: ${params.quantity}. Price: ${formatINR(params.price * params.quantity)}. Please share the ordering details.`;
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppGeneralUrl(customMessage?: string): string {
  const message =
    customMessage ||
    `Hi ${STORE_CONFIG.brandName}! I'm browsing your online store and would love assistance with sizing and placing an order.`;
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
