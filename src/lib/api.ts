import { ArticlePayload, SubmissionResponse } from "./types";

/**
 * Submit an article to the backend proxy API route.
 * This prevents CORS errors and ngrok warning page interceptions.
 */
export async function submitArticle(
  payload: ArticlePayload
): Promise<SubmissionResponse> {
  const idempotencyKey = `${payload.title.trim().slice(0, 40)}_${Date.now()}`;

  const res = await fetch("/api/ingest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...payload, idempotency_key: idempotencyKey }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const errorMsg = errorData?.error || `Submission failed (${res.status})`;
    throw new Error(errorMsg);
  }

  return res.json();
}
