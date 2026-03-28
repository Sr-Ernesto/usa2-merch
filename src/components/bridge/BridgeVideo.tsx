"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Bridge Video — Glassmorphism frame + border beam + glow
// Inspirado en Magic UI (border-beam, glass) + React Bits (LightRays)

interface BridgeVideoProps {
  videoUrl?: string;
  thumbnailUrl?: string;
  label?: string;
}

export function BridgeVideo({
  videoUrl = "",
  thumbnailUrl = "",
  label = "Mira este video (3 min)",
}: BridgeVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      className="relative max-w-3xl mx-auto mb-10"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      {/* Glow detrás del video */}
      <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-[60px] opacity-50" />

      {/* Label */}
      <p className="text-center text-sm text-muted-foreground mb-3 relative z-10">
        🎬 {label}
      </p>

      {/* Glass frame con border beam */}
      <div className="relative rounded-2xl overflow-hidden glass-strong p-1">
        {/* Border beam animado */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div
            className="absolute inset-[-2px] rounded-2xl"
            style={{
              background: `conic-gradient(from 0deg, transparent, hsl(var(--primary)), transparent 30%)`,
              animation: "spin 3s linear infinite",
            }}
          />
          <div className="absolute inset-[2px] rounded-2xl bg-black" />
        </div>

        {/* Video container */}
        <div className="relative rounded-xl overflow-hidden aspect-video bg-black/80">
          {isPlaying && videoUrl ? (
            <iframe
              src={videoUrl}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 w-full h-full group cursor-pointer"
            >
              {/* Thumbnail */}
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-6xl opacity-50">▶</div>
                </div>
              )}

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-0 h-0 border-l-[24px] border-l-white border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent ml-2" />
                </motion.div>
              </div>

              {/* Pulse rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 rounded-full border border-white/10 animate-ping" />
              </div>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
