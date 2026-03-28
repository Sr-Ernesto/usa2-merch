"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// FAQ — Page UI / Launch UI híbrido

interface FAQItem {
  question: string;
  answer: string;
}

const defaultFAQ: FAQItem[] = [
  {
    question: "¿Qué recibo exactamente después de pagar?",
    answer: "Recibes acceso inmediato a todo el material. Dependiendo del plan, incluye PDFs, videos y plantillas. Todo llega a tu email en menos de 2 minutos.",
  },
  {
    question: "¿Para quién NO es este producto?",
    answer: "Si buscas algo que haga todo por ti sin esfuerzo, este no es. Es para personas que quieren aprender y aplicar. Si ya tienes un sistema que te funciona perfecto, no lo necesitas.",
  },
  {
    question: "¿Hay garantía?",
    answer: "Sí. Si en 7 días sientes que no vale la pena, te devolvemos el dinero sin preguntas. Solo escríbenos.",
  },
  {
    question: "¿Cuánto tiempo tengo acceso?",
    answer: "Acceso de por vida. Pago una vez, usas para siempre. Incluye todas las actualizaciones futuras.",
  },
  {
    question: "¿Cómo accedo después de pagar?",
    answer: "Recibes un email con tu link de acceso personal. Un click y estás dentro. También puedes acceder desde cualquier dispositivo.",
  },
  {
    question: "¿Puedo pagar en mi moneda local?",
    answer: "¡Sí! Detectamos tu ubicación automáticamente y mostramos los precios en tu moneda. Aceptamos todas las tarjetas de crédito y débito.",
  },
];

export function FAQ({ items = defaultFAQ }: { items?: FAQItem[] }) {
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Preguntas frecuentes</h2>
          <p className="text-muted-foreground">Todo lo que necesitas saber antes de decidir</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
