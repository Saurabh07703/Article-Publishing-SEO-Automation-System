export interface ArticlePayload {
  title: string;
  content: string;
  category?: string;
  author?: string;
  published_at?: string;
  tags: string[]; // Convert from comma-separated in the UI to array or pass directly as string
}

export async function submitArticle(data: ArticlePayload, idempotencyKey: string) {
  const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/article';
  
  const payload = {
    ...data,
    tags: Array.isArray(data.tags) ? data.tags.join(',') : data.tags,
    idempotency_key: idempotencyKey,
  };

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Error submitting article: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
}
