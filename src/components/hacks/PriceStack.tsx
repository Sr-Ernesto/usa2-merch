"use client";

import { motion } from "framer-motion";

// Price Stack — Comparativa visual de precios (ancla)
// "Valor total: $348 → Hoy: $47"

interface PriceStackItem {
  name: string;
  value: number;
}

interface PriceStackProps {
  items?: PriceStackItem[];
  finalPrice?: number;
  savingsLabel?: string;
  currency?: string;
}

const defaultItems: PriceStackItem[] = [
  { name: "Producto principal", value: 197 },
  { name: "Bonus 1: Guía avanzada", value: 67 },
  { name: "Bonus 2: Plantillas", value: 47 },
  { name: "Bonus 3: Comunidad VIP", value: 37 },
];

export function PriceStack({
  items = defaultItems,
  finalPrice = 47,
  savingsLabel = "Ahorras hoy",
  currency = "$",
}: PriceStackProps) {
  const totalValue = items.reduce((sum, item) => sum + item.value, 0);
  const savings = totalValue - finalPrice;
  const discountPercent = Math.round((savings / totalValue) * 100);

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        className="glass-strong rounded-2xl p-8 overflow-hidden relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-accent/20 rounded-full blur-[80px]" />

        <div className="relative z-10">
          <h3 className="text-lg font-bold text-center mb-6">Todo lo que recibes:</h3>

          {/* Stack items */}
          <div className="space-y-3 mb-6">
            {items.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center justify-between py-2 border-b border-border/50"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-accent">✅</span>
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm text-muted-foreground line-through">
                  {currency}{item.value}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Total value */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Valor total:</span>
            <span className="text-lg line-through text-muted-foreground">
              {currency}{totalValue}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent my-4" />

          {/* Today's price */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Precio de hoy:</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl font-bold gradient-text">
                {currency}{finalPrice}
              </span>
              <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-bold">
                -{discountPercent}%
              </span>
            </div>
            <p className="text-sm text-accent mt-2">
              {savingsLabel}: {currency}{savings}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
