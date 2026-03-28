"use client";

import { motion } from "framer-motion";

// Bridge Hero — Aurora bg + text animation
// Inspirado en React Bits (Aurora, SplitText) + Magic UI (aurora-text)

interface BridgeHeroProps {
  headline: string;
  headlineAccent?: string; // Palabra que lleva gradient
  subheadline?: string;
}

export function BridgeHero({ headline, headlineAccent, subheadline }: BridgeHeroProps) {
  // Split headline into words for stagger animation
  const words = headline.split(" ");

  return (
    <div className="relative text-center mb-10">
      {/* Headline con animación palabra por palabra */}
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 leading-[1.1]">
        {words.map((word, i) => (
          <motion.span
            key={i}
            className={`inline-block mr-[0.3em] ${
              headlineAccent && word.toLowerCase().includes(headlineAccent.toLowerCase())
                ? "gradient-text"
                : ""
            }`}
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.5,
              delay: i * 0.08,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {word}
          </motion.span>
        ))}
      </h1>

      {/* Subheadline fade in */}
      {subheadline && (
        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: words.length * 0.08 + 0.3, duration: 0.6 }}
        >
          {subheadline}
        </motion.p>
      )}
    </div>
  );
}
