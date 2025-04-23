import { motion } from "framer-motion";

export default function FeatureCard({ icon, title, desc, onClick }) {
    return (
        <motion.div
            transition={{ duration: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center border border-gray-200 max-w-xs cursor-pointer hover:bg-gray-100 transition-all'
            onClick={onClick}
        >
            <div className='text-blue-600 text-4xl mb-4'>{icon}</div>
            <h3 className='text-2xl font-semibold mb-2'>{title}</h3>
            <p className='text-gray-600 text-sm'>{desc}</p>
        </motion.div>
    );
}