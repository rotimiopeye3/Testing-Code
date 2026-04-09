import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Providers from './components/Providers';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import { ParticlesBackground } from './components/common/ParticlesBackground';
import { CartFlyAnimation } from './components/common/CartFlyAnimation';
import { SupportWidget } from './components/common/SupportWidget';
import { useThemeStore } from './store/useThemeStore';
import { useEffect } from 'react';

// Pages
import LandingPage from './pages/LandingPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SellDashboardPage from './pages/SellDashboardPage';
import ListProductPage from './pages/ListProductPage';
import SettingsPage from './pages/SettingsPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import TermsPage from './pages/TermsPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <Providers>
      <Router>
        <ScrollToTop />
        <ParticlesBackground />
        <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
          <Navbar />
          <CartFlyAnimation />
          <SupportWidget />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/sell" element={<SellDashboardPage />} />
              <Route path="/sell/list" element={<ListProductPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              {/* Fallback for 404 */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Providers>
  );
}
