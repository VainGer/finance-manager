import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessMenu from './expenses/businesses/BusinessMenu';
import CategoriesMenu from './expenses/categories/CategoriesMenu';
import AddTransaction from './expenses/transactions/AddTransaction';

// A helper component for menu items to reduce repetition
const MenuItem = ({ onClick, children }) => (
    <li>
        <button
            onClick={onClick}
            className="w-full flex items-center text-right py-2 px-4 rounded-md text-gray-700 bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
        >
            {children}
        </button>
    </li>
);

export default function SideMenu() {
    const navigate = useNavigate();

    const [menuToggler, setMenuToggler] = useState({
        addExpense: false,
        businesses: false,
        categories: false,
    });

    const closeAllPanels = () => {
        setMenuToggler({
            addExpense: false,
            businesses: false,
            categories: false,
        });
    };

    const handleMenuClick = (menuItem) => {
        setMenuToggler(prevState => ({
            addExpense: false,
            businesses: false,
            categories: false,
            [menuItem]: !prevState[menuItem],
        }));
    };

    // Check if any panel is currently open
    const isPanelOpen = menuToggler.addExpense || menuToggler.transactions || menuToggler.businesses || menuToggler.categories;

    return (
        <div className="w-full max-w-xs p-4 bg-white rounded-lg shadow-md">
            {isPanelOpen ? (
                <div>
                    {menuToggler.businesses && <BusinessMenu goBack={closeAllPanels} />}
                    {menuToggler.categories && <CategoriesMenu goBack={closeAllPanels} />}
                </div>
            ) : (
                <>
                    <h3 className="text-lg font-semibold text-center text-gray-800 mb-4">תפריט ראשי</h3>
                    <ul className="space-y-2">
                        <MenuItem onClick={() => handleMenuClick('addExpense')}>
                            <span className="ml-2">➕</span> הוספת הוצאה
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuClick('businesses')}>
                            <span className="ml-2">🏢</span> בעלי עסקים
                        </MenuItem>
                        <MenuItem onClick={() => handleMenuClick('categories')}>
                            <span className="ml-2">📂</span> קטגוריות
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/settings')}>
                            <span className="ml-2">⚙️</span> הגדרות
                        </MenuItem>
                    </ul>
                </>
            )}
        </div>
    );
}