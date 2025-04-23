import { useState, useEffect } from 'react';
import { getBusinessNames } from '../../API/business';


export default function BusinessToSelect({ username, profileName, category, onSelectedOpt }) {
    const [businesses, setBusinesses] = useState([]);

    useEffect(() => {

        async function fetchCategories() {
            const response = await getBusinessNames(username, profileName, category);
            if (response.status === 200) {
                setBusinesses(response.businessNames);
            } else {
                console.error('Error fetching categories:', response.message);
            }
        }
        fetchCategories();
    }, [username, profileName, category]);

    return (
        <div className='w-full'>
            <select className='w-full' onChange={(e) => onSelectedOpt(e.target.value)}>
                <option className='text-center' selected disabled>בחר בעל עסק</option>
                {businesses.length > 0 ? (
                    businesses.map((item, index) => (
                        <option className='text-center' key={index} value={item}>{item}</option>
                    ))
                ) : (
                    <option value="" disabled>אין פריטים להצגה</option>
                )}
            </select>
        </div>
    );
}