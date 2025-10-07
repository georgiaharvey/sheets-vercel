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
        const lowerCaseName = cleanName.toLowerCase();
        
        if (lowerCaseName.includes("dj") || lowerCaseName.includes("guest list")) {
          cleanName = "DJ/DJ Guest List";
        } else if (lowerCaseName.includes("girls")) {
          cleanName = "Free Girls/Girls";
        }
        
        promoterTotals[cleanName] = (promoterTotals[cleanName] || 0) + guests;
      }
    }
  }

  if (promoterTotals["Navid's Brother"]) {
    promoterTotals["Navid"] = (promoterTotals["Navid"] || 0) + promoterTotals["Navid's Brother"];
    delete promoterTotals["Navid's Brother"];
  }

  return Object.entries(promoterTotals)
    .map(([name, guests]) => ({ name, guests }))
    .sort((a, b) => b.guests - a.guests);
}

function aggregateCashierSalesMonthly(cashierData) {
  const monthlyTotals = {};
  const currentYear = new Date().getFullYear();
  for (const record of cashierData) {
    const salesString = record["Total Sales $"] || record["Total Sales"];
    if (!record.Date || !salesString) continue;
    
    const totalSales = parseFloat(String(salesString).replace(/[^0-9.-]/g, ""));
    const date = new Date(`${record.Date}/${currentYear}`);
    if (isNaN(totalSales) || isNaN(date.getTime())) continue;

    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthKey = monthStart.toISOString();
    
    monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + totalSales;
  }

  return Object.entries(monthlyTotals)
    .map(([monthKey, totalSales]) => ({
      month: new Date(monthKey).toLocaleString('default', { month: 'long', year: 'numeric' }),
      totalSales,
      startDate: new Date(monthKey),
    }))
    .sort((a, b) => a.startDate - b.startDate);
}

function aggregateBGTableSalesMonthly(rawRows) {
    if (!rawRows || rawRows.length === 0) return [];

    const monthlyTotals = {};
    const currentYear = new Date().getFullYear();
    const rowText = rawRows.flat().join(' ');

    const regex = /Table receipts from.*?\((\w+\s+\d+).*?=\s*\$([\d,]+\.\d{2})/g;
    let match;

    while ((match = regex.exec(rowText)) !== null) {
        const dateString = match[1];
        const salesAmount = parseFloat(match[2].replace(/,/g, ''));
        const date = new Date(`${dateString}, ${currentYear}`);

        if (!isNaN(salesAmount) && !isNaN(date.getTime())) {
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthKey = monthStart.toISOString();
            monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + salesAmount;
        }
    }

    return Object.entries(monthlyTotals)
        .map(([monthKey, grossSales]) => ({
            month: new Date(monthKey).toLocaleString('default', { month: 'long', year: 'numeric' }),
            grossSales,
            startDate: new Date(monthKey),
        }))
        .sort((a, b) => a.startDate - b.startDate);
}

export function parseAll(rawSheets) {
  const cashierData = parseCashierReporting(rawSheets["Cashier Reporting"] || []);
  return {
    monthlyCashierSales: aggregateCashierSalesMonthly(cashierData),
    monthlyTableSales: aggregateBGTableSalesMonthly(rawSheets["BG Table Report"] || []),
    aggregatedPromoters: aggregatePromoterData(rawSheets),
  };
}
