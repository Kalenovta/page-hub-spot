import { useState } from "react";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PASS_KEY = "linktree-admin-password";

interface PasswordGateProps {
  onAuthenticated: () => void;
  onClose: () => void;
}

const PasswordGate = ({ onAuthenticated, onClose }: PasswordGateProps) => {
  const savedPass = localStorage.getItem(PASS_KEY);
  const isFirstTime = !savedPass;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isFirstTime) {
      if (password.length < 4) {
        setError("Password must be at least 4 characters");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      localStorage.setItem(PASS_KEY, password);
      onAuthenticated();
    } else {
      if (password === savedPass) {
        onAuthenticated();
      } else {
        setError("Incorrect password");
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <motion.form
        onSubmit={handleSubmit}
        className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-foreground">
              {isFirstTime ? "Set Admin Password" : "Enter Password"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isFirstTime ? "Create a password to protect editing" : "Enter your password to edit"}
            </p>
          </div>
        </div>

        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isFirstTime ? "Create password" : "Password"}
          className="bg-muted border-border"
          autoFocus
        />

        {isFirstTime && (
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="bg-muted border-border"
          />
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {isFirstTime ? "Set Password" : "Unlock"}
          </Button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default PasswordGate;
