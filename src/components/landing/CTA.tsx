"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTracking } from "@/hooks/useTracking";

// CTA Final — el último empujón. Page UI style.

export function CTA() {
  const { ctaClick } = useTracking();

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 aurora-bg opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            ¿Listo para empezar?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Miles de personas ya dieron el paso. La garantía de 7 días hace que el riesgo sea tuyo, no del comprador.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="glow"
              size="xl"
              onClick={() => ctaClick("cta-final-primary", "bottom")}
            >
              Quiero mi acceso ahora →
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={() => {
                document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                ctaClick("cta-final-pricing", "bottom");
              }}
            >
              Ver planes
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            🔒 Pago seguro · ⚡ Acceso inmediato · 💰 Garantía 7 días
          </p>
        </motion.div>
      </div>
    </section>
  );
}
