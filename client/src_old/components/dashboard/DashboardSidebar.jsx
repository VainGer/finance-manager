import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SidePanel from '../../todo/components/SidePanel';


export default function DashboardSidebar({
    username,
    profileName,
}) {

    const [currentTipIndex, setCurrentTipIndex] = useState(0);

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
    }, [tips.length]);

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
                <SidePanel
                    username={username}
                    profileName={profileName}
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
                                {tips[currentTipIndex]?.icon}
                            </motion.span>
                            <span className="text-sm">{tips[currentTipIndex]?.text}</span>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
}