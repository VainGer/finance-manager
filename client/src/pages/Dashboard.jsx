import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../context/AuthContext';

import Header from '../components/Header';
import BudgetSummaryDisplay from '../components/dashboard/BudgetSummaryDisplay';
import ViewSelector from '../components/dashboard/ViewSelector';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import ProfileExpenses from '../components/expenses/ProfileExpenses';


export default function Dashboard() {
    const navigate = useNavigate();
    const auth = useAuth();
    const username = auth?.user;
    const profileName = auth?.profile?.profileName;
    const parent = auth?.profile?.parent;

    const [showProfExpenses, setShowProfExpenses] = useState(false);
    const [showAccExpenses, setShowAccExpenses] = useState(false);
    const [showExpensesByBudget, setShowExpensesByBudget] = useState(false);

    const showBudgetSummary = !showProfExpenses && !showAccExpenses && !showExpensesByBudget;

    useEffect(() => {
        if (!username || !profileName) {
            navigate('/', { state: { notLogedIn: true } });
        }
    }, [username, profileName]);

    const onProfileClick = () => {
        setShowProfExpenses(!showProfExpenses);
        setShowAccExpenses(false);
        setShowExpensesByBudget(false);
    };
    const onBudgetClick = () => {
        setShowProfExpenses(false);
        setShowAccExpenses(false);
        setShowExpensesByBudget(!showExpensesByBudget);
    };
    const onAccountClick = () => {
        setShowProfExpenses(false);
        setShowAccExpenses(!showAccExpenses);
        setShowExpensesByBudget(false);
    };

    return (
        <div dir='rtl' className='text-center bg-gray-100 min-h-screen'>
            {/* Header */}
            <Header username={username} profileName={profileName} parent={parent} />
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full p-4'>
                <DashboardSidebar username={username} profileName={profileName} />
                <div className='sm:col-span-2 lg:col-span-3 bg-white shadow-md rounded-xl p-4 md:p-6 border border-gray-300'>
                    {/*selector*/}
                    <ViewSelector
                        onProfileClick={onProfileClick}
                        onBudgetClick={onBudgetClick}
                        onAccountClick={onAccountClick}
                        parent={parent} />
                    {/*main content*/}
                    {showBudgetSummary
                        && <BudgetSummaryDisplay username={username} profileName={profileName} />}
                    {showProfExpenses && <ProfileExpenses username={username} profileName={profileName} />}
                    {showAccExpenses && <div>Account Expenses</div>}
                    {showExpensesByBudget && <div>Expenses by Budget</div>}
                </div>
            </div>

        </div>
    );
}