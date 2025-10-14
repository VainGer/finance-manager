import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import LoadingSpinner from "../../common/LoadingSpinner";
import ErrorMessage from "../../common/ErrorMessage";
import useExpensesCharts from '../../../hooks/expenses/useExpensesCharts';
import { useState } from 'react';

export default function InteractiveCharts() {
  const {
    loading,
    error,
    chartData,
    monthlyChartData,
    dateFilter,
    setDateFilter,
    selectedMonth,
    setSelectedMonth,
    availableMonths
  } = useExpensesCharts();

  const [chartType, setChartType] = useState('pie');

  // screen sizes
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const isTablet = typeof window !== 'undefined' ? (window.innerWidth >= 768 && window.innerWidth < 1024) : false;
  const chartHeight = isMobile ? 350 : (isTablet ? 400 : 500);

  const renderChart = () => {
    // Pie chart
    if (chartType === 'pie') {
      if (!chartData.length) {
        return (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <div className="text-center p-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <div className="text-4xl">📊</div>
              </div>
              <div className="text-xl font-semibold text-gray-700 mb-2">אין נתונים להצגה</div>
              <div className="text-gray-500 text-sm">הוסף הוצאות כדי לראות גרפים אינטראקטיביים</div>
            </div>
          </div>
        );
      }

      return (
        <div className="w-full" style={{ height: chartHeight }}>
          <div className="text-center mb-2 lg:mb-4">
            <h3 className="text-base lg:text-xl font-bold text-gray-800 mb-1">התפלגות הוצאות לפי קטגוריה</h3>
            <p className="text-xs lg:text-sm text-gray-600">
              סה״כ קטגוריות: {chartData.length}
            </p>
          </div>
          <ResponsiveContainer width="100%" height={isMobile ? "85%" : "90%"}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={isMobile ? 30 : (isTablet ? 50 : 70)}
                outerRadius={isMobile ? 80 : (isTablet ? 110 : 140)}
                paddingAngle={2}
                dataKey="population"
                animationBegin={0}
                animationDuration={1000}
              >
                {chartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} stroke="white" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, name, props) => [`₪${v.toLocaleString()}`, props.payload.name]}
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.98)',
                  border: 'none', borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  direction: 'rtl',
                  fontSize: isMobile ? '11px' : (isTablet ? '12px' : '14px'),
                  padding: isMobile ? '6px' : '8px'
                }}
                wrapperStyle={{ outline: 'none' }}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
              />
              <Legend
                wrapperStyle={{
                  direction: 'rtl',
                  fontSize: isMobile ? '10px' : (isTablet ? '12px' : '14px'),
                  paddingTop: isMobile ? '8px' : '12px'
                }}
                layout={isMobile ? 'vertical' : 'horizontal'}
                verticalAlign={isMobile ? 'middle' : 'bottom'}
                align={isMobile ? 'left' : 'center'}
                iconSize={isMobile ? 8 : 12}
                itemStyle={{
                  marginRight: isMobile ? '4px' : '8px',
                  marginBottom: isMobile ? '2px' : '4px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // Monthly trends
    if (chartType === 'monthly') {
      if (!monthlyChartData.length) {
        return (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <div className="text-center p-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                <div className="text-4xl">📈</div>
              </div>
              <div className="text-xl font-semibold text-gray-700 mb-2">אין נתונים להצגה</div>
              <div className="text-gray-500 text-sm">הוסף הוצאות כדי לראות השוואה חודשית</div>
            </div>
          </div>
        );
      }

      return (
        <div className="w-full" style={{ height: chartHeight }}>
          <div className="text-center mb-2 lg:mb-4">
            <h3 className="text-base lg:text-xl font-bold text-gray-800 mb-1">השוואת הוצאות חודשית</h3>
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={monthlyChartData}
              margin={{
                top: 20,
                right: isMobile ? 5 : (isTablet ? 15 : 30),
                left: isMobile ? 5 : (isTablet ? 10 : 20),
                bottom: isMobile ? 80 : (isTablet ? 70 : 60)
              }}
            >
              <defs>
                <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                angle={isMobile ? -90 : (isTablet ? -60 : -45)}
                textAnchor="end"
                height={isMobile ? 80 : (isTablet ? 70 : 60)}
                fontSize={isMobile ? 8 : (isTablet ? 10 : 12)}
                stroke="#666"
                tick={{ fill: '#666' }}
                interval={0}
              />
              <YAxis
                tickFormatter={(v) => `₪${(v / 1000).toFixed(0)}K`}
                fontSize={isMobile ? 8 : (isTablet ? 10 : 12)}
                stroke="#666"
                tick={{ fill: '#666' }}
                width={isMobile ? 40 : 60}
              />
              <Tooltip
                formatter={(v) => [`₪${v.toLocaleString()}`, 'סכום']}
                labelFormatter={(label) => `חודש: ${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.98)',
                  border: 'none', borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  direction: 'rtl',
                  fontSize: isMobile ? '11px' : (isTablet ? '12px' : '14px'),
                  padding: isMobile ? '6px' : '8px'
                }}
              />
              <Bar
                dataKey="amount"
                fill="url(#monthlyGradient)"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
                animationBegin={0}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-6">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden relative" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-cyan-700 to-blue-700 p-5 text-white relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-white/30 to-white/10 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white drop-shadow-sm">📊 גרפים אינטראקטיביים</h2>
            <p className="text-white/80 text-sm">ניתוח חזותי מתקדם של ההוצאות שלך</p>
          </div>
        </div>
      </div>

      {/* Chart type selector */}
      <div className="p-6 bg-gradient-to-r from-white/70 to-slate-50/60 border-b border-cyan-200/40 relative z-10">
        <div className="mb-4 lg:mb-6">
          <h3 className="text-sm font-bold text-slate-700 mb-3 lg:mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">📈</span>
            </div>
            סוג התצוגה:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            {[
              { id: 'pie', label: 'גרף עוגה', icon: '🥧' },
              { id: 'monthly', label: 'מגמות חודשיות', icon: '📈' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setChartType(opt.id)}
                className={`p-3 lg:p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 font-medium ${chartType === opt.id
                  ? 'border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-700 shadow-lg transform scale-105'
                  : 'border-slate-200 bg-gradient-to-br from-white to-slate-50/50 text-slate-600 hover:border-cyan-300 hover:shadow-md hover:scale-102'
                  }`}
              >
                <div className="text-lg lg:text-2xl mb-1">{opt.icon}</div>
                <span className="font-semibold text-xs lg:text-sm text-center">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date filters */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-3 lg:mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">📅</span>
            </div>
            בחר תקופה:
          </h3>
          <div className="flex flex-wrap gap-2 mb-3 lg:mb-4">
            {[
              { id: 'week', label: 'שבוע אחרון', icon: '📅' },
              { id: 'month', label: 'חודש אחרון', icon: '🗓️' },
              { id: 'year', label: 'שנה אחרונה', icon: '📆' },
              { id: 'all', label: 'כל התקופה', icon: '🕐' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => { setDateFilter(f.id); setSelectedMonth(''); }}
                className={`flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 ${dateFilter === f.id
                  ? 'bg-slate-700 text-white shadow-lg transform scale-105'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:scale-102'
                  }`}
              >
                <span className="text-sm lg:text-base">{f.icon}</span>
                <span className="hidden sm:inline">{f.label}</span>
                <span className="sm:hidden">{f.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {availableMonths.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 lg:gap-3">
              <label className="text-xs lg:text-sm font-medium text-slate-700 whitespace-nowrap">חודש ספציפי:</label>
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  if (e.target.value) setDateFilter('specific');
                }}
                className="flex-1 sm:flex-none px-3 py-2 border border-slate-300 rounded-lg text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200 hover:border-slate-400"
              >
                <option value="">בחר חודש...</option>
                {availableMonths.map(m => {
                  const [y, mNum] = m.split('-').map(Number);
                  const name = new Date(y, mNum - 1).toLocaleDateString('he-IL', { year: 'numeric', month: 'long' });
                  return <option key={m} value={m}>{name}</option>;
                })}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Chart Display */}
      <div className="p-6 relative z-10">
        <div
          className="bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/30 shadow-sm p-4"
          style={{ minHeight: chartHeight }}
        >
          {renderChart()}
        </div>
      </div>
    </div>
  );
}
