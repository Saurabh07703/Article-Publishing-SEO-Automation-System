# Article Publishing & SEO Automation System

## Overview
This repository contains a full-stack Next.js project and n8n workflow assets for automating article submission, ingestion, and subsequent AI-based SEO generation.

### Part 1: Frontend Application
Built with Next.js (App Router), React, and TailwindCSS (v4). It's designed to be deployed instantly on Vercel. 
- Features glassmorphism UI and dynamic loading states.
- Client-side validation.
- Generates an `idempotency_key` client-side, attaching it in the headers & body to ensure you strictly avoid duplicate submissions on retry.

### Part 2: Required Google Sheets Formats
You will need a Google Sheet with 2 specific worksheets. See `google_sheets_schema.txt` for exact column headers and instructions.

### Part 3: n8n Workflows
Within the root folder, you'll find:
- `1-ingestion_workflow.json`
- `2-seo_processing_workflow.json`
- `docker-compose.yml` for self-hosting n8n instantly.

---

## 🚀 How to Test & Setup

### 1. Run the Frontend locally
```bash
cd frontend
npm install
npm run dev
```

### 2. Hosting n8n Locally (Docker)
1. In the root directory, run `docker-compose up -d`.
2. Open n8n at `http://localhost:5678`.

### 3. Configure Webhooks
The webhook configured in `1-ingestion_workflow.json` listens by default to the path `webhook/article`.
When running n8n locally, the URL to test is:
`http://localhost:5678/webhook-test/article`

**Connecting Frontend:** Create an `.env.local` inside the `/frontend` directory and define:
`NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/article` (Update this depending on test/production endpoint in n8n).

### 4. Idempotency Approach
- The Next.js frontend generates a `crypto.randomUUID()` assigned to `idempotencyKey` when the page finishes loading.
- It attaches this string as `X-Idempotency-Key` and `idempotency_key` in the payload structure.
- The n8n ingestion workflow uses this ID as the definitive `article_id`.
- The n8n SEO workflow specifically enforces idempotency by checking Sheet B prior, or relies firmly on the Google Sheets update command mapped strictly to the unique key `article_id`. Since the node is marked to search by key, Google Sheets will overwrite preventing duplications.

### 5. How Ranking Insights are Generated
- Ranking insights rely on an advanced heuristic LLM prompt in Workflow #2. 
- The OpenAI model takes the title and content and is prompted using "Zero Shot Generation" with the System Prompt defined explicitly as an "Expert SEO Specialist". 
- It simulates fetching competitiveness by categorizing generated keywords into: `primary_target`, `high_opportunity`, and `high_competition`, relying entirely on its large scale parameter knowledge of typical keyword difficulty trends and outputting strict JSON representations parsed directly into `Sheet B`.
