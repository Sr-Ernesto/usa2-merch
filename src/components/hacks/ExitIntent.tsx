"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

// Exit Intent Modal — captura visitantes que se van
// Variantes: discount, quiz, content

interface ExitIntentProps {
  enabled?: boolean;
  variant?: "discount" | "quiz" | "content";
  delay?: number;
  headline?: string;
  body?: string;
  ctaText?: string;
  ctaLink?: string;
  discountPercent?: number;
}

export function ExitIntent({
  enabled = true,
  variant = "discount",
  delay = 5000,
  headline = "¡Espera! Antes de irte...",
  body = "Toma un descuento exclusivo. Solo para ti.",
  ctaText = "Quiero mi descuento →",
  ctaLink = "#pricing",
  discountPercent = 20,
}: ExitIntentProps) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (dismissed || show) return;
      if (e.clientY < 10) {
        setShow(true);
        // Track exit intent
        if (typeof window !== "undefined" && window.posthog) {
          window.posthog.capture("exit_intent_triggered", { variant });
        }
      }
    },
    [dismissed, show, variant]
  );

  useEffect(() => {
    if (!enabled) return;

    // Only on desktop
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    const timeout = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, delay);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [enabled, delay, handleMouseLeave]);

  if (!enabled) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShow(false);
              setDismissed(true);
            }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-strong rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25 }}
            >
              {/* Close button */}
              <button
                onClick={() => {
                  setShow(false);
                  setDismissed(true);
                }}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors text-xl"
              >
                ✕
              </button>

              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />

              {/* Content */}
              <div className="relative z-10">
                {variant === "discount" && (
                  <>
                    <div className="text-5xl mb-4">🎁</div>
                    <h3 className="text-2xl font-bold mb-2">{headline}</h3>
                    <p className="text-muted-foreground mb-2">
                      {body.replace("{discount}", String(discountPercent))}
                    </p>
                    <div className="text-4xl font-bold gradient-text my-4">
                      {discountPercent}% OFF
                    </div>
                    <a
                      href={ctaLink}
                      className="inline-block w-full"
                      onClick={() => {
                        setShow(false);
                        if (typeof window !== "undefined" && window.posthog) {
                          window.posthog.capture("exit_intent_cta_click", { variant });
                        }
                      }}
                    >
                      <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors">
                        {ctaText}
                      </button>
                    </a>
                  </>
                )}

                {variant === "quiz" && (
                  <>
                    <div className="text-5xl mb-4">🧠</div>
                    <h3 className="text-2xl font-bold mb-2">
                      Antes de irte...
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Responde 3 preguntas y te damos un diagnóstico personalizado. Gratis.
                    </p>
                    <a
                      href={ctaLink}
                      className="inline-block w-full"
                      onClick={() => setShow(false)}
                    >
                      <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold">
                        Hacer el quiz →
                      </button>
                    </a>
                  </>
                )}

                {variant === "content" && (
                  <>
                    <div className="text-5xl mb-4">📄</div>
                    <h3 className="text-2xl font-bold mb-2">{headline}</h3>
                    <p className="text-muted-foreground mb-4">{body}</p>
                    <a
                      href={ctaLink}
                      className="inline-block w-full"
                      onClick={() => setShow(false)}
                    >
                      <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold">
                        {ctaText}
                      </button>
                    </a>
                  </>
                )}

                <p className="text-xs text-muted-foreground mt-4 opacity-60">
                  Esta oferta es única y no se repetirá.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
