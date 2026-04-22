# Article Publishing & SEO Automation System

A production-ready, two-workflow automation system that ingests articles via a Next.js frontend, stores them in Google Sheets, and processes them with AI-driven SEO analysis and ranking insights.

---

## 🚀 Live Demo
- **Frontend (Vercel):** [https://article-seo-automation-system.vercel.app](https://article-seo-automation-system.vercel.app)
- **Google Sheet:** [https://docs.google.com/spreadsheets/d/1b9Nkj4Mt3jLSDG6BCwLKdQFw3W9WHjCQM2v18JlSHis/edit](https://docs.google.com/spreadsheets/d/1b9Nkj4Mt3jLSDG6BCwLKdQFw3W9WHjCQM2v18JlSHis/edit)

---

## 🛠️ System Architecture

```
[Next.js Frontend on Vercel]
       │
       │ POST /api/ingest (server-side proxy)
       │
       ▼
[n8n Workflow 1 - Ingestion]
  • Validates title + content
  • Normalizes fields (trim, tags→CSV, raw_payload)
  • Generates article_id + created_at
  • Writes to Sheet A (seo_status = "pending")
  • Responds immediately with article_id
       │
       │ (every 5 minutes via Schedule Trigger)
       │
       ▼
[n8n Workflow 2 - SEO & Ranking Processing]
  • Reads all articles from Sheet A
  • Filters for seo_status == "pending"
  • Locks record (seo_status = "processing")
  • Idempotency check against Sheet B
  • Calls OpenAI GPT-4o-mini for SEO generation
  • Parses + validates structured JSON response
  • Writes to Sheet B (SEO_Results)
  • Updates Sheet A (seo_status = "done", seo_processed_at)
  • On failure: seo_status = "failed", seo_error = message
```

---

## 📋 Google Sheets Structure

### Sheet A: `Articles`
| Column | Description |
|--------|-------------|
| article_id | Unique ID (art_xxxx_xxx format) |
| created_at | ISO timestamp of ingestion |
| title | Article title |
| content | Full article content |
| category | Optional category |
| author | Optional author |
| published_at | Optional publish date |
| tags_csv | Comma-separated tags |
| raw_payload | Original JSON payload as string |
| seo_status | `pending` → `processing` → `done` / `failed` |
| seo_requested_at | Timestamp when article was submitted |
| seo_processed_at | Timestamp when SEO processing completed |
| seo_error | Error message if processing failed |

### Sheet B: `SEO_Results`
| Column | Description |
|--------|-------------|
| article_id | Links back to Sheet A |
| processed_at | ISO timestamp of SEO processing |
| primary_keywords_csv | 7 high-relevance keywords |
| long_tail_keywords_csv | 15 conversational long-tail phrases |
| meta_title | SEO title (≤60 chars) |
| meta_description | SEO description (≤155 chars) |
| openai_raw | Raw OpenAI response for audit |
| ranking_insights | JSON: primary_target, high_opportunity, high_competition, notes |

> ⚠️ **IMPORTANT**: Both sheets must have these exact column names in Row 1 before importing workflows!

---

## 🔗 Webhook & API Details

### Ingestion Endpoint
- **URL (via ngrok tunnel):** `https://unhitched-renewably-trembling.ngrok-free.dev/webhook/article-ingest`
- **Method:** `POST`
- **Content-Type:** `application/json`

### Payload Example
```json
{
  "title": "The Future of AI in Content Marketing",
  "content": "Artificial intelligence is transforming how marketers create and distribute content...",
  "category": "Technology",
  "author": "Jane Smith",
  "published_at": "2025-04-22T10:00:00",
  "tags": "AI, content marketing, SEO, automation"
}
```

### Success Response
```json
{
  "success": true,
  "article_id": "art_abc12xyz_k9m3n2",
  "message": "Article received. SEO processing will begin shortly."
}
```

---

## 🛡️ Idempotency Approach

The system uses a **3-layer idempotency strategy**:

1. **Frontend Layer**: Submit button is disabled during transit; a fingerprint (`title + content[:100]`) is stored in a `useRef`. If the same fingerprint is submitted twice, the user sees an error before any network call is made.

2. **Workflow 1 Layer**: Each article gets a unique `article_id` generated with `Math.random() + Date.now()`. Even if a duplicate HTTP request arrives, it will be stored as a separate article (different `article_id`, `created_at`). The `raw_payload` column captures the original request for audit.

3. **Workflow 2 Layer**: Before calling OpenAI, the workflow reads all rows from Sheet B and checks if the current `article_id` already exists. If found → marks the article as `done` and exits without making an additional OpenAI call or writing a duplicate row to Sheet B.

Status transitions are also idempotent:
- `pending` → `processing` (lock prevents double-pickup)
- `processing` → `done` or `failed` (final terminal states)

---

## 🤖 Ranking Insights Generation

Ranking insights are generated using a highly structured prompt sent to **OpenAI GPT-4o-mini**. The AI is instructed to act as a "world-class SEO strategist" and analyze the article with the following criteria:

### What is Generated
1. **Primary Target**: The single keyword with the best ratio of relevance vs. competition difficulty — the keyword to build the entire content strategy around.
2. **High Opportunity Keywords**: 3-5 keywords with low SERP competition but solid topical relevance and reasonable search volume — ideal for quick ranking wins.
3. **High Competition Keywords**: 2-3 keywords dominated by high-authority sites (brands, Wikipedia, major publishers) — flagged so realistic expectations are set.
4. **Strategic Notes**: A 2-3 sentence recommendation covering content gaps to exploit, internal linking opportunities, and featured snippet targeting strategies.

### Output Structure
```json
{
  "primary_target": "best ecommerce platform for small business",
  "high_opportunity": ["cheap ecommerce tools 2025", "shopify alternatives beginners"],
  "high_competition": ["ecommerce platform", "best shopify apps"],
  "notes": "Target 'best ecommerce platform for small business' as a primary pillar page. Create supporting content targeting featured snippets with comparison tables. Internal link from blog posts to the main landing page to consolidate authority."
}
```

The full OpenAI response is stored in the `openai_raw` column in Sheet B for full auditability.

---

## 🧪 How to Test

### Step 1: Start the Local Stack
```cmd
.\start_all.bat
```
This will start:
- **Next.js frontend** on `http://localhost:3000`
- **ngrok tunnel** at `https://unhitched-renewably-trembling.ngrok-free.dev`
- **n8n server** on `http://localhost:567`

### Step 2: Import Workflows into n8n
1. Open `http://localhost:567` in your browser.
2. Click **Workflows → Add Workflow → Import from File**.
3. Import `n8n-workflows/workflow-1-ingestion.json`.
4. Add your **Google Sheets credential** to all Google Sheets nodes.
5. Make sure it's **Active** (toggle on).
6. Repeat for `n8n-workflows/workflow-2-seo-processing.json`.
7. Add your **OpenAI credential** to the AI SEO Analysis node.

### Step 3: Set Up Google Sheets
Ensure both sheets have exact headers in Row 1:

**Sheet A (Articles):** `article_id | created_at | title | content | category | author | published_at | tags_csv | raw_payload | seo_status | seo_requested_at | seo_processed_at | seo_error`

**Sheet B (SEO_Results):** `article_id | processed_at | primary_keywords_csv | long_tail_keywords_csv | meta_title | meta_description | openai_raw | ranking_insights`

### Step 4: Submit an Article
1. Visit the Vercel frontend or `http://localhost:3000`.
2. Fill in the form (Title + Content are required, min 5 and 50 chars respectively).
3. Click **Submit Article**.
4. Check Sheet A — a row should appear with `seo_status = pending`.

### Step 5: Trigger SEO Processing
- **Wait 5 minutes** for the schedule to fire automatically, OR
- Go to n8n → open Workflow 2 → click **Execute Workflow** to run it immediately.

### Step 6: Verify Results
- Sheet A: `seo_status` should change to `done`, `seo_processed_at` will be populated.
- Sheet B: A new row with all SEO data will appear.

---

## 📦 Project Structure
```
├── src/
│   ├── app/
│   │   ├── api/ingest/route.ts   # Server-side proxy (bypasses CORS)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ArticleForm.tsx
│   ├── lib/
│   │   ├── api.ts                # Client-side API helper
│   │   ├── constants.ts          # Webhook URL, categories
│   │   ├── types.ts
│   │   └── validation.ts
│   └── styles/
│       └── globals.css
├── n8n-workflows/
│   ├── workflow-1-ingestion.json
│   └── workflow-2-seo-processing.json
├── start_all.bat                 # One-command startup script
└── README.md
```
