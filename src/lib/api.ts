import { ArticlePayload, SubmissionResponse } from "./types";
import { N8N_WEBHOOK_URL } from "./constants";

/**
 * Submit an article to the n8n ingestion webhook (Workflow 1).
 * Falls back to a mock response when the webhook URL is the placeholder,
 * so the UI can be demonstrated without a live n8n instance.
 */
export async function submitArticle(
  payload: ArticlePayload
): Promise<SubmissionResponse> {
  // ── Mock mode when no real webhook is configured ──────────────
  if (
    !N8N_WEBHOOK_URL ||
    N8N_WEBHOOK_URL.includes("your-n8n-instance.com") ||
    N8N_WEBHOOK_URL.includes("localhost")
  ) {
    console.warn("[SEO System] No live n8n webhook — returning mock response.");
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 900));
    return {
      success: true,
      article_id: `art_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      message: "Article submitted successfully (DEMO MODE)",
    };
  }

  // ── Live submission ───────────────────────────────────────────
  const idempotencyKey = `${payload.title.trim().slice(0, 40)}_${Date.now()}`;

  const res = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Idempotency-Key": idempotencyKey,
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify({ ...payload, idempotency_key: idempotencyKey }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Submission failed (${res.status}): ${text}`);
  }

  return res.json();
}
