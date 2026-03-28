import { NextRequest, NextResponse } from "next/server";

// Meta Conversions API (CAPI) — Server-side tracking
// Anti-AdBlock: los eventos van por nuestro servidor, no por el navegador

const META_PIXEL_ID = process.env.META_PIXEL_ID || "";
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || "";
const META_API_VERSION = "v21.0";

interface MetaEvent {
  event_name: string;
  event_time: number;
  action_source: "website";
  user_data: {
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string; // click id
    fbp?: string; // browser id
  };
  custom_data?: Record<string, unknown>;
}

async function sendToMeta(events: MetaEvent[]) {
  const url = `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: events,
    }),
  });

  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event_name, custom_data } = body;

    const client_ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "";
    const user_agent = req.headers.get("user-agent") || "";

    // Get fbc/fbp from cookies
    const cookies = req.headers.get("cookie") || "";
    const fbc = cookies.match(/_fbc=([^;]+)/)?.[1] || "";
    const fbp = cookies.match(/_fbp=([^;]+)/)?.[1] || "";

    const event: MetaEvent = {
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      user_data: {
        client_ip_address: client_ip,
        client_user_agent: user_agent,
        fbc,
        fbp,
      },
      custom_data,
    };

    const result = await sendToMeta([event]);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Meta CAPI error:", error);
    return NextResponse.json({ success: false, error: "Failed to send event" }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    pixel_id: META_PIXEL_ID ? "configured" : "missing",
    access_token: META_ACCESS_TOKEN ? "configured" : "missing",
  });
}
