import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessMenu from '../expenses/businesses/BusinessMenu';
import CategoriesMenu from '../expenses/categories/CategoriesMenu';
import AddTransaction from '../expenses/transactions/AddTransaction';
import CreateProfileBudget from '../budget/CreateProfileBudget';
import Button from '../../common/Button';


const MenuItem = ({ onClick, children }) => (
    <li>
        <Button
            onClick={onClick}
            style="side-menu"
            size="auto"
            className="w-full text-right"
        >
            {children}
        </Button>
    </li>
);

export default function SideMenu({ onTransactionAdded }) {

    const navigate = useNavigate();

    const [menuToggler, setMenuToggler] = useState({
        addExpense: false,
        businesses: false,
        categories: false,
        createBudget: false,
    });

    const closeAllPanels = () => {
        setMenuToggler({
            addExpense: false,
            businesses: false,
            categories: false,
            createBudget: false,
        });
    };

    const handleMenuClick = (menuItem) => {
        setMenuToggler(prevState => ({
            addExpense: false,
            businesses: false,
            categories: false,
            createBudget: false,
            [menuItem]: !prevState[menuItem],
        }));
    };

    const isPanelOpen = menuToggler.addExpense || menuToggler.businesses || menuToggler.categories || menuToggler.createBudget;

    return (
        <div className="w-full max-w-xs p-4 bg-white rounded-lg shadow-md">
            {isPanelOpen ? (
                <div className="fixed inset-0 bg-gray-600/80 overflow-y-auto h-full w-full flex justify-center items-center">
                    {menuToggler.businesses && <BusinessMenu goBack={closeAllPanels} />}
                    {menuToggler.categories && <CategoriesMenu goBack={closeAllPanels} />}
                    {menuToggler.addExpense && <AddTransaction goBack={closeAllPanels} onTransactionAdded={onTransactionAdded} />}
                    {menuToggler.createBudget && <CreateProfileBudget goBack={closeAllPanels} />}
                </div>
            ) : (
                <>
                    <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">תפריט ראשי</h3>
                    <ul className="space-y-2">
                        <MenuItem onClick={() => handleMenuClick('addExpense')}>
                            <span className="ml-2">➕</span> הוספת הוצאה
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuClick('createBudget')}>
                            <span className="ml-2">💰</span> יצירת תקציב
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuClick('businesses')}>
                            <span className="ml-2">🏢</span> בעלי עסקים
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuClick('categories')}>
                            <span className="ml-2">📂</span> קטגוריות
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/profile-settings')}>
                            <span className="ml-2">⚙️</span> הגדרות
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/u')}>
                            <span className="ml-2">📤</span> העלאת עסקאות מקובץ
                        </MenuItem>
                    </ul>
                </>
            )}
        </div>
    );
}