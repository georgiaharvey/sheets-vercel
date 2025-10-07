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
 * Your Cashier sheet has header-like first column with labels and subsequent columns are dates;
 * We pivot it into rows by date.
 */
export function parseCashierReporting(raw) {
  if (!raw || raw.length === 0) return [];
  // raw is rows; first cell of row indicates label like "Date:", "Cashier:", etc.
  // Build columns: column 0 = label, columns 1..N = dates / values
  const labels = raw.map(r => (r && r[0] ? String(r[0]).trim() : ""));
  // identify dates from first row (where label includes "Date")
  const dateRowIndex = labels.findIndex(l => l.toLowerCase().includes("date"));
  if (dateRowIndex === -1) return [];

  const dateRow = raw[dateRowIndex];
  const dates = dateRow.slice(1).map(d => d || "");

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
 * Each will be converted with rowsToObjects where header-like rows exist.
 */
export function parseFreeCoverSheets(rawSheets) {
  const out = {};
  for (const [name, rows] of Object.entries(rawSheets)) {
    if (name.toLowerCase().includes("free cover")) {
      // Some free cover sheets don't have headers; we'll still try rowsToObjects.
      const objs = rowsToObjects(rows);
      // also try to find a total by scanning last rows for "Total" or "Total Count"
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
 * Parse BG Table Report sheet:
 * We'll extract per-table gross and notes and the totals if found.
 */
export function parseBGTable(rawRows) {
  if (!rawRows || rawRows.length === 0) return { tables: [], totals: {}, raw: rawRows };

  // The sheet often has multiple blocks side-by-side. We'll scan for patterns: columns with "No" then "Gross" then "Notes".
  // We'll create a simple pass that scans each row and collects numeric currency-looking values and neighbor note strings.
  const tables = [];
  for (let r = 2; r < rawRows.length; r++) { // skip header rows
    const row = rawRows[r];
    if (!row) continue;
    for (let c = 0; c < row.length; c++) {
      const cell = row[c];
      if (!cell) continue;
      // if this cell looks like a table number and next cell is currency-like, record
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

  // Find totals row: look for any row containing "Total" and extract numbers
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
