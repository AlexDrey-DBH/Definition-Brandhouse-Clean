const SPREADSHEET_ID = "PASTE_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "Intake Leads";
const NOTIFICATION_EMAIL = "hi@defbrandhouse.com";

const HEADERS = [
  "Submitted At",
  "Name",
  "Email",
  "Website",
  "LinkedIn / Social Profile",
  "What They Do",
  "Who They Serve",
  "What Makes The Work Different",
  "Active Marketing Channels",
  "Best Working Channels",
  "12-Month Goals",
  "Success",
  "Biggest Obstacle",
  "Referral Source",
];

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || "{}");
    const sheet = getLeadSheet_();
    sheet.appendRow(buildLeadRow_(payload));
    sendLeadNotification_(payload);

    return jsonResponse_({
      ok: true,
      message: "Intake received",
    });
  } catch (error) {
    console.error(error);
    return jsonResponse_({
      ok: false,
      message: error.message,
    });
  }
}

function getLeadSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function buildLeadRow_(payload) {
  return [
    value_(payload.submittedAt),
    value_(payload.name),
    value_(payload.email),
    value_(payload.website),
    value_(payload.socialProfile),
    value_(payload.whatYouDo),
    value_(payload.audience),
    value_(payload.difference),
    list_(payload.channels),
    value_(payload.workingChannels),
    list_(payload.goals),
    value_(payload.success),
    value_(payload.obstacle),
    value_(payload.referralSource),
  ];
}

function sendLeadNotification_(payload) {
  const subject = `Intake - ${value_(payload.name)}`;
  const sheetUrl = SpreadsheetApp.openById(SPREADSHEET_ID).getUrl();
  const body = [
    "A new Definition Brandhouse lead completed the intake form.",
    "",
    `Name: ${value_(payload.name)}`,
    `Email: ${value_(payload.email)}`,
    `Website or profile: ${value_(payload.website)}`,
    "",
    `Open the Google Sheet to review the full intake response: ${sheetUrl}`,
  ].join("\n");

  MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
}

function value_(value) {
  return value && String(value).trim() ? String(value).trim() : "";
}

function list_(values) {
  return Array.isArray(values) ? values.join(", ") : value_(values);
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
