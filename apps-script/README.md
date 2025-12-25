# Wedding RSVP Google Apps Script

A modular, production-ready Google Apps Script system for managing wedding RSVPs with SMS notifications via Twilio.

## Features

- **RSVP Form Webhook** - Processes POST requests from web forms
- **Phone Deduplication** - Prevents duplicate entries by E.164 phone number
- **SMS Confirmations** - Sends instant confirmation messages after RSVP
- **Automated Reminders** - Scheduled SMS reminders for non-responders
- **Bilingual Support** - English and Vietnamese message templates
- **Audit Trail** - All SMS logged to OUTBOX sheet
- **Honeypot Spam Protection** - Filters spam submissions

## Architecture

The codebase is refactored into **11 modular files** following senior engineering best practices:

### Core Files

| File | Purpose | Key Responsibilities |
|------|---------|---------------------|
| **Config.gs** | Configuration & Constants | All templates, headers, settings |
| **HttpHandlers.gs** | Webhook Entry Points | doPost, doGet, doOptions handlers |
| **Validation.gs** | Request Validation | Payload parsing and validation |
| **SheetOperations.gs** | Spreadsheet Management | Read/write operations, header management |
| **SmsService.gs** | SMS Integration | Twilio API calls and logging |
| **ConfirmationService.gs** | Confirmation Messages | Build and send confirmation SMS |
| **ReminderService.gs** | Reminder Scheduling | Automated reminder logic |
| **OutboxLogger.gs** | SMS Audit Logging | OUTBOX sheet management |
| **PhoneUtils.gs** | Phone Utilities | E.164 formatting, canonicalization |
| **StringUtils.gs** | String Utilities | Sanitization, truncation |
| **HttpUtils.gs** | HTTP Utilities | JSON responses, error handling |

### Design Principles

✅ **Single Responsibility** - Each module has one clear purpose
✅ **Loose Coupling** - Minimal dependencies between modules
✅ **High Cohesion** - Related functions grouped together
✅ **Easy to Test** - Functions can be tested independently
✅ **Apps Script Compatible** - Works with global namespace

## Setup Instructions

### 1. Create a New Apps Script Project

1. Go to [script.google.com](https://script.google.com)
2. Click **New Project**
3. Name it: "Wedding RSVP Webhook"

### 2. Add All Script Files

Copy each `.gs` file from this directory to your Apps Script project **in this order**:

1. `Config.gs` - Must be first (defines constants)
2. `StringUtils.gs`
3. `PhoneUtils.gs`
4. `HttpUtils.gs`
5. `OutboxLogger.gs`
6. `SheetOperations.gs`
7. `Validation.gs`
8. `SmsService.gs`
9. `ConfirmationService.gs`
10. `ReminderService.gs`
11. `HttpHandlers.gs` - Must be last (defines doPost/doGet)

**Important:** Delete the default `Code.gs` file that Apps Script creates.

### 3. Configure Settings

#### Update Spreadsheet ID

In `Config.gs`, update the `SPREADSHEET_ID`:

```javascript
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
```

To find your spreadsheet ID:
- Open your Google Sheet
- Copy the ID from the URL: `https://docs.google.com/spreadsheets/d/[THIS_IS_THE_ID]/edit`

#### Set Script Properties

Go to **Project Settings** > **Script Properties** and add:

| Property | Value | Description |
|----------|-------|-------------|
| `SMS_MODE` | `DRY_RUN` or `LIVE` | Set to `LIVE` to send real SMS |
| `TWILIO_ACCOUNT_SID` | Your Twilio SID | From Twilio console |
| `TWILIO_AUTH_TOKEN` | Your Twilio token | From Twilio console |
| `TWILIO_FROM_NUMBER` | Your Twilio phone | E.164 format: +61... |
| `RSVP_LINK` | Your RSVP URL | For reminder messages |
| `TWILIO_TEST_TO` | Your test phone | For testing SMS |

### 4. Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click **Select type** > **Web app**
3. Fill in settings:
   - **Description:** "RSVP Webhook v1"
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
4. Click **Deploy**
5. Copy the **Web app URL** - this is your webhook endpoint

### 5. Update Frontend

Update your React app's `RSVP_ENDPOINT` to use the deployed URL:

```typescript
const RSVP_ENDPOINT = 'YOUR_DEPLOYED_WEB_APP_URL';
```

## Usage

### Processing RSVP Submissions

The webhook automatically:
1. Validates the payload
2. Checks for spam (honeypot)
3. Finds duplicates by phone number
4. Updates or creates spreadsheet row
5. Sends confirmation SMS

### Sending Reminder SMS

Reminders follow **strict cooldown rules** to prevent spam.

#### Cooldown Rules (Strictly Enforced)

| State | Reminder Count | Can Send? | Cooldown Requirement |
|-------|----------------|-----------|---------------------|
| **NONE** | 0 | ✅ Yes, anytime | No cooldown |
| **FIRST_SENT** | 1 | ⏳ Only after cooldown | Must wait **10 full days** |
| **SECOND_SENT** | 2 | ⏳ Only after cooldown | Must wait **8 full days** |
| **FINAL_SENT** | 3 | ❌ Never | No more reminders allowed |

**Example Timeline:**
- **Day 1**: Send reminder #1 → Guest state becomes FIRST_SENT
- **Days 2-10**: If you run `sendReminders()` → **"DO NOT SEND — cooldown not satisfied"**
- **Day 11+**: Send reminder #2 → Guest state becomes SECOND_SENT
- **Days 12-18**: If you run `sendReminders()` → **"DO NOT SEND — cooldown not satisfied"**
- **Day 19+**: Send reminder #3 → Guest state becomes FINAL_SENT
- **Forever after**: No more reminders allowed

#### Manual Execution

Run `sendReminders()` manually when you want to send reminders:

1. In Apps Script, select `sendReminders` from the function dropdown
2. Click **Run**
3. Check execution logs to see results

**How it works:**
- Finds all eligible guests (no response, has phone, not opted out, < 3 reminders)
- Groups by Reminder Count and targets the **lowest count** first
- For each guest, checks cooldown rules:
  - If cooldown satisfied → Sends reminder
  - If cooldown NOT satisfied → Skips with reason logged
- Updates "Reminder Count" and "Last Reminder At" after sending

#### Other Functions

- **`sendRemindersManual()`** - Bypass ALL cooldown checks (⚠️ use with extreme caution!)
- **`testSendSmsToMe()`** - Send test SMS to configured number

### Testing

1. **Health Check:** Visit your web app URL in browser - should return `{"ok":true,"message":"RSVP webhook is running"}`
2. **SMS Test:** Run `testSendSmsToMe()` - sends test SMS to `TWILIO_TEST_TO`
3. **Dry Run:** Keep `SMS_MODE=DRY_RUN` until ready for production

## Spreadsheet Structure

### Main Sheet (Sheet1)

The script auto-creates these columns:

| Column | Type | Description |
|--------|------|-------------|
| Timestamp | Date | First submission time |
| Updated At | Date | Last update time |
| Source | Text | "WEBSITE" |
| Household Name | Text | Optional household name |
| First Name | Text | Required |
| Last Name | Text | Optional |
| Phone | Text | Original phone format |
| Phone E164 | Text | Normalized E.164 format |
| Email | Text | Optional |
| Language | Text | EN or VI |
| Attendance | Text | YES or NO |
| Party Size | Number | Number of guests |
| Other Guest Names | Text | Names of additional guests |
| Notes | Text | Special requests |
| Invite Side | Text | Bride/Groom (manual) |
| Priority | Text | NORMAL (default) |
| Last Reminder At | Date | Last reminder sent |
| Reminder Count | Number | Number of reminders sent |
| SMS Opt Out | Boolean | If true, no SMS sent |
| Confirmation Sent At | Date | Confirmation timestamp |

### OUTBOX Sheet

Auto-created for SMS audit trail:

| Column | Description |
|--------|-------------|
| Timestamp | When SMS was sent |
| Type | REMINDER, CONFIRMATION, TEST |
| To | Recipient phone number |
| Body | Full message text |
| Status | SENT, FAILED, DRY_RUN |
| Error | Error message if failed |
| TwilioSid | Twilio message SID |

## Advanced Configuration

### Cooldown Periods

Cooldown periods are configured in `Config.gs`:

```javascript
const REMINDER_COOLDOWN_AFTER_FIRST = 10;  // Wait 10 days after reminder #1
const REMINDER_COOLDOWN_AFTER_SECOND = 8;   // Wait 8 days after reminder #2
```

To change cooldown periods, edit these values in `Config.gs`.

### Customize Message Templates

Edit templates in `Config.gs`:

- `REMINDER_TEMPLATES` - Reminder message functions
- `CONFIRMATION_TEMPLATES` - Confirmation message functions
- `CONFIRMATION_DETAIL_LABELS` - Detail labels for summaries

## Troubleshooting

### SMS Not Sending

1. Check `SMS_MODE` is set to `LIVE`
2. Verify Twilio credentials in Script Properties
3. Check OUTBOX sheet for error messages
4. Verify phone numbers are in E.164 format (+61...)

### Duplicate Entries

The system prevents duplicates by E.164 phone number. If you're seeing duplicates:
- Check that phone numbers are being normalized correctly
- Review `PhoneUtils.gs` logic for your country code

### Webhook Not Responding

1. Verify deployment settings: "Execute as: Me" and "Who has access: Anyone"
2. Check execution logs: **Executions** tab in Apps Script
3. Test with browser GET request to verify it's running

### Permission Errors

Grant the script permission to:
- Access Google Sheets
- Make external HTTP requests (Twilio)
- Access script properties

## Maintenance

### Updating the Code

1. Make changes in Apps Script editor
2. Click **Deploy** > **Manage deployments**
3. Click pencil icon on active deployment
4. Update version description
5. Click **Deploy**

The web app URL remains the same, so no frontend changes needed.

### Monitoring

- Review **OUTBOX** sheet regularly for failed SMS
- Check **Executions** tab for runtime errors
- Monitor Twilio console for delivery issues

## Security Considerations

- ✅ Honeypot field prevents spam
- ✅ Script lock prevents concurrent writes
- ✅ E.164 validation prevents invalid phones
- ✅ SMS opt-out respected
- ✅ CORS headers configured
- ⚠️ No rate limiting (consider adding if needed)
- ⚠️ Webhook is public (use honeypot + validation)

## License

This code is part of a wedding invitation project. Feel free to adapt for your own use.

## Support

For issues with:
- **Apps Script:** Check [Apps Script documentation](https://developers.google.com/apps-script)
- **Twilio:** Check [Twilio SMS documentation](https://www.twilio.com/docs/sms)
- **This code:** Review execution logs and OUTBOX sheet for debugging

## Migration from Original rsvp.gs

If you're migrating from the original monolithic `rsvp.gs`:

1. Back up your existing script
2. Copy all script properties (they're preserved)
3. Deploy this refactored version as a new deployment
4. Test thoroughly in DRY_RUN mode
5. Update frontend to new webhook URL
6. Switch to LIVE mode
7. Delete old deployment

All functionality is preserved - this is purely a refactor for maintainability.
