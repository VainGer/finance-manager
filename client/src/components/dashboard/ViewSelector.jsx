import { motion } from 'framer-motion';

export default function ViewSelector({
    showProfExpenses,
    showExpensesByBudget,
    showAccExpenses,
    onProfileClick,
    onBudgetClick,
    onAccountClick,
    parent
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full sm:w-auto px-4 py-3 text-white font-medium rounded-lg shadow-md transition ${showProfExpenses ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                onClick={onProfileClick}
            >
                הוצאות בפרופיל שלך
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full sm:w-auto px-4 py-3 text-white font-medium rounded-lg shadow-md transition ${showExpensesByBudget ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                onClick={onBudgetClick}
            >
                הוצאות ביחס לתקציב
            </motion.button>

            {parent && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full sm:w-auto px-4 py-3 text-white font-medium rounded-lg shadow-md transition ${showAccExpenses ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                    onClick={onAccountClick}
                >
                    הוצאות בכל הפרופילים
                </motion.button>
            )}
        </div>
    );
}