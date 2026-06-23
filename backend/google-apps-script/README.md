# Intake Form Google Apps Script Backend

This backend receives Definition Brandhouse intake form submissions, writes them to a Google Sheet, and sends a notification email to `hi@defbrandhouse.com`.

## Setup

1. Create a Google Sheet for intake leads.
2. In the Sheet, go to **Extensions > Apps Script**.
3. Copy the Google Sheet ID from the Sheet URL.
   - Example URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Copy only the part between `/d/` and `/edit`.
4. Paste the contents of `intake-webhook.gs` into the Apps Script editor.
5. Replace:

```js
const SPREADSHEET_ID = "PASTE_GOOGLE_SHEET_ID_HERE";
```

with your actual Sheet ID.

6. Save the project.
7. Click **Deploy > New deployment**.
8. Choose **Web app**.
9. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
10. Deploy and authorize the script.
11. Copy the Web App URL.
12. In `assets/js/main-homepage.js`, replace:

```js
const intakeBackendUrl = "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
```

with the deployed Web App URL.

## Notes

- The frontend uses a `no-cors` POST because this is a static GitHub Pages site and Google Apps Script does not provide normal custom CORS headers.
- The form will still open a prefilled email draft if the Apps Script URL has not been configured yet.
- The notification email subject is `Intake - [Name]`.
