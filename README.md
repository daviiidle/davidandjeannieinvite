# Wedding RSVP Website

A bilingual, mobile-friendly wedding site with a secure RSVP workflow. The web client is built with React + Vite and talks to a Google Apps Script backend that stores RSVPs in Google Sheets and texts guests with Twilio.

## Apps Script deployment

1. Copy the `.gs` files from `apps-script/` into a new Apps Script project (the `README` in that folder lists the load order). Keep `SPREADSHEET_ID`, `SHEET_NAME`, `BASE_SITE_URL`, and Twilio settings in `Config.gs` up to date.
2. In **Project Settings → Script properties** add:
   - `SMS_MODE` (`DRY_RUN` while testing, `LIVE` in production)
   - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`
   - `TWILIO_TEST_TO` (for manual tests)
3. Deploy the project as a Web App that **executes as you** and is accessible to **Anyone**. The deployment URL becomes your API base (set it as `VITE_RSVP_ENDPOINT`).
4. Set `BASE_SITE_URL` (e.g. `https://yourdomain.com`) so the backend can build public `https://yourdomain.com/r/<token>` links for SMS.

## Sheet headers

`SheetOperations` ensures the sheet contains all required columns. Confirm the first row includes at least:

| Column | Purpose |
| ------ | ------- |
| Timestamp, Updated At | Lifecycle tracking |
| Source | Always `WEBSITE` |
| Household Name, First Name, Last Name | Display names |
| Phone, Phone E164, Email, Language | Contact + locale |
| Attendance (YES/NO), Party Size | RSVP answers |
| Other Guest Names, Notes | Additional info |
| Invite Side, Priority | Manual planning fields |
| Last Reminder At, Reminder Count, SMS Opt Out | Reminder throttling |
| Confirmation Sent At | Legacy confirmation tracking |
| **Token** | Private edit token (auto-generated) |
| **Token Updated At** | When the token was last minted |
| **Last SMS Sent At** | Timestamp of the Twilio confirmation SMS |
| **Edit Count** | Number of self-service updates |

The script auto-creates missing columns, but confirming the header order avoids schema drift.

## Token + SMS flow

- `/rsvp` upserts the sheet row (deduped by E.164 phone), auto-creates a cryptographically strong token (24 web-safe bytes), and replies with `{ ok, token, viewUrl }`.
- After saving, `ConfirmationService` sends a short Twilio SMS: `"RSVP saved for X. View/edit: https://yourdomain.com/r/<token> Reply STOP to opt out."` and logs `Last SMS Sent At`.
- `/rsvp?token=...` returns the row for that token so the static site can render `/r/<token>` without any Google authentication.
- `/rsvp/update` accepts `{ token, attendance?, partySize?, additionalNames?, notes?, email? }`, updates the row, bumps `Edit Count`, and responds with the new timestamp.

Tokens act as the only “auth”. Guests must keep the link private; regenerating tokens (not implemented yet) would invalidate old links.

## Testing end-to-end

1. **Local dev:** `npm install` then `npm run dev` to preview the site. Configure `VITE_RSVP_ENDPOINT` (see `.env.example` notes in `package.json`) to point at your deployed Apps Script base.
2. **Submit RSVP:** Use the form on `/` → `/rsvp`. The web app should POST to `<script-url>/rsvp`, receive `{ ok, token, viewUrl }`, and Twilio should send the link.
3. **View/edit:** Open the SMS link (`https://yourdomain.com/r/<token>`). The new page loads data via `GET /rsvp?token=...` and lets the guest adjust attendance, party size, additional names, notes, and email.
4. **Save changes:** Click “Save changes”; the frontend calls `POST /rsvp/update` and shows a success toast. Confirm Google Sheets updated `Attendance`, `Party Size`, `Other Guest Names`, `Notes`, `Email`, `Updated At`, and incremented `Edit Count`.
5. **Logs:** Check the `OUTBOX` sheet for SMS log entries and the `Last SMS Sent At` column for the row you tested.

## Environment variables

Create a `.env`/`.env.local` with:

```
VITE_RSVP_ENDPOINT=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

This value should be the **base** Apps Script URL (the code appends `/rsvp` and `/rsvp/update`).

For more backend detail (reminder jobs, SMS logging, etc.) see `apps-script/README.md`.
