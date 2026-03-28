"use client";

import { BridgePage } from "@/components/bridge/BridgePage";

/**
 * 🌉 Ejemplo de Bridge Page
 *
 * Esta página es un EJEMPLO. Para tu producto:
 * 1. Cambia el headline, subheadline y video
 * 2. Cambia el whatsappLink por tu grupo
 * 3. Ajusta spotsLeft y deadline
 * 4. Deploy
 */

export default function BridgeDemo() {
  // Deadline: medianoche de hoy
  const tonight = new Date();
  tonight.setHours(23, 59, 59, 999);

  return (
    <BridgePage
      // Content
      headline="El secreto que 1,247 personas ya descubrieron"
      headlineAccent="secreto"
      subheadline="En 3 días vas a entender por qué los que entran al grupo nunca se van."
      videoUrl="" // Agregar URL de YouTube/Vimeo embed
      videoThumbnail="" // Agregar thumbnail del video
      videoLabel="Mira este video — 3 minutos que cambian todo"

      // CTA
      whatsappLink="https://chat.whatsapp.com/TU_GRUPO_AQUI"
      ctaText="Unirme al grupo →"
      urgencyText="Solo quedan {spots} lugares"
      spotsLeft={23}
      deadline={tonight}

      // Social Proof
      memberCount={1247}
      showTicker={true}
      showAvatars={true}

      // Trust
      trustBadges={["🔒 Gratis", "⚡ Acceso inmediato", "💰 Sin compromiso"]}
    />
  );
}
