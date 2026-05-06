import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface FancyToastData {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

interface FancyToastProps extends FancyToastData {
  onDismiss: (id: string) => void;
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
  error:   <AlertCircle  className="w-5 h-5 text-rose-400 shrink-0" />,
  info:    <Info         className="w-5 h-5 text-sky-400 shrink-0" />,
};

const ACCENT: Record<ToastType, string> = {
  success: "from-emerald-500/20 via-transparent to-transparent border-emerald-500/30",
  error:   "from-rose-500/20 via-transparent to-transparent border-rose-500/30",
  info:    "from-sky-500/20 via-transparent to-transparent border-sky-500/30",
};

const BAR_COLOR: Record<ToastType, string> = {
  success: "bg-emerald-400",
  error:   "bg-rose-400",
  info:    "bg-sky-400",
};

export function FancyToastItem({ id, title, description, type = "success", duration = 3500, onDismiss }: FancyToastProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const startRef = useRef<number>(Date.now());
  const rafRef = useRef<number>(0);

  // Mount animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Progress bar
  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        handleDismiss();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [duration]);

  const handleDismiss = () => {
    if (exiting) return;
    setExiting(true);
    cancelAnimationFrame(rafRef.current);
    setTimeout(() => onDismiss(id), 350);
  };

  return (
    <div
      className={cn(
        "relative w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border backdrop-blur-xl shadow-2xl",
        "bg-gradient-to-r",
        ACCENT[type],
        "bg-[#111118]/90",
        "transition-all duration-350 ease-out will-change-transform",
        visible && !exiting
          ? "opacity-100 translate-y-0 scale-100"
          : exiting
          ? "opacity-0 -translate-y-3 scale-95"
          : "opacity-0 -translate-y-5 scale-95",
      )}
      style={{ transitionDuration: exiting ? "350ms" : "400ms" }}
    >
      {/* Glowing left border accent */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl",
          BAR_COLOR[type],
        )}
      />

      {/* Content */}
      <div className="flex items-start gap-3 px-5 py-4 pr-10">
        <div className="mt-0.5">{ICONS[type]}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-snug">{title}</p>
          {description && (
            <p className="text-xs text-white/60 mt-0.5 leading-snug">{description}</p>
          )}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-full text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 rounded-b-2xl overflow-hidden">
        <div
          className={cn("h-full transition-none rounded-b-2xl", BAR_COLOR[type])}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/* ─── Context & Provider ─────────────────────────────── */

interface ToastContextValue {
  showToast: (opts: Omit<FancyToastData, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue>({ showToast: () => {} });

export function FancyToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<FancyToastData[]>([]);

  const showToast = (opts: Omit<FancyToastData, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, ...opts }]);
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Viewport — fixed top-center */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <FancyToastItem {...t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useFancyToast() {
  return React.useContext(ToastContext);
}
