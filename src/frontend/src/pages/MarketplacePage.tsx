import { ProductCard } from "@/components/ProductCard";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product, ProductCategory } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { Search } from "lucide-react";
import { useState } from "react";

type PageId =
  | "landing"
  | "marketplace"
  | "dashboard"
  | "licenses"
  | "orders"
  | "login"
  | "register"
  | "admin";

interface MarketplacePageProps {
  onNavigate: (page: PageId) => void;
}

type CategoryFilter = "All" | ProductCategory;

const categoryTabs: { id: CategoryFilter; label: string; ocid: string }[] = [
  { id: "All", label: "All", ocid: "marketplace.all.tab" },
  {
    id: "Discord Bots",
    label: "Discord Bots",
    ocid: "marketplace.discordbots.tab",
  },
  {
    id: "Automation Scripts",
    label: "Automation",
    ocid: "marketplace.automationscripts.tab",
  },
  { id: "AI Tools", label: "AI Tools", ocid: "marketplace.aitools.tab" },
  { id: "APIs", label: "APIs", ocid: "marketplace.apis.tab" },
];

export function MarketplacePage({ onNavigate }: MarketplacePageProps) {
  const { products } = useAuth();
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const matchCat =
      selectedCategory === "All" || p.category === selectedCategory;
    const matchSearch =
      search.trim() === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOpenDetail = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // Get actual index in full products array for consistent data-ocid
  const getProductIndex = (product: Product) =>
    products.findIndex((p) => p.id === product.id) + 1;

  return (
    <div
      data-ocid="marketplace.page"
      className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display mb-2">Marketplace</h1>
        <p className="text-muted-foreground">
          {products.length} products available · Bots, scripts, AI tools, and
          APIs
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/50 border-input focus:border-primary/60"
            data-ocid="marketplace.search_input"
          />
        </div>
        <Tabs
          value={selectedCategory}
          onValueChange={(v) => setSelectedCategory(v as CategoryFilter)}
        >
          <TabsList className="bg-muted/50 border border-border h-auto flex-wrap gap-1 p-1">
            {categoryTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                data-ocid={tab.ocid}
                className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-3 py-1.5 rounded-md transition-colors"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div
          data-ocid="marketplace.empty_state"
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-4">
            <Search size={24} className="text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Try adjusting your search or select a different category
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              index={getProductIndex(product)}
              onOpenDetail={handleOpenDetail}
            />
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
}
