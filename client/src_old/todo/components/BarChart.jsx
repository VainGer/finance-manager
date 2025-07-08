import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function BarChart({ data, chartType, username, profileName }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                rtl: true,
                labels: {
                    font: {
                        size: 14
                    }
                }
            },
            title: {
                display: false
            }
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '₪' + value.toLocaleString();
                    },
                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    let chartData = {
        labels: [],
        datasets: []
    };

    if (chartType === 'budget-comparison') {
        // נתונים להשוואת הוצאות מול תקציב
        chartData = {
            labels: data.map(item => item.category),
            datasets: [
                {
                    label: 'תקציב',
                    data: data.map(item => item.budget),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'הוצאות בפועל',
                    data: data.map(item => item.expenses),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        };
    } else {
        // נתונים רגילים לפי סוג התרשים
        chartData = {
            labels: data.map(item => item.category),
            datasets: [
                {
                    label: chartType === 'account' ? 'הוצאות לפי פרופיל' : 'הוצאות לפי קטגוריה',
                    data: data.map(item => item.amount),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        };
    }

    useEffect(() => {
        async function fetchBudgetData() {
            try {
                let endpoint = '';
                if (chartType === 'profile') {
                    endpoint = 'get_cat_budget';
                } else if (chartType === 'account') {
                    endpoint = 'get_prof_budget';
                }

                console.log('Fetching budget data from:', endpoint);
                console.log('Request params:', { username, profileName });

                const response = await fetch(`http://localhost:5500/api/profile/${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, profileName })
                });

                if (response.ok) {
                    const budgetData = await response.json();
                    console.log('Budget data received:', JSON.stringify(budgetData, null, 2));
                    console.log('Budget array:', JSON.stringify(budgetData.budget, null, 2));
                    console.log('Current expenses data:', JSON.stringify(data, null, 2));

                    const labels = data.map(item => item.category);
                    const expenses = data.map(item => item.amount);
                    const currentDate = new Date();
                    
                    // מיפוי התקציב לפי הקטגוריות או פרופילים
                    const budgets = labels.map(label => {
                        let relevantBudgets;
                        
                        if (chartType === 'profile') {
                            // מחפש תקציב לקטגוריה
                            relevantBudgets = budgetData.budget?.filter(b => b.category === label && b.amount);
                        } else if (chartType === 'account') {
                            // בתקציבי פרופילים, נחפש את התקציב של הפרופיל הספציפי
                            relevantBudgets = budgetData.budget?.filter(b => {
                                // בדיקה שיש amount ושזה לא startDate בטעות
                                const amount = b.amount || b.startDate;
                                if (!amount || !b.profileName) return false;
                                return b.profileName === label;
                            });
                        }
                        
                        if (!relevantBudgets || relevantBudgets.length === 0) return -1;

                        // מיון התקציבים לפי תאריך סיום
                        const sortedBudgets = relevantBudgets.sort((a, b) => {
                            const dateA = new Date(a.endDate);
                            const dateB = new Date(b.endDate);
                            if (!isNaN(dateA) && !isNaN(dateB)) {
                                return dateB.getTime() - dateA.getTime();
                            }
                            return 0;
                        });

                        // בחירת התקציב הרלוונטי ביותר
                        for (const budget of sortedBudgets) {
                            const amount = budget.amount || budget.startDate;
                            if (!amount) continue;
                            
                            const startDate = new Date(budget.startDate);
                            const endDate = new Date(budget.endDate);
                            
                            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) continue;
                            
                            if (currentDate >= startDate && currentDate <= endDate) {
                                return parseFloat(amount);
                            }
                        }

                        // אם אין תקציב בתוקף, נחפש את התקציב העתידי הקרוב ביותר
                        const futureBudgets = sortedBudgets.filter(b => {
                            const amount = b.amount || b.startDate;
                            if (!amount) return false;
                            const startDate = new Date(b.startDate);
                            return !isNaN(startDate.getTime()) && startDate > currentDate;
                        });
                        if (futureBudgets.length > 0) {
                            futureBudgets.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                            return parseFloat(futureBudgets[0].amount || futureBudgets[0].startDate);
                        }

                        // אם אין תקציב עתידי, ניקח את התקציב האחרון שהסתיים
                        const pastBudgets = sortedBudgets.filter(b => {
                            const amount = b.amount || b.startDate;
                            if (!amount) return false;
                            const endDate = new Date(b.endDate);
                            return !isNaN(endDate.getTime()) && endDate < currentDate;
                        });
                        if (pastBudgets.length > 0) {
                            pastBudgets.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
                            return parseFloat(pastBudgets[0].amount || pastBudgets[0].startDate);
                        }

                        return -1;
                    });

                    console.log('Final processed budgets:', JSON.stringify(budgets, null, 2));

                    // וודא שה-canvas קיים לפני יצירת הגרף
                    if (!chartRef.current) {
                        console.warn('Canvas element is not ready yet');
                        return;
                    }

                    // Destroy existing chart if it exists
                    if (chartInstance.current) {
                        chartInstance.current.destroy();
                    }

                    // Create new chart
                    const ctx = chartRef.current.getContext('2d');
                    if (!ctx) {
                        console.warn('Could not get 2d context from canvas');
                        return;
                    }

                    chartInstance.current = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: 'הוצאות',
                                    data: expenses,
                                    backgroundColor: 'rgba(255, 99, 132, 0.8)',
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    borderWidth: 1
                                },
                                {
                                    label: 'תקציב',
                                    data: budgets,
                                    backgroundColor: budgets.map(budget => 
                                        budget === -1 ? 'rgba(200, 200, 200, 0.8)' : 'rgba(75, 192, 192, 0.8)'
                                    ),
                                    borderColor: budgets.map(budget => 
                                        budget === -1 ? 'rgba(200, 200, 200, 1)' : 'rgba(75, 192, 192, 1)'
                                    ),
                                    borderWidth: 1
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                    rtl: true,
                                    labels: {
                                        font: {
                                            size: 14
                                        }
                                    }
                                },
                                title: {
                                    display: true,
                                    text: chartType === 'profile' ? 'השוואת הוצאות מול תקציב לפי קטגוריה' : 'השוואת הוצאות מול תקציב לפי פרופיל',
                                    font: {
                                        size: 16
                                    }
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            const value = context.raw;
                                            if (context.datasetIndex === 1 && value === -1) {
                                                return 'לא הוגדר תקציב';
                                            }
                                            return `${context.dataset.label}: ${value.toLocaleString()} ₪`;
                                        }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    stacked: false,
                                    ticks: {
                                        font: {
                                            size: 12
                                        }
                                    }
                                },
                                y: {
                                    stacked: false,
                                    beginAtZero: true,
                                    ticks: {
                                        font: {
                                            size: 12
                                        },
                                        callback: function(value) {
                                            if (value === -1) return 'לא הוגדר';
                                            return value.toLocaleString() + ' ₪';
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching budget data:', error);
            }
        }

        if (data && data.length > 0) {
            // נחכה רגע קטן לפני יצירת הגרף כדי לוודא שה-canvas מוכן
            setTimeout(() => {
                fetchBudgetData();
            }, 0);
        }

        // Add event listener for budget updates
        const handleBudgetUpdate = (event) => {
            console.log('Budget update event received:', event.detail);
            // רק אם סוג העדכון מתאים לסוג הגרף הנוכחי
            if ((event.detail.type === 'account' && chartType === 'account') ||
                (event.detail.type === 'profile' && chartType === 'profile')) {
                if (data && data.length > 0) {
                    setTimeout(() => {
                        fetchBudgetData();
                    }, 0);
                }
            }
        };
        window.addEventListener('budgetUpdated', handleBudgetUpdate);

        // Cleanup function
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            window.removeEventListener('budgetUpdated', handleBudgetUpdate);
        };
    }, [data, chartType, username, profileName]);

    return (
        <div className="h-[400px] w-full">
            <canvas ref={chartRef} />
        </div>
    );
} 