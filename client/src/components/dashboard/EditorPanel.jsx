export default function EditorPanel({ username, profileName, refreshExpenses, onBudgetUpdate, tips, currentTipIndex }) {

    return (
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
                    onBudgetUpdate={onBudgetUpdate}
                />
            </motion.div>

            <TipDisplay currentTipIndex={currentTipIndex} tips={tips} />
        </div>
    );
}