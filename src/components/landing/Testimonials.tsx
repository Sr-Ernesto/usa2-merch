"use client";

import { motion } from "framer-motion";

// Testimonials con marquee — Page UI + Magic UI híbrido

interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar?: string;
  rating?: number;
}

const defaultTestimonials: Testimonial[] = [
  {
    name: "María G.",
    role: "Mamá de 2, CDMX",
    text: "Al principio dudé, pero después de usarlo 2 semanas, no entiendo cómo vivía sin esto. Increíble.",
    rating: 5,
  },
  {
    name: "Carlos R.",
    role: "Emprendedor, Bogotá",
    text: "Me ahorró horas de trabajo. Honestamente, pensé que era otro producto más del montón. Estaba equivocado.",
    rating: 5,
  },
  {
    name: "Ana P.",
    role: "Diseñadora, Buenos Aires",
    text: "La calidad es insuperable. Ya lo recomendé a todas mis amigas. ¡Gracias por crear algo así!",
    rating: 5,
  },
  {
    name: "Luis M.",
    role: "Freelancer, Lima",
    text: "Lo compré sin muchas expectativas y me sorprendió. Muy práctico y fácil de usar.",
    rating: 4,
  },
  {
    name: "Sofía T.",
    role: "Estudiante, Santiago",
    text: "Perfecto para mi presupuesto de estudiante. El valor que recibí por el precio es una locura.",
    rating: 5,
  },
];

export function Testimonials({ items = defaultTestimonials }: { items?: Testimonial[] }) {
  const doubled = [...items, ...items];

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-4"
        >
          Lo que dicen nuestros usuarios
        </motion.h2>
        <p className="text-muted-foreground text-lg">Miles de personas ya confiaron en nosotros</p>
      </div>

      {/* Marquee de testimonios */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex animate-marquee">
          {doubled.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[350px] mx-3 glass rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
              {t.rating && (
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
              )}
              <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{t.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
