"use client";

import { motion } from "framer-motion";

// Marquee infinito de social proof — inspirado en Magic UI
// Doble fila, direcciones opuestas

interface SocialProofItem {
  text: string;
  icon?: string;
}

const defaultItems: SocialProofItem[] = [
  { text: "+10,000 descargas", icon: "📥" },
  { text: "4.9★ rating", icon: "⭐" },
  { text: "Mentioned in ProductHunt", icon: "🚀" },
  { text: "100% garantizado", icon: "✅" },
  { text: "Envío instantáneo", icon: "⚡" },
  { text: "+50 países", icon: "🌍" },
];

export function SocialProofBand({ items = defaultItems }: { items?: SocialProofItem[] }) {
  const doubled = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden border-y border-border bg-muted/30 py-4">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      {/* Row 1 */}
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="mx-8 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </span>
        ))}
      </div>

      {/* Row 2 (reverse) */}
      <div className="flex animate-marquee-reverse whitespace-nowrap mt-2">
        {doubled.reverse().map((item, i) => (
          <span key={i} className="mx-8 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
