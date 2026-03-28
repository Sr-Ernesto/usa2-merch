"use client";

import { useState, useEffect } from "react";
import { detectGeo, formatPrice, type GeoData } from "@/lib/geo";

export function useGeoCurrency(usdPrice: number) {
  const [geo, setGeo] = useState<GeoData>({
    country: "US",
    currency: "USD",
    currencySymbol: "$",
    locale: "en-US",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    detectGeo().then((data) => {
      setGeo(data);
      setLoading(false);
    });
  }, []);

  return {
    geo,
    loading,
    localPrice: formatPrice(usdPrice, geo),
    formattedPrice: (price: number) => formatPrice(price, geo),
  };
}
