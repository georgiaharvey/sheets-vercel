import { google } from "googleapis";

export async function getSheetsData() {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  );

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.SHEET_ID;

  const metadata = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetTitles = metadata.data.sheets.map(s => s.properties.title);

  const data = {};
  for (const title of sheetTitles) {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${title}!A1:Z1000`,
    });
    data[title] = result.data.values || [];
  }

  return data;
}
