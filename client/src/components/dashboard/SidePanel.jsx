import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaExchangeAlt, FaPiggyBank, FaTimes } from "react-icons/fa";
import AddItem from "../business/AddBusiness";
import AddCategory from "../categories/AddCategory";
import RenameCategory from "../categories/RenameCategory";
import RenameBusiness from "../business/RenameBusiness";
import MoveBusiness from "../business/MoveBusiness";
import SetProfBudget from "../../todo/components/SetProfBudget";
import SetCategoryBudget from "../../todo/components/SetCategoryBudget";
import DeleteCategory from "../categories/DeleteCategory";
import GetCategories from "../categories/GetCategories";

const buttonBaseClasses = "px-3 md:px-4 py-2 md:py-3 text-white rounded-lg flex items-center gap-2 md:gap-3 justify-center transition text-sm md:text-base";

export default function SidePanel({ username, profileName, refreshExpenses }) {
    const [chosenCategory, setChosenCategory] = useState("");
    const [showControlCenter, setShowControlCenter] = useState(false);
    const [showAction, setShowAction] = useState(null);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showSetBudget, setShowSetBudget] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [categoryKey, setCategoryKey] = useState(0);

    const onCategoryClick = (category) => {
        setChosenCategory(category);
        setShowControlCenter(true);
    };

    const closeControlCenter = () => {
        setShowControlCenter(false);
        setShowAction(null);
    };

    const handleActionClose = (result) => {
        if (result?.type === 'rename') {
            setChosenCategory(result.newName);
        }
        setShowAction(null);
    };

    const handleAddCategoryClose = () => {
        setShowAddCategory(false);
        setCategoryKey(prev => prev + 1);
    };

    const actionComponents = {
        setCatBudget: <SetCategoryBudget username={username} profileName={profileName} category={chosenCategory} showConfirm={handleActionClose} refreshExpenses={refreshExpenses} />,
        addItem: <AddItem username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} showConfirm={handleActionClose} />,
        renameCategory: <RenameCategory username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} showConfirm={handleActionClose} />,
        renameBusiness: <RenameBusiness username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} showConfirm={handleActionClose} />,
        moveBusiness: <MoveBusiness username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} showConfirm={handleActionClose} />
    };

    const controlCenterButtons = [
        { action: "setCatBudget", label: "תקציב לקטגוריה", icon: <FaPiggyBank size={16} />, color: "bg-blue-500 hover:bg-blue-700" },
        { action: "addItem", label: "הוסף בעל עסק", icon: <FaPlus size={16} />, color: "bg-green-600 hover:bg-green-700" },
        { action: "renameCategory", label: "שנה שם קטגוריה", icon: <FaEdit size={16} />, color: "bg-blue-500 hover:bg-blue-700" },
        { action: "renameBusiness", label: "שנה שם בעל עסק", icon: <FaEdit size={16} />, color: "bg-blue-500 hover:bg-blue-700" },
        { action: "moveBusiness", label: "העבר בעל עסק", icon: <FaExchangeAlt size={16} />, color: "bg-purple-500 hover:bg-purple-700" }
    ];

    return (
        <div className="relative my-4 md:my-6 grid h-auto overflow-y-auto border-1 rounded-md bg-gradient-to-b from-blue-50 to-blue-100 p-4 md:p-6 shadow-lg">
            <div>
                <h2 className="text-lg md:text-xl font-semibold text-center text-blue-700 mb-3 md:mb-4">בחר קטגוריה</h2>
                <div key={categoryKey} className="bg-white rounded-lg p-4 shadow-sm">
                    <GetCategories username={username} profileName={profileName} onCategoryClick={onCategoryClick} forAccount={false} />
                </div>
                <div className="grid gap-3 md:gap-4 mt-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`${buttonBaseClasses} bg-green-500 hover:bg-green-700`}
                        onClick={() => setShowAddCategory(true)}
                    >
                        <FaPlus size={14} className="md:size-4" /> הוסף קטגוריה
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`${buttonBaseClasses} bg-yellow-500 hover:bg-yellow-700`}
                        onClick={() => setShowSetBudget(true)}
                    >
                        <FaPiggyBank size={14} className="md:size-4" /> הגדר תקציב פרופיל
                    </motion.button>
                </div>
            </div>

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
                            {controlCenterButtons.map(button => (
                                <motion.button
                                    key={button.action}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`${buttonBaseClasses} ${button.color}`}
                                    onClick={() => setShowAction(button.action)}
                                >
                                    {button.icon}
                                    <span className="font-medium">{button.label}</span>
                                </motion.button>
                            ))}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`${buttonBaseClasses} bg-red-600 hover:bg-red-700`}
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
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4"
                >
                    {actionComponents[showAction]}
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
                            onClose={handleAddCategoryClose}
                        />
                    </div>
                </motion.div>
            )}

            {showSetBudget && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md px-4 z-50"
                >
                    <SetProfBudget
                        username={username}
                        profileName={profileName}
                        refreshExpenses={refreshExpenses}
                        showConfirm={setShowSetBudget}
                    />
                </motion.div>
            )}

            {showDeleteConfirm && (
                <DeleteCategory
                    username={username}
                    profileName={profileName}
                    chosenCategory={chosenCategory}
                    setShowDeleteConfirm={setShowDeleteConfirm}
                />
            )}
        </div>
    );
}