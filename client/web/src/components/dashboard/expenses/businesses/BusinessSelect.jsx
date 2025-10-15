import { useState, useEffect } from 'react';
import { get } from '../../../../utils/api';

export default function BusinessSelect({ refId, category, setSelectedBusiness }) {

    const [error, setError] = useState(null);
    const [businesses, setBusinesses] = useState([]);

    useEffect(() => {
        const fetchBusinesses = async () => {
            const response = await get(`expenses/business/get-businesses/${refId}/${encodeURIComponent(category)}`);
            if (response.ok) {
                setBusinesses(response.businesses || []);
            } else {
                setError('אירעה שגיאה בעת טעינת העסקים');
            }
        };

        fetchBusinesses();
    }, [refId, category]);

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
                <select
                    onChange={e => setSelectedBusiness(e.target.value)}
                    className="w-full px-4 py-3 pr-10 bg-white border border-slate-200 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none font-medium text-slate-800"
                >
                    <option value="" className="text-slate-500">בחר עסק</option>
                    {businesses.length > 0 ? businesses.map((business, index) => (
                        <option key={index} value={business} className="text-slate-800">{business}</option>
                    )) : (
                        <option disabled className="text-slate-400">לא נמצאו עסקים</option>
                    )}
                </select>

                <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}