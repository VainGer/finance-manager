import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import ViewSelector from '../components/dashboard/ViewSelector';
import BudgetSummaryDisplay from '../components/dashboard/BudgetSummaryDisplay';
import ExpenseDisplayArea from '../components/dashboard/ExpenseDisplayArea';

// --- Mock API Functions (Replace with actual imports later) ---
// These are placeholders based on the fetch calls in the original code
const mockFetch = async (url, options) => {
    console.log("Mock API Call:", url, options?.body ? JSON.parse(options.body) : '');
    // Simulate API response structure based on usage
    if (url.includes('get_prof_budget')) {
        return { ok: true, json: async () => ({ status: 200, budget: [{ amount: 1000, startDate: '2025-01-01', endDate: '2025-12-31' }] }) };
    }
    if (url.includes('profile_expenses')) {
        return { ok: true, json: async () => ({ status: 200, expenses: [] }) }; // Return empty array for now
    }
    if (url.includes('acc_expenses')) {
        return { ok: true, json: async () => ({ status: 200, expenses: [] }) }; // Return empty array for now
    }
    return { ok: false, json: async () => ({ status: 500, message: 'Mock API Error' }) };
};
// --- End Mock API Functions ---


export default function Dashboard() {
    const navigate = useNavigate();
    const auth = useAuth();
    const username = auth?.user;
    const profileName = auth?.profile?.profileName;
    const parent = auth?.profile?.parent;

    const [showProfExpenses, setShowProfExpenses] = useState(false);
    const [showAccExpenses, setShowAccExpenses] = useState(false);
    const [showExpensesByBudget, setShowExpensesByBudget] = useState(false);
    const [showTables, setShowTables] = useState(false);
    const [showGraphs, setShowGraphs] = useState(false);

    const [expensesKey, setExpensesKey] = useState(0); // For forcing re-renders
    const [expensesData, setExpensesData] = useState([]); // Data for charts
    const [profileBudget, setProfileBudget] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [profitLoss, setProfitLoss] = useState(0);
    const [startBudgetDate, setStartBudgetDate] = useState(new Date().toISOString().slice(0, 10));
    const [endBudgetDate, setEndBudgetDate] = useState(new Date().toISOString().slice(0, 10));
    const [currentType, setCurrentType] = useState('profile'); // For chart type

 
    useEffect(() => {
        
        if (!username || !profileName) {
            console.log("Redirecting: Missing username or profileName");
            navigate('/', { state: { notLogedIn: true } });
        } else {
            getProfileBudgetInfo();
        }
    }, [username, profileName, navigate]);


    const formatCurrency = useCallback((amount) => {
        if (amount == null || isNaN(amount)) return "₪0.0"; // Added null check
        return new Intl.NumberFormat('he-IL', {
            style: 'currency',
            currency: 'ILS',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(amount);
    }, []);

    const formatDate = useCallback((dateString) => {
        if (!dateString || typeof dateString !== 'string' || dateString.length < 10) return "N/A";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "N/A";
            let year = date.getFullYear(); 
            let month = (date.getMonth() + 1).toString().padStart(2, '0');
            let day = date.getDate().toString().padStart(2, '0');
            return day + "/" + month + "/" + year;
        } catch (e) {
            console.error("Error formatting date:", dateString, e);
            return "N/A";
        }
    }, []);

    const refreshExpenses = useCallback(async () => {
        if (!username || !profileName) return;
        setExpensesKey((prevKey) => prevKey + 1);
        try {
            const response = await mockFetch('http://localhost:5500/api/profile/profile_expenses', { // Using mockFetch
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, profileName })
            });
            const data = await response.json();
            if (response.ok && data.expenses) {
                handleFilteredData(data.expenses, 'profile'); // Process data for charts
            } else {
                console.error("Failed to refresh profile expenses:", data.message);
            }
        } catch (error) {
            console.error('Error refreshing expenses:', error);
        }
    }, [username, profileName]); // Removed handleFilteredData from dependencies for now

    const refreshAccountExpenses = useCallback(async () => {
        if (!username || !profileName) return;
        try {
            const response = await mockFetch('http://localhost:5500/api/profile/acc_expenses', { // Using mockFetch
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, profileName })
            });
            const data = await response.json();
            if (response.ok && data.expenses) {
                handleFilteredData(data.expenses, 'account'); // Process data for charts
            } else {
                console.error("Failed to refresh account expenses:", data.message);
            }
        } catch (error) {
            console.error('Error fetching account expenses:', error);
        }
    }, [username, profileName]); // Removed handleFilteredData from dependencies for now

    const getProfileBudgetInfo = useCallback(async () => {
        if (!username || !profileName) return;
        // setLoading(true); // Add loading state if needed
        try {
            const budgetResponse = await mockFetch('http://localhost:5500/api/profile/get_prof_budget', { // Using mockFetch
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, profileName })
            });
            const budgetData = await budgetResponse.json();

            const expensesResponse = await mockFetch('http://localhost:5500/api/profile/profile_expenses', { // Using mockFetch
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, profileName })
            });
            const expensesData = await expensesResponse.json();

            let budgetAmount = 0;
            let startD = new Date().toISOString().slice(0, 10); // Default start date
            let endD = new Date().toISOString().slice(0, 10); // Default end date

            if (budgetResponse.ok && budgetData.budget && budgetData.budget.length > 0) {
                // Find the budget entry with the latest start date (simplified logic)
                const latestBudget = budgetData.budget.reduce((latest, current) => {
                    return new Date(current.startDate) > new Date(latest.startDate) ? current : latest;
                });
                startD = latestBudget.startDate;
                endD = latestBudget.endDate;
                budgetAmount = parseFloat(latestBudget.amount || 0);
            }
            setStartBudgetDate(startD);
            setEndBudgetDate(endD);
            setProfileBudget(budgetAmount);

            let total = 0;
            if (expensesResponse.ok && expensesData.expenses) {
                const startDateObj = new Date(startD);
                const endDateObj = new Date(endD);
                expensesData.expenses.forEach(category => {
                    category.items?.forEach(item => {
                        item.transactions?.forEach(transaction => {
                            const transactionDate = new Date(transaction.date);
                            if (!isNaN(startDateObj.getTime()) && !isNaN(endDateObj.getTime()) && !isNaN(transactionDate.getTime())) { // Date validation
                                if (transactionDate >= startDateObj && transactionDate <= endDateObj) {
                                    total += parseFloat(transaction.price || 0);
                                }
                            }
                        });
                    });
                });
            }
            setTotalExpenses(total);
            setProfitLoss(budgetAmount - total);

        } catch (error) {
            console.error('Error fetching profile budget info:', error);
            // setError("Failed to load budget info"); // Set error state if needed
            setProfileBudget(0);
            setTotalExpenses(0);
            setProfitLoss(0);
        } finally {
            // setLoading(false); // Set loading state if needed
        }
    }, [username, profileName]);

    // --- Effect for View Changes (Original Logic) ---
    useEffect(() => {
        if (showAccExpenses) {
            setCurrentType('account');
            refreshAccountExpenses();
        } else if (showProfExpenses) {
            setCurrentType('profile');
            refreshExpenses();
            getProfileBudgetInfo();
        } else if (showExpensesByBudget) {
            setCurrentType('budget');
            setShowGraphs(false); // Ensure graphs are off for budget view
        } else {
            // Default/Summary view
            setCurrentType('profile'); // Or 'summary' if you add specific logic
            getProfileBudgetInfo(); // Refresh summary data
        }
    }, [showAccExpenses, showProfExpenses, showExpensesByBudget, refreshAccountExpenses, refreshExpenses, getProfileBudgetInfo]); // Added fetch functions to dependencies

    // --- Event Listeners for Updates (Original Logic) ---
    useEffect(() => {
        const handleTransactionUpdate = async () => {
            console.log("Transaction update event received");
            await getProfileBudgetInfo();
            await refreshExpenses(); // Refresh data for graphs/tables
        };

        const handleBudgetUpdate = async () => {
            console.log("Budget update event received");
            await getProfileBudgetInfo();
            await refreshExpenses(); // Refresh data for graphs/tables
            if (showExpensesByBudget) {
                setExpensesKey(prevKey => prevKey + 1); // Re-render budget table
            }
        };

        window.addEventListener('transactionUpdated', handleTransactionUpdate);
        window.addEventListener('budgetUpdated', handleBudgetUpdate);

        return () => {
            window.removeEventListener('transactionUpdated', handleTransactionUpdate);
            window.removeEventListener('budgetUpdated', handleBudgetUpdate);
        };
    }, [showExpensesByBudget, getProfileBudgetInfo, refreshExpenses]); // Dependencies based on usage

    // --- Event Dispatchers (Original Logic) ---
    const dispatchTransactionUpdate = useCallback(() => {
        console.log("Dispatching transaction update event");
        window.dispatchEvent(new CustomEvent('transactionUpdated'));
    }, []);

    const dispatchBudgetUpdate = useCallback(() => {
        console.log("Dispatching budget update event");
        window.dispatchEvent(new CustomEvent('budgetUpdated'));
    }, []);

    // --- Data Processing for Charts (Original Logic) ---
    const handleFilteredData = useCallback((data, type = 'profile') => {
        let processedData = [];
        console.log(`Processing filtered data for type: ${type}`, data);

        if (!Array.isArray(data)) {
            console.error("handleFilteredData received non-array data:", data);
            setExpensesData([]);
            return;
        }

        if (type === 'account') {
            const profileExpenses = {};
            data.forEach(category => { // Assuming data structure from original refreshAccountExpenses
                const profileName = category.profileName || 'לא ידוע';
                if (!profileExpenses[profileName]) profileExpenses[profileName] = 0;
                category.items?.forEach(item => {
                    item.transactions?.forEach(transaction => {
                        profileExpenses[profileName] += parseFloat(transaction.price || 0);
                    });
                });
            });
            processedData = Object.entries(profileExpenses)
                .map(([profileName, amount]) => ({ category: profileName, amount }))
                .filter(profile => profile.amount > 0);
        } else if (type === 'profile' || type === 'budget') {
            processedData = data.map(expense => ({
                category: expense.categoryName,
                amount: expense.items?.reduce((sum, item) =>
                    sum + (item.transactions?.reduce((tSum, transaction) =>
                        tSum + parseFloat(transaction.price || 0), 0) || 0), 0) || 0
            })).filter(expense => expense.category && expense.amount > 0);
        }

        console.log("Processed chart data:", processedData);
        setExpensesData(processedData);
    }, []); // Keep dependency array empty if it only relies on args

    // --- Event Handlers for View/Display Buttons ---
    const handleProfileClick = useCallback(() => {
        const nextState = !showProfExpenses;
        setShowProfExpenses(nextState);
        setShowAccExpenses(false);
        setShowExpensesByBudget(false);
        setShowTables(false);
        setShowGraphs(false);
        // No need to call refreshExpenses here, useEffect handles it
    }, [showProfExpenses]);

    const handleBudgetClick = useCallback(() => {
        const nextState = !showExpensesByBudget;
        setShowExpensesByBudget(nextState);
        setShowAccExpenses(false);
        setShowProfExpenses(false);
        setShowTables(false);
        setShowGraphs(false);
    }, [showExpensesByBudget]);

    const handleAccountClick = useCallback(() => {
        const nextState = !showAccExpenses;
        setShowAccExpenses(nextState);
        setShowProfExpenses(false);
        setShowExpensesByBudget(false);
        setShowTables(false);
        setShowGraphs(false);
        // No need to call refreshAccountExpenses here, useEffect handles it
    }, [showAccExpenses]);

    const handleShowTablesClick = useCallback(() => {
        setShowTables(prev => !prev);
        setShowGraphs(false);
    }, []);

    const handleShowGraphsClick = useCallback(() => {
        setShowGraphs(prev => !prev);
        setShowTables(false);
    }, []);

    // --- Render Logic ---
    // Render loading or null if auth data isn't ready yet
    if (!username || !profileName) {
        return <div className="p-4 text-center">טוען נתוני משתמש...</div>; // Or null
    }

    const showSummary = !showProfExpenses && !showAccExpenses && !showExpensesByBudget;
    const showExpenseArea = showProfExpenses || showAccExpenses || showExpensesByBudget;

    return (
        <div dir='rtl' className='text-center bg-gray-100 min-h-screen'>
            {/* Header */}
            <Header username={username} profileName={profileName} parent={parent} />

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full p-4'>
                {/* Sidebar */}
                <DashboardSidebar
                    username={username}
                    profileName={profileName}
                    refreshExpenses={refreshExpenses} // Pass original refresh for SidePanel
                    onBudgetUpdate={dispatchBudgetUpdate}
                />

                {/* Main Content Area */}
                <div className='sm:col-span-2 lg:col-span-3 bg-white shadow-md rounded-xl p-4 md:p-6 border border-gray-300'>
                    {/* View Selection Buttons */}
                    <ViewSelector
                        showProfExpenses={showProfExpenses}
                        showExpensesByBudget={showExpensesByBudget}
                        showAccExpenses={showAccExpenses}
                        onProfileClick={handleProfileClick}
                        onBudgetClick={handleBudgetClick}
                        onAccountClick={handleAccountClick}
                        parent={parent}
                    />

                    {/* Budget Summary Display (Conditional) */}
                    {showSummary && (
                        <BudgetSummaryDisplay
                            profileBudget={profileBudget}
                            totalExpenses={totalExpenses}
                            profitLoss={profitLoss}
                            startBudgetDate={startBudgetDate}
                            endBudgetDate={endBudgetDate}
                            formatCurrency={formatCurrency}
                            formatDate={formatDate}
                        />
                    )}

                    {/* Expense Display Area (Conditional) */}
                    {showExpenseArea && (
                        <ExpenseDisplayArea
                            showProfExpenses={showProfExpenses}
                            showAccExpenses={showAccExpenses}
                            showExpensesByBudget={showExpensesByBudget}
                            showTables={showTables}
                            showGraphs={showGraphs}
                            onShowTablesClick={handleShowTablesClick}
                            onShowGraphsClick={handleShowGraphsClick}
                            username={username}
                            profileName={profileName}
                            expensesKey={expensesKey}
                            handleFilteredData={handleFilteredData}
                            dispatchTransactionUpdate={dispatchTransactionUpdate}
                            currentType={currentType}
                            expensesData={expensesData}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}