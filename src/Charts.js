// src/Charts.js
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

// A helper to format numbers as dollars
const dollarFormatter = (value) => `$${new Intl.NumberFormat('en').format(Math.round(value))}`;

export default function Charts({ chartData }) {
  const { monthlyCashierSales, monthlyTableSales, aggregatedPromoters } = chartData;

  // Calculate dynamic width for the scrollable chart
  const cashierChartWidth = Math.max(800, monthlyCashierSales.length * 80);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* Chart 1: Monthly Cashier Sales (Horizontally Scrollable) */}
      <section>
        <h2>Cashier Sales (Monthly)</h2>
        <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '20px' }}>
          <ResponsiveContainer width={cashierChartWidth} height={400}>
            <LineChart data={monthlyCashierSales} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={dollarFormatter} />
              <Tooltip formatter={dollarFormatter} />
              <Legend />
              <Line type="monotone" dataKey="totalSales" name="Total Sales" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Chart 2: Monthly Gross Table Sales */}
      <section>
        <h2>Gross Table Sales (Monthly)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyTableSales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={dollarFormatter} />
            <Tooltip formatter={dollarFormatter} />
            <Legend />
            <Bar dataKey="grossSales" name="Gross Sales" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Chart 3: All Promoters (Vertically Scrollable) */}
      <section>
        <h2>Free Cover Promoters (All)</h2>
        <div style={{ width: '100%', height: '500px', overflowY: 'scroll', border: '1px solid #eee', padding: '10px' }}>
            <ResponsiveContainer width="100%" height={aggregatedPromoters.length * 40}>
              <BarChart data={aggregatedPromoters} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="guests" name="Total Guests" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
        </div>
      </section>

    </div>
  );
}
