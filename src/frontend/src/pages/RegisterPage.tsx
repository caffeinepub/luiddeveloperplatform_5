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
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Zap,
} from "lucide-react";
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

interface RegisterPageProps {
  onNavigate: (page: PageId) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { register, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(username.trim(), password);
      onNavigate("dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 hero-mesh pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center glow-blue mb-4">
            <Zap size={22} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-display">Create Account</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Join LuidDeveloperPlatform today
          </p>
        </div>

        <Card className="glass-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-display">Sign Up</CardTitle>
            <CardDescription>
              Create your developer account in seconds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="reg-username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="reg-username"
                  data-ocid="register.username.input"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="bg-muted/50 border-input focus:border-primary/60 focus:ring-primary/20 transition-colors"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    data-ocid="register.password.input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
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

              <div className="space-y-1.5">
                <Label htmlFor="reg-confirm" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="reg-confirm"
                    data-ocid="register.confirm_password.input"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className={`bg-muted/50 border-input pr-10 transition-colors ${
                      confirmPassword && !passwordsMatch
                        ? "border-destructive/60 focus:border-destructive/60"
                        : confirmPassword && passwordsMatch
                          ? "border-green-500/60 focus:border-green-500/60"
                          : "focus:border-primary/60"
                    }`}
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {confirmPassword && passwordsMatch && (
                      <CheckCircle size={14} className="text-green-500" />
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showConfirm ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div
                  data-ocid="register.error_state"
                  className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2"
                  role="alert"
                >
                  <AlertCircle size={14} className="shrink-0" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                data-ocid="register.submit_button"
                className="w-full bg-primary text-primary-foreground hover:opacity-90 font-semibold gap-2 mt-2"
                disabled={isLoading}
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-5 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => onNavigate("login")}
                className="text-primary hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Sign in
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
