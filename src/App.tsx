import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SellerDashboard from "./pages/seller/SellerDashboard";
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import TransporterDashboard from "./pages/transporter/TransporterDashboard";
import InventoryManagement from "./pages/seller/InventoryManagement";
import NewInventoryItem from "./pages/seller/NewInventoryItem";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* General dashboard route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Seller routes */}
          <Route
            path="/seller"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/inventory"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <InventoryManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/inventory/new"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <NewInventoryItem />
              </ProtectedRoute>
            }
          />

          {/* Buyer routes */}
          <Route
            path="/buyer/*"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Transporter routes */}
          <Route
            path="/transporter/*"
            element={
              <ProtectedRoute allowedRoles={["transporter"]}>
                <TransporterDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
