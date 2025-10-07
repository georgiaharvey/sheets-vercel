// pages/index.js
import { useEffect, useState } from "react";
import axios from "axios";
import { parseAll } from "../lib/parseSheets";
import dynamic from "next/dynamic";

// Recharts components imported client-side only
const Charts = dynamic(() => import("../src/Charts"), { ssr: false });

export default function Home() {
  const [rawSheets, setRawSheets] = useState(null);
  const [structured, setStructured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // <-- 1. ADD a state for errors

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await axios.get("/api/sheets");
        setRawSheets(res.data);
        const parsed = parseAll(res.data || {});
        setStructured(parsed);
      } catch (err) {
        console.error(err); // Keep this for debugging
        setError("Failed to load data from the spreadsheet."); // <-- 2. SET the error message
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // --- Render logic ---
  if (loading) {
    return <div>Loading spreadsheet data…</div>;
  }

  if (error) {
    return <div>Error: {error}</div>; // <-- 3. DISPLAY the error if it exists
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>FOH Reporting Dashboard</h1>
      <p>Data from your Google Sheet.</p>

      {structured ? (
        <div style={{ marginTop: 24 }}>
          <Charts structured={structured} />
        </div>
      ) : (
        <div>No data parsed.</div>
      )}
    </div>
  );
}
