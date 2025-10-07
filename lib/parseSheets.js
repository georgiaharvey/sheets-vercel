// lib/parseSheets.js

/**
 * Convert 2D array rows to objects using first row as headers
 */
export function rowsToObjects(rows) {
  if (!rows || rows.length === 0) return [];
  const headers = rows[0].map(h => (h === undefined ? "" : String(h).trim()));
  const out = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.every(c => c === "" || c === undefined)) continue;
    const obj = {};
    for (let c = 0; c < headers.length; c++) {
      const key = headers[c] || `col${c}`;
      obj[key] = row[c] === undefined ? "" : String(row[c]);
    }
    out.push(obj);
  }
  return out;
}

/**
 * Parse Cashier Reporting into array of { date, cashier, totalSales, card, cash, ... }
 */
export function parseCashierReporting(raw) {
  if (!raw || raw.length === 0) return [];
  const labels = raw.map(r => (r && r[0] ? String(r[0]).trim() : ""));
  const dateRowIndex = labels.findIndex(l => l.toLowerCase().includes("date"));
  if (dateRowIndex === -1) return [];

  const dateRow = raw[dateRowIndex];
  const output = [];
  for (let c = 1; c < dateRow.length; c++) {
    const date = String(dateRow[c] || "").trim();
    if (!date) continue;
    const rec = { Date: date };
    for (let r = 0; r < raw.length; r++) {
      const label = (raw[r][0] || "").toString().replace(/:$/,"").trim();
      if (!label) continue;
      rec[label] = raw[r][c] === undefined ? "" : raw[r][c];
    }
    output.push(rec);
  }
  return output;
}

/**
 * Collect all sheets whose name contains "Free Cover" into an object keyed by sheet name.
 */
export function parseFreeCoverSheets(rawSheets) {
  const out = {};
  for (const [name, rows] of Object.entries(rawSheets)) {
    if (name.toLowerCase().includes("free cover")) {
      const objs = rowsToObjects(rows);
      let total = null;
      for (let i = rows.length - 1; i >= 0; i--) {
        const joined = (rows[i] || []).join(" ");
        if (/total/i.test(joined) && /\d+/.test(joined)) {
          const match = joined.match(/(\d{1,5})/);
          if (match) { total = parseInt(match[1], 10); break; }
        }
      }
      out[name] = { rows, items: objs, total };
    }
  }
  return out;
}

/**
 * Parse BG Table Report sheet.
 */
export function parseBGTable(rawRows) {
  if (!rawRows || rawRows.length === 0) return { tables: [], totals: {}, raw: rawRows };
  const tables = [];
  for (let r = 2; r < rawRows.length; r++) {
    const row = rawRows[r];
    if (!row) continue;
    for (let c = 0; c < row.length; c++) {
      const cell = row[c];
      if (!cell) continue;
      if (/^\d+$/.test(String(cell).trim())) {
        const possibleCurrency = row[c+1];
        const possibleNote = row[c+2];
        if (possibleCurrency && /[\d,\.]+\$?/.test(String(possibleCurrency))) {
          const gross = parseFloat(String(possibleCurrency).replace(/[^0-9.-]/g,"")) || 0;
          tables.push({ table: cell, gross, notes: possibleNote || "" });
        }
      }
    }
  }

  let totals = {};
  for (let r = rawRows.length - 1; r >= 0; r--) {
    const joined = (rawRows[r] || []).join(" ");
    if (/total/i.test(joined) && /\d/.test(joined)) {
      const nums = joined.match(/[\d,]+\.\d{2}|[\d,]+/g) || [];
      if (nums.length) {
        totals.total = parseFloat(nums[0].replace(/,/g,""));
        break;
      }
    }
  }
  return { tables, totals, raw: rawRows };
}

// --- NEW FUNCTION TO FIX YOUR CHART DATA ---

/**
 * Aggregates promoter guest counts from all 'Free Cover' sheets.
 * @param {object} rawSheetsData - The raw data object from the Google Sheets API.
 * @returns {Array} An array of objects, e.g., [{ name: 'Navid', guests: 124 }].
 */
export function aggregatePromoterData(rawSheetsData) {
  const promoterTotals = {};

  // Find all sheets that contain "Free Cover" in their name
  const freeCoverSheetNames = Object.keys(rawSheetsData).filter(sheetName =>
    sheetName.toLowerCase().includes("free cover")
  );

  for (const sheetName of freeCoverSheetNames) {
    // Convert the rows of the current sheet to objects
    const sheetObjects = rowsToObjects(rawSheetsData[sheetName]);

    for (const row of sheetObjects) {
      // Assuming the columns are named "Name" and "Count of guests"
      const name = row["Name"] ? String(row["Name"]).trim() : "";
      const guests = parseInt(row["Count of guests"], 10);

      // Skip rows that are not valid, like "Total Count =" or empty rows
      if (name && !isNaN(guests) && !name.toLowerCase().includes("total")) {
        // Group similar names (e.g., different DJ names)
        let cleanName = name.replace(/\s*\(.*\)\s*/, "").trim(); // Remove text in parentheses
        if (cleanName.toLowerCase().includes("dj")) {
          cleanName = "DJ";
        }

        // Add to the running total
        promoterTotals[cleanName] = (promoterTotals[cleanName] || 0) + guests;
      }
    }
  }

  // Convert the totals object to an array for the charting library
  return Object.entries(promoterTotals)
    .map(([name, guests]) => ({ name, guests }))
    .sort((a, b) => b.guests - a.guests); // Sort from highest to lowest
}


/**
 * master parser: input rawSheets (name->rows) -> structured object
 */
export function parseAll(rawSheets) {
  return {
    cashierReporting: parseCashierReporting(rawSheets["Cashier Reporting"] || []),
    freeCover: parseFreeCoverSheets(rawSheets),
    bgTable: parseBGTable(rawSheets["BG Table Report"] || []),
    rawSheets
  };
}
