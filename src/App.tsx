import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { CartProvider } from "@/contexts/CartContext";
import { Auth } from "@/components/auth/Auth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import Settings from "./pages/Settings";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import { AdminLogin } from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminSales from "./pages/admin/AdminSales";
import { AdminRedirectHandler } from "./components/admin/AdminRedirectHandler";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const [showAuth, setShowAuth] = useState(false);
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Check if we should show auth dialog from navigation state
    if (location.state?.showAuth) {
      setShowAuth(true);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<AdminRedirectHandler><Home /></AdminRedirectHandler>} />
        <Route path="/about" element={<AdminRedirectHandler><About /></AdminRedirectHandler>} />
        <Route path="/products" element={<AdminRedirectHandler><Products /></AdminRedirectHandler>} />
        <Route path="/features" element={<AdminRedirectHandler><Features /></AdminRedirectHandler>} />
        <Route path="/contact" element={<AdminRedirectHandler><Contact /></AdminRedirectHandler>} />
        <Route path="/profile" element={<AdminRedirectHandler><Profile /></AdminRedirectHandler>} />
        <Route path="/my-orders" element={<AdminRedirectHandler><MyOrders /></AdminRedirectHandler>} />
        <Route path="/settings" element={<AdminRedirectHandler><Settings /></AdminRedirectHandler>} />
        <Route path="/cart" element={<AdminRedirectHandler><Cart /></AdminRedirectHandler>} />
        <Route path="/checkout" element={<AdminRedirectHandler><Checkout /></AdminRedirectHandler>} />
        <Route path="/payment-success" element={<AdminRedirectHandler><PaymentSuccess /></AdminRedirectHandler>} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/sales" element={<AdminSales />} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminRoute && <Footer />}
      
      <Auth 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
      />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
