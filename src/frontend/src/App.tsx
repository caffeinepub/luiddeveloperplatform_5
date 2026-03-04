import { Navbar } from "@/components/Navbar";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, type Product, useAuth } from "@/contexts/AuthContext";
import { AdminPage } from "@/pages/AdminPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { LandingPage } from "@/pages/LandingPage";
import { LicensesPage } from "@/pages/LicensesPage";
import { LoginPage } from "@/pages/LoginPage";
import { MarketplacePage } from "@/pages/MarketplacePage";
import { OrdersPage } from "@/pages/OrdersPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { useState } from "react";

export type PageId =
  | "landing"
  | "marketplace"
  | "dashboard"
  | "licenses"
  | "orders"
  | "login"
  | "register"
  | "admin";

function AppInner() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageId>("landing");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const navigate = (page: PageId) => {
    // Guard protected routes
    if (
      !user &&
      (page === "dashboard" ||
        page === "licenses" ||
        page === "orders" ||
        page === "admin")
    ) {
      setCurrentPage("login");
      return;
    }
    if (page === "admin" && user?.role !== "admin") {
      setCurrentPage("dashboard");
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <main>
        {currentPage === "landing" && (
          <LandingPage onNavigate={navigate} onOpenProduct={openProduct} />
        )}
        {currentPage === "login" && <LoginPage onNavigate={navigate} />}
        {currentPage === "register" && <RegisterPage onNavigate={navigate} />}
        {currentPage === "dashboard" && <DashboardPage onNavigate={navigate} />}
        {currentPage === "marketplace" && (
          <MarketplacePage onNavigate={navigate} />
        )}
        {currentPage === "orders" && <OrdersPage onNavigate={navigate} />}
        {currentPage === "licenses" && <LicensesPage onNavigate={navigate} />}
        {currentPage === "admin" && <AdminPage onNavigate={navigate} />}
      </main>

      {/* Global product detail modal (from landing page) */}
      <ProductDetailModal
        product={selectedProduct}
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onNavigate={navigate}
      />

      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "glass-card border-border text-foreground",
            title: "text-foreground font-medium",
            description: "text-muted-foreground",
            actionButton: "bg-primary text-primary-foreground",
            cancelButton: "bg-muted text-muted-foreground",
            success: "border-green-500/30",
            error: "border-destructive/30",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
