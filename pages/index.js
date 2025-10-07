// pages/index.js
import { useEffect, useState } from "react";
import axios from "axios";
import { parseAll } from "../lib/parseSheets";
import dynamic from "next/dynamic";

const Charts = dynamic(() => import("../src/Charts"), { ssr: false });

export default function Home() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await axios.get("/api/sheets");
        const parsedData = parseAll(res.data);
        setChartData(parsedData);
      } catch (err) {
        console.error(err);
        setError("Failed to load or parse spreadsheet data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <div>Loading spreadsheet data…</div>;
    }
    if (error) {
      return <div>Error: {error}</div>;
    }
    if (chartData) {
      return <Charts chartData={chartData} />;
    }
    return <div>No data available.</div>;
  };

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>FOH Reporting Dashboard</h1>
      <p>Data from your Google Sheet.</p>
      <div style={{ marginTop: 32 }}>
        {renderContent()}
      </div>
    </div>
  );
}
