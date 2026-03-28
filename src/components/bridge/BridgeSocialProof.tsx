"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Bridge Social Proof — Marquee + Number Ticker + Avatar Circles
// Inspirado en Magic UI (marquee, number-ticker, avatar-circles)

interface JoinEvent {
  name: string;
  city: string;
  timeAgo: string;
}

const defaultEvents: JoinEvent[] = [
  { name: "María", city: "Medellín", timeAgo: "hace 2 min" },
  { name: "Carlos", city: "Bogotá", timeAgo: "hace 5 min" },
  { name: "Ana", city: "Ciudad de México", timeAgo: "hace 8 min" },
  { name: "Lucas", city: "São Paulo", timeAgo: "hace 12 min" },
  { name: "Sofía", city: "Lima", timeAgo: "hace 15 min" },
  { name: "Diego", city: "Buenos Aires", timeAgo: "hace 18 min" },
  { name: "Camila", city: "Santiago", timeAgo: "hace 22 min" },
  { name: "João", city: "Rio de Janeiro", timeAgo: "hace 25 min" },
];

interface BridgeSocialProofProps {
  memberCount?: number;
  joinEvents?: JoinEvent[];
  showTicker?: boolean;
  showMarquee?: boolean;
  showAvatars?: boolean;
}

export function BridgeSocialProof({
  memberCount = 1247,
  joinEvents = defaultEvents,
  showTicker = true,
  showMarquee = true,
  showAvatars = true,
}: BridgeSocialProofProps) {
  const [currentEvent, setCurrentEvent] = useState(0);

  // Rotate join events
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEvent((prev) => (prev + 1) % joinEvents.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [joinEvents.length]);

  return (
    <div className="flex flex-col items-center gap-6 mb-10">
      {/* Number Ticker */}
      {showTicker && (
        <motion.div
          className="flex items-center gap-2 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <NumberTicker target={memberCount} />
          <span className="text-muted-foreground">personas ya se unieron</span>
        </motion.div>
      )}

      {/* Avatar Circles */}
      {showAvatars && (
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4 }}
        >
          <div className="flex -space-x-3">
            {["M", "C", "A", "L", "S", "D", "J", "+"].map((initial, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold"
                style={{
                  background: `hsl(${(i * 47) % 360}, 60%, 50%)`,
                }}
              >
                {initial}
              </div>
            ))}
          </div>
          <span className="ml-3 text-sm text-muted-foreground">
            +{memberCount - 8} más
          </span>
        </motion.div>
      )}

      {/* Live join ticker */}
      {showMarquee && (
        <motion.div
          className="h-6 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentEvent}
              className="text-sm text-muted-foreground flex items-center gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              {joinEvents[currentEvent].name} de {joinEvents[currentEvent].city} se unió{" "}
              {joinEvents[currentEvent].timeAgo}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

// Number Ticker — cuenta animada desde 0 hasta target
function NumberTicker({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span className="font-bold text-2xl gradient-text">
      {count.toLocaleString()}
    </span>
  );
}
