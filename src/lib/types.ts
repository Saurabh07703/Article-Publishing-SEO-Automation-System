export interface ArticlePayload {
  title: string;
  content: string;
  category?: string;
  author?: string;
  published_at?: string;
  tags?: string;
}

export interface SubmissionResponse {
  success: boolean;
  article_id?: string;
  message?: string;
}

export type FormStatus = "idle" | "submitting" | "success" | "error";
