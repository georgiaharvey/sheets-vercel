import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const FOHDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Guest Count Data
  const guestCountData = [
    { name: 'Navid', count: 124, appearances: 7 },
    { name: 'Parker', count: 67, appearances: 7 },
    { name: 'DJ/Guest List', count: 64, appearances: 8 },
    { name: 'Rodrigo', count: 48, appearances: 4 },
    { name: 'Free Girls/Girls', count: 33, appearances: 2 },
    { name: 'Andres', count: 24, appearances: 5 },
    { name: 'Warren', count: 18, appearances: 6 },
    { name: 'Navid\'s Brother', count: 14, appearances: 1 },
    { name: 'Chihuahua', count: 12, appearances: 4 },
    { name: 'Georgia', count: 10, appearances: 3 },
  ];

  // Cashier Sales Data
  const cashierData = [
    { date: '8/23', totalSales: 5894.42, cardTrans: 5067.60, cashTrans: 826.82 },
    { date: '8/22', totalSales: 3955.30, cardTrans: 3115.32, cashTrans: 839.98 },
    { date: '8/21', totalSales: 816.31, cardTrans: 606.30, cashTrans: 210.01 },
    { date: '8/16', totalSales: 7094.29, cardTrans: 6779.30, cashTrans: 314.99 },
    { date: '8/15', totalSales: 5849.57, cardTrans: 5167.12, cashTrans: 682.45 },
    { date: '8/14', totalSales: 1427.60, cardTrans: 1309.49, cashTrans: 118.11 },
    { date: '8/9', totalSales: 3507.91, cardTrans: 3206.04, cashTrans: 301.87 },
    { date: '8/8', totalSales: 5198.80, cardTrans: 4700.07, cashTrans: 498.73 },
    { date: '8/7', totalSales: 2042.51, cardTrans: 1845.65, cashTrans: 196.86 },
    { date: '8/2', totalSales: 5351.91, cardTrans: 5260.04, cashTrans: 91.87 },
    { date: '8/1', totalSales: 3486.28, cardTrans: 3446.91, cashTrans: 39.37 },
    { date: '7/31', totalSales: 1006.58, cardTrans: 849.58, cashTrans: 157.00 },
    { date: '7/27', totalSales: 680.00, cardTrans: 672.62, cashTrans: 90.00 },
    { date: '7/26', totalSales: 3815.68, cardTrans: 3474.48, cashTrans: 341.20 },
  ];

  // Biweekly Aggregation
  const biweeklyData = [
    { period: '8/17 - 8/30', totalSales: 17760.32, avgPerNight: 5920.11 },
    { period: '8/3 - 8/16', totalSales: 24213.37, avgPerNight: 4842.67 },
    { period: '7/20 - 8/2', totalSales: 13340.45, avgPerNight: 3335.11 },
  ];

  // Bottle Girl Table Sales Data
  const tableData = [
    { date: '8/23', sales: 19487.98, day: 'Saturday' },
    { date: '8/22', sales: 15252.94, day: 'Friday' },
    { date: '8/21', sales: 11592.44, day: 'Thursday' },
    { date: '8/16', sales: 21217.16, day: 'Saturday' },
    { date: '8/15', sales: 18999.77, day: 'Friday' },
    { date: '8/14', sales: 2563.13, day: 'Thursday' },
    { date: '8/9', sales: 19743.52, day: 'Saturday' },
    { date: '8/8', sales: 10314.41, day: 'Friday' },
    { date: '8/7', sales: 2938.61, day: 'Thursday' },
    { date: '8/2', sales: 15446.99, day: 'Saturday' },
    { date: '8/1', sales: 10751.00, day: 'Friday' },
    { date: '7/31', sales: 1828.59, day: 'Thursday' },
    { date: '7/26', sales: 21163.78, day: 'Saturday' },
  ];

  // Biweekly Table Sales
  const biweeklyTableData = [
    { period: '8/17 - 8/30', totalSales: 66550.53, avgPerNight: 22183.51 },
    { period: '8/3 - 8/16', totalSales: 69261.50, avgPerNight: 11543.58 },
    { period: '7/20 - 8/2', totalSales: 49190.36, avgPerNight: 12297.59 },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyDetailed = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Logo */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">FOH Reporting Dashboard</h1>
            <p className="text-purple-200">
              {activeTab === 'overview' && 'June 19 - August 23, 2024'}
              {activeTab === 'guests' && 'August 7 - August 23, 2024'}
              {activeTab === 'cashier' && 'June 19 - August 23, 2024'}
              {activeTab === 'tables' && 'July 26 - August 23, 2024'}
            </p>
          </div>
          <div className="text-6xl font-serif text-yellow-500 tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
            LUNA
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {['overview', 'guests', 'cashier', 'tables'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-xl">
                <div className="text-blue-100 text-sm font-medium mb-1">Free Cover Guests</div>
                <div className="text-4xl font-bold text-white">628</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-xl">
                <div className="text-purple-100 text-sm font-medium mb-1">Cashier Sales</div>
                <div className="text-4xl font-bold text-white">{formatCurrency(45294)}</div>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 shadow-xl">
                <div className="text-pink-100 text-sm font-medium mb-1">Table Sales</div>
                <div className="text-4xl font-bold text-white">{formatCurrency(169302)}</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 shadow-xl">
                <div className="text-orange-100 text-sm font-medium mb-1">Avg Table/Night</div>
                <div className="text-4xl font-bold text-white">{formatCurrency(13023)}</div>
              </div>
            </div>

            {/* Quick Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4">Top Guest Promoters</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={guestCountData.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" label={{ value: 'Guests', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4">Cashier Sales Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cashierData.slice(0, 9).reverse()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" label={{ value: 'Date', position: 'insideBottom', offset: -5, fill: '#9ca3af' }} />
                    <YAxis stroke="#9ca3af" tickFormatter={formatCurrency} label={{ value: 'Sales', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} formatter={(value) => formatCurrencyDetailed(value)} />
                    <Line type="monotone" dataKey="totalSales" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Guests Tab */}
        {activeTab === 'guests' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Free Cover Guest Count Analysis</h2>
              
              {/* Top 10 Chart */}
              <div className="mb-8">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={guestCountData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9ca3af" label={{ value: 'Total Guests', position: 'insideBottom', offset: -5, fill: '#9ca3af' }} />
                    <YAxis dataKey="name" type="category" stroke="#9ca3af" width={150} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                      formatter={(value, name, props) => [
                        `${value} guests (${props.payload.appearances} appearances)`,
                        'Total'
                      ]}
                    />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                      {guestCountData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-purple-300 font-semibold">Rank</th>
                      <th className="text-left py-3 px-4 text-purple-300 font-semibold">Name</th>
                      <th className="text-right py-3 px-4 text-purple-300 font-semibold">Total Guests</th>
                      <th className="text-right py-3 px-4 text-purple-300 font-semibold">Appearances</th>
                      <th className="text-right py-3 px-4 text-purple-300 font-semibold">Avg per Night</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guestCountData.map((item, index) => (
                      <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-4 text-slate-300">{index + 1}</td>
                        <td className="py-3 px-4 text-white font-medium">{item.name}</td>
                        <td className="py-3 px-4 text-right text-white font-bold">{item.count}</td>
                        <td className="py-3 px-4 text-right text-slate-300">{item.appearances}</td>
                        <td className="py-3 px-4 text-right text-slate-300">{(item.count / item.appearances).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Cashier Tab */}
        {activeTab === 'cashier' && (
          <div className="space-y-6">
            {/* Biweekly Summary */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Cashier Sales - Biweekly Summary</h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={biweeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="period" stroke="#9ca3af" label={{ value: 'Period', position: 'insideBottom', offset: -5, fill: '#9ca3af' }} />
                  <YAxis stroke="#9ca3af" tickFormatter={formatCurrency} label={{ value: 'Sales', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} formatter={(value) => formatCurrencyDetailed(value)} />
                  <Bar dataKey="totalSales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Sales Details */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Daily Sales Breakdown</h2>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={[...cashierData].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" label={{ value: 'Date', position: 'insideBottom', offset: -5, fill: '#9ca3af' }} />
                  <YAxis stroke="#9ca3af" tickFormatter={formatCurrency} label={{ value: 'Sales', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} formatter={(value) => formatCurrencyDetailed(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="totalSales" stroke="#3b82f6" strokeWidth={3} name="Total Sales" />
                  <Line type="monotone" dataKey="cardTrans" stroke="#10b981" strokeWidth={2} name="Card" />
                  <Line type="monotone" dataKey="cashTrans" stroke="#f59e0b" strokeWidth={2} name="Cash" />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-purple-300 font-semibold">Date</th>
                      <th className="text-right py-3 px-4 text-purple-300 font-semibold">Total Sales</th>
                      <th className="text-right py-3 px-4 text-purple-300 font-semibold">Card</th>
                      <th className="text-right py-3 px-4 text-purple-300 font-semibold">Cash</th>
                      <th className="text-right py-3 px-4 text-purple-300 font-semibold">Cash %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...cashierData].reverse().map((item, index) => (
                      <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-4 text-white font-medium">{item.date}</td>
                        <td className="py-3 px-4 text-right text-white font-bold">{formatCurrencyDetailed(item.totalSales)}</td>
                        <td className="py-3 px-4 text-right text-green-400">{formatCurrencyDetailed(item.cardTrans)}</td>
                        <td className="py-3 px-4 text-right text-orange-400">{formatCurrencyDetailed(item.cashTrans)}</td>
                        <td className="py-3 px-4 text-right text-slate-300">{((item.cashTrans / item.totalSales) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tables Tab */}
        {activeTab === 'tables' && (
          <div className="space-y-6">
            {/* Biweekly Summary */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Bottle Girl Table Sales - Biweekly Summary</h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={biweeklyTableData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="period" stroke="#9ca3af" label={{ value: 'Period', position: 'insideBottom', offset: -5, fill: '#9ca3af' }} />
                  <YAxis stroke="#9ca3af" tickFormatter={formatCurrency} label={{ value: 'Sales', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} formatter={(value) => formatCurrencyDetailed(value)} />
                  <Bar dataKey="totalSales" fill="#ec4899" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Table Sales */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Daily Table Sales Breakdown</h2>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={[...tableData].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" label={{ value: 'Date', position: 'insideBottom', offset: -5, fill: '#9ca3af' }} />
                  <YAxis stroke="#9ca3af" tickFormatter={formatCurrency} label={{ value: 'Sales', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} 
                    formatter={(value, name, props) => [formatCurrencyDetailed(value), props.payload.day]}
                  />
                  <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
                    {[...tableData].reverse().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.day === 'Saturday' ? '#ec4899' : entry.day === 'Friday' ? '#8b5cf6' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-purple-300 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 text-purple-300 font-semibold">Day</th>
                      <th className="text-right py-3 px-4 text-purple-300 font-semibold">Table Sales</th>
                      <th className="text-right py-3 px-4 text-purple-300 font-semibold">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...tableData].reverse().map((item, index) => (
                      <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-4 text-white font-medium">{item.date}</td>
                        <td className="py-3 px-4 text-slate-300">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.day === 'Saturday' ? 'bg-pink-500/20 text-pink-300' :
                            item.day === 'Friday' ? 'bg-purple-500/20 text-purple-300' :
                            'bg-blue-500/20 text-blue-300'
                          }`}>
                            {item.day}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-white font-bold">{formatCurrencyDetailed(item.sales)}</td>
                        <td className="py-3 px-4 text-right text-slate-300">{((item.sales / 169302.18) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-600 bg-slate-700/50">
                      <td colSpan="2" className="py-3 px-4 text-white font-bold">TOTAL</td>
                      <td className="py-3 px-4 text-right text-white font-bold">{formatCurrencyDetailed(169302.18)}</td>
                      <td className="py-3 px-4 text-right text-white font-bold">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FOHDashboard;
