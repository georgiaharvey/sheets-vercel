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
