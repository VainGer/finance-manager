import { useState } from "react"
import CreateBusiness from "./CreateBusiness";
import DeleteBusiness from "./DeleteBusiness";
import RenameBusiness from "./RenameBusiness";
import { menu } from "framer-motion/client";

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
                    <ul>
                        <li><button onClick={() => handleMenuClick('createBusiness')}>הוספת בעל עסק</button></li>
                        <li><button onClick={() => handleMenuClick('renameBusiness')}>עריכת שם בעל עסק</button></li>
                        <li><button onClick={() => handleMenuClick('deleteBusiness')}>מחיקת בעל עסק</button></li>
                        <li><button
                            onClick={goBack}
                        >חזרה</button></li>
                    </ul>
                )}
        </div>
    )
}