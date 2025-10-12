import { useState, useEffect, useRef } from 'react';
import ProfileBudgetDisplay from "./budget/ProfileBudgetDisplay";
import ExpensesDisplay from "./expenses/expenses_display/ExpensesDisplay";
import ExpenseSummary from "./summary/ExpenseSummary";
import InteractiveCharts from "./charts/InteractiveCharts";
import AIInsight from "./ai/AIInsight";
import StatusDot from '../common/StatusDot';

export default function DisplaySelector({ setDisplay, setCurrentDisplayType, profile, refreshTrigger }) {
    const [activeTab, setActiveTab] = useState('budget');
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const tabs = [
        {
            id: 'budget',
            label: 'סקירת תקציב',
            color: 'blue',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            ),
            action: () => {
                setCurrentDisplayType('budget');
                setDisplay(<ProfileBudgetDisplay profile={profile} key={`budget-${refreshTrigger}`} />);
            }
        },
        {
            id: 'expenses',
            label: 'הוצאות',
            color: 'green',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            action: () => {
                setCurrentDisplayType('expenses');
                setDisplay(<ExpensesDisplay profile={profile} key={`expenses-${refreshTrigger}`} />);
            }
        },
        {
            id: 'summary',
            label: 'סיכום הוצאות',
            color: 'purple',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
            action: () => {
                setCurrentDisplayType('summary');
                setDisplay(<ExpenseSummary profile={profile} key={`summary-${refreshTrigger}`} />);
            }
        },
        {
            id: 'charts',
            label: 'גרפים',
            color: 'cyan',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            action: () => {
                setCurrentDisplayType('charts');
                setDisplay(<InteractiveCharts profile={profile} key={`charts-${refreshTrigger}`} />);
            }
        },
        {
            id: 'ai',
            label: 'תובנות AI',
            color: 'orange',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            action: () => {
                setCurrentDisplayType('ai');
                setDisplay(<AIInsight profile={profile} key={`ai-${refreshTrigger}`} />);
            }
        }
    ];

    const handleTabClick = (tab, index) => {
        setActiveTab(tab.id);
        setCurrentIndex(index);
        tab.action();
    };

    // Touch/Mouse handlers for mobile carousel
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        // Snap to closest tab
        const container = scrollContainerRef.current;
        const tabWidth = container.scrollWidth / tabs.length;
        const newIndex = Math.round(container.scrollLeft / tabWidth);
        const clampedIndex = Math.max(0, Math.min(newIndex, tabs.length - 1));
        
        if (clampedIndex !== currentIndex) {
            handleTabClick(tabs[clampedIndex], clampedIndex);
        }
    };

    // Auto-scroll to active tab
    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const tabWidth = container.scrollWidth / tabs.length;
            container.scrollTo({
                left: currentIndex * tabWidth,
                behavior: 'smooth'
            });
        }
    }, [currentIndex, tabs.length]);

    return (
        <div className="flex justify-center w-full">
            {/* Enhanced Desktop and Tablet Layout */}
            <div className="hidden md:block bg-white/90 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl shadow-slate-100/50 p-3 w-fit hover:shadow-3xl transition-all duration-500" dir="rtl">
                <div className="flex gap-2">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab, index)}
                            className={`
                                flex items-center gap-3 px-8 py-5 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 relative overflow-hidden
                                ${activeTab === tab.id 
                                    ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-xl shadow-slate-200/50 scale-105' 
                                    : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-slate-700'
                                }
                            `}
                        >
                            <div className="flex items-center gap-2">
                                <StatusDot 
                                    color={activeTab === tab.id ? tab.color : "slate"} 
                                    size="sm" 
                                    animated={activeTab === tab.id}
                                />
                                <div className={`${activeTab === tab.id ? 'text-white' : 'text-slate-500'} transition-colors duration-300`}>
                                    {tab.icon}
                                </div>
                            </div>
                            <span className="text-sm font-semibold whitespace-nowrap">{tab.label}</span>
                            {activeTab === tab.id && (
                                <div className="absolute inset-0 bg-white/10 rounded-2xl"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Enhanced Mobile Carousel Layout */}
            <div className="md:hidden w-full bg-white/90 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl shadow-slate-100/50 p-3" dir="rtl">
                <div 
                    ref={scrollContainerRef}
                    className="flex gap-3 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
                    style={{ 
                        scrollSnapType: 'x mandatory',
                        scrollBehavior: 'smooth',
                        WebkitOverflowScrolling: 'touch'
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab, index)}
                            className={`
                                flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex-shrink-0 min-w-fit relative overflow-hidden
                                ${activeTab === tab.id 
                                    ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-xl shadow-slate-200/50' 
                                    : 'text-slate-600 bg-gradient-to-r from-slate-50 to-blue-50'
                                }
                            `}
                            style={{ scrollSnapAlign: 'start' }}
                        >
                            <div className="flex items-center gap-2">
                                <StatusDot 
                                    color={activeTab === tab.id ? tab.color : "slate"} 
                                    size="xs" 
                                    animated={activeTab === tab.id}
                                />
                                <div className={`${activeTab === tab.id ? 'text-white' : 'text-slate-500'}`}>
                                    {tab.icon}
                                </div>
                            </div>
                            <span className="text-xs font-semibold whitespace-nowrap">{tab.label}</span>
                        </button>
                    ))}
                </div>
                
                {/* Mobile scroll indicators */}
                <div className="flex justify-center gap-1 mt-2">
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentIndex 
                                    ? `bg-${tab.color}-500` 
                                    : 'bg-slate-300'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}