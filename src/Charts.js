import React, 'useState'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

// A custom tooltip component for a nicer, consistent look
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg p-3 shadow-lg text-sm">
        <p className="text-purple-300 font-semibold mb-1">{label}</p>
        {payload.map((pld, index) => (
          <div key={index} className="flex justify-between items-center" style={{ color: pld.stroke || pld.fill }}>
            <span>{pld.name}:</span>
            <span className="font-bold ml-4">{formatter ? formatter(pld.value) : pld.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}


const FOHDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')

  // --- DATA (UNCHANGED) ---
  const guestCountData = [ { name: 'Navid', count: 124, appearances: 7 }, { name: 'Parker', count: 67, appearances: 7 }, { name: 'DJ/Guest List', count: 64, appearances: 8 }, { name: 'Rodrigo', count: 48, appearances: 4 }, { name: 'Free Girls/Girls', count: 33, appearances: 2 }, { name: 'Andres', count: 24, appearances: 5 }, { name: 'Warren', count: 18, appearances: 6 }, { name: 'Navid\'s Brother', count: 14, appearances: 1 }, { name: 'Chihuahua', count: 12, appearances: 4 }, { name: 'Georgia', count: 10, appearances: 3 }, ];
  const cashierData = [ { date: '8/23', totalSales: 5894.42, cardTrans: 5067.60, cashTrans: 826.82 }, { date: '8/22', totalSales: 3955.30, cardTrans: 3115.32, cashTrans: 839.98 }, { date: '8/21', totalSales: 816.31, cardTrans: 606.30, cashTrans: 210.01 }, { date: '8/16', totalSales: 7094.29, cardTrans: 6779.30, cashTrans: 314.99 }, { date: '8/15', totalSales: 5849.57, cardTrans: 5167.12, cashTrans: 682.45 }, { date: '8/14', totalSales: 1427.60, cardTrans: 1309.49, cashTrans: 118.11 }, { date: '8/9', totalSales: 3507.91, cardTrans: 3206.04, cashTrans: 301.87 }, { date: '8/8', totalSales: 5198.80, cardTrans: 4700.07, cashTrans: 498.73 }, { date: '8/7', totalSales: 2042.51, cardTrans: 1845.65, cashTrans: 196.86 }, { date: '8/2', totalSales: 5351.91, cardTrans: 5260.04, cashTrans: 91.87 }, { date: '8/1', totalSales: 3486.28, cardTrans: 3446.91, cashTrans: 39.37 }, { date: '7/31', totalSales: 1006.58, cardTrans: 849.58, cashTrans: 157.00 }, { date: '7/27', totalSales: 680.00, cardTrans: 672.62, cashTrans: 90.00 }, { date: '7/26', totalSales: 3815.68, cardTrans: 3474.48, cashTrans: 341.20 }, ];
  const biweeklyData = [ { period: '8/17 - 8/30', totalSales: 17760.32, avgPerNight: 5920.11 }, { period: '8/3 - 8/16', totalSales: 24213.37, avgPerNight: 4842.67 }, { period: '7/20 - 8/2', totalSales: 13340.45, avgPerNight: 3335.11 }, ];
  const tableData = [ { date: '8/23', sales: 19487.98, day: 'Saturday' }, { date: '8/22', sales: 15252.94, day: 'Friday' }, { date: '8/21', sales: 11592.44, day: 'Thursday' }, { date: '8/16', sales: 21217.16, day: 'Saturday' }, { date: '8/15', sales: 18999.77, day: 'Friday' }, { date: '8/14', sales: 2563.13, day: 'Thursday' }, { date: '8/9', sales: 19743.52, day: 'Saturday' }, { date: '8/8', sales: 10314.41, day: 'Friday' }, { date: '8/7', sales: 2938.61, day: 'Thursday' }, { date: '8/2', sales: 15446.99, day: 'Saturday' }, { date: '8/1', sales: 10751.00, day: 'Friday' }, { date: '7/31', sales: 1828.59, day: 'Thursday' }, { date: '7/26', sales: 21163.78, day: 'Saturday' }, ];
  const biweeklyTableData = [ { period: '8/17 - 8/30', totalSales: 66550.53, avgPerNight: 22183.51 }, { period: '8/3 - 8/16', totalSales: 69261.50, avgPerNight: 11543.58 }, { period: '7/20 - 8/2', totalSales: 49190.36, avgPerNight: 12297.59 }, ];
  
  // --- HELPERS (UNCHANGED) ---
  const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  const formatCurrencyDetailed = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'];
  const TABS = [ { id: 'overview', label: 'Overview' }, { id: 'guests', label: 'Guests' }, { id: 'cashier', label: 'Cashier' }, { id: 'tables', label: 'Tables' } ];

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-8 text-slate-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">FOH Reporting Dashboard</h1>
            <p className="text-purple-300">
              {activeTab === 'guests' && 'August 7 - August 23, 2024'}
              {activeTab === 'cashier' && 'June 19 - August 23, 2024'}
              {activeTab === 'tables' && 'July 26 - August 23, 2024'}
            </p>
          </div>
          <div className="text-6xl font-serif text-yellow-400 tracking-wider mt-4 sm:mt-0" style={{ fontFamily: 'Georgia, serif' }}>
            LUNA
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-slate-800">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-semibold transition-all duration-300 border-b-2 ${
                activeTab === tab.id
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-t-lg'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl transition-all duration-300 hover:border-purple-500/80">
                <h3 className="text-xl font-bold text-white mb-4">Free Cover Guest Count</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={guestCountData.slice(0, 5)} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                     <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.5} />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
                    <Bar dataKey="count" name="Guests" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl transition-all duration-300 hover:border-blue-500/80">
                <h3 className="text-xl font-bold text-white mb-4">Cashier Sales Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={cashierData.slice(0, 9).reverse()} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.5}/>
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${(value/1000)}k`} fontSize={12} />
                    <Tooltip content={<CustomTooltip formatter={formatCurrencyDetailed} />} />
                    <Area type="monotone" dataKey="totalSales" name="Total Sales" stroke="#3b82f6" strokeWidth={2} fill="url(#areaGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'guests' && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Free Cover Guest Analysis</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
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
                      <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 text-slate-400 font-mono">{index + 1}</td>
                        <td className="py-3 px-4 text-white font-medium">{item.name}</td>
                        <td className="py-3 px-4 text-right text-white font-bold font-mono">{item.count}</td>
                        <td className="py-3 px-4 text-right text-slate-400 font-mono">{item.appearances}</td>
                        <td className="py-3 px-4 text-right text-slate-400 font-mono">{(item.count / item.appearances).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'cashier' && (
             <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Daily Sales Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
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
                      <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 text-white font-medium">{item.date}</td>
                        <td className="py-3 px-4 text-right text-white font-bold font-mono">{formatCurrencyDetailed(item.totalSales)}</td>
                        <td className="py-3 px-4 text-right text-green-400 font-mono">{formatCurrencyDetailed(item.cardTrans)}</td>
                        <td className="py-3 px-4 text-right text-orange-400 font-mono">{formatCurrencyDetailed(item.cashTrans)}</td>
                        <td className="py-3 px-4 text-right text-slate-400 font-mono">{((item.cashTrans / item.totalSales) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Daily Table Sales Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
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
                      <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 text-white font-medium">{item.date}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.day === 'Saturday' ? 'bg-pink-500/20 text-pink-300' :
                            item.day === 'Friday' ? 'bg-purple-500/20 text-purple-300' :
                            'bg-blue-500/20 text-blue-300'
                          }`}>
                            {item.day}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-white font-bold font-mono">{formatCurrencyDetailed(item.sales)}</td>
                        <td className="py-3 px-4 text-right text-slate-400 font-mono">{((item.sales / 169302.18) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-700 bg-slate-800/50">
                      <td colSpan="2" className="py-3 px-4 text-white font-bold">TOTAL</td>
                      <td className="py-3 px-4 text-right text-white font-bold font-mono">{formatCurrencyDetailed(169302.18)}</td>
                      <td className="py-3 px-4 text-right text-white font-bold font-mono">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FOHDashboard;
