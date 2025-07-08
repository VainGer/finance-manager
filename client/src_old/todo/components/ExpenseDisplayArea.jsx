import { motion } from 'framer-motion';
import AccountExpenses from './AccountExpenses';
import ProfileExpenses from './ProfileExpenses';
import ExpensesByBudget from './ExpensesByBudget';
import PieChart from './PieChart';
import BarChart from './BarChart';

export default function ExpenseDisplayArea({
    showProfExpenses,
    showAccExpenses,
    showExpensesByBudget,
    showTables,
    showGraphs,
    onShowTablesClick,
    onShowGraphsClick,
    username,
    profileName,
    expensesKey, // For re-rendering tables
    handleFilteredData, // For graphs
    dispatchTransactionUpdate, // For ProfileExpenses table
    currentType, // For graphs
    expensesData // For graphs
}) {
    return (
        <>

            <div className='flex justify-center gap-4 mb-6'>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-2 text-white font-medium rounded-lg shadow-md transition ${showTables ? 'bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
                    onClick={onShowTablesClick}
                >
                    הצג טבלאות
                </motion.button>
                {!showExpensesByBudget && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-2 text-white font-medium rounded-lg shadow-md transition ${showGraphs ? 'bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
                        onClick={onShowGraphsClick}
                    >
                        הצג גרפים
                    </motion.button>
                )}
            </div>


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
                                inGraph={showGraphs} // Pass inGraph prop
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


                        <div className="flex flex-col gap-8 mt-4">
                            <div className="flex justify-center">
                                <PieChart
                                    key={`pie-${currentType}-${JSON.stringify(expensesData)}`}
                                    data={expensesData}
                                    chartType={currentType}
                                    username={username}
                                    profileName={profileName}
                                />
                            </div>
                            {!showAccExpenses && (
                                <div className="flex justify-center">
                                    <BarChart
                                        key={`bar-${currentType}-${JSON.stringify(expensesData)}`}
                                        data={expensesData}
                                        chartType={currentType}
                                        username={username}
                                        profileName={profileName}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}