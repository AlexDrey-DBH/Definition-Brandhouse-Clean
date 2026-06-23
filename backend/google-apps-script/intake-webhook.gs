const SPREADSHEET_ID = "108Yg4ktsaCSKPhD_wwQB66d7dWtHt4T5T07f1iOtMwE";
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
    const writeResult = appendLeadRow_(payload);
    sendLeadNotification_(payload, writeResult);

    return jsonResponse_({
      ok: true,
      message: "Intake received",
      sheetUrl: writeResult.sheetUrl,
      sheetName: writeResult.sheetName,
      rowNumber: writeResult.rowNumber,
    });
  } catch (error) {
    console.error(error);
    sendErrorNotification_(error);
    return jsonResponse_({
      ok: false,
      message: error.message,
    });
  }
}

function doGet() {
  const sheet = getLeadSheet_();

  return jsonResponse_({
    ok: true,
    service: "Definition Brandhouse intake backend",
    sheetUrl: getSheetUrl_(sheet),
    sheetName: sheet.getName(),
    lastRow: sheet.getLastRow(),
  });
}

function getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getLeadSheet_() {
  const spreadsheet = getSpreadsheet_();
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

function appendLeadRow_(payload) {
  const sheet = getLeadSheet_();
  sheet.appendRow(buildLeadRow_(payload));
  SpreadsheetApp.flush();

  return {
    sheetName: sheet.getName(),
    sheetUrl: getSheetUrl_(sheet),
    rowNumber: sheet.getLastRow(),
  };
}

function getSheetUrl_(sheet) {
  return `${getSpreadsheet_().getUrl()}#gid=${sheet.getSheetId()}`;
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

function sendLeadNotification_(payload, writeResult) {
  const subject = `Intake - ${value_(payload.name)}`;
  const body = [
    "A new Definition Brandhouse lead completed the intake form.",
    "",
    `Name: ${value_(payload.name)}`,
    `Email: ${value_(payload.email)}`,
    `Website or profile: ${value_(payload.website)}`,
    "",
    `Saved to tab: ${writeResult.sheetName}`,
    `Saved to row: ${writeResult.rowNumber}`,
    `Open the Google Sheet to review the full intake response: ${writeResult.sheetUrl}`,
  ].join("\n");

  MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
}

function sendErrorNotification_(error) {
  MailApp.sendEmail(
    NOTIFICATION_EMAIL,
    "Intake backend error",
    [
      "The Definition Brandhouse intake backend received a submission but could not finish processing it.",
      "",
      `Error: ${error.message}`,
      "",
      `Configured Sheet ID: ${SPREADSHEET_ID}`,
    ].join("\n"),
  );
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
