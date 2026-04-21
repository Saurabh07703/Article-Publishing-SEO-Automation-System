import { ArticlePayload } from "./types";
import { MIN_TITLE_LENGTH, MIN_CONTENT_LENGTH, MAX_TITLE_LENGTH } from "./constants";

export function validateArticle(data: ArticlePayload): string | null {
  const title   = data.title?.trim()   ?? "";
  const content = data.content?.trim() ?? "";

  if (!title)
    return "Title is required.";
  if (title.length < MIN_TITLE_LENGTH)
    return `Title must be at least ${MIN_TITLE_LENGTH} characters.`;
  if (title.length > MAX_TITLE_LENGTH)
    return `Title must be under ${MAX_TITLE_LENGTH} characters.`;
  if (!content)
    return "Content is required.";
  if (content.length < MIN_CONTENT_LENGTH)
    return `Content must be at least ${MIN_CONTENT_LENGTH} characters.`;

  return null;
}
