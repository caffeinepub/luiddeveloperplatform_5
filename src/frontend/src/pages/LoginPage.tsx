import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Eye, EyeOff, Loader2, Zap } from "lucide-react";
import { type FormEvent, useState } from "react";

type PageId =
  | "landing"
  | "marketplace"
  | "dashboard"
  | "licenses"
  | "orders"
  | "login"
  | "register"
  | "admin";

interface LoginPageProps {
  onNavigate: (page: PageId) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      await login(username.trim(), password);
      onNavigate("dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      {/* Background mesh */}
      <div className="absolute inset-0 hero-mesh pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center glow-blue mb-4">
            <Zap size={22} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-display">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Sign in to LuidDeveloperPlatform
          </p>
        </div>

        <Card className="glass-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-display">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="login-username"
                  data-ocid="login.username.input"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="bg-muted/50 border-input focus:border-primary/60 focus:ring-primary/20 transition-colors"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="login-password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    data-ocid="login.password.input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="bg-muted/50 border-input focus:border-primary/60 focus:ring-primary/20 pr-10 transition-colors"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  data-ocid="login.error_state"
                  className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2"
                  role="alert"
                >
                  <AlertCircle size={14} className="shrink-0" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                data-ocid="login.submit_button"
                className="w-full bg-primary text-primary-foreground hover:opacity-90 font-semibold gap-2 mt-2"
                disabled={isLoading}
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-5 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                data-ocid="login.register.link"
                onClick={() => onNavigate("register")}
                className="text-primary hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Create one now
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Demo hint */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground bg-muted/30 border border-border rounded-lg px-4 py-2.5">
            Admin demo:{" "}
            <span className="font-mono text-foreground">SidneiCosta00</span> /{" "}
            <span className="font-mono text-foreground">Nikebolado@4</span>
          </p>
        </div>
      </div>
    </div>
  );
}
