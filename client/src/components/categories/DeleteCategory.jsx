import { removeCategory } from "../../API/category"
import { motion } from "framer-motion"

export default function DeleteCategory({ username, profileName, chosenCategory, setShowDeleteConfirm }) {

    async function handleDeleteCategory(e) {
        e.preventDefault();

        const response = await removeCategory(username, profileName, chosenCategory);

        if (response.status === 200) {
            setShowDeleteConfirm(false);
        }

        if (response.status === 404 || response.status === 400) {
            console.log("Category not found or already deleted")
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md px-4 z-[60]"
        >
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md text-center relative">
                <h3 className="text-xl font-bold text-gray-800 mb-4">האם אתה בטוח?</h3>
                <p className="text-gray-600 mb-6">האם אתה בטוח שברצונך למחוק את הקטגוריה "{chosenCategory}"?</p>

                <div className="flex justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        onClick={handleDeleteCategory}
                    >
                        אישור
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                        ביטול
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}