"use client";

import { DarkLuxury } from "@/components/fashion/variants/DarkLuxury";

/**
 * 🖤 Ejemplo: Dark Luxury — Segunda mano de lujo
 *
 * Concepto completamente diferente al /fashion (Reusa Co.)
 * Este es: oscuro, editorial, cinemático, exclusivo.
 * Parece Vestiaire Collective, no parece tienda de segunda.
 */

const luxuryItems = [
  {
    id: "1",
    imagen: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop",
    marca: "Balenciaga",
    nombre: "Triple S Sneaker",
    precio: 289000,
    precioRetail: 1200000,
    descuento: 76,
    talla: "42",
    condicion: "excellent" as const,
  },
  {
    id: "2",
    imagen: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=1000&fit=crop",
    marca: "Gucci",
    nombre: "Bamboo 1947 Mini Bag",
    precio: 4500000,
    precioRetail: 12500000,
    descuento: 64,
    talla: "Única",
    condicion: "pristine" as const,
  },
  {
    id: "3",
    imagen: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop",
    marca: "Prada",
    nombre: "Re-Nylon Hooded Jacket",
    precio: 890000,
    precioRetail: 3200000,
    descuento: 72,
    talla: "M",
    condicion: "very-good" as const,
  },
  {
    id: "4",
    imagen: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=1000&fit=crop",
    marca: "Dior",
    nombre: "Saddle Bag Oblique",
    precio: 5200000,
    precioRetail: 14000000,
    descuento: 63,
    talla: "Única",
    condicion: "excellent" as const,
  },
  {
    id: "5",
    imagen: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=1000&fit=crop",
    marca: "Louis Vuitton",
    nombre: "Neverfull MM Monogram",
    precio: 3800000,
    precioRetail: 8500000,
    descuento: 55,
    talla: "Única",
    condicion: "very-good" as const,
  },
  {
    id: "6",
    imagen: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop",
    marca: "Off-White",
    nombre: "Industrial Belt Hoodie",
    precio: 420000,
    precioRetail: 1800000,
    descuento: 77,
    talla: "L",
    condicion: "pristine" as const,
  },
  {
    id: "7",
    imagen: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop",
    marca: "Chanel",
    nombre: "Classic Flap Medium",
    precio: 18500000,
    precioRetail: 42000000,
    descuento: 56,
    talla: "Única",
    condicion: "pristine" as const,
  },
  {
    id: "8",
    imagen: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&h=1000&fit=crop",
    marca: "Hermès",
    nombre: "Oran Sandal Gold",
    precio: 1200000,
    precioRetail: 3800000,
    descuento: 68,
    talla: "38",
    condicion: "excellent" as const,
  },
];

export default function FashionLuxuryDemo() {
  return (
    <DarkLuxury
      brandName="Vault."
      tagline="Piezas icónicas con historia. Precios que no se repiten."
      whatsappNumber="573152860174"
      heroImage="/prendas/gucci-bamboo.jpg"
      items={luxuryItems}
    />
  );
}
