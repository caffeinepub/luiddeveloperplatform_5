import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Product, ProductCategory } from "@/contexts/AuthContext";
import { ShoppingCart, Zap } from "lucide-react";
import { AverageStars } from "./StarRating";

const categoryColors: Record<ProductCategory, string> = {
  "Discord Bots": "badge-primary",
  "Automation Scripts": "badge-accent",
  "AI Tools": "badge-purple",
  APIs: "badge-green",
};

const categoryEmojis: Record<ProductCategory, string> = {
  "Discord Bots": "🤖",
  "Automation Scripts": "⚡",
  "AI Tools": "🧠",
  APIs: "🔌",
};

interface ProductCardProps {
  product: Product;
  index: number;
  onOpenDetail: (product: Product) => void;
}

export function ProductCard({
  product,
  index,
  onOpenDetail,
}: ProductCardProps) {
  return (
    <Card
      data-ocid={`marketplace.product.card.${index}`}
      className="glass-card glass-card-hover flex flex-col cursor-pointer group transition-all duration-200"
      onClick={() => onOpenDetail(product)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[product.category]}`}
          >
            <span>{categoryEmojis[product.category]}</span>
            {product.category}
          </span>
          <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded">
            v{product.version}
          </span>
        </div>
        <h3 className="text-base font-semibold font-display mt-2 text-foreground group-hover:text-primary transition-colors leading-tight">
          {product.name}
        </h3>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {product.description}
        </p>
        <div className="mt-3">
          <AverageStars ratings={product.ratings} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-3 border-t border-border">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col">
            <span className="text-base font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground">
              or ${product.subscriptionPrice.toFixed(2)}/mo
            </span>
          </div>
          <Button
            size="sm"
            data-ocid={`marketplace.product.buy_button.${index}`}
            className="gap-1.5 bg-primary text-primary-foreground hover:opacity-90"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(product);
            }}
          >
            <ShoppingCart size={14} />
            Buy Now
          </Button>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full gap-1.5 border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(product);
          }}
        >
          <Zap size={14} />
          Subscribe ${product.subscriptionPrice.toFixed(2)}/mo
        </Button>
      </CardFooter>
    </Card>
  );
}
