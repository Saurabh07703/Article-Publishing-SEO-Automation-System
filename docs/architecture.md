# System Architecture

## High-Level Flow

```
┌──────────────┐     POST JSON      ┌─────────────────────┐
│   Frontend   │ ──────────────────► │  n8n Workflow #1    │
│  (Next.js    │                     │  (Ingestion)        │
│   on Vercel) │ ◄────────────────── │                     │
│              │   { article_id }    │  - Validate         │
└──────────────┘                     │  - Normalize        │
                                     │  - Write Sheet A    │
                                     └─────────┬───────────┘
                                               │
                                     ┌─────────▼───────────┐
                                     │  Google Sheet A      │
                                     │  (Articles)          │
                                     │  seo_status=pending  │
                                     └─────────┬───────────┘
                                               │
                                     ┌─────────▼───────────┐
                                     │  n8n Workflow #2     │
                                     │  (SEO Processing)    │
                                     │  Runs every 5 min    │
                                     │                      │
                                     │  - Lock (processing) │
                                     │  - Idempotency check │
                                     │  - OpenAI SEO gen    │
                                     │  - Ranking insights  │
                                     │  - Write Sheet B     │
                                     │  - Finalize (done)   │
                                     └─────────┬───────────┘
                                               │
                                     ┌─────────▼───────────┐
                                     │  Google Sheet B      │
                                     │  (SEO_Results)       │
                                     └─────────────────────┘
```

## Idempotency Approach

1. **Frontend**: Fingerprint-based duplicate detection (title + content hash)
2. **Workflow #1**: UUID generation ensures unique article_id per submission
3. **Workflow #2**:
   - Locks record by setting `seo_status = processing` before work begins
   - Checks Sheet B for existing `article_id` before calling OpenAI
   - If already exists → marks done and exits (no duplicate writes)

## Failure Handling

- On any error in Workflow #2: `seo_status = failed`, error stored in `seo_error`
- Next schedule run will NOT re-process failed records (only `pending` status)
- Manual retry: change `seo_status` back to `pending` in Sheet A

## Ranking Insights Generation

OpenAI generates structured ranking insights alongside SEO keywords:
- Identifies the **primary target keyword** with highest opportunity
- Categorizes keywords into **high opportunity** (low competition) and **high competition**
- Provides strategic **notes** for content optimization
- Output is strict JSON stored in `ranking_insights` column of Sheet B
