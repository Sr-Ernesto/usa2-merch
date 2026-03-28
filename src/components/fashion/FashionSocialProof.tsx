"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Fashion Social Proof — Adaptado para ropa
// "María se llevó el vestido azul hace 12 min"
// + Contador de stock por talla

interface SaleEvent {
  nombre: string;
  ciudad: string;
  prenda: string;
  tiempo: string;
}

interface StockInfo {
  talla: string;
  disponibles: number;
}

interface FashionSocialProofProps {
  ventas?: SaleEvent[];
  stock?: StockInfo[];
}

const defaultVentas: SaleEvent[] = [
  { nombre: "María", ciudad: "Medellín", prenda: "el vestido azul", tiempo: "hace 12 min" },
  { nombre: "Laura", ciudad: "Bogotá", prenda: "la chaqueta denim", tiempo: "hace 25 min" },
  { nombre: "Valentina", ciudad: "Cali", prenda: "los jeans mom", tiempo: "hace 1 hora" },
  { nombre: "Daniela", ciudad: "Barranquilla", prenda: "la blusa floral", tiempo: "hace 2 horas" },
  { nombre: "Camila", ciudad: "Bucaramanga", prenda: "el crop top", tiempo: "hace 3 horas" },
];

const defaultStock: StockInfo[] = [
  { talla: "XS", disponibles: 2 },
  { talla: "S", disponibles: 4 },
  { talla: "M", disponibles: 3 },
  { talla: "L", disponibles: 1 },
  { talla: "XL", disponibles: 2 },
];

export function FashionSocialProof({
  ventas = defaultVentas,
  stock = defaultStock,
}: FashionSocialProofProps) {
  const [currentVenta, setCurrentVenta] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVenta((prev) => (prev + 1) % ventas.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ventas.length]);

  return (
    <div className="space-y-4 mb-6">
      {/* Última venta */}
      <motion.div
        className="glass rounded-xl p-3 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
          {ventas[currentVenta].nombre.charAt(0)}
        </div>
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentVenta}
              className="text-sm truncate"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <strong>{ventas[currentVenta].nombre}</strong> de{" "}
              {ventas[currentVenta].ciudad} se llevó{" "}
              {ventas[currentVenta].prenda}
            </motion.p>
          </AnimatePresence>
          <p className="text-[10px] text-muted-foreground">
            {ventas[currentVenta].tiempo}
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
        </div>
      </motion.div>

      {/* Stock por talla — SCARCITY REAL */}
      <div className="glass rounded-xl p-4">
        <p className="text-xs text-muted-foreground mb-3 text-center">
          📦 Stock disponible por talla
        </p>
        <div className="flex justify-center gap-3">
          {stock.map((s) => (
            <div key={s.talla} className="text-center">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold mb-1 ${
                  s.disponibles <= 1
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : s.disponibles <= 3
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "glass"
                }`}
              >
                {s.talla}
              </div>
              <p
                className={`text-[10px] ${
                  s.disponibles <= 1
                    ? "text-red-400 font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {s.disponibles <= 1
                  ? "¡Última!"
                  : `${s.disponibles} disp.`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
