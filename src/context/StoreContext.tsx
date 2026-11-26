import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_DEMO_ORDERS, INITIAL_PRODUCTS } from '../data/products';
import { STORE_CONFIG } from '../data/storeConfig';
import {
  CartItem,
  CustomerDetails,
  OrderRecord,
  OrderStatus,
  Product,
  ProductReview,
} from '../types';

const STORAGE_KEYS = {
  products: 'menzo_products_v1',
  cart: 'menzo_cart_v1',
  wishlist: 'menzo_wishlist_v1',
  orders: 'menzo_orders_v1',
};

interface ToastState {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface StoreContextValue {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: OrderRecord[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  toast: ToastState | null;
  showToast: (message: string, actionLabel?: string, onAction?: () => void) => void;
  dismissToast: () => void;

  // Cart operations
  addToCart: (product: Product, size: string, quantity?: number, openDrawer?: boolean) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  updateCartItemSize: (cartItemId: string, newSize: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  deliveryCharge: number;
  cartTotal: number;

  // Wishlist operations
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Reviews
  addProductReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;

  // Checkout / Orders
  placeDemoOrder: (
    customer: CustomerDetails,
    paymentMethod: OrderRecord['paymentMethod']
  ) => OrderRecord;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Admin product CRUD
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'reviews' | 'popularityScore'>) => Product;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  resetDemoCatalog: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage<Product[]>(STORAGE_KEYS.products, INITIAL_PRODUCTS)
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadFromStorage<CartItem[]>(STORAGE_KEYS.cart, [])
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    loadFromStorage<string[]>(STORAGE_KEYS.wishlist, [])
  );
  const [orders, setOrders] = useState<OrderRecord[]>(() =>
    loadFromStorage<OrderRecord[]>(STORAGE_KEYS.orders, INITIAL_DEMO_ORDERS)
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
    } catch {
      // Ignore storage quota errors in private browsing
    }
  }, [products]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
    } catch {
      // Ignore storage quota errors
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    } catch {
      // Ignore storage quota errors
    }
  }, [orders]);

  const showToast = (message: string, actionLabel?: string, onAction?: () => void) => {
    const id = Date.now();
    setToast({ id, message, actionLabel, onAction });
    window.setTimeout(() => {
      setToast((prev) => (prev && prev.id === id ? null : prev));
    }, 3600);
  };

  const dismissToast = () => setToast(null);

  const addToCart = (
    product: Product,
    size: string,
    quantity = 1,
    openDrawer = false
  ) => {
    const itemId = `${product.id}__${size}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images[0] || '',
          color: product.color,
          size,
          availableSizes: product.sizes,
          quantity,
        },
      ];
    });

    if (openDrawer) {
      setIsCartOpen(true);
    } else {
      showToast(`Added ${product.name} (${size}) to bag`, 'View Bag', () => setIsCartOpen(true));
    }
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const updateCartItemSize = (cartItemId: string, newSize: string) => {
    setCart((prev) => {
      const target = prev.find((item) => item.id === cartItemId);
      if (!target || target.size === newSize) return prev;
      const newId = `${target.productId}__${newSize}`;
      const duplicate = prev.find((item) => item.id === newId);
      if (duplicate) {
        return prev
          .filter((item) => item.id !== cartItemId)
          .map((item) =>
            item.id === newId
              ? { ...item, quantity: item.quantity + target.quantity }
              : item
          );
      }
      return prev.map((item) =>
        item.id === cartItemId ? { ...item, id: newId, size: newSize } : item
      );
    });
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from saved items');
        return prev.filter((id) => id !== productId);
      }
      showToast('Saved to your wishlist');
      return [...prev, productId];
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const addProductReview = (
    productId: string,
    review: Omit<ProductReview, 'id' | 'date'>
  ) => {
    const newReview: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, reviews: [newReview, ...p.reviews] } : p
      )
    );
    showToast('Thank you — your review has been published');
  };

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const deliveryCharge = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return cartSubtotal >= STORE_CONFIG.freeShippingThreshold
      ? 0
      : STORE_CONFIG.standardDeliveryFee;
  }, [cartSubtotal]);

  const cartTotal = cartSubtotal + deliveryCharge;

  const placeDemoOrder = (
    customer: CustomerDetails,
    paymentMethod: OrderRecord['paymentMethod']
  ): OrderRecord => {
    const nextNum = 1043 + orders.length;
    const order: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: `MNZ-${nextNum}`,
      createdAt: new Date().toISOString(),
      customer,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryCharge,
      total: cartTotal,
      paymentMethod,
      status: 'Confirmed',
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    return order;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast(`Order status updated to ${status}`);
  };

  const addProduct = (
    input: Omit<Product, 'id' | 'createdAt' | 'reviews' | 'popularityScore'>
  ): Product => {
    const newProd: Product = {
      ...input,
      id: `mnz-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      popularityScore: 80,
      reviews: [],
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Added "${newProd.name}" to catalog`);
    return newProd;
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
    showToast('Product updated successfully');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from catalog');
  };

  const resetDemoCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    showToast('Demo catalog restored to defaults');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        setQuickViewProduct,
        toast,
        showToast,
        dismissToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateCartItemSize,
        clearCart,
        cartCount,
        cartSubtotal,
        deliveryCharge,
        cartTotal,
        toggleWishlist,
        isWishlisted,
        addProductReview,
        placeDemoOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        resetDemoCatalog,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
