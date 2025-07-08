import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { FaChartLine, FaWallet, FaClipboardList } from 'react-icons/fa';
import FeatureCard from '../components/home/FeatureCard';


export default function Home() {
    const location = useLocation();

    const [wasNotLogedIn, setWasNotLogedIn] = useState(location.state?.notLogedIn);

    return (
        <div key={location.pathname} dir='rtl' className='bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen mb-4'>
            <Header />
            <div className='flex flex-col items-center justify-center min-h-screen px-4 text-gray-900'>


                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className='text-lg text-gray-600 text-center mb-4 max-w-2xl'
                >
                    ברוכים הבאים לאפליקציית ניהול הכספים החכמה שלנו! כאן תוכלו לנתח את הוצאותיכם, לשלוט בתקציב שלכם ולנהל את כל ההוצאות במקום אחד בצורה קלה ויעילה.
                </motion.p>


                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className='text-6xl font-bold text-blue-700 tracking-wide text-center mb-6'
                >
                    ניהול כספים חכם
                </motion.h1>


                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
                    }}
                    className='grid grid-cols-1 md:grid-cols-3 gap-6 text-center'
                >
                    <FeatureCard
                        icon={<FaChartLine />}
                        title="ניתוח הוצאות"
                        desc="צפו בגרפים ודוחות מפורטים שיעזרו לכם לנהל את התקציב."

                    />
                    <FeatureCard
                        icon={<FaWallet />}
                        title="שליטה בתקציב"
                        desc="קבעו גבולות תקציב וקבלו התראות כשמתקרבים אליהם."

                    />
                    <FeatureCard
                        icon={<FaClipboardList />}
                        title="רישום הוצאות חכם"
                        desc="תעדו בקלות כל הוצאה והכנסה ונהלו הכל במקום אחד."

                    />
                </motion.div>


                <motion.button
                    transition={{ duration: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className='mt-8 px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-xl shadow-lg hover:bg-blue-700 transition-all'
                    onClick={() => navigate('/register')}
                >
                    התחילו עכשיו
                </motion.button>

            </div>
            {wasNotLogedIn &&
                <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className='w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl border border-gray-300 relative text-center'
                    >
                        <p>לפני שימוש במערכת עליך קודם להתחבר</p>
                        <motion.button
                            transition={{ duration: 0 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className='mt-8 px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-xl shadow-lg hover:bg-blue-700 transition-all'
                            onClick={() => setWasNotLogedIn(false)}
                        >
                            לאישור לחץ כאן
                        </motion.button>
                    </motion.div>
                </div>
            }
        </div>
    );
}