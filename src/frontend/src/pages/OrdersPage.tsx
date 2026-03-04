import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowUpRight, Package, ShoppingBag } from "lucide-react";

type PageId =
  | "landing"
  | "marketplace"
  | "dashboard"
  | "licenses"
  | "orders"
  | "login"
  | "register"
  | "admin";

interface OrdersPageProps {
  onNavigate: (page: PageId) => void;
}

export function OrdersPage({ onNavigate }: OrdersPageProps) {
  const { user, orders } = useAuth();

  if (!user) return null;

  const userOrders = orders
    .filter((o) => o.userId === user.id)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const totalSpent = userOrders.reduce((sum, o) => sum + o.amount, 0);
  const activeCount = userOrders.filter((o) => o.status === "Active").length;

  return (
    <div
      data-ocid="orders.page"
      className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display mb-1">
            Order History
          </h1>
          <p className="text-muted-foreground text-sm">
            All your purchases and subscriptions
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("marketplace")}
          className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
        >
          <ShoppingBag size={14} />
          Browse Products
        </Button>
      </div>

      {/* Summary Cards */}
      {userOrders.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="glass-card border-border">
            <CardContent className="p-4">
              <div className="text-xl font-bold font-display">
                {userOrders.length}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Total Orders
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border">
            <CardContent className="p-4">
              <div className="text-xl font-bold font-display text-green-400">
                {activeCount}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Active</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border">
            <CardContent className="p-4">
              <div className="text-xl font-bold font-display text-primary">
                ${totalSpent.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Total Spent
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Orders Table */}
      {userOrders.length === 0 ? (
        <div
          data-ocid="orders.empty_state"
          className="flex flex-col items-center justify-center py-24 text-center glass-card rounded-2xl border border-border"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-4">
            <Package size={24} className="text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground text-sm max-w-xs mb-5">
            Browse the marketplace and make your first purchase to get started
          </p>
          <Button
            onClick={() => onNavigate("marketplace")}
            className="bg-primary text-primary-foreground gap-2"
          >
            <ShoppingBag size={16} />
            Explore Marketplace
          </Button>
        </div>
      ) : (
        <Card className="glass-card border-border overflow-hidden">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base font-display">
              All Orders ({userOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Mobile view */}
            <div className="sm:hidden divide-y divide-border">
              {userOrders.map((order, idx) => (
                <div
                  key={order.id}
                  data-ocid={`orders.item.${idx + 1}`}
                  className="p-4 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium">{order.productName}</p>
                    <Badge
                      className={`text-xs py-0 ${
                        order.status === "Active"
                          ? "badge-green"
                          : "text-muted-foreground bg-muted/50"
                      }`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="badge-primary px-2 py-0.5 rounded-full">
                      {order.type}
                    </span>
                    <span>{order.date.toLocaleDateString()}</span>
                    <span className="text-foreground font-semibold">
                      ${order.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block">
              <Table data-ocid="orders.table">
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">
                      Product
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Type
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Date
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Amount
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userOrders.map((order, idx) => (
                    <TableRow
                      key={order.id}
                      data-ocid={`orders.item.${idx + 1}`}
                      className="border-border hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                            <ShoppingBag size={13} className="text-primary" />
                          </div>
                          {order.productName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex text-xs px-2 py-0.5 rounded-full ${
                            order.type === "Purchase"
                              ? "badge-primary"
                              : "badge-accent"
                          }`}
                        >
                          {order.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {order.date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${order.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs py-0 border-0 ${
                            order.status === "Active"
                              ? "badge-green"
                              : "text-muted-foreground bg-muted/50"
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer hint */}
      {userOrders.length > 0 && (
        <p className="text-xs text-muted-foreground text-center mt-6 flex items-center justify-center gap-1">
          <ArrowUpRight size={12} />
          Visit{" "}
          <button
            type="button"
            onClick={() => onNavigate("licenses")}
            className="text-primary hover:underline"
          >
            Licenses
          </button>{" "}
          to access your license keys
        </p>
      )}
    </div>
  );
}
