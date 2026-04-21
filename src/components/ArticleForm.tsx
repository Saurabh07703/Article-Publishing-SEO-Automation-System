"use client";

import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { ArticlePayload, FormStatus } from "@/lib/types";
import { validateArticle } from "@/lib/validation";
import { submitArticle } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";

// ── Icons ────────────────────────────────────────────────────────────
const IconCheck = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconAlert = () => (
  <svg className="alert-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────
export default function ArticleForm() {
  const [status, setStatus]       = useState<FormStatus>("idle");
  const [error, setError]         = useState("");
  const [articleId, setArticleId] = useState("");
  const [contentLen, setContentLen] = useState(0);
  const lastSubmittedRef = useRef("");

  // ── Submit Handler ──────────────────────────────────────────────
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const fd   = new FormData(form);

    const payload: ArticlePayload = {
      title:        (fd.get("title")        as string) || "",
      content:      (fd.get("content")      as string) || "",
      category:     (fd.get("category")     as string) || undefined,
      author:       (fd.get("author")       as string) || undefined,
      published_at: (fd.get("published_at") as string) || undefined,
      tags:         (fd.get("tags")         as string) || undefined,
    };

    const validationError = validateArticle(payload);
    if (validationError) { setError(validationError); return; }

    // Frontend duplicate-submission guard
    const fingerprint = `${payload.title.trim()}|${payload.content.trim().slice(0, 100)}`;
    if (fingerprint === lastSubmittedRef.current) {
      setError("This article was already submitted. Change the title or content to resubmit.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await submitArticle(payload);
      lastSubmittedRef.current = fingerprint;
      setArticleId(res.article_id || "N/A");
      setStatus("success");
      form.reset();
      setContentLen(0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      setError(msg);
      setStatus("error");
    }
  }

  // ── Success Screen ──────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="glass-card animate-in" id="submission-success">
        <div className="success-panel">
          <div className="success-icon-ring" style={{ color: "var(--color-success)" }}>
            <IconCheck />
          </div>

          <div>
            <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.4rem", fontFamily: "var(--font-display)" }}>
              Article Submitted!
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem", lineHeight: 1.6 }}>
              Your article is queued for AI SEO processing.
              Results will appear in Google Sheets within ~5 minutes.
            </p>
          </div>

          <div className="article-id-box" id="article-id-display">
            <div className="article-id-label">Article ID</div>
            <div className="article-id-value">{articleId}</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            <div className="badge">
              <div className="badge-dot" />
              SEO Processing In Queue
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", width: "100%", marginTop: "0.5rem" }}>
            <button
              id="submit-another-btn"
              className="btn-primary"
              onClick={() => { setStatus("idle"); setArticleId(""); setError(""); }}
              style={{ flex: 1 }}
            >
              Submit Another Article
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form Screen ─────────────────────────────────────────────────
  return (
    <div className="glass-card" id="article-form-card">
      <form onSubmit={handleSubmit} className="form-card" noValidate>

        {/* Section Header */}
        <div style={{ marginBottom: "0.25rem" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600, fontFamily: "var(--font-display)", marginBottom: "0.3rem" }}>
            Article Details
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            Fields marked <span style={{ color: "var(--color-accent)" }}>*</span> are required.
          </p>
        </div>

        <hr className="section-divider" />

        {/* Error Banner */}
        {error && (
          <div className="alert alert-error" role="alert" id="form-error-banner">
            <IconAlert />
            <span>{error}</span>
          </div>
        )}

        {/* ── Title ── */}
        <div className="form-group">
          <label htmlFor="field-title" className="form-label">
            Title <span className="required">*</span>
          </label>
          <input
            id="field-title"
            name="title"
            type="text"
            required
            maxLength={200}
            placeholder="e.g. 10 Best SEO Tools for 2025"
            className="form-input"
            autoComplete="off"
          />
        </div>

        {/* ── Content ── */}
        <div className="form-group">
          <label htmlFor="field-content" className="form-label">
            Content <span className="required">*</span>
          </label>
          <textarea
            id="field-content"
            name="content"
            required
            rows={7}
            placeholder="Paste or write your article content here… (minimum 50 characters)"
            className="form-textarea"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContentLen(e.target.value.length)}
          />
          <div className="char-count">{contentLen} characters</div>
        </div>

        {/* ── Category & Author ── */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="field-category" className="form-label">Category</label>
            <select id="field-category" name="category" className="form-select">
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="field-author" className="form-label">Author</label>
            <input
              id="field-author"
              name="author"
              type="text"
              placeholder="Author name"
              className="form-input"
              autoComplete="name"
            />
          </div>
        </div>

        {/* ── Published At & Tags ── */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="field-published-at" className="form-label">Published At</label>
            <input
              id="field-published-at"
              name="published_at"
              type="datetime-local"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="field-tags" className="form-label">Tags</label>
            <input
              id="field-tags"
              name="tags"
              type="text"
              placeholder="seo, marketing, ai"
              className="form-input"
            />
            <p className="input-hint">Comma-separated</p>
          </div>
        </div>

        <hr className="section-divider" />

        {/* ── Submit Button ── */}
        <button
          id="submit-article-btn"
          type="submit"
          disabled={status === "submitting"}
          className="btn-primary"
        >
          {status === "submitting" ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Submitting…
            </>
          ) : (
            <>
              Submit Article
              <IconArrow />
            </>
          )}
        </button>

        <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--color-text-subtle)" }}>
          Duplicate submissions are automatically prevented.
        </p>
      </form>
    </div>
  );
}
