import { useState, useEffect } from 'react';
import { get } from "../../../../utils/api";

export default function CategorySelect({ refId, setSelectedCategory }) {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            const response = await get(`expenses/category/get-names/${refId}`);

            if (response.ok) {
                setCategories(response.categoriesNames || []);
                setError(null);
            } else {
                setError(response.error || 'אירעה שגיאה בעת טעינת הקטגוריות, נסה שוב מאוחר יותר');
                console.error('Error fetching categories:', response.error);
            }

            setLoading(false);
        };

        if (refId) {
            fetchCategories();
        }
    }, [refId]);

    return (
        <div className="w-full">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
            )}

            <div className="relative">
                {loading && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                    </div>
                )}

                <select
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 pr-10 bg-white border border-slate-200 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none font-medium text-slate-800"
                    disabled={loading || categories.length === 0}
                >
                    <option value="" className="text-slate-500">בחר קטגוריה</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category} className="text-slate-800">
                            {category}
                        </option>
                    ))}
                </select>

                <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {!loading && categories.length === 0 && !error && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                    <p className="text-slate-500 text-sm font-medium">לא נמצאו קטגוריות</p>
                </div>
            )}
        </div>
    );

}