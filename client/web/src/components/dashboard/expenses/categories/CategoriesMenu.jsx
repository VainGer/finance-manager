import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import Button from '../../../common/Button';
import AddCategory from './AddCategory';
import RenameCategory from './RenameCategory';
import DeleteCategory from './DeleteCategory';

export default function CategoriesMenu({ goBack }) {
    const { profile } = useAuth();
    const [menuToggler, setMenuToggler] = useState({
        addCategory: false,
        renameCategory: false,
        deleteCategory: false,
    });

    // Close all open panels
    const closeAllPanels = () => {
        setMenuToggler({
            addCategory: false,
            renameCategory: false,
            deleteCategory: false,
        });
    };

    const handleMenuClick = (menuItem) => {
        setMenuToggler(prevState => ({
            ...{ addCategory: false, renameCategory: false, deleteCategory: false}, // Reset all
            [menuItem]: !prevState[menuItem] // Toggle the clicked one
        }));
    };

    // Check if any panel is currently open
    const isPanelOpen = menuToggler.addCategory || menuToggler.renameCategory || menuToggler.deleteCategory;

    return (
        <div className="p-6 bg-white/95 backdrop-blur-sm">
            {isPanelOpen ? (
                <div className="space-y-6">
                    <button
                        onClick={closeAllPanels}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors mb-4 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        חזרה לתפריט
                    </button>

                    {menuToggler.addCategory && <AddCategory goBack={closeAllPanels} />}
                    {menuToggler.renameCategory && <RenameCategory goBack={closeAllPanels} />}
                    {menuToggler.deleteCategory && <DeleteCategory goBack={closeAllPanels} />}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => handleMenuClick('addCategory')}
                            className="group flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-md"
                        >
                            <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div className="text-right flex-1">
                                <h4 className="font-semibold text-slate-800">הוספת קטגוריה</h4>
                                <p className="text-sm text-slate-600">הוסף קטגוריה חדשה למערכת</p>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={() => handleMenuClick('renameCategory')}
                            className="group flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-md"
                        >
                            <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div className="text-right flex-1">
                                <h4 className="font-semibold text-slate-800">שינוי שם קטגוריה</h4>
                                <p className="text-sm text-slate-600">ערוך שם של קטגוריה קיימת</p>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={() => handleMenuClick('deleteCategory')}
                            className="group flex items-center gap-4 p-4 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl transition-all duration-200 hover:shadow-md"
                        >
                            <div className="w-10 h-10 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <div className="text-right flex-1">
                                <h4 className="font-semibold text-slate-800 group-hover:text-red-700">מחיקת קטגוריה</h4>
                                <p className="text-sm text-slate-600 group-hover:text-red-600">הסר קטגוריה מהמערכת</p>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={goBack}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                            ביטול
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}