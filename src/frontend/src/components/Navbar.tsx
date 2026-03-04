import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import {
  ClipboardList,
  Key,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  ShoppingBag,
  X,
  Zap,
} from "lucide-react";
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

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    {
      id: "marketplace" as PageId,
      label: "Marketplace",
      icon: ShoppingBag,
      ocid: "nav.marketplace.link",
    },
    ...(user
      ? [
          {
            id: "dashboard" as PageId,
            label: "Dashboard",
            icon: LayoutDashboard,
            ocid: "nav.dashboard.link",
          },
          {
            id: "licenses" as PageId,
            label: "Licenses",
            icon: Key,
            ocid: "nav.licenses.link",
          },
          {
            id: "orders" as PageId,
            label: "Orders",
            icon: ClipboardList,
            ocid: "nav.orders.link",
          },
        ]
      : []),
  ];

  const handleLogout = () => {
    logout();
    onNavigate("landing");
    setMobileOpen(false);
  };

  const initials = user ? user.username.slice(0, 2).toUpperCase() : "";

  return (
    <nav className="nav-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            aria-label="LuidDeveloperPlatform home"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center glow-blue group-hover:bg-primary/30 transition-colors">
              <Zap size={16} className="text-primary" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold font-display text-foreground leading-none">
                LuidDeveloper
              </span>
              <span className="text-[10px] text-muted-foreground leading-none tracking-wider uppercase">
                Platform
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.id}
                data-ocid={link.ocid}
                onClick={() => onNavigate(link.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  currentPage === link.id
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <link.icon size={15} />
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Avatar className="h-7 w-7 border border-primary/40">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                      {user.username}
                    </span>
                    {user.role === "admin" && (
                      <Shield size={12} className="text-accent shrink-0" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="glass-card border-border min-w-[160px]"
                >
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => onNavigate("admin")}
                        className="text-accent focus:text-accent focus:bg-accent/10"
                      >
                        <Shield size={14} className="mr-2" />
                        Admin Panel
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border" />
                    </>
                  )}
                  <DropdownMenuItem
                    data-ocid="nav.logout.button"
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <LogOut size={14} className="mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="nav.login.button"
                  onClick={() => onNavigate("login")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => onNavigate("register")}
                  className="bg-primary text-primary-foreground hover:opacity-90 font-medium"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.id}
                data-ocid={link.ocid}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  currentPage === link.id
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <link.icon size={16} />
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-border mt-2">
              {user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <Avatar className="h-7 w-7 border border-primary/40">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.username}</span>
                    {user.role === "admin" && (
                      <Shield size={12} className="text-accent" />
                    )}
                  </div>
                  {user.role === "admin" && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate("admin");
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 rounded-md text-sm text-accent hover:bg-accent/10 transition-colors"
                    >
                      <Shield size={16} />
                      Admin Panel
                    </button>
                  )}
                  <button
                    type="button"
                    data-ocid="nav.logout.button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2.5 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    data-ocid="nav.login.button"
                    onClick={() => {
                      onNavigate("login");
                      setMobileOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-primary text-primary-foreground"
                    onClick={() => {
                      onNavigate("register");
                      setMobileOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
