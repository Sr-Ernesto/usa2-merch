"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

// Quiz Engine — Hormozi-style qualification quiz con Barnum effect
// Cada pregunta aumenta micro-compromiso. El resultado vende.

interface Question {
  id: string;
  text: string;
  options: string[];
}

interface BarnumResults {
  high: string;
  medium: string;
  low: string;
}

interface QuizEngineProps {
  questions?: Question[];
  barnumResults?: BarnumResults;
  onComplete?: (score: number, answers: Record<string, number>) => void;
  resultCtaText?: string;
  resultCtaLink?: string;
}

const defaultQuestions: Question[] = [
  {
    id: "q1",
    text: "¿Cuánto tiempo llevas intentando resolver esto?",
    options: ["Menos de 1 mes", "1-6 meses", "6-12 meses", "Más de 1 año"],
  },
  {
    id: "q2",
    text: "¿Cuánto dinero has gastado en intentarlo?",
    options: ["Nada todavía", "Menos de $50", "$50-200", "Más de $200"],
  },
  {
    id: "q3",
    text: "¿Qué tan frustrado/a te sientes del 1 al 10?",
    options: ["1-3 (tranquilo)", "4-6 (molesto)", "7-8 (frustrado)", "9-10 (desesperado)"],
  },
  {
    id: "q4",
    text: "¿Qué has probado antes?",
    options: ["Nada, soy nuevo/a", "Otros cursos/productos", "Lo hice solo/a", "Profesionales"],
  },
  {
    id: "q5",
    text: "¿Cuál es tu mayor miedo sobre esto?",
    options: ["Que no funcione", "Que sea estafa", "Que no tenga tiempo", "Que sea muy difícil"],
  },
  {
    id: "q6",
    text: "¿Qué resultado quieres en los próximos 30 días?",
    options: ["Avanzar un poco", "Ver cambios reales", "Transformación completa", "Dominar esto"],
  },
  {
    id: "q7",
    text: "¿Listo/a para tomar acción HOY?",
    options: ["Sí, estoy listo/a", "Necesito más info", "Quizás mañana", "No estoy seguro/a"],
  },
];

const defaultBarnum: BarnumResults = {
  high: "Tu análisis revela que eres una persona determinada que ha sufrido lo suficiente como para saber que necesita un cambio REAL. Tu nivel de frustración indica que estás al límite — y eso es BUENO, porque estás listo/a para actuar.",
  medium: "Tu perfil muestra que eres una persona cuidadosa que analiza antes de actuar. Eso es una fortaleza, pero también puede ser lo que te ha frenado. Las personas como tú logran los MEJORES resultados cuando finalmente se comprometen.",
  low: "Tu perfil sugiere que estás en modo exploración — y eso está perfecto. Pero hay algo importante: cada mes que pasa sin actuar, el problema crece. Las personas que empiezan hoy tienen 3x más probabilidades de éxito.",
};

export function QuizEngine({
  questions = defaultQuestions,
  barnumResults = defaultBarnum,
  onComplete,
  resultCtaText = "Quiero mi solución ahora →",
  resultCtaLink = "#pricing",
}: QuizEngineProps) {
  const [currentQ, setCurrentQ] = useState(-1); // -1 = start screen
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleStart = () => {
    setCurrentQ(0);
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.capture("quiz_started");
    }
  };

  const handleAnswer = useCallback(
    (questionId: string, answerIndex: number) => {
      const newAnswers = { ...answers, [questionId]: answerIndex };
      setAnswers(newAnswers);

      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        // Quiz complete — show analyzing animation
        setAnalyzing(true);
        const totalScore = Object.values(newAnswers).reduce((a, b) => a + b, 0);
        const maxScore = questions.length * 3;
        const percent = totalScore / maxScore;

        setTimeout(() => {
          setAnalyzing(false);
          setShowResult(true);
          onComplete?.(percent, newAnswers);

          if (typeof window !== "undefined" && window.posthog) {
            window.posthog.capture("quiz_completed", {
              score: percent,
              answers: newAnswers,
            });
          }
        }, 3000);
      }
    },
    [answers, currentQ, questions.length, onComplete]
  );

  const getResult = () => {
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    const maxScore = questions.length * 3;
    const percent = totalScore / maxScore;

    if (percent > 0.66) return { level: "high", text: barnumResults.high, emoji: "🔥" };
    if (percent > 0.33) return { level: "medium", text: barnumResults.medium, emoji: "⚡" };
    return { level: "low", text: barnumResults.low, emoji: "🌱" };
  };

  const progress = currentQ >= 0 ? ((currentQ + 1) / questions.length) * 100 : 0;

  return (
    <div className="max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {/* START SCREEN */}
        {currentQ === -1 && !showResult && !analyzing && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center glass rounded-2xl p-8"
          >
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold mb-2">Diagnóstico personalizado</h3>
            <p className="text-muted-foreground mb-6">
              Responde {questions.length} preguntas y descubre tu perfil en 60 segundos.
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
            >
              Empezar quiz →
            </button>
          </motion.div>
        )}

        {/* QUESTIONS */}
        {currentQ >= 0 && !showResult && !analyzing && (
          <motion.div
            key={`q-${currentQ}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="glass rounded-2xl p-8"
          >
            {/* Progress bar */}
            <div className="w-full h-1 bg-muted rounded-full mb-6 overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <p className="text-xs text-muted-foreground mb-2">
              Pregunta {currentQ + 1} de {questions.length}
            </p>
            <h3 className="text-xl font-bold mb-6">{questions[currentQ].text}</h3>

            <div className="space-y-3">
              {questions[currentQ].options.map((option, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleAnswer(questions[currentQ].id, i)}
                  className="w-full text-left px-5 py-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-sm">{option}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ANALYZING */}
        {analyzing && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center glass rounded-2xl p-8"
          >
            <div className="text-5xl mb-4 animate-pulse">⚙️</div>
            <h3 className="text-xl font-bold mb-2">Analizando tus respuestas...</h3>
            <p className="text-muted-foreground text-sm">
              Procesando tu perfil personalizado
            </p>
            <div className="w-48 h-1 bg-muted rounded-full mx-auto mt-4 overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}

        {/* RESULT (Barnum Effect) */}
        {showResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-2xl p-8 text-center"
          >
            <div className="text-5xl mb-4">{getResult().emoji}</div>
            <h3 className="text-2xl font-bold mb-4 gradient-text">
              Tu resultado personalizado
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {getResult().text}
            </p>
            <a href={resultCtaLink}>
              <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors">
                {resultCtaText}
              </button>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
