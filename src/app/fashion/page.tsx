"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * 👗 Usa2 Merch — Bridge Page v3
 *
 * ÚNICO objetivo: captar gente para el grupo de WhatsApp.
 * La venta ocurre EN EL GRUPO durante llegadas jueves y domingo.
 * 
 * v3: Copy validada por Sr. Gómez para Urabá.
 * - Marcas que la gente conoce (Nike, Adidas, Reebok)
 * - Sin "drop", sin "gratis" confuso, sin "centro"
 * - Fotos arriba, CTA claro: "únete a nuestro grupo de WhatsApp"
 */

export default function FashionSimple() {
  const [config, setConfig] = useState({
    brandName: "Usa2 Merch",
    tagline: "Prendas de segunda en excelente estado desde USA",
    whatsappGroup: "https://chat.whatsapp.com/FQ8LpYS8vGaLeRibdwlTUX?mode=gi_t",
    ciudadRecogida: "Urabá, Antioquia",
    nextDrop: { fecha: "2026-04-02", dia: "jueves", hora: 16, piezas: 25 },
    pastDrop: { piezas: 6, agotadoEn: "2 horas" },
    communitySize: 847,
    preview: [
      { imagen: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop", marca: "Nike", nombre: "Leggings Dri-FIT", precio: 20000, color: "Negro" },
      { imagen: "https://images.unsplash.com/photo-1549439602-43ebca2327af?w=600&h=800&fit=crop", marca: "Adidas", nombre: "Top deportivo", precio: 25000, color: "Rosa" },
      { imagen: "https://images.unsplash.com/photo-1550995694-3f5f4a7e1bd2?w=600&h=800&fit=crop", marca: "Reebok", nombre: "Sports bra", precio: 20000, color: "Azul" },
    ],
  });

  useEffect(() => {
    fetch("/data/drop.json")
      .then((r) => r.json())
      .then((data) => {
         if (data.preview && data.preview.length > 0) {
           setConfig((prev) => ({ ...prev, ...data }));
         } else {
           setConfig((prev) => ({ ...prev, ...data, preview: prev.preview }));
         }
      })
      .catch(() => {});
  }, []);

  const dropDate = new Date(`${config.nextDrop.fecha}T${String(config.nextDrop.hora).padStart(2, "0")}:00:00-05:00`);

  const trackCTAClick = (placement: string) => {
    (window as any).fbq?.('track', 'Lead', { content_name: 'WhatsApp Group Join', placement });
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'Lead', placement, url: window.location.href }),
    }).catch(() => {});
  };

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 1000], [0, 150]);

  return (
    <main className="relative min-h-screen overflow-hidden pb-24">
      {/* BG Parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-x-0 -top-[200px] -bottom-[200px] aurora-bg opacity-40 mix-blend-color-dodge filter saturate-200 blur-2xl" />

      <motion.div 
        className="relative z-10 max-w-lg mx-auto px-4 pt-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
        }}
      >

        {/* ═══ 1. HERO — Brand + Qué es ═══ */}
        <Reveal>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-1">{config.brandName}</h1>
            <p className="text-muted-foreground text-sm">{config.tagline}</p>
            <p className="text-xs text-muted-foreground mt-1">Marcas Nike, Adidas, Reebok · Prendas desde $20,000</p>
          </div>
        </Reveal>

        {/* ═══ 2. FOTOS — Arriba, visibles de una ═══ */}
        <Reveal>
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-2">
              {config.preview.slice(0, 3).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.5, type: "spring" }}
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                    <motion.img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-full h-full object-cover"
                      loading="eager"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute top-1.5 left-1.5">
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-white/90 text-black shadow-sm">
                        {item.marca || "Importada"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">Hay muchas más en el grupo</p>
          </div>
        </Reveal>

        {/* ═══ 3. CTA PRINCIPAL — Únete al grupo de WhatsApp ═══ */}
        <Reveal>
          <div className="text-center mb-6">
            <a href={config.whatsappGroup} target="_blank" rel="noopener noreferrer" onClick={() => trackCTAClick("primary")}>
              <motion.button
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-[length:200%_200%] animate-gradient-x text-white font-bold text-lg relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.6)] border border-green-400/50"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(16,185,129,0.8)" }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute inset-0 opacity-50" style={{ background: `linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.6) 50%, transparent 80%)`, backgroundSize: "200% 100%", animation: "shimmer 1.5s linear infinite" }} />
                <span className="relative z-10">📲 Únete a nuestro grupo de WhatsApp</span>
              </motion.button>
            </a>
            <div className="mt-3 flex items-center justify-center gap-2">
              <p className="text-xs text-muted-foreground">Si no te quieres perder nuestra próxima llegada, entra al grupo</p>
            </div>
          </div>
        </Reveal>

        {/* ═══ 4. FOMO ═══ */}
        <Reveal>
          <div className="glass rounded-2xl p-5 text-center mb-6">
            <p className="text-sm">
              🔥 <strong>{config.communitySize} personas</strong> ya están en el grupo.
            </p>
            <p className="text-xs text-muted-foreground mt-2">Las mejores prendas se van primero.</p>
          </div>
        </Reveal>

        {/* ═══ 5. COUNTDOWN ═══ */}
        <Reveal>
          <div className="glass-strong rounded-2xl p-6 text-center mb-6 relative overflow-hidden ring-1 ring-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.3)] bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900">
            <p className="text-xs text-cyan-300 uppercase tracking-[0.3em] mb-1 animate-pulse">🔥 Próxima llegada</p>
            <p className="text-lg font-bold capitalize">
              {config.nextDrop.dia} {config.nextDrop.fecha.split("-").reverse().slice(0, 2).join("/")}
            </p>
            <p className="text-sm text-muted-foreground mb-4">a las {config.nextDrop.hora}:00</p>
            <Countdown target={dropDate} />
            <p className="text-xs text-muted-foreground mt-3">{config.nextDrop.piezas} piezas · Primero en comentar, primero en llevar</p>
          </div>
        </Reveal>

        {/* ═══ 6. MARQUEE ═══ */}
        <Reveal>
          <div className="overflow-hidden py-3 mb-8 border-y border-border/30 bg-muted/20">
            <div className="flex animate-marquee whitespace-nowrap uppercase tracking-[0.2em] font-medium font-sans">
              {[
                "Nike", "Adidas", "Reebok", "Puma", "Gymshark",
                "Prendas desde $20,000", "Primero en comentar, primero en llevar",
                "Nike", "Adidas", "Reebok", "Puma", "Gymshark",
                "Prendas desde $20,000", "Primero en comentar, primero en llevar",
              ].map((item, i) => (
                <motion.span 
                  key={i} 
                  className="mx-5 text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ═══ 7. CÓMO FUNCIONA ═══ */}
        <Reveal>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-center mb-1">Así funciona</h2>
            <div className="flex flex-col gap-3">
              {[
                { num: "1", icon: "📲", titulo: "Te unes al grupo de WhatsApp", desc: "Es un grupo donde subimos las fotos de las prendas." },
                { num: "2", icon: "👀", titulo: "Ves las fotos", desc: "Cada prenda con fotos reales. La ves bien antes de decidir." },
                { num: "3", icon: "💬", titulo: 'Comentas "LO QUIERO"', desc: "La primera en comentar se la lleva." },
                { num: "4", icon: "💳", titulo: "Pagas y recoges", desc: "Nequi, Bancolombia o efectivo. Recoges en Urabá." },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10px" }}
                  transition={{ delay: i * 0.12, duration: 0.4 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/10"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-sm font-bold shrink-0 shadow-lg">
                    {step.num}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold flex items-center gap-1.5">{step.icon} {step.titulo}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ═══ 8. BLINDAJE ═══ */}
        <Reveal>
          <div className="rounded-xl p-4 mb-8 bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-500/20 text-center">
            <p className="text-sm font-semibold mb-1">👀 Todo se ve antes de comprar</p>
            <p className="text-xs text-muted-foreground">
              Subimos fotos de cada prenda como está. Si cuando la ves en persona no es lo que esperabas, no te la llevás. Acá no hay compras a ciegas.
            </p>
          </div>
        </Reveal>

        {/* ═══ 9. FAQ ═══ */}
        <Reveal>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-center mb-5">Dudas comunes</h2>
            <div className="flex flex-col gap-3">
              {[
                { mito: "¿Y si huele raro?", realidad: "Cada prenda pasa por lavado profesional antes de subir fotos. Llega limpia y lista." },
                { mito: "¿$20,000 por algo usado?", realidad: "Son marcas como Nike y Adidas. Nuevas cuestan 5 veces más. Acá las conseguís en excelente estado a una fracción del precio." },
                { mito: "¿Y si no me gusta en persona?", realidad: "Subimos fotos reales de cada prenda. Si no es lo que esperabas, no te la llevás. Punto." },
              ].map((item, i) => (
                <Mito key={i} mito={item.mito} realidad={item.realidad} index={i} />
              ))}
            </div>
          </div>
        </Reveal>

        {/* ═══ 10. CTA FINAL ═══ */}
        <Reveal>
          <div className="text-center mb-8">
            <a href={config.whatsappGroup} target="_blank" rel="noopener noreferrer" onClick={() => trackCTAClick("final")}>
              <motion.button
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-[length:200%_200%] animate-gradient-x text-white font-bold text-lg relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.6)] border border-green-400/50"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(16,185,129,0.8)" }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)`, backgroundSize: "200% 100%", animation: "shimmer 2s linear infinite" }} />
                <span className="relative z-10">📲 Únete a nuestro grupo de WhatsApp</span>
              </motion.button>
            </a>
            <div className="mt-3">
              <p className="text-xs text-muted-foreground">{config.communitySize} personas ya están en el grupo</p>
            </div>
          </div>
        </Reveal>

        {/* ═══ FOOTER ═══ */}
        <footer className="text-center text-xs text-muted-foreground space-y-1 pb-8">
          <p>📍 Recogida {config.ciudadRecogida} · 🚚 Enviamos a Colombia</p>
          <p>💳 Nequi · Bancolombia · Efectivo</p>
        </footer>
      </motion.div>

      {/* Floating CTA */}
      <AnimatePresence>
        <FloatingCTA whatsappGroup={config.whatsappGroup} dropDia={config.nextDrop.dia} />
      </AnimatePresence>
    </main>
  );
}

// ═══ COUNTDOWN ═══
function Countdown({ target }: { target: Date }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const u = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setT({ d: Math.floor(diff / 864e5), h: Math.floor((diff % 864e5) / 36e5), m: Math.floor((diff % 36e5) / 6e4), s: Math.floor((diff % 6e4) / 1e3) });
    };
    u();
    const i = setInterval(u, 1000);
    return () => clearInterval(i);
  }, [target]);

  return (
    <div className="flex items-center justify-center gap-2">
      {[
        { v: t.d, l: "días", i: "d" },
        { v: t.h, l: "hrs", i: "h" },
        { v: t.m, l: "min", i: "m" },
        { v: t.s, l: "seg", i: "s" },
      ].map((u) => (
        <div key={u.i} className="text-center relative perspective-[1000px]">
          <div className="glass w-14 h-14 rounded-lg flex items-center justify-center text-xl font-bold overflow-hidden relative border border-white/10">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={u.v}
                initial={{ rotateX: 90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: -90, opacity: 0 }}
                transition={{ duration: 0.3, type: "spring" }}
                className="absolute inset-0 flex items-center justify-center text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
              >
                {String(u.v).padStart(2, "0")}
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">{u.l}</p>
        </div>
      ))}
    </div>
  );
}

// ═══ MITO COMPONENT ═══
function Mito({ mito, realidad, index }: { mito: string, realidad: string, index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={`glass rounded-xl overflow-hidden border transition-colors duration-300 ${open ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-900/20 to-teal-900/20' : 'border-white/10'}`}
    >
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{mito}</span>
        </div>
        <motion.span 
          animate={{ rotate: open ? 180 : 0 }} 
          className="text-muted-foreground ml-2 shrink-0 text-xs"
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 text-sm text-foreground/90 border-t border-white/5 mt-2">
              <p className="text-emerald-300">{realidad}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══ FLOATING CTA ═══
function FloatingCTA({ whatsappGroup, dropDia }: { whatsappGroup: string, dropDia: string }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const h = () => setVis(window.scrollY > 400);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!vis) return null;
  return (
    <motion.div className="fixed bottom-4 left-4 right-4 z-50 max-w-lg mx-auto" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}>
      <a href={whatsappGroup} target="_blank" rel="noopener noreferrer" className="block" onClick={() => (window as any).fbq?.('track', 'Lead', { content_name: 'WhatsApp Group Join', placement: 'floating' })}>
        <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-[length:200%_200%] animate-gradient-x text-white font-bold shadow-[0_0_20px_rgba(16,185,129,0.6)] relative overflow-hidden border border-green-400/50">
          <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)`, backgroundSize: "200% 100%", animation: "shimmer 2s linear infinite" }} />
          <span className="relative z-10">📲 Únete al grupo de WhatsApp</span>
        </button>
      </a>
    </motion.div>
  );
}

// ═══ REVEAL ═══
function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}>
      {children}
    </motion.div>
  );
}
