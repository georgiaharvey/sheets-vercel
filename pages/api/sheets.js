import { getSheetsData } from "../../lib/sheetsClient.js";

export default async function handler(req, res) {
  try {
    const data = await getSheetsData();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
