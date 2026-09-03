import { NextRequest, NextResponse } from "next/server";
import { posthog } from "@/src/lib/analytics/posthog";

export async function POST(request: NextRequest) {
  if (!posthog) {
    return NextResponse.json({ ok: true });
  }

  try {
    const body = await request.json();
    const event = typeof body.event === "string" ? body.event : null;
    const distinctId = typeof body.distinctId === "string" ? body.distinctId : null;
    const properties = body.properties && typeof body.properties === "object" ? body.properties : {};

    if (!event || !distinctId) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    posthog.capture({
      distinctId,
      event,
      properties: {
        ...properties,
        $current_url: request.headers.get("origin") || undefined,
      },
    });

    await posthog.flush();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
