"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Locked Offer — Candado + blur + timer
// La oferta está visible pero BLOQUEADA hasta que el timer acabe
// Crea curiosidad + urgencia

interface LockedOfferProps {
  children: React.ReactNode;
  unlockAfter?: number; // seconds
  headline?: string;
  enabled?: boolean;
}

export function LockedOffer({
  children,
  unlockAfter = 180,
  headline = "Tu oferta exclusiva se desbloquea en:",
  enabled = true,
}: LockedOfferProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(unlockAfter);

  useEffect(() => {
    if (!enabled) {
      setUnlocked(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setUnlocked(true);
          if (typeof window !== "undefined" && window.posthog) {
            window.posthog.capture("locked_offer_unlocked");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [enabled, unlockAfter]);

  if (!enabled || unlocked) {
    return <>{children}</>;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative">
      {/* Blurred content behind */}
      <div className="filter blur-[8px] pointer-events-none select-none opacity-40">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-2xl">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Lock icon */}
          <motion.div
            className="text-5xl"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            🔒
          </motion.div>

          <p className="text-sm text-muted-foreground">{headline}</p>

          {/* Timer */}
          <div className="flex items-center justify-center gap-2 text-3xl font-mono font-bold">
            <div className="glass w-16 h-18 rounded-lg flex items-center justify-center">
              {String(minutes).padStart(2, "0")}
            </div>
            <span className="text-muted-foreground">:</span>
            <div className="glass w-16 h-18 rounded-lg flex items-center justify-center">
              {String(seconds).padStart(2, "0")}
            </div>
          </div>

          <p className="text-xs text-muted-foreground opacity-60">
            No cierres esta página o perderás tu oferta
          </p>
        </motion.div>
      </div>
    </div>
  );
}
