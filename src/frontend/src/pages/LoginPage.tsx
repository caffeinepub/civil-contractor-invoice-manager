import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, HardHat, Loader2 } from "lucide-react";
import { useState } from "react";

const VALID_USERNAME = "Mikeee";
const VALID_PASSWORD = "kuchbhi@123";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      localStorage.setItem("cim_auth", "true");
      void navigate({ to: "/" });
    } else {
      setError("Invalid username or password. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fade-up">
        {/* Logo section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-fab mb-4">
            <HardHat className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Civil Invoice Manager
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Professional billing for civil contractors
          </p>
        </div>

        <Card className="shadow-card border-border/60">
          <CardHeader className="pb-4 pt-6 px-6">
            <h2 className="font-display font-semibold text-lg text-foreground">
              Sign In
            </h2>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to continue
            </p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  data-ocid="login.input"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  autoCapitalize="none"
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    data-ocid="login.password_input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="h-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert
                  variant="destructive"
                  data-ocid="login.error_state"
                  className="py-2.5"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                data-ocid="login.submit_button"
                type="submit"
                className="w-full h-11 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
