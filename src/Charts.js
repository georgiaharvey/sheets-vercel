// src/Charts.js
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

function parseMoney(s) {
  if (!s) return 0;
  try {
    return parseFloat(String(s).replace(/[^0-9.-]/g, "")) || 0;
  } catch { return 0; }
}

export default function Charts({ structured }) {
  const cashier = structured.cashierReporting || [];
  // build timeseries for Total Sales (or "Total Sales:" label)
  const timeseries = cashier.map(r => {
    const total = r["Total Sales"] || r["Total Sales:"] || r["Total Sales: "] || r["Total Sales:"] || r["Total Sales"] || r["Total Sales "];
    return { date: r.Date || r["Date"] || r["Date:"], total: parseMoney(total) };
  }).filter(d => d.date);

  const freeCoverKeys = Object.keys(structured.freeCover || {});
  // Build a simple pie data aggregated by promoter name (sum counts)
  const promoterCounts = {};
  for (const key of freeCoverKeys) {
    const sheet = structured.freeCover[key];
    if (!sheet || !sheet.items) continue;
    for (const item of sheet.items) {
      const name = item["Name"] || Object.values(item)[0] || "";
      const countRaw = item["Count of guests"] || item["Count"] || Object.values(item)[1] || "";
      const cnt = parseInt(String(countRaw).replace(/[^0-9]/g,"")) || 0;
      if (!name) continue;
      promoterCounts[name] = (promoterCounts[name] || 0) + cnt;
    }
  }
  const pieData = Object.entries(promoterCounts).slice(0,10).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <h3>Sales Over Time</h3>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={timeseries}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3 style={{ marginTop: 20 }}>Top Free Cover Promoters (sample)</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={pieData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3 style={{ marginTop: 20 }}>Promoter Distribution (pie)</h3>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} label>
              {pieData.map((entry, i) => <Cell key={`cell-${i}`} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
