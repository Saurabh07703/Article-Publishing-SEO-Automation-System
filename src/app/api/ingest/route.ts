import { NextResponse } from "next/server";
import { N8N_WEBHOOK_URL } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // ── Mock mode when no real webhook is configured ──────────────
    if (
      !N8N_WEBHOOK_URL ||
      N8N_WEBHOOK_URL.includes("your-n8n-instance.com") ||
      N8N_WEBHOOK_URL.includes("localhost")
    ) {
      console.warn("[SEO System] No live n8n webhook — returning mock response.");
      await new Promise((r) => setTimeout(r, 900));
      return NextResponse.json({
        success: true,
        article_id: `art_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        message: "Article submitted successfully (DEMO MODE)",
      });
    }

    const idempotencyKey = payload.idempotency_key || `${Date.now()}`;

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey,
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "Unknown error");
      return NextResponse.json(
        { error: `Submission failed (${res.status}): ${text}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json(
      { error: "Failed to forward request to n8n" },
      { status: 500 }
    );
  }
}
