export const N8N_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
  "https://your-n8n-instance.com/webhook/article-ingest";

export const CATEGORIES = [
  "Technology",
  "Business",
  "Marketing",
  "Health & Wellness",
  "Finance",
  "Education",
  "Science",
  "Lifestyle",
  "Travel",
  "Food & Cooking",
  "Sports",
  "Entertainment",
  "Politics",
  "Environment",
  "Other",
] as const;

export const MIN_TITLE_LENGTH = 5;
export const MIN_CONTENT_LENGTH = 50;
export const MAX_TITLE_LENGTH = 200;
