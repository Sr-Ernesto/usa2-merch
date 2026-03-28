"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

/**
 * ⚡ Motion Fashion — Reusa Co. con ESTEROIDES de animación
 *
 * Diferencias vs Reusa Co. original:
 * - Hero parallax con scroll
 * - Prendas aparecen una por una con stagger + scale
 * - Contadores animados
 * - Filtros con layout animation
 * - Scroll-triggered reveals por sección
 * - Floating CTA
 * - Tilt cards on hover
 * - Imágenes con parallax individual
 */

interface Prenda {
  id: string;
  imagen: string;
  nombre: string;
  precio: number;
  precioOriginal?: number;
  talla: string;
  estado: "nuevo-etiqueta" | "como-nuevo" | "buen-estado";
  disponible: boolean;
}

interface MotionFashionProps {
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  prendas: Prenda[];
}

const estadoLabels: Record<string, { label: string; color: string }> = {
  "nuevo-etiqueta": { label: "Nuevo", color: "bg-green-500/20 text-green-400" },
  "como-nuevo": { label: "Como nuevo", color: "bg-blue-500/20 text-blue-400" },
  "buen-estado": { label: "Buen estado", color: "bg-yellow-500/20 text-yellow-400" },
};

export function MotionFashion({
  brandName,
  tagline,
  whatsappNumber,
  prendas,
}: MotionFashionProps) {
  const [filter, setFilter] = useState("all");
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered =
    filter === "all" ? prendas : prendas.filter((p) => p.estado === filter);

  const openWhatsApp = (prenda: Prenda) => {
    const msg = `Hola! Vi "${prenda.nombre}" en talla ${prenda.talla} a $${prenda.precio.toLocaleString()}. ¿Sigue disponible?`;
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <main ref={containerRef} className="relative overflow-hidden">
      {/* ═══ HERO CON PARALLAX ═══ */}
      <HeroParallax brandName={brandName} tagline={tagline} whatsappNumber={whatsappNumber} />

      {/* ═══ STATS ANIMADOS ═══ */}
      <AnimatedStats />

      {/* ═══ MARQUEE ═══ */}
      <div className="overflow-hidden py-4 border-y border-border/30">
        <div className="flex animate-marquee whitespace-nowrap">
          {[
            "🚚 Envío gratis >$50,000",
            "🔄 Devolución 24h",
            "💳 Nequi + Bancolombia",
            "📸 Fotos reales",
            "🌿 Moda circular",
            "📏 Te enviamos medidas",
            "🚚 Envío gratis >$50,000",
            "🔄 Devolución 24h",
            "💳 Nequi + Bancolombia",
            "📸 Fotos reales",
            "🌿 Moda circular",
            "📏 Te enviamos medidas",
          ].map((item, i) => (
            <span key={i} className="mx-6 text-xs text-muted-foreground">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ SECCIÓN PRENDAS ═══ */}
      <section className="px-4 py-12 max-w-lg mx-auto">
        {/* Header con reveal */}
        <ScrollReveal>
          <div className="text-center mb-8">
            <p className="text-xs text-accent uppercase tracking-[0.3em] mb-2">
              Nuevo stock semanal
            </p>
            <h2 className="text-3xl font-bold">Piezas de esta semana</h2>
          </div>
        </ScrollReveal>

        {/* Filtros animados */}
        <motion.div className="flex gap-2 overflow-x-auto pb-4 mb-6 px-1">
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
                filter === f.key
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "glass text-muted-foreground"
              }`}
              whileTap={{ scale: 0.95 }}
              layout
            >
              {f.emoji} {f.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid con stagger animation */}
        <motion.div layout className="grid grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((prenda, i) => (
              <FashionCard
                key={prenda.id}
                prenda={prenda}
                index={i}
                onClick={() => prenda.disponible && openWhatsApp(prenda)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ═══ SOCIAL PROOF CON CONTADORES ═══ */}
      <ScrollReveal>
        <section className="px-4 py-16">
          <div className="max-w-lg mx-auto">
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] mb-6">
                Nuestros números
              </p>
              <div className="grid grid-cols-3 gap-6">
                <AnimatedCounter target={2847} label="Prendas vendidas" />
                <AnimatedCounter target={96} label="% satisfechas" suffix="%" />
                <AnimatedCounter target={3} label="Días promedio envío" suffix="" />
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ═══ CTA FINAL ═══ */}
      <ScrollReveal>
        <section className="px-4 py-16 text-center">
          <h3 className="text-2xl font-bold mb-3">¿No encontraste lo tuyo?</h3>
          <p className="text-muted-foreground mb-6">
            Escríbenos y buscaremos esa pieza especial para ti
          </p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              "Hola! Busco una prenda específica. ¿Me pueden ayudar?"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.button
              className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold relative overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)`,
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s linear infinite",
                }}
              />
              <span className="relative z-10">💬 Escríbenos por WhatsApp</span>
            </motion.button>
          </a>
        </section>
      </ScrollReveal>

      {/* ═══ FOOTER ═══ */}
      <footer className="px-4 py-8 text-center text-xs text-muted-foreground border-t border-border/30">
        <p>🚚 Envío a toda Colombia · 🔄 Devolución 24h · 🌿 Moda sostenible</p>
        <p className="mt-1">💳 Nequi · Bancolombia · Efecty · PSE</p>
      </footer>

      {/* ═══ FLOATING CTA ═══ */}
      <FloatingCTA whatsappNumber={whatsappNumber} />
    </main>
  );
}

// ═══ HERO CON PARALLAX ═══
function HeroParallax({
  brandName,
  tagline,
  whatsappNumber,
}: {
  brandName: string;
  tagline: string;
  whatsappNumber: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div ref={ref} className="relative h-[70vh] overflow-hidden">
      {/* Background image parallax */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop"
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Sustainability pill */}
          <motion.div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs text-accent mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            🌿 Moda circular · Reusa · Reduce · Renuéva
          </motion.div>

          {/* Brand name — cada letra aparece */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">
            {brandName.split("").map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  delay: 0.5 + i * 0.05,
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="text-muted-foreground mb-8 max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {tagline}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)`,
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s linear infinite",
                  }}
                />
                <span className="relative z-10">Ver catálogo por WhatsApp →</span>
              </motion.button>
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-white/50"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ═══ FASHION CARD CON TILT ═══
function FashionCard({
  prenda,
  index,
  onClick,
}: {
  prenda: Prenda;
  index: number;
  onClick: () => void;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -8, y: x * 8 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="cursor-pointer"
      onClick={onClick}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
      }}
    >
      <motion.div
        style={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 group">
          <motion.img
            src={prenda.imagen}
            alt={prenda.nombre}
            className="w-full h-full object-cover"
            loading="lazy"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6 }}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
              <motion.div
                className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-2"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <span className="text-xl">💬</span>
              </motion.div>
              <p className="text-xs font-medium text-white">Preguntar</p>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-md ${
                estadoLabels[prenda.estado]?.color || ""
              }`}
            >
              {estadoLabels[prenda.estado]?.label}
            </span>
          </div>
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/50 backdrop-blur-md text-white">
              {prenda.talla}
            </span>
          </div>

          {/* Sold overlay */}
          {!prenda.disponible && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg rotate-[-15deg]">
                VENDIDO
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-0.5">
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
    </motion.div>
  );
}

// ═══ ANIMATED STATS ═══
function AnimatedStats() {
  return (
    <ScrollReveal>
      <section className="px-4 py-8">
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-4 text-center">
          <div className="glass rounded-xl p-4">
            <p className="text-2xl font-bold gradient-text">🌿</p>
            <p className="text-xs text-muted-foreground mt-1">100% Sostenible</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-2xl font-bold gradient-text">♻️</p>
            <p className="text-xs text-muted-foreground mt-1">Moda circular</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-2xl font-bold gradient-text">🚚</p>
            <p className="text-xs text-muted-foreground mt-1">Envío gratis +$50k</p>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

// ═══ ANIMATED COUNTER ═══
function AnimatedCounter({
  target,
  label,
  suffix = "",
}: {
  target: number;
  label: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <motion.div
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true }}
    >
      <p className="text-3xl font-bold">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
}

// ═══ FLOATING CTA ═══
function FloatingCTA({ whatsappNumber }: { whatsappNumber: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 left-4 right-4 z-50 max-w-lg mx-auto"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
        >
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <button className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold shadow-2xl shadow-primary/30 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)`,
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s linear infinite",
                }}
              />
              <span className="relative z-10">💬 Comprar por WhatsApp</span>
            </button>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══ SCROLL REVEAL WRAPPER ═══
function ScrollReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
