"use client";

import { motion } from "framer-motion";

// Fashion Header — Brand + value prop + CTA
// Mobile-first. Comunica "moda circular" en 3 segundos.

interface FashionHeaderProps {
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  ctaText?: string;
  showMarquee?: boolean;
}

export function FashionHeader({
  brandName,
  tagline,
  whatsappNumber,
  ctaText = "Ver catálogo por WhatsApp →",
  showMarquee = true,
}: FashionHeaderProps) {
  return (
    <div className="text-center mb-8">
      {/* Brand name con animación */}
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {brandName}
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="text-muted-foreground mb-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {tagline}
      </motion.p>

      {/* Sustainability badge */}
      <motion.div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs text-accent mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        🌿 Moda circular · Reusa · Reduce · Renuéva
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <button className="relative overflow-hidden px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold">
            {/* Shimmer */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)`,
                backgroundSize: "200% 100%",
                animation: "shimmer 2s linear infinite",
              }}
            />
            <span className="relative z-10">{ctaText}</span>
          </button>
        </a>
      </motion.div>

      {/* Marquee de confianza */}
      {showMarquee && (
        <div className="mt-6 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[
              "🚚 Envío gratis >$50,000",
              "🔄 Devolución 24h",
              "💳 Nequi + Bancolombia + Efecty",
              "📸 Fotos reales del producto",
              "📏 Te enviamos las medidas",
              "🌿 Moda sostenible",
              "🚚 Envío gratis >$50,000",
              "🔄 Devolución 24h",
              "💳 Nequi + Bancolombia + Efecty",
              "📸 Fotos reales del producto",
              "📏 Te enviamos las medidas",
              "🌿 Moda sostenible",
            ].map((item, i) => (
              <span key={i} className="mx-6 text-xs text-muted-foreground">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
