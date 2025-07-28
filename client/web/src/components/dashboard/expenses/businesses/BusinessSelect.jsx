import { useState, useEffect } from 'react';
import { get } from '../../../../utils/api';

export default function BusinessSelect({ refId, category, setSelectedBusiness }) {

    const [error, setError] = useState(null);
    const [businesses, setBusinesses] = useState([]);

    useEffect(() => {
        const fetchBusinesses = async () => {

            const response = await get(`expenses/businesses/${refId}/${category}`);
            if (response.ok) {
                setBusinesses(response.businessNames || []);
            } else if (response.status === 404) {
                setError('לא נמצאו עסקים בקטגוריה זו');
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
                {businesses.map((business, index) => (
                    <option key={index} value={business}>{business}</option>
                ))}
            </select>
        </div>
    );
}