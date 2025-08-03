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
                <p className="text-sm text-center text-red-600 bg-red-100 border border-red-400 rounded-md py-2 px-4 mb-2">
                    {error}
                </p>
            )}
            
            <div className="relative">
                {loading && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}
                
                <select 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-full px-4 py-2 pr-8 text-right bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                    disabled={loading || categories.length === 0}
                >
                    <option value="">בחר קטגוריה</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                
                <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
            
            {!loading && categories.length === 0 && !error && (
                <p className="text-sm text-gray-500 mt-1 text-center">
                    לא נמצאו קטגוריות
                </p>
            )}
        </div>
    );

}