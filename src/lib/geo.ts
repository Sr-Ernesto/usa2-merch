// Geo-detection for currency conversion
// Uses ipwho.is as primary, ipapi.co as fallback

export interface GeoData {
  country: string;
  currency: string;
  currencySymbol: string;
  locale: string;
}

const CURRENCY_MAP: Record<string, { currency: string; symbol: string; locale: string }> = {
  CO: { currency: "COP", symbol: "$", locale: "es-CO" },
  MX: { currency: "MXN", symbol: "$", locale: "es-MX" },
  BR: { currency: "BRL", symbol: "R$", locale: "pt-BR" },
  AR: { currency: "ARS", symbol: "$", locale: "es-AR" },
  PE: { currency: "PEN", symbol: "S/", locale: "es-PE" },
  CL: { currency: "CLP", symbol: "$", locale: "es-CL" },
  US: { currency: "USD", symbol: "$", locale: "en-US" },
  ES: { currency: "EUR", symbol: "€", locale: "es-ES" },
};

export async function detectGeo(): Promise<GeoData> {
  // Check cookie first (anti-reset)
  const cached = getCookie("geo_data");
  if (cached) return JSON.parse(cached);

  try {
    const res = await fetch("https://ipwho.is/");
    const data = await res.json();
    if (data.success) {
      const geo = {
        country: data.country_code,
        currency: CURRENCY_MAP[data.country_code]?.currency || "USD",
        currencySymbol: CURRENCY_MAP[data.country_code]?.symbol || "$",
        locale: CURRENCY_MAP[data.country_code]?.locale || "en-US",
      };
      setCookie("geo_data", JSON.stringify(geo), 30);
      return geo;
    }
  } catch {}

  // Fallback
  return { country: "US", currency: "USD", currencySymbol: "$", locale: "en-US" };
}

export function formatPrice(usdPrice: number, geo: GeoData, exchangeRate?: number): string {
  const rates: Record<string, number> = {
    USD: 1, EUR: 0.92, COP: 4100, MXN: 17.5, BRL: 5.0,
    ARS: 1050, PEN: 3.7, CLP: 950,
  };
  const rate = exchangeRate || rates[geo.currency] || 1;
  const converted = Math.round(usdPrice * rate);
  return new Intl.NumberFormat(geo.locale, {
    style: "currency",
    currency: geo.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(converted);
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
