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
import { CheckCheck, Copy, Key, ShoppingBag } from "lucide-react";
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

interface LicensesPageProps {
  onNavigate: (page: PageId) => void;
}

export function LicensesPage({ onNavigate }: LicensesPageProps) {
  const { user, licenses } = useAuth();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (!user) return null;

  const userLicenses = licenses
    .filter((l) => l.userId === user.id)
    .sort((a, b) => b.issuedAt.getTime() - a.issuedAt.getTime());

  const handleCopy = async (licenseId: number, key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedId(licenseId);
      toast.success("License key copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const activeCount = userLicenses.filter((l) => l.status === "Active").length;

  return (
    <div
      data-ocid="licenses.page"
      className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display mb-1">My Licenses</h1>
          <p className="text-muted-foreground text-sm">
            Manage your product license keys
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("marketplace")}
          className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
        >
          <ShoppingBag size={14} />
          Get More
        </Button>
      </div>

      {/* Summary */}
      {userLicenses.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="glass-card border-border">
            <CardContent className="p-4">
              <div className="text-2xl font-bold font-display">
                {userLicenses.length}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Total Licenses
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border">
            <CardContent className="p-4">
              <div className="text-2xl font-bold font-display text-green-400">
                {activeCount}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Active</div>
            </CardContent>
          </Card>
        </div>
      )}

      {userLicenses.length === 0 ? (
        <div
          data-ocid="licenses.empty_state"
          className="flex flex-col items-center justify-center py-24 text-center glass-card rounded-2xl border border-border"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-4">
            <Key size={24} className="text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No licenses yet</h3>
          <p className="text-muted-foreground text-sm max-w-xs mb-5">
            Purchase a product from the marketplace to receive your license key
          </p>
          <Button
            onClick={() => onNavigate("marketplace")}
            className="bg-primary text-primary-foreground gap-2"
          >
            <ShoppingBag size={16} />
            Browse Marketplace
          </Button>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {userLicenses.map((license, idx) => (
              <Card
                key={license.id}
                data-ocid={`licenses.item.${idx + 1}`}
                className="glass-card border-border"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">
                        {license.productName}
                      </p>
                      <span
                        className={`inline-flex text-xs mt-1 px-2 py-0.5 rounded-full ${
                          license.type === "Purchase"
                            ? "badge-primary"
                            : "badge-accent"
                        }`}
                      >
                        {license.type}
                      </span>
                    </div>
                    <Badge
                      className={`text-xs border-0 ${
                        license.status === "Active"
                          ? "badge-green"
                          : "text-muted-foreground bg-muted/50"
                      }`}
                    >
                      {license.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                    <code className="flex-1 text-xs font-mono text-accent tracking-wider truncate">
                      {license.key}
                    </code>
                    <button
                      type="button"
                      data-ocid={`licenses.copy_button.${idx + 1}`}
                      onClick={() => handleCopy(license.id, license.key)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                      aria-label="Copy license key"
                    >
                      {copiedId === license.id ? (
                        <CheckCheck size={14} className="text-green-400" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Issued {license.issuedAt.toLocaleDateString()} ·{" "}
                    {license.expiresAt
                      ? `Expires ${license.expiresAt.toLocaleDateString()}`
                      : "Never expires"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop table */}
          <Card className="hidden sm:block glass-card border-border overflow-hidden">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-display">
                All Licenses ({userLicenses.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table data-ocid="licenses.table">
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">
                      Product
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      License Key
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Type
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Issued
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Expires
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-muted-foreground w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userLicenses.map((license, idx) => (
                    <TableRow
                      key={license.id}
                      data-ocid={`licenses.item.${idx + 1}`}
                      className="border-border hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-medium text-sm">
                        {license.productName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 bg-muted/30 rounded-md px-2.5 py-1.5 max-w-[220px]">
                          <code className="flex-1 text-xs font-mono text-accent tracking-wider truncate">
                            {license.key}
                          </code>
                          <button
                            type="button"
                            data-ocid={`licenses.copy_button.${idx + 1}`}
                            onClick={() => handleCopy(license.id, license.key)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Copy license key"
                          >
                            {copiedId === license.id ? (
                              <CheckCheck
                                size={13}
                                className="text-green-400"
                              />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex text-xs px-2 py-0.5 rounded-full ${
                            license.type === "Purchase"
                              ? "badge-primary"
                              : "badge-accent"
                          }`}
                        >
                          {license.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {license.issuedAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {license.expiresAt
                          ? license.expiresAt.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs border-0 ${
                            license.status === "Active"
                              ? "badge-green"
                              : "text-muted-foreground bg-muted/50"
                          }`}
                        >
                          {license.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => handleCopy(license.id, license.key)}
                          aria-label="Copy"
                        >
                          {copiedId === license.id ? (
                            <CheckCheck size={14} className="text-green-400" />
                          ) : (
                            <Copy size={14} className="text-muted-foreground" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
