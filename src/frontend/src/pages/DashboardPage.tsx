import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowRight,
  ClipboardList,
  Key,
  Package,
  Shield,
  ShoppingBag,
  TrendingUp,
  Users,
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

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user, orders, licenses, products, allUsers } = useAuth();

  if (!user) return null;

  const userOrders = orders.filter((o) => o.userId === user.id);
  const userLicenses = licenses.filter((l) => l.userId === user.id);
  const initials = user.username.slice(0, 2).toUpperCase();

  const statsCards = [
    {
      label: "My Orders",
      value: userOrders.length,
      icon: ClipboardList,
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
      action: () => onNavigate("orders"),
      ocid: "dashboard.orders.button",
    },
    {
      label: "My Licenses",
      value: userLicenses.length,
      icon: Key,
      colorClass: "text-accent",
      bgClass: "bg-accent/10",
      action: () => onNavigate("licenses"),
      ocid: "dashboard.licenses.button",
    },
    {
      label: "Products",
      value: products.length,
      icon: Package,
      colorClass: "text-purple-400",
      bgClass: "bg-purple-400/10",
      action: () => onNavigate("marketplace"),
      ocid: "dashboard.marketplace.button",
    },
    ...(user.role === "admin"
      ? [
          {
            label: "Total Users",
            value: allUsers.length,
            icon: Users,
            colorClass: "text-green-400",
            bgClass: "bg-green-400/10",
            action: () => onNavigate("admin"),
            ocid: "dashboard.admin.button",
          },
        ]
      : []),
  ];

  const quickActions = [
    {
      label: "Browse Marketplace",
      icon: ShoppingBag,
      action: () => onNavigate("marketplace"),
      ocid: "dashboard.marketplace.button",
      variant: "primary" as const,
    },
    {
      label: "View Licenses",
      icon: Key,
      action: () => onNavigate("licenses"),
      ocid: "dashboard.licenses.button",
      variant: "secondary" as const,
    },
    {
      label: "Order History",
      icon: ClipboardList,
      action: () => onNavigate("orders"),
      ocid: "dashboard.orders.button",
      variant: "secondary" as const,
    },
  ];

  const recentOrders = userOrders.slice(-3).reverse();

  return (
    <div
      data-ocid="dashboard.page"
      className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/40 glow-blue">
            <AvatarFallback className="bg-primary/20 text-primary text-lg font-bold font-display">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-display">
                Welcome back, {user.username}
              </h1>
              {user.role === "admin" && (
                <Badge className="badge-accent text-xs py-0.5">
                  <Shield size={10} className="mr-1" />
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm mt-0.5">
              {user.role === "admin"
                ? "You have full administrative access"
                : "Manage your licenses and orders"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("marketplace")}
          className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
        >
          <Zap size={14} />
          Explore Products
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat) => (
          <Card
            key={stat.label}
            className="glass-card glass-card-hover cursor-pointer"
            onClick={stat.action}
            data-ocid={stat.ocid}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-lg ${stat.bgClass} flex items-center justify-center`}
                >
                  <stat.icon size={18} className={stat.colorClass} />
                </div>
                <ArrowRight size={14} className="text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold font-display">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="glass-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                data-ocid={action.ocid}
                variant={action.variant === "primary" ? "default" : "outline"}
                className={`w-full justify-start gap-2 ${
                  action.variant === "primary"
                    ? "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
                    : "border-border hover:bg-muted/50"
                }`}
                onClick={action.action}
              >
                <action.icon size={16} />
                {action.label}
              </Button>
            ))}
            {user.role === "admin" && (
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-accent/30 text-accent hover:bg-accent/10"
                onClick={() => onNavigate("admin")}
              >
                <Shield size={16} />
                Admin Panel
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="glass-card border-border lg:col-span-2">
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <ClipboardList size={16} className="text-accent" />
              Recent Orders
            </CardTitle>
            <button
              type="button"
              onClick={() => onNavigate("orders")}
              className="text-xs text-primary hover:underline"
            >
              View all
            </button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Package size={32} className="text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground text-sm">No orders yet</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 gap-2"
                  onClick={() => onNavigate("marketplace")}
                >
                  <ShoppingBag size={14} />
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                        <ShoppingBag size={14} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-tight">
                          {order.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.type} · {order.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        ${order.amount.toFixed(2)}
                      </span>
                      <Badge
                        variant={
                          order.status === "Active" ? "default" : "secondary"
                        }
                        className={`text-xs py-0 ${
                          order.status === "Active"
                            ? "badge-green"
                            : "text-muted-foreground"
                        }`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
