# Google Sheets Configuration

## Sheet Setup

Create a Google Spreadsheet with **two sheets** (tabs):

### Sheet A: `Articles`
Add these column headers in Row 1:

| Column | Header |
|--------|--------|
| A | article_id |
| B | created_at |
| C | title |
| D | content |
| E | category |
| F | author |
| G | published_at |
| H | tags_csv |
| I | raw_payload |
| J | seo_status |
| K | seo_requested_at |
| L | seo_processed_at |
| M | seo_error |

### Sheet B: `SEO_Results`
Add these column headers in Row 1:

| Column | Header |
|--------|--------|
| A | article_id |
| B | processed_at |
| C | primary_keywords_csv |
| D | long_tail_keywords_csv |
| E | meta_title |
| F | meta_description |
| G | openai_raw |
| H | ranking_insights |

## Google Sheets API Access

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select existing
3. Enable **Google Sheets API**
4. Create OAuth2 credentials (or Service Account)
5. In n8n, add Google Sheets credentials using the OAuth2 flow
6. Set the `GOOGLE_SHEET_ID` environment variable in n8n to your spreadsheet ID
   - The ID is in the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
