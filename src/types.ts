export type ProductCategory =
  | 'T-Shirts'
  | 'Shirts'
  | 'Hoodies & Outerwear'
  | 'Polos'
  | 'Bottoms';

export type CollectionSlug =
  | 'new-arrivals'
  | 'everyday-essentials'
  | 'trending-styles'
  | 'best-sellers';

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedSize: string;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  category: ProductCategory;
  collections: CollectionSlug[];
  price: number;
  originalPrice?: number;
  color: string;
  sizes: string[];
  images: string[];
  shortDescription: string;
  description: string;
  details: string[];
  careInstructions: string[];
  fabric: string;
  fit: string;
  isNewArrival: boolean;
  isBestSeller: boolean;
  popularityScore: number;
  stockStatus: StockStatus;
  stockCount: number;
  createdAt: string;
  reviews: ProductReview[];
}

export interface CartItem {
  id: string; // `${productId}__${size}`
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  availableSizes: string[];
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

export type OrderStatus = 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: 'COD (Demo)' | 'Razorpay (Demo Placeholder)';
  status: OrderStatus;
}

export interface CollectionCardMeta {
  slug: CollectionSlug;
  title: string;
  subtitle: string;
  image: string;
}
