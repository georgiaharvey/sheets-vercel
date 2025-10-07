export default function Home() {
  return (
    <div style={{ 
      fontFamily: 'sans-serif', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh' 
    }}>
      <h1>Sheets API Test</h1>
      <p>Try visiting <a href="/api/sheets" style={{ color: 'blue' }}>this link</a> to call the API route.</p>
    </div>
  );
}
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
  const [prompt, setPrompt] = useState("");
  const [chatResponse, setChatResponse] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await axios.get("/api/sheets");
      setRawSheets(res.data);
      const parsed = parseAll(res.data || {});
      setStructured(parsed);
      setLoading(false);
    }
    load().catch(e => { console.error(e); setLoading(false); });
  }, []);

  async function sendChat() {
    if (!prompt) return;
    setChatLoading(true);
    // Create a short summary to send to LLM: only totals + top items to avoid sending everything.
    const summary = {
      cashierSummaryCount: structured?.cashierReporting?.length || 0,
      freeCoverSheets: Object.keys(structured?.freeCover || {}),
      bgTablesTotal: structured?.bgTable?.totals || {}
    };
    try {
      const r = await axios.post("/api/chat", { prompt, contextSummary: JSON.stringify(summary) });
      setChatResponse(r.data);
    } catch (err) {
      setChatResponse({ error: err?.response?.data || err.message });
    } finally { setChatLoading(false); }
  }

  return (
    <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1>FOH Reporting Dashboard</h1>
      <p>Data from your Google Sheet. Use the chat below to ask management questions.</p>

      {loading && <div>Loading spreadsheet data…</div>}

      {!loading && structured && (
        <>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ flex: 2, minWidth: 600 }}>
              <Charts structured={structured} />
            </div>

            <div style={{ flex: 1, minWidth: 320 }}>
              <h3>LLM Assistant</h3>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={6} style={{ width: "100%" }} />
              <button onClick={sendChat} disabled={chatLoading} style={{ marginTop: 8 }}>
                {chatLoading ? "Asking…" : "Ask"}
              </button>

              <div style={{ marginTop: 12 }}>
                <strong>Response:</strong>
                <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: 8 }}>
                  {chatResponse ? JSON.stringify(chatResponse, null, 2) : "No response yet"}
                </pre>
              </div>
            </div>
          </div>

          <hr style={{ margin: "24px 0" }} />

          <h3>Raw sheets included</h3>
          <ul>
            {Object.keys(rawSheets || {}).map(k => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </>
      )}

      {!loading && !structured && <div>No data parsed.</div>}
    </div>
  );
}
