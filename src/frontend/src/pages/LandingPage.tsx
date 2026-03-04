import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowRight,
  Brain,
  Globe,
  Lock,
  ShieldCheck,
  Star,
  Terminal,
  Zap,
} from "lucide-react";

type PageId =
  | "landing"
  | "marketplace"
  | "dashboard"
  | "licenses"
  | "orders"
  | "login"
  | "register"
  | "admin";

interface LandingPageProps {
  onNavigate: (page: PageId) => void;
  onOpenProduct: (product: Product) => void;
}

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Licensing",
    description:
      "Every purchase generates a unique LUID license key stored on-chain. Instant activation, no expiry worries.",
    colorClass: "text-primary",
    bgClass: "bg-primary/10 border-primary/20",
  },
  {
    icon: Terminal,
    title: "Discord Bots",
    description:
      "Production-ready moderation and music bots with 99.9% uptime. Drop-in setup in under 2 minutes.",
    colorClass: "text-accent",
    bgClass: "bg-accent/10 border-accent/20",
  },
  {
    icon: Brain,
    title: "AI Tools",
    description:
      "GPT-4 powered content creation, image generation, and automation tools used by 2,000+ developers.",
    colorClass: "text-purple-400",
    bgClass: "bg-purple-400/10 border-purple-400/20",
  },
];

const stats = [
  { label: "Active Developers", value: "2,400+" },
  { label: "Products Available", value: "8" },
  { label: "Licenses Issued", value: "12K+" },
  { label: "Uptime Guarantee", value: "99.9%" },
];

export function LandingPage({ onNavigate, onOpenProduct }: LandingPageProps) {
  const { products } = useAuth();
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-mesh overflow-hidden">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.95 0.01 265) 1px, transparent 1px), linear-gradient(90deg, oklch(0.95 0.01 265) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 badge-primary text-xs px-3 py-1.5 rounded-full">
              <Globe size={12} />
              100% on Internet Computer · By LuidCorporation
            </span>
          </div>

          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-display font-bold tracking-tight mb-4">
              <span className="block text-4xl sm:text-5xl lg:text-7xl text-foreground leading-[1.1]">
                LuidDeveloper
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-7xl gradient-text leading-[1.1]">
                Platform
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-4">
              The developer marketplace by{" "}
              <span className="text-foreground font-semibold">
                LuidCorporation
              </span>
              . Bots, automation scripts, AI tools, and APIs — all running
              natively on the Internet Computer.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:opacity-90 font-semibold px-8 gap-2 glow-blue"
              onClick={() => onNavigate("marketplace")}
            >
              Explore Marketplace
              <ArrowRight size={18} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-muted/50 text-foreground px-8 gap-2"
              onClick={() => onNavigate("register")}
            >
              <Zap size={16} className="text-accent" />
              Get Started Free
            </Button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold font-display gradient-text">
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-3">
              Everything You Need to Build
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              All tools run directly on ICP. No subscriptions to third-party
              services, no data leaks, no downtime.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="glass-card glass-card-hover p-6">
                <CardContent className="p-0">
                  <div
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-4 ${f.bgClass}`}
                  >
                    <f.icon size={20} className={f.colorClass} />
                  </div>
                  <h3 className="font-semibold font-display text-base mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust highlights */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            {[
              { icon: Lock, text: "100% ICP Native" },
              { icon: ShieldCheck, text: "No External Auth" },
              { icon: Globe, text: "Globally Accessible" },
              { icon: Star, text: "4.8/5 Average Rating" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <item.icon size={15} className="text-primary" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold font-display mb-2">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Top-rated by developers worldwide
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => onNavigate("marketplace")}
              className="text-primary hover:text-primary hover:bg-primary/10 gap-1 hidden sm:flex"
            >
              View All
              <ArrowRight size={16} />
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i + 1}
                onOpenDetail={onOpenProduct}
              />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button
              variant="outline"
              onClick={() => onNavigate("marketplace")}
              className="gap-2"
            >
              View All Products
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center glass-card rounded-2xl p-10 glow-blue relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl font-bold font-display mb-3">
              Ready to Build?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join 2,400+ developers who trust LuidCorporation for their
              infrastructure needs. ICP-native, always-on.
            </p>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:opacity-90 font-semibold px-10 gap-2"
              onClick={() => onNavigate("register")}
            >
              Create Free Account
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-primary" />
            <span className="text-sm font-semibold font-display">
              LuidCorporation
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} LuidCorporation. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>100% ICP Native</span>
            <span>•</span>
            <span>No External Services</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
