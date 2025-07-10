
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import UserLayout from './pages/UserLayout';
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import InventoryPage from './pages/admin/InventoryPage';
import OrdersPage from './pages/admin/OrdersPage';
import ReviewsPage from './pages/admin/ReviewsPage';
import SettingsPage from './pages/admin/SettingsPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CustomerAuthPage from './pages/CustomerAuthPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import SearchResultsPage from './pages/SearchResultsPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import ProfilePage from './pages/ProfilePage';
import WelcomePage from './pages/WelcomePage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />

        {/* Customer Facing Routes */}
        <Route element={<UserLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Auth and Admin Routes */}
        <Route path="/login" element={<CustomerAuthPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

      </Routes>
    </HashRouter>
  );
};

export default App;
