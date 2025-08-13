import { useState } from "react"
import CreateBusiness from "./CreateBusiness";
import DeleteBusiness from "./DeleteBusiness";
import RenameBusiness from "./RenameBusiness";
import { menu } from "framer-motion/client";
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
        <div>
            {
                isPanelOpen ? (
                    <>
                        {menuToggler.createBusiness && <CreateBusiness goBack={() => handleMenuClick(null)} />}
                        {menuToggler.renameBusiness && <RenameBusiness goBack={() => handleMenuClick(null)} />}
                        {menuToggler.deleteBusiness && <DeleteBusiness goBack={() => handleMenuClick(null)} />}
                    </>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
                        <h3 className="text-lg font-semibold mb-4 text-center">ניהול בעלי עסקים</h3>
                        <div className="space-y-3">
                            <Button onClick={() => handleMenuClick('createBusiness')} style="success" size="medium">
                                ➕ הוספת בעל עסק
                            </Button>
                            <Button onClick={() => handleMenuClick('renameBusiness')} style="primary" size="medium">
                                ✏️ עריכת שם בעל עסק
                            </Button>
                            <Button onClick={() => handleMenuClick('deleteBusiness')} style="danger" size="medium">
                                🗑️ מחיקת בעל עסק
                            </Button>
                            <Button onClick={goBack} style="secondary" size="medium">
                                ← חזרה
                            </Button>
                        </div>
                    </div>
                )}
        </div>
    )
}