"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGeoCurrency } from "@/hooks/useGeoCurrency";
import { useTracking } from "@/hooks/useTracking";

// Pricing con moneda local automática — conversion-beast standard

interface PricingPlan {
  name: string;
  priceUsd: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  cta?: string;
}

const defaultPlans: PricingPlan[] = [
  {
    name: "Básico",
    priceUsd: 9.9,
    description: "Todo lo que necesitas para empezar",
    features: [
      "Acceso inmediato",
      "Guía completa en PDF",
      "Soporte por email",
      "Actualizaciones gratuitas",
    ],
    cta: "Empezar ahora",
  },
  {
    name: "Premium",
    priceUsd: 19.9,
    description: "Para los que quieren resultados reales",
    features: [
      "Todo del plan Básico",
      "Videos exclusivos paso a paso",
      "Plantillas editables",
      "Comunidad privada",
      "Bonos sorpresa",
    ],
    highlighted: true,
    badge: "Más popular",
    cta: "Quiero el Premium",
  },
  {
    name: "VIP",
    priceUsd: 39.9,
    description: "Acceso total + mentoría personal",
    features: [
      "Todo del plan Premium",
      "Sesión 1-a-1 de 30 min",
      "Revisión personalizada",
      "Acceso de por vida",
      "Prioridad en soporte",
    ],
    cta: "Acceso VIP",
  },
];

export function Pricing({ plans = defaultPlans }: { plans?: PricingPlan[] }) {
  return (
    <section className="py-24 px-4" id="pricing">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Elige tu plan</h2>
          <p className="text-muted-foreground text-lg">
            Inversión única. Acceso de por vida. Sin sorpresas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <PricingCard key={i} plan={plan} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  const { localPrice, loading } = useGeoCurrency(plan.priceUsd);
  const { initiateCheckout } = useTracking();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={cn(
        "relative rounded-2xl p-8 flex flex-col",
        plan.highlighted
          ? "glass-strong border-2 border-primary shadow-xl shadow-primary/20 scale-[1.02]"
          : "glass"
      )}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
          {plan.badge}
        </div>
      )}

      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
      <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

      <div className="mb-6">
        <span className="text-4xl font-bold">{loading ? "..." : localPrice}</span>
        <span className="text-muted-foreground text-sm ml-1">pago único</span>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="text-accent mt-0.5">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={plan.highlighted ? "glow" : "outline"}
        size="lg"
        className="w-full"
        onClick={() => initiateCheckout(plan.priceUsd, plan.name)}
      >
        {plan.cta || "Comprar"}
      </Button>
    </motion.div>
  );
}
