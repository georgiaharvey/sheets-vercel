// src/Charts.js
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, Brush } from 'recharts';

// A helper to format numbers as dollars
const dollarFormatter = (value) => `$${new Intl.NumberFormat('en').format(Math.round(value))}`;

export default function Charts({ chartData }) {
  const { biweeklyCashierSales, biweeklyTableSales, aggregatedPromoters } = chartData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* Chart 1: Biweekly Cashier Sales */}
      <section>
        <h2>Cashier Sales (Biweekly)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={biweeklyCashierSales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" height={60} angle={-30} textAnchor="end" />
            <YAxis tickFormatter={dollarFormatter} />
            <Tooltip formatter={dollarFormatter} />
            <Legend />
            <Line type="monotone" dataKey="totalSales" name="Total Sales" stroke="#8884d8" />
            <Brush dataKey="period" height={30} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Chart 2: Biweekly Gross Table Sales */}
      <section>
        <h2>Gross Table Sales (Biweekly)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={biweeklyTableSales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis tickFormatter={dollarFormatter} />
            <Tooltip formatter={dollarFormatter} />
            <Legend />
            <Bar dataKey="grossSales" name="Gross Sales" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Chart 3: Top 10 Promoters */}
      <section>
        <h2>Top 10 Free Cover Promoters</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={aggregatedPromoters} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="guests" name="Total Guests" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </section>

    </div>
  );
}
