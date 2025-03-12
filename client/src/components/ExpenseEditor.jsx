import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaExchangeAlt, FaPiggyBank, FaTimes, FaLightbulb } from "react-icons/fa";
import GetCats from "./GetCats";
import AddItem from "./AddItem";
import AddCategory from "./AddCategory";
import RemoveCategory from "./RemoveCategory";
import RenameCategory from "./RenameCategory";
import RenameItem from "./RenameItem";
import MoveItem from "./MoveItem";
import SetProfBudget from "./SetProfBudget";
import SetCategoryBudget from "./SetCategoryBudget";

export default function ExpenseEditor({ username, profileName, refreshExpenses }) {
    const [chosenCategory, setChosenCategory] = useState("");
    const [showCategories, setShowCategories] = useState(true);
    const [showControlCenter, setShowControlCenter] = useState(false);
    const [showAction, setShowAction] = useState(null);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showSetBudget, setShowSetBudget] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    


    const onCategoryClick = (category) => {
        setChosenCategory(category);
        setShowCategories(false);
        setShowControlCenter(true);
    };

    const closeControlCenter = () => {
        setShowCategories(true);
        setShowControlCenter(false);
        setShowAction(null);
    };

    const handleActionClose = (result) => {
        if (result && result.type === 'rename') {
            setChosenCategory(result.newName);
        }
        setShowAction(null);
    };

    const openAction = (action) => {
        setShowAction(action);
    };

    const handleDeleteCategory = async () => {
        try {
            const response = await fetch('http://localhost:5500/api/profile/rem_cat_items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    profileName,
                    category: chosenCategory
                })
            });

            if (response.ok) {
                refreshExpenses();
                closeControlCenter();
                setShowDeleteConfirm(false);
            } else {
                const error = await response.text();
                console.error('Failed to delete category:', error);
                alert('שגיאה במחיקת הקטגוריה');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('שגיאה במחיקת הקטגוריה');
        }
    };

    return (
        <div className="relative my-4 md:my-6 grid h-auto overflow-y-auto border-1 rounded-md bg-gradient-to-b from-blue-50 to-blue-100 p-4 md:p-6 shadow-lg">
            {showCategories && (
                <div>
                    <h2 className="text-lg md:text-xl font-semibold text-center text-blue-700 mb-3 md:mb-4">בחר קטגוריה</h2>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <GetCats username={username} profileName={profileName} onCategoryClick={onCategoryClick} forAccount={false} />

                        <div className="grid gap-3 md:gap-4 mt-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 md:px-4 py-2 md:py-3 bg-green-500 text-white rounded-lg flex items-center gap-2 justify-center hover:bg-green-700 transition text-sm md:text-base"
                                onClick={() => setShowAddCategory(true)}
                            >
                                <FaPlus size={14} className="md:size-4" /> הוסף קטגוריה
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 md:px-4 py-2 md:py-3 bg-yellow-500 text-white rounded-lg flex items-center gap-2 justify-center hover:bg-yellow-700 transition text-sm md:text-base"
                                onClick={() => setShowSetBudget(true)}
                            >
                                <FaPiggyBank size={14} className="md:size-4" /> הגדר תקציב פרופיל
                            </motion.button>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTipIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}
                                className="mt-4 bg-blue-50 p-3 rounded-lg shadow-sm"
                            >
                                
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {showControlCenter && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md px-4 z-50"
                >
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-2xl w-full max-w-lg text-center relative mx-4">
                        <button className="absolute top-3 left-3 text-gray-500 hover:text-gray-700" onClick={closeControlCenter}>
                            <FaTimes size={20} />
                        </button>
                        <h2 className="text-xl md:text-2xl font-bold text-blue-700 mb-4 md:mb-6">ניהול קטגוריה: {chosenCategory}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="px-3 md:px-4 py-2 md:py-3 bg-blue-500 text-white rounded-lg flex items-center gap-2 md:gap-3 justify-center hover:bg-blue-700 transition text-sm md:text-base"
                                onClick={() => openAction("setCatBudget")}
                            >
                                <FaPiggyBank size={16} />
                                <span className="font-medium">תקציב לקטגוריה</span>
                            </motion.button>

                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="px-3 md:px-4 py-2 md:py-3 bg-green-600 text-white rounded-lg flex items-center gap-2 md:gap-3 justify-center hover:bg-green-700 transition text-sm md:text-base"
                                onClick={() => openAction("addItem")}
                            >
                                <FaPlus size={16} />
                                <span className="font-medium">הוסף פריט</span>
                            </motion.button>

                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="px-3 md:px-4 py-2 md:py-3 bg-blue-500 text-white rounded-lg flex items-center gap-2 md:gap-3 justify-center hover:bg-blue-700 transition text-sm md:text-base"
                                onClick={() => openAction("renameCategory")}
                            >
                                <FaEdit size={16} />
                                <span className="font-medium">שנה שם קטגוריה</span>
                            </motion.button>

                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="px-3 md:px-4 py-2 md:py-3 bg-blue-500 text-white rounded-lg flex items-center gap-2 md:gap-3 justify-center hover:bg-blue-700 transition text-sm md:text-base"
                                onClick={() => openAction("renameItem")}
                            >
                                <FaEdit size={16} />
                                <span className="font-medium">שנה שם פריט</span>
                            </motion.button>

                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="px-3 md:px-4 py-2 md:py-3 bg-purple-500 text-white rounded-lg flex items-center gap-2 md:gap-3 justify-center hover:bg-purple-700 transition text-sm md:text-base"
                                onClick={() => openAction("moveItem")}
                            >
                                <FaExchangeAlt size={16} />
                                <span className="font-medium">העבר פריט</span>
                            </motion.button>

                            <motion.button 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }}
                                className="px-3 md:px-4 py-2 md:py-3 bg-red-600 text-white rounded-lg flex items-center gap-2 md:gap-3 justify-center hover:bg-red-700 transition text-sm md:text-base"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                <FaTrash size={16} />
                                <span className="font-medium">מחק קטגוריה</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}

            {showAction && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4">
                    {showAction === "setCatBudget" && <SetCategoryBudget username={username} profileName={profileName} category={chosenCategory} showConfirm={handleActionClose} refreshExpenses={refreshExpenses} />}
                    {showAction === "addItem" && <AddItem username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} showConfirm={handleActionClose} />}
                    {showAction === "renameCategory" && <RenameCategory username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} showConfirm={handleActionClose} />}
                    {showAction === "renameItem" && <RenameItem username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} showConfirm={handleActionClose} />}
                    {showAction === "moveItem" && <MoveItem username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} showConfirm={handleActionClose} />}
                    {showAction === "removeCategory" && <RemoveCategory username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} showConfirm={handleActionClose} />}
                </motion.div>
            )}

            {showAddCategory && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md px-4 z-50"
                >
                    <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg text-center relative">
                        <AddCategory 
                            username={username} 
                            profileName={profileName} 
                            refreshExpenses={refreshExpenses} 
                            onClose={() => setShowAddCategory(false)} 
                        />
                    </div>
                </motion.div>
            )}

            {showSetBudget && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md px-4 z-50">
                    <div className="">
                        <SetProfBudget username={username} profileName={profileName} refreshExpenses={refreshExpenses} showConfirm={setShowSetBudget} />
                       
                    </div>
                </motion.div>
            )}

            {showDeleteConfirm && (
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
            )}
        </div>
    );
}