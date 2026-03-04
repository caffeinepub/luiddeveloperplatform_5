import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type {
  OrderType,
  Product,
  ProductCategory,
} from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, LogIn, ShoppingCart, Star, Tag, Zap } from "lucide-react";
import { toast } from "sonner";
import { AverageStars, StarRating } from "./StarRating";

const categoryColors: Record<ProductCategory, string> = {
  "Discord Bots": "badge-primary",
  "Automation Scripts": "badge-accent",
  "AI Tools": "badge-purple",
  APIs: "badge-green",
};

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onNavigate: (
    page:
      | "landing"
      | "marketplace"
      | "dashboard"
      | "licenses"
      | "orders"
      | "login"
      | "register"
      | "admin",
  ) => void;
}

export function ProductDetailModal({
  product,
  open,
  onClose,
  onNavigate,
}: ProductDetailModalProps) {
  const { user, purchaseProduct } = useAuth();

  if (!product) return null;

  const handlePurchase = (type: OrderType) => {
    if (!user) {
      toast.error("You must be logged in to purchase");
      return;
    }
    purchaseProduct(product.id, type);
    const label = type === "Purchase" ? "one-time purchase" : "subscription";
    toast.success(
      `🎉 ${product.name} — ${label} activated! Check your Licenses.`,
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        data-ocid="marketplace.product.detail.modal"
        className="glass-card border-border max-w-lg w-full p-0 overflow-hidden"
      >
        {/* Header gradient */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-primary/10 to-transparent border-b border-border">
          <DialogHeader>
            <div className="flex items-start gap-3 flex-wrap">
              <span
                className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[product.category]}`}
              >
                {product.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded font-mono">
                <Tag size={10} />v{product.version}
              </span>
            </div>
            <DialogTitle className="text-xl font-bold font-display mt-2">
              {product.name}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="mt-1">
                <AverageStars ratings={product.ratings} />
              </div>
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="px-6 py-4 space-y-5">
            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">One-Time</p>
                <p className="text-xl font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">Lifetime access</p>
              </div>
              <div className="glass-card rounded-lg p-3 text-center border-accent/30">
                <p className="text-xs text-accent mb-1">Monthly</p>
                <p className="text-xl font-bold text-accent">
                  ${product.subscriptionPrice.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">per month</p>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Reviews */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star size={14} className="text-yellow-400" />
                <h4 className="text-sm font-semibold">Reviews</h4>
              </div>
              <div className="space-y-3">
                {product.ratings.map((r, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: reviewer position is stable
                  <div key={i} className="glass-card rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{r.reviewer}</span>
                      <StarRating score={r.score} size={12} />
                    </div>
                    <p className="text-xs text-muted-foreground">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-border bg-card/50">
          {user ? (
            <div className="flex flex-col gap-2">
              <Button
                className="w-full gap-2 bg-primary text-primary-foreground hover:opacity-90 font-semibold"
                onClick={() => handlePurchase("Purchase")}
                data-ocid="marketplace.product.buy_button.modal"
              >
                <ShoppingCart size={16} />
                Buy Now — ${product.price.toFixed(2)}
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2 border-accent/40 text-accent hover:bg-accent/10 hover:border-accent/60"
                onClick={() => handlePurchase("Subscription")}
              >
                <Zap size={16} />
                Subscribe — ${product.subscriptionPrice.toFixed(2)}/mo
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground text-center">
                You need an account to purchase
              </p>
              <Button
                className="w-full gap-2 bg-primary text-primary-foreground"
                onClick={() => {
                  onClose();
                  onNavigate("login");
                }}
              >
                <LogIn size={16} />
                Login to Purchase
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
