import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, KeyRound, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { login, setPassword: setMemberPassword } = useAuth();
  
  const [mode, setMode] = useState<"login" | "set-password">("login");
  const [uid, setUid] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uid || uid.length !== 4) {
      toast.error("Please enter a valid 4-digit UID");
      return;
    }
    
    if (!passwordValue) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);
    const result = await login(uid, passwordValue);
    setIsLoading(false);

    if (result.success) {
      toast.success("Welcome back!");
      navigate("/profile");
    } else {
      toast.error(result.error || "Login failed");
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uid || uid.length !== 4) {
      toast.error("Please enter a valid 4-digit UID");
      return;
    }
    
    if (passwordValue.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    
    if (passwordValue !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const result = await setMemberPassword(uid, passwordValue);
    setIsLoading(false);

    if (result.success) {
      toast.success("Password set successfully! You can now login.");
      setMode("login");
      setConfirmPassword("");
    } else {
      toast.error(result.error || "Failed to set password");
    }
  };

  return (
    <div className="min-h-screen py-12 flex items-center justify-center">
      <div className="container px-4 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-8 shadow-card border border-border/50"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              {mode === "login" ? (
                <LogIn className="w-8 h-8 text-primary" />
              ) : (
                <KeyRound className="w-8 h-8 text-primary" />
              )}
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {mode === "login" ? "Member Login" : "Set Your Password"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {mode === "login" 
                ? "Enter your UID and password to access your profile"
                : "First time? Set your password to get started"
              }
            </p>
          </div>

          <form onSubmit={mode === "login" ? handleLogin : handleSetPassword} className="space-y-4">
            <div>
              <label htmlFor="uid" className="block text-sm font-medium text-muted-foreground mb-1">
                Member UID
              </label>
              <input
                id="uid"
                type="text"
                value={uid}
                onChange={(e) => setUid(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="Enter your 4-digit UID"
                className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                maxLength={4}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            {mode === "set-password" && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-foreground mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === "login" ? "Logging in..." : "Setting password..."}
                </>
              ) : mode === "login" ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Login
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Set Password
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            {mode === "login" ? (
              <>
                <button
                  onClick={() => setMode("set-password")}
                  className="block w-full text-sm text-primary hover:underline"
                >
                  First time? Set your password
                </button>
                <Link
                  to="/forgot-password"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  Forgot your password?
                </Link>
              </>
            ) : (
              <button
                onClick={() => setMode("login")}
                className="text-sm text-primary hover:underline"
              >
                Already have a password? Login
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
