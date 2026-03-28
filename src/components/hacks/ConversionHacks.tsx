"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import defaultConfig from "./hacks-config.json";

// Conversion Hacks Provider
// Lee config → Carga hacks activos → Los renderiza como overlays
// Cada hack es INDEPENDIENTE. Si falla, no rompe la página.

interface HackConfig {
  enabled: boolean;
  [key: string]: unknown;
}

interface HacksConfig {
  tabRecovery: HackConfig;
  exitIntent: HackConfig;
  quizEngine: HackConfig;
  socialToasts: HackConfig;
  lockedOffer: HackConfig;
  priceStack: HackConfig;
}

const HacksContext = createContext<HacksConfig>(defaultConfig as HacksConfig);

export function useHacksConfig() {
  return useContext(HacksContext);
}

interface ConversionHacksProps {
  children: ReactNode;
  config?: Partial<HacksConfig>;
}

export function ConversionHacks({ children, config }: ConversionHacksProps) {
  const mergedConfig = { ...(defaultConfig as HacksConfig), ...config };

  return (
    <HacksContext.Provider value={mergedConfig}>
      {children}
      {/* Hack overlays se importan dinámicamente solo si están enabled */}
      {mergedConfig.tabRecovery?.enabled && <TabRecoveryHack />}
      {mergedConfig.socialToasts?.enabled && <SocialToastsHack />}
    </HacksContext.Provider>
  );
}

// ═══ TAB RECOVERY ═══
function TabRecoveryHack() {
  const config = useHacksConfig().tabRecovery;
  const messages = (config.messages as string[]) || ["¡Vuelve!"];
  const interval = (config.interval as number) || 3000;

  useEffect(() => {
    const originalTitle = document.title;
    let messageIndex = 0;
    let titleInterval: NodeJS.Timeout;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        titleInterval = setInterval(() => {
          document.title = messages[messageIndex % messages.length];
          messageIndex++;
        }, interval);
      } else {
        clearInterval(titleInterval);
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(titleInterval);
      document.title = originalTitle;
    };
  }, [messages, interval]);

  return null; // No renderiza nada visible
}

// ═══ SOCIAL PROOF TOASTS ═══
function SocialToastsHack() {
  const config = useHacksConfig().socialToasts;
  const names = (config.names as { name: string; city: string }[]) || [];
  const actions = (config.actions as string[]) || ["compró"];
  const interval = (config.interval as number) || 15000;
  const variation = (config.variation as number) || 5000;

  useEffect(() => {
    if (typeof document === "undefined") return;

    // Create toast container
    const container = document.createElement("div");
    container.id = "social-toasts";
    container.style.cssText =
      "position:fixed;bottom:20px;left:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;";
    document.body.appendChild(container);

    const showToast = () => {
      const person = names[Math.floor(Math.random() * names.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];

      const toast = document.createElement("div");
      toast.style.cssText = `
        background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);
        border:1px solid rgba(255,255,255,0.1);border-radius:12px;
        padding:12px 16px;color:white;font-size:13px;
        display:flex;align-items:center;gap:10px;
        box-shadow:0 8px 32px rgba(0,0,0,0.3);
        animation:toastIn 0.4s ease-out;pointer-events:auto;
        max-width:300px;
      `;
      toast.innerHTML = `
        <div style="width:8px;height:8px;border-radius:50%;background:#22c55e;flex-shrink:0;animation:pulse 2s infinite;"></div>
        <div>
          <strong>${person.name}</strong> de ${person.city}
          <div style="opacity:0.7;font-size:11px;margin-top:2px;">${action} hace ${Math.floor(Math.random() * 10) + 1} min</div>
        </div>
      `;

      container.appendChild(toast);

      // Remove after 5s
      setTimeout(() => {
        toast.style.animation = "toastOut 0.3s ease-in forwards";
        setTimeout(() => toast.remove(), 300);
      }, 5000);
    };

    // Add CSS animations
    if (!document.getElementById("toast-styles")) {
      const style = document.createElement("style");
      style.id = "toast-styles";
      style.textContent = `
        @keyframes toastIn { from { transform:translateX(-100%);opacity:0; } to { transform:translateX(0);opacity:1; } }
        @keyframes toastOut { from { transform:translateX(0);opacity:1; } to { transform:translateX(-100%);opacity:0; } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `;
      document.head.appendChild(style);
    }

    // First toast after 8s
    const firstTimeout = setTimeout(showToast, 8000);

    // Then random intervals
    const toastInterval = setInterval(() => {
      showToast();
    }, interval + (Math.random() - 0.5) * variation);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(toastInterval);
      container.remove();
    };
  }, [names, actions, interval, variation]);

  return null;
}
