import { useMemo, useState } from 'react';
import { useProfileData } from '../../../context/ProfileDataContext';

export default function AIInsight() {
    const { aiData } = useProfileData();
    const histories = aiData?.history || [];
    const [selectedId, setSelectedId] = useState(histories[0]?._id || null);

    const selectedHistory = useMemo(
        () => histories.find((h) => h._id === selectedId) || histories[0],
        [selectedId, histories]
    );

    if (!selectedHistory) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden relative">
                {/* Enhanced Background circles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-orange-100/30 to-amber-100/20 rounded-full"></div>
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-100/25 to-pink-100/15 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-br from-blue-100/20 to-cyan-100/10 rounded-full"></div>
                </div>

                {/* Enhanced Header */}
                <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-amber-700 p-5 text-white relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-white/30 to-white/10 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white drop-shadow-sm">תובנות AI</h2>
                            <p className="text-white/80 text-sm">ניתוח חכם ומתקדם של דפוסי ההוצאה</p>
                        </div>
                    </div>
                </div>

                {/* Enhanced Empty State */}
                <div className="p-8 text-center relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-100/80 to-amber-100/60 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div className="text-lg font-bold text-slate-700 mb-2">🤖 מנתח את הנתונים שלך</div>
                    <div className="text-slate-500 mb-4 text-sm max-w-sm mx-auto">התובנות החכמות יהיו זמינות לאחר שתוסיף מספר הוצאות לניתוח מעמיק</div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100/80 to-amber-100/60 rounded-xl text-sm text-orange-700 font-medium shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        זמין בקרוב
                    </div>
                </div>
            </div>
        );
    }

    const coachOutput = selectedHistory.coachOutput;
    const { summary, categories, nextMonthPlan, dataQuality } = coachOutput;
    console.log('Summary data:', summary);
    console.log('Global data:', summary.global);
    console.log('All histories:', histories); // הוסף את זה
    console.log('Selected history:', selectedHistory); // והוסף את זה
    const selectItems = histories.map((h) => ({
        value: h._id,
        label: h.periodLabel,
    }));

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden relative">
            {/* Enhanced Background circles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-orange-100/30 to-amber-100/20 rounded-full"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-100/25 to-pink-100/15 rounded-full"></div>
                <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-br from-blue-100/20 to-cyan-100/10 rounded-full"></div>
            </div>

            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-amber-700 p-5 text-white relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-white/30 to-white/10 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white drop-shadow-sm">תובנות AI</h2>
                        <p className="text-white/80 text-sm">ניתוח חכם ומתקדם של דפוסי ההוצאה</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6 relative z-10">
                {/* Enhanced History Selector */}
                {histories.length > 1 && (
                    <div className="mb-6">
                        <select
                            value={selectedId || ''}
                            onChange={(e) => setSelectedId(e.target.value)}
                            className="bg-gradient-to-r from-white/70 to-white/50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 backdrop-blur-sm shadow-sm font-medium"
                        >
                            {selectItems.map(item => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Enhanced Global Summary */}
                <div className="bg-gradient-to-br from-white/70 to-slate-50/60 backdrop-blur-sm rounded-xl p-6 border border-orange-200/40 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">📊 סיכום כללי</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 text-center border border-blue-200/40 shadow-sm">
                            <div className="text-2xl font-bold text-blue-700 mb-1">₪{summary.global.budget.toLocaleString()}</div>
                            <div className="text-sm text-blue-600 font-medium">💰 תקציב</div>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-4 text-center border border-red-200/40 shadow-sm">
                            <div className="text-2xl font-bold text-red-700 mb-1">₪{summary.global.spent.toLocaleString()}</div>
                            <div className="text-sm text-red-600 font-medium">💸 הוצא</div>
                        </div>
                        <div className={`rounded-xl p-4 text-center border shadow-sm ${summary.global.remaining >= 0 ? 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/40' : 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-200/40'}`}>
                            <div className={`text-2xl font-bold mb-1 ${summary.global.remaining >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                ₪{Math.abs(summary.global.remaining).toLocaleString()}
                            </div>
                            <div className={`text-sm font-medium ${summary.global.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {summary.global.remaining >= 0 ? '✅ נותר' : '⚠️ חריגה'}
                            </div>
                        </div>
                        <div className={`rounded-xl p-4 text-center border shadow-sm ${summary.global.utilizationPct <= 100 ? 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/40' : 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-200/40'}`}>
                            <div className={`text-2xl font-bold mb-1 ${summary.global.utilizationPct <= 100 ? 'text-green-700' : 'text-red-700'}`}>
                                {summary.global.utilizationPct.toFixed(1)}%
                            </div>
                            <div className={`text-sm font-medium ${summary.global.utilizationPct <= 100 ? 'text-green-600' : 'text-red-600'}`}>
                                📈 ניצול
                            </div>
                        </div>
                    </div>

                    {/* Top Signals */}
                    {summary.topSignals?.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-bold text-blue-900 mb-2">אותות חשובים:</h4>
                            <div className="space-y-2">
                                {summary.topSignals.map((signal, idx) => (
                                    <div key={idx} className={`p-3 rounded-lg ${signal.type === 'over_budget' ? 'bg-red-100 text-red-800' :
                                        signal.type === 'near_limit' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                        {signal.message}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Enhanced Categories Analysis */}
                <div className="bg-gradient-to-br from-white/70 to-slate-50/60 backdrop-blur-sm rounded-xl p-6 border border-purple-200/40 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">🎯 ניתוח קטגוריות</h3>
                    </div>

                    <div className="space-y-4">
                        {categories.map((cat, idx) => (
                            <div key={idx} className="bg-gradient-to-r from-white to-slate-50/30 rounded-xl p-5 border border-slate-200/50 shadow-md hover:shadow-lg transition-all duration-300">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-slate-800 text-lg">{cat.name}</h4>
                                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${cat.utilizationPct <= 80 ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' :
                                        cat.utilizationPct <= 100 ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800' :
                                            'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                                        }`}>
                                        {cat.utilizationPct.toFixed(1)}%
                                    </div>
                                </div>

                                <div className="flex justify-between text-sm text-slate-600 mb-2">
                                    <span>תקציב: ₪{cat.budget.toLocaleString()}</span>
                                    <span>הוצא: ₪{cat.spent.toLocaleString()}</span>
                                    <span className={cat.variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                                        {cat.variance >= 0 ? '+' : ''}₪{cat.variance.toLocaleString()}
                                    </span>
                                </div>

                                {/* Enhanced Progress Bar */}
                                <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-3 mb-4 shadow-inner">
                                    <div
                                        className={`h-3 rounded-full shadow-sm ${cat.utilizationPct <= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                                            cat.utilizationPct <= 100 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-red-400 to-red-600'
                                            }`}
                                        style={{ width: `${Math.min(cat.utilizationPct, 100)}%` }}
                                    ></div>
                                </div>

                                {/* Enhanced Top Drivers */}
                                {cat.drivers?.length > 0 && (
                                    <div className="mb-4">
                                        <div className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
                                            🏪 עסקים מובילים:
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {cat.drivers.slice(0, 3).map((driver, dIdx) => (
                                                <span key={dIdx} className="bg-gradient-to-r from-slate-100 to-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 shadow-sm">
                                                    {driver.business}: ₪{driver.amount.toLocaleString()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Enhanced Actions */}
                                {cat.actions?.length > 0 && (
                                    <div>
                                        <div className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1">
                                            💡 המלצות חכמות:
                                        </div>
                                        <div className="space-y-3">
                                            {cat.actions.slice(0, 2).map((action, aIdx) => (
                                                <div key={aIdx} className="bg-gradient-to-r from-blue-50/80 to-cyan-50/60 p-4 rounded-xl text-sm border border-blue-200/50 shadow-sm">
                                                    <div className="font-bold text-blue-800 mb-2 flex items-center gap-1">
                                                        ⭐ {action.proposal}
                                                    </div>
                                                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1.5 rounded-lg text-green-700 text-xs font-medium inline-block">
                                                        💰 חיסכון חודשי: ₪{action.quantifiedImpact.monthlySave.toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Month Plan */}
                {nextMonthPlan && (
                    <div className="bg-slate-50/50 backdrop-blur-sm rounded-xl p-6 border border-slate-200/30">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="text-lg font-bold text-slate-800">תוכנית לחודש הבא</h3>
                        </div>

                        {nextMonthPlan.proposedBudgets?.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-bold text-purple-800 mb-2">התאמות תקציב מוצעות:</h4>
                                <div className="space-y-2">
                                    {nextMonthPlan.proposedBudgets.map((b, idx) => (
                                        <div key={idx} className="bg-white rounded-lg p-3">
                                            <div className="font-bold text-slate-800">{b.category}</div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span>₪{b.current.toLocaleString()} ➡ ₪{b.proposed.toLocaleString()}</span>
                                                <span className="text-purple-600 text-xs">{b.rationale}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {nextMonthPlan.watchList?.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-bold text-purple-800 mb-2">קטגוריות לעקוב אחריהן:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {nextMonthPlan.watchList.map((item, idx) => (
                                        <span key={idx} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {nextMonthPlan.reminders?.length > 0 && (
                            <div>
                                <h4 className="font-bold text-purple-800 mb-2">תזכורות:</h4>
                                <div className="space-y-1">
                                    {nextMonthPlan.reminders.map((reminder, idx) => (
                                        <div key={idx} className="bg-purple-100 p-2 rounded text-sm text-purple-800">
                                            {reminder}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Data Quality Issues */}
                {dataQuality?.length > 0 && (
                    <div className="bg-slate-50/50 backdrop-blur-sm rounded-xl p-6 border border-slate-200/30">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <h3 className="text-lg font-bold text-slate-800">איכות נתונים</h3>
                        </div>

                        <div className="space-y-2">
                            {dataQuality.map((issue, idx) => (
                                <div key={idx} className="bg-white rounded-lg p-3">
                                    <div className="font-bold text-orange-800">{issue.issue}</div>
                                    <div className="text-sm text-orange-600">{issue.detail}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}