import React from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ToastBanner } from './components/ToastBanner';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PolicyPage } from './pages/PolicyPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const StorefrontLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F7] text-[#111111]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <QuickViewModal />
      <WhatsAppButton />
      <ToastBanner />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Storefront Routes */}
          <Route element={<StorefrontLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage mode="shop" />} />
            <Route path="/new-arrivals" element={<ShopPage mode="new-arrivals" />} />
            <Route path="/collections" element={<ShopPage mode="collections" />} />
            <Route path="/collections/:slug" element={<ShopPage mode="collections" />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PolicyPage type="privacy" />} />
            <Route path="/terms" element={<PolicyPage type="terms" />} />
            <Route path="/shipping" element={<PolicyPage type="shipping" />} />
          </Route>

          {/* Dedicated Demo Admin Route (Not exposed in public navigation) */}
          <Route
            path="/admin"
            element={
              <>
                <AdminDashboardPage />
                <ToastBanner />
              </>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
