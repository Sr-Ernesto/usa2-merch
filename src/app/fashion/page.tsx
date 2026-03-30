"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * 👗 Usa2 Merch — Bridge Page Simple
 *
 * ÚNICO objetivo: captar gente para el grupo de WhatsApp.
 * La venta ocurre EN EL GRUPO durante drops jueves y domingo.
 */

export default function FashionSimple() {
  const [config, setConfig] = useState({
    brandName: "Usa2 Merch",
    tagline: "Ropa de marca USA · Usada como nueva · Urabá, Antioquia 🇺🇸",
    whatsappGroup: "https://chat.whatsapp.com/TU_GRUPO_AQUI",
    ciudadRecogida: "Urabá, Antioquia",
    nextDrop: { fecha: "2026-03-27", dia: "jueves", hora: 12, piezas: 8 },
    pastDrop: { piezas: 6, agotadoEn: "2 horas" },
    communitySize: 847,
    preview: [
      { imagen: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop", marca: "Nike", nombre: "Leggings Dri-FIT", precio: 35000, color: "Negro" },
      { imagen: "https://images.unsplash.com/photo-1549439602-43ebca2327af?w=600&h=800&fit=crop", marca: "Lululemon", nombre: "Top deportivo Align", precio: 42000, color: "Rosa" },
      { imagen: "https://images.unsplash.com/photo-1550995694-3f5f4a7e1bd2?w=600&h=800&fit=crop", marca: "Gymshark", nombre: "Sports bra Flex", precio: 28000, color: "Azul marino" },
      { imagen: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=800&fit=crop", marca: "Alo Yoga", nombre: "Conjunto deportivo", precio: 55000, color: "Gris heather" },
      { imagen: "https://images.unsplash.com/photo-1608228068945-8133529b5ac1?w=600&h=800&fit=crop", marca: "Athleta", nombre: "Camiseta Seamless", precio: 32000, color: "Blanco" },
      { imagen: "https://images.unsplash.com/photo-1609102026400-3c4069728074?w=600&h=800&fit=crop", marca: "Fabletics", nombre: "Shorts Powerhold", precio: 30000, color: "Verde militar" },
      { imagen: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&h=800&fit=crop", marca: "Nike", nombre: "Pro Top", precio: 38000, color: "Violeta" },
      { imagen: "https://images.unsplash.com/photo-1541334057884-239618ec9e59?w=600&h=800&fit=crop", marca: "Lululemon", nombre: "Leggings Wunder Train", precio: 45000, color: "Borgoña" },
    ],
  });

  useEffect(() => {
    fetch("/data/drop.json")
      .then((r) => r.json())
      .then((data) => {
         // Merge data to preserve the default sports photos if preview is empty in json
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
        {/* ═══ BRAND ═══ */}
        <Reveal>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-1">{config.brandName}</h1>
            <p className="text-muted-foreground text-sm">{config.tagline}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-white mt-3 bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
              ♻️ Moda circular · Ropa de marca importada · Como nueva
            </div>
          </div>
        </Reveal>

        {/* ═══ COUNTDOWN ═══ */}
        <Reveal>
          <div className="glass-strong rounded-2xl p-6 text-center mb-6 relative overflow-hidden ring-1 ring-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.3)] bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900">
            <p className="text-xs text-cyan-300 uppercase tracking-[0.3em] mb-1 animate-pulse">🔥 Próximo drop</p>
            <p className="text-lg font-bold capitalize">
              {config.nextDrop.dia} {config.nextDrop.fecha.split("-").reverse().slice(0, 2).join("/")}
            </p>
            <p className="text-sm text-muted-foreground mb-4">a las {config.nextDrop.hora}:00</p>
            <Countdown target={dropDate} />
            <p className="text-xs text-muted-foreground mt-3">{config.nextDrop.piezas} piezas · Primero en preguntar, primero en llevar</p>
          </div>
        </Reveal>

        {/* ═══ CTA PRINCIPAL ═══ */}
        <Reveal>
          <div className="text-center mb-8">
            <a href={config.whatsappGroup} target="_blank" rel="noopener noreferrer">
              <motion.button
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_200%] animate-gradient-x text-white font-bold text-lg relative overflow-hidden shadow-[0_0_20px_rgba(236,72,153,0.6)] border border-pink-400/50 before:absolute before:inset-0 before:p-[2px] before:rounded-xl before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:animate-[spin_3s_linear_infinite]"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(236,72,153,0.8)" }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute inset-0 opacity-50" style={{ background: `linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.6) 50%, transparent 80%)`, backgroundSize: "200% 100%", animation: "shimmer 1.5s linear infinite" }} />
                <span className="relative z-10">Asegurar mi cupo al Drop</span>
              </motion.button>
            </a>
            <div className="mt-4 flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border border-black bg-gradient-to-br from-indigo-400 to-cyan-400" />
                  <div className="w-6 h-6 rounded-full border border-black bg-gradient-to-br from-fuchsia-400 to-pink-400" />
                  <div className="w-6 h-6 rounded-full border border-black bg-gradient-to-br from-amber-400 to-orange-400" />
                </div>
                <p className="text-xs font-medium">👥 847+ personas en la comunidad</p>
              </div>
              <p className="text-xs text-muted-foreground italic rotate-words">María de Medellín se llevó el vestido azul</p>
            </div>
          </div>
        </Reveal>

        {/* ═══ MARQUEE ═══ */}
        <Reveal>
          <div className="overflow-hidden py-3 mb-8 border-y border-border/30 bg-muted/20">
            <div className="flex animate-marquee whitespace-nowrap uppercase tracking-[0.2em] font-medium font-sans">
              {[
                "🇺🇸 Ropa importada de USA", "🧼 Lavadito y listo ✓", "📍 Recogida gratis Urabá", "💳 Nequi + Bancolombia",
                "📏 Medidas exactas", "🌿 Moda sostenible", `🔥 Drops ${config.nextDrop.dia}s`,
                "🇺🇸 Ropa importada de USA", "🧼 Lavadito y listo ✓", "📍 Recogida gratis Urabá", "💳 Nequi + Bancolombia",
                "📏 Medidas exactas", "🌿 Moda sostenible", `🔥 Drops ${config.nextDrop.dia}s`,
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

        {/* ═══ PREVIEW ═══ */}
        <Reveal>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-accent uppercase tracking-[0.3em]">Preview</p>
                <h2 className="text-xl font-bold">Lo que viene este {config.nextDrop.dia}</h2>
              </div>
              <span className="text-xs text-muted-foreground">{config.preview.length} piezas</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {config.preview.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ delay: i * 0.15, duration: 0.5, type: "spring" }}
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2">
                    <motion.img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-white/80 text-black shadow-sm">
                        🇺🇸 Made in USA
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-md border border-white/10 shadow-sm">
                        🇺🇸 De USA
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/60 text-white backdrop-blur-md border border-white/10 shadow-sm">
                        <span className="text-xs font-bold">${item.precio.toLocaleString()} COP</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-0.5">
                    {item.marca && <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">{item.marca}</p>}
                    <p className="text-sm font-medium truncate">{item.nombre}</p>
                    {item.color && (
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full border border-black/20 dark:border-white/20" style={{ backgroundColor: item.color === 'Negro' ? '#000' : item.color === 'Blanco' ? '#fff' : item.color === 'Rosa' ? '#ffc0cb' : item.color === 'Azul marino' ? '#000080' : item.color === 'Gris heather' ? '#808080' : item.color === 'Verde militar' ? '#4b5320' : item.color === 'Violeta' ? '#ee82ee' : item.color === 'Borgoña' ? '#800020' : 'gray' }} />
                        {item.color}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ═══ FOMO ═══ */}
        <Reveal>
          <div className="glass rounded-2xl p-5 text-center mb-8">
            <p className="text-sm">
              📦 Último drop: <strong>{config.pastDrop.piezas} piezas</strong> se agotaron en{" "}
              <strong className="text-accent">{config.pastDrop.agotadoEn}</strong>
            </p>
            <p className="text-xs text-muted-foreground mt-1">No te quedes fuera del próximo 🔥</p>
          </div>
        </Reveal>

        {/* ═══ CÓMO FUNCIONA ═══ */}
        <Reveal>
          <div className="mb-8 overflow-hidden">
            <h2 className="text-xl font-bold text-center mb-5">¿Cómo funciona?</h2>
            <div className="flex flex-col gap-4">
              {[
                { icon: "👥", text: "Te unes al grupo (gratis)" },
                { icon: "📦", text: `Cada ${config.nextDrop.dia} hay drop a las ${config.nextDrop.hora}:00` },
                { icon: "💬", text: "Preguntas por la que te gustó — primero en llegar" },
                { icon: "💳", text: "Pagas por Nequi y te la enviamos" },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10px" }}
                  transition={{ delay: i * 0.15, duration: 0.4 }}
                  className="glass rounded-xl p-5 flex items-center gap-5 w-full bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/20"
                >
                  <span className="text-3xl shrink-0">{step.icon}</span>
                  <p className="text-sm font-medium text-left">{step.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mb-8 overflow-hidden">
            <h2 className="text-xl font-bold text-center mb-5">Mitos de la ropa usada</h2>
            <div className="flex flex-col gap-3">
              {[
                { mito: "La ropa usada es sucia", realidad: "Cada prenda pasa por lavado profesional y desinfección. Te llega más limpia que nueva. 🧼" },
                { mito: "No me va a quedar la talla", realidad: "Te damos medidas exactas en centímetros + equivalencia por marca. Si no te queda, la cambiamos. 📏" },
                { mito: "¿Y si tiene defectos?", realidad: "Fotografiamos cada detalle. Si llega algo diferente a lo que mostramos, cambio inmediato. 📸" },
                { mito: "Es ropa vieja y fea", realidad: "Marcas de USA como Nike, Lululemon, Gymshark. Muchas con etiqueta puesta. Ropa que allá se tira después de usar 2 veces. 🇺🇸" },
                { mito: "Es muy caro para ser usado", realidad: "Un legging Lululemon cuesta $120 USD nuevo. Aquí te cuesta $35,000 COP. Mismo producto, fracción del precio. 💰" },
              ].map((item, i) => (
                <Mito key={i} mito={item.mito} realidad={item.realidad} index={i} />
              ))}
            </div>
          </div>
        </Reveal>

        {/* ═══ CTA FINAL ═══ */}
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
                <span className="relative z-10">Quiero acceso VIP</span>
              </motion.button>
            </a>
            <div className="mt-4 flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border border-black bg-gradient-to-br from-indigo-400 to-cyan-400" />
                  <div className="w-6 h-6 rounded-full border border-black bg-gradient-to-br from-fuchsia-400 to-pink-400" />
                  <div className="w-6 h-6 rounded-full border border-black bg-gradient-to-br from-amber-400 to-orange-400" />
                </div>
                <p className="text-xs font-medium">👥 {config.communitySize}+ personas en la comunidad</p>
              </div>
              <p className="text-xs text-muted-foreground italic rotate-words">María de Medellín se llevó una prenda hace 5 min</p>
            </div>
          </div>
        </Reveal>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground space-y-1 pb-8">
          <p>📍 Recogida gratis {config.ciudadRecogida} · 🚚 Envío a Colombia</p>
          <p>💳 Nequi · Bancolombia · Efecty · PSE</p>
        </footer>
      </motion.div>

      {/* Floating CTA */}
      <AnimatePresence>
        <FloatingCTA whatsappGroup={config.whatsappGroup} />
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
      className={`glass rounded-xl overflow-hidden border transition-colors duration-300 ${open ? 'border-pink-500/50 bg-gradient-to-r from-pink-900/20 to-purple-900/20' : 'border-white/10'}`}
    >
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl shrink-0">❌</span>
          <span className={`text-sm font-medium transition-colors ${open ? 'text-pink-300' : 'text-foreground'}`}>"{mito}"</span>
        </div>
        <motion.span 
          animate={{ rotate: open ? 180 : 0 }} 
          className="text-muted-foreground ml-2 shrink-0"
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
            <div className="p-4 pt-0 text-sm text-foreground/90 border-t border-white/5 flex items-start gap-3 mt-2">
              <span className="text-xl shrink-0">✅</span>
              <p>{realidad}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══ FLOATING CTA ═══
function FloatingCTA({ whatsappGroup }: { whatsappGroup: string }) {
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
          <span className="relative z-10">Asegurar mi cupo al Drop</span>
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
