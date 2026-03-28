"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Fashion Grid — Grid visual de prendas con click → WhatsApp
// Mobile-first. Cada prenda es un card que abre WhatsApp directo.

interface Prenda {
  id: string;
  imagen: string;
  nombre: string;
  precio: number;
  precioOriginal?: number;
  talla: string;
  estado: "nuevo-etiqueta" | "como-nuevo" | "buen-estado";
  disponible: boolean;
  whatsappMessage?: string;
}

interface FashionGridProps {
  prendas: Prenda[];
  whatsappNumber: string;
  columns?: 2 | 3;
  showFilter?: boolean;
}

const estadoLabels: Record<string, { label: string; color: string }> = {
  "nuevo-etiqueta": { label: "Nuevo con etiqueta", color: "bg-green-500/20 text-green-400" },
  "como-nuevo": { label: "Como nuevo", color: "bg-blue-500/20 text-blue-400" },
  "buen-estado": { label: "Buen estado", color: "bg-yellow-500/20 text-yellow-400" },
};

export function FashionGrid({
  prendas,
  whatsappNumber,
  columns = 2,
  showFilter = true,
}: FashionGridProps) {
  const [filter, setFilter] = useState<string>("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered =
    filter === "all"
      ? prendas
      : prendas.filter((p) => p.estado === filter);

  const openWhatsApp = (prenda: Prenda) => {
    const msg =
      prenda.whatsappMessage ||
      `Hola! Vi "${prenda.nombre}" en talla ${prenda.talla} a $${prenda.precio.toLocaleString()}. ¿Sigue disponible?`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");

    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.capture("fashion_item_click", {
        item: prenda.nombre,
        price: prenda.precio,
        size: prenda.talla,
      });
    }
  };

  return (
    <div>
      {/* Filter pills */}
      {showFilter && (
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6 px-1">
          {[
            { key: "all", label: "Todo" },
            { key: "nuevo-etiqueta", label: "🏷️ Nuevo" },
            { key: "como-nuevo", label: "✨ Como nuevo" },
            { key: "buen-estado", label: "👍 Buen estado" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "glass text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div
        className={`grid gap-3 ${
          columns === 3 ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        {filtered.map((prenda, i) => (
          <motion.div
            key={prenda.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative group cursor-pointer"
            onClick={() => prenda.disponible && openWhatsApp(prenda)}
            onMouseEnter={() => setHoveredId(prenda.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Image */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2">
              <img
                src={prenda.imagen}
                alt={prenda.nombre}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay on hover/tap */}
              <div
                className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                  hoveredId === prenda.id ? "opacity-100" : "opacity-0"
                }`}
              >
                {prenda.disponible ? (
                  <div className="text-center">
                    <div className="text-3xl mb-1">💬</div>
                    <p className="text-sm font-medium text-white">
                      Preguntar por WhatsApp
                    </p>
                  </div>
                ) : (
                  <div className="px-3 py-1 bg-red-500/80 rounded-full">
                    <p className="text-sm font-bold text-white">VENDIDO</p>
                  </div>
                )}
              </div>

              {/* Estado badge */}
              <div className="absolute top-2 left-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-md ${
                    estadoLabels[prenda.estado]?.color || ""
                  }`}
                >
                  {estadoLabels[prenda.estado]?.label}
                </span>
              </div>

              {/* Talla badge */}
              <div className="absolute top-2 right-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/50 backdrop-blur-md text-white">
                  {prenda.talla}
                </span>
              </div>

              {/* Sold out overlay */}
              {!prenda.disponible && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-bold text-lg rotate-[-15deg] opacity-80">
                    VENDIDO
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="px-1">
              <p className="text-sm font-medium truncate">{prenda.nombre}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-bold text-accent">
                  ${prenda.precio.toLocaleString()}
                </span>
                {prenda.precioOriginal && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${prenda.precioOriginal.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
