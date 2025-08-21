import { useState, useMemo, useEffect } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import LoadingSpinner from "../../common/LoadingSpinner";
import ErrorMessage from "../../common/ErrorMessage";
import useExpensesDisplay from '../../../hooks/useExpensesDisplay';

export default function InteractiveCharts({ profile, refreshTrigger }) {
  const [dateFilter, setDateFilter] = useState('all');
  const [chartType, setChartType] = useState('pie');
  const [selectedMonth, setSelectedMonth] = useState('');

  const { expenses, filteredExpenses, loading, error, refetchExpenses } = useExpensesDisplay(profile);

  useEffect(() => {
    if (refreshTrigger) refetchExpenses();
  }, [refreshTrigger, refetchExpenses]);

  // חודשים זמינים לבחירה
  const availableMonths = useMemo(() => {
    if (!expenses?.length) return [];
    const months = new Set();
    for (const exp of expenses) {
      const d = new Date(exp.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.add(key);
    }
    return Array.from(months).sort().reverse();
  }, [expenses]);

  // פילטר לפי תאריכים
  const filteredByDateExpenses = useMemo(() => {
    if (!filteredExpenses) return [];
    if (dateFilter === 'all') return filteredExpenses;

    const now = new Date();

    if (dateFilter === 'specific' && selectedMonth) {
      const [year, month] = selectedMonth.split('-').map(Number);
      return filteredExpenses.filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month - 1;
      });
    }

    const cutoff = new Date();
    switch (dateFilter) {
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return filteredExpenses;
    }
    return filteredExpenses.filter(e => {
      const d = new Date(e.date);
      return d >= cutoff && d <= now;
    });
  }, [filteredExpenses, dateFilter, selectedMonth]);

  // דאטה לגרף עוגה/עמודות לפי קטגוריות
  const pieChartData = useMemo(() => {
    if (!filteredByDateExpenses.length) return [];
    const colors = [
      '#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FECA57','#FF9F43',
      '#9C88FF','#FDA7DF','#6C5CE7','#A29BFE','#FD79A8','#00B894'
    ];
    const totals = {};
    let sum = 0;
    for (const e of filteredByDateExpenses) {
      const cat = e.category || 'ללא קטגוריה';
      totals[cat] = (totals[cat] || 0) + e.amount;
      sum += e.amount;
    }
    return Object.entries(totals)
      .sort(([,a],[,b]) => b - a)
      .map(([name, value], i) => ({
        name,
        value,
        color: colors[i % colors.length],
        percentage: ((value / sum) * 100).toFixed(1)
      }));
  }, [filteredByDateExpenses]);

  // דאטה חודשי למגמות
  const monthlyChartData = useMemo(() => {
    if (!expenses?.length) return [];
    const monthly = {};
    for (const e of expenses) {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const label = `${d.getMonth()+1}/${d.getFullYear()}`;
      if (!monthly[key]) monthly[key] = { month: label, amount: 0 };
      monthly[key].amount += e.amount;
    }
    return Object.values(monthly).sort((a,b) => {
      const [ma, ya] = a.month.split('/').map(Number);
      const [mb, yb] = b.month.split('/').map(Number);
      return new Date(ya, ma - 1).getTime() - new Date(yb, mb - 1).getTime();
    });
  }, [expenses]);

  // גובה/מידות בהתאם למסך
  const isMobile = (typeof window !== 'undefined') ? window.innerWidth < 768 : false;
  const isTablet = (typeof window !== 'undefined') ? window.innerWidth >= 768 && window.innerWidth < 1024 : false;
  const isDesktop = (typeof window !== 'undefined') ? window.innerWidth >= 1024 : true;
  
  const chartHeight = isMobile ? 350 : (isTablet ? 400 : 500);

  const renderChart = () => {
    if (!filteredByDateExpenses.length && chartType !== 'monthly') {
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

    if (chartType === 'pie') {
      return (
        <div className="w-full" style={{ height: chartHeight }}>
          <div className="text-center mb-2 lg:mb-4">
            <h3 className="text-base lg:text-xl font-bold text-gray-800 mb-1">התפלגות הוצאות לפי קטגוריה</h3>
            <p className="text-xs lg:text-sm text-gray-600">
              מציג {filteredByDateExpenses.length} מתוך {expenses?.length || 0} הוצאות
            </p>
          </div>
          <ResponsiveContainer width="100%" height={isMobile ? "85%" : "90%"}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%" cy="50%"
                innerRadius={isMobile ? 30 : (isTablet ? 50 : 70)}
                outerRadius={isMobile ? 80 : (isTablet ? 110 : 140)}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {pieChartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} stroke="white" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, name, props) => [`₪${v.toLocaleString()} (${props.payload.percentage}%)`, name]}
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

    if (chartType === 'bar') {
      return (
        <div className="w-full" style={{ height: chartHeight }}>
          <div className="text-center mb-2 lg:mb-4">
            <h3 className="text-base lg:text-xl font-bold text-gray-800 mb-1">התפלגות הוצאות לפי קטגוריה</h3>
            <p className="text-xs lg:text-sm text-gray-600">
              מציג {filteredByDateExpenses.length} מתוך {expenses?.length || 0} הוצאות
            </p>
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={pieChartData}
              margin={{
                top: 20,
                right: isMobile ? 5 : (isTablet ? 15 : 30),
                left: isMobile ? 5 : (isTablet ? 10 : 20),
                bottom: isMobile ? 80 : (isTablet ? 70 : 60)
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
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
                labelFormatter={(label) => `קטגוריה: ${label}`}
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
                dataKey="value" 
                radius={[4,4,0,0]} 
                animationDuration={1000} 
                animationBegin={0}
              >
                {pieChartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // monthly - default case
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
          {dateFilter !== 'all' && (
            <p className="text-xs text-gray-500">(מציג את כל החודשים - הפילטר משפיע על גרפי קטגוריות)</p>
          )}
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
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#059669" stopOpacity={0.6}/>
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
              radius={[4,4,0,0]} 
              animationDuration={1000} 
              animationBegin={0} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/20 shadow-xl overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-3 lg:p-6 text-white">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="w-8 h-8 lg:w-12 lg:h-12 bg-white/20 rounded-lg lg:rounded-xl flex items-center justify-center backdrop-blur-sm">
            <svg className="w-4 h-4 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-lg lg:text-2xl font-bold">גרפים אינטראקטיביים</h2>
            <p className="text-white/80 text-xs lg:text-sm">ניתוח חזותי של ההוצאות שלך</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-3 lg:p-6 bg-gradient-to-r from-slate-50/80 to-gray-50/80 border-b border-slate-200/50">
        {/* Chart Type Selector */}
        <div className="mb-3 lg:mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-2 lg:mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            סוג הצגה:
          </h3>
          <div className="grid grid-cols-3 gap-2 lg:gap-3">
            {[
              { id: 'pie', label: 'גרף עוגה', icon: '🥧' },
              { id: 'bar', label: 'גרף עמודות', icon: '📊' },
              { id: 'monthly', label: 'מגמות חודשיות', icon: '📈' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setChartType(opt.id)}
                className={`p-2 lg:p-3 rounded-lg border-2 transition-all duration-200 ${
                  chartType === opt.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md transform scale-105'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm hover:scale-102'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2">
                  <div className="text-base lg:text-xl">{opt.icon}</div>
                  <span className="font-medium text-xs lg:text-sm text-center">{opt.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Date Filter */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2 lg:mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            תקופה:
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
                className={`flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 ${
                  dateFilter === f.id
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
      <div className="p-2 lg:p-6 bg-gradient-to-br from-white to-slate-50/50">
        <div
          className="bg-white rounded-lg lg:rounded-xl border border-slate-200/50 shadow-sm p-2 lg:p-6 transition-all duration-300 hover:shadow-md"
          style={{ minHeight: isMobile ? '350px' : (isTablet ? '400px' : '500px') }}
        >
          {renderChart()}
        </div>
      </div>
    </div>
  );
}
