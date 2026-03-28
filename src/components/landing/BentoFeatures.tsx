"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Bento Grid con glassmorphism — combinación de Page UI + Magic UI

interface BentoItem {
  title: string;
  description: string;
  icon?: string;
  span?: "col-2" | "row-2" | "full";
  className?: string;
}

const defaultItems: BentoItem[] = [
  {
    title: "Súper rápido",
    description: "Carga en menos de 1 segundo. Sin esperas, sin excusas.",
    icon: "⚡",
    span: "col-2",
  },
  {
    title: "Diseño premium",
    description: "Glassmorphism, gradientes, animaciones fluidas.",
    icon: "🎨",
  },
  {
    title: "100% Mobile",
    description: "83% del tráfico viene del celular. Estamos listos.",
    icon: "📱",
  },
  {
    title: "Tracking invisible",
    description: "Meta CAPI server-side. Los adblockers no nos paran.",
    icon: "📊",
    span: "row-2",
  },
  {
    title: "Moneda local",
    description: "Detectamos tu país y mostramos precios en tu moneda.",
    icon: "💱",
  },
  {
    title: "SEO optimizado",
    description: "Core Web Vitals perfectos. Google nos ama.",
    icon: "🔍",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function BentoFeatures({ items = defaultItems }: { items?: BentoItem[] }) {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className={cn(
                "group relative rounded-2xl p-6 overflow-hidden",
                "glass hover:bg-white/10 transition-all duration-300",
                "hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10",
                item.span === "col-2" && "md:col-span-2",
                item.span === "row-2" && "md:row-span-2",
                item.span === "full" && "md:col-span-3",
                item.className
              )}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

              <div className="relative z-10">
                {item.icon && <span className="text-3xl mb-3 block">{item.icon}</span>}
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
