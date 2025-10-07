// lib/parseSheets.js

// --- HELPER FUNCTIONS ---
function rowsToObjects(rows) {
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

function getBiweeklyPeriodStart(date) {
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekNum = Math.ceil((((weekStart - new Date(weekStart.getFullYear(), 0, 1)) / 86400000) + 1) / 7);
  if (weekNum % 2 === 0) {
    weekStart.setDate(weekStart.getDate() - 7);
  }
  return weekStart;
}

function formatBiweeklyPeriod(startDate) {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 13);
  const start = `${startDate.getMonth() + 1}/${startDate.getDate()}`;
  const end = `${endDate.getMonth() + 1}/${endDate.getDate()}`;
  return `${start} - ${end}`;
}

// --- PARSING & AGGREGATION FUNCTIONS ---
function parseCashierReporting(raw) {
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

function aggregatePromoterData(rawSheetsData) {
  const promoterTotals = {};
  const freeCoverSheetNames = Object.keys(rawSheetsData).filter(sheetName =>
    sheetName.toLowerCase().includes("free cover")
  );
  for (const sheetName of freeCoverSheetNames) {
    const sheetObjects = rowsToObjects(rawSheetsData[sheetName]);
    for (const row of sheetObjects) {
      const name = row["Name"] ? String(row["Name"]).trim() : "";
      const guests = parseInt(row["Count of guests"], 10);
      if (name && !isNaN(guests) && !name.toLowerCase().includes("total")) {
        let cleanName = name.replace(/\s*\(.*\)\s*/, "").trim();
        if (cleanName.toLowerCase().includes("dj")) cleanName = "DJ";
        if (cleanName.toLowerCase().includes("navid's brother")) cleanName = "Navid's Brother";
        promoterTotals[cleanName] = (promoterTotals[cleanName] || 0) + guests;
      }
    }
  }
  return Object.entries(promoterTotals)
    .map(([name, guests]) => ({ name, guests }))
    .sort((a, b) => b.guests - a.guests);
}

function aggregateCashierSalesBiweekly(cashierData) {
  const biweeklyTotals = {};
  const currentYear = new Date().getFullYear();
  for (const record of cashierData) {
    const salesString = record["Total Sales $"] || record["Total Sales"];
    if (!record.Date || !salesString) continue;
    const totalSales = parseFloat(String(salesString).replace(/[^0-9.-]/g, ""));
    const date = new Date(`${record.Date}/${currentYear}`);
    if (isNaN(totalSales) || isNaN(date.getTime())) continue;
    const periodStart = getBiweeklyPeriodStart(date);
    const periodKey = periodStart.toISOString();
    biweeklyTotals[periodKey] = (biweeklyTotals[periodKey] || 0) + totalSales;
  }
  return Object.entries(biweeklyTotals)
    .map(([periodKey, totalSales]) => ({
      period: formatBiweeklyPeriod(new Date(periodKey)),
      totalSales,
      startDate: new Date(periodKey),
    }))
    .sort((a, b) => a.startDate - b.startDate);
}

// --- REWRITTEN BG TABLE FUNCTION ---
function aggregateBGTableSalesBiweekly(rawRows) {
  if (!rawRows || rawRows.length < 2) return [];

  const biweeklyTotals = {};
  const dateHeaders = rawRows[0];
  const dataRows = rawRows.slice(1);
  const currentYear = new Date().getFullYear();
  const monthRegex = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})/;

  // Iterate through each COLUMN
  for (let c = 0; c < dateHeaders.length; c++) {
    const headerText = dateHeaders[c];
    if (!headerText) continue;

    const dateMatch = headerText.match(monthRegex);
    if (!dateMatch) continue;
    
    const dateForColumn = new Date(`${dateMatch[1]} ${dateMatch[2]}, ${currentYear}`);
    if (isNaN(dateForColumn.getTime())) continue;

    let totalGrossForColumn = 0;
    
    // Now iterate down the rows for this specific column
    for (const row of dataRows) {
      const cell = row[c];
      if (cell && typeof cell === 'string' && (cell.includes('$') || !isNaN(parseFloat(cell)))) {
        const gross = parseFloat(String(cell).replace(/[^0-9.-]/g, ""));
        if (!isNaN(gross)) {
          totalGrossForColumn += gross;
        }
      }
    }
    
    if (totalGrossForColumn > 0) {
        const periodStart = getBiweeklyPeriodStart(dateForColumn);
        const periodKey = periodStart.toISOString();
        biweeklyTotals[periodKey] = (biweeklyTotals[periodKey] || 0) + totalGrossForColumn;
    }
  }

  return Object.entries(biweeklyTotals)
    .map(([periodKey, grossSales]) => ({
      period: formatBiweeklyPeriod(new Date(periodKey)),
      grossSales,
      startDate: new Date(periodKey),
    }))
    .sort((a, b) => a.startDate - b.startDate);
}


// --- MASTER PARSER ---
export function parseAll(rawSheets) {
  const cashierData = parseCashierReporting(rawSheets["Cashier Reporting"] || []);
  return {
    biweeklyCashierSales: aggregateCashierSalesBiweekly(cashierData),
    biweeklyTableSales: aggregateBGTableSalesBiweekly(rawSheets["BG Table Report"] || []),
    aggregatedPromoters: aggregatePromoterData(rawSheets),
  };
}
