import { useState, useEffect } from "react"
import { useAuth } from '../../../../context/AuthContext';
import { put } from "../../../../utils/api";
import BusinessSelect from "./BusinessSelect";
import CategorySelect from "../categories/CategorySelect";
import { div } from "framer-motion/client";

export default function RenameBusiness({ goBack }) {
    const { profile } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [newBusinessName, setNewBusinessName] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const renameBusiness = async (e) => {
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
        if (!newBusinessName || newBusinessName.trim() === '') {
            setError('אנא הזן שם חדש לעסק');
            return;
        }

        const response = await put('expenses/rename-business', {
            refId: profile.expenses,
            catName: selectedCategory,
            oldName: selectedBusiness,
            newName: newBusinessName.trim()
        });
        if(response.ok){
            setSuccess('העסק שונה בהצלחה');
            setTimeout(() => {
                goBack();
            }, 1500);
        }else if(response.status === 409){
            setError('שם העסק כבר קיים בקטגוריה זו');
        }else{
            setError('אירעה שגיאה');
            console.error('Error renaming business:', response.error);
        }
    }

    return (
        <form className="p-4" onSubmit={renameBusiness}>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">שנה בעל עסק</h2>
            <CategorySelect refId={profile.expenses} setSelectedCategory={setSelectedCategory} />
            {selectedCategory && <BusinessSelect refId={profile.expenses} category={selectedCategory} setSelectedBusiness={setSelectedBusiness} />}
            {selectedBusiness && <div className="grid">
                <input type="text" name="newBusinessName" placeholder="שם עסק חדש" onChange={e => setNewBusinessName(e.target.value)} />
                <input type="submit" value="שנה שם" />
            </div>}
            <button
                onClick={goBack}
                className="w-full mt-4 py-2 px-4 font-semibold text-white bg-gray-500 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
                ביטול
            </button>
        </form>
    )
}