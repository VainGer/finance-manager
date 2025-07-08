import { motion } from 'framer-motion';

export default function ViewSelector({
    onProfileClick,
    onBudgetClick,
    onAccountClick,
    parent
}) {

    return (
        <div className="col-span-3 grid grid-cols-3 w-max h-max mx-auto gap-4 mb-4">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full sm:w-auto px-4 py-3 text-white font-medium rounded-lg shadow-md bg-blue-600 hover:bg-blue-700`}
                onClick={onProfileClick}
            >
                הוצאות בפרופיל שלך
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full sm:w-auto px-4 py-3 text-white font-medium rounded-lg shadow-md bg-blue-600 hover:bg-blue-700`}
                onClick={onBudgetClick}
            >
                הוצאות ביחס לתקציב
            </motion.button>

            {parent && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full sm:w-auto px-4 py-3 text-white font-medium rounded-lg shadow-md bg-blue-600 hover:bg-blue-700`}
                    onClick={onAccountClick}
                >
                    הוצאות בכל הפרופילים
                </motion.button>
            )}
        </div>
    );
}