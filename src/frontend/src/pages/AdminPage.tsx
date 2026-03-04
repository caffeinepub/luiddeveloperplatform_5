import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type Product,
  type ProductCategory,
  useAuth,
} from "@/contexts/AuthContext";
import {
  BarChart3,
  Key,
  Package,
  Pencil,
  Plus,
  Shield,
  ShoppingCart,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type PageId =
  | "landing"
  | "marketplace"
  | "dashboard"
  | "licenses"
  | "orders"
  | "login"
  | "register"
  | "admin";

interface AdminPageProps {
  onNavigate: (page: PageId) => void;
}

const CATEGORIES: ProductCategory[] = [
  "Discord Bots",
  "Automation Scripts",
  "AI Tools",
  "APIs",
];

interface ProductForm {
  name: string;
  description: string;
  version: string;
  price: string;
  subscriptionPrice: string;
  category: ProductCategory;
}

const emptyForm = (): ProductForm => ({
  name: "",
  description: "",
  version: "1.0.0",
  price: "",
  subscriptionPrice: "",
  category: "Discord Bots",
});

export function AdminPage({ onNavigate }: AdminPageProps) {
  const { user, products, setProducts, orders, licenses, allUsers } = useAuth();
  const [activeTab, setActiveTab] = useState("products");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm());

  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-4">
        <Shield size={40} className="text-muted-foreground/40" />
        <p className="text-muted-foreground">Access restricted to admins</p>
        <Button onClick={() => onNavigate("dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm());
    setFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      version: product.version,
      price: product.price.toString(),
      subscriptionPrice: product.subscriptionPrice.toString(),
      category: product.category,
    });
    setFormOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.description.trim() || !form.version.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    const price = Number.parseFloat(form.price);
    const subPrice = Number.parseFloat(form.subscriptionPrice);
    if (
      Number.isNaN(price) ||
      price <= 0 ||
      Number.isNaN(subPrice) ||
      subPrice <= 0
    ) {
      toast.error("Please enter valid prices");
      return;
    }

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: form.name.trim(),
                description: form.description.trim(),
                version: form.version.trim(),
                price,
                subscriptionPrice: subPrice,
                category: form.category,
              }
            : p,
        ),
      );
      toast.success("Product updated successfully");
    } else {
      const newId = Math.max(...products.map((p) => p.id), 0) + 1;
      const newProduct: Product = {
        id: newId,
        name: form.name.trim(),
        description: form.description.trim(),
        version: form.version.trim(),
        price,
        subscriptionPrice: subPrice,
        category: form.category,
        ratings: [],
      };
      setProducts((prev) => [...prev, newProduct]);
      toast.success("Product added successfully");
    }
    setFormOpen(false);
  };

  const handleDelete = (product: Product) => {
    setDeleteTarget(product);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.name}" deleted`);
    setDeleteTarget(null);
  };

  const stats = {
    totalUsers: allUsers.length,
    totalProducts: products.length,
    totalOrders: orders.length,
    totalLicenses: licenses.length,
  };

  return (
    <div
      data-ocid="admin.page"
      className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={20} className="text-accent" />
            <h1 className="text-3xl font-bold font-display">Admin Panel</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage products, users, and platform statistics
          </p>
        </div>
        <Badge className="badge-accent text-xs py-1 px-3">
          <Shield size={11} className="mr-1" />
          Administrator
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 border border-border mb-6 p-1">
          <TabsTrigger
            value="products"
            data-ocid="admin.products.tab"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5"
          >
            <Package size={14} />
            Products
          </TabsTrigger>
          <TabsTrigger
            value="users"
            data-ocid="admin.users.tab"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5"
          >
            <Users size={14} />
            Users
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            data-ocid="admin.stats.tab"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5"
          >
            <BarChart3 size={14} />
            Stats
          </TabsTrigger>
        </TabsList>

        {/* ── Products Tab ──────────────────────────────────────────── */}
        <TabsContent value="products">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {products.length} products in marketplace
            </p>
            <Button
              data-ocid="admin.add_product.button"
              onClick={handleOpenAdd}
              className="gap-2 bg-primary text-primary-foreground hover:opacity-90"
              size="sm"
            >
              <Plus size={14} />
              Add Product
            </Button>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {products.map((product, idx) => (
              <Card key={product.id} className="glass-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        v{product.version} · {product.category}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        data-ocid={`admin.product.edit_button.${idx + 1}`}
                        onClick={() => handleOpenEdit(product)}
                      >
                        <Pencil size={13} className="text-muted-foreground" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        data-ocid={`admin.product.delete_button.${idx + 1}`}
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 size={13} className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="text-foreground font-semibold">
                      ${product.price.toFixed(2)}
                    </span>
                    <span>·</span>
                    <span>${product.subscriptionPrice.toFixed(2)}/mo</span>
                    <span>·</span>
                    <span>{product.ratings.length} reviews</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop table */}
          <Card className="hidden sm:block glass-card border-border overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">
                      Name
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Category
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Version
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Price
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Monthly
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Reviews
                    </TableHead>
                    <TableHead className="text-muted-foreground w-20">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, idx) => (
                    <TableRow
                      key={product.id}
                      className="border-border hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-medium text-sm">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {product.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs bg-muted/50 px-1.5 py-0.5 rounded">
                          v{product.version}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold text-sm">
                        ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        ${product.subscriptionPrice.toFixed(2)}/mo
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {product.ratings.length}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 hover:bg-primary/10"
                            data-ocid={`admin.product.edit_button.${idx + 1}`}
                            onClick={() => handleOpenEdit(product)}
                          >
                            <Pencil
                              size={13}
                              className="text-muted-foreground hover:text-primary"
                            />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 hover:bg-destructive/10"
                            data-ocid={`admin.product.delete_button.${idx + 1}`}
                            onClick={() => handleDelete(product)}
                          >
                            <Trash2 size={13} className="text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Users Tab ─────────────────────────────────────────────── */}
        <TabsContent value="users">
          <Card className="glass-card border-border overflow-hidden">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <Users size={16} className="text-primary" />
                Registered Users ({allUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">
                      Username
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Role
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Joined
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Orders
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUsers.map((u, idx) => (
                    <TableRow
                      key={u.id}
                      data-ocid={`admin.user.row.${idx + 1}`}
                      className="border-border hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-medium text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {u.username.slice(0, 2).toUpperCase()}
                          </div>
                          {u.username}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs border-0 py-0 ${
                            u.role === "admin"
                              ? "badge-accent"
                              : "badge-primary"
                          }`}
                        >
                          {u.role === "admin" && (
                            <Shield size={9} className="mr-1" />
                          )}
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {u.joinedAt.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {orders.filter((o) => o.userId === u.id).length}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Stats Tab ─────────────────────────────────────────────── */}
        <TabsContent value="stats">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Users",
                value: stats.totalUsers,
                icon: Users,
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                label: "Total Products",
                value: stats.totalProducts,
                icon: Package,
                color: "text-accent",
                bg: "bg-accent/10",
              },
              {
                label: "Total Orders",
                value: stats.totalOrders,
                icon: ShoppingCart,
                color: "text-purple-400",
                bg: "bg-purple-400/10",
              },
              {
                label: "Total Licenses",
                value: stats.totalLicenses,
                icon: Key,
                color: "text-green-400",
                bg: "bg-green-400/10",
              },
            ].map((s) => (
              <Card key={s.label} className="glass-card border-border">
                <CardContent className="p-5">
                  <div
                    className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}
                  >
                    <s.icon size={20} className={s.color} />
                  </div>
                  <div className="text-3xl font-bold font-display">
                    {s.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {s.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Revenue breakdown */}
          <Card className="glass-card border-border mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <BarChart3 size={16} className="text-accent" />
                Revenue Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Purchase", "Subscription"].map((type) => {
                  const typeOrders = orders.filter((o) => o.type === type);
                  const revenue = typeOrders.reduce(
                    (sum, o) => sum + o.amount,
                    0,
                  );
                  const pct =
                    orders.length > 0
                      ? (typeOrders.length / orders.length) * 100
                      : 0;
                  return (
                    <div key={type}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">{type}</span>
                        <span className="font-semibold">
                          ${revenue.toFixed(2)} ({typeOrders.length} orders)
                        </span>
                      </div>
                      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            type === "Purchase" ? "bg-primary" : "bg-accent"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <Separator className="my-4 bg-border" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Revenue</span>
                <span className="font-bold text-lg font-display">
                  ${orders.reduce((s, o) => s + o.amount, 0).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Add/Edit Product Modal ─────────────────────────────────── */}
      <Dialog open={formOpen} onOpenChange={(o) => !o && setFormOpen(false)}>
        <DialogContent className="glass-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-sm">Product Name *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. AwesomeBot Pro"
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Description *</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Brief description"
                className="bg-muted/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Version *</Label>
                <Input
                  value={form.version}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, version: e.target.value }))
                  }
                  placeholder="1.0.0"
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Category</Label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      category: e.target.value as ProductCategory,
                    }))
                  }
                  className="w-full h-9 rounded-md border border-input bg-muted/50 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-card">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">One-Time Price ($) *</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="49.99"
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Monthly Price ($) *</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.subscriptionPrice}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      subscriptionPrice: e.target.value,
                    }))
                  }
                  placeholder="9.99"
                  className="bg-muted/50"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setFormOpen(false)}
              data-ocid="admin.product.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary text-primary-foreground"
              data-ocid="admin.product.save_button"
            >
              {editingProduct ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ────────────────────────────────────── */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent className="glass-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-destructive">
              Delete Product
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="text-foreground font-semibold">
              {deleteTarget?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              data-ocid="admin.product.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              data-ocid="admin.product.confirm_button"
            >
              <Trash2 size={14} className="mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
