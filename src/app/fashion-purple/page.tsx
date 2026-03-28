"use client";

import { MotionFashion } from "@/components/fashion/variants/MotionFashion";
import { useEffect } from "react";

const prendas = [
  { id: "1", imagen: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop", nombre: "Vestido azul midi", precio: 35000, precioOriginal: 120000, talla: "M", estado: "como-nuevo" as const, disponible: true },
  { id: "2", imagen: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop", nombre: "Chaqueta denim oversize", precio: 45000, precioOriginal: 180000, talla: "S", estado: "buen-estado" as const, disponible: true },
  { id: "3", imagen: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop", nombre: "Jeans mom high waist", precio: 28000, precioOriginal: 95000, talla: "M", estado: "como-nuevo" as const, disponible: true },
  { id: "4", imagen: "https://images.unsplash.com/photo-1485968579169-a6b3e555ed44?w=600&h=800&fit=crop", nombre: "Blusa floral verano", precio: 18000, precioOriginal: 65000, talla: "S", estado: "nuevo-etiqueta" as const, disponible: true },
  { id: "5", imagen: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop", nombre: "Crop top negro básico", precio: 15000, precioOriginal: 45000, talla: "XS", estado: "como-nuevo" as const, disponible: true },
  { id: "6", imagen: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop", nombre: "Falda plisada beige", precio: 22000, precioOriginal: 78000, talla: "L", estado: "buen-estado" as const, disponible: false },
  { id: "7", imagen: "https://images.unsplash.com/photo-1434389677669-e08b4cda3a53?w=600&h=800&fit=crop", nombre: "Camisa lino blanca", precio: 25000, precioOriginal: 85000, talla: "M", estado: "nuevo-etiqueta" as const, disponible: true },
  { id: "8", imagen: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop", nombre: "Blazer negro estructurado", precio: 55000, precioOriginal: 220000, talla: "S", estado: "como-nuevo" as const, disponible: true },
];

export default function FashionPurple() {
  useEffect(() => {
    document.documentElement.style.setProperty("--background", "270 20% 5%");
    document.documentElement.style.setProperty("--foreground", "280 15% 95%");
    document.documentElement.style.setProperty("--primary", "270 85% 60%");
    document.documentElement.style.setProperty("--primary-foreground", "0 0% 100%");
    document.documentElement.style.setProperty("--accent", "50 90% 60%");
    document.documentElement.style.setProperty("--muted", "270 15% 12%");
    document.documentElement.style.setProperty("--muted-foreground", "270 10% 55%");
    document.documentElement.style.setProperty("--border", "270 15% 16%");
    document.documentElement.style.setProperty("--ring", "270 85% 60%");
  }, []);

  return <MotionFashion brandName="Usa2 Merch" tagline="Moda circular que se siente bien por fuera y por dentro" whatsappNumber="573152860174" prendas={prendas} />;
}
