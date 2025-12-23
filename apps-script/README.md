# RSVP Webhook (Google Apps Script)

This folder keeps the Apps Script code that receives RSVP submissions from the website. The script upserts rows in a Google Sheet by normalising phone numbers to E.164 and deduplicating on that value.

## Setup

1. **Create/identify the spreadsheet**
   - Use the sheet that already contains your RSVP columns (Timestamp, Updated At, Source, Household Name, First Name, Last Name, Phone, Phone E164, Email, Language, Attendance, Party Size, Other Guest Names, Notes, Invite Side, Priority, Last Reminder At, Reminder Count, SMS Opt Out).  
   - Copy the spreadsheet ID from the URL (`https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit`).

2. **Create or open the Apps Script project**
   - Open [script.google.com](https://script.google.com) and either open the project that backs your sheet or create a new standalone project.
   - Add the contents of `rsvp.gs` to the project.
   - Replace `REPLACE_WITH_YOUR_SHEET_ID` with the ID from step 1. Update `SHEET_NAME` if your tab is not `Sheet1`.

3. **Deploy as a web app**
   - `Deploy` → `New deployment` → `Select type: Web app`.
   - Set *Execute as* to `Me`.
   - Set *Who has access* to `Anyone` (or `Anyone with the link`).
   - Click `Deploy`, authorize if prompted, and copy the web app URL.

4. **Point the frontend to the webhook**
   - In this repo, set `VITE_RSVP_ENDPOINT=<your_web_app_url>` inside `.env` (create it next to `package.json` if it does not exist).
   - Rebuild/redeploy the site so it uses the new environment variable.

## Troubleshooting

- If submissions fail, check the Apps Script executions dashboard for server-side errors.
- Ensure the sheet still includes the columns listed above; the script validates them and will return HTTP 500 if any are missing.
- If the web app was deployed before editing the script, redeploy to publish the latest code and update the URL in your frontend if it changed.
