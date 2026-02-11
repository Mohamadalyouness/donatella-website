import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Items from "./pages/Items";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Products from "./components/ProductCard";
import Chocolate from "./pages/items/chocolate";
import Powder from "./pages/items/Powder";
import Others from "./pages/items/others";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardProducts from "./pages/dashboard/DashboardProducts";
import ProtectedRoute from "./routes/ProtectedRoute";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./pages/Login";
import { ProductsProvider } from "./context/ProductsContext";

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />

        <Route path="/items" element={<Items />}>
          <Route index element={<Navigate to="chocolate" replace />} />
          <Route path="chocolate" element={<Chocolate />} />
          <Route path="powder" element={<Powder />} />
          <Route path="others" element={<Others />} />
          <Route path="products" element={<Products />} />
        </Route>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<DashboardProducts />} />
        </Route>
      </Routes>
      {!isDashboard && <Footer />}
    </>
  );
}

function App() {
  return (
    <ProductsProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </ProductsProvider>
  );
}

export default App;
