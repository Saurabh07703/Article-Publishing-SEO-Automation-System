# n8n Configuration

## Option 1: Docker (Recommended for Self-Hosted)

```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=<your_password> \
  -e GOOGLE_SHEET_ID=<your_google_sheet_id> \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n

# Access at http://localhost:5678
```

## Option 2: n8n Cloud

1. Sign up at https://n8n.io/cloud
2. Import workflows from `n8n-workflows/` folder

## After Setup

1. **Import Workflow 1** (`workflow-1-ingestion.json`)
   - Configure Google Sheets credentials
   - Activate the workflow
   - Copy the webhook URL → set as `NEXT_PUBLIC_N8N_WEBHOOK_URL` in frontend `.env.local`

2. **Import Workflow 2** (`workflow-2-seo-processing.json`)
   - Configure Google Sheets credentials
   - Configure OpenAI API credentials
   - Activate the workflow (runs every 5 minutes)

## Environment Variables (n8n)

| Variable | Description |
|----------|-------------|
| `GOOGLE_SHEET_ID` | Google Spreadsheet ID |

## Credentials to Configure in n8n

| Credential | Used By |
|------------|---------|
| Google Sheets OAuth2 | Both workflows |
| OpenAI API | Workflow 2 |
