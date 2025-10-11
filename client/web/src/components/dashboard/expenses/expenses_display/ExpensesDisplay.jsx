import { useState, useMemo } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import useExpensesDisplay from '../../../../hooks/useExpensesDisplay';
import useChildrenData from '../../../../hooks/expenses/useChildrenData';
import LoadingSpinner from '../../../common/LoadingSpinner';
import ErrorMessage from '../../../common/ErrorMessage';
import ExpensesTable from './ExpensesTable';
import Filters from './Filters';
import ExpensesSummary from './ExpensesSummary';

export default function ExpensesDisplay({ profile }) {
    const { profile: authProfile } = useAuth();

    // Get parent expenses
    const { expenses: parentExpenses, filteredExpenses: parentFilteredExpenses, 
           loading: parentLoading, error: parentError, filters: parentFilters,
           setFilters: setParentFilters, categories: parentCategories, 
           businesses: parentBusinesses, refetchExpenses: refetchParentExpenses } = useExpensesDisplay(profile);

    // Get children data
    const { children, loading: childrenLoading, error: childrenError,
           childrenExpenses, selectedChild, setSelectedChild,
           childrenCategories, childrenBusinesses } = useChildrenData();



    // Process child expenses to flat format like parent expenses (same logic as useExpensesDisplay)
    const processedChildExpenses = useMemo(() => {
        if (!childrenExpenses || childrenExpenses.length === 0) return [];
        
        const processed = [];
        childrenExpenses.forEach(category => {
            if (category.Businesses) {
                category.Businesses.forEach(business => {
                    if (business.transactionsArray) {
                        business.transactionsArray.forEach(transactionGroup => {
                            if (transactionGroup.transactions) {
                                transactionGroup.transactions.forEach(transaction => {
                                    processed.push({
                                        _id: transaction._id,
                                        amount: transaction.amount,
                                        date: new Date(transaction.date),
                                        description: transaction.description || '',
                                        category: category.name,
                                        business: business.name,
                                        bank: transactionGroup.bank || ''
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
        return processed;
    }, [childrenExpenses]);

    // Determine which data to show
    const expenses = selectedChild ? processedChildExpenses : parentExpenses;
    const filteredExpenses = selectedChild ? processedChildExpenses : parentFilteredExpenses; 
    const loading = selectedChild ? childrenLoading : parentLoading;
    const error = selectedChild ? childrenError : parentError;
    const categories = selectedChild ? childrenCategories : parentCategories;
    const businesses = selectedChild ? childrenBusinesses : parentBusinesses;
    const filters = parentFilters; // Use parent filters for now
    const setFilters = setParentFilters;
    const refetchExpenses = selectedChild ? () => setSelectedChild(selectedChild) : refetchParentExpenses;

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6">
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-xl font-bold text-slate-700 mb-2">שגיאה בטעינת הנתונים</div>
                    <div className="text-slate-500">{error}</div>
                </div>
            </div>
        );
    }

    if (expenses && expenses.length === 0) {
        return (
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">הוצאות</h2>
                </div>
                <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <div className="text-xl font-bold text-slate-600 mb-3">עדיין אין הוצאות</div>
                    <div className="text-slate-500 mb-6">הוסף את ההוצאה הראשונה שלך כדי להתחיל</div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        השתמש בכפתור הפעולות המהירות
                    </div>
                </div>
            </div>
        );
    }



    return (
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">הוצאות</h2>
                            <p className="text-white/80 text-sm">מעקב ובקרה על כל העסקאות</p>
                        </div>
                    </div>
                    
                    {/* Profile Selector - only show for parent profiles */}
                    {(authProfile?.parentProfile || profile?.parentProfile) && children && children.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-white/80 text-sm">צפה בפרופיל:</span>
                            <select
                                value={selectedChild || ''}
                                onChange={(e) => setSelectedChild(e.target.value || null)}
                                className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                            >
                                <option value="">שלי</option>
                                {children.map((child) => (
                                    <option key={child.id} value={child.id} className="text-black">
                                        {child.profileName || child.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Profile indicator when viewing child */}
                {selectedChild && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-blue-800 font-medium">
                                מציג הוצאות של: {children.find(child => child.id === selectedChild)?.profileName || children.find(child => child.id === selectedChild)?.name}
                            </div>
                            <div className="text-blue-600 text-sm">מצב צפייה בלבד</div>
                        </div>
                    </div>
                )}
                
                <Filters filters={filters} setFilters={setFilters} categories={categories} businesses={businesses} />
                <ExpensesSummary filteredExpenses={filteredExpenses} />
                <ExpensesTable 
                    filteredExpenses={filteredExpenses} 
                    expensesId={profile.expenses} 
                    onTransactionDeleted={refetchExpenses}
                    readOnly={!!selectedChild} 
                />
            </div>
        </div>
    );
}
