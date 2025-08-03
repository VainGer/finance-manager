import { useState, useEffect } from 'react';
import { get } from '../../../../utils/api';

export default function BusinessSelect({ refId, category, setSelectedBusiness }) {

    const [error, setError] = useState(null);
    const [businesses, setBusinesses] = useState([]);

    useEffect(() => {
        const fetchBusinesses = async () => {

            const response = await get(`expenses/business/get-businesses/${refId}/${category}`);
            if (response.ok) {
                setBusinesses(response.businesses || []);
            } else {
                setError('אירעה שגיאה בעת טעינת העסקים');
            }

        };

        fetchBusinesses();
    }, [refId, category]);

    return (
        <div>
            {error && <p>{error}</p>}
            <select onChange={e => setSelectedBusiness(e.target.value)}>
                <option value="">בחר עסק</option>
                {businesses.length > 0 ? businesses.map((business, index) => (
                    <option key={index} value={business}>{business}</option>
                )) : (
                    <option disabled>לא נמצאו עסקים</option>
                )}
            </select>
        </div>
    );
}