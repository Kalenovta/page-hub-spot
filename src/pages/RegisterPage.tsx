import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, AtSign, Sparkles, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [slug, setSlug] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    // auto-slug from name if slug hasn't been manually changed
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]/g, "")) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9-_]/g, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = register(email, password, name, slug);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Registration failed");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[400px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center gap-2 mb-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold font-display tracking-tight text-foreground">PageHub</span>
          </motion.div>
          <p className="text-muted-foreground text-sm">Create your free profile page</p>
        </div>

        {/* Card */}
        <motion.div
          className="bg-card border border-border rounded-2xl p-6 shadow-xl shadow-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="John Doe"
                  className="pl-10 bg-muted border-border"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Username / Slug</label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="register-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                  placeholder="johndoe"
                  className="pl-10 bg-muted border-border"
                  required
                />
              </div>
              {slug && (
                <p className="text-xs text-muted-foreground">
                  Your page: <span className="text-primary font-medium">pagehub.app/{slug}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 bg-muted border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="pl-10 bg-muted border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="register-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="pl-10 bg-muted border-border"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.p
                className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}

            <Button
              id="register-submit"
              type="submit"
              className="w-full h-11 font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Create Free Account
                </span>
              )}
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
