import { useState, useEffect, useRef } from 'react';
import ProfileBudgetDisplay from "./budget/ProfileBudgetDisplay";
import ExpensesDisplay from "./expenses/expenses_display/ExpensesDisplay";
import ExpenseSummary from "./summary/ExpenseSummary";
import InteractiveCharts from "./charts/InteractiveCharts";
import AIInsight from "./ai/AIInsight";

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
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
            {/* Desktop and Tablet Layout */}
            <div className="hidden md:block bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-2 w-fit" dir="rtl">
                <div className="flex gap-1">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab, index)}
                            className={`
                                flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300
                                ${activeTab === tab.id 
                                    ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg transform scale-105' 
                                    : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-800'
                                }
                            `}
                        >
                            <div className={`${activeTab === tab.id ? 'text-white' : 'text-slate-500'}`}>
                                {tab.icon}
                            </div>
                            <span className="text-sm font-semibold whitespace-nowrap">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile Carousel Layout */}
            <div className="md:hidden w-full bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-2" dir="rtl">
                <div 
                    ref={scrollContainerRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
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
                                flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 flex-shrink-0 min-w-fit
                                ${activeTab === tab.id 
                                    ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg' 
                                    : 'text-slate-600 bg-slate-50/50'
                                }
                            `}
                            style={{ scrollSnapAlign: 'start' }}
                        >
                            <div className={`${activeTab === tab.id ? 'text-white' : 'text-slate-500'}`}>
                                {tab.icon}
                            </div>
                            <span className="text-xs font-semibold whitespace-nowrap">{tab.label}</span>
                        </button>
                    ))}
                </div>
                
                {/* Mobile scroll indicators */}
                <div className="flex justify-center gap-1 mt-2">
                    {tabs.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentIndex ? 'bg-slate-700' : 'bg-slate-300'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}