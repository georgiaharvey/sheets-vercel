// lib/sheetsClient.js
import { google } from "googleapis";

export function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY || "";

  if (!clientEmail || !privateKey) {
    throw new Error("Missing Google service account credentials.");
  }

  privateKey = privateKey.replace(/\\n/g, "\n");

  const jwt = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  });

  const sheets = google.sheets({ version: "v4", auth: jwt });
  return { sheets, auth: jwt };
}
