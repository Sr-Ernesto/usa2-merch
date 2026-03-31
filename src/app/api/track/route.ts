import { NextRequest, NextResponse } from "next/server";

// Meta Conversions API — Server-side tracking
// Sends events directly to Meta, independent of browser ad blockers

const PIXEL_ID = "1377931084349727";
const ACCESS_TOKEN = "EAAG6AMxWQZCgBRH4ajSNZCkLlrq6lZBoxoEvfGd3LaXYsLWfKRZAEtl3oJWAnmEvFWOEWHM7ejqLZAU8NISGFNZA650lXjqkwxtPipk7JDNd2ADPS5NyocNPtedCd8b3ibARjfGG6pfBekeZCUuLv2wOprDxWWigAQdRyEQpH9CZCPjRfLzfrhhoUZBfMJ7GgSQZDZD";
const API_VERSION = "v21.0";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, placement, url } = body;

    // Get client IP and user agent for better match quality
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || "";
    const userAgent = req.headers.get("user-agent") || "";

    // Generate event_id for deduplication (client + server)
    const eventId = `${event}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const payload = {
      data: [
        {
          event_name: event || "Lead",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: url || "",
          event_id: eventId,
          user_data: {
            client_ip_address: clientIp,
            client_user_agent: userAgent,
          },
          custom_data: {
            content_name: "WhatsApp Group Join",
            content_category: "Bridge Page",
            placement: placement || "unknown",
          },
        },
      ],
    };

    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    return NextResponse.json({ ok: true, meta: data });
  } catch (err) {
    // Silent fail — tracking should never break the page
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
