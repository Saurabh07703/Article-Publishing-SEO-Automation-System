# Article Publishing & SEO Automation System

A production-ready system that automates the article ingestion, SEO analysis, and ranking enrichment process.

## 🚀 Live Demo
- **Frontend (Vercel):** [https://article-seo-automation-system.vercel.app](https://article-seo-automation-system.vercel.app)
- **Google Sheet:** [Link to Sheet](https://docs.google.com/spreadsheets/d/1b9Nkj4Mt3jLSDG6BCwLKdQFw3W9WHjCQM2v18JlSHis/edit?usp=sharing)

---

## 🛠️ System Architecture

1.  **Frontend (Next.js 14)**: A high-performance, dark-themed UI for article submission. It includes client-side validation, duplicate submission protection, and real-time status feedback.
2.  **n8n Workflow #1 (Ingestion)**: Receives POST requests, validates content, normalizes tags into CSV format, generates a unique UUID (article_id), and logs the entry into **Sheet A** with a `pending` status.
3.  **n8n Workflow #2 (SEO Processing)**: A scheduled worker that "locks" pending records, performs an idempotency check, generates SEO metadata and advanced ranking insights via **OpenAI (GPT-4o-mini)**, and stores the structured results in **Sheet B**.

---

## 📋 How to Test

1.  **Submit an Article**: Visit the [Frontend URL](https://article-seo-automation-system.vercel.app) and fill out the form.
2.  **Verify Ingestion**: Check the **Articles** tab in the Google Sheet. You should see your article with `seo_status = pending`.
3.  **Wait for Processing**: The SEO worker runs every 5 minutes (or can be triggered manually in n8n). Once processed, the status in **Articles** will change to `done`.
4.  **View Results**: Check the **SEO_Results** tab to see your generated keywords, meta tags, and ranking insights.

---

## 🔗 Webhook & API Details

- **Ingestion Webhook (POST)**: `http://localhost:5679/webhook/article-ingest` (Local)
- **Content-Type**: `application/json`
- **Payload Example**:
    ```json
    {
      "title": "Future of AI",
      "content": "Deep dive into LLMs...",
      "category": "Technology",
      "tags": "AI, Tech, Future"
    }
    ```

---

## 🛡️ Idempotency & Reliability

- **Frontend Level**: Submit buttons are disabled during transit to prevent rapid double-clicks.
- **Workflow Level**: Before processing any article, Workflow #2 checks **Sheet B** for the `article_id`. If the ID already exists, the workflow immediately marks the article as `done` and skips the AI generation to save costs and prevent duplicate data.
- **Status Transitions**: Records are "locked" with a `processing` status to prevent multiple n8n instances from picking up the same article simultaneously.

---

## 🤖 Ranking Insights Generation

Ranking insights are generated using a custom-engineered prompt sent to OpenAI. The AI is instructed to:
1.  **Identify Primary Target**: The single most effective keyword for the content.
2.  **Analyze Opportunity**: Find keywords with low competition but high relevance.
3.  **Identify Competition**: Highlight keywords that may be harder to rank for.
4.  **Strategic Strategy**: Provide a short summary note on how to approach the ranking for that specific niche.

The output is returned as a **strict JSON object**, which is then parsed and stored as a string in the `ranking_insights` column for further analysis.

---

## 📦 Project Structure
- `src/`: Next.js frontend source code.
- `n8n-workflows/`: JSON exports for Workflow #1 and #2.
- `start_all.bat`: Local startup script for both Frontend and n8n.
