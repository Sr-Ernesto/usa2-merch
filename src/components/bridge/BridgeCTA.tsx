"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Bridge CTA — Shimmer button + countdown + urgency
// Inspirado en Magic UI (shimmer-button, border-beam)

interface BridgeCTAProps {
  whatsappLink: string;
  spotsLeft?: number;
  deadline?: Date;
  ctaText?: string;
  urgencyText?: string;
  trustBadges?: string[];
}

export function BridgeCTA({
  whatsappLink,
  spotsLeft = 23,
  deadline,
  ctaText = "Unirme al grupo →",
  urgencyText = "Solo quedan {spots} lugares",
  trustBadges = ["🔒 Gratis", "⚡ Acceso inmediato", "💰 Sin compromiso"],
}: BridgeCTAProps) {
  return (
    <motion.div
      className="text-center space-y-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8, duration: 0.6 }}
    >
      {/* Urgency text */}
      <p className="text-sm font-medium text-orange-400 flex items-center justify-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
        </span>
        {urgencyText.replace("{spots}", String(spotsLeft))}
      </p>

      {/* Countdown si hay deadline */}
      {deadline && <CountdownTimer deadline={deadline} />}

      {/* Shimmer CTA Button */}
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-block">
        <ShimmerButton className="px-10 py-4 text-lg font-bold rounded-xl">
          {ctaText}
        </ShimmerButton>
      </a>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        {trustBadges.map((badge, i) => (
          <span key={i}>{badge}</span>
        ))}
      </div>
    </motion.div>
  );
}

// Shimmer Button — el botón BRILLA
function ShimmerButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.button
      className={`relative overflow-hidden bg-primary text-primary-foreground ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Shimmer effect */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)`,
          backgroundSize: "200% 100%",
          animation: "shimmer 2s linear infinite",
        }}
      />

      {/* Border glow */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: "0 0 20px hsl(var(--primary) / 0.4), inset 0 0 20px hsl(var(--primary) / 0.1)",
        }}
      />

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// Countdown Timer — dígitos que flippean
function CountdownTimer({ deadline }: { deadline: Date }) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, deadline.getTime() - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div className="flex items-center justify-center gap-2 text-2xl font-mono font-bold">
      <FlipDigit value={time.h} label="hrs" />
      <span className="text-muted-foreground">:</span>
      <FlipDigit value={time.m} label="min" />
      <span className="text-muted-foreground">:</span>
      <FlipDigit value={time.s} label="seg" />
    </div>
  );
}

function FlipDigit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="glass w-14 h-16 rounded-lg flex items-center justify-center text-3xl">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-[10px] text-muted-foreground mt-1">{label}</span>
    </div>
  );
}
