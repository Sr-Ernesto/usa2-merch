"use client";

import { motion, AnimatePresence } from "framer-motion";

// Fashion Detail Popup — Bottom sheet que mata objeciones ANTES de WhatsApp
// Muestra: medidas, estado, envío, devolución. Todo en un vistazo.

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

interface FashionDetailPopupProps {
  prenda: Prenda | null;
  onClose: () => void;
  whatsappNumber: string;
  ciudadRecogida?: string;
}

const estadoInfo: Record<string, { label: string; color: string; icon: string; desc: string }> = {
  "nuevo-etiqueta": {
    label: "Nuevo con etiqueta",
    color: "text-green-400",
    icon: "🏷️",
    desc: "Sin uso, etiqueta puesta. Como de tienda.",
  },
  "como-nuevo": {
    label: "Como nuevo",
    color: "text-blue-400",
    icon: "✨",
    desc: "Usado 1-2 veces. Sin desgaste, sin manchas.",
  },
  "buen-estado": {
    label: "Buen estado",
    color: "text-yellow-400",
    icon: "👍",
    desc: "Usado con normalidad. Puede tener uso leve.",
  },
};

export function FashionDetailPopup({
  prenda,
  onClose,
  whatsappNumber,
  ciudadRecogida,
}: FashionDetailPopupProps) {
  if (!prenda) return null;

  const info = estadoInfo[prenda.estado];
  const descuento = prenda.precioOriginal
    ? Math.round(((prenda.precioOriginal - prenda.precio) / prenda.precioOriginal) * 100)
    : 0;

  const openWhatsApp = () => {
    const msg = `Hola! Vi "${prenda.nombre}"${prenda.marca ? ` de ${prenda.marca}` : ""} en talla ${prenda.talla} a $${prenda.precio.toLocaleString()}. ¿Sigue disponible?`;
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.capture("fashion_whatsapp_click", {
        item: prenda.nombre,
        price: prenda.precio,
        source: "detail_popup",
      });
    }
  };

  return (
    <AnimatePresence>
      {prenda && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[9999] bg-background rounded-t-2xl max-h-[85vh] overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="p-5 max-w-lg mx-auto">
              {/* Handle */}
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

              {/* Imagen */}
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-5">
                <img
                  src={prenda.imagen}
                  alt={prenda.nombre}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Nombre + Marca */}
              {prenda.marca && (
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-0.5">
                  {prenda.marca}
                </p>
              )}
              <h3 className="text-xl font-bold mb-1">{prenda.nombre}</h3>

              {/* Precio */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl font-bold text-accent">
                  ${prenda.precio.toLocaleString()}
                </span>
                {prenda.precioOriginal && (
                  <>
                    <span className="text-sm text-muted-foreground line-through">
                      ${prenda.precioOriginal.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-bold">
                      -{descuento}%
                    </span>
                  </>
                )}
              </div>

              {/* 📏 MEDIDAS — mata la objeción #1 */}
              {prenda.medidas && (
                <div className="glass rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">📏</span>
                    <p className="text-sm font-medium">Medidas exactas</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(prenda.medidas).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                  {prenda.equivalencia && (
                    <p className="text-xs text-accent mt-3 pt-3 border-t border-border/50">
                      Equivale: {prenda.equivalencia}
                    </p>
                  )}
                </div>
              )}

              {/* 🧼 ESTADO — mata la objeción #2 */}
              <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{info.icon}</span>
                  <p className={`text-sm font-medium ${info.color}`}>{info.label}</p>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{info.desc}</p>
                {prenda.descripcionEstado && (
                  <p className="text-xs text-muted-foreground italic">
                    "{prenda.descripcionEstado}"
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-green-400 text-xs">✓</span>
                  <span className="text-xs text-muted-foreground">
                    Lavado y desinfectado profesionalmente
                  </span>
                </div>
              </div>

              {/* 🚚 ENVÍO */}
              <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🚚</span>
                  <p className="text-sm font-medium">Envío</p>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {ciudadRecogida && (
                    <p>📍 <strong className="text-accent">Recogida gratis</strong> en {ciudadRecogida}</p>
                  )}
                  <p>📦 Servientrega a toda Colombia: desde $8,000</p>
                  <p>🎁 Envío gratis en compras +$50,000</p>
                </div>
              </div>

              {/* 🔄 GARANTÍA REALISTA */}
              <div className="glass rounded-xl p-4 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🛡️</span>
                  <p className="text-sm font-medium">Nuestra garantía</p>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p>✅ Si llega dañada o diferente a las fotos → cambio inmediato</p>
                  <p>✅ Medidas exactas para que no te quede duda de talla</p>
                  <p>✅ Si no te queda → cambiamos por otra del mismo valor</p>
                  <p>📍 Recogida gratis en Urabá, Antioquia</p>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={openWhatsApp}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)`,
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s linear infinite",
                  }}
                />
                <span className="relative z-10">💬 Preguntar por WhatsApp</span>
              </button>

              <p className="text-center text-[10px] text-muted-foreground mt-3 mb-4">
                Respuesta en menos de 30 minutos
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
