"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ExitIntent } from "../hacks/ExitIntent";
import { ConversionHacks } from "../hacks/ConversionHacks";
import { FashionDetailPopup } from "./FashionDetailPopup";

/**
 * 👗 Fashion Bridge Page — Usa2 Merch
 *
 * Diseño directo: productos arriba, sin hero gigante.
 * Motion inteligente: stagger, tilt, floating CTA, counters.
 * Todo ayuda a vender. Nada ocupa espacio innecesario.
 */

interface Prenda {
  id: string;
  imagen: string;
  nombre: string;
  marca?: string;
  precio: number;
  precioOriginal?: number;
  talla: string;
  estado: "nuevo-etiqueta" | "como-nuevo" | "buen-estado";
  disponible: boolean;
  medidas?: {
    largo?: string;
    busto?: string;
    cintura?: string;
    cadera?: string;
    hombros?: string;
    mangas?: string;
  };
  equivalencia?: string;
  descripcionEstado?: string;
}

interface FashionBridgePageProps {
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  prendas: Prenda[];
  ciudadRecogida?: string;
  hacksEnabled?: boolean;
  exitIntentEnabled?: boolean;
}

const estadoLabels: Record<string, { label: string; color: string }> = {
  "nuevo-etiqueta": { label: "Nuevo", color: "bg-green-500/20 text-green-400" },
  "como-nuevo": { label: "Como nuevo", color: "bg-blue-500/20 text-blue-400" },
  "buen-estado": { label: "Buen estado", color: "bg-yellow-500/20 text-yellow-400" },
};

export function FashionBridgePage({
  brandName,
  tagline,
  whatsappNumber,
  prendas,
  ciudadRecogida,
  hacksEnabled = true,
  exitIntentEnabled = true,
}: FashionBridgePageProps) {
  const [filter, setFilter] = useState("all");
  const [selectedPrenda, setSelectedPrenda] = useState<Prenda | null>(null);
  const filtered = filter === "all" ? prendas : prendas.filter((p) => p.estado === filter);

  const openWhatsApp = (prenda: Prenda) => {
    const msg = `Hola! Vi "${prenda.nombre}"${prenda.marca ? ` de ${prenda.marca}` : ""} en talla ${prenda.talla} a $${prenda.precio.toLocaleString()}. ¿Sigue disponible?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.capture("fashion_item_click", { item: prenda.nombre, price: prenda.precio });
    }
  };

  const handleCardClick = (prenda: Prenda) => {
    if (!prenda.disponible) return;
    setSelectedPrenda(prenda);
  };

  return (
    <ConversionHacks config={{ tabRecovery: { enabled: hacksEnabled }, socialToasts: { enabled: false }, exitIntent: { enabled: false } }}>
      <main className="relative min-h-screen overflow-hidden pb-24">
        {/* Background sutil */}
        <div className="absolute inset-0 aurora-bg opacity-15" />

        <div className="relative z-10 max-w-lg mx-auto px-4 pt-6">
          {/* ═══ BRAND (compacto, sin hero) ═══ */}
          <ScrollReveal>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-1">{brandName}</h1>
              <p className="text-muted-foreground text-sm mb-3">{tagline}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs text-accent">
                🌿 Moda circular · Reusa · Reduce · Renuéva
              </div>
            </div>
          </ScrollReveal>

          {/* ═══ CTA ARRIBA (visible sin scrollear) ═══ */}
          <ScrollReveal delay={0.1}>
            <div className="text-center mb-6">
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                <motion.button
                  className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ShimmerOverlay />
                  <span className="relative z-10">Ver catálogo por WhatsApp →</span>
                </motion.button>
              </a>
            </div>
          </ScrollReveal>

          {/* ═══ MARQUEE ═══ */}
          <div className="overflow-hidden py-3 mb-6 border-y border-border/30">
            <div className="flex animate-marquee whitespace-nowrap">
              {[
                "🧼 Higienizado ✓", "🚚 Envío gratis >$50,000", "🛡️ Cambio si hay defecto",
                "💳 Nequi + Bancolombia", "📸 Fotos reales", "📏 Medidas exactas",
                "📍 Recogida gratis Urabá", "🌿 Moda sostenible",
                "🧼 Higienizado ✓", "🚚 Envío gratis >$50,000", "🛡️ Cambio si hay defecto",
                "💳 Nequi + Bancolombia", "📸 Fotos reales", "📏 Medidas exactas",
                "📍 Recogida gratis Urabá", "🌿 Moda sostenible",
              ].map((item, i) => (
                <span key={i} className="mx-5 text-xs text-muted-foreground">{item}</span>
              ))}
            </div>
          </div>

          {/* ═══ SOCIAL PROOF ═══ */}
          <ScrollReveal>
            <SocialProofLive />
          </ScrollReveal>

          {/* ═══ FILTROS ═══ */}
          <ScrollReveal delay={0.1}>
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 px-1">
              {[
                { key: "all", label: "Todo", emoji: "✨" },
                { key: "nuevo-etiqueta", label: "Nuevo", emoji: "🏷️" },
                { key: "como-nuevo", label: "Como nuevo", emoji: "💎" },
                { key: "buen-estado", label: "Buen estado", emoji: "👍" },
              ].map((f) => (
                <motion.button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === f.key ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "glass text-muted-foreground"
                  }`}
                  whileTap={{ scale: 0.95 }}
                  layout
                >
                  {f.emoji} {f.label}
                </motion.button>
              ))}
            </div>
          </ScrollReveal>

          {/* ═══ GRID DE PRENDAS (con stagger + tilt) ═══ */}
          <motion.div layout className="grid grid-cols-2 gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((prenda, i) => (
                <TiltCard key={prenda.id} prenda={prenda} index={i} onClick={() => handleCardClick(prenda)} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* ═══ STATS ═══ */}
          <ScrollReveal>
            <section className="py-10">
              <div className="glass rounded-2xl p-6 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] mb-4">Nuestros números</p>
                <div className="grid grid-cols-3 gap-4">
                  <AnimatedCounter target={2847} label="Prendas vendidas" />
                  <AnimatedCounter target={96} label="% satisfechas" suffix="%" />
                  <AnimatedCounter target={3} label="Días envío" />
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* ═══ CTA FINAL ═══ */}
          <ScrollReveal>
            <div className="text-center pb-8">
              <p className="text-sm text-muted-foreground mb-3">¿No encontraste lo tuyo?</p>
              <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hola! Busco una prenda específica. ¿Me pueden ayudar?")}`} target="_blank" rel="noopener noreferrer">
                <motion.button className="px-8 py-3 rounded-xl glass font-medium hover:bg-white/10 transition-colors" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  💬 Escríbenos tu búsqueda →
                </motion.button>
              </a>
            </div>
          </ScrollReveal>

          {/* ═══ FOOTER ═══ */}
          <footer className="text-center text-xs text-muted-foreground space-y-1 pb-8">
            <p>🚚 Envío a toda Colombia · 📍 Recogida gratis Urabá · 🛡️ Cambio si hay defecto</p>
            <p>💳 Nequi · Bancolombia · Efecty · PSE</p>
          </footer>
        </div>

        {/* ═══ FLOATING CTA ═══ */}
        <FloatingCTA whatsappNumber={whatsappNumber} />

        {/* ═══ DETAIL POPUP ═══ */}
        <FashionDetailPopup
          prenda={selectedPrenda}
          onClose={() => setSelectedPrenda(null)}
          whatsappNumber={whatsappNumber}
          ciudadRecogida={ciudadRecogida}
        />

        {/* ═══ EXIT INTENT ═══ */}
        {exitIntentEnabled && (
          <ExitIntent
            enabled={true}
            variant="discount"
            headline="¡Primera compra con descuento!"
            body="Toma un 10% de descuento en tu primera compra. Escríbenos y menciona USA2MERCH."
            ctaText="Quiero mi descuento →"
            ctaLink={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hola! Vi el descuento de primera compra en su página 🎁")}`}
            discountPercent={10}
          />
        )}
      </main>
    </ConversionHacks>
  );
}

// ═══ TILT CARD ═══
function TiltCard({ prenda, index, onClick }: { prenda: Prenda; index: number; onClick: () => void }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setTilt({ x: ((e.clientY - rect.top) / rect.height - 0.5) * -6, y: ((e.clientX - rect.left) / rect.width - 0.5) * 6 });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="cursor-pointer"
      onClick={onClick}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 800 }}
    >
      <motion.div style={{ rotateX: tilt.x, rotateY: tilt.y, transformStyle: "preserve-3d" }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
        {/* Foto limpia — SIN badges encima */}
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 group">
          <motion.img src={prenda.imagen} alt={prenda.nombre} className="w-full h-full object-cover" loading="lazy" whileHover={{ scale: 1.06 }} transition={{ duration: 0.5 }} />

          {/* Solo hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
              <motion.div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-1" whileHover={{ scale: 1.1 }}>
                <span className="text-lg">💬</span>
              </motion.div>
              <p className="text-xs font-medium text-white">Preguntar</p>
            </div>
          </div>

          {/* VENDIDO overlay */}
          {!prenda.disponible && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg rotate-[-15deg]">VENDIDO</span>
            </div>
          )}
        </div>

        {/* Toda la info DEBAJO de la foto */}
        <div className="px-0.5">
          {/* Fila 1: Marca + Estado + Talla */}
          <div className="flex items-center justify-between mb-0.5">
            {prenda.marca ? (
              <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground truncate">{prenda.marca}</p>
            ) : <div />}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className={`text-[10px] font-medium ${estadoLabels[prenda.estado]?.color || ""}`}>
                {estadoLabels[prenda.estado]?.label}
              </span>
              <span className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded">
                {prenda.talla}
              </span>
            </div>
          </div>

          {/* Fila 2: Nombre */}
          <p className="text-sm font-medium truncate mb-0.5">{prenda.nombre}</p>

          {/* Fila 3: Precio */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-accent">${prenda.precio.toLocaleString()}</span>
            {prenda.precioOriginal && (
              <>
                <span className="text-xs text-muted-foreground line-through">${prenda.precioOriginal.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                  -{Math.round(((prenda.precioOriginal - prenda.precio) / prenda.precioOriginal) * 100)}%
                </span>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══ SOCIAL PROOF ═══
function SocialProofLive() {
  const [current, setCurrent] = useState(0);
  const ventas = [
    { nombre: "María", ciudad: "Medellín", prenda: "el vestido azul", tiempo: "hace 12 min" },
    { nombre: "Laura", ciudad: "Bogotá", prenda: "la chaqueta denim", tiempo: "hace 25 min" },
    { nombre: "Valentina", ciudad: "Cali", prenda: "los jeans mom", tiempo: "hace 1 hora" },
    { nombre: "Daniela", ciudad: "Barranquilla", prenda: "la blusa floral", tiempo: "hace 2 horas" },
  ];

  useEffect(() => {
    const interval = setInterval(() => setCurrent((p) => (p + 1) % ventas.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass rounded-xl p-3 flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
        {ventas[current].nombre.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.p key={current} className="text-sm truncate" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.2 }}>
            <strong>{ventas[current].nombre}</strong> de {ventas[current].ciudad} se llevó {ventas[current].prenda}
          </motion.p>
        </AnimatePresence>
        <p className="text-[10px] text-muted-foreground">{ventas[current].tiempo}</p>
      </div>
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
    </div>
  );
}

// ═══ ANIMATED COUNTER ═══
function AnimatedCounter({ target, label, suffix = "" }: { target: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const duration = 2000, steps = 60, increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <motion.div onViewportEnter={() => setStarted(true)} viewport={{ once: true }}>
      <p className="text-2xl font-bold">{count.toLocaleString()}{suffix}</p>
      <p className="text-[10px] text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
}

// ═══ FLOATING CTA ═══
function FloatingCTA({ whatsappNumber }: { whatsappNumber: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="fixed bottom-4 left-4 right-4 z-50 max-w-lg mx-auto" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ type: "spring", damping: 25 }}>
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="block">
            <button className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-2xl shadow-primary/30 relative overflow-hidden">
              <ShimmerOverlay />
              <span className="relative z-10">💬 Comprar por WhatsApp</span>
            </button>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══ SCROLL REVEAL ═══
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }} transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}>
      {children}
    </motion.div>
  );
}

// ═══ SHIMMER ═══
function ShimmerOverlay() {
  return (
    <div className="absolute inset-0 opacity-30" style={{
      background: `linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)`,
      backgroundSize: "200% 100%",
      animation: "shimmer 2s linear infinite",
    }} />
  );
}
