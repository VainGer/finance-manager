import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessMenu from '../expenses/businesses/BusinessMenu';
import CategoriesMenu from '../expenses/categories/CategoriesMenu';
import AddTransaction from '../expenses/transactions/AddTransaction';
import CreateProfileBudget from '../budget/CreateProfileBudget';
import BudgetManagementMenu from '../budget/BudgetManagementMenu';
import QuickActionCard from '../QuickActionCard';
import CenteredModal from '../../common/CenteredModal';

export default function SideMenu({
    onTransactionAdded,
    showFloatingMenu,
    setShowFloatingMenu,
    isFloatingMode = false
}) {
    const navigate = useNavigate();

    const [menuToggler, setMenuToggler] = useState({
        addExpense: false,
        businesses: false,
        categories: false,
        budgetManagement: false,
    });

    const closeAllPanels = () => {
        setMenuToggler({
            addExpense: false,
            businesses: false,
            categories: false,
            budgetManagement: false,
        });
        if (setShowFloatingMenu) {
            setShowFloatingMenu(false);
        }
    };

    const handleMenuClick = (menuItem) => {
        setMenuToggler(prevState => ({
            addExpense: false,
            businesses: false,
            categories: false,
            budgetManagement: false,
            [menuItem]: !prevState[menuItem],
        }));
        if (setShowFloatingMenu) {
            setShowFloatingMenu(false);
        }
    };

    const isPanelOpen = menuToggler.addExpense || menuToggler.businesses || menuToggler.categories || menuToggler.budgetManagement;

    const quickActions = [
        {
            title: 'הוספת הוצאה',
            description: 'הוסף עסקה חדשה',
            priority: 'normal',
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            ),
            onClick: () => handleMenuClick('addExpense')
        },
        {
            title: ' תקציבים',
            description: 'ניהול תקציבים',
            priority: 'normal',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            ),
            onClick: () => handleMenuClick('budgetManagement')
        },
        {
            title: 'בעלי עסקים',
            description: 'נהל ספקים ועסקים',
            priority: 'normal',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4m9 0v-2.5A2.5 2.5 0 0118.5 16h-13A2.5 2.5 0 003 18.5V21" />
                </svg>
            ),
            onClick: () => handleMenuClick('businesses')
        },
        {
            title: 'קטגוריות',
            description: 'ארגן הוצאות לפי קטגוריות',
            priority: 'normal',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
            onClick: () => handleMenuClick('categories')
        },
        {
            title: 'הגדרות פרופיל',
            description: 'עדכן פרטים אישיים',
            priority: 'normal',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            onClick: () => navigate('/settings')
        },
        {
            title: 'העלאת קובץ',
            description: 'יבוא עסקאות מקובץ',
            priority: 'normal',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
            ),
            onClick: () => navigate('/upload-from-file')
        }
    ];

    return (
        <>
            {/* Floating Quick Actions Menu for Mobile/Tablet - Only when explicitly shown */}
            {isFloatingMode && showFloatingMenu && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm xl:hidden"
                        onClick={() => setShowFloatingMenu && setShowFloatingMenu(false)}
                    />

                    {/* Menu Items Container */}
                    <div className="fixed left-4 bottom-20 z-[95] xl:hidden">
                        <div className="space-y-2 w-72 max-h-[60vh] overflow-y-auto">
                            {quickActions.map((action, index) => (
                                <div
                                    key={index}
                                    className="transform translate-x-0 animate-in slide-in-from-left duration-300"
                                    style={{ animationDelay: `${index * 80}ms` }}
                                >
                                    <QuickActionCard
                                        title={action.title}
                                        description={action.description}
                                        icon={action.icon}
                                        priority={action.priority}
                                        onClick={() => {
                                            action.onClick();
                                            setShowFloatingMenu && setShowFloatingMenu(false);
                                        }}
                                        className="mobile-optimized"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Desktop Side Menu - Only when NOT in floating mode */}
            {!isFloatingMode && (
                <div className="space-y-3">
                    {quickActions.map((action, index) => (
                        <QuickActionCard
                            key={index}
                            title={action.title}
                            description={action.description}
                            icon={action.icon}
                            priority={action.priority}
                            onClick={action.onClick}
                        />
                    ))}
                </div>
            )}

            {/* Modal for both mobile and desktop */}
            {isPanelOpen && (
                <CenteredModal onClose={closeAllPanels}>
                    <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl w-full max-w-sm sm:max-w-2xl lg:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col mx-4 sm:mx-0">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4 sm:p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        {menuToggler.addExpense && (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        )}
                                        {menuToggler.createBudget && (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        )}
                                        {menuToggler.businesses && (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4m9 0v-2.5A2.5 2.5 0 0018.5 16h-13A2.5 2.5 0 003 18.5V21" />
                                            </svg>
                                        )}
                                        {menuToggler.categories && (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="text-right min-w-0 flex-1" dir="rtl">
                                        <h2 className="text-lg sm:text-xl font-bold truncate">
                                            {menuToggler.addExpense && 'הוספת עסקה חדשה'}
                                            {menuToggler.budgetManagement && 'ניהול תקציבים'}
                                            {menuToggler.businesses && 'ניהול בעלי עסקים'}
                                            {menuToggler.categories && 'ניהול קטגוריות'}
                                        </h2>
                                        <p className="text-white/80 text-xs sm:text-sm truncate">
                                            {menuToggler.addExpense && 'הוסף הוצאה או הכנסה לפרופיל'}
                                            {menuToggler.budgetManagement && 'יצור, ערוך ומחק תקציבים'}
                                            {menuToggler.businesses && 'נהל ספקים ועסקים'}
                                            {menuToggler.categories && 'ארגן הוצאות לפי קטגוריות'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeAllPanels}
                                    className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 flex-shrink-0 ml-2"
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto">
                            {menuToggler.businesses && <BusinessMenu goBack={closeAllPanels} />}
                            {menuToggler.categories && <CategoriesMenu goBack={closeAllPanels} />}
                            {menuToggler.addExpense && (
                                <AddTransaction goBack={closeAllPanels} onTransactionAdded={onTransactionAdded} />
                            )}
                            {menuToggler.budgetManagement && <BudgetManagementMenu goBack={closeAllPanels} />}
                        </div>
                    </div>
                </CenteredModal>
            )}
        </>
    );
}