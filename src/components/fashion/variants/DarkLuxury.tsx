"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * 🖤 Dark Luxury — Concepto de segunda mano de lujo
 *
 * Inspirado en: Vestiaire Collective, The RealReal, Grailed
 * Vibe: Editorial de moda. Oscuro. Exclusivo. Cinemático.
 *
 * NO parece tienda de segunda mano. Parece una galería.
 */

interface LuxuryItem {
  id: string;
  imagen: string;
  marca: string;
  nombre: string;
  precio: number;
  precioRetail: number;
  descuento: number;
  talla: string;
  condicion: "pristine" | "excellent" | "very-good";
  whatsappMessage?: string;
}

interface DarkLuxuryProps {
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  heroImage: string;
  items: LuxuryItem[];
}

const condicionBadge: Record<string, { label: string; dot: string }> = {
  pristine: { label: "Pristine", dot: "bg-emerald-400" },
  excellent: { label: "Excellent", dot: "bg-blue-400" },
  "very-good": { label: "Very Good", dot: "bg-amber-400" },
};

export function DarkLuxury({
  brandName,
  tagline,
  whatsappNumber,
  heroImage,
  items,
}: DarkLuxuryProps) {
  const [selectedItem, setSelectedItem] = useState<LuxuryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate hero items
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  const openWhatsApp = (item: LuxuryItem) => {
    const msg =
      item.whatsappMessage ||
      `Hola. Consulto ${item.marca} ${item.nombre} — Talla ${item.talla} — $${item.precio.toLocaleString()}. ¿Disponible?`;
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ═══ HERO CINEMÁTICO ═══ */}
      <section className="relative h-[85vh] overflow-hidden">
        {/* Background image con parallax feel */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5 }}
            >
              <img
                src={items[currentIndex]?.imagen || heroImage}
                alt=""
                className="w-full h-full object-cover opacity-40"
              />
            </motion.div>
          </AnimatePresence>

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-16 max-w-lg mx-auto">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-2">
              Curated Luxury
            </p>
            <h1 className="text-5xl font-light tracking-tight mb-3">
              {brandName}
            </h1>
            <p className="text-neutral-400 text-sm mb-8">{tagline}</p>
          </motion.div>

          {/* Rotating item preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                Ahora disponible
              </p>
              <p className="text-lg font-light">
                {items[currentIndex]?.marca} — {items[currentIndex]?.nombre}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xl font-light">
                  ${items[currentIndex]?.precio.toLocaleString()}
                </span>
                <span className="text-xs text-neutral-500 line-through">
                  ${items[currentIndex]?.precioRetail.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-400">
                  -{items[currentIndex]?.descuento}%
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex gap-1.5 mb-8">
            {items.slice(0, 6).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-0.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-8 bg-white" : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* CTA */}
          <motion.a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <button className="w-full py-4 rounded-none border border-white/20 text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500">
              Solicitar catálogo privado
            </button>
          </motion.a>
        </div>
      </section>

      {/* ═══ GRID EDITORIAL ═══ */}
      <section className="px-4 py-16 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-1">
              Colección
            </p>
            <h2 className="text-2xl font-light">Piezas seleccionadas</h2>
          </div>
          <p className="text-xs text-neutral-500">
            {items.filter((i) => true).length} piezas
          </p>
        </div>

        {/* Masonry-like grid */}
        <div className="columns-2 gap-3 space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="break-inside-avoid cursor-pointer group"
              onClick={() => setSelectedItem(item)}
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-sm mb-2">
                <img
                  src={item.imagen}
                  alt={`${item.marca} ${item.nombre}`}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  style={{
                    aspectRatio: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "1/1" : "4/5",
                  }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg">💬</span>
                    </div>
                    <p className="text-xs tracking-wider uppercase">
                      Consultar
                    </p>
                  </div>
                </div>

                {/* Condition badge */}
                <div className="absolute top-3 left-3">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        condicionBadge[item.condicion]?.dot
                      }`}
                    />
                    <span className="text-[10px] tracking-wider uppercase">
                      {condicionBadge[item.condicion]?.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info — minimal, editorial */}
              <div className="px-0.5">
                <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                  {item.marca}
                </p>
                <p className="text-sm font-light truncate">{item.nombre}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm">
                    ${item.precio.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-600 line-through">
                    ${item.precioRetail.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ SOCIAL PROOF — MINIMAL ═══ */}
      <section className="px-4 py-12 border-t border-white/5">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-6">
            Confían en nosotros
          </p>

          {/* Avatars */}
          <div className="flex justify-center -space-x-2 mb-4">
            {["C", "M", "A", "L", "V", "D", "S", "P"].map((letter, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-[10px] font-light"
                style={{
                  background: `linear-gradient(135deg, hsl(${i * 45}, 20%, 30%), hsl(${i * 45 + 30}, 20%, 20%))`,
                }}
              >
                {letter}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] text-neutral-400">
              +847
            </div>
          </div>

          <p className="text-xs text-neutral-500">
            +850 clientes satisfechos · 4.9★ en Google
          </p>
        </div>
      </section>

      {/* ═══ FOOTER MINIMAL ═══ */}
      <footer className="px-4 py-8 border-t border-white/5">
        <div className="max-w-lg mx-auto text-center space-y-4">
          <p className="text-xs text-neutral-600">
            🚚 Envíos a toda Colombia · 🔄 Garantía de autenticidad · 💳 Nequi
            · Bancolombia · PSE
          </p>
          <p className="text-[10px] text-neutral-700">
            © {new Date().getFullYear()} {brandName} — Moda circular de lujo
          </p>
        </div>
      </footer>

      {/* ═══ MODAL DE PRENDA ═══ */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-[9999] bg-neutral-950 rounded-t-2xl max-h-[80vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30 }}
            >
              <div className="p-6 max-w-lg mx-auto">
                {/* Handle */}
                <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-6" />

                {/* Image */}
                <div className="aspect-square rounded-lg overflow-hidden mb-6">
                  <img
                    src={selectedItem.imagen}
                    alt={selectedItem.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-1">
                  {selectedItem.marca}
                </p>
                <h3 className="text-xl font-light mb-2">
                  {selectedItem.nombre}
                </h3>

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-2xl font-light">
                    ${selectedItem.precio.toLocaleString()}
                  </span>
                  <span className="text-sm text-neutral-500 line-through">
                    ${selectedItem.precioRetail.toLocaleString()}
                  </span>
                  <span className="text-sm text-emerald-400">
                    -{selectedItem.descuento}%
                  </span>
                </div>

                <div className="flex gap-3 mb-6">
                  <div className="flex-1 glass rounded-lg p-3 text-center">
                    <p className="text-[10px] text-neutral-500 uppercase">
                      Talla
                    </p>
                    <p className="text-lg font-light">{selectedItem.talla}</p>
                  </div>
                  <div className="flex-1 glass rounded-lg p-3 text-center">
                    <p className="text-[10px] text-neutral-500 uppercase">
                      Condición
                    </p>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          condicionBadge[selectedItem.condicion]?.dot
                        }`}
                      />
                      <p className="text-sm font-light">
                        {condicionBadge[selectedItem.condicion]?.label}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    openWhatsApp(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="w-full py-4 bg-white text-black text-sm tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors"
                >
                  Consultar disponibilidad →
                </button>

                <p className="text-center text-[10px] text-neutral-600 mt-3">
                  Respuesta en menos de 30 minutos
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
