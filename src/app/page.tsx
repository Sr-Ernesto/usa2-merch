"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SocialProofBand } from "@/components/landing/SocialProofBand";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { useTracking } from "@/hooks/useTracking";
import { useGeoCurrency } from "@/hooks/useGeoCurrency";
import { useEffect } from "react";

/**
 * 🏭 Landing Factory 2026 — Página Ensamblada
 *
 * Stack:
 * - Framer Motion: animaciones de entrada
 * - Glassmorphism: .glass class en globals.css
 * - Geo Currency: detección automática de moneda
 * - Tracking: PostHog + Meta CAPI + Meta Pixel
 * - Mobile-first: todo responsive por defecto
 *
 * Para reemplazar con componentes de las libs:
 * - Hero → Page UI LandingPrimaryCta / Magic UI hero-video-dialog
 * - Bento → Magic UI bento-grid / Page UI LandingBentoGridSection
 * - Testimonials → Page UI LandingTestimonialGrid
 * - Pricing → Page UI LandingPricingSection / Launch UI pricing/default
 * - FAQ → Launch UI faq/default / Page UI LandingFaq
 *
 * Libs en: ~/.openclaw/workspace/libs/
 */

export default function LandingPage() {
  const { pageView, ctaClick, scrollDepth } = useTracking();
  const { localPrice, loading } = useGeoCurrency(19.9);

  useEffect(() => {
    pageView();

    // Scroll depth tracking (25%, 50%, 75%, 100%)
    const thresholds = [25, 50, 75, 100];
    const triggered = new Set<number>();

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      thresholds.forEach((t) => {
        if (scrollPercent >= t && !triggered.has(t)) {
          triggered.add(t);
          scrollDepth(t);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative overflow-hidden">
      {/* ═══════════════════════════════════════
          SECTION 1: HERO
          ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Aurora background */}
        <div className="absolute inset-0 aurora-bg" />
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Nuevo — Actualizado marzo 2026
            </div>

            {/* Headline — máximo 8 palabras */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Tu producto merece una{" "}
              <span className="gradient-text">landing perfecta</span>
            </h1>

            {/* Subheadline — máximo 20 palabras */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Componentes modernos, animaciones fluidas y copy que convierte.
              Todo listo en minutos, no en semanas.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button
                variant="glow"
                size="xl"
                onClick={() => ctaClick("hero-primary", "hero")}
              >
                Empezar ahora →
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => {
                  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                  ctaClick("hero-pricing", "hero");
                }}
              >
                Ver planes {loading ? "..." : `desde ${localPrice}`}
              </Button>
            </div>

            {/* Trust line */}
            <p className="text-sm text-muted-foreground">
              ⚡ Acceso inmediato · 🔒 Pago seguro · 💰 Garantía 7 días
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2: SOCIAL PROOF BAND
          ═══════════════════════════════════════ */}
      <SocialProofBand />

      {/* ═══════════════════════════════════════
          SECTION 3: BENTO GRID FEATURES
          ═══════════════════════════════════════ */}
      <BentoFeatures />

      {/* ═══════════════════════════════════════
          SECTION 4: TESTIMONIALS
          ═══════════════════════════════════════ */}
      <Testimonials />

      {/* ═══════════════════════════════════════
          SECTION 5: PRICING
          ═══════════════════════════════════════ */}
      <div id="pricing">
        <Pricing />
      </div>

      {/* ═══════════════════════════════════════
          SECTION 6: FAQ
          ═══════════════════════════════════════ */}
      <FAQ />

      {/* ═══════════════════════════════════════
          SECTION 7: CTA FINAL
          ═══════════════════════════════════════ */}
      <CTA />

      {/* ═══════════════════════════════════════
          SECTION 8: FOOTER
          ═══════════════════════════════════════ */}
      <Footer />
    </main>
  );
}
