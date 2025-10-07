// pages/api/sheets.js
import { getSheetsClient } from "../../lib/sheetsClient";

export default async function handler(req, res) {
  try {
    const SHEET_ID = process.env.SHEET_ID;
    if (!SHEET_ID) return res.status(500).json({ error: "Missing SHEET_ID" });

    const { sheets, auth } = getSheetsClient();
    await auth.authorize();

    const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID, includeGridData: false });
    const sheetNames = (meta.data.sheets || []).map(s => s.properties.title);

    const rawSheets = {};
    for (const title of sheetNames) {
      const r = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: `'${title}'` });
      rawSheets[title] = r.data.values || [];
    }

    return res.status(200).json(rawSheets);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
