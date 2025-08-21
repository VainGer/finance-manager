import { useState } from "react"
import CreateBusiness from "./CreateBusiness";
import DeleteBusiness from "./DeleteBusiness";
import RenameBusiness from "./RenameBusiness";
import Button from "../../../common/Button";

export default function BusinessMenu({ goBack }) {

    const [menuToggler, setMenuToggler] = useState({
        createBusiness: false,
        renameBusiness: false,
        deleteBusiness: false,
    });

    const handleMenuClick = (menuItem) => {
        setMenuToggler(prevState => ({
            createBusiness: false,
            renameBusiness: false,
            deleteBusiness: false,
            [menuItem]: !prevState[menuItem],
        }));
    };

    const isPanelOpen = menuToggler.createBusiness || menuToggler.renameBusiness || menuToggler.deleteBusiness;

    return (
        <div className="p-6 bg-white/95 backdrop-blur-sm" dir="rtl">
            {!isPanelOpen && (
                <div className="mb-6 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-slate-600 rounded-full flex items-center justify-center">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 00-8 0v4a4 4 0 008 0V7zm-4 8v2m0 4h.01" />
                        </svg>
                    </div>
                    <div className="text-right">
                        <h3 className="text-xl font-bold text-slate-800">ניהול בעלי עסקים</h3>
                        <p className="text-sm text-slate-600">הוסף, ערוך או מחק בעל עסק בפרופיל שלך</p>
                    </div>
                </div>
            )}
            {
                isPanelOpen ? (
                    <>
                        {menuToggler.createBusiness && <CreateBusiness goBack={() => handleMenuClick(null)} />}
                        {menuToggler.renameBusiness && <RenameBusiness goBack={() => handleMenuClick(null)} />}
                        {menuToggler.deleteBusiness && <DeleteBusiness goBack={() => handleMenuClick(null)} />}
                    </>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            <button 
                                onClick={() => handleMenuClick('createBusiness')} 
                                className="group flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-md"
                            >
                                <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <div className="text-right flex-1">
                                    <h4 className="font-semibold text-slate-800">הוספת בעל עסק</h4>
                                    <p className="text-sm text-slate-600">הוסף בעל עסק חדש למערכת</p>
                                </div>
                                <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                            </button>

                            <button 
                                onClick={() => handleMenuClick('renameBusiness')} 
                                className="group flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-md"
                            >
                                <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <div className="text-right flex-1">
                                    <h4 className="font-semibold text-slate-800">עריכת שם בעל עסק</h4>
                                    <p className="text-sm text-slate-600">שנה שם של בעל עסק קיים</p>
                                </div>
                                <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                            </button>

                            <button 
                                onClick={() => handleMenuClick('deleteBusiness')} 
                                className="group flex items-center gap-4 p-4 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl transition-all duration-200 hover:shadow-md"
                            >
                                <svg className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <div className="text-right flex-1">
                                    <h4 className="font-semibold text-slate-800 group-hover:text-red-700">מחיקת בעל עסק</h4>
                                    <p className="text-sm text-slate-600 group-hover:text-red-600">הסר בעל עסק מהמערכת</p>
                                </div>
                                <div className="w-10 h-10 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors">
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                            </button>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={goBack}
                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors text-center"
                            >
                                ביטול
                            </button>
                        </div>
                    </div>
                )}
        </div>
    )
}