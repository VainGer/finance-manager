import { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaExchangeAlt, FaPiggyBank, FaTimes } from "react-icons/fa";
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

    const openAction = (action) => {
        setShowAction(action);
    };

    return (
        <div className="relative my-6 grid h-auto overflow-y-auto border-1 rounded-md bg-white p-6 shadow-lg">
            {showCategories && (
                <div>
                    <h2 className="text-xl font-semibold text-center text-blue-700 mb-4">בחר קטגוריה</h2>
                    <GetCats username={username} profileName={profileName} onCategoryClick={onCategoryClick} forAccount={false} />

                    <div className="grid gap-4 mt-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-3 bg-green-500 text-white rounded-lg flex items-center gap-2 justify-center hover:bg-green-700 transition"
                            onClick={() => setShowAddCategory(true)}
                        >
                            <FaPlus /> הוסף קטגוריה
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-3 bg-yellow-500 text-white rounded-lg flex items-center gap-2 justify-center hover:bg-yellow-700 transition"
                            onClick={() => setShowSetBudget(true)}
                        >
                            <FaPiggyBank /> הגדר תקציב פרופיל
                        </motion.button>
                    </div>
                </div>
            )}

            {showControlCenter && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md px-4 z-50"
                >
                    <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg text-center relative">
                        <button className="absolute top-3 left-3 text-gray-500 hover:text-gray-700" onClick={closeControlCenter}>
                            <FaTimes size={20} />
                        </button>
                        <h2 className="text-2xl font-bold text-blue-700 mb-6">ניהול קטגוריה: {chosenCategory}</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="px-4 py-3 bg-blue-500 text-white rounded-lg flex items-center gap-3 justify-center hover:bg-blue-700 transition"
                                onClick={() => openAction("setCatBudget")}
                            >
                                <FaPiggyBank size={18} />
                                <span className="font-medium">תקציב לקטגוריה</span>
                            </motion.button>

                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="px-4 py-3 bg-green-600 text-white rounded-lg flex items-center gap-3 justify-center hover:bg-green-700 transition"
                                onClick={() => openAction("addItem")}
                            >
                                <FaPlus size={18} />
                                <span className="font-medium">הוסף פריט</span>
                            </motion.button>

                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="px-4 py-3 bg-blue-500 text-white rounded-lg flex items-center gap-3 justify-center hover:bg-blue-700 transition"
                                onClick={() => openAction("renameCategory")}
                            >
                                <FaEdit size={18} />
                                <span className="font-medium">שנה שם קטגוריה</span>
                            </motion.button>

                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="px-4 py-3 bg-blue-500 text-white rounded-lg flex items-center gap-3 justify-center hover:bg-blue-700 transition"
                                onClick={() => openAction("renameItem")}
                            >
                                <FaEdit size={18} />
                                <span className="font-medium">שנה שם פריט</span>
                            </motion.button>

                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="px-4 py-3 bg-purple-500 text-white rounded-lg flex items-center gap-3 justify-center hover:bg-purple-700 transition"
                                onClick={() => openAction("moveItem")}
                            >
                                <FaExchangeAlt size={18} />
                                <span className="font-medium">העבר פריט</span>
                            </motion.button>

                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="px-4 py-3 bg-red-600 text-white rounded-lg flex items-center gap-3 justify-center hover:bg-red-700 transition"
                                onClick={() => openAction("removeCategory")}
                            >
                                <FaTrash size={18} />
                                <span className="font-medium">מחק קטגוריה</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}

            {showAction && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4">
                    {showAction === "setCatBudget" && <SetCategoryBudget username={username} profileName={profileName} category={chosenCategory} showConfirm={setShowAction} refreshExpenses={refreshExpenses} />}
                    {showAction === "addItem" && <AddItem username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} showConfirm={setShowAction} />}
                    {showAction === "renameCategory" && <RenameCategory username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} showConfirm={setShowAction} />}
                    {showAction === "renameItem" && <RenameItem username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} showConfirm={setShowAction} />}
                    {showAction === "moveItem" && <MoveItem username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} showConfirm={setShowAction} />}
                    {showAction === "removeCategory" && <RemoveCategory username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} showConfirm={setShowAction} />}
                </motion.div>
            )}

            {showAddCategory && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md px-4 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg text-center">
                        <AddCategory username={username} profileName={profileName} refreshExpenses={refreshExpenses} showConfirm={setShowAddCategory} />
                        <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition" onClick={() => setShowAddCategory(false)}>ביטול</button>
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
        </div>
    );
}