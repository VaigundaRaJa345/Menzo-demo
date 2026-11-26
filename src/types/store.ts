export type ProductCategory =
  | 'T-Shirts'
  | 'Shirts'
  | 'Hoodies & Outerwear'
  | 'Polos'
  | 'Trousers';

export type CollectionSlug =
  | 'new-arrivals'
  | 'everyday-essentials'
  | 'trending-styles'
  | 'best-sellers';

export type ClothingSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  collections: CollectionSlug[];
  price: number;
  originalPrice?: number;
  sizes: ClothingSize[];
  inStock: boolean;
  stockCount: number;
  isNewArrival: boolean;
  isBestSeller: boolean;
  popularity: number;
  createdAt: string;
  images: string[];
  colorName: string;
  fabric: string;
  fit: string;
  description: string;
  details: string[];
  careInstructions: string[];
  reviews: ProductReview[];
}

export interface CartItem {
  key: string; // `${productId}__${size}`
  productId: string;
  size: ClothingSize;
  quantity: number;
}

export type OrderStatus =
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  price: number;
  size: ClothingSize;
  quantity: number;
  image: string;
}

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: OrderCustomer;
  items: OrderItemSnapshot[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: 'Demo Checkout (Simulated)' | 'Razorpay Placeholder (Demo)';
  status: OrderStatus;
}

export interface StoreSettings {
  brandName: string;
  location: string;
  whatsappNumber: string; // Digits only with country code, e.g. 919840000000
  whatsappDisplay: string;
  instagramHandle: string;
  instagramUrl: string;
  contactEmail: string;
  freeShippingThreshold: number;
  standardShippingCharge: number;
  razorpayKeyPlaceholder: string;
  announcementText: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  subtext?: string;
}
