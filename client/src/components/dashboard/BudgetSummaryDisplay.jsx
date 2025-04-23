import { motion } from 'framer-motion';

export default function BudgetSummaryDisplay({
    profileBudget,
    totalExpenses,
    profitLoss,
    startBudgetDate,
    endBudgetDate,
    formatCurrency,
    formatDate
}) {
    const budgetUtilization = profileBudget > 0 ? Math.min(100, Math.round((totalExpenses / profileBudget) * 100)) : 0;
    const budgetStatusText = profitLoss >= 0 ? 'בתקציב ✓' : 'חריגה מהתקציב ⚠️';
    const budgetStatusDetail = profitLoss >= 0
        ? `נשאר ${formatCurrency(profitLoss)} בתקציב`
        : `חריגה של ${formatCurrency(Math.abs(profitLoss))}`;

    return (
        <div className="space-y-8">

            <div key={profitLoss} className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center transform transition-all duration-300 hover:shadow-xl md:col-span-3"
                >
                    <h3 className="text-lg text-blue-800 mb-3 font-semibold">תקופת הגדרת תקציב אחרונה</h3>
                    <motion.p
                        key={`${startBudgetDate}-${endBudgetDate}`} // Use dates for key
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-bold text-blue-600"
                    >
                        מתאריך: {formatDate(startBudgetDate)}<br /> עד תאריך: {formatDate(endBudgetDate)}
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
                                        {budgetUtilization}%
                                    </span>
                                </div>
                            </div>
                            <motion.div
                                className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200"
                                initial={{ width: 0 }}
                                animate={{ width: '100%', transition: { duration: 0.5 } }}
                            >
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${budgetUtilization}%`, transition: { duration: 0.8, delay: 0.3 } }}
                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${totalExpenses > profileBudget ? 'bg-red-500' : 'bg-blue-500'}`}
                                ></motion.div>
                            </motion.div>
                        </div>
                    </div>


                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-medium text-gray-700 mb-3">סטטוס תקציב</h4>
                        <div className="flex flex-col items-center gap-2">
                            <motion.div
                                className={`text-lg font-semibold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {budgetStatusText}
                            </motion.div>
                            <motion.div
                                className={`text-base ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                {budgetStatusDetail}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}