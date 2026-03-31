"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * 👗 Usa2 Merch — Bridge Page v2
 *
 * ÚNICO objetivo: captar gente para el grupo de WhatsApp.
 * La venta ocurre EN EL GRUPO durante drops jueves y domingo.
 * 
 * v2: Reescritura completa con auditoría Copy-Beast Latam + Marketero.
 * Gatillos: Desconfianza, FOMO, Identidad/Pertenencia.
 */

export default function FashionSimple() {
  const [config, setConfig] = useState({
    brandName: "Usa2 Merch",
    tagline: "Ropa de marca USA · Usada como nueva · Urabá, Antioquia",
    whatsappGroup: "https://chat.whatsapp.com/FQ8LpYS8vGaLeRibdwlTUX?mode=gi_t",
    ciudadRecogida: "Urabá, Antioquia",
    nextDrop: { fecha: "2026-04-02", dia: "jueves", hora: 16, piezas: 25 },
    pastDrop: { piezas: 6, agotadoEn: "2 horas" },
    communitySize: 847,
    preview: [
      { imagen: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop", marca: "Nike", nombre: "Leggings Dri-FIT", precio: 35000, color: "Negro" },
      { imagen: "https://images.unsplash.com/photo-1549439602-43ebca2327af?w=600&h=800&fit=crop", marca: "Lululemon", nombre: "Top deportivo Align", precio: 35000, color: "Rosa" },
      { imagen: "https://images.unsplash.com/photo-1550995694-3f5f4a7e1bd2?w=600&h=800&fit=crop", marca: "Gymshark", nombre: "Sports bra Flex", precio: 35000, color: "Azul marino" },
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

        {/* ═══ 1. HERO — Brand + Subheadline ═══ */}
        <Reveal>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-1">{config.brandName}</h1>
            <p className="text-muted-foreground text-sm">{config.tagline}</p>
            <p className="text-xs text-muted-foreground mt-2">Llega lavada y lista. Medidas exactas por prenda.</p>
          </div>
        </Reveal>

        {/* ═══ 2. PROBLEMA + AGITACIÓN ═══ */}
        <Reveal>
          <div className="rounded-xl p-4 mb-6 bg-gradient-to-r from-red-950/40 to-orange-950/30 border border-red-500/20 text-center">
            <p className="text-sm">
              ¿$200,000 por unas leggings de Lululemon? Honestamente, no tiene sentido cuando las conseguís usadas como nuevas a <strong>$35,000 COP</strong>. Misma marca. Mismo corte.
            </p>
          </div>
        </Reveal>

        {/* ═══ 3. FOMO + SOCIAL PROOF ═══ */}
        <Reveal>
          <div className="glass rounded-2xl p-5 text-center mb-6">
            <p className="text-sm">
              🔥 <strong>{config.communitySize} chicas</strong> ya están en el grupo. Último drop: <strong>{config.pastDrop.piezas} piezas</strong> se agotaron en <strong className="text-accent">{config.pastDrop.agotadoEn}</strong>.
            </p>
            <p className="text-xs text-muted-foreground mt-2">Si no estás adentro, te enteras cuando ya se fueron.</p>
          </div>
        </Reveal>

        {/* ═══ 4. COUNTDOWN ═══ */}
        <Reveal>
          <div className="glass-strong rounded-2xl p-6 text-center mb-6 relative overflow-hidden ring-1 ring-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.3)] bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900">
            <p className="text-xs text-cyan-300 uppercase tracking-[0.3em] mb-1 animate-pulse">🔥 Próximo drop</p>
            <p className="text-lg font-bold capitalize">
              {config.nextDrop.dia} {config.nextDrop.fecha.split("-").reverse().slice(0, 2).join("/")}
            </p>
            <p className="text-sm text-muted-foreground mb-4">a las {config.nextDrop.hora}:00</p>
            <Countdown target={dropDate} />
            <p className="text-xs text-muted-foreground mt-3">{config.nextDrop.piezas} piezas · Primero en comentar, primero en llevar</p>
          </div>
        </Reveal>

        {/* ═══ 5. CTA PRINCIPAL ═══ */}
        <Reveal>
          <div className="text-center mb-6">
            <a href={config.whatsappGroup} target="_blank" rel="noopener noreferrer">
              <motion.button
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_200%] animate-gradient-x text-white font-bold text-lg relative overflow-hidden shadow-[0_0_20px_rgba(236,72,153,0.6)] border border-pink-400/50 before:absolute before:inset-0 before:p-[2px] before:rounded-xl before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:animate-[spin_3s_linear_infinite]"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(236,72,153,0.8)" }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute inset-0 opacity-50" style={{ background: `linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.6) 50%, transparent 80%)`, backgroundSize: "200% 100%", animation: "shimmer 1.5s linear infinite" }} />
                <span className="relative z-10">📲 Entra gratis al grupo · Mira sin compromiso · Si no te gusta, te sales y ya</span>
              </motion.button>
            </a>
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full border border-black bg-gradient-to-br from-indigo-400 to-cyan-400" />
                <div className="w-6 h-6 rounded-full border border-black bg-gradient-to-br from-fuchsia-400 to-pink-400" />
                <div className="w-6 h-6 rounded-full border border-black bg-gradient-to-br from-amber-400 to-orange-400" />
              </div>
              <p className="text-xs font-medium">{config.communitySize}+ personas · Gratis · Sales cuando quieras</p>
            </div>
          </div>
        </Reveal>

        {/* ═══ 6. MARQUEE — Solo frases de deseo ═══ */}
        <Reveal>
          <div className="overflow-hidden py-3 mb-8 border-y border-border/30 bg-muted/20">
            <div className="flex animate-marquee whitespace-nowrap uppercase tracking-[0.2em] font-medium font-sans">
              {[
                "Nike desde $35,000", "Lululemon desde $35,000", "Gymshark", "Alo Yoga",
                "Primero en comentar, primero en llevar", `Drops ${config.nextDrop.dia}s y domingos`,
                "Nike desde $35,000", "Lululemon desde $35,000", "Gymshark", "Alo Yoga",
                "Primero en comentar, primero en llevar", `Drops ${config.nextDrop.dia}s y domingos`,
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
            <h2 className="text-xl font-bold text-center mb-1">Así de fácil</h2>
            <p className="text-xs text-muted-foreground text-center mb-5">No compras aquí. Solo ves. La compra es en el grupo.</p>
            <div className="flex flex-col gap-3">
              {[
                { num: "1", icon: "📲", titulo: "Entras al grupo", desc: "Gratis. Sin compromiso. Si no te gusta, te sales cuando quieras." },
                { num: "2", icon: "👀", titulo: "Ves las fotos del drop", desc: `Prendas de USA con medidas exactas, precio en COP y fotos de cada detalle. Nada se esconde.` },
                { num: "3", icon: "💬", titulo: 'Comentas "LO QUIERO"', desc: "La primera en comentar se la lleva. Sin regateo, sin apartar." },
                { num: "4", icon: "💳", titulo: "Pagas fácil", desc: "Nequi, Bancolombia o efectivo. Recoges en Urabá." },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10px" }}
                  transition={{ delay: i * 0.12, duration: 0.4 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/10"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-sm font-bold shrink-0 shadow-lg">
                    {step.num}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold flex items-center gap-1.5">{step.icon} {step.titulo}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3 italic">¿No te gustó nada? No pasa nada. Seguís en el grupo para el próximo drop.</p>
          </div>
        </Reveal>

        {/* ═══ 8. CATÁLOGO PREVIEW (3 prendas, sin precio exacto) ═══ */}
        <Reveal>
          <div className="mb-8">
            <div className="mb-4">
              <p className="text-xs text-accent uppercase tracking-[0.3em]">👀 Un vistazo</p>
              <h2 className="text-xl font-bold">Lo que entra este {config.nextDrop.dia}</h2>
              <p className="text-xs text-muted-foreground mt-1">Las del grupo ya lo están viendo. ¿Y tú?</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {config.preview.slice(0, 3).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ delay: i * 0.15, duration: 0.5, type: "spring" }}
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-1">
                    <motion.img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-full h-full object-cover"
                      loading="lazy"
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
            <p className="text-xs text-muted-foreground text-center mt-3">Hay 15+ más en el grupo. Solo se ven ahí.</p>
          </div>
        </Reveal>

        {/* ═══ 9. GARANTÍA SIN RIESGO ═══ */}
        <Reveal>
          <div className="rounded-xl p-4 mb-8 bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-500/20 text-center">
            <p className="text-sm font-semibold mb-1">✅ Sin riesgo</p>
            <p className="text-xs text-muted-foreground">
              Toda prenda llega lavada. Si no te queda la talla, la cambias. Si no te gusta, no te la llevas. Así de simple. No hay letra pequeña.
            </p>
          </div>
        </Reveal>

        {/* ═══ 10. FAQ — 3 Mitos ═══ */}
        <Reveal>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-center mb-5">Dudas comunes</h2>
            <div className="flex flex-col gap-3">
              {[
                { mito: "¿Y si huele raro?", realidad: "Cada prenda pasa por lavado profesional antes de subir fotos. Llega lista para usar. Si no te convence, no te la llevás." },
                { mito: "$35,000 por algo usado?", realidad: "Esa misma Lululemon nueva cuesta $120 USD ($500,000 COP). Acá la conseguís a $35,000 con etiqueta visible. Menos que un almuerzo para dos." },
                { mito: "¿Y si no me queda?", realidad: "Subimos medidas exactas de cada prenda. Medís antes de decidir. Y si no queda, cambiamos. Sin drama." },
              ].map((item, i) => (
                <Mito key={i} mito={item.mito} realidad={item.realidad} index={i} />
              ))}
            </div>
          </div>
        </Reveal>

        {/* ═══ 11. CTA FINAL ═══ */}
        <Reveal>
          <div className="text-center mb-8">
            <a href={config.whatsappGroup} target="_blank" rel="noopener noreferrer">
              <motion.button
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_200%] animate-gradient-x text-white font-bold text-lg relative overflow-hidden shadow-[0_0_20px_rgba(236,72,153,0.6)] border border-pink-400/50 before:absolute before:inset-0 before:p-[2px] before:rounded-xl before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:animate-[spin_3s_linear_infinite]"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(236,72,153,0.8)" }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)`, backgroundSize: "200% 100%", animation: "shimmer 2s linear infinite" }} />
                <span className="relative z-10">📲 El próximo drop es este {config.nextDrop.dia} — entra ahora, mira gratis</span>
              </motion.button>
            </a>
            <div className="mt-3 flex items-center justify-center gap-2">
              <p className="text-xs text-muted-foreground">{config.communitySize} personas ya están adentro · Gratis · Sin letra pequeña</p>
            </div>
          </div>
        </Reveal>

        {/* ═══ 12. FOOTER ═══ */}
        <footer className="text-center text-xs text-muted-foreground space-y-1 pb-8">
          <p>📍 Recogida gratis {config.ciudadRecogida} · 🚚 Enviamos a Colombia</p>
          <p>💳 Nequi · Bancolombia · Efecty · PSE</p>
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
      <a href={whatsappGroup} target="_blank" rel="noopener noreferrer" className="block">
        <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_200%] animate-gradient-x text-white font-bold shadow-[0_0_20px_rgba(236,72,153,0.6)] relative overflow-hidden border border-pink-400/50">
          <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)`, backgroundSize: "200% 100%", animation: "shimmer 2s linear infinite" }} />
          <span className="relative z-10">📲 Entra gratis — el {dropDia} hay drop</span>
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
