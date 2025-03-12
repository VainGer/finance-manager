import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AccountExpenses from '../components/AccountExpenses';
import ProfileExpenses from '../components/ProfileExpenses';
import Header from '../components/Header';
import ExpenseEditor from '../components/ExpenseEditor';
import ExpensesByBudget from '../components/ExpensesByBudget';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state?.username;
    const profileName = location.state?.profileName;
    const parent = location.state?.parent;
    const [showAccExpenses, setShowAccExpenses] = useState(false);
    const [showProfExpenses, setShowProfExpenses] = useState(false);
    const [showExpensesByBudget, setShowExpensesByBudget] = useState(false);
    const [showTables, setShowTables] = useState(false);
    const [showGraphs, setShowGraphs] = useState(false);
    const [expensesKey, setExpensesKey] = useState(0);
    const [expensesData, setExpensesData] = useState([]);
    const [currentType, setCurrentType] = useState('profile');
    const [profileBudget, setProfileBudget] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [profitLoss, setProfitLoss] = useState(0);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [startBudgetDate, setStartBudgetDate] = useState(new Date().toISOString().slice(0, 10));
    const [endBudgetDate, setEndBudgetDate] = useState(new Date().toISOString().slice(0, 10));

    useEffect(() => {
        if (!username || !profileName) navigate('/', { state: { notLogedIn: true } });
    }, [username, profileName]);

    const tips = [
        { icon: "💡", text: "טיפ: כאן תוכל להוסיף ולערוך את הקטגוריות שלך בקלות" },
        { icon: "📊", text: "טיפ: לעריכת עסקאות ומידע נוסף, בקר בעמוד הטבלאות" },
        { icon: "📈", text: "טיפ: לצפייה בדוחות החודשיים שלך, עבור לעמוד ההוצאות בפרופיל" }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTipIndex((prev) => (prev + 1) % tips.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (expensesData.length === 0) {
            refreshExpenses();
        }
        if (expensesData.length > 0) {
            getProfileBudgetInfo();
        }
    }, [expensesData, profileBudget]);

    function formatCurrency(amount) {
        if (!amount || isNaN(amount)) return "₪0.0";
        return new Intl.NumberFormat('he-IL', {
            style: 'currency',
            currency: 'ILS',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(amount);
    }

    function formatDate(date) {
        let year = date.slice(0, 4);
        let month = date.slice(5, 7);
        let day = date.slice(8, 10);
        return day + "/" + month + "/" + year;;
    }

    async function refreshExpenses() {
        setExpensesKey((prevKey) => prevKey + 1);
        try {
            const response = await fetch('http://localhost:5500/api/profile/profile_expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName })
            });
            const data = await response.json();
            if (response.ok) {
                const processedData = data.expenses
                    .map(expense => ({
                        category: expense.categoryName,
                        amount: expense.items.reduce((sum, item) =>
                            sum + item.transactions.reduce((tSum, transaction) =>
                                tSum + parseFloat(transaction.price || 0), 0), 0)
                    }))
                    .filter(expense => expense.category && expense.amount > 0);
                await setExpensesData(processedData);
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    }

    async function refreshAccountExpenses() {
        try {
            const response = await fetch('http://localhost:5500/api/profile/acc_expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName })
            });
            const data = await response.json();
            if (response.ok && data.expenses) {
                // מיפוי הוצאות לפי פרופיל
                const profileExpenses = {};

                // סיכום כל ההוצאות לכל פרופיל
                data.expenses.forEach(category => {
                    const profileName = category.profileName || 'לא ידוע';
                    if (!profileExpenses[profileName]) {
                        profileExpenses[profileName] = 0;
                    }

                    category.items?.forEach(item => {
                        item.transactions?.forEach(transaction => {
                            profileExpenses[profileName] += parseFloat(transaction.price || 0);
                        });
                    });
                });

                // המרה למבנה הנתונים הנדרש לגרף
                const processedData = Object.entries(profileExpenses)
                    .map(([profileName, amount]) => ({
                        category: profileName,
                        amount: amount
                    }))
                    .filter(profile => profile.amount > 0);

                setExpensesData(processedData);
            }
        } catch (error) {
            console.error('Error fetching account expenses:', error);
        }
    }

    async function getProfileBudgetInfo() {
        try {
            // קבלת נתוני התקציב
            const budgetResponse = await fetch('http://localhost:5500/api/profile/get_prof_budget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName })
            });
            const budgetData = await budgetResponse.json();

            // קבלת נתוני ההוצאות
            const expensesResponse = await fetch('http://localhost:5500/api/profile/profile_expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName })
            });
            const expensesData = await expensesResponse.json();



            // עדכון התקציב
            if (budgetResponse.ok && budgetData.budget && budgetData.budget.length > 0) {
                const currentBudget = budgetData.budget.reduce((latest, current) => {
                    const latestStartDate = new Date(latest.startDate);
                    const latestEndDate = new Date(latest.endDate);
                    const currentStartDate = new Date(current.startDate);
                    const currentEndDate = new Date(current.endDate);
                    if (currentStartDate > latestStartDate && currentEndDate > latestEndDate) {
                        return current;
                    }
                    return latest;
                }, budgetData.budget[0]);
                setStartBudgetDate(currentBudget.startDate);
                setEndBudgetDate(currentBudget.endDate);
                const budgetAmount = parseFloat(currentBudget.amount || 0);
                setProfileBudget(budgetAmount);
            }


            // חישוב סך ההוצאות
            let total = 0;
            if (expensesResponse.ok && expensesData.expenses) {
                expensesData.expenses.forEach(category => {
                    category.items.forEach(item => {
                        item.transactions.forEach(transaction => {
                            let date = new Date(transaction.date);
                            if (date >= new Date(startBudgetDate) && date <= new Date(endBudgetDate)) {
                                total += parseFloat(transaction.price || 0);
                            }
                        });
                    });
                });
                setProfitLoss(profileBudget - total);
            }
            setTotalExpenses(total);
        } catch (error) {
            console.error('Error fetching profile budget:', error);
            setProfileBudget(0);
            setTotalExpenses(0);
            setProfitLoss(0);
        }
    }

    // עדכון אוטומטי של הנתונים כל 5 שניות
    useEffect(() => {
        if (username && profileName) {
            getProfileBudgetInfo();
        }
    }, [username, profileName, expensesData]);

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
            setShowGraphs(false);
        }
    }, [showAccExpenses, showProfExpenses, showExpensesByBudget]);

    // Add event listener for transaction updates
    useEffect(() => {
        const handleTransactionUpdate = async () => {
            console.log("Transaction update event received");
            await getProfileBudgetInfo(); // קודם נעדכן את התקציב והסכומים
            await refreshExpenses(); // אז נעדכן את הנתונים לגרפים
        };

        const handleBudgetUpdate = async () => {
            console.log("Budget update event received");
            await getProfileBudgetInfo(); // מעדכן את התקציב והסכומים
            await refreshExpenses(); // מעדכן את הנתונים לגרפים
            if (showExpensesByBudget) {
                setExpensesKey(prevKey => prevKey + 1); // מרענן את תצוגת ההוצאות לפי תקציב
            }
        };

        window.addEventListener('transactionUpdated', handleTransactionUpdate);
        window.addEventListener('budgetUpdated', handleBudgetUpdate);

        return () => {
            window.removeEventListener('transactionUpdated', handleTransactionUpdate);
            window.removeEventListener('budgetUpdated', handleBudgetUpdate);
        };
    }, [showExpensesByBudget]); // הוספנו את showExpensesByBudget כדי שה-effect יתעדכן כשהוא משתנה

    // Function to dispatch transaction update event
    const dispatchTransactionUpdate = () => {
        console.log("Dispatching transaction update event");
        window.dispatchEvent(new CustomEvent('transactionUpdated'));
    };

    // Function to dispatch budget update event
    const dispatchBudgetUpdate = () => {
        console.log("Dispatching budget update event");
        window.dispatchEvent(new CustomEvent('budgetUpdated'));
    };

    const handleFilteredData = (data, type = 'profile') => {
        let processedData = [];

        if (type === 'account') {
            // מיפוי הוצאות לפי פרופיל
            const profileExpenses = {};

            // סיכום כל ההוצאות לכל פרופיל
            data.forEach(category => {
                const profileName = category.profileName || 'לא ידוע';
                if (!profileExpenses[profileName]) {
                    profileExpenses[profileName] = 0;
                }

                category.items?.forEach(item => {
                    item.transactions?.forEach(transaction => {
                        profileExpenses[profileName] += parseFloat(transaction.price || 0);
                    });
                });
            });

            // המרה למבנה הנתונים הנדרש לגרף
            processedData = Object.entries(profileExpenses)
                .map(([profileName, amount]) => ({
                    category: profileName,
                    amount: amount
                }))
                .filter(profile => profile.amount > 0);
        } else if (type === 'profile' || type === 'budget') {
            // עיבוד נתונים עבור הוצאות לפי קטגוריות
            processedData = data.map(expense => ({
                category: expense.categoryName,
                amount: expense.items?.reduce((sum, item) =>
                    sum + (item.transactions?.reduce((tSum, transaction) =>
                        tSum + parseFloat(transaction.price || 0), 0) || 0), 0) || 0
            })).filter(expense => expense.category && expense.amount > 0);
        }

        if (processedData.length > 0) {
            setExpensesData(processedData);
        }
    };

    return (
        <div dir='rtl' className='text-center bg-gray-100 min-h-screen'>
            <Header username={username} profileName={profileName} parent={parent} />
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full p-4'>
                <div className='sm:col-span-2 lg:col-span-1 h-full bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-xl p-4 md:p-6 border border-blue-200'>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6"
                    >
                        <h2 className='text-lg md:text-xl font-semibold text-blue-800 mb-2'>פאנל עריכה</h2>
                        <div className="h-1 w-20 bg-blue-500 rounded-full mx-auto"></div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow duration-300"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center justify-center space-x-2 mb-4"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                                className="text-2xl"
                            >
                                ✏️
                            </motion.div>
                        </motion.div>
                        <ExpenseEditor
                            username={username}
                            profileName={profileName}
                            refreshExpenses={refreshExpenses}
                            onBudgetUpdate={dispatchBudgetUpdate}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-sm text-blue-600 text-center"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTipIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}
                                className="bg-blue-50 p-3 rounded-lg shadow-sm"
                            >
                                <motion.div className="flex items-center justify-center gap-2 text-gray-700">
                                    <motion.span
                                        className="text-xl"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        {tips[currentTipIndex].icon}
                                    </motion.span>
                                    <span className="text-sm">{tips[currentTipIndex].text}</span>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>

                <div className='sm:col-span-2 lg:col-span-3 bg-white shadow-md rounded-xl p-4 md:p-6 border border-gray-300'>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-full sm:w-auto px-4 py-3 text-white font-medium rounded-lg shadow-md transition ${showProfExpenses ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                            onClick={() => {
                                setShowProfExpenses(!showProfExpenses);
                                setShowAccExpenses(false);
                                setShowExpensesByBudget(false);
                                setShowTables(false);
                                setShowGraphs(false);
                                if (!showProfExpenses) {
                                    refreshExpenses();
                                }
                            }}
                        >
                            הוצאות בפרופיל שלך
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-full sm:w-auto px-4 py-3 text-white font-medium rounded-lg shadow-md transition ${showExpensesByBudget ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                            onClick={() => {
                                setShowExpensesByBudget(!showExpensesByBudget);
                                setShowAccExpenses(false);
                                setShowProfExpenses(false);
                                setShowTables(false);
                                setShowGraphs(false);
                            }}
                        >
                            הוצאות ביחס לתקציב
                        </motion.button>
                        {parent && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-full sm:w-auto px-4 py-3 text-white font-medium rounded-lg shadow-md transition ${showAccExpenses ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                                onClick={() => {
                                    setShowAccExpenses(!showAccExpenses);
                                    setShowProfExpenses(false);
                                    setShowExpensesByBudget(false);
                                    setShowTables(false);
                                    setShowGraphs(false);
                                }}
                            >
                                הוצאות בכל הפרופילים
                            </motion.button>
                        )}
                    </div>

                    {/* תצוגת מידע על תקציב - מוצג רק כשאין תצוגת הוצאות פעילה */}
                    {!showProfExpenses && !showAccExpenses && !showExpensesByBudget && (
                        <div className="space-y-8">
                            <div key={profitLoss} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* תקופת תקציב לתצוגה*/}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center
                                     transform transition-all duration-300 hover:shadow-xl md:col-span-3"
                                >
                                    <h3 className="text-lg text-blue-800 mb-3 font-semibold">תקופת הגדרת תקציב אחרונה</h3>
                                    <motion.p
                                        key={profileBudget}
                                        initial={{ scale: 0.5 }}
                                        animate={{ scale: 1 }}
                                        className="text-2xl font-bold text-blue-600"
                                    >
                                        מתאריך: {formatDate(startBudgetDate)}<br></br> עד תאריך: {formatDate(endBudgetDate)}
                                    </motion.p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center transform transition-all duration-300 hover:shadow-xl"
                                >
                                    <h3 className="text-lg text-blue-800 mb-3 font-semibold">תקציב פרופיל</h3>
                                    <motion.p
                                        key={profileBudget}
                                        initial={{ scale: 0.5 }}
                                        animate={{ scale: 1 }}
                                        className="text-2xl font-bold text-blue-600"
                                    >
                                        {formatCurrency(profileBudget)}
                                    </motion.p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                    className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center transform transition-all duration-300 hover:shadow-xl"
                                >
                                    <h3 className="text-lg text-purple-800 mb-3 font-semibold">סך הוצאות</h3>
                                    <motion.p
                                        key={totalExpenses}
                                        initial={{ scale: 0.5 }}
                                        animate={{ scale: 1 }}
                                        className="text-2xl font-bold text-purple-600"
                                    >
                                        {formatCurrency(totalExpenses)}
                                    </motion.p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                    className={`bg-gradient-to-br ${profitLoss >= 0 ? 'from-green-50 to-green-100' : 'from-red-50 to-red-100'} rounded-lg shadow-lg p-6 flex flex-col items-center justify-center transform transition-all duration-300 hover:shadow-xl`}
                                >
                                    <h3 className={`text-lg ${profitLoss >= 0 ? 'text-green-800' : 'text-red-800'} mb-3 font-semibold`}>רווח/הפסד</h3>
                                    <motion.p
                                        key={profitLoss}
                                        initial={{ scale: 0.5 }}
                                        animate={{ scale: 1 }}
                                        className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}
                                    >
                                        {formatCurrency(profitLoss)}
                                    </motion.p>
                                </motion.div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">סטטיסטיקות מהירות</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* אחוז ניצול התקציב */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-lg font-medium text-gray-700 mb-3">ניצול תקציב</h4>
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div>
                                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                                        התקדמות
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-semibold inline-block text-blue-600">
                                                        {profileBudget > 0 ? `${Math.min(100, Math.round((totalExpenses / profileBudget) * 100))}%` : '0%'}
                                                    </span>
                                                </div>
                                            </div>
                                            <motion.div
                                                className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200"
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: '100%',
                                                    transition: { duration: 0.5 }
                                                }}
                                            >
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: `${profileBudget > 0 ? Math.min(100, Math.round((totalExpenses / profileBudget) * 100)) : 0}%`,
                                                        transition: { duration: 0.8, delay: 0.3 }
                                                    }}
                                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${totalExpenses > profileBudget ? 'bg-red-500' : 'bg-blue-500'
                                                        }`}
                                                ></motion.div>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* סטטוס תקציב */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-lg font-medium text-gray-700 mb-3">סטטוס תקציב</h4>
                                        <div className="flex flex-col items-center gap-2">
                                            <motion.div
                                                className={`text-lg font-semibold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                {profitLoss >= 0 ? 'בתקציב ✓' : 'חריגה מהתקציב ⚠️'}
                                            </motion.div>
                                            <motion.div
                                                className={`text-base ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                            >
                                                {profitLoss >= 0
                                                    ? `נשאר ${formatCurrency(profitLoss)} בתקציב`
                                                    : `חריגה של ${formatCurrency(Math.abs(profitLoss))}`
                                                }
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {(showProfExpenses || showAccExpenses || showExpensesByBudget) && (
                        <div className='flex justify-center gap-4 mb-6'>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-2 text-white font-medium rounded-lg shadow-md transition ${showTables ? 'bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
                                onClick={() => {
                                    setShowTables(!showTables);
                                    setShowGraphs(false);
                                }}
                            >
                                הצג טבלאות
                            </motion.button>
                            {!showExpensesByBudget && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-6 py-2 text-white font-medium rounded-lg shadow-md transition ${showGraphs ? 'bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
                                    onClick={() => {
                                        setShowGraphs(!showGraphs);
                                        setShowTables(false);
                                    }}
                                >
                                    הצג גרפים
                                </motion.button>
                            )}
                        </div>
                    )}

                    <div className='mt-4'>
                        {showTables && (
                            <>
                                {showAccExpenses && (
                                    <div key={`acc-${expensesKey}`} className="bg-gray-50 p-4 rounded-lg shadow-md">
                                        <AccountExpenses
                                            username={username}
                                            profileName={profileName}
                                            onFilteredData={(data) => handleFilteredData(data, 'account')}
                                        />
                                    </div>
                                )}
                                {showProfExpenses && (
                                    <div key={`prof-${expensesKey}`} className="bg-gray-50 p-4 rounded-lg shadow-md">
                                        <ProfileExpenses
                                            username={username}
                                            profileName={profileName}
                                            onFilteredData={(data) => handleFilteredData(data, 'profile')}
                                            onTransactionUpdate={dispatchTransactionUpdate}
                                        />
                                    </div>
                                )}
                                {showExpensesByBudget && (
                                    <div key={`budget-${expensesKey}`} className="bg-gray-50 p-4 rounded-lg shadow-md">
                                        <ExpensesByBudget
                                            username={username}
                                            profileName={profileName}
                                            onFilteredData={(data) => handleFilteredData(data, 'budget')}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                        {showGraphs && (
                            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                                {showAccExpenses && (
                                    <AccountExpenses
                                        username={username}
                                        profileName={profileName}
                                        onFilteredData={(data) => handleFilteredData(data, 'account')}
                                        showOnlyFilters={true}
                                        inGraph={showGraphs}
                                    />
                                )}
                                {showProfExpenses && (
                                    <ProfileExpenses
                                        username={username}
                                        profileName={profileName}
                                        onFilteredData={(data) => handleFilteredData(data, 'profile')}
                                        showOnlyFilters={true}
                                    />
                                )}
                                <div className="flex flex-col gap-8">
                                    <div className="flex justify-center">
                                        <PieChart
                                            key={`pie-${currentType}-${JSON.stringify(expensesData)}`}
                                            data={expensesData}
                                            chartType={currentType}
                                            username={username}
                                            profileName={profileName}
                                        />
                                    </div>
                                    <div className="flex justify-center">
                                        {!showAccExpenses && < BarChart
                                            key={`bar-${currentType}-${JSON.stringify(expensesData)}`}
                                            data={expensesData}
                                            chartType={currentType}
                                            username={username}
                                            profileName={profileName}
                                        />
                                        }
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}