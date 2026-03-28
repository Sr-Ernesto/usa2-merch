"use client";

import { BridgeHero } from "./BridgeHero";
import { BridgeVideo } from "./BridgeVideo";
import { BridgeSocialProof } from "./BridgeSocialProof";
import { BridgeCTA } from "./BridgeCTA";

/**
 * 🌉 Bridge Page — La puerta al grupo de WhatsApp
 *
 * NO es una landing page. Es una página de 1 propósito:
 * que el visitante haga click en "Unirme al grupo".
 *
 * Estructura:
 * 1. Aurora background (React Bits style)
 * 2. Headline con split text animation
 * 3. Video en glassmorphism frame
 * 4. Social proof vivo (marquee + avatars + ticker)
 * 5. CTA con shimmer button + countdown
 *
 * Configurar con props. No tocar la lógica.
 */

interface BridgePageProps {
  // Content
  headline: string;
  headlineAccent?: string;
  subheadline: string;
  videoUrl?: string;
  videoThumbnail?: string;
  videoLabel?: string;

  // CTA
  whatsappLink: string;
  ctaText?: string;
  urgencyText?: string;
  spotsLeft?: number;
  deadline?: Date;

  // Social Proof
  memberCount?: number;
  showTicker?: boolean;
  showAvatars?: boolean;

  // Trust
  trustBadges?: string[];
}

export function BridgePage(props: BridgePageProps) {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ═══ BACKGROUND EFFECTS ═══ */}
      {/* Aurora gradient */}
      <div className="absolute inset-0 aurora-bg opacity-40" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[100px]" />

      {/* Floating particles (CSS-only) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-20">
        {/* 1. Headline */}
        <BridgeHero
          headline={props.headline}
          headlineAccent={props.headlineAccent}
          subheadline={props.subheadline}
        />

        {/* 2. Video */}
        <BridgeVideo
          videoUrl={props.videoUrl}
          thumbnailUrl={props.videoThumbnail}
          label={props.videoLabel}
        />

        {/* 3. Social Proof */}
        <BridgeSocialProof
          memberCount={props.memberCount}
          showTicker={props.showTicker}
          showAvatars={props.showAvatars}
          showMarquee={true}
        />

        {/* 4. CTA */}
        <BridgeCTA
          whatsappLink={props.whatsappLink}
          ctaText={props.ctaText}
          urgencyText={props.urgencyText}
          spotsLeft={props.spotsLeft}
          deadline={props.deadline}
          trustBadges={props.trustBadges}
        />
      </div>

      {/* ═══ FLOAT PARTICLES KEYFRAME ═══ */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
          50% { transform: translateY(-40px) translateX(-5px); opacity: 0.3; }
          75% { transform: translateY(-20px) translateX(15px); opacity: 0.5; }
        }
      `}</style>
    </main>
  );
}
