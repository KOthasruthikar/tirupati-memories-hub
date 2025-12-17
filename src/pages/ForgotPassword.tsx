import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { KeyRound, Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState<"request" | "verify" | "success">("request");
  const [uid, setUid] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uid || uid.length !== 4) {
      toast.error("Please enter a valid 4-digit UID");
      return;
    }

    setIsLoading(true);

    try {
      // Generate recovery code
      const { data, error } = await supabase.rpc("member_generate_recovery_code", {
        p_uid: uid,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; code?: string; email?: string; name?: string };
      
      if (!result.success) {
        toast.error(result.error || "Failed to generate recovery code");
        setIsLoading(false);
        return;
      }

      // Mask email for display
      const email = result.email!;
      const [local, domain] = email.split("@");
      const masked = local.slice(0, 2) + "***@" + domain;
      setMaskedEmail(masked);

      // Send recovery code via edge function
      const { error: emailError } = await supabase.functions.invoke("send-recovery-code", {
        body: {
          code: result.code,
          email: result.email,
          name: result.name,
        },
      });

      if (emailError) {
        console.error("Email error:", emailError);
        toast.error("Failed to send recovery email. Please try again.");
        setIsLoading(false);
        return;
      }

      toast.success("Recovery code sent to your email!");
      setStep("verify");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    if (newPassword.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.rpc("member_reset_password_with_code", {
        p_uid: uid,
        p_code: code,
        p_new_password: newPassword,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };

      if (!result.success) {
        toast.error(result.error || "Failed to reset password");
        setIsLoading(false);
        return;
      }

      toast.success("Password reset successfully!");
      setStep("success");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="container px-4 max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-8 shadow-card border border-border/50 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
              Password Reset!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 flex items-center justify-center">
      <div className="container px-4 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-8 shadow-card border border-border/50"
        >
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              {step === "request" ? (
                <Mail className="w-8 h-8 text-primary" />
              ) : (
                <KeyRound className="w-8 h-8 text-primary" />
              )}
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {step === "request" ? "Forgot Password" : "Enter Recovery Code"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {step === "request"
                ? "Enter your UID to receive a recovery code"
                : `We sent a 6-digit code to ${maskedEmail}`}
            </p>
          </div>

          {step === "request" ? (
            <form onSubmit={handleRequestCode} className="space-y-4">
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Send Recovery Code
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndReset} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-muted-foreground mb-1">
                  Recovery Code
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                  required
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-muted-foreground mb-1">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-foreground mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Reset Password
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep("request")}
                className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Didn't receive the code? Try again
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
