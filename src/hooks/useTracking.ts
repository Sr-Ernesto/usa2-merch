"use client";

import { useCallback } from "react";

// PostHog + Meta CAPI unified tracking
// PostHog para analytics, Meta CAPI para conversiones (server-side, anti-adblock)

interface TrackingEvent {
  name: string;
  properties?: Record<string, unknown>;
}

export function useTracking() {
  const track = useCallback(({ name, properties }: TrackingEvent) => {
    // PostHog (client-side)
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.capture(name, properties);
    }

    // Meta CAPI (server-side — anti-adblock)
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: name,
        custom_data: properties,
      }),
    }).catch(() => {});

    // Meta Pixel (client-side fallback)
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", name, properties);
    }
  }, []);

  // Pre-built events
  const pageView = useCallback(() => track({ name: "PageView" }), [track]);

  const viewContent = useCallback(
    (content_name: string, value?: number) =>
      track({
        name: "ViewContent",
        properties: { content_name, value, currency: "USD" },
      }),
    [track]
  );

  const initiateCheckout = useCallback(
    (value: number, content_name: string) =>
      track({
        name: "InitiateCheckout",
        properties: { value, currency: "USD", content_name, content_type: "product" },
      }),
    [track]
  );

  const purchase = useCallback(
    (value: number, content_name: string) =>
      track({
        name: "Purchase",
        properties: { value, currency: "USD", content_name, content_type: "product" },
      }),
    [track]
  );

  const ctaClick = useCallback(
    (cta_name: string, section: string) =>
      track({
        name: "CTAClick",
        properties: { cta_name, section },
      }),
    [track]
  );

  const videoPlay = useCallback(
    (video_name: string) =>
      track({
        name: "Play",
        properties: { content_name: video_name, content_type: "video" },
      }),
    [track]
  );

  const scrollDepth = useCallback(
    (depth: number) =>
      track({
        name: "ScrollDepth",
        properties: { depth_percent: depth },
      }),
    [track]
  );

  return {
    track,
    pageView,
    viewContent,
    initiateCheckout,
    purchase,
    ctaClick,
    videoPlay,
    scrollDepth,
  };
}

// Type declarations
declare global {
  interface Window {
    posthog?: { capture: (name: string, props?: Record<string, unknown>) => void };
    fbq?: (action: string, name: string, props?: Record<string, unknown>) => void;
  }
}
