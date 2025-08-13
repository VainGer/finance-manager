import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import Button from '../../../common/Button';
import AddCategory from './AddCategory';
import RenameCategory from './RenameCategory';
import DeleteCategory from './DeleteCategory';
import CreateBudget from './CreateBudget';

export default function CategoriesMenu({ goBack }) {
    const { profile } = useAuth();
    const [menuToggler, setMenuToggler] = useState({
        addCategory: false,
        renameCategory: false,
        deleteCategory: false,
        createBudget: false,
    });

    // Close all open panels
    const closeAllPanels = () => {
        setMenuToggler({
            addCategory: false,
            renameCategory: false,
            deleteCategory: false,
            createBudget: false,
        });
    };

    const handleMenuClick = (menuItem) => {
        setMenuToggler(prevState => ({
            ...{ addCategory: false, renameCategory: false, deleteCategory: false, createBudget: false }, // Reset all
            [menuItem]: !prevState[menuItem] // Toggle the clicked one
        }));
    };

    // Check if any panel is currently open
    const isPanelOpen = menuToggler.addCategory || menuToggler.renameCategory || menuToggler.deleteCategory || menuToggler.createBudget;

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            {isPanelOpen ? (
                <div className="p-6 bg-white rounded-xl shadow-lg w-full max-w-md mx-auto border border-gray-100">
                    <Button
                        onClick={closeAllPanels}
                        style="link"
                        className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center mb-4"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        חזרה לתפריט
                    </Button>

                    {menuToggler.addCategory && <AddCategory goBack={closeAllPanels} />}
                    {menuToggler.renameCategory && <RenameCategory goBack={closeAllPanels} />}
                    {menuToggler.deleteCategory && <DeleteCategory goBack={closeAllPanels} />}
                    {menuToggler.createBudget && <CreateBudget goBack={closeAllPanels} />}
                </div>
            ) : (
                <div className="p-6 bg-white rounded-xl shadow-lg w-full max-w-md mx-auto border border-gray-100">
                    <div className="text-center mb-6">
                        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">ניהול קטגוריות</h3>
                        <p className="text-sm text-gray-600 mt-1">נהל את הקטגוריות והתקציבים שלך</p>
                    </div>
                    
                    <div className="space-y-3">
                        <Button
                            onClick={() => handleMenuClick('addCategory')}
                            size="medium"
                            style="success"
                            className="flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            הוספת קטגוריה
                        </Button>

                        <Button
                            onClick={() => handleMenuClick('renameCategory')}
                            size="medium"
                            style="primary"
                            className="flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            שינוי שם קטגוריה
                        </Button>

                        <Button
                            onClick={() => handleMenuClick('deleteCategory')}
                            size="medium"
                            style="danger"
                            className="flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            מחיקת קטגוריה
                        </Button>

                        {!profile.parentProfile && (
                            <Button
                                onClick={() => handleMenuClick('createBudget')}
                                size="medium"
                                style="warning"
                                className="flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                יצירת תקציב
                            </Button>
                        )}
                        
                        <div className="border-t border-gray-200 pt-4 mt-6">
                            <Button
                                onClick={goBack}
                                size="medium"
                                style="secondary"
                                className="flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                חזרה
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}