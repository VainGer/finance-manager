import { useState } from "react"
import { useAuth } from "../../../../context/AuthContext";
import {del} from "../../../../utils/api";
import BusinessSelect from "./BusinessSelect";
import CategorySelect from "../categories/CategorySelect";


export default function DeleteBusiness({ goBack }) {
    const { profile } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const deleteBusiness = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!selectedCategory) {
            setError('אנא בחר קטגוריה');
            return;
        }
        if (!selectedBusiness) {
            setError('אנא בחר עסק');
            return;
        }

        const response = await del(`expenses/business/delete/${profile.expenses}/${selectedCategory}/${selectedBusiness}`);
        if (response.ok) {
            setSuccess('העסק נמחק בהצלחה');
            setTimeout(() => {
                goBack();
            }, 1500);
        }else{
            setError('אירעה שגיאה בעת מחיקת העסק, נסה שוב מאוחר יותר');
            console.error('Error deleting business:', response.error);
        }
    }
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <CategorySelect refId={profile.expenses} setSelectedCategory={setSelectedCategory} />
            {selectedCategory && <BusinessSelect refId={profile.expenses} category={selectedCategory} setSelectedBusiness={setSelectedBusiness} />}
            {selectedBusiness && (
                <div className="grid gap-4">
                    <p className="text-sm text-gray-600 mb-4">
                        אתה בטוח שברצונך למחוק את העסק "{selectedBusiness}"?
                    </p>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        onClick={deleteBusiness}
                    >
                        מחק עסק
                    </button>
                </div>
            )}
            <button onClick={goBack}>חזרה</button>
        </div>
    )
}